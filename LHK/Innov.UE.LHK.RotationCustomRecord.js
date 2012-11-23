/**
* @fileOverview
* @name Innov.UE.LHK.Rotation.js
* @author Innov - Eli Beltran
* 08-08-2012
* @version 1.0
* Deployed as User-Event Script in Rotation custom record
* @description: Add Button for Inventory Transfer
* 08-28-2012: Rotation Inventory Transfer and Inventory Adjustment is hidden when the all Rotation quantity is already sold for that record
*/

var log = new Log('DEBUG');

var beforeLoad = function(type, form, request){

	if(type == 'view' || type == 'edit'){
		
		var rotationId = nlapiGetRecordId();
		
		updateRotationRecord(rotationId);
		
		form.setScript('customscript_innov_rotation_cl');

		var available = nlapiGetFieldValue('custrecord_loycurrentavailable');

		if(available > 0)
		{
			form.addButton('custpage_rotation_invtransfer', 'Rotation Inventory Transfer', 'inventoryTransfer()');
			form.addButton('custpage_rotation_invadjustment', 'Rotation Inventory Adjustment', 'inventoryAdjustment()');
		}

		form.addButton('custpage_rotation_update', 'Rotation Update', 'updateRotationRecord()');
		var poID = nlapiGetFieldValue('custrecord_rotation_ponumber');
		var poLink = nlapiGetFieldValue('custrecord_lhk_po_link');

		log.write('PO Tran ID: ' + poID + ' | PO Link: ' + poLink);

		if(!isBlank(poID) && isBlank(poLink))
		{
			//search purchase orders
			var result = [];
			var filters =
			[
				new nlobjSearchFilter('tranid', null, 'is', poID),
				new nlobjSearchFilter('mainline', null, 'is', 'T', null)

			];

			var s = nlapiSearchRecord('purchaseorder',null, filters, null);

			try
			{
				if(!isBlank(s))
				{
					var id = s[0].getId();
					log.write('PO Transaction ID: ' + id);
					nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_lhk_po_link', id);
				}
			}
			catch(ex)
			{
				log.error(ex);
			}
		}

	}
}
