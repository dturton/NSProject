/**
 * Created with JetBrains WebStorm.
 * User: tobydavidson
 * Date: 11/13/12
 * Time: 9:37 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * @fileOverview
 * @name Innov.GOP.GeneratePDF.js
 * @author Eliseo Beltran
 * @version 2.0
 * Deployed on Product Specs (Custom Record)
 * @description: PDF generator
 * 2012.07.03 - Removed Address sourcing
 */

var log = new Log('DEBUG');

var beforeSubmit = function(type){
    if(type == 'create' || type == 'edit'){
        if(type == 'edit'){
            var custrecord_product_docversion = parseInt(nlapiGetFieldValue('custrecord_product_docversion'));
            if(isNaN(custrecord_product_docversion))
            {
                custrecord_product_docversion = 1;
            }
            custrecord_product_docversion += 1;
            nlapiSetFieldValue('custrecord_product_docversion', custrecord_product_docversion);
        }
    }
}

var afterSubmit = function(type){
    if(type == 'create' || type == 'edit')
    {
        try
        {
            var recordId = nlapiGetRecordId();
            var recordType = nlapiGetRecordType();
            var obj = nlapiLoadRecord(recordType, recordId);

            var PRODUCT_CREATED = '7';
            var stat = obj.getFieldValue('custrecord_specstatus');
            var item = obj.getFieldValue('custrecord_itemlink');
            nlapiLogExecution('DEBUG','stat: ' + stat);
            nlapiLogExecution('DEBUG','item: ' + item);

            if(stat == PRODUCT_CREATED && isBlank(item))
            {
                log.write('----- Creating Item -----');
                try
                {
                    var itemID = createItem(obj, recordId);
                    nlapiSubmitField(recordType, recordId, 'custrecord_itemlink', itemID);
                }
                catch(ex)
                {
                    log.error(ex);
                }
            }

            var filename = obj.getFieldValue('custrecord_product_code');
            nlapiLogExecution('DEBUG','Generating Customer XML' );
            var xml_cust = "";
            xml_cust += generatePDF(obj, 'customer');
            nlapiLogExecution('DEBUG','Generated Customer XML' , xml_cust);

            var fileCust = nlapiXMLToPDF(xml_cust);

            nlapiLogExecution('DEBUG','Generated Customer PDF' );

            var customer = obj.getFieldValue('custrecord_productspec_customer');
            var cust = nlapiLookupField('customer', customer, 'entityid');
            var version = obj.getFieldValue('custrecord_product_docversion');

            fileCust.setName(filename + "_" + cust + "_C_V_" + version + ".pdf");
            fileCust.setFolder(9);

            try
            {
                var fileidCust = nlapiSubmitFile(fileCust);
                nlapiSubmitField(recordType, recordId, 'custrecord_customer_specs_pdf', fileidCust);
            }
            catch(ex)
            {
                log.error(ex);
            }

            nlapiLogExecution('DEBUG','Submitted Customer PDF' );

            try
            {
                nlapiAttachRecord('file', fileidCust, recordType, recordId);
                nlapiLogExecution('DEBUG','attached Customer PDF' );
            }
            catch(ex)
            {
                log.error(ex);
            }

            var xml_vend = "";
            xml_vend += generatePDF(obj, 'vendor');
            nlapiLogExecution('DEBUG','Generating vendor XML' );

            var fileVend = nlapiXMLToPDF(xml_vend);
            nlapiLogExecution('DEBUG','Generating vendor PDF' );
            var vendor = obj.getFieldValue('custrecord_prodspecmanufacturer');
            var vend = nlapiLookupField('vendor', vendor, 'entityid');
            fileVend.setName(filename + "_" + vend + "_M_V_"+version+".pdf");
            fileVend.setFolder(9);
            nlapiLogExecution('DEBUG','Generated vendor PDF' );

            try
            {
                var fileidVend = nlapiSubmitFile(fileVend);
                nlapiSubmitField(recordType, recordId, 'custrecord_produtspecpdf', fileidVend);
            }
            catch(ex)
            {
                log.error(ex);
            }

            nlapiLogExecution('DEBUG','Submitted vendor PDF' );

            log.write('File ID Vendor: ' + fileidVend);

            try
            {
                nlapiAttachRecord('file', fileidVend, recordType, recordId);
                nlapiLogExecution('DEBUG','attached vendor PDF' );
            }
            catch(ex)
            {
                log.error(ex);
            }
        }
        catch(ex)
        {
            log.error(ex);
        }
    }

}

