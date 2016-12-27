"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var murmur_tool_1 = require("./murmur.tool");
var MurmurDirective = (function () {
    function MurmurDirective(directiveExpression) {
        this.directiveExpression = directiveExpression;
    }
    return MurmurDirective;
}());
var RepeatDirective = (function (_super) {
    __extends(RepeatDirective, _super);
    function RepeatDirective() {
        return _super.apply(this, arguments) || this;
    }
    RepeatDirective.prototype.compile = function (model, murmur) {
        var dExp = this.directiveExpression;
        var t = dExp.split('in');
        var loopName = murmur_tool_1.removeAllSpace(t[0]), loopArray = murmur_tool_1.removeAllSpace(t[1]);
        for (var a in model[loopArray]) {
            console.log(murmur.create(a));
        }
    };
    return RepeatDirective;
}(MurmurDirective));
exports.RepeatDirective = RepeatDirective;
// export let repeat= 
