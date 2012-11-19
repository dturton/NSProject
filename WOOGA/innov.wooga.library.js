var Log=function(b){this.type=b;this.write=function(a){nlapiLogExecution(b,a)};this.error=function(a){a=null!=a.getCode?a.getCode()+": "+a.getDetails():"Error: "+(null!=a.message?a.message:a);nlapiLogExecution(b,"ERROR: "+a)}},isBlank=function(b){return""==b||null==b||void 0==b||32==b.toString().charCodeAt()?!0:!1},days_between=function(b,a){var c=b.getTime(),d=a.getTime(),c=Math.abs(c-d);return Math.round(c/864E5)};


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
		obj.setFieldValue('custentity_emp_team_mirror', team);
		obj.setFieldValue('custentity_emp_job_group_mirror', jobGroup);
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

var esop = function(obj, empId){

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
		}

		obj.setFieldValue('custentity_emp_esop_sum_options_offered', quantityOptions);
		obj.setFieldValue('custentity_emp_esop_sum_options_lapsed', lapsedOptions);
		obj.setFieldValue('custentity_emp_esop_sum_options_total', esopBalance);
	}
}


/**
 * @name updateSupervisor
 * @author Eli eli@innov.co.uk
 * 11-12-2012
 * @description: Update Supervisor and Supervisor from fields in the employee record
 * Call a saved search
 */
