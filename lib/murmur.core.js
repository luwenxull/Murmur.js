"use strict";
var murmur_creator_1 = require("./murmur.creator");
var murmur_field_1 = require("./murmur.field");
var murmur_tool_1 = require("./murmur.tool");
var wx_parser_1 = require("wx-parser");
require("whatwg-fetch");
var murmurID = 1;
function isMurmur(obj) {
    return obj instanceof Murmur;
}
var murmurRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})/g;
var extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
var Murmur = (function () {
    function Murmur(tagName, attr, children) {
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
        Object.assign(this.model, updateObj);
        this.dispatchUpdate(updateObj, Object.keys(updateObj));
    };
    Murmur.prototype.dispatchUpdate = function (updateObj, keysNeedToBeUpdate) {
        if (this._connected.isSimpleDom()) {
            this.doUpdate(updateObj, keysNeedToBeUpdate);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
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
            return repeatModel[field.slice(1)];
        }
        else {
            return this.model[field];
        }
    };
    Murmur.prototype.replaceRepeatModelOfChild = function (newModel) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (isMurmur(child)) {
                child.$repeatDirective.repeatModel = newModel;
                child.replaceRepeatModelOfChild(newModel);
            }
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
    Murmur.prepare = function (renderObj) {
        var murmurTree;
        if (renderObj.template) {
            murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(renderObj.template, murmurRegex));
            murmurTree._loc = renderObj.loc;
            return murmurTree;
        }
        else if (renderObj.templateUrl) {
            return fetch(renderObj.templateUrl).then(function (response) {
                return response.text();
            }).then(function (body) {
                murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(body, murmurRegex));
                murmurTree._loc = renderObj.loc;
                return murmurTree;
            }).then(function (murmurTree) {
                renderObj.ok && renderObj.ok(murmurTree);
                return murmurTree;
            });
        }
    };
    return Murmur;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Murmur;
