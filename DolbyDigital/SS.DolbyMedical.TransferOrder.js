/**
* @fileOverview
* @name
* @author Eli
* 02-15-2013
* @version 1.0
* DolbyMedical :
*/

var DolbyMedical;
if (!DolbyMedical) DolbyMedical = {};

DolbyMedical.beforeLoad = function(type, form, request){
}

DolbyMedical.beforeSubmit = function(type){
}

DolbyMedical.afterSubmit = function(type){
}

var CustomForm = function(){
	this.DM_TRANSFER_ORDER = '127';
}



/**
* @param arr Array of Transfer Order Fields
* @param i Int sequence in Array
* @param items Item array
*/
var createTransferOrder = function(arr, i, items){

	var create = nlapiCreateRecord('transferorder');
	create.setFieldValue('customform', customForm); //*
	create.setFieldValue('trandate', arr[i].trandate); //*
	create.setFieldValue('location', arr[i].location);
	create.setFieldValue('transferlocation', arr[i].transferlocation); //*
	create.setFieldValue('orderstatus', arr[i].orderstatus);
	create.setFieldValue('employee', arr[i].employee);
	create.setFieldValue('department', arr[i].department);
	create.setFieldValue('class', arr[i].saleschannel);

	//Create Item Line
	if(!isBlank(items))
	{
		var z = 0;

		for(var a = 0; a < item.length; a++)
		{
			var itemId = [a].toString();
			var itemQty = items[a];

			if(!isBlank(itemId) && !isBlank(itemQty))
			{
				//var basePrice = getBasePrice(itemId);

				var temp = parseInt(z) + 1;
				create.insertLineItem('item', temp);
				create.setLineItemValue('item', 'item', temp, itemId);
				create.setLineItemValue('item', 'quantity', temp, itemQty);
			}
		}
	}

	//Submit
	var id = nlapiSubmitRecord(create, true);

}

/**
* Get Flagged Location
*/
var locationList = function(){

	var location = [];
	var filters =
	[
		new nlobjSearchFilter('isinactive', null, 'is', 'F'),
		new nlobjSearchFilter('custrecord_location_transfer_order', null, 'is', 'T')
	];

	var s = nlapiSearchRecord('location',null, filters, null);
	
	for(var a = 0; a < s.length; a++){
		var id = s[a].getId();
		location.push(id);
	}
	return location;
}

var SalesChannel = function(){
	this.SALES = '1';
	this.FINANCE_OPERATIONS = '2';
	this.NEW_CONTRACTS = '3';
	this.CONTRACT_RENEWALS = '4';
	this.NP_AWARD = '5';
}

var OrderStatus = function(){
	this.PENDING_APPROVAL = '1';
	this.PENDING_FULFILLMENT = '2';
}

function isBlank(test){ if ( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32)  ){return true}else{return false}}
