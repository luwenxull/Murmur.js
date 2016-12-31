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
    RepeatDirective.prototype.compile = function (murmur, domGenerated) {
        // murmur.$repeatDirective.inRepeat=true;
        var dExp = this.directiveExpression, model = murmur.primaryModel;
        var fragment = document.createDocumentFragment();
        var repeatSource;
        if (repeatSource = murmur.extract(dExp)) {
            for (var _i = 0, repeatSource_1 = repeatSource; _i < repeatSource_1.length; _i++) {
                var stateModel = repeatSource_1[_i];
                var clone = murmur_core_1.default.clone(murmur);
                clone.$repeatDirective.$repeatEntrance = false;
                clone.$repeatDirective.$repeatEntity = true;
                // clone.$repeatDirective.repeatModel = a;
                clone.stateModel = stateModel;
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
        var repeatSource = murmur.extract(this.directiveExpression);
        var keysNeedToBeUpdate = Object.keys(updateData);
        for (var _i = 0, _a = this.murmurList; _i < _a.length; _i++) {
            var currentMurmur = _a[_i];
            currentMurmur.primaryModel = murmur.primaryModel;
        }
        if (repeatSource) {
            var repeatSourceLength = repeatSource.length, mmListLength = this.murmurList.length;
            this.lengthCheck(repeatSource, murmur, updateData);
            for (var i = 0; i < repeatSourceLength; i++) {
                var currentModel = repeatSource[i];
                var m = this.murmurList[i];
                if (m) {
                    // m.$repeatDirective.repeatModel = currentModel;
                    // for (let deepChild of m.getRecursiveMurmurChildren()) {
                    //     deepChild.$repeatDirective.repeatModel = currentModel;
                    // }
                    m.stateModel = currentModel;
                    m.dispatchUpdate(updateData, keysNeedToBeUpdate.concat(Object.keys(currentModel)));
                }
            }
        }
    };
    RepeatDirective.prototype.lengthCheck = function (repeatSource, murmur, updateData) {
        var repeatSourceLength = repeatSource.length, mmListLength = this.murmurList.length;
        if (mmListLength > repeatSourceLength) {
            this.removeExcessMurmur(mmListLength, repeatSourceLength);
        }
        if (mmListLength < repeatSourceLength) {
            this.addExtraMurmur(repeatSource, murmur, mmListLength, repeatSourceLength, updateData);
        }
    };
    RepeatDirective.prototype.removeExcessMurmur = function (mmListLength, repeatSourceLength) {
        while (repeatSourceLength < mmListLength) {
            this.murmurList[--mmListLength]._connected.get().remove();
            this.murmurList.pop();
        }
    };
    RepeatDirective.prototype.addExtraMurmur = function (repeatSource, murmur, mmListLength, repeatSourceLength, updateData) {
        while (mmListLength < repeatSourceLength) {
            var clone = murmur_core_1.default.clone(murmur), newDom = void 0, lastDom = void 0;
            clone.$repeatDirective.$repeatEntrance = false;
            clone.$repeatDirective.$repeatEntity = true;
            clone.stateModel = repeatSource[mmListLength++];
            // clone.stateModel=updateData;
            newDom = clone.create(murmur.primaryModel);
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
    IfDirective.prototype.compile = function (murmur, domGenerated) {
        var dExp = this.directiveExpression;
        if (!murmur.extract(dExp)) {
            domGenerated.style.display = 'none';
        }
        return domGenerated;
    };
    IfDirective.prototype.update = function (murmur, updateData) {
        var dExp = this.directiveExpression;
        var dom = murmur._connected.get();
        if (!murmur.extract(dExp)) {
            dom.style.display = 'none';
        }
        else {
            dom.style.display = '';
        }
    };
    return IfDirective;
}(MurmurDirective));
exports.IfDirective = IfDirective;
