function postLead(datain) {

    var arr = [];

    arr.push
	(
		{
		    'prog': datain.prog,
		    'isperson': datain.isperson,
		    'firstname': datain.firstname,
		    'lastname': datain.lastname,
		    'email': datain.email,
		    'parents_email': datain.parents_email,
		    'category': datain.category,
		    'phone': datain.phone,
		    'phonenumber': datain.phonenumber,
		    'comments': datain.comments
		}
	);


    if (datain.process == 'addLead') {
        if (!isBlank(arr)) {
            var create = nlapiCreateRecord('lead');
            create.setFieldValue('isperson', arr.isperson);
            create.setFieldValue('firstname', arr.firstname);
            create.setFieldValue('lastname', arr.lastname);
            create.setFieldValue('custentity142', arr.email);
            create.setFieldValue('email', arr.parents_email);
            create.setFieldValue('category', arr.category);
            create.setFieldValue('custentity143', arr.phonenumber);
            create.setFieldValue('phone', arr.phone);
            create.setFieldValue('comments', arr.comments);
            try {
                nlapiSubmitRecord(create, true);
            }
            catch (ex) {
                nlapiLogExecution('ERROR', 'Error: ' + ex.Message);
            }
        }
    }
} // End Post Request

function isBlank(test) { if ((test == '') || (test == null) || (test == undefined) || (test.toString().charCodeAt() == 32)) { return true } else { return false } }