var generatePDF = function(obj, entity){
    var xml = "";
    var LOGO = "https://system.netsuite.com/core/media/media.nl?id=451&c=3426165&h=3276696831364a77f125";
    var xml = "";
    xml += "<?xml version='1.0' encoding='UTF-8'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
    xml += "<pdf>";
    xml += "<head>";
    xml += "<style type=\"text/css\">";
    xml += "body {font-family: Calibri}";
    xml += "td {vertical-align : top;}";
    xml += "table.desc td {vertical-align : middle; align : center; padding: 2px; font-size: 11px;}";
    xml += "table.materials td {vertical-align : middle; align : center; font-size: 11px; border-color: #000}";
    xml += "table.sidetable td {vertical-align : middle; align : center}";
    xml += ".b-right {border-right-color:#000;border-right-width:thin;}";
    xml += ".b-left {border-left-color:#000;border-left-width:thin;}";
    xml += ".b-top {border-top-color:#000;border-top-width:thin;}";
    xml += ".b-bottom {border-bottom-color:#000;border-bottom-width:thin;}";
    xml += ".b-right-b-bottom {border-right-color:#000;border-right-width:thin;border-bottom-color:#000;border-bottom-width:thin;}";

    xml += "#main, .approval { border-left-color:#000; border-left-width:thin; border-right-color:#000; border-right-width:thin; border-top-color:#000; border-top-width:thin; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += "td.approval { font-size:8px;padding-right:10px; padding-left:10px; padding-top:1px; padding-bottom:2px; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += "body {font-family: Helvetica; font-size:10px;}";
    xml += ".header {padding-left:12px; color:#000}";
    xml += ".box {font-weight:bold;font-size:18px;padding-top:1px;padding-bottom:2px;}";
    xml += "#main, .approval { border-left-color:#000; border-left-width:thin; border-right-color:#000; border-right-width:thin; border-top-color:#000; border-top-width:thin; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += ".minitable { font-size:8px; border-left-color:#000; border-left-width:thin; border-right-color:#000; border-right-width:thin; border-top-color:#000; border-top-width:thin; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += ".minitable td.main {padding-top: 1px; padding-bottom: 1px; padding-right: 2px; padding-left: 2px; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += "#main td.main {padding-top: 1px; padding-bottom: 2px; padding-right: 5px; padding-left: 5px; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += "td.approval { font-size:8px;padding-right:10px; padding-left:10px; padding-top:1px; padding-bottom:2px; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += "tr.midapproval {padding-top: 1px; padding-bottom: 1px;}";
    xml += "td.gopaddress { font-size:8px;padding-right:10px; padding-left:10px; padding-top:1px; padding-bottom:2px; border-bottom-color:#000; border-bottom-width:thin;}";
    xml += "tr.midaddress {padding-top: 1px; padding-bottom: 1px;}";


    xml += "</style>";
    xml += "</head>";
    xml += "<body>";
    xml += "<div align='center'>";

    xml += "<table style='width:660px;padding-bottom:2px;border:0px'>";
    xml += "	<tr>";
    xml += "		<td style='align:left;width:150px;'>" + getImage(LOGO, '75', '75') + "<br /></td>";
    xml += "		<td style='vertical-align:middle;align:center;width:350px;font-size:25px;'>Product Specification<br /></td>";
    var productDate = obj.getFieldValue('custrecord_product_date');
    xml += "		<td style='vertical-align:middle;align:middle;width:100px;'>" + nlapiEscapeXML(productDate) + "<br /></td>";
    xml += "	</tr>";
    xml += "</table>";

    xml += "<table style='width:600px;padding-bottom:2px;border:0px'>";
    xml += "	<tr>";
    xml += "		<td colspan='2' style='vertical-align:top;width:600px;'>";
    xml += 				productSpecification(obj, entity);
    xml += "		</td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td style='vertical-align:top;width:300px;'>" + productDesignDocument(obj) + "<br /></td>";
    xml += "		<td style='vertical-align:top;width:300px;align:left;'>" + materials(obj) + "<br /></td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td style='vertical-align:top;width:300px;'>" + cartonLabelInformation(obj, entity) + "<br /></td>";
    xml += "		<td style='vertical-align:top;width:300px;align:left;' rowspan='3'>" + photos(obj) + "<br /></td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td style='vertical-align:top;width:300px;'>" + cartonDetails(obj) + "<br /></td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td style='vertical-align:top;width:300px;'>" + specialInstructions(obj, entity) + "<br /></td>";
    xml += "	</tr>";

    if(entity == "customer")
    {
        xml += "	<tr>";
        xml += "		<td colspan='2' style='vertical-align:top;width:600px;'>" + customerApproval(obj) + "<br /></td>";
        xml += "	</tr>";
    }

    xml += "	<tr>";
    xml += "		<td colspan='2' style='vertical-align:top;width:600px;align:center;'>" + gopDetails(obj, entity) + "<br /></td>";
    xml += "	</tr>";
    xml += "	</table>";
    xml += "</div>";
    xml += "</body>";
    xml += "</pdf>";// run the BFO library to convert the xml document to a PDF
    return xml;
}


var specialInstructions = function (obj, entity){
    var xml = "";
    xml += "<table style='width:300px;' class='approval'>";
    xml += "<tr><td class='header'>Special Instructions</td></tr>";

    var specialinstructioncustomer = obj.getFieldValue('custrecord_special_inst_customer');
    var specialinstructionvendor = obj.getFieldValue('custrecord_special_inst_manufacturer');

    if(entity == 'customer')
    {
        xml += "<tr><td class='approval'><br />";

        if(!isBlank(specialinstructioncustomer))
        {
            xml += nlapiEscapeXML(specialinstructioncustomer);
        }

        xml += "<br /></td></tr>";
    }
    else
    {
        xml += "<tr><td class='approval'><br />";
        if(!isBlank(specialinstructionvendor))
        {
            xml += nlapiEscapeXML(specialinstructionvendor);
        }
        xml += "<br /></td></tr>";
    }
    xml += "</table>";
    return xml;
}


var productSpecification = function(obj, entity){

    var xml = "";
    xml += "<table style='width:630px;font-size:14px;' id='main'>";
    xml += "<tr>";
    xml += "<td class='main' style='width:100px; border-right-color:#000; border-right-width:thin;'>Product Code:</td>";
    xml += "<td class='main' style='width:450px;'>";

    var productCode = obj.getFieldValue('custrecord_product_code');
    if(!isBlank(productCode))
    {
        xml += nlapiEscapeXML(productCode);
    }

    xml += "</td>";
    xml += "</tr>";
    xml += "<tr>";
    xml += "<td style='padding-right:5px;padding-left: 5px; border-right-color:#000; border-right-width:thin;'>Description:</td>";
    xml += "<td style='padding-right: 5px; padding-left: 5px;'>";

    var productDesc = obj.getFieldValue('custrecord_product_description');
    if(!isBlank(productDesc))
    {
        xml += nlapiEscapeXML(productDesc);
    }

    xml += "</td>";
    xml += "</tr>";
    xml += "<tr>";
    xml += "<td class='main' style='width:120px; border-right-color:#000; border-right-width:thin; border-top-color:#000; border-top-width:thin;'>Notes:</td>";
    xml += "<td class='main' style='width:180px; border-top-color:#000; border-top-width:thin;font-size:8px;'>";

    var productNotes = obj.getFieldValue('custrecord_product_notes');
    if(!isBlank(productNotes))
    {
        xml += nlapiEscapeXML(productNotes);
    }

    xml += "</td>";
    xml += "</tr>";
    xml += "</table>";

    return xml;
}

var cartonDetails = function(obj){
    var xml = "";
    xml += "<table style='width:300px;' class='minitable'>";
    xml += "<tr>";
    xml += "	<td colspan='3' class='header' style='width:300px;border-bottom-color:#000; border-bottom-width:thin;align:center;'>Carton Details</td>";
    xml += "</tr>";
    xml += "<tr>";
    xml += "<td class='main' style='width:150px; border-right-color:#000; border-right-width:thin;'>Carton Dimensions HxWxD (cm):</td>";
    xml += "<td class='main' style='width:140px;'>";
    var custrecord_carton_configuration = obj.getFieldText('custrecord_carton_configuration');
    var snstosplit = custrecord_carton_configuration;
    var re = /[\n\r]/g;
    var splitSN = snstosplit.split("-");
    if(!isBlank(splitSN[0]))
    {
        xml += nlapiEscapeXML(splitSN[0]);
    }

    xml += "</td>";
    xml += "</tr>";

    xml += "<tr>";
    xml += "<td class='main' style='width:150px; border-right-color:#000; border-right-width:thin;'>Carton Weight (Kg):</td>";
    xml += "<td class='main' style='width:140px;'>";

    var custrecord_product_size = obj.getFieldValue('custrecord_product_size');
    if(!isBlank(custrecord_product_size))
    {
        xml += nlapiEscapeXML(custrecord_product_size);
    }

    xml += "</td>";
    xml += "</tr>";
    xml += "<tr>";
    xml += "<td class='main' style='width:150px; border-right-color:#000; border-right-width:thin;'>Carton Quantity:</td>";
    xml += "<td class='main' style='width:140px;'>";

    var cartonQuantity = obj.getFieldValue('custrecord_product_quantity');
    if(!isBlank(cartonQuantity))
    {
        xml += nlapiEscapeXML(cartonQuantity);
    }

    xml += "</td>";
    xml += "</tr>";
    xml += "</table>";
    return xml;
}


var materials = function(obj){

    var xml = "";

    var count = obj.getLineItemCount('recmachcustrecord_product_specs_link');

    xml += "<table class='materials' style='width:300px; border:thin;'>";
    xml += "	<tr>";
    xml += "		<td colspan='7' class='b-bottom' style='padding:5px;align:center;font-size:9px;'>";
    xml += "			Materials Breakdown<br />";
    xml += "		</td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td class='b-right-b-bottom' style='font-size:6px;'>Item <br /> No.</td>";
    xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>Description</td>";
    xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>Color</td>";
    xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>Material</td>";
    xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>Type</td>";
    xml += "		<td class='b-right-b-bottom' style='font-size:7px;width:50px;'>Detail</td>";
    xml += "		<td class='b-bottom' style='font-size:5px;'>Special <br />Instruction</td>";
    xml += "	</tr>";
    xml += "	<!-- LOOP on Materials -->";

    for(var i = 1; i <= count; i++)
    {
        var itemno = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_pm_item_no', i);
        var description = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_pm_description', i);
        var itemtype = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_pm_type', i);

        if(!isBlank(itemtype))
        {
            var itemtypeText = nlapiLookupField('customrecord_pm_prod_type', itemtype, 'name');
        }

        var material = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_pm_material', i);
        var specialInst = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_specialinstruction', i);
        var details = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_pm_details', i);
        var color = obj.getLineItemValue('recmachcustrecord_product_specs_link', 'custrecord_pm_color', i);

        xml += "	<tr>";
        xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>";

        if(!isBlank(itemno))
        {
            xml += nlapiEscapeXML(itemno);
        }

        xml += "		</td>";
        xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>";
        if(!isBlank(description))
        {
            var desc = nlapiLookupField('customrecord_pm_productdescription', description, 'name');
            if(!isBlank(desc))
            {
                xml += nlapiEscapeXML(desc);
            }
        }
        xml += "		</td>";

        xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>";
        if(!isBlank(color))
        {
            xml += nlapiEscapeXML(color);
        }
        xml += "		</td>";

        xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>";
        if(!isBlank(material))
        {
            xml += nlapiEscapeXML(material);
        }
        xml += "		</td>";

        xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>";
        if(!isBlank(itemtypeText))
        {
            xml += nlapiEscapeXML(itemtypeText);
        }
        xml += "		</td>";

        xml += "		<td class='b-right-b-bottom' style='font-size:7px;'>";
        if(!isBlank(details))
        {
            xml += nlapiEscapeXML(details);
        }
        xml += "		</td>";

        xml += "		<td class='b-bottom' style='font-size:7px;'>";
        if(!isBlank(specialInst))
        {
            xml += nlapiEscapeXML(YesNo(specialInst));
        }
        xml += "		</td>";
        xml += "	</tr>";
    }

    xml += "	</table>";

    return xml;
}

var isBlank = function(test){
    if( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32) ){return true}else{return false}
}

function getImage(img, width, height)
{
    var str = "";
    str += "<img src='" + nlapiEscapeXML(img) + "' style='width:" + width + "px; height:" + height + "px;' />";
    return str;

}

//Customer Approval
var customerApproval = function(obj)
{
    var xml = "";
    xml += "<table style='width:630px;' class='approval'>";
    xml += "<tr><td colspan='4' class='header'>Customer Approval</td></tr>";
    xml += "<tr><td colspan='4' class='approval'>" + nlapiEscapeXML(obj.getFieldValue('custrecord_product_customer_approval')) + "</td></tr>";
    xml += "<tr class='midapproval'>";
    xml += "<td style='width:10;'></td>";
    xml += "<td style='width:200;'>Signed ______________________________</td>";
    xml += "<td style='width:10;'></td>";
    xml += "<td style='width:200;'>Date ____________________</td>";
    xml += "</tr>";
    xml += "<tr class='midapproval'>";
    xml += "<td></td>";
    xml += "<td colspan='3'>Company ____________________________</td>";
    xml += "</tr>";
    xml += "</table>";
    return xml;

}

var gopDetails = function(obj){

    var xml = "";
    xml += "<div align='center'>";
    xml += "<table style='width:640px;' class='gopaddress'>";
    xml += "<tr class='midaddress'>";
    xml += "<td colspan='3' align='center'>Global One-Pak Ltd</td>";
    xml += "</tr>";
    xml += "<tr class='midaddress'>";
    xml += "<td colspan='3' align='center'>Hyde Park House, Cartwright Street, Hyde, Cheshire, SK14 4EH</td>";
    xml += "</tr>";
    xml += "<tr class='midaddress'>";
    xml += "<td colspan='3' align='center'>VAT No: GB824889874 Tel: 044 (0) 870 011 6874</td>";
    xml += "</tr>";
    xml += "</table>";
    xml += "</div>";
    return xml;

}





var cartonLabelInformation = function(obj, entity){

    var xml = "";
    xml += "			<table style='width:300px;' class='minitable'>";
    xml += "				<tr>";
    xml += "					<td colspan='3' class='header' style='width:300px;border-bottom-color:#000; border-bottom-width:thin;align:center;'>Carton Label Information</td>";
    xml += "				</tr>";
    xml += "				<tr>";
    xml += "					<td class='main' style='width:70px; border-right-color:#000; border-right-width:thin;font-size:8px;padding-right:5px;'>Product Code:</td>";
    xml += "					<td class='main' style='width:100px;'>";

    var prodCodeCarton = obj.getFieldValue('custrecord_product_code_carton');
    if(!isBlank(prodCodeCarton))
    {
        xml += nlapiEscapeXML(prodCodeCarton);
    }

    xml += "					</td>";
    xml += "					<td class='main' style='width:80px;align:center;border-left-width:thin;border-left-color:#000;vertical-align:middle;' rowspan='3'>";
    xml += "					<span class='box'>";

    var productNumber = obj.getFieldValue('custrecord_product_number');

    if(!isBlank(productNumber))
    {
        xml += nlapiEscapeXML(productNumber);
    }

    xml += "					</span>";
    xml += "					</td>";
    xml += "				</tr>";

    if(entity == 'vendor'){
        xml += "<tr>";
        xml += "	<td class='main' style='width:70px; border-right-color:#000; border-right-width:thin;padding-right:5px;'>Factory Ref:</td>";
        xml += "	<td class='main' style='width:180px;'>";

        var productFactoryRef = obj.getFieldValue('custrecord_product_factory_ref');
        if(!isBlank(productFactoryRef))
        {
            xml += nlapiEscapeXML(productFactoryRef);
        }

        xml += "</td>";
        xml += "</tr>";
    }

    if(entity == 'customer'){

        xml += "				<tr>";
        xml += "					<td class='main' style='width:70px; border-right-color:#000; border-right-width:thin;padding-right:5px;'>Customer Ref:</td>";
        xml += "					<td class='main' style='width:180px;'>";

        var customerReference = obj.getFieldValue('custrecord_customer_reference');
        if(!isBlank(customerReference))
        {
            xml += nlapiEscapeXML(customerReference);
        }

        xml += "					</td>";
        xml += "				</tr>";
    }

    xml += "				<tr>";
    xml += "					<td class='main' style='width:70px; border-right-color:#000; border-right-width:thin;padding-right:5px;'>Description:</td>";
    xml += "					<td class='main' style='width:180px;'>";
    var productDesc = obj.getFieldValue('custrecord_product_description');
    if(!isBlank(productDesc))
    {
        xml += nlapiEscapeXML(productDesc);
    }
    xml += "					</td>";
    xml += "				</tr>";
    xml += "				<tr>";
    xml += "					<td class='main' style='width:100px; border-right-color:#000; border-right-width:thin;padding-right:5px;'>Order No:</td>";
    xml += "					<td class='main' style='width:150px;' colspan='2'>";
    xml += "					</td>";
    xml += "				</tr>";
    xml += "				<tr>";
    xml += "					<td class='main' style='width:70px; border-right-color:#000; border-right-width:thin;padding-right:5px;'>Carton No:</td>";
    xml += "					<td class='main' style='width:180px;' colspan='2'>";
    xml += "					</td>";
    xml += "				</tr>";
    xml += "				<tr>";
    xml += "					<td class='main' style='width:70px; border-right-color:#000; border-right-width:thin;padding-right:5px;'>Destination:</td>";
    xml += "					<td class='main' style='width:180px;' colspan='2'>";

    var tempaddress = obj.getFieldValue('custrecord_product_address');

    if(!isBlank(tempaddress))
    {
        xml += nlapiEscapeXML(tempaddress);
    }

    xml += "					</td>";
    xml += "			</tr>";
    xml += "		</table>";
    //End Carton Label
    return xml;
}

var photos = function(obj){

    var xml = "";

    var photo_one = obj.getFieldValue('custrecord_photo_one');
    var photo_two = obj.getFieldValue('custrecord_photo_two');
    var photo_three = obj.getFieldValue('custrecord_photo_three');

    if(!isBlank(photo_one))
    {
        var f1 = nlapiLoadFile(photo_one);
        var url1 = "https://system.netsuite.com" + f1.getURL();
        if(!isBlank(url1))
        {
            var isImg1 = validateImage(f1.getName());
        }
    }

    if(!isBlank(photo_two))
    {
        var f2 = nlapiLoadFile(photo_two);
        var url2 = "https://system.netsuite.com" + f2.getURL();
        if(!isBlank(url2))
        {
            var isImg2 = validateImage(f2.getName());
        }
    }

    if(!isBlank(photo_three))
    {
        var f3 = nlapiLoadFile(photo_three);
        var url3 = "https://system.netsuite.com" + f3.getURL();
        if(!isBlank(url3))
        {
            var isImg3 = validateImage(f3.getName());
        }
    }

    xml += "<table style='width:300px;' class='minitable'>";
    xml += "	<tr>";
    xml += "		<td colspan='3' class='header' style='width:300px;border-bottom-color:#000; border-bottom-width:thin;'>Images for Reference</td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td style='width:100px; padding-right: 10px;' align='center'>";
    if(isImg1)
    {
        xml += 				getImage(url1, '80', '80');
    }
    xml += "		</td>";
    xml += "		<td style='width:100px;' align='center'>";
    if(isImg2)
    {
        xml += 				getImage(url2, '80', '80');
    }
    xml += "		</td>";
    xml += "		<td style='width:100px;' align='center'>";
    if(isImg3)
    {
        xml += 				getImage(url3, '80', '80');
    }
    xml += "		</td>";
    xml += "	</tr>";
    xml += "	<tr>";
    xml += "		<td colspan='3' class='header' style='width:300px; border-left-color:#000; border-left-width:thin; border-right-color:#000; border-right-width:thin; border-top-color:#000; border-top-width:thin; border-bottom-color:#000; border-bottom-width:thin;'>Notes: ";

    if(!isBlank(obj.getFieldValue('custrecord_notes_for_photo')))
    {
        xml += nlapiEscapeXML(obj.getFieldValue('custrecord_notes_for_photo'));
    }

    xml += "		</td>";
    xml += "	</tr>";
    xml += "</table>";

    return xml;
}

var productDesignDocument = function(obj){
    var xml = "";
    var doc = obj.getFieldValue('custrecord_product_design_doc');
    var f = nlapiLoadFile(doc);
    var url = "https://system.netsuite.com" + f.getURL();
    if(!isBlank(url))
    {
        var isImage = validateImage(f.getName());
        if(isImage)
        {
            nlapiLogExecution('DEBUG', 'Image file Valid, putting on form');

            xml += "<table style='width:300px; border-left-color:#000; border-left-width:thin; border-right-color:#000; border-right-width:thin; border-top-color:#000; border-top-width:thin; border-bottom-color:#000; border-bottom-width:thin;'>";
            xml += "	<tr>";
            xml += "		<td align='center'><img src='" + nlapiEscapeXML(url) + "' style='width:200px; height:200px;' /></td>";
            xml += "	</tr>";
            xml += "</table>";
        }
    }
    return xml;
}

var validateImage = function(img){
    var extension = img.split('.').pop().toLowerCase();
    if(extension == "png" || extension == "jpg" || extension == "jpeg")
    {
        return true;
    }
    else
    {
        return false;
    }
}

var createItem = function(obj, recordId){
    var itemName = obj.getFieldValue('custrecord_product_code');
    var	customerPDF	=	obj.getFieldValue('custrecord_customer_specs_pdf');
    var	vendorPDF	=	obj.getFieldValue('custrecord_produtspecpdf');
    var	description	= 	obj.getFieldValue('custrecord_product_description');
    var	carton = 	obj.getFieldValue('custrecord_carton_configuration');
    var casesPerPallet = obj.getFieldValue('custrecord_product_casesperpallet');
    var create = nlapiCreateRecord('inventoryitem');
    //setcorevalues
    create.setFieldValue('itemid', itemName);
    create.setFieldValue('cogsaccount', 126);
    create.setFieldValue('assetaccount', 125);
    create.setFieldValue('incomeaccount', 54);
    create.setFieldValue('salestaxcode', 6);
    create.setFieldValue('purchasetaxcode', 13);
    create.setFieldValue('salestaxcode', 6);
    create.setFieldValue('custitem_prodspecrecord', recordId);
    //setUnits
    create.setFieldValue('unitstype', 1);
    //setDocuments
    create.setFieldValue('custitem_manuspec', vendorPDF);
    create.setFieldValue('custitem_customerspec', customerPDF);
    create.setFieldValue('salesdescription', description);
    create.setFieldValue('custitem_gop_carton', carton);
    create.setFieldValue('custitem_gop_cases_per_pallet', casesPerPallet);


    var newItem = nlapiSubmitRecord(create, true);
    return newItem;

    nlapiLogExecution('DEBUG', 'newItem', newItem);
}

var YesNo = function(str){
    if(str == 'T')
    {
        return 'Yes';
    }
    else
    {
        return 'No';
    }
}