"use strict";
var MurmurPromise = (function () {
    function MurmurPromise() {
        this.success = [];
    }
    MurmurPromise.prototype.then = function (fn) {
        this.success.push(fn);
    };
    MurmurPromise.prototype.resolve = function (murmur) {
        for (var _i = 0, _a = this.success; _i < _a.length; _i++) {
            var success = _a[_i];
            success(murmur);
        }
    };
    return MurmurPromise;
}());
exports.MurmurPromise = MurmurPromise;