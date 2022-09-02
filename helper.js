"use strict";
exports.__esModule = true;
exports.sleep = exports.asyncMap = void 0;
function asyncMap(promiseFns, max) {
    var result = [];
    var count = 0;
    var cursor = 0;
    return new Promise(function (res) {
        function run() {
            var _loop_1 = function () {
                count++;
                var index = cursor++;
                promiseFns[index]()
                    .then(function (value) {
                    result[index] = value;
                }, function (rej) { return console.log(rej); })["catch"](function (err) { return console.error(err); })["finally"](function () {
                    run();
                    count--;
                    if (!count)
                        res(result);
                });
            };
            while (count < max && cursor < promiseFns.length) {
                _loop_1();
            }
        }
        run();
    });
}
exports.asyncMap = asyncMap;
function sleep(ms) {
    return new Promise(function (res) { return setTimeout(res, ms); });
}
exports.sleep = sleep;
