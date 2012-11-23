/**
* @fileOverview
* @name Innov.UE.LHK.Credit.Memo.js
* @author Innov - Eli Beltran
* 08-15-2012
* @version 1.0
* Deployed as User-Event Script on Invoice - Credit Memo
* @description:
* 1. Rotation fields are blanked on the Return line
* 2. Stock level at location increased by selected values
* 3. New Rotation created per line in the format of SOR-Customer-Order#-Line
* 4. Set Rotation Fields:
* 	a. Units Qty set into custrecord_rotation_item_units_purchased
* 	b. 0 set into custrecord_rotation_item_units_sold
* 	c. Units Qty set into custrecord_rotation_item_units_available
*/

var log = new Log('DEBUG');

var afterSubmit = function(type){

	log.write('Type: ' + type);

	if(type == 'create')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		if(recordType == 'creditmemo')
		{
			var obj = nlapiLoadRecord(recordType, recordId);
			var createdfrom = obj.getFieldValue('createdfrom');
			var customer = obj.getFieldText('entity');
			var raNum = obj.getFieldValue('tranid');

			if(isBlank(createdfrom))
			{
				//Halt Script if Vendor Credit is not from Bill
				return false;
			}

			var count = obj.getLineItemCount('item');
			if(count > 0)
			{
				for(var i = 1; i <= count; i++)
				{
					var quantity = obj.getLineItemValue('item', 'quantity', i);
					var rotationID = obj.getLineItemValue('item', 'custcol_tran_rotation', i);
					if(!isBlank(rotationID))
					{
						//Copy Rotation Record
						var copyRotation = nlapiCopyRecord('customrecord_rotation', rotationID);
						var newRotationName = 'SOR-' + customer + '-' + raNum + '-' + i;
						copyRotation.setFieldValue('name', newRotationName);
						copyRotation.setFieldValue('custrecord_rotation_item_units_purchased', quantity); //Case(s)/Bottle(s) on PO
						copyRotation.setFieldValue('custrecord_loyqtyordered', quantity); //Base Units Purchased
						copyRotation.setFieldValue('custrecord_rotation_item_units_available', quantity); //Case(s)/Bottle(s) Available
						copyRotation.setFieldValue('custrecord_loycurrentavailable', quantity); //Base Units Available
						copyRotation.setFieldValue('custrecord_rotation_item_units_sold', 0); //Base Units Purchased
						copyRotation.setFieldValue('custrecord_lotqtysold', 0); //Base Units Purchased
						copyRotation.setFieldValue('custrecord_lhk_po_link', recordId); //PO Link - Replaced by Return Auth record

						try
						{
							var id = nlapiSubmitRecord(copyRotation, true);
							log.write('New Rotation record: ' + id + ' | ' + newRotationName);
							obj.setLineItemValue('item', 'custcol_tran_rotation', i, id);
							if(!isBlank(rotationId))
							{
								updateRotationRecord(copyRotation);
							}
						}
						catch(ex)
						{
							log.error(ex);
						}
					}
				}

				nlapiSubmitRecord(obj, true);
			}
		}
	}
	else if(type == 'edit')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		if(recordType == 'creditmemo')
		{
			var obj = nlapiLoadRecord(recordType, recordId);
			var createdfrom = obj.getFieldValue('createdfrom');
			var customer = obj.getFieldText('entity');
			var raNum = obj.getFieldValue('tranid');

			if(isBlank(createdfrom))
			{
				//Halt Script if Vendor Credit is not from Bill
				return false;
			}

			var count = obj.getLineItemCount('item');
			if(count > 0)
			{
				for(var i = 1; i <= count; i++)
				{
					var quantity = obj.getLineItemValue('item', 'quantity', i);
					var rotationID = obj.getLineItemValue('item', 'custcol_tran_rotation', i);

					if(!isBlank(rotationID))
					{
						try
						{
							updateRotationRecord(copyRotation);
						}
						catch(ex)
						{
							log.error(ex);
						}
					}
				}
			}
		}
	}
}
