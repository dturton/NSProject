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