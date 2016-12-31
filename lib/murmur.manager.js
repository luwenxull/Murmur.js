"use strict";
var MurmurManager = (function () {
    function MurmurManager(murmur) {
        this.murmur = murmur;
    }
    MurmurManager.prototype.ready = function (fn) {
        fn.call(this.murmur);
    };
    return MurmurManager;
}());
exports.MurmurManager = MurmurManager;
