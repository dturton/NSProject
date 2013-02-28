/**
* @fileOverview
* @name
* @author Eli
* 02-15-2013
* @version 1.0
* DolbyMedical :
* Saved Search : Dolby Medical : Generate Transfer Order
*/

var generate = function(req, res){

	context = nlapiGetContext();
	if (req.getMethod() == 'GET')
	{
		var str = "<html>";
		str += "<head>";
		str += "<title>Create Transfer Order</title>";

		str += "<style type=\"text/css\">";
		str += "table.altrowstable {";
		str += "	font-family: verdana,arial,sans-serif;";
		str += "	font-size:11px;";
		str += "	color:#333333;";
		str += "	border-width: 1px;";
		str += "	border-color: #a9c6c9;";
		str += "	border-collapse: collapse;";
		str += "}";
		str += "table.altrowstable th {";
		str += "	border-width: 1px;";
		str += "	padding: 8px;";
		str += "	border-style: solid;";
		str += "	border-color: #a9c6c9;";
		str += "}";
		str += "table.altrowstable td {";
		str += "	border-width: 1px;";
		str += "	padding: 8px;";
		str += "	border-style: solid;";
		str += "	border-color: #a9c6c9;";
		str += "}";
		str += ".oddrowcolor{";
		str += "	background-color:#D1E2F0;";
		str += "}";
		str += ".evenrowcolor{";
		str += "	background-color:#B3D6F2;";
		str += "}";
		str += "</style>";
		str += "<script type='text/javascript'>";
		str += "function altRows(id){";
		str += "	if(document.getElementsByTagName){  ";
		str += "		var table = document.getElementById(id);";
		str += "		var rows = table.getElementsByTagName('tr');";
		str += "		for(i = 0; i < rows.length; i++){";
		str += "			if(i % 2 == 0){";
		str += "				rows[i].className = 'evenrowcolor';";
		str += "			}else{";
		str += "				rows[i].className = 'oddrowcolor';";
		str += "			}";
		str += "		}";
		str += "	}";
		str += "}";
		str += "window.onload=function(){";
		str += "	altRows('alternatecolor');";
		str += "}";
		str += "</script>";
		str += "</head>";
		str += "<body>";

		var form = nlapiCreateForm('Generate Transfer Order', false);

		//Execute Search
		var arr = [];

		var s = nlapiSearchRecord('item', 'customsearch_dolby_medical_transord');
		if(s != null)
		{
			for(var i = 0; i < s.length; i++)
			{
				var itemId = s[i].getId();
				var locId = s[i].getValue('internalid', 'inventoryLocation');
				var loc = s[i].getValue('name', 'inventoryLocation');
				var itemname = s[i].getValue('itemid');
				var onhand = s[i].getValue('formulanumeric');
				var prefstocklevel = s[i].getValue('locationpreferredstocklevel');

				arr.push
				(
					{
						'locId' : locId,
						'itemId' : itemId,
						'loc' : loc,
						'itemname' : itemname,
						'onhand' : onhand,
						'prefstocklevel' : prefstocklevel
					}
				)
			}
		}

		if(arr != null)
		{
			str += "<img src='https://system.netsuite.com/core/media/media.nl?id=683&c=3562042&h=2c5fceaf606f7e802720' alt='' />";
			str += "<table class=\"altrowstable\" id=\"alternatecolor\">";
			str += "<tr>";
			str += "	<td>Name</td><td>Item</td><td>Qty on Hand</td><td>Preferred<br /> Stock Level</td><td>For Transfer</td><td>Action</td>";
			str += "</tr>";

			var counts = {};

			for(var x in arr)
			{
				var forTransfer = parseInt(arr[x].prefstocklevel) - parseInt(arr[x].onhand);

				str += "<tr>";
				str += "	<td>" + arr[x].loc + "</td><td>" +  arr[x].itemname + "</td><td align='center'>" + arr[x].onhand + "</td><td align='center'>" + arr[x].prefstocklevel + "</td><td align='center'>" + forTransfer + "</td>";


    		var num = arr[x].loc;
    		counts[num] = counts[num] ? counts[num]+1 : 1;

    		if(counts[num] == 1)
    		{
					str += "<td><a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=120&deploy=1&transferLoc=" + arr[x].locId + "'>create</a></td>";
				}
				else
				{
					str += "<td></td>";
				}

				str += "</tr>";
			}
			str += "</table>";

		}

		str += "</body></html>"
		res.write(str);
	}
	else{

	}
}

