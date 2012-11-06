/**
 * @fileOverview
 * @name e.library.js
 * @author Eliseo Beltran
 * @version 1.0
  * @description: Eli NS Library
 */

/**
 * @name Log
 * @description: Object for logging in Netsuite
 * @param (string) type : DEBUG, ERROR, AUDIT
 * @method write() : @param <string> str - function called to write the logs in Netsuite
 * @method error() : @param <string> ex - function called to write error logs in Netsuite
 * @author Eliseo Beltran
 */
var Log = function(type){
	this.type = type;
	this.write = function(str){
		nlapiLogExecution(type, str);
	}
	this.error = function(ex){
		var errorMsg = ex.getCode != null ? ex.getCode() + ': ' + ex.getDetails() : 'Error: ' + (ex.message != null ? ex.message : ex);
		nlapiLogExecution(type, 'ERROR: ' + errorMsg);
	}
}

/**
 * @name isBlank
 * @description: Object for validating string value
 * @param (string) string value
 * @returns bool
 * @author Eliseo Beltran 
 */
var isBlank = function(str){
	if((str == '') || (str == null) ||(str == undefined) || (str.toString().charCodeAt() == 32)){
		return true;
	}
	else{
		return false;
	}
}

/**
 * @name isBlank
 * @description: Return the difference between two dates
 * @param (date1)
 * @param (date2) 
 * @returns int
 * @author Eliseo Beltran 
 */
var days_between = function(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}