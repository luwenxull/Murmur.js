"use strict";
var murmur_creator_1 = require("./murmur.creator");
var murmur_tool_1 = require("./murmur.tool");
function isMurmur(obj) {
    return obj instanceof Murmur;
}
var Murmur = (function () {
    function Murmur(tagName, attr, children) {
        this.repeatMMDState = { inRepeat: false, repeatModel: null, repeatDirective: null };
        this._fileds = {};
        this.$directives = [];
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
    }
    Murmur.prototype.create = function (model) {
        if (model === void 0) { model = null; }
        this.model = model;
        return this._connected = murmur_creator_1.default().create(this, model);
    };
    Murmur.prototype.update = function (updateObj) {
        var newKeys = Object.keys(updateObj), oldKeys = Object.keys(this._fileds);
        for (var _i = 0, newKeys_1 = newKeys; _i < newKeys_1.length; _i++) {
            var nk = newKeys_1[_i];
            if (oldKeys.indexOf(nk) !== -1) {
                var v = updateObj[nk], field = this._fileds[nk];
                if (field.attrCatcher) {
                    field.attrCatcher.value = v;
                }
                else {
                    this._connected.textContent = v;
                }
            }
        }
        for (var _a = 0, _b = this.children; _a < _b.length; _a++) {
            var child = _b[_a];
            if (isMurmur(child)) {
                child.update(updateObj);
            }
        }
    };
    Murmur.prototype.extract = function (field) {
        var repeatModel = this.repeatMMDState.repeatModel;
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
        if (isMurmur(murmur)) {
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
