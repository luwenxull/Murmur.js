"use strict";
var murmur_type_1 = require("./murmur.type");
var Connect = (function () {
    function Connect(dom, type) {
        this.dom = dom;
        this.type = type;
    }
    Connect.prototype.isSimpleDom = function () {
        return this.type == murmur_type_1.MurmurConnectTypes[0];
    };
    Connect.prototype.getDOM = function () {
        return this.dom;
    };
    return Connect;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Connect;
