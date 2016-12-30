"use strict";
var murmur_creator_1 = require("./murmur.creator");
var murmur_field_1 = require("./murmur.field");
var murmur_tool_1 = require("./murmur.tool");
var wx_parser_1 = require("wx-parser");
var murmurID = 1;
function isMurmur(obj) {
    return obj instanceof Murmur;
}
var murmurRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})/g;
var extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
var Murmur = (function () {
    function Murmur(tagName, attr, children) {
        this.updateModel = {};
        this.$repeatDirective = { $repeatEntrance: true, $repeatEntity: false, repeatModel: null, repeatDInstance: null };
        this._fields = {};
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
    Murmur.prototype.render = function (model) {
        var root = this.create(model);
        var childNodes = root.childNodes;
        var loc = document.getElementById(this._loc);
        for (var i = 0; i < childNodes.length; i++) {
            loc.appendChild(childNodes[i]);
        }
    };
    Murmur.prototype.update = function (updateObj) {
        Object.assign(this.updateModel, updateObj);
        for (var _i = 0, _a = this.getRecursiveMurmurChildren(); _i < _a.length; _i++) {
            var deepChild = _a[_i];
            Object.assign(deepChild.updateModel, updateObj);
        }
        this.dispatchUpdate(updateObj, Object.keys(updateObj));
    };
    Murmur.prototype.dispatchUpdate = function (updateObj, keysNeedToBeUpdate) {
        if (this._connected.isSimpleDom()) {
            for (var _i = 0, _a = this.$directives; _i < _a.length; _i++) {
                var $d = _a[_i];
                $d.update(this, updateObj);
            }
            this.doUpdate(updateObj, keysNeedToBeUpdate);
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var child = _c[_b];
                if (isMurmur(child)) {
                    child.dispatchUpdate(updateObj, keysNeedToBeUpdate);
                }
            }
        }
        else {
            this.$repeatDirective.repeatDInstance.update(this, updateObj);
        }
    };
    Murmur.prototype.doUpdate = function (updateObj, keysNeedToBeUpdate) {
        var fieldKeys = Object.keys(this._fields);
        for (var _i = 0, fieldKeys_1 = fieldKeys; _i < fieldKeys_1.length; _i++) {
            var field = fieldKeys_1[_i];
            if (keysNeedToBeUpdate.indexOf(murmur_tool_1.removeFirstColon(field)) !== -1) {
                this._fields[field].dispatchSync(this);
            }
        }
    };
    Murmur.prototype.evalExpression = function (val, unit, fieldType) {
        var copyVal = val;
        if (!murmur_tool_1.isNothing(val)) {
            var matches = val.match(extractValueRegexr);
            if (matches) {
                for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                    var m = matches_1[_i];
                    var key = murmur_tool_1.removeBraceOfValue(murmur_tool_1.removeAllSpace(m));
                    var value = this.extract(key);
                    this._fields[key] = new murmur_field_1.default(value, val, fieldType, unit);
                    copyVal = copyVal.replace(m, value);
                }
            }
        }
        return copyVal;
    };
    Murmur.prototype.extract = function (field) {
        var repeatModel = this.$repeatDirective.repeatModel;
        if (murmur_tool_1.removeAllSpace(field).indexOf(':') === 0) {
            var ff = field.slice(1);
            if (ff in this.updateModel) {
                return this.updateModel[field.slice(1)];
            }
            else {
                return repeatModel[field.slice(1)];
            }
        }
        else {
            if (field in this.updateModel) {
                return this.updateModel[field];
            }
            else {
                return this.model[field];
            }
        }
    };
    Murmur.prototype.getRecursiveMurmurChildren = function (recursiveChilren) {
        if (recursiveChilren === void 0) { recursiveChilren = []; }
        var murmurChildren = this.children;
        if (this.$repeatDirective.repeatDInstance) {
            murmurChildren = this.$repeatDirective.repeatDInstance.murmurList;
        }
        for (var _i = 0, murmurChildren_1 = murmurChildren; _i < murmurChildren_1.length; _i++) {
            var child = murmurChildren_1[_i];
            if (isMurmur(child)) {
                recursiveChilren.push(child);
                child.getRecursiveMurmurChildren(recursiveChilren);
            }
        }
        return recursiveChilren;
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
    Murmur.prepare = function (renderObj) {
        var murmurTree;
        if (renderObj.template) {
            murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(renderObj.template, murmurRegex));
            murmurTree._loc = renderObj.loc;
            return murmurTree;
        }
        else if (renderObj.templateUrl) {
            murmur_tool_1.ajax({
                url: renderObj.templateUrl,
                success: function (responseText) {
                    murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(responseText, murmurRegex));
                    murmurTree._loc = renderObj.loc;
                    renderObj.ok && renderObj.ok(murmurTree);
                }
            });
            return function () { return murmurTree; };
        }
    };
    return Murmur;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Murmur;
