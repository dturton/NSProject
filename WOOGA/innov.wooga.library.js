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

//Mirror Fields
var fld = function(obj, empId){
	var termContractEffective = obj.getFieldValue('custentity_emp_term_contract_effective');
	var termLastWorkDay = obj.getFieldValue('custentity_emp_term_contract_lastworkday');

	obj.setFieldValue('custentity_term_contr_effective_mirror', termContractEffective);
	obj.setFieldValue('custentity_term_contr_lastworkday_mirror', termLastWorkDay);
}

//Scripted Mirror Field
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

			if(isBlank(sum1) || isNaN(sum1))
			{
				sum1 = parseFloat(0.00);
			}
			if(isBlank(sum2) || isNaN(sum2))
			{
				sum2 = parseFloat(0.00);
			}
			if(isBlank(sum3) || isNaN(sum3))
			{
				sum3 = parseFloat(0.00);
			}

			//log.write('ESOP: ' + empId + ' | Quantity Options: ' + sum1 + ' | Lapsed Options (Exit): ' + sum2 + ' | Balance: ' + sum3);

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
		if(s.length == 1)
		{
			var employeeLink = s[0].getValue('custrecord_supervisor_employee_link');
			var supervisor = s[0].getValue('custrecord_supervisor_name');
			var supervisorFrom = s[0].getValue('custrecord_supervisor_from');

			//log.write('Supervisor: ' + employeeLink + ' | Supervisor: ' + supervisor + ' | Date from: ' + supervisorFrom);
			obj.setFieldValue('supervisor', supervisor);
			obj.setFieldValue('custentity_emp_supervisor_from_mirror', supervisorFrom);
		}
		else
		{
			var supervisorArr = [];

			for (var i = 0; i < s.length; i++)
			{
				var employeeLink = s[i].getValue('custrecord_supervisor_employee_link');
				var supervisor = s[i].getValue('custrecord_supervisor_name');
				var supervisorFrom = s[i].getValue('custrecord_supervisor_from');

				//log.write('Supervisor: ' + supervisor + ' | Supervisor From: ' + supervisorFrom);

				//Store supervisor data

				if(!isBlank(employeeLink))
				{
					try
					{
						if(!isBlank(supervisorFrom))
						{
							supervisorArr.push
							(
								{
									'supervisor' : supervisor,
									'supervisorFrom' : nlapiStringToDate(supervisorFrom)
								}
							);
						}

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
				//log.write('Supervisor: ' + d[d.length - 1].supervisor + ' | Supervisor From: ' + d[d.length - 1].supervisorFrom);
				obj.setFieldValue('supervisor', d[d.length - 1].supervisor);
				obj.setFieldValue('custentity_emp_supervisor_from_mirror', nlapiDateToString(d[d.length - 1].supervisorFrom));
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
var updateJobTitleDetails = function(obj, id){

	var filters =
	[
		new nlobjSearchFilter('custrecord_jobtitle_employee_link', null, 'is', id)
	];

	var s = nlapiSearchRecord('customrecord_job_title', 'customsearch_innov_update_jobtitle', filters);

	if(s != null)
	{
		if(s.length == 1)
		{
			var employeeLink = s[0].getValue('custrecord_jobtitle_employee_link');
			var jobGroup = s[0].getValue('custrecord_jobtitle_job_group');
			var jobTitle = s[0].getValue('custrecord_jobtitle_job_title');
			var jobFrom = s[0].getValue('custrecord_jobtitle_jobinfo_from');
			var jobKey = s[0].getValue('custrecord_jobtitle_conducted_work');

			//log.write('Job Title: ' + jobTitle + ' | Job Group: ' + jobGroup + ' | Team: ' + team + ' | Job From: ' + jobFrom);

			obj.setFieldValue('custentity_emp_job_title_mirror', jobTitle);
			obj.setFieldValue('custentity_emp_job_group_mirror', jobGroup);
			obj.setFieldValue('custentity_emp_conducted_work_mirror', jobKey);
		}
		else
		{
			var jobTitleArr = [];

			for (var i = 0; i < s.length; i++)
			{
				var employeeLink = s[i].getValue('custrecord_jobtitle_employee_link');
				var jobGroup = s[i].getValue('custrecord_jobtitle_job_group');
				var jobTitle = s[i].getValue('custrecord_jobtitle_job_title');
				var jobFrom = s[i].getValue('custrecord_jobtitle_jobinfo_from');
				var jobKey = s[i].getValue('custrecord_jobtitle_conducted_work');

				//log.write('Job Title: ' + jobTitle + ' | Job Group: ' + jobGroup + ' | Team: ' + team + ' | Job From: ' + jobFrom);

				if(!isBlank(employeeLink))
				{
					try
					{
						if(!isBlank(jobFrom))
						{
							jobTitleArr.push
							(
								{
									'jobGroup' : jobGroup,
									'jobTitle' : jobTitle,
									'jobKey' : jobKey,
									'jobFrom' : nlapiStringToDate(jobFrom)
								}
							)
						}
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
				obj.setFieldValue('custentity_emp_job_group_mirror', d[d.length - 1].jobGroup);
				obj.setFieldValue('custentity_emp_conducted_work_mirror', d[d.length - 1].jobKey);
			}
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
			var costCenter = s[0].getValue('custrecord_cc_main_hierarchy');
			var costCenterValidFrom = s[0].getValue('custrecord_cc_info_valid_from'); //date
			var costCenterValidTo = s[0].getValue('custrecord_cc_info_valid_to'); //date
			var department = s[0].getValue('department');
			var team = s[0].getValue('custrecord_cc_team');

			//Main
			var mainCC = s[0].getValue('custrecord_cc_main_hierarchy');
			var mainCCName = s[0].getValue('custrecord_cc_main_name');
			var mainCCNumber = s[0].getValue('custrecord_cc_main_number');
			var mainCCPercentage = s[0].getValue('custrecord_cc_main_percentage');

			//cc2
			var CC2 = s[0].getValue('custrecord_cc_cc2_hierarchy');
			var CC2Name = s[0].getValue('custrecord_cc_cc2_name');
			var CC2No = s[0].getValue('custrecord_cc_cc2_no');
			var CC2Percentage = s[0].getValue('custrecord_cc_cc2_percentage');

			//cc3
			var CC3 = s[0].getValue('custrecord_cc_cc3_hierarchy');
			var CC3Name = s[0].getValue('custrecord_cc_cc3_name');
			var CC3No = s[0].getValue('custrecord_cc_cc3_no');
			var CC3Percentage = s[0].getValue('custrecord_cc_cc3_percentage');

			//cc4
			var CC4 = s[0].getValue('custrecord_cc_cc4_hierarchy');
			var CC4Name = s[0].getValue('custrecord_cc_cc4_name');
			var CC4No = s[0].getValue('custrecord_cc_cc4_no');
			var CC4Percentage = s[0].getValue('custrecord_cc_cc4_percentage');

			//log.write('Cost Center: ' + costCenter + ' | CC Valid: ' + costCenterValidFrom + ' | Team: ' + team);

			if(!isBlank(costCenter))
			{
				obj.setFieldValue('department', costCenter);
				var employeeLocation = nlapiLookupField('department', costCenter, 'custrecord_cc_emp_office_location_master');
				//log.write('Cost Center - Employee location: ' + employeeLocation);
				if(!isBlank(employeeLocation))
				{
					obj.setFieldValue('custentity_emp_emp_office_location', employeeLocation); //Employee Location
				}
			}

			obj.setFieldValue('custentity_emp_main_cc_from_mirror_mhead', costCenterValidFrom); //Main Cost Center - Valid From - Mirror
			obj.setFieldValue('custentity_emp_team_mirror', team); //Team Mirror
			obj.setFieldValue('custentity_emp_cc_cc_info_from_mirror', costCenterValidFrom); //CC Info - Valid From - Mirror

			//CC1
			obj.setFieldValue('custentity_emp_cc_main_cc_no_mirror', mainCCNumber); //Main CC - No. - Mirror
			obj.setFieldValue('custentity_emp_cc_main_cc_name_mirror', mainCCName); //Main CC - Name - Mirror
			obj.setFieldValue('custentity_emp_cc_main_cc_perc_mirror', mainCCPercentage); //Main CC - % - Mirror

			//CC2
			obj.setFieldValue('custentity_emp_cc_cc2_no_mirror', CC2No); //CC 2 - No. - Mirror
			obj.setFieldValue('custentity_emp_cc_cc2_name_mirror', CC2Name); //CC 2 - Name - Mirror
			obj.setFieldValue('custentity_emp_cc_cc2_perc_mirror', CC2Percentage); //CC 2 - % - Mirror

			//CC3
			obj.setFieldValue('custentity_emp_cc_cc3_no_mirror', CC3No); //CC 3 - No. - Mirror
			obj.setFieldValue('custentity_emp_cc_cc3_name_mirror', CC3Name); //CC 3 - Name - Mirror
			obj.setFieldValue('custentity_emp_cc_cc3_perc_mirror', CC3Percentage); //CC 4 - % - Mirror

			//CC4
			obj.setFieldValue('custentity_emp_cc_cc4_no_mirror', CC4No); //CC 4 - No. - Mirror
			obj.setFieldValue('custentity_emp_cc_cc4_name_mirror', CC4Name); //CC 3 - Name - Mirror
			obj.setFieldValue('custentity_emp_cc_cc4_perc_mirror', CC4Percentage); //CC 4 - % - Mirror


		}
		else
		{
			var costCenterArr = [];

			for (var i = 0; i < s.length; i++)
			{
				var employeeLink = s[i].getValue('custrecord_cc_employee_link');
				var costCenter = s[i].getValue('custrecord_cc_main_hierarchy');
				var costCenterValidFrom = s[i].getValue('custrecord_cc_info_valid_from'); //date
				var costCenterValidTo = s[i].getValue('custrecord_cc_info_valid_to'); //date
				var department = s[i].getValue('department');
				var team = s[i].getValue('custrecord_cc_team');

				//Main
				var mainCC = s[i].getValue('custrecord_cc_main_hierarchy');
				var mainCCName = s[i].getValue('custrecord_cc_main_name');
				var mainCCNumber = s[i].getValue('custrecord_cc_main_number');
				var mainCCPercentage = s[i].getValue('custrecord_cc_main_percentage');

				//cc2
				var CC2 = s[i].getValue('custrecord_cc_cc2_hierarchy');
				var CC2Name = s[i].getValue('custrecord_cc_cc2_name');
				var CC2No = s[i].getValue('custrecord_cc_cc2_no');
				var CC2Percentage = s[i].getValue('custrecord_cc_cc2_percentage');

				//cc3
				var CC3 = s[i].getValue('custrecord_cc_cc3_hierarchy');
				var CC3Name = s[i].getValue('custrecord_cc_cc3_name');
				var CC3No = s[i].getValue('custrecord_cc_cc3_no');
				var CC3Percentage = s[i].getValue('custrecord_cc_cc3_percentage');

				//cc4
				var CC4 = s[i].getValue('custrecord_cc_cc4_hierarchy');
				var CC4Name = s[i].getValue('custrecord_cc_cc4_name');
				var CC4No = s[i].getValue('custrecord_cc_cc4_no');
				var CC4Percentage = s[i].getValue('custrecord_cc_cc4_percentage');

				//log.write('Cost Center: ' + costCenter + ' | CC Valid: ' + costCenterValidFrom + ' | Team: ' + team);

				if(!isBlank(employeeLink))
				{
					try
					{
						if(!isBlank(costCenterValidFrom))
						{
							costCenterArr.push
							(
								{
									'employeeLink' : employeeLink,
									'costCenter' : costCenter,
									'costCenterValidFrom' : nlapiStringToDate(costCenterValidFrom),
									'department' : department,
									'team' : team,
									'mainCC' : mainCC,
									'mainCCName' : mainCCName,
									'mainCCNumber' : mainCCNumber,
									'mainCCPercentage' : mainCCPercentage,
									'CC2' : CC2,
									'CC2Name' : CC2Name,
									'CC2No' : CC2No,
									'CC2Percentage' : CC2Percentage,
									'CC3' : CC3,
									'CC3Name' : CC3Name,
									'CC3No' : CC3No,
									'CC3Percentage' : CC3Percentage,
									'CC4' : CC4,
									'CC4Name' : CC4Name,
									'CC4No' : CC4No,
									'CC4Percentage' : CC4Percentage
								}
							)
						}
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

				obj.setFieldValue('custentity_emp_main_cc_from_mirror_mhead', nlapiDateToString(d[d.length - 1].costCenterValidFrom));
				obj.setFieldValue('custentity_emp_team_mirror', d[d.length - 1].team);
				obj.setFieldValue('custentity_emp_cc_cc_info_from_mirror', nlapiDateToString(d[d.length - 1].costCenterValidFrom));

				//CC1
				obj.setFieldValue('custentity_emp_cc_main_cc_no_mirror', d[d.length - 1].mainCCNumber);
				obj.setFieldValue('custentity_emp_cc_main_cc_name_mirror', d[d.length - 1].mainCCName);
				obj.setFieldValue('custentity_emp_cc_main_cc_perc_mirror', d[d.length - 1].mainCCPercentage);

				//CC2
				obj.setFieldValue('custentity_emp_cc_cc2_no_mirror', d[d.length - 1].CC2No);
				obj.setFieldValue('custentity_emp_cc_cc2_name_mirror', d[d.length - 1].CC2Name);
				obj.setFieldValue('custentity_emp_cc_cc2_perc_mirror', d[d.length - 1].CC2Percentage);

				//CC3
				obj.setFieldValue('custentity_emp_cc_cc3_no_mirror', d[d.length - 1].CC3No);
				obj.setFieldValue('custentity_emp_cc_cc3_name_mirror', d[d.length - 1].CC3Name);
				obj.setFieldValue('custentity_emp_cc_cc3_perc_mirror', d[d.length - 1].CC3Percentage);

				//CC4
				obj.setFieldValue('custentity_emp_cc_cc4_no_mirror', d[d.length - 1].CC4No);
				obj.setFieldValue('custentity_emp_cc_cc4_name_mirror', d[d.length - 1].CC4Name);
				obj.setFieldValue('custentity_emp_cc_cc4_perc_mirror', d[d.length - 1].CC4Percentage);

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
			var paymentRate = s[0].getValue('custrecord_contract_payment_rate'); //Payment Rate
			var daysweek = s[0].getValue('custrecord_contract_work_days_week'); //Working Hours/Week

			//log.write('Contract Details: ' + employeeLink + ' | Emp Type1: ' + employmentType1 + ' | Emp Type2: ' + employmentType2 + ' | salaryType: ' + salaryType);
			//log.write('Contract Details: ' + employeeLink + ' | Base Salary: ' + baseSalary + ' | Salary Amount: ' + salaryAmount + ' | Curr: ' + curr);
			//log.write('Contract Details: ' + employeeLink + ' | FTE: ' + fte + ' | work hrs week: ' + workhrsweek + ' | Valid from: ' + validFrom);

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
			obj.setFieldValue('custentity_emp_payment_rate_mirror', paymentRate); //Payment Rate
			obj.setFieldValue('custentity_emp_days_per_week_mirror', daysweek); //Days/Week
			obj.setFieldValue('custentity_emp_salary_valid_from_mirror', validFrom); //Salary - Valid From
		}
		else
		{
			var contractDetails = [];

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
				var validFrom = s[i].getValue('custrecord_contract_empl_details_from');
				var paymentRate = s[i].getValue('custrecord_contract_payment_rate'); //Payment Rate
				var daysweek = s[i].getValue('custrecord_contract_work_days_week'); //Working Hours/Week

				//log.write('Contract Details: ' + employeeLink + ' | Emp Type1: ' + employmentType1 + ' | Emp Type2: ' + employmentType2 + ' | salaryType: ' + salaryType);
				//log.write('Contract Details: ' + employeeLink + ' | Base Salary: ' + baseSalary + ' | Salary Amount: ' + salaryAmount + ' | Curr: ' + curr);
				//log.write('Contract Details: ' + employeeLink + ' | FTE: ' + fte + ' | work hrs week: ' + workhrsweek + ' | Valid from: ' + validFrom);

				if(!isBlank(employeeLink))
				{
					try
					{
						if(!isBlank(validFrom))
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
									'validFrom' : nlapiStringToDate(validFrom),
									'paymentRate' : paymentRate,
									'daysweek' : daysweek
								}
							);
						}
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
				obj.setFieldValue('custentity_emp_payment_rate_mirror', d[d.length - 1].paymentRate); //Payment Rate
				obj.setFieldValue('custentity_emp_days_per_week_mirror', d[d.length - 1].daysweek); //Days/Week
				obj.setFieldValue('custentity_emp_salary_valid_from_mirror', nlapiDateToString(d[d.length - 1].validFrom));  //Salary - Valid From

			}
		}
	}
}


var updateFiles = function(empObj, empId){
	var filters =
	[
		new nlobjSearchFilter('custrecord_files_employee_link', null, 'is', empId)
	];

	try
	{
		var s = nlapiSearchRecord('customrecord_files', 'customsearch_innov_update_files', filters, null);

		if(s != null)
		{
			for (var i = 0; i < s.length; i++)
			{
				var filesId = s[i].getId();
				var fileId = s[i].getValue('custrecord_files_attached_files');
				file(fileId, empId, filesId);
			}
		}
	}
	catch(ex)
	{
		log.error(ex);
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
var updateBankDetails = function(obj, id){

	var filters =
	[
		new nlobjSearchFilter('custrecord_bankdet_employee_link', null, 'is', id)
	];

	var s = nlapiSearchRecord('customrecord_bank_details', 'customsearch_innov_bank_details', filters);

	if(s != null)
	{
		if(s.length == 1)
		{
			var employeeLink = s[0].getValue('custrecord_bankdet_employee_link');
			var isActive = s[0].getValue('custrecord_bankdet_active'); //Active
			var accountNumber = s[0].getValue('custrecord_bankdet_account_number'); //Account Number
			var bankCode = s[0].getValue('custrecord_bankdet_bank_code'); //Bank Code
			var bankName = s[0].getValue('custrecord_bankdet_bank_name'); //Bank Name
			var iban = s[0].getValue('custrecord_bankdet_iban'); //IBAN
			var swift = s[0].getValue('custrecord_bankdet_swift'); //Swift
			var validFrom = s[0].getValue('custrecord_bankdet_valid_from'); //Valid From
			var validTo = s[0].getValue('custrecord_bankdet_valid_to'); //Valid To

			if(isActive == 'T')
			{
				obj.setFieldValue('custentity_emp_bank_account_no_mirror', accountNumber);
				obj.setFieldValue('custentity_emp_bank_code_mirror', bankCode);
				obj.setFieldValue('custentity_emp_bank_name_mirror', bankName);
				obj.setFieldValue('custentity_emp_bank_iban_mirror', iban);
				obj.setFieldValue('custentity_emp_bank_swift_mirror', swift);
			}
		}
		else
		{
			var bankDetails = [];

			for (var i = 0; i < s.length; i++)
			{
				var employeeLink = s[i].getValue('custrecord_bankdet_employee_link');
				var isActive = s[i].getValue('custrecord_bankdet_active'); //Active
				var accountNumber = s[i].getValue('custrecord_bankdet_account_number'); //Account Number
				var bankCode = s[i].getValue('custrecord_bankdet_bank_code'); //Bank Code
				var bankName = s[i].getValue('custrecord_bankdet_bank_name'); //Bank Name
				var iban = s[i].getValue('custrecord_bankdet_iban'); //IBAN
				var swift = s[i].getValue('custrecord_bankdet_swift'); //Swift
				var validFrom = s[i].getValue('custrecord_bankdet_valid_from'); //Valid From
				var validTo = s[i].getValue('custrecord_bankdet_valid_to'); //Valid To

				if(!isBlank(employeeLink))
				{
					try
					{
						if(!isBlank(validFrom))
						{
							bankDetails.push
							(
								{
									'employeeLink' : employeeLink,
									'isActive' : isActive,
									'accountNumber' : accountNumber,
									'bankCode' : bankCode,
									'bankName' : bankName,
									'iban' : iban,
									'swift' : swift,
									'validFrom' : validFrom,
									'validTo' : validTo
								}
							);
						}
					}
					catch(ex)
					{
						log.error(ex);
					}
				}
			}

			if(!isBlank(bankDetails))
			{
				var d = bankDetails.sort(sortByDateBankDetails);

				if(d[d.length - 1].isActive == 'T')
				{
					obj.setFieldValue('custentity_emp_bank_account_no_mirror', d[d.length - 1].accountNumber);
					obj.setFieldValue('custentity_emp_bank_code_mirror', d[d.length - 1].bankCode);
					obj.setFieldValue('custentity_emp_bank_name_mirror', d[d.length - 1].bankName);
					obj.setFieldValue('custentity_emp_bank_iban_mirror', d[d.length - 1].iban);
					obj.setFieldValue('custentity_emp_bank_swift_mirror', d[d.length - 1].swift);
				}
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

function sortByDateBankDetails(a, b){
    return a['validFrom'].getTime() - b['validFrom'].getTime();
}

var file = function(fileId, empId, filesId){

	var obj = nlapiLoadFile(fileId);
	var desc = obj.getDescription();
	var folder = obj.getFolder();
	var _id = obj.getId();
	var _name = obj.getName();
	var size = obj.getSize();
	var _type = obj.getType();
	var url = obj.getURL();
	var val = obj.getValue();
	var isinactive = obj.isInactive();
	var isonline = obj.isOnline();

	var folderObj = nlapiLoadRecord('folder', folder);

	if(!isBlank(folderObj))
	{
		var folderName = folderObj.getFieldValue('name');
		log.write('Folder Name: ' + folderName);
	}

	log.write('File ID: ' + filesId +  ' | Name: ' + _name + ' | Size: ' +  size + ' | Type: ' + _type + ' | url: ' + url + ' | val: ' + val);

	var f = nlapiLoadRecord('customrecord_files', filesId);
	f.setFieldValue('custrecord_files_folder', folderName);
	f.setFieldValue('custrecord_files_file_size_kb', size);
	f.setFieldValue('custrecord_files_document_type', _type);
	f.setFieldValue('custrecord_files_file_url', url);
	var fId = nlapiSubmitRecord(f, true);
	log.write('Folder Update: ' + fId);
}
