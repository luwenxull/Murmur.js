"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var murmur_core_1 = require("./murmur.core");
var murmur_tool_1 = require("./murmur.tool");
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
            var repeatArrLength = repeatArr.length, mmListLength = this.murmurList.length;
            this.lengthCheck(repeatArr, murmur);
            for (var i = 0; i < repeatArrLength; i++) {
                var repeatObj = repeatArr[i];
                var m = this.murmurList[i];
                if (m) {
                    m.$repeatDirective.repeatModel = repeatObj;
                    m.replaceRepeatModelOfChild(repeatObj);
                    m.dispatchUpdate(updateData);
                }
            }
        }
    };
    RepeatDirective.prototype.lengthCheck = function (repeatArr, murmur) {
        var repeatArrLength = repeatArr.length, mmListLength = this.murmurList.length;
        if (mmListLength > repeatArrLength) {
            this.removeExcessMurmur(mmListLength, repeatArrLength);
        }
        if (mmListLength < repeatArrLength) {
            this.addExtraMurmur(repeatArr, murmur, mmListLength, repeatArrLength);
        }
    };
    RepeatDirective.prototype.removeExcessMurmur = function (mmListLength, repeatArrLength) {
        while (repeatArrLength < mmListLength) {
            this.murmurList[--mmListLength]._connected.get().remove();
            this.murmurList.pop();
        }
    };
    RepeatDirective.prototype.addExtraMurmur = function (repeatArr, murmur, mmListLength, repeatArrLength) {
        while (mmListLength < repeatArrLength) {
            var clone = murmur_core_1.default.clone(murmur), newDom = void 0, lastDom = void 0;
            clone.$repeatDirective.$repeatEntrance = false;
            clone.$repeatDirective.$repeatEntity = true;
            clone.$repeatDirective.repeatModel = repeatArr[mmListLength++];
            newDom = clone.create(murmur.model);
            lastDom = this.murmurList[mmListLength - 2]._connected.get();
            murmur_tool_1.addSibling(lastDom, newDom);
            this.murmurList.push(clone);
        }
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
            domGenerated.classList.add('murmur-ready-delete');
        }
        return domGenerated;
    };
    IfDirective.prototype.update = function () {
    };
    return IfDirective;
}(MurmurDirective));
exports.IfDirective = IfDirective;
