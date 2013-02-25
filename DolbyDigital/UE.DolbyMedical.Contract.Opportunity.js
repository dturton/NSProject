/**
* @fileOverview
* @name
* @author Eli
* 02-12-2013
* @version 1.0
* DolbyMedical :
*/

var DolbyMedical;
if (!DolbyMedical) DolbyMedical = {};

DolbyMedical.beforeLoad = function(type, form, request){

	if(type == 'view' || type == 'edit'){
		var status = nlapiGetFieldValue('entitystatus');
		var oppLink = nlapiGetFieldValue('custentity_contract_opp_link');
		if(status != '1' && oppLink == null) //Not yet Closed show button
		{
			form.setScript('customscript_dolby_medical_client');
			form.addButton('custpage_create_opp', 'Create Opportunity', 'createOpp'); //add create opportunity button
		}
	}
}

var createOpp = function(){

	var recordId = nlapiGetFieldValue('id');
	var recordType = nlapiGetRecordType();
	var contractRecord = nlapiLoadRecord(recordType, recordId);

	if(!isBlank(contractRecord))
	{
		var main = [];
		main.push
		(
			{
				title : contractRecord.getFieldValue('entityid'), //Title
				parent : contractRecord.getFieldValue('parent'), //Customer
				contractDuration : contractRecord.getFieldValue('custentity_contractduration'), //Contract Duration
				actualEnddate : contractRecord.getFieldValue('enddate'), //Actual End Date
				directDebit : contractRecord.getFieldValue('custentity_directdebit'), //Direct Debit
				department : contractRecord.getFieldValue('custentity_department'), //Department - must not be empty!
				endDate : contractRecord.getFieldValue('custentity_end_date'), //End Date
				startdate : contractRecord.getFieldValue('startdate'), //Start Date
				custom_startdate : contractRecord.getFieldValue('custentity_start_date')
			}
		);

		var itemLines = buildItemLines(recordId);

		if(main != null && itemLines != null)
		{
			//Create Opportunity record

			var _title = main[0].title + ' Contract Renewal';

			//Build Mainline
			var create = nlapiCreateRecord('opportunity');
			create.setFieldValue('customform', '141');
			create.setFieldValue('entity', main[0].parent);
			create.setFieldValue('title', _title);
			create.setFieldValue('department', main[0].department); //Department
			create.setFieldValue('class', '4'); //3. Contract Renewals
			create.setFieldValue('custbody_directdebit', main[0].directDebit);
			create.setFieldValue('custbody_opp_contract_link', recordId); //Link Opportunity
			create.setFieldValue('expectedclosedate', main[0].endDate); //Expected Close Date
			create.setFieldValue('probability', '50.0%');
			create.setFieldValue('createddate', main[0].startdate); //Start Date

			if(!isBlank(main[0].actualEnddate))
			{
				//Contract.Actual End Date +1 Day
				var renewalStartDate = nlapiAddDays(nlapiStringToDate(main[0].actualEnddate), +1);
				var renewalEndDate = nlapiAddMonths(renewalStartDate, 12); //Add 12 Months
				nlapiLogExecution('DEBUG', 'Renewal Start Date: ' + renewalStartDate + ' | Renewal End Date: ' + renewalEndDate);
				create.setFieldValue('custbodyopp_renewal_start_date', nlapiDateToString(renewalStartDate));
				create.setFieldValue('custbody_opp_renewal_end_date', nlapiDateToString(renewalEndDate));
			}
			
			if(!isBlank(main[0].startdate))
			{
				//Contract.Actual End Date +1 Day
				var contractEndDate = nlapiAddDays(nlapiAddMonths(nlapiStringToDate(main[0].startdate), 12), -1); //Add 12 Months
				nlapiLogExecution('DEBUG', 'Contract End Date: ' + contractEndDate);
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custentity_end_date', nlapiDateToString(contractEndDate));				
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'enddate', nlapiDateToString(contractEndDate));
			}			

			//Build Item lines
			if(!isBlank(itemLines))
			{
				var z = 0;

				for(var i in itemLines)
				{
					var itemId = [i].toString();
					var itemQty = itemLines[i];

					if(!isBlank(itemId) && !isBlank(itemQty))
					{
						//var basePrice = getBasePrice(itemId);

						var temp = parseInt(z) + 1;
						create.insertLineItem('item', temp);
						create.setLineItemValue('item', 'item', temp, itemId);
						create.setLineItemValue('item', 'quantity', temp, itemQty);
						create.setLineItemValue('item', 'price', temp, '1'); //Set to Base Price
						create.setLineItemValue('item', 'rate', temp, '0.00');

						nlapiLogExecution('DEBUG', 'Item ID: ' + itemId + ' | Item Qty: ' + itemQty);

					}
				}
			}

			try
			{
				var contractRecord = nlapiSubmitRecord(contractRecord, true);
				var opportunityId = nlapiSubmitRecord(create, {recordmode: 'dynamic'});
				if(!isBlank(opportunityId))
				{
					//Modify End Date of the Contract Record
					nlapiSubmitField(recordType, recordId, 'custentity_contract_opp_link', opportunityId); //Link Contract
					nlapiSubmitField('opportunity', opportunityId, 'salesrep', '6842');
					nlapiLogExecution('DEBUG', 'Opportunity: ', opportunityId);
					timedRefresh(500);
				}
			}
			catch(ex)
			{
				//catch error
				nlapiLogExecution('DEBUG', 'Error', ex.Message);
			}
		}
	}
}

var afterSubmit = function(){
	var formActive = new opportunityForm(); //formActive.DM_OPPORTUNITY_V2
}

var buildItemLines = function(contractId){

	var result = [];

	if(!isBlank(contractId))
	{
		var contractArray = [];
		contractArray[0] = contractId;

		var filters =
		[
			new nlobjSearchFilter('custrecord_citem_contract', null, 'anyof', contractArray)
		];

		var columns =
		[
			new nlobjSearchColumn('custrecord_citem_contractitem') //02.15 - Changed 'custrecord_citem_item' to 'custrecord_citem_contractitem'
		];

		var s = nlapiSearchRecord('customrecord_contractitem',null, filters, columns);

		if(s != null)
		{
			for(var i = 0; i < s.length; i++)
			{
				var cerid = s[i].getId();
				var itemid = s[i].getValue('custrecord_citem_contractitem'); //02.15 - Changed 'custrecord_citem_item' to 'custrecord_citem_contractitem'
				result.push(itemid);
			}
		}

		if(result != null)
		{
			var hist = {};
			hist = result.reduce(function (prev, item) {
			  if(item in prev) prev[item] ++;
			  else prev[item] = 1;
			  return prev;
			},{});
			return hist;
		}
	}

}

/**
* @custom function
*/
var opportunityForm = function(){
	this.DM_OPPORTUNITY_V2 = '141';
}

var getBasePrice = function(itemId){

	var itemType = nlapiLookupField('item', itemId, 'type');
	if(!isBlank(itemType))
	{
		//Get Base Price
		var itemRecType = getItemRecType(itemType);
		var o = nlapiLoadRecord(itemRecType, itemId);
		if(!isBlank(o))
		{
			var basePrice = o.getLineItemValue('price1', 'price_1_', '1');
		}
	}

	return basePrice;
}

function isBlank(test){ if ( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32)  ){return true}else{return false}}


function timedRefresh(timeoutPeriod) {
	setTimeout("location.reload(true);",timeoutPeriod);
}