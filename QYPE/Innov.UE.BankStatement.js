
/**
* @fileOverview
* @name Innov.UE.BankStatement.js
* @author Eliseo Beltran eli@innov.co.uk
* @version 1.0
* Deployed on Bank Statement Record (User-Event)
* @description:
* 05.07.2012 - Sorting on Invoice Result
* 05.11.2012 - Added filtering of Invoice should only match invoice dated 2012
* 05.15.2012 - Date on the payment transaction should be the same as the date on the created payment transaction
* Match CRN, Amount & date < 30 days of invoice = MATCHED
* Match CRN, Amount but not invoice date = PART-MATCHED
* Match CRN only = PART-MATCHED
* No Match
* 05.16.2012 - Created Customer Deposit for Part-Match
* Fixed the Customer Payment for 'Matched' transaction
* 05.18.2012 - Parsing of CRN and amount is only supported on 'create' mode
* For zero value amount and negative amount, import the data but do not perform matching.
* 05.21.2012 - Support of Adyen
* 05.22.2012 - Support of FCC
* 05.23.2012 - Currency Support; For EUR currency the filter field should be 'amountremaining'
* For GBP currency filter should be 'fxamount'
* 05.24.2012 - Submit the text date to a Netsuite Date object control to fix the date parsing issue
* Added account to be use when Bank Statement is FCC
* 07.07.2012 - Set to No Match.
* 07.11.2012 - Added condition if 'Adyen GmbH' == true; Set account to: 1,371 Adyen Transferaccount <- recoded 07.12.2012
* 07.20.2012 - Added condition if 'UK Account : Qype Ltd' and FCC is ticked; Set account to: 1,371 Adyen Transferaccount
* 01.08.2013 - Added condition if Bank Statement Source = Adyen - IE  payment that is created needs to be : 1,389 Adyen IE
* 01.22.2013 - Added condition if Bank Statement Source = Volksbank | Subsidiary is Yelp - IE | and locatio either France, Germany or Spain, Set account to  payment receipt with Bank Account = Volksbank – IE.
*/
var afterSubmit = function(type)
{
	if(type == 'create' || type == 'edit')
	{
		var log = new Log('DEBUG');

		var obj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());

		var currency = obj.getFieldValue('custrecord_bs_currency').toUpperCase(); //Make this mandatory!

		var bankStatementSource = obj.getFieldValue('custrecordbank_statement_source');
		var adyen = obj.getFieldValue('custrecord_bank_statement_adyen');
		var adyengmbh = obj.getFieldValue('custrecordbank_statement_adyengmbh'); //Adyen GmbH
		var adyensarl = obj.getFieldValue('custrecordbank_statement_adyensarl'); //Adyen SARL
		var adyensl = obj.getFieldValue('custrecordbank_statement_adyensl'); //Adyen SL

		var fcc = obj.getFieldValue('custrecord_bank_statement_fcc');

		var automatch = obj.getFieldValue('custrecord_bank_statement_automatch');

		if(automatch == 'F')
		{
			return false;
		}

		var transLinked = obj.getFieldValue('custrecord_bs_transaction_linked');

		if(!isBlank(transLinked))
		{
			try
			{
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_status', ''); //Empty Status Field
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_invoice_link', ''); //Empty Invoice Link Field
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_type', ''); //Empty Transaction Type Field
				log.write('------ END ------');
				return false; //halt execution
			}
			catch(ex)
			{
				log.error(ex);
			}
		}


		if(type == 'create')
		{
			if(adyen == 'T' || fcc == 'T' || adyengmbh == 'T' || adyensarl == 'T' || adyensl == 'T')
			{
				var crn = obj.getFieldValue('custrecord_bs_crn'); //Get crn value
			}
			else
			{
				var crn = newParseCRN(obj);
				obj.setFieldValue('custrecord_bs_crn', crn); //Set crn value
			}
		}
		else
		{
			//edit mode
			var crn = obj.getFieldValue('custrecord_bs_crn'); //Get crn value
		}

		var startbalance = obj.getFieldValue('custrecord_bs_start_bal');
		var account = obj.getFieldValue('custrecord_bs_account_number');
		var endbalance = obj.getFieldValue('custrecord_bs_end_balance');
		var amount = obj.getFieldValue('custrecord_bs_amount');
		var trandate = obj.getFieldValue('custrecord_bs_tran_date');

		if(!isBlank(startbalance))
		{
			obj.setFieldValue('custrecord_bs_start_bal', convertCommaToDot(startbalance));
		}

		if(!isBlank(endbalance))
		{
			obj.setFieldValue('custrecord_bs_end_balance', convertCommaToDot(endbalance));
		}

		if(!isBlank(amount))
		{
			if(type == 'create')
			{
				if(adyen == 'T' || fcc == 'T')
				{
					var newAmount = obj.getFieldValue('custrecord_bs_amount');

				}
				else
				{
					var newAmount = convertCommaToDot(amount);
					obj.setFieldValue('custrecord_bs_amount', newAmount);
				}
			}
			if(type == 'edit')
			{
				var newAmount = obj.getFieldValue('custrecord_bs_amount');
			}
		}

		if(!isBlank(trandate))
		{
			if(adyen == 'T' || fcc == 'T')
			{
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_sys_date', trandate);
				var newTranDate = nlapiLookupField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_sys_date');
			}
			else
			{
				//For 'Volksbank' statement
				var tempDate = convertDateStr(trandate); //convert to date format
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_sys_date', tempDate);
				var newTranDate = nlapiLookupField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_sys_date');
			}
		}

		var currUser = nlapiGetUser();
		if(!isBlank(currUser))
		{
			obj.setFieldValue('custrecord_bs_processed_by', currUser);
		}

		var bankStatement = nlapiSubmitRecord(obj, true); //Commit changes

		log.write('CRN: ' + crn + ' | Account: ' + account + ' | Amount: ' + newAmount + ' | Currency: ' + currency);

		log.write('------ Bank Statement Updated ------');

		if(!isBlank(crn))
		{

			var MATCHED = '1';
			var PARTMATCHED = '2';
			var NOMATCH = '3';

			//Amount is Zero do not execute only import the data!
			if(newAmount <= 0)
			{
				return false;
			}

			//If there is a CRN record perform search on invoice.
			var invoiceCollection = getMatchedInvoice(newAmount, crn, bankStatement, account, newTranDate, 'match', currency, bankStatementSource);

			if(invoiceCollection != null)
			{
				//Customer Payment MODULE (CREATE) - MATCH status CRN, Amount and Bank Statement Date < 30 days of Invoice
				if(invoiceCollection.length > 0)
				{
					log.write('MATCHED');

					//Only one result create "Customer Payment"
					var create = nlapiTransformRecord('invoice', invoiceCollection[0].invoiceId, 'customerpayment');
					create.setFieldValue('customer', invoiceCollection[0].customer);
					create.setFieldValue('payment', invoiceCollection[0].amount);
					create.setFieldValue('trandate', newTranDate);

					//Subsidiary condition
					if(invoiceCollection[0].subsidiary == '2') //German Account : Qype GmbH
					{
						//Currency EUR
						if(adyen == 'T' || adyengmbh == 'T')
						{
							create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
						}
						else if(fcc == 'T')
						{
							create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
						}
						else
						{
							//Condition to what account this should belong
							var accountID = getAccount(invoiceCollection[0].account); //Set to proper account
							if(accountID != 0)
							{
								create.setFieldValue('account', accountID);
							}
						}
					}
					else if(invoiceCollection[0].subsidiary == '3') //UK Account : Qype Ltd
					{
						if(adyen == 'T')
						{
							create.setFieldValue('account', '1225');
						}
						else if(fcc == 'T')
						{
							create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
						}
						else
						{
							var accountNatWest = '1451';
							create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
						}
					}
					else if(invoiceCollection[0].subsidiary == '4') //Qype SL
					{
						if(adyen == 'T')
						{
							create.setFieldValue('account', '1225');
						}
						else if(adyensl == 'T')
						{
							create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
						}
						else if(fcc == 'T')
						{
							create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
						}
						else
						{
							var accountNatWest = '1451';
							create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
						}
					}
					else if(invoiceCollection[0].subsidiary == '6') //Qype SARL
					{
						if(adyen == 'T')
						{
							create.setFieldValue('account', '1225');
						}
						else if(adyensarl == 'T')
						{
							create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
						}
						else if(fcc == 'T')
						{
							create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
						}
						else
						{
							var accountNatWest = '1451';
							create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
						}
					}
					else if(invoiceCollection[0].subsidiary == '11') //Yelp IE
					{
						if(bankStatementSource == '10')
						{
							create.setFieldValue('account', '1530'); //1387 - Bank of Ireland - 15393038
						}
						else if(bankStatementSource == '6') //Volksbank
						{
							//Get Invoice Location
							var loc = nlapiLookupField('invoice', invoiceCollection[0].invoiceId, 'location');
							if(!isBlank(loc))
							{
								if(loc == '8' || loc == '1' || loc == '10') //France 8, Germany 1, Spain 10
								{
									create.setFieldValue('account', '1532'); //Volksbank - IE
								}
							}
						}
					}
					//Loop on all line items - Applicable only for MATCH invoice
					var applyCount = create.getLineItemCount('apply');
					for(var z = 1; z <=  applyCount; z++)
					{
						var docNum = create.getLineItemValue('apply', 'doc', z);
						if(docNum == invoiceCollection[0].invoiceId)
						{
							create.setLineItemValue('apply', 'apply', z, 'T');
						}
					}

					try
					{

						create.setFieldValue('custbody_createdfrom', nlapiGetRecordId()); //Link the bank statement custom record to customer payment
						var customerPayment = nlapiSubmitRecord(create, true); //Submit Record

						nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_status', MATCHED); //Update Status
						nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_type', 'Customer Payment'); //Update Free-form text
						nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_invoice_link', invoiceCollection[0].invoiceId); //Update Invoice Link
						nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_linked', customerPayment); //Update Transaction Linked

						log.write('------ Customer Payment : ' + customerPayment + ' -------');

						return false; //halt execution
					}
					catch(ex)
					{
						log.error(ex);
						log.write('------ END ------');
					}

				}

				//Customer Payment MODULE (CREATE) - PART-MATCHED
				if(invoiceCollection.length == 0)
				{

					var invoiceCollectionPartMatch = getMatchedInvoice(newAmount, crn, bankStatement, account, newTranDate, 'partmatch', currency, bankStatementSource);

					if(invoiceCollectionPartMatch.length > 0)
					{

						log.write('PART-MATCHED - CRN and Amount --> Customer Deposit only');

						//Only one result create "Customer Payment"
						var create = nlapiTransformRecord('invoice', invoiceCollectionPartMatch[0].invoiceId, 'customerpayment');
						create.setFieldValue('customer', invoiceCollectionPartMatch[0].customer);
						create.setFieldValue('payment', invoiceCollectionPartMatch[0].amount);
						create.setFieldValue('trandate', newTranDate);

						//Subsidiary condition
						if(invoiceCollectionPartMatch[0].subsidiary == '2') //German Account : Qype GmbH
						{
							//Condition to what account this should belong
							var accountID = getAccount(invoiceCollectionPartMatch[0].account); //Set to proper account
							if(accountID != 0)
							{
								if(adyen == 'T' || adyengmbh == 'T')
								{
									create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
								}
								else if(fcc == 'T')
								{
									create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
								}
								else
								{
									create.setFieldValue('account', accountID);
								}
							}
						}
						else if(invoiceCollectionPartMatch[0].subsidiary == '3') //UK Account : Qype Ltd
						{
							if(adyen == 'T')
							{
								create.setFieldValue('account', '1225');
							}
							else if(fcc == 'T')
							{
								create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
							}
							else
							{
								var accountNatWest = '1451';
								create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
							}
						}
						else if(invoiceCollectionPartMatch[0].subsidiary == '4') //Qype SL
						{
							if(adyen == 'T')
							{
								create.setFieldValue('account', '1225');
							}
							else if(adyensl == 'T')
							{
								create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
							}
							else if(fcc == 'T')
							{
								create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
							}
							else
							{
								var accountNatWest = '1451';
								create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
							}
						}
						else if(invoiceCollectionPartMatch[0].subsidiary == '6') //Qype SARL
						{
							if(adyen == 'T')
							{
								create.setFieldValue('account', '1225');
							}
							else if(adyensarl == 'T')
							{
								create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
							}
							else if(fcc == 'T')
							{
								create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
							}
							else
							{
								var accountNatWest = '1451';
								create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
							}
						}
						else if(invoiceCollectionPartMatch[0].subsidiary == '11') //Yelp IE
						{
							if(bankStatementSource == '10')
							{
								create.setFieldValue('account', '1530'); //1387 - Bank of Ireland - 15393038
							}
							else if(bankStatementSource == '6') //Volksbank
							{
								//Get Invoice Location
								var loc = nlapiLookupField('invoice', invoiceCollectionPartMatch[0].invoiceId, 'location');
								if(!isBlank(loc))
								{
									if(loc == '8' || loc == '1' || loc == '10') //France 8, Germany 1, Spain 10
									{
										create.setFieldValue('account', '1532'); //Volksbank - IE
									}
								}	
							}							
						}

						try
						{

							create.setFieldValue('custbody_createdfrom', nlapiGetRecordId()); //Link the bank statement custom record to customer payment
							var customerPayment = nlapiSubmitRecord(create, true); //Submit Record


							nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_customer_link', invoiceCollectionPartMatch[0].customer); //Update Status
							nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_status', PARTMATCHED); //Update Status
							nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_type', 'Customer Deposit'); //Update Free-form text
							nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_linked', customerPayment); //Update Transaction Linked

							var strMsg = "CRN " + crn + " and Amount " + newAmount + " Matched.\n\n Date: " + newTranDate + " is not within 30 days from the Invoice Date: " + invoiceCollectionPartMatch[0].trandate;

							nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bank_statement_notes', strMsg); //Update Transaction Linked

							log.write('------ Customer Payment : ' + customerPayment + ' -------');

							return false; //halt execution
						}
						catch(ex)
						{
							log.error(ex);
							log.write('------ END ------');
						}

					}

					if(invoiceCollectionPartMatch.length == 0)
					{
						var invoiceCollectionCRNOnly = getMatchedInvoice(newAmount, crn, bankStatement, account, newTranDate, 'crnonly', currency, bankStatementSource);

						if(invoiceCollectionCRNOnly.length > 0)
						{

							log.write('PART-MATCHED - CRN ONLY');

							//Only one result create "Customer Payment"
							var create = nlapiTransformRecord('invoice', invoiceCollectionCRNOnly[0].invoiceId, 'customerpayment');
							create.setFieldValue('customer', invoiceCollectionCRNOnly[0].customer);
							create.setFieldValue('payment', invoiceCollectionCRNOnly[0].amount);
							create.setFieldValue('trandate', newTranDate);

							//Subsidiary condition
							if(invoiceCollectionCRNOnly[0].subsidiary == '2') //German Account : Qype GmbH
							{
								//Condition to what account this should belong
								var accountID = getAccount(invoiceCollectionCRNOnly[0].account); //Set to proper account
								if(accountID != 0)
								{
									if(adyen == 'T' || adyengmbh == 'T')
									{
										create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
									}
									else if(fcc == 'T')
									{
										create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
									}
									else
									{
									create.setFieldValue('account', accountID);
									}
								}
							}
							else if(invoiceCollectionCRNOnly[0].subsidiary == '3') //UK Account : Qype Ltd
							{
								if(adyen == 'T')
								{
									create.setFieldValue('account', '1225');
								}
								else if(fcc == 'T')
								{
									create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
								}
								else
								{
									var accountNatWest = '1451';
									create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
								}
							}

							else if(invoiceCollectionCRNOnly[0].subsidiary == '4') //Qype SL
							{
								if(adyen == 'T')
								{
									create.setFieldValue('account', '1225');
								}
								else if(adyensl == 'T')
								{
									create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
								}
								else if(fcc == 'T')
								{
									create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
								}
								else
								{
									var accountNatWest = '1451';
									create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
								}
							}
							else if(invoiceCollectionCRNOnly[0].subsidiary == '6') //Qype SARL
							{
								if(adyen == 'T')
								{
									create.setFieldValue('account', '1225');
								}
								else if(adyensarl == 'T')
								{
									create.setFieldValue('account', '1224'); //1,371 Adyen Transferaccount
								}
								else if(fcc == 'T')
								{
									create.setFieldValue('account', '1486'); //1,373 FCC Transfer Acct
								}
								else
								{
									var accountNatWest = '1451';
									create.setFieldValue('account', accountNatWest); //1,807 NatWest Bank 67185916
								}
							}
							else if(invoiceCollectionCRNOnly[0].subsidiary == '11') //Yelp IE
							{
								if(bankStatementSource == '10')
								{
									create.setFieldValue('account', '1530'); //1387 - Bank of Ireland - 15393038
								}
								else if(bankStatementSource == '6') //Volksbank
								{
									//Get Invoice Location
									var loc = nlapiLookupField('invoice', invoiceCollectionCRNOnly[0].invoiceId, 'location');
									if(!isBlank(loc))
									{
										if(loc == '8' || loc == '1' || loc == '10') //France 8, Germany 1, Spain 10
										{
											create.setFieldValue('account', '1532'); //Volksbank - IE
										}
									}		
								}								
							}
							try
							{

								create.setFieldValue('custbody_createdfrom', nlapiGetRecordId()); //Link the bank statement custom record to customer payment
								var customerPayment = nlapiSubmitRecord(create, true); //Submit Record

								nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_status', PARTMATCHED); //Update Status
								nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_type', 'Customer Deposit'); //Update Free-form text
								nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_customer_link', invoiceCollectionCRNOnly[0].customer); //Update Status
								nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_transaction_linked', customerPayment); //Update Transaction Linked

								var strMsg = "CRN Match ONLY: " + crn + "\n\n Amount " + newAmount + " did not match and Date: " + newTranDate + " is not within 30 days from the Invoices that matched";

								nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bank_statement_notes', strMsg); //Update Transaction Linked

								log.write('------ Customer Payment : ' + customerPayment + ' -------');

								return false; //halt execution
							}
							catch(ex)
							{
								log.error(ex);
								log.write('------ END ------');
							}

						}

						if(invoiceCollectionCRNOnly.length == 0)
						{
							var invoiceCollectionNoMatch = getMatchedInvoice(newAmount, crn, bankStatement, account, newTranDate, 'unmatch', currency, bankStatementSource);

							if(invoiceCollectionNoMatch.length > 0)
							{
								log.write('NO MATCH');

								try
								{
									nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_status', NOMATCH); //Update Status
									log.write('------ Customer Payment : ' + customerPayment + ' -------');
									return false; //halt execution
								}
								catch(ex)
								{
									log.error(ex);
									log.write('------ END ------');
								}

							}
						}
					}
				}
			}
		}
	}
}

