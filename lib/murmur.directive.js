"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MurmurDirective = (function () {
    function MurmurDirective(directiveExpression) {
        this.directiveExpression = directiveExpression;
    }
    return MurmurDirective;
}());
exports.MurmurDirective = MurmurDirective;
var RepeatDirective = (function (_super) {
    __extends(RepeatDirective, _super);
    function RepeatDirective() {
        return _super.apply(this, arguments) || this;
    }
    RepeatDirective.prototype.compile = function (model, murmur, domGenerated) {
        murmur.repeatMMDState.inRepeat = true;
        var dExp = this.directiveExpression;
        var fragment = document.createDocumentFragment();
        if (model[dExp]) {
            for (var _i = 0, _a = model[dExp]; _i < _a.length; _i++) {
                var a = _a[_i];
                murmur.repeatMMDState.repeatModel = a;
                fragment.appendChild(murmur.create(model));
            }
        }
        murmur.repeatMMDState.inRepeat = false;
        return fragment;
    };
    return RepeatDirective;
}(MurmurDirective));
exports.RepeatDirective = RepeatDirective;
var IfDirective = (function (_super) {
    __extends(IfDirective, _super);
    function IfDirective() {
        return _super.apply(this, arguments) || this;
    }
    IfDirective.prototype.compile = function (model, murmur, domGenerated) {
        var dExp = this.directiveExpression;
        if (!murmur.extract(dExp)) {
            domGenerated.setAttribute('data-delete', '1');
        }
        return domGenerated;
    };
    return IfDirective;
}(MurmurDirective));
exports.IfDirective = IfDirective;
