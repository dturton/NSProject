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

		mirror(empObj);

		getIllnessDataYear(empObj, empId);
		getIllnessDataMonth(empObj, empId);
		getIllnessDataLastYear(empObj, empId);

		getVacationDataMonth(empObj, empId);
		getVacationDataYear(empObj, empId);

		nlapiSubmitRecord(empObj, true);
	}
}

/**
 * ILLNESS
 */
var getIllnessDataMonth = function(obj, employeeId){

	var filters =
	[
		new nlobjSearchFilter('custrecord_illness_abs_employee_link', null, 'is', employeeId)
	];
	try
	{
		var s = nlapiSearchRecord('customrecord_innov_illness', 'customsearch_illness_this_month', filters, null);
		if(s != null)
		{

			var absentType = new AbsentType();
			var absentTypeList = new AbsentTypeList();

			var illnessTotal = parseFloat(0.00);
			var illnessHICTotal = parseFloat(0.00);

			for (var i = 0; i < s.length; i++)
			{
				var category = s[i].getValue('custrecord_illness_abs_absence_type_2', null, 'group');
				var sum = parseFloat(s[i].getValue('custrecord_illness_abs_days', null, 'sum'));

				if(isBlank(sum))
				{
					sum = parseFloat(0.00);
				}

				//Update Year
				if(absentTypeList.OWN_WITH_HEALTH_INSURANCE_CERTIFICATE == category)
				{
					obj.setFieldValue('custentity_emp_illness_hic_own', sum);
					illnessTotal += sum;
					illnessHICTotal += sum;
				}

				if(absentTypeList.CHILD_WITH_HEALTH_INSURANCE_CERTIFICATE == category)
				{
					obj.setFieldValue('custentity_emp_illness_hic_child', sum);
					illnessTotal += sum;
					illnessHICTotal+= sum;
				}
			}

			obj.setFieldValue('custentity_emp_illness_hic_total', illnessTotal);
			obj.setFieldValue('custentity_emp_illness_total_month', illnessHICTotal);
		}
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var getIllnessDataYear = function(obj, employeeId){

	var filters =
	[
		new nlobjSearchFilter('custrecord_illness_abs_employee_link', null, 'is', employeeId)
	];
	try
	{
		var s = nlapiSearchRecord('customrecord_innov_illness', 'customsearch_illness_this_year', filters, null);
		if(s != null)
		{

			var absentType = new AbsentType();
			var absentTypeList = new AbsentTypeList();

			var illnessTotal = parseFloat(0.00);
			var illnessHICTotal = parseFloat(0.00);

			for (var i = 0; i < s.length; i++)
			{
				var category = s[i].getValue('custrecord_illness_abs_absence_type_2', null, 'group');
				var sum = parseFloat(s[i].getValue('custrecord_illness_abs_days', null, 'sum'));

				if(isBlank(sum))
				{
					sum = parseFloat(0.00);
				}

				//Update Year
				if(absentTypeList.OWN_WITH_HEALTH_INSURANCE_CERTIFICATE == category)
				{
					obj.setFieldValue('custentity_emp_illness_hic_own_year', sum);
					illnessTotal += sum;
					illnessHICTotal += sum;
				}

				if(absentTypeList.CHILD_WITH_HEALTH_INSURANCE_CERTIFICATE == category)
				{
					obj.setFieldValue('custentity_emp_illness_hic_child_year', sum);
					illnessTotal += sum;
					illnessHICTotal+= sum;
				}
			}

			obj.setFieldValue('custentity_emp_illness_hic_total_year', illnessTotal);
			obj.setFieldValue('custentity_emp_illness_total_year', illnessHICTotal);
		}
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var getIllnessDataLastYear = function(obj, employeeId){

	var filters =
	[
		new nlobjSearchFilter('custrecord_illness_abs_employee_link', null, 'is', employeeId)
	];
	try
	{
		var s = nlapiSearchRecord('customrecord_innov_illness', 'customsearch_illness_last_year', filters, null);
		if(s != null)
		{

			var absentType = new AbsentType();
			var absentTypeList = new AbsentTypeList();

			var illnessTotal = parseFloat(0.00);
			var illnessHICTotal = parseFloat(0.00);

			for (var i = 0; i < s.length; i++)
			{
				var category = s[i].getValue('custrecord_illness_abs_absence_type_2', null, 'group');
				var sum = parseFloat(s[i].getValue('custrecord_illness_abs_days', null, 'sum'));

				if(isBlank(sum))
				{
					sum = parseFloat(0.00);
				}

				//Update Year
				if(absentTypeList.OWN_WITH_HEALTH_INSURANCE_CERTIFICATE == category)
				{
					obj.setFieldValue('custentity_emp_illness_hic_own_lyear', sum);
					illnessTotal += sum;
					illnessHICTotal += sum;
				}

				if(absentTypeList.CHILD_WITH_HEALTH_INSURANCE_CERTIFICATE == category)
				{
					obj.setFieldValue('custentity_emp_illness_hic_child_lyear', sum);
					illnessTotal += sum;
					illnessHICTotal+= sum;
				}
			}

			obj.setFieldValue('custentity_emp_illness_hic_total_lyear', illnessTotal);
			obj.setFieldValue('custentity_emp_illness_total_lyear', illnessHICTotal);
		}
	}
	catch(ex)
	{
		log.error(ex);
	}
}

/**
 * VACATION
 */
var getVacationDataYear = function(obj, employeeId){

	var filters =
	[
		new nlobjSearchFilter('custrecord_vacation_abs_employee_link', null, 'is', employeeId)
	];
	try
	{
		var s = nlapiSearchRecord('customrecord_innov_vacation', 'customsearch_vacation_this_year', filters, null);
		if(s != null)
		{

			var absentType = new AbsentType();
			var absentTypeList = new AbsentTypeList();
			var specialLeave = parseFloat(0.00);
			var specialTotalLeave = parseFloat(0.00);

			for (var i = 0; i < s.length; i++)
			{
				var category = s[i].getValue('custrecord_vacation_abs_absence_type_2', null, 'group');
				var sum = parseFloat(s[i].getValue('custrecord_vacation_abs_days', null, 'sum'));


				if(isBlank(sum))
				{
					sum = parseFloat(0.00);
				}

				if(absentTypeList.STANDARD_TAKEN == category)
				{
					obj.setFieldValue('custentity_emp_abs_stdvac_taken_year', sum);
				}

				if(absentTypeList.COMPENSATION_DAY_EARNED == category)
				{
					obj.setFieldValue('custentity_emp_compensat_earned_year', sum);
				}

				//Special Leave
				if(absentTypeList.SPECIAL_LEAVE_CHILDBIRTH == category || absentTypeList.SPECIAL_LEAVE_DEATH == category || absentTypeList.SPECIAL_LEAVE_WEDDING == category || absentTypeList.SPECIAL_LEAVE_MOVE == category)
				{
					specialTotalLeave += sum;
					specialLeave += sum;
				}

				if(absentTypeList.COMPENSATION_DAY_EARNED == category)
				{
					obj.setFieldValue('custentity_emp_compensat_earned_year', sum);
				}

				if(absentTypeList.UNPAID_LEAVE_TAKEN == category)
				{
					specialTotalLeave += sum;
					obj.setFieldValue('custentity_emp_abs_other_vac_unpaid_year', sum);
				}

				if(absentTypeList.EDUCATION_TAKEN == category)
				{
					specialTotalLeave += sum;
					obj.setFieldValue('custentity_emp_abs_other_vac_edu_year', sum);
				}

				if(absentTypeList.COMPENSATION_DAY_TAKEN == category)
				{
					obj.setFieldValue('custentity_emp_compensat_taken_year', sum);
				}

				if(absentTypeList.COMPENSATION_DAY_TAKEN == category)
				{
					obj.setFieldValue('custentity_emp_compensat_taken_year', sum);
				}

			}

			obj.setFieldValue('custentity_emp_abs_other_vac_spec_year', specialLeave);
			obj.setFieldValue('custentity_emp_abs_other_vac_total_year', specialTotalLeave);
		}
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var getVacationDataMonth = function(obj, employeeId){

	var filters =
	[
		new nlobjSearchFilter('custrecord_vacation_abs_employee_link', null, 'is', employeeId)
	];
	try
	{
		var s = nlapiSearchRecord('customrecord_innov_vacation', 'customsearch_vacation_this_month', filters, null);
		if(s != null)
		{

			var absentType = new AbsentType();
			var absentTypeList = new AbsentTypeList();

			for (var i = 0; i < s.length; i++)
			{
				var category = s[i].getValue('custrecord_vacation_abs_absence_type_2', null, 'group');
				var sum = parseFloat(s[i].getValue('custrecord_vacation_abs_days', null, 'sum'));

				if(isBlank(sum))
				{
					sum = parseFloat(0.00);
				}

				//Update Year
				if(absentTypeList.STANDARD_TAKEN == category)
				{
					obj.setFieldValue('custentity_emp_abs_stdvac_taken_month', sum);
				}
			}
		}
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var PeriodStatus = function(){
	this.PREVIOUS = '1';
	this.ACTIVE = '2';
	this.NEXT = '3';
	this.PAST = '4';
	this.FUTURE = '5';
}

var AbsentType = function(){
	this.VACATION = '1';
	this.ILLNESS = '2';
	this.BUSINESS = '3';
	this.OTHERABSENCE = '4';
}

var AbsentTypeList = function(){

	this.STANDARD_TAKEN = '1';
	this.STANDARD_CANCELLED = '2';
	this.STANDARD_COMPENSATION_ENTITLEMENT = '3';
	this.EDUCATION_TAKEN = '4';
	this.EDUCATION_CANCELLED = '5';
	this.COMPENSATION_DAY_TAKEN = '6';
	this.COMPENSATION_DAY_EARNED = '7';
	this.COMPENSATION_DAY_CANCELLED = '8';
	this.SPECIAL_LEAVE_CHILDBIRTH = '9';
	this.SPECIAL_LEAVE_DEATH = '10';
	this.SPECIAL_LEAVE_WEDDING = '11';
	this.SPECIAL_LEAVE_MOVE = '12';
	this.SPECIAL_LEAVE_CANCELLED = '13';
	this.UNPAID_LEAVE_TAKEN = '14';
	this.UNPAID_LEAVE_CANCELLED = '15';
	this.OWN_WITH_HEALTH_INSURANCE_CERTIFICATE = '16';
	this.OWN_WO_HEALTH_INSURANCE_CERTIFICATE = '17';
	this.CHILD_WITH_HEALTH_INSURANCE_CERTIFICATE = '18';
	this.CHILD_WO_HEALTH_INSURANCE_CERTIFICATE = '19';
	this.ILLNESS_WITH_HEALTH_INSURANCE_CERTIFICATE_CANCELLED = '20';
	this.ILLNESS_WO_HEALTH_INSURANCE_CERTIFICATE_CANCELLED = '21';
	this.BUSINESS_TRIP = '22';
	this.HOME_OFFICE = '23';
	this.BUSINESS_CANCELLED = '24';
	this.MATERNITY_LEAVE = '25';
	this.PARENTAL_LEAVE = '26';
	this.EXEMPTION_FROM_WORK_WITH_REVOCATION = '27';
	this.EXEMPTION_FROM_WORK_WITH_REVOCATION = '28';
	this.OTHER_ABSENCE_CANCELLED = '29';
}


var loadRecord = function(){
	var a = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
	return a;
}

//Scripted Mirror Field


var mirror = function(obj){

	var JobTitleRecord = 'recmachcustrecord_jobtitle_employee_link';
	var CostCenterRecord = 'recmachcustrecord_cc_employee_link';
	var SupervisorRecord = 'recmachcustrecord_supervisor_employee_link';

	var count = obj.getLineItemCount(JobTitleRecord);
	if(count == 1)
	{
		var jobGroup = obj.getLineItemValue(JobTitleRecord, 'custrecord_jobtitle_job_group', 1);
		var jobTitle = obj.getLineItemValue(JobTitleRecord, 'custrecord_jobtitle_job_title', 1);
		var team = obj.getLineItemValue(JobTitleRecord, 'custrecord_jobtitle_team', 1);

		obj.setFieldValue('custentity_emp_job_title_mirror', jobTitle);

		log.write('Job Title: ' + jobTitle);

		var jobGroupList = nlapiLoadRecord('customlist', '13');
		var jobGroupListCount = jobGroupList.getLineItemCount('customvalue');

		log.write('Job List Count: ' + jobGroupListCount);

		for(var z = 1; z <= jobGroupListCount; z++)
		{
			if(z == jobGroup)
			{
				var jobGroupName = jobGroupList.getLineItemValue('customvalue', 'valueid', z);
				log.write('Job Group: ' + jobGroupName);
				obj.setFieldValue('custentity_emp_job_group_mirror', jobGroupName);
			}
		}

		var teamList = nlapiLoadRecord('customlist', '14');
		var teamListCount = teamList.getLineItemCount('customvalue');

		log.write('Team List Count: ' + teamListCount);

		for(var a = 1; a <= teamListCount; a++)
		{
			if(a == team)
			{
				var teamName = teamList.getLineItemValue('customvalue', 'valueid', a);
				log.write('Team List: ' + teamName);
				obj.setFieldValue('custentity_emp_team_mirror', teamName);
			}
		}
	}

	var ccCount = obj.getLineItemCount(CostCenterRecord);
	if(ccCount == 1)
	{
		var costCenterName = obj.getLineItemValue(CostCenterRecord, 'custrecord_cc_main_number_and_name', 1);
		var costCenterValidFrom = obj.getLineItemValue(CostCenterRecord, 'custrecord_cc_main_valid_from', 1);

		obj.setFieldValue('custentity_emp_main_cc_valid_from_mirror', costCenterValidFrom);
		obj.setFieldValue('department', costCenterName);
	}

	var sCount = obj.getLineItemCount(SupervisorRecord);
	if(ccCount == 1)
	{
		var supervisorName = obj.getLineItemValue(SupervisorRecord, 'custrecord_supervisor_name', 1);
		var supervisorFrom = obj.getLineItemValue(SupervisorRecord, 'custrecord_supervisor_from', 1);

		obj.setFieldValue('supervisor', supervisorName);
		obj.setFieldValue('custentity_emp_supervisor_from_mirror', supervisorFrom);
	}

	var employeeType1 = obj.getFieldValue('custentity_emp_empl_type1_mirror_subtab');
	var employeeType2 = obj.getFieldValue('custentity_emp_empl_type2_mirror_subtab');

	obj.setFieldValue('custentity_emp_employment_type_1_mirror', employeeType1);
	obj.setFieldValue('custentity_emp_employment_type_2_mirror', employeeType2);

}

var updateAll = function(){
	var filters =
	[
		new nlobjSearchFilter('isinactive', null, 'is', 'F')
	];

	var s = nlapiSearchRecord('employee', 'null', filters, null);
	if(!isBlank(s))
	{
		for (var i = 0; s != null && i < s.length; i++)
		{
			var internalid = s[i].getId();
			try
			{
				var objContext = nlapiGetContext();
				var intUsageRemaining = objContext.getRemainingUsage();
				
				var empObj = nlapiLoadRecord('employee', internalid);
		
				mirror(empObj);
		
				var idLog = nlapiSubmitRecord(empObj, true);
				log.write('Updated Employee: ' + idLog);
				
				if (intUsageRemaining <= 1000)
				{
					log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
					nlapiScheduleScript('customscript_innov_sched_update_employee', null, null);
					break;
					return 0;
				}				
			}
			catch(ex)
			{
				log.error(ex);
			}
		}
	}
}