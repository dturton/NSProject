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

WOOGA.beforeLoad = function(type, form, request){

}


WOOGA.beforeSubmit = function(type){

}

WOOGA.afterSubmit = function(type){
	if(type == 'create' || type == 'edit'){

		var empObj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var empId = nlapiGetRecordId();

		//mirror(empObj);
		//getIllnessDataYear(empObj, empId);
		//getIllnessDataMonth(empObj, empId);
		//getIllnessDataLastYear(empObj, empId);
		//getVacationDataMonth(empObj, empId);
		//getVacationDataYear(empObj, empId);
		
		//Update ESOP
		esop(empObj, empId);

		//Update Supervisor
		updateSupervisor(empObj, empId);
		
		//Update Job Details
		updateJobTitleDetails(empObj, empId);
		
		//Update Cost Center
		updateCostCenter(empObj, empId);
		
		//Update Contract Details
		updateContractDetails(empObj, empId);

		nlapiSubmitRecord(empObj, true);

	}
}