var createSingleTransferOrder = function(req, res){

	var transferLoc = req.getParameter('transferLoc');

	if(!isBlank(transferLoc))
	{
		var s = nlapiSearchRecord('item', 'customsearch_dolby_medical_transord');
		var arr = [];

		if(s != null)
		{
			for(var i = 0; i < s.length; i++)
			{
				var itemId = s[i].getId();
				var locId = s[i].getValue('internalid', 'inventoryLocation');
				var loc = s[i].getValue('name', 'inventoryLocation');
				var itemname = s[i].getValue('itemid');
				var onhand = s[i].getValue('formulanumeric');
				var prefstocklevel = s[i].getValue('locationpreferredstocklevel');

				if(locId == transferLoc)
				{
					arr.push
					(
						{
							'locId' : locId,
							'itemId' : itemId,
							'loc' : loc,
							'itemname' : itemname,
							'onhand' : onhand,
							'prefstocklevel' : prefstocklevel
						}
					)
				}
			}
		}

		//Create Transfer Order transaction
		var cf = new CustomForm();
		var date = new Date();
		var trandate = nlapiDateToString(date);
		var stat = new OrderStatus();

		var create = nlapiCreateRecord('transferorder');
		create.setFieldValue('customform', cf.DM_TRANSFER_ORDER); //*
		create.setFieldValue('trandate', trandate); //*
		create.setFieldValue('location', 1);
		create.setFieldValue('transferlocation', transferLoc); //*
		create.setFieldValue('orderstatus', stat.PENDING_FULFILLMENT);

		var employee = nlapiLookupField('location', transferLoc, 'custrecord_loc_employee');
		if(!isBlank(employee))
		{
			create.setFieldValue('employee', employee);
		}

		for(var i in arr)
		{
			var line = parseInt(i) + 1;
			var itemId = s[i].getId();
			var locId = s[i].getValue('internalid', 'inventoryLocation');
			var loc = s[i].getValue('name', 'inventoryLocation');
			var itemname = s[i].getValue('itemid');
			var onhand = s[i].getValue('formulanumeric');
			var prefstocklevel = s[i].getValue('locationpreferredstocklevel');
			
			var forTransfer = parseInt(arr[i].prefstocklevel) - parseInt(arr[i].onhand);
			
			create.insertLineItem('item', line);
			create.setLineItemValue('item', 'item', line, itemId);
			create.setLineItemValue('item', 'quantity', line, forTransfer);
		}
		//Submit
		var id = nlapiSubmitRecord(create, true);
		nlapiSetRedirectURL('RECORD', 'transferorder', id, null, null);
		nlapiLogExecution('DEBUG', 'Created Transfer Order:' + id);
	}
}

//Compile Item Record
var getItemRecord = function(arr){

	var itemData = [];
	for(var a in arr)
	{
		var obj = nlapiLoadRecord('inventoryitem', arr[a]);
		var itemid = obj.getFieldValue('itemid');
		var count = obj.getLineItemCount('locations');
		for(var i = 1; i <= count; i++)
		{
			var qtyOnHand = obj.getLineItemValue('locations', 'quantityonhand', i);
			var prefStockLevel = obj.getLineItemValue('locations', 'preferredstocklevel', i);
			var loc = obj.getLineItemValue('locations', 'location', i);

			if(qtyOnHand == null)
			{
				qtyOnHand = parseInt(0);
			}

			if(prefStockLevel != null && loc != null)
			{
				if(prefStockLevel > qtyOnHand)
				{
					itemData.push
					(
						{
							'itemid' : itemid,
							'item' : arr[a],
							'loc':loc,
							'qtyOnHand' : qtyOnHand,
							'prefStockLevel' : prefStockLevel
						}
					);
				}
			}
		}
	}
	return itemData;
}

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
		new nlobjSearchFilter('isinactive', null, 'is', 'F')
		//new nlobjSearchFilter('custrecord_location_transfer_order', null, 'is', 'T')
	];
	var columns =
	[
		new nlobjSearchColumn('name')
	];

	var s = nlapiSearchRecord('location',null, filters, columns);

	for(var a = 0; a < s.length; a++){
		var name = s[a].getValue('name');
		location.push(name);
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
	this.PENDING_APPROVAL = 'A';
	this.PENDING_FULFILLMENT = 'B';
}

function isBlank(test){ if ( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32)  ){return true}else{return false}}


function sort_unique(arr) {
    arr = arr.sort(function (a, b) { return a*1 - b*1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
        if (arr[i-1] !== arr[i]) {
            ret.push(arr[i]);
        }
    }
    return ret;
}

var locationList = function(a){
if(a == "1"){ return "0100 Main Stock"; }
else if(a == "2"){ return "0100 Quarantine"; }else if(a == "3"){ return "0100 Returns To Supplier"; }else if(a == "4"){ return "0200 Warranty Stock"; }else if(a == "5"){ return "0200 Warranty Quarantine"; }else if(a == "6"){ return "0300 Demo Stock"; }else if(a == "19"){ return "Derek Gordon"; }else if(a == "9"){ return "Iain Pryde"; }else if(a == "10"){ return "Glasgow Dental School"; }else if(a == "15"){ return "Stuart Howieson"; }else if(a == "18"){ return "0400 Service Parts"; }else if(a == "8"){ return "Gary Cullion"; }else if(a == "11"){ return "Jonathan Gardner"; }else if(a == "12"){ return "Kevin Hughes"; }else if(a == "13"){ return "Martin Maclean"; }else if(a == "7"){ return "On Service Reports"; }else if(a == "14"){ return "Steven Cowie"; }else if(a == "16"){ return "Test Kit"; }else if(a == "17"){ return "0900 Credit & Re-invoice" }
}