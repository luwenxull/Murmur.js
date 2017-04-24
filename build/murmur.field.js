"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var murmur_type_1 = require("./murmur.type");
var MurmurField = (function () {
    function MurmurField(value, expression, type, unit) {
        this.value = value;
        this.expression = expression;
        this.type = type;
        this.unit = unit;
    }
    MurmurField.prototype.dispatchSync = function (murmur) {
        switch (this.type) {
            case murmur_type_1.MurmurFieldType.TEXT: {
                this.doSyncText(murmur);
                break;
            }
            default: {
                this.doSyncAttr(murmur);
            }
        }
    };
    MurmurField.prototype.doSyncText = function (murmur) {
        this.unit.textContent = murmur.evalExpression(this.expression, this.unit, murmur_type_1.MurmurFieldType.TEXT);
    };
    MurmurField.prototype.doSyncAttr = function (murmur) {
        this.unit.value = murmur.evalExpression(this.expression, this.unit, murmur_type_1.MurmurFieldType.ATTR);
    };
    return MurmurField;
}());
exports.default = MurmurField;
