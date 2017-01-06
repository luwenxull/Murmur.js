"use strict";
var murmur_type_1 = require("./murmur.type");
var MurmurPromise = (function () {
    function MurmurPromise(name) {
        this.name = name;
        this.success = [];
        this.one = [];
        this.status = murmur_type_1.MurmurPromiseType.PENDING;
        this.resolveNotify = false;
        this.dependencies = [];
        this.dependsBy = [];
    }
    MurmurPromise.prototype.then = function (fn) {
        this.success.push(fn);
        if (this.status === murmur_type_1.MurmurPromiseType.RESOLVED) {
            fn.call(this, this.murmur);
        }
        ;
        return this;
    };
    MurmurPromise.prototype.resolve = function () {
        this.status = murmur_type_1.MurmurPromiseType.RESOLVED;
        for (var _i = 0, _a = this.success; _i < _a.length; _i++) {
            var success = _a[_i];
            success(this.murmur);
        }
        for (var _b = 0, _c = this.one; _b < _c.length; _b++) {
            var o = _c[_b];
            o(this.murmur);
        }
        this.one = []; //注册的回调函数只会执行一次
        for (var _d = 0, _e = this.dependsBy; _d < _e.length; _d++) {
            var db = _e[_d];
            db.checkDependencies();
        }
    };
    MurmurPromise.prototype.depends = function (dep) {
        this.dependencies.push(dep);
        dep.dependsBy.push(this);
    };
    MurmurPromise.prototype.checkDependencies = function () {
        var dependenciesResolved = true;
        for (var _i = 0, _a = this.dependencies; _i < _a.length; _i++) {
            var dependency = _a[_i];
            if (dependency.status === murmur_type_1.MurmurPromiseType.PENDING) {
                dependenciesResolved = false;
            }
        }
        if (dependenciesResolved) {
            this.resolve();
        }
    };
    MurmurPromise.prototype.once = function (fn) {
        if (this.status === murmur_type_1.MurmurPromiseType.RESOLVED) {
            fn.call(this, this.murmur);
        }
        else {
            this.one.push(fn);
        }
        return this;
    };
    return MurmurPromise;
}());
exports.MurmurPromise = MurmurPromise;
