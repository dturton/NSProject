/**
 * @fileOverview
 * @name Eli.AFS.CL.Transactions.js
 * @author Eli eli@australianfitnesssupplies.com.au
 * 08-21-2012
 * @version 1.0
 * Deployed on Transactions as Client Script
 * @description: Disable Tax Amount and Gross Amount
 */

var AFS;
if (!AFS) AFS = {};

var DISCOUNT = 'custcol_discount';
var AMOUNT = 'amount';
var QUANTITY = 'quantity';
var RATE = 'rate';


AFS.pageInit = function(type){

	if(type == 'create' || type == 'edit')
	{
		//Disable Tax Amount and Gross Amount
		nlapiDisableLineItemField('item', 'tax1amt', 'T');
		nlapiDisableLineItemField('item', 'grossamt', 'T');
		nlapiDisableLineItemField('item', 'price', 'T');
		
		//Set Sales Rep
		var user = nlapiGetUser();
		nlapiSetFieldValue('salesrep', user);
	}
}

AFS.fieldChanged = function(type, name, linenum){

	var currentForm = nlapiGetFieldValue('customform');
	var customForm = new CustomForm(); //Initialize Custom Form
	
	if(name == 'entity'){
		var entity = nlapiGetFieldValue('entity');
		if(!isBlank(entity))
		{
			var subsidiary = nlapiLookupField('entity', entity, 'subsidiary');
		}
	}
	
	//if(type == 'item')
	//{
	//	if(name == 'custcol_discount')
	//	{
	//		alert(DISCOUNT);
	//		var discount = nlapiGetCurrentLineItemValue('item', DISCOUNT);
	//		var quantity = nlapiGetCurrentLineItemValue('item', QUANTITY);
	//		var rate = nlapiGetCurrentLineItemValue('item', RATE);
	//		
	//		alert(discount);
	//		alert(quantity);
	//		alert(rate);
	//	}
	//}
	//
  //
	//if(type == 'item')
	//{
	//	//************* 2012.10.03 - Temporary disabled
	//	
	//	//if(name == 'item')
	//	//{
	//	//	var location = nlapiGetFieldValue('location');
	//	//	if(!isBlank(location))
	//	//	{
	//	//		//Set the location field of the item line
	//	//		nlapiSetCurrentLineItemValue('item', 'location', location, false, false);
	//	//	}
	//	//}
	//	
	//	
	//	
	//	//if(name == 'price')
	//	//{
	//	//	var currIndex = nlapiGetCurrentLineItemIndex('item');
	//	//	var priceLevel = nlapiGetLineItemValue('item', 'price', currIndex);
	//	//	if(!isBlank(priceLevel))
	//	//	{
	//	//		//Set the Price Level - custom field
	//	//		if(currentForm == customForm.AFS) //AFS Sales Order
	//	//		{
	//	//			nlapiSetCurrentLineItemValue('item', 'custcol_price_level_afs', priceLevel);
	//	//		}
	//	//		else if(currentForm == customForm.GAF) //GAF Sales Order
	//	//		{
	//	//			nlapiSetCurrentLineItemValue('item', 'customrecord_price_level_gaf', priceLevel);
	//	//		}
	//	//	}			
	//	//}
	//	//
	//	//if(name == 'custcol_price_level_afs' || name == 'custrecord_price_level_gaf')
	//	//{
	//	//	if(currentForm == customForm.AFS) //AFS Sales Order
	//	//	{
	//	//		var priceLevelCustom = nlapiGetCurrentLineItemValue('item', 'custcol_price_level_afs');
	//	//		if(!isBlank(priceLevelCustom))
	//	//		{
	//	//			var	setPriceLevel = nlapiLookupField('customrecord_price_level_afs', priceLevelCustom, 'custrecord_price_level');
	//	//		}
	//	//		
	//	//		if(!isBlank(setPriceLevel))
	//	//		{
	//	//			nlapiSetCurrentLineItemValue('item', 'price', setPriceLevel);
	//	//		}
	//	//	}
	//	//	else if(currentForm == customForm.GAF) //GAF Sales Order
	//	//	{
	//	//		var priceLevelCustom = nlapiGetCurrentLineItemValue('item', 'custcol_price_level_gaf');
	//	//		if(!isBlank(priceLevelCustom))
	//	//		{
	//	//			var setPriceLevel = nlapiLookupField('customrecord_price_level_gaf', priceLevelCustom, 'custrecord_price_level_gaf');
	//	//		}
	//	//		
	//	//		if(!isBlank(setPriceLevel))
	//	//		{
	//	//			nlapiSetCurrentLineItemValue('item', 'price', setPriceLevel);
	//	//		}
	//	//	}
	//	//}
	//	
	//	//************* 2012.10.03 - Temporary disabled
	//}
	
	return true;
}

var CustomForm = function(){
	this.AFS = '100';
	this.GAF = '129';
}

var Subsidiary = function(){
	this.TOP = '1';
	this.AFS = '2';
	this.GAF = '3';
	this.GAFGC = '5';
	this.GAFHO = '6';
	this.GAFAD = '7';
	this.LF = '8';
	this.GAFMLB = '10';
}