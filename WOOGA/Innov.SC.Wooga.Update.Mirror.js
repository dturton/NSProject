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
		schedUpdateCostCenter();
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var schedUpdateCostCenter = function(){

	var emp = [109, 112, 113, 308, 114, 115, 118, 119, 121, 122, 123, 124, 124, 125, 126, 129, 130, 135, 136, 137, 139, 140, 141, 144, 145, 147, 148, 149, 150, 151, 152, 156, 157, 158, 159, 160, 161, -5, 163, 165, 166, 168, 169, 170, 172, 173, 174, 175, 177, 178, 179, 181, 182, 183, 185, 186, 187, 188, 191, 192, 609, 193, 194, 195, 310, 197, 198, 199, 201, 203, 204, 205, 206, 207, 208, 210, 211, 212, 213, 214, 215, 311, 216, 217, 218, 219, 220, 222, 223, 224, 227, 228, 229, 231, 232, 233, 313, 236, 237, 238, 239, 242, 243, 244, 245, 246, 314, 248, 249, 251, 252, 253, 256, 257, 258, 259, 260, 262, 265, 266, 268, 269, 270, 271, 272, 273, 274, 276, 710, 711, 712, 1734, 1757, 716, 719, 722, 723, 724, 728, 1740, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 747, 1729, 748, 749, 1742, 1735, 1737, 751, 1733, 752, 753, 755, 756, 757, 1749, 1738, 1746, 758, 1744, 759, 760, 762, 764, 765, 766, 767, 1752, 1741, 1753, 1739, 1727, 1747, 1732, 1731, 1745, 1833, 768, 769, 770, 1759, 773, 1755, 1730, 775, 777, 778, 779, 1750, 1758, 1754, 1763];

	for(var a in emp)
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
			var obj = nlapiLoadRecord('employee', emp[a]);
			updateCostCenter(obj, emp[a]);
			nlapiSubmitRecord(obj);
		}
		catch(ex)
		{
			log.error(ex);
		}
	}
}

/**
 * @name updateCostCenter
 * @author Eli eli@innov.co.uk
 * 11-12-2012
 * @description: Update
 * Call a saved search
 */
var updateCostCenter = function(obj, id){

	var filters =
	[
		new nlobjSearchFilter('custrecord_cc_employee_link', null, 'is', id)
	];

	var s = nlapiSearchRecord('customrecord_cost_center', 'customsearch_innov_update_costcenter', filters);

	if(s != null)
	{

		if(s.length == 1)
		{
			var employeeLink = s[0].getValue('custrecord_cc_employee_link');
			var costCenter = s[0].getValue('custrecord_cc_main_number_and_name');
			var costCenterValidFrom = s[0].getValue('custrecord_cc_main_valid_from'); //date
			var department = s[0].getValue('department');
			var team = s[0].getValue('custrecord_cc_team');

			obj.setFieldValue('department', costCenter);
			obj.setFieldValue('custentity_emp_main_cc_valid_from_mirror', costCenterValidFrom);
			obj.setFieldValue('custentity_emp_team_mirror', team);
		}
		else
		{
			var costCenterArr = [];

			for (var i = 0; i < s.length; i++)
			{
				var employeeLink = s[i].getValue('custrecord_cc_employee_link');
				var costCenter = s[i].getValue('custrecord_cc_main_number_and_name');
				var costCenterValidFrom = s[i].getValue('custrecord_cc_main_valid_from'); //date
				var department = s[i].getValue('department');
				var team = s[i].getValue('custrecord_cc_team');

				if(!isBlank(employeeLink))
				{
					try
					{
						costCenterArr.push
						(
							{
								'employeeLink' : employeeLink,
								'costCenter' : costCenter,
								'costCenterValidFrom' : nlapiStringToDate(costCenterValidFrom),
								'department' : department,
								'team' : team
							}
						)
					}
					catch(ex)
					{
						log.error(ex);
					}
				}
			}

			if(!isBlank(costCenterArr))
			{
				var d = costCenterArr.sort(sortByDateCostCenter);
				obj.setFieldValue('department', d[d.length - 1].costCenter);
				obj.setFieldValue('custentity_emp_main_cc_valid_from_mirror', nlapiDateToString(d[d.length - 1].costCenterValidFrom));
				obj.setFieldValue('custentity_emp_team_mirror', d[d.length - 1].team);
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