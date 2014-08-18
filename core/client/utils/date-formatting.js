/* global moment */
var parseDateFormats = ['DD MMM YY @ HH:mm', 'DD MMM YY HH:mm',
                        'DD MMM YYYY @ HH:mm', 'DD MMM YYYY HH:mm',
                        'DD/MM/YY @ HH:mm', 'DD/MM/YY HH:mm',
                        'DD/MM/YYYY @ HH:mm', 'DD/MM/YYYY HH:mm',
                        'DD-MM-YY @ HH:mm', 'DD-MM-YY HH:mm',
                        'DD-MM-YYYY @ HH:mm', 'DD-MM-YYYY HH:mm',
                        'YYYY-MM-DD @ HH:mm', 'YYYY-MM-DD HH:mm',
                        'DD MMM @ HH:mm', 'DD MMM HH:mm'],
    displayDateFormat = 'YYYY-MM-DD @ HH:mm';

/**
 * Add missing timestamps
 */
var verifyTimeStamp = function (dateString) {
    if (dateString && !dateString.slice(-5).match(/\d+:\d\d/)) {
        dateString += ' 12:00';
    }
    return dateString;
};

//Parses a string to a Moment
var parseDateString = function (value) {
    return value ? moment(verifyTimeStamp(value), parseDateFormats, true) : undefined;
};

//Formats a Date or Moment
var formatDate = function (value) {
    return verifyTimeStamp(value ? moment(value).format(displayDateFormat) : '');
};

export {parseDateString, formatDate};