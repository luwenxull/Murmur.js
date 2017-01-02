"use strict";
var murmur_type_1 = require("./murmur.type");
var MurmurPromise = (function () {
    function MurmurPromise() {
        this.success = [];
        this.status = murmur_type_1.MurmurPromiseType.PENDING;
        this.resolveNotify = false;
    }
    MurmurPromise.prototype.then = function (fn) {
        this.success.push(fn);
        if (this.status === murmur_type_1.MurmurPromiseType.RESOLVED) {
            fn(this.murmur);
        }
        ;
        return this;
    };
    MurmurPromise.prototype.resolve = function (murmur) {
        this.status = murmur_type_1.MurmurPromiseType.RESOLVED;
        this.murmur = murmur;
        for (var _i = 0, _a = this.success; _i < _a.length; _i++) {
            var success = _a[_i];
            success(murmur);
        }
    };
    return MurmurPromise;
}());
exports.MurmurPromise = MurmurPromise;