var convertCommaToDot = function(str){
	var temp = str.replace(",", ".");
	return temp;
}

var convertDateStr = function(str){
	var temp = str.replace(".", "/");
	var temp2 = temp.replace(".", "/");
	return temp2;
}

var convertAdyenDate = function(str){

}

var isBlank = function(test){
	if( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32) ){return true}else{return false}
}

var parseCRN = function(obj)
{
	var log = new Log('DEBUG');
	var str = obj.getFieldValue('custrecord_bs_ref2');

	if(!isBlank(str))
	{
		var temp = str.split(" ");

		var findstr = "RNR";
		var crnMatch = getCRNPattern(temp, findstr);
		if(crnMatch != -1)
		{
			try
			{
				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_bs_crn', crnMatch);
				return crnMatch;
			}
			catch(ex)
			{
				log.error(ex);
			}
		}
		else
		{
			return 0;
		}
	}
	else
	{
		return 0;
	}
}

var newParseCRN = function(obj)
{
	var log = new Log('DEBUG');
	var temp = obj.getFieldValue('custrecord_bs_ref2');
	var a = temp.split(" ");
	var crnVal = "";

	if(a.length > 0)
	{
		log.write('Length: ' + a.length);

		for(var i in a)
		{
			var last = (a.length - 1);
			log.write(a[i]);
			if(a[i].length == '6') //Matched already
			{
				//6-digit match
				crnVal = a[i];
				return crnVal;
				break;
			}
			else if(a[i].length == '5' && a[last].length == '1')
			{
				//combine string
				var merge = a[i].toString() + a[last].toString();
				crnVal = merge;
				return crnVal;
				break;
			}
		}

		return crnVal;
	}
	else //Blank field
	{
		return "";
	}
}

