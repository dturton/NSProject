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

WOOGA.update = function(){

	try
	{
		updateContractDetails();
		updateJobTitleDetails();
		updateSupervisor();
		updateCostCenter();
	}
	catch(ex)
	{
		log.error(ex);
	}
}

/**
 * @name updateCostCenter
 * @author Eli eli@innov.co.uk
 * 11-12-2012
 * @description: Update
 * Call a saved search
 */
var updateCostCenter = function(){
	var s = nlapiSearchRecord('customrecord_cost_center', 'customsearch_innov_update_costcenter');
	if(s != null)
	{
		for (var i = 0; i < s.length; i++)
		{
			var employeeLink = s[i].getValue('custrecord_cc_employee_link');
			var costCenter = s[i].getValue('custrecord_cc_main_number_and_name');
			var costCenterValidFrom = s[i].getValue('custrecord_cc_main_valid_from');

			if(!isBlank(employeeLink))
			{
				try
				{
					var objContext = nlapiGetContext();
					var intUsageRemaining = objContext.getRemainingUsage();					
					
					if (intUsageRemaining <= 1000)
					{
						log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
						nlapiScheduleScript('customscript_innov_sched_update_employee', null, null);
						break;
						return 0;
					}
										
					var updateEmployee = nlapiLoadRecord('employee', employeeLink);
					updateEmployee.setFieldValue('department', costCenter);
					updateEmployee.setFieldValue('custentity_emp_main_cc_valid_from_mirror', costCenterValidFrom);
					var updateId = nlapiSubmitRecord(updateEmployee);
					log.write('Cost Center Updated: ' + updateId);
				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}
	}
}

/**
 * @name updateSupervisor
 * @author Eli eli@innov.co.uk
 * 11-12-2012
 * @description: Update Supervisor and Supervisor from fields in the employee record
 * Call a saved search
 */
var updateSupervisor = function(){
	var s = nlapiSearchRecord('customrecord_cr_innv_supervisor_hierachy', 'customsearch_innov_update_supervisor');
	if(s != null)
	{
		for (var i = 0; i < s.length; i++)
		{
			var employeeLink = s[i].getValue('custrecord_supervisor_employee_link');
			var supervisor = s[i].getValue('custrecord_supervisor_name');
			var supervisorFrom = s[i].getValue('custrecord_supervisor_from');

			if(!isBlank(employeeLink))
			{
				try
				{
					
					var objContext = nlapiGetContext();
					var intUsageRemaining = objContext.getRemainingUsage();
										
					if (intUsageRemaining <= 1000)
					{
						log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
						nlapiScheduleScript('customscript_innov_sched_update_employee', null, null);
						break;
						return 0;
					}
										
					var updateEmployee = nlapiLoadRecord('employee', employeeLink);
					updateEmployee.setFieldValue('supervisor', supervisor);
					updateEmployee.setFieldValue('custentity_emp_supervisor_from_mirror', supervisorFrom);
					updateEsop(updateEmployee, employeeLink)
					var updateId = nlapiSubmitRecord(updateEmployee);
					log.write('Supervisor Updated: ' + updateId);
				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}
	}
}

/**
 * @name updateJobTitleDetails
 * @author Eli eli@innov.co.uk
 * 11-12-2012
 * @description: Update Job Title, Team and Job Group mirror fields in the employee record
 * Call a saved search
 * Get the Job Title, Team and Job Group result and load/update the employee records.
 */
var updateJobTitleDetails = function(){
	var s = nlapiSearchRecord('customrecord_job_title', 'customsearch_innov_update_jobtitle');
	if(s != null)
	{
		for (var i = 0; i < s.length; i++)
		{
			var employeeLink = s[i].getValue('custrecord_jobtitle_employee_link');
			var jobGroup = s[i].getValue('custrecord_jobtitle_job_group');
			var jobTitle = s[i].getValue('custrecord_jobtitle_job_title');
			var team = s[i].getValue('custrecord_jobtitle_team');

			if(!isBlank(employeeLink))
			{
				try
				{
					
					var objContext = nlapiGetContext();
					var intUsageRemaining = objContext.getRemainingUsage();
										
					if (intUsageRemaining <= 1000)
					{
						log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
						nlapiScheduleScript('customscript_innov_sched_update_employee', null, null);
						break;
						return 0;
					}
										
					var updateEmployee = nlapiLoadRecord('employee', employeeLink);
					updateEmployee.setFieldValue('custentity_emp_job_title_mirror', jobTitle);
					updateEmployee.setFieldValue('custentity_emp_team_mirror', team);
					updateEmployee.setFieldValue('custentity_emp_job_group_mirror', jobGroup);
					var updateId = nlapiSubmitRecord(updateEmployee);
					log.write('Job Title Updated: ' + updateId);
				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}
	}
}

/**
 * @name updateContractDetails
 * @author Eli eli@innov.co.uk
 * 11-12-2012
 * @description: Update 4 mirror fields in the employee record
 * Call a saved search with criteria 'Valid To' is blank.
 * Get the Employee Type 1 and Employee Type 2 result and load/update the employee records.
 */
var updateContractDetails = function(){
	var s = nlapiSearchRecord('customrecord_contract_details', 'customsearch_innov_update_contract');
	if(s != null)
	{
		for (var i = 0; i < s.length; i++)
		{
			var employeeLink = s[i].getValue('custrecord_contract_employee_link');
			var employmentType1 = s[i].getValue('custrecord_contract_employment_type1');
			var employmentType2 = s[i].getValue('custrecord_contract_employment_type2');

			if(!isBlank(employeeLink) && !isBlank(employmentType1) && !isBlank(employmentType2))
			{
				try
				{

					var objContext = nlapiGetContext();
					var intUsageRemaining = objContext.getRemainingUsage();					
					
					if (intUsageRemaining <= 1000)
					{
						log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
						nlapiScheduleScript('customscript_innov_sched_update_employee', null, null);
						break;
						return 0;
					}
										
					var updateEmployee = nlapiLoadRecord('employee', employeeLink);
					updateEmployee.setFieldValue('custentity_emp_employment_type_1_mirror', employmentType1);
					updateEmployee.setFieldValue('custentity_emp_employment_type_2_mirror', employmentType2);
					updateEmployee.setFieldValue('custentity_emp_empl_type1_mirror_subtab', employmentType1);
					updateEmployee.setFieldValue('custentity_emp_empl_type2_mirror_subtab', employmentType2);
					var updateId = nlapiSubmitRecord(updateEmployee);
					log.write('Contract Details Updated: ' + updateId);
				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}
	}
}

var updateEsop = function(obj, empId){

	var filters =
	[
		new nlobjSearchFilter('custrecord_esop_employee_link', null, 'is', empId)
	];

	var s = nlapiSearchRecord('customrecord_esop', 'customsearch_innov_esop_calc', filters, null);

	if(s != null)
	{
		var quantityOptions = parseFloat(0.00);
		var lapsedOptions = parseFloat(0.00);
		var esopBalance = parseFloat(0.00);

		for (var i = 0; i < s.length; i++)
		{
			var sum1 = parseFloat(s[i].getValue('custrecord_esop_quantity_options', null, 'sum')); //Quantity Options
			var sum2 = parseFloat(s[i].getValue('custrecord_esop_lapsed_options', null, 'sum')); //Lapsed Options (Exit)
			var sum3 = parseFloat(s[i].getValue('custrecord_esop_balance', null, 'sum')); //Balance

			if(isBlank(sum1))
			{
				sum1 = parseFloat(0.00);
			}
			if(isBlank(sum2))
			{
				sum2 = parseFloat(0.00);
			}
			if(isBlank(sum3))
			{
				sum3 = parseFloat(0.00);
			}

			quantityOptions += sum1;
			lapsedOptions += sum2;
			esopBalance += sum3;

			log.write('Quantity Options: ' + quantityOptions + ' | Lapsed Options (Exit):'  + lapsedOptions + ' | Balance: ' + esopBalance);
		}

		obj.setFieldValue('custentity_emp_esop_sum_options_offered', quantityOptions);
		obj.setFieldValue('custentity_emp_esop_sum_options_lapsed', lapsedOptions);
		obj.setFieldValue('custentity_emp_esop_sum_options_total', esopBalance);
	}
	
	return obj;
}