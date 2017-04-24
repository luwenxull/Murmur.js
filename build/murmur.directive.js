"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.murmurList = [];
        return _this;
    }
    RepeatDirective.prototype.compile = function (murmur, domGenerated) {
        var dExp = this.directiveExpression;
        var repeatSource;
        if (repeatSource = murmur.extract(dExp)) {
            for (var _i = 0, repeatSource_1 = repeatSource; _i < repeatSource_1.length; _i++) {
                var stateModel = repeatSource_1[_i];
                var clone = murmur_core_1.default.clone(murmur);
                clone.$repeatDirective.$repeatEntrance = false;
                clone.$repeatDirective.$repeatEntity = true;
                clone.model.state = stateModel;
                this.murmurList.push(clone);
                clone.create(murmur.model.exotic);
            }
        }
        return domGenerated;
    };
    RepeatDirective.prototype.update = function (murmur, updateData) {
        var repeatSource = murmur.extract(this.directiveExpression);
        var keysNeedToBeUpdate = Object.keys(updateData);
        for (var _i = 0, _a = this.murmurList; _i < _a.length; _i++) {
            var currentMurmur = _a[_i];
            currentMurmur.model.exotic = murmur.model.exotic;
        }
        if (repeatSource) {
            var repeatSourceLength = repeatSource.length, mmListLength = this.murmurList.length;
            this.lengthCheck(repeatSource, murmur, updateData);
            for (var i = 0; i < repeatSourceLength; i++) {
                var newState = repeatSource[i];
                var m = this.murmurList[i];
                if (m) {
                    m.model.state = newState;
                    m.dispatchUpdate(updateData, keysNeedToBeUpdate.concat(Object.keys(newState)));
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
            this.murmurList[--mmListLength].getNode().remove();
            this.murmurList.pop();
        }
    };
    RepeatDirective.prototype.addExtraMurmur = function (repeatSource, murmur, mmListLength, repeatSourceLength, updateData) {
        while (mmListLength < repeatSourceLength) {
            var clone = murmur_core_1.default.clone(murmur), newDom = void 0, lastDom = void 0;
            clone.$repeatDirective.$repeatEntrance = false;
            clone.$repeatDirective.$repeatEntity = true;
            clone.model.state = repeatSource[mmListLength++];
            clone.create(murmur.model.exotic);
            lastDom = this.murmurList[mmListLength - 2].getNode();
            murmur_tool_1.addSibling(lastDom, clone.getNode());
            this.murmurList.push(clone);
        }
    };
    return RepeatDirective;
}(MurmurDirective));
exports.RepeatDirective = RepeatDirective;
var IfDirective = (function (_super) {
    __extends(IfDirective, _super);
    function IfDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IfDirective.prototype.compile = function (murmur, domGenerated) {
        var dExp = this.directiveExpression;
        if (!murmur.extract(dExp)) {
            murmur.$ifDirective.shouldReturn = false;
        }
        murmur.$ifDirective.spaceHolder = document.createTextNode('');
        return domGenerated;
    };
    IfDirective.prototype.update = function (murmur, updateData) {
        var dExp = this.directiveExpression;
        if (murmur.extract(dExp) && murmur.$ifDirective.shouldReturn === false) {
            murmur.$ifDirective.shouldReturn = true;
            murmur_tool_1.addSibling(murmur.$ifDirective.spaceHolder, murmur._connected.getDOM());
            murmur.$ifDirective.spaceHolder.remove();
        }
        if (!murmur.extract(dExp) && murmur.$ifDirective.shouldReturn === true) {
            murmur.$ifDirective.shouldReturn = false;
            murmur_tool_1.addSibling(murmur._connected.getDOM(), murmur.$ifDirective.spaceHolder);
            murmur._connected.getDOM().remove();
        }
    };
    return IfDirective;
}(MurmurDirective));
exports.IfDirective = IfDirective;
var ShowDirective = (function (_super) {
    __extends(ShowDirective, _super);
    function ShowDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShowDirective.prototype.compile = function (murmur, domGenerated) {
        var dExp = this.directiveExpression;
        if (!murmur.extract(dExp)) {
            domGenerated.style.display = 'none';
        }
        return domGenerated;
    };
    ShowDirective.prototype.update = function (murmur, updateData) {
        var dExp = this.directiveExpression;
        var dom = murmur.getNode();
        if (!murmur.extract(dExp)) {
            dom.style.display = 'none';
        }
        else {
            dom.style.display = '';
        }
    };
    return ShowDirective;
}(MurmurDirective));
exports.ShowDirective = ShowDirective;
var RefDirective = (function (_super) {
    __extends(RefDirective, _super);
    function RefDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RefDirective.prototype.compile = function (murmur, domGenerated) {
        murmur.refClue = this.directiveExpression;
        return domGenerated;
    };
    RefDirective.prototype.update = function () { };
    return RefDirective;
}(MurmurDirective));
exports.RefDirective = RefDirective;
var MountDirective = (function (_super) {
    __extends(MountDirective, _super);
    function MountDirective() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.callbacks = [];
        return _this;
    }
    MountDirective.prototype.compile = function (murmur, domGenerated) {
        var mountCallback = murmur.extract(this.directiveExpression);
        mountCallback && this.callbacks.push(mountCallback);
        murmur.$mountDirective = this;
        return domGenerated;
    };
    MountDirective.prototype.update = function () { };
    return MountDirective;
}(MurmurDirective));
exports.MountDirective = MountDirective;