//--- Obsolete
function getCRNPattern(temp, findstr)
{
	for(var j=0; j<temp.length; j++)
	{
		if (temp[j].match(findstr))
		return temp[j + 1];
	}
	return -1;
}

/*
 *
 */
var getMatchedInvoice = function(amount, crn, bankstatement, account, newTranDate, searchmode, currency, bankStatementSource)
{
	var log = new Log('DEBUG');
	log.write('---------- Parameters ----------');
	log.write('mode: ' + searchmode + ' | CRN: ' + crn +  ' | Bank stmnt: ' + bankstatement +  ' | Account: ' + account +  ' | Date: ' + newTranDate +  ' | currency: ' + currency);

	var result = [];

	var filters =
	[
		new nlobjSearchFilter('custbodyqp_so_bocrnnumber', null, 'isnotempty', null),
		new nlobjSearchFilter('status', null, 'anyof', 'CustInvc:A', null),
		new nlobjSearchFilter('mainline', null, 'is', 'T', null)
	];

	var columns =
	[
		new nlobjSearchColumn('custbodyqp_so_bocrnnumber'),
		new nlobjSearchColumn('entity'),
		new nlobjSearchColumn('subsidiary'),
		new nlobjSearchColumn('status'),
		new nlobjSearchColumn('trandate').setSort()
	];

	var toDate = nlapiAddDays(nlapiStringToDate(newTranDate), -30);
	var thisDate = nlapiAddDays(nlapiStringToDate(newTranDate), 0);
	log.write('Mode: ' + searchmode + ' | From Date: ' + toDate + ' | To Date: ' + thisDate);

	//MATCH
	if(searchmode == 'match')
	{
		//CRN Match and Amount and Invoice within 30 days;
		var toDate = nlapiAddDays(nlapiStringToDate(newTranDate), -30);
		var thisDate = nlapiAddDays(nlapiStringToDate(newTranDate), 1);

		filters.push(new nlobjSearchFilter('trandate', null, 'within', nlapiDateToString(toDate), nlapiDateToString(thisDate))); //Filter invoice only 30 days from Bank Statement Transaction Date
		filters.push(new nlobjSearchFilter('custbodyqp_so_bocrnnumber', null, 'equalto', crn, null)); //Match CRN

		if(currency == 'EUR')
		{
			filters.push(new nlobjSearchFilter('amountremaining', null, 'equalto', amount, null));
			columns.push(new nlobjSearchColumn('amountremaining'));
		}
		else
		{
			//Use FX amount for GBP
			filters.push(new nlobjSearchFilter('fxamount', null, 'equalto', amount, null));
			columns.push(new nlobjSearchColumn('fxamount'));
		}
	}
	else if(searchmode == 'partmatch')
	{
		//CRN Match and Amount; Regardless of Invoice Date
		filters.push(new nlobjSearchFilter('custbodyqp_so_bocrnnumber', null, 'equalto', crn, null)); //Match CRN
		if(currency == 'EUR')
		{
			filters.push(new nlobjSearchFilter('amountremaining', null, 'equalto', amount, null));
			columns.push(new nlobjSearchColumn('amountremaining'));
		}
		else
		{
			//Use FX amount for GBP
			filters.push(new nlobjSearchFilter('fxamount', null, 'equalto', amount, null));
			columns.push(new nlobjSearchColumn('fxamount'));
		}
	}
	else if(searchmode == 'crnonly')
	{
		//CRN Match Only; Amount and Date is not match
		filters.push(new nlobjSearchFilter('custbodyqp_so_bocrnnumber', null, 'equalto', crn, null)); //Match CRN
	}
	else if(searchmode == 'unmatch')
	{
		//No Match at all...
		log.write('NO MATCH');
		nlapiSubmitField('customrecord_bank_statement', bankstatement, 'custrecord_bs_status', '3'); //Update Status - 07.04.2012 set to no match
		return false; //halt execution
	}
	try
	{
		var s = nlapiSearchRecord('invoice',null, filters, columns);

		if(s != null)
		{
			//only one match
			log.write('Number of Result: ' + s.length);

			for (var i = 0; i < s.length; i++)
			{
				var invoiceId = s[i].getId();
				var crn = s[i].getValue('custbodyqp_so_bocrnnumber');
				//var amount = s[i].getValue('amountremaining');
				var entity = s[i].getValue('entity');
				var subsidiary = s[i].getValue('subsidiary');
				var trandate = s[i].getValue('trandate');

				log.write('Invoice ID: ' + invoiceId + ' | CRN: ' + crn + ' | Amount: ' + amount + ' | Entity: ' + entity + ' | Subsidiary: ' + subsidiary + ' | Date: ' + trandate);

				result.push
				(
					{
						'invoiceId' : invoiceId,
						'crn' : crn,
						'amount' : amount,
						'customer' : entity,
						'subsidiary' : subsidiary,
						'bankstatement' : bankstatement,
						'account' : account,
						'trandate' : trandate
					}
				);
			}
		}
		log.write('Result length: ' + result.length);
		return result; //result array
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var getAccount = function(account){
	if(account == '712701')
	{
		//1,800 Volksbank Kto.712701
		return '1141';
	}
	else if(account == '712710')
	{
		//1,800 Volksbank Kto.712710
		return '1142';
	}
	else if(account == '712728')
	{
		//1,800 Volksbank Kto.712728
		return '1143';
	}
	else if(account == 'Adyen - GmbH')
	{
		//1,371 Adyen Transferaccount
		return '1224';
	}
	else
	{
		return 0;
	}
}
