/**
 * Created by Alex on 23.01.2017.
 */
var Vk = {};
Vk.call = function(methodName, args, callback) {
    $.ajax({
        url: 'https://api.vk.com/method/'+methodName+'?'+args+"&v=5.62",
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: callback
    });
}

Vk.clearId = function (possibleId) {
    if (!possibleId) return 0;

    // remove first '-' symbol
    possibleId = (possibleId[0] == '-') ? possibleId.substr(1) : possibleId;
    possibleId = possibleId.trim()

    var isInt = possibleId === parseInt(possibleId, 10)
    if (isInt) return possibleId;

    return possibleId;
}