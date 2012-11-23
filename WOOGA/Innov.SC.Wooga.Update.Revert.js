/**
 * @fileOverview
 * @name Innov.SC.Wooga.Update.Revert.js
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
	
	var filters =
	[
		new nlobjSearchFilter('isinactive', null, 'is', 'F')
	];	
	
	var empS = nlapiSearchRecord('employee', null, null, null);

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

		nlapiSubmitField('employee', _id, 'custentity_innov_flag', 'F');
		log.write('Updated: ' + _id + ' | Remaining: ' + intUsageRemaining);
	}
}
