"use strict";
exports.__esModule = true;
exports.from = exports.to = void 0;
function to(object) {
    var newObject = {};
    for (var key in object) {
        var value = object[key];
        if (key === "expires") {
            newObject.expires = value.getTime();
        }
        else {
            newObject[key] = value;
        }
    }
    return newObject;
}
exports.to = to;
function from(object) {
    var newObject = {};
    for (var key in object) {
        var value = object[key];
        if (key === "expires") {
            newObject.expires = new Date(value);
        }
        else {
            newObject[key] = value;
        }
    }
    return newObject;
}
exports.from = from;
