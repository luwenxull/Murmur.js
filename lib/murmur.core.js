"use strict";
var murmur_creator_1 = require("./murmur.creator");
var murmur_tool_1 = require("./murmur.tool");
var murmurID = 1;
function isMurmur(obj) {
    return obj instanceof Murmur;
}
var Murmur = (function () {
    function Murmur(tagName, attr, children) {
        this.$repeatDirective = { $repeatEntrance: true, $repeatEntity: false, repeatModel: null, repeatDInstance: null };
        this._fileds = {};
        this.$directives = [];
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
        this.murmurID = murmurID++;
    }
    Murmur.prototype.create = function (model) {
        if (model === void 0) { model = null; }
        this.model = model;
        this._connected = murmur_creator_1.default().create(this, model);
        return this._connected.dom;
    };
    Murmur.prototype.dispatchUpdate = function (updateObj) {
        if (this._connected.isSimpleDom()) {
            this.directlyUpdate(updateObj);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (isMurmur(child)) {
                    child.dispatchUpdate(updateObj);
                }
            }
        }
        else {
            this.$repeatDirective.repeatDInstance.update(this);
        }
    };
    Murmur.prototype.directlyUpdate = function (updateObj) {
        var newKeys = Object.keys(updateObj), oldKeys = Object.keys(this._fileds);
        for (var _i = 0, newKeys_1 = newKeys; _i < newKeys_1.length; _i++) {
            var nk = newKeys_1[_i];
            if (oldKeys.indexOf(nk) !== -1) {
                var v = updateObj[nk], field = this._fileds[nk];
                if (field.attrCatcher) {
                    field.attrCatcher.value = v;
                }
                else {
                    this._connected.get().textContent = v;
                }
            }
        }
    };
    Murmur.prototype.extract = function (field) {
        var repeatModel = this.$repeatDirective.repeatModel;
        if (murmur_tool_1.removeAllSpace(field).indexOf(':') === 0) {
            return repeatModel[field.slice(1)];
        }
        else {
            return this.model[field];
        }
    };
    Murmur.convert = function (obj) {
        if (obj.nodeName) {
            var nodeName = obj.nodeName, attr = obj.attr, children = obj.children;
            children = children.map(function (child) { return Murmur.convert(child); });
            return new Murmur(nodeName, attr, children);
        }
        else {
            return obj;
        }
    };
    Murmur.clone = function (murmur) {
        if (murmur.nodeName) {
            var nodeName = murmur.nodeName, attr = murmur.attr, children = murmur.children;
            children = children.map(function (child) { return Murmur.clone(child); });
            return new Murmur(nodeName, attr, children);
        }
        else {
            return murmur;
        }
    };
    return Murmur;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Murmur;