var updateSupervisor = function(obj, id){

	var filters =
	[
		new nlobjSearchFilter('custrecord_supervisor_employee_link', null, 'is', id)
	];

	var s = nlapiSearchRecord('customrecord_cr_innv_supervisor_hierachy', 'customsearch_innov_update_supervisor', filters, null);

	if(s != null)
	{
		var supervisorArr = [];

		for (var i = 0; i < s.length; i++)
		{
			var employeeLink = s[i].getValue('custrecord_supervisor_employee_link');
			var supervisor = s[i].getValue('custrecord_supervisor_name');
			var supervisorFrom = nlapiStringToDate(s[i].getValue('custrecord_supervisor_from'));

			//Store supervisor data

			if(!isBlank(employeeLink))
			{
				try
				{
					supervisorArr.push
					(
						{
							'supervisor' : supervisor,
							'supervisorFrom' : supervisorFrom
						}
					);

				log.write('Supervisor: ' + supervisor + ' | Supervisor From: ' + supervisorFrom);

				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}

		if(!isBlank(supervisorArr))
		{
			var d = supervisorArr.sort(sortByDate);
			log.write('Supervisor: ' + d[d.length - 1].supervisor + ' | Supervisor From: ' + d[d.length - 1].supervisorFrom);
			obj.setFieldValue('supervisor', d[d.length - 1].supervisor);
			obj.setFieldValue('custentity_emp_supervisor_from_mirror', nlapiDateToString(d[d.length - 1].supervisorFrom));
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
var updateJobTitleDetails = function(obj, id){

	var filters =
	[
		new nlobjSearchFilter('custrecord_jobtitle_employee_link', null, 'is', id)
	];

	var s = nlapiSearchRecord('customrecord_job_title', 'customsearch_innov_update_jobtitle', filters);

	if(s != null)
	{
		var jobTitleArr = [];

		for (var i = 0; i < s.length; i++)
		{
			var employeeLink = s[i].getValue('custrecord_jobtitle_employee_link');
			var jobGroup = s[i].getValue('custrecord_jobtitle_job_group');
			var jobTitle = s[i].getValue('custrecord_jobtitle_job_title');
			var team = s[i].getValue('custrecord_jobtitle_team');
			var jobFrom = s[i].getValue('custrecord_jobtitle_jobinfo_from');

			if(!isBlank(employeeLink))
			{
				try
				{
					jobTitleArr.push
					(
						{
							'jobGroup' : jobGroup,
							'jobTitle' : jobTitle,
							'team' : team,
							'jobFrom' : nlapiStringToDate(jobFrom)
						}
					)
				}
				catch(ex)
				{
					log.error(ex);
				}
			}
		}

		if(!isBlank(jobTitleArr))
		{
			var d = jobTitleArr.sort(sortByDateJobTitle);
			obj.setFieldValue('custentity_emp_job_title_mirror', d[d.length - 1].jobTitle);
			obj.setFieldValue('custentity_emp_team_mirror', d[d.length - 1].team);
			obj.setFieldValue('custentity_emp_job_group_mirror', d[d.length - 1].jobGroup);
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
			
			log.write('Cost Center: ' + employeeLink + ' | CC: ' + costCenter + ' | CC Valid: ' + costCenterValidFrom + ' | Team: ' + team);

			if(!isBlank(costCenter))
			{
				obj.setFieldValue('department', costCenter);
				var employeeLocation = nlapiLookupField('department', costCenter, 'custrecord_cc_emp_office_location_master');
				log.write('Employee location: ' + employeeLocation);
				if(!isBlank(employeeLocation))
				{
					obj.setFieldValue('custentity_emp_emp_office_location', employeeLocation); //Employee Location
				}
			}

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
				
				if(!isBlank(d[d.length - 1].costCenter))
				{
					obj.setFieldValue('department', d[d.length - 1].costCenter);
					var employeeLocation = nlapiLookupField('department', d[d.length - 1].costCenter, 'custrecord_cc_emp_office_location_master');
					if(!isBlank(employeeLocation))
					{
						obj.setFieldValue('custentity_emp_emp_office_location', employeeLocation);
					}
				}				
				
				obj.setFieldValue('custentity_emp_main_cc_valid_from_mirror', nlapiDateToString(d[d.length - 1].costCenterValidFrom));
				obj.setFieldValue('custentity_emp_team_mirror', d[d.length - 1].team);
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
var updateContractDetails = function(obj, id){

	var filters =
	[
		new nlobjSearchFilter('custrecord_contract_employee_link', null, 'is', id)
	];

	var s = nlapiSearchRecord('customrecord_contract_details', 'customsearch_innov_update_contract', filters);

	if(s != null)
	{
		var contractDetails = [];

		if(s.length == 1)
		{
			var employeeLink = s[0].getValue('custrecord_contract_employee_link');
			var employmentType1 = s[0].getValue('custrecord_contract_employment_type1'); //Employment Type 1
			var employmentType2 = s[0].getValue('custrecord_contract_employment_type2'); //Employment Type 2
			var salaryType = s[0].getValue('custrecord_contract_salary_type'); //Salary Type
			var baseSalary = s[0].getValue('custrecord_contract_base_salary'); //Base Salary (Month)
			var salaryAmount = s[0].getValue('custrecord_contract_salary_amount'); //Salary Amount (Month)
			var curr = s[0].getValue('custrecord_contract_salary_currency'); //Curr
			var fte = s[0].getValue('custrecord_contract_fte'); //FTE
			var workhrsweek = s[0].getValue('custrecord_contract_work_hours_week'); //Working Hours/Week
			var comments = s[0].getValue('custrecord_contract_comments'); //Comments
			var validFrom = s[0].getValue('custrecord_contract_empl_details_from');

			obj.setFieldValue('custentity_emp_employment_type_1_mirror', employmentType1);
			obj.setFieldValue('custentity_emp_employment_type_2_mirror', employmentType2);
			obj.setFieldValue('custentity_emp_empl_type1_mirror_subtab', employmentType1);
			obj.setFieldValue('custentity_emp_empl_type2_mirror_subtab', employmentType2);
			obj.setFieldValue('custentity_emp_salary_type_mirror', salaryType); //Salary Type - Mirror
			obj.setFieldValue('custentity_emp_base_salary_mirror', baseSalary); //Base Salary (Month) - Mirror
			obj.setFieldValue('custentity_emp_salary_amount_mirror', salaryAmount); //Salary Amount - Mirror
			obj.setFieldValue('custentity_emp_salary_currency_mirror', curr); //Salary Currency - Mirror
			obj.setFieldValue('custentity_emp_working_hours_week_mirror', workhrsweek); //Working Hours/Week - Mirror
			obj.setFieldValue('custentity_emp_fte_mirror', fte); //FTE - Mirror
			obj.setFieldValue('custentity_emp_contract_comments_mirror', comments); //Contract Details - Comments - Mirror
		}
		else
		{
			for (var i = 0; i < s.length; i++)
			{
				var employeeLink = s[i].getValue('custrecord_contract_employee_link');
				var employmentType1 = s[i].getValue('custrecord_contract_employment_type1'); //Employment Type 1
				var employmentType2 = s[i].getValue('custrecord_contract_employment_type2'); //Employment Type 2
				var salaryType = s[i].getValue('custrecord_contract_salary_type'); //Salary Type
				var baseSalary = s[i].getValue('custrecord_contract_base_salary'); //Base Salary (Month)
				var salaryAmount = s[i].getValue('custrecord_contract_salary_amount'); //Salary Amount (Month)
				var curr = s[i].getValue('custrecord_contract_salary_currency'); //Curr
				var fte = s[i].getValue('custrecord_contract_fte'); //FTE
				var workhrsweek = s[i].getValue('custrecord_contract_work_hours_week'); //Working Hours/Week
				var comments = s[i].getValue('custrecord_contract_comments'); //Comments
				var validFrom = nlapiStringToDate(s[i].getValue('custrecord_contract_empl_details_from'));


				if(!isBlank(employeeLink))
				{
					try
					{
						contractDetails.push
						(
							{
								'employeeLink' : employeeLink,
								'employmentType1' : employmentType1,
								'employmentType2' : employmentType2,
								'salaryType' : salaryType,
								'baseSalary' : baseSalary,
								'salaryAmount' : salaryAmount,
								'curr' : curr,
								'fte' : fte,
								'workhrsweek' : workhrsweek,
								'comments' : comments,
								'validFrom' : nlapiStringToDate(validFrom)
							}
						);
					}
					catch(ex)
					{
						log.error(ex);
					}
				}
			}

			if(!isBlank(contractDetails))
			{
				var d = contractDetails.sort(sortByDateContractDetails);
				obj.setFieldValue('custentity_emp_employment_type_1_mirror', d[d.length - 1].employmentType1);
				obj.setFieldValue('custentity_emp_employment_type_2_mirror', d[d.length - 1].employmentType2);
				obj.setFieldValue('custentity_emp_empl_type1_mirror_subtab', d[d.length - 1].employmentType1);
				obj.setFieldValue('custentity_emp_empl_type2_mirror_subtab', d[d.length - 1].employmentType2);
				obj.setFieldValue('custentity_emp_salary_type_mirror', d[d.length - 1].salaryType); //Salary Type - Mirror
				obj.setFieldValue('custentity_emp_base_salary_mirror', d[d.length - 1].baseSalary); //Base Salary (Month) - Mirror
				obj.setFieldValue('custentity_emp_salary_amount_mirror', d[d.length - 1].salaryAmount); //Salary Amount - Mirror
				obj.setFieldValue('custentity_emp_salary_currency_mirror', d[d.length - 1].curr); //Salary Currency - Mirror
				obj.setFieldValue('custentity_emp_working_hours_week_mirror', d[d.length - 1].workhrsweek); //Working Hours/Week - Mirror
				obj.setFieldValue('custentity_emp_fte_mirror', d[d.length - 1].fte); //FTE - Mirror
				obj.setFieldValue('custentity_emp_contract_comments_mirror', d[d.length - 1].comments); //Contract Details - Comments - Mirror
			}
		}
	}
}

function sortByDate(a, b){
    return a['supervisorFrom'].getTime() - b['supervisorFrom'].getTime();
}

function sortByDateJobTitle(a, b){
    return a['jobFrom'].getTime() - b['jobFrom'].getTime();
}

function sortByDateCostCenter(a, b){
    return a['costCenterValidFrom'].getTime() - b['costCenterValidFrom'].getTime();
}

function sortByDateContractDetails(a, b){
    return a['validFrom'].getTime() - b['validFrom'].getTime();
}