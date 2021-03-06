/**
 * @fileOverview
 * @name Innov.UE.Wooga.Absence.Calc.js
 * @author Eli eli@innov.co.uk
 * xx-xx-xx
 * @version 1.0
 * Deployed on Employee as User Event Script
 * @description:
 */

var WOOGA;
if (!WOOGA) WOOGA = {};

var log = new Log('DEBUG');

var schedUpdate = function(){

	var objContext = nlapiGetContext();
	var empS = nlapiSearchRecord('employee', 'customsearch_innov_employees', null, null);

	if(empS == null)
	return;

	for(var a = 0; a < empS.length; a++)
	{
		var _id = empS[a].getId();
		var intUsageRemaining = objContext.getRemainingUsage();

		if (intUsageRemaining <= 1000)
		{
			log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
			var status = nlapiScheduleScript(objContext.getScriptId(), objContext.getDeploymentId());
			if(status == 'QUEUED')
			break;
		}

		var obj = nlapiLoadRecord('employee', _id);
		updateCostCenter(obj, _id);
		updateSupervisor(obj, _id);
		updateJobTitleDetails(obj, _id);
		updateContractDetails(obj, _id);
		updateBankDetails(obj, _id);
		updateFiles(obj, _id);
		esop(obj, _id);
		obj.setFieldValue('custentity_innov_flag', 'T');
		var updateEmp = nlapiSubmitRecord(obj);
		log.write('Updated: ' + updateEmp + ' | Remaining: ' + intUsageRemaining);
	}
}
