"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var murmur_core_1 = require("./murmur.core");
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
        var _this = _super.apply(this, arguments) || this;
        _this.murmurList = [];
        return _this;
    }
    RepeatDirective.prototype.compile = function (model, murmur, domGenerated) {
        // murmur.$repeatDirective.inRepeat=true;
        var dExp = this.directiveExpression;
        var fragment = document.createDocumentFragment();
        if (model[dExp]) {
            for (var _i = 0, _a = model[dExp]; _i < _a.length; _i++) {
                var a = _a[_i];
                var clone = murmur_core_1.default.clone(murmur);
                clone.$repeatDirective.$repeatEntrance = false;
                clone.$repeatDirective.$repeatEntity = true;
                clone.$repeatDirective.repeatModel = a;
                this.murmurList.push(clone);
                // clone.$repeatDirective=murmur.$repeatDirective;
                var repeatDom = clone.create(model);
                fragment.appendChild(repeatDom);
            }
        }
        // murmur.$repeatDirective.inRepeat=false;
        return fragment;
    };
    RepeatDirective.prototype.update = function (murmur, updateData) {
        var repeatArr = updateData[this.directiveExpression];
        if (repeatArr) {
            for (var i = 0; i < repeatArr.length; i++) {
                var repeatObj = repeatArr[i];
                var m = this.murmurList[i];
                if (m) {
                    m.$repeatDirective.repeatModel = repeatObj;
                    m.replaceRepeatModelOfChild(repeatObj);
                    m.dispatchUpdate(updateData);
                }
            }
        }
        // for(let m of this.murmurList){
        //     m.dispatchUpdate(updateData)
        // }
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
    IfDirective.prototype.update = function () {
    };
    return IfDirective;
}(MurmurDirective));
exports.IfDirective = IfDirective;
