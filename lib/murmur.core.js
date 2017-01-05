"use strict";
var murmur_creator_1 = require("./murmur.creator");
var murmur_field_1 = require("./murmur.field");
var murmur_tool_1 = require("./murmur.tool");
var wx_parser_1 = require("wx-parser");
var murmur_promise_1 = require("./murmur.promise");
var murmur_type_1 = require("./murmur.type");
var murmurID = 1;
function isMurmur(obj) {
    return obj instanceof Murmur;
}
var extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
var Murmur = (function () {
    function Murmur(tagName, attr, children) {
        this.model = { exotic: null, state: null };
        this.$repeatDirective = { $repeatEntrance: true, $repeatEntity: false, repeatDInstance: null };
        this.$ifDirective = { shouldReturn: true, spaceHolder: null };
        this._fields = {};
        this.refPromise = null;
        this.$directives = [];
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
        this.murmurID = murmurID++;
    }
    Murmur.prototype.create = function (exotic) {
        if (exotic === void 0) { exotic = null; }
        this.model.exotic = exotic;
        return this._connected = murmur_creator_1.default().create(this);
    };
    Murmur.prototype.render = function (loc, success) {
        var _this = this;
        var notResolvedPromise = this.getAllNotResolved();
        this.handleNotResolved(notResolvedPromise, function () {
            _this.create();
            var childNodes = _this.getNode().childNodes;
            var root = document.getElementById(loc);
            murmur_tool_1.appendChild(Array.prototype.slice.call(childNodes, 0), root);
            if (success) {
                success.call(null, _this);
            }
        });
    };
    Murmur.prototype.getAllNotResolved = function (notResolvedPromise) {
        if (notResolvedPromise === void 0) { notResolvedPromise = []; }
        var waitPromise = this.refPromise;
        if (waitPromise) {
            if (waitPromise.status === murmur_type_1.MurmurPromiseType.PENDING) {
                notResolvedPromise.push(waitPromise);
            }
            if (waitPromise.status === murmur_type_1.MurmurPromiseType.RESOLVED) {
                waitPromise.murmur.getAllNotResolved(notResolvedPromise);
            }
        }
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (isMurmur(child)) {
                child.getAllNotResolved(notResolvedPromise);
            }
        }
        return notResolvedPromise;
    };
    Murmur.prototype.handleNotResolved = function (notResolvedPromise, callback) {
        var _this = this;
        var allResolved = true;
        for (var _i = 0, notResolvedPromise_1 = notResolvedPromise; _i < notResolvedPromise_1.length; _i++) {
            var nrp = notResolvedPromise_1[_i];
            if (nrp.status === murmur_type_1.MurmurPromiseType.PENDING && !nrp.resolveNotify) {
                nrp.resolveNotify = true;
                nrp.then(function (murmur) {
                    murmur.getAllNotResolved(notResolvedPromise);
                    _this.handleNotResolved(notResolvedPromise, callback);
                });
                allResolved = false;
            }
        }
        if (allResolved) {
            callback();
        }
    };
    Murmur.prototype.update = function (updateObj) {
        this.model.state = this.model.state || {};
        Object.assign(this.model.state, updateObj);
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
                    child.model.exotic = this.combineModel();
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
        var model = this.combineModel(), exotic = this.model.exotic;
        if (murmur_tool_1.removeAllSpace(field).indexOf(':') === 0) {
            return exotic[field.slice(1)];
        }
        else {
            return model[field];
        }
    };
    Murmur.prototype.combineModel = function () {
        return Object.assign({}, this.model.exotic || {}, this.model.state || {});
    };
    Murmur.prototype.iterateChildren = function (ifBreak) {
        if (ifBreak(this)) {
            return this;
        }
        var murmurChildren = this.children;
        var result;
        if (this.$repeatDirective.repeatDInstance) {
            murmurChildren = this.$repeatDirective.repeatDInstance.murmurList;
        }
        for (var _i = 0, murmurChildren_1 = murmurChildren; _i < murmurChildren_1.length; _i++) {
            var child = murmurChildren_1[_i];
            if (isMurmur(child)) {
                if (ifBreak(child)) {
                    return child;
                }
                if (result = child.iterateChildren(ifBreak)) {
                    return result;
                }
            }
        }
        return result;
    };
    Murmur.prototype.ref = function (ref) {
        var fn = function (murmur) { return murmur.refClue === ref; };
        var refMurmur = this.iterateChildren(fn);
        return refMurmur;
    };
    Murmur.prototype.holder = function (placeholder) {
        var fn = function (murmur) { return murmur.placeholder === placeholder; };
        var refMurmur = this.iterateChildren(fn);
        return refMurmur;
    };
    Murmur.prototype.replace = function (murmurPromise) {
        var _this = this;
        this.refPromise = murmurPromise;
        murmurPromise.then(function () {
            _this.simpleClone(murmurPromise);
        });
    };
    Murmur.prototype.getNode = function () {
        if (this.$repeatDirective.repeatDInstance) {
            var nodeArray = [];
            for (var _i = 0, _a = this.$repeatDirective.repeatDInstance.murmurList; _i < _a.length; _i++) {
                var murmur = _a[_i];
                nodeArray.push(murmur.getNode());
            }
            return nodeArray;
        }
        else {
            if (this.$ifDirective.shouldReturn) {
                return this._connected.getDOM();
            }
            else {
                return this.$ifDirective.spaceHolder;
            }
        }
    };
    Murmur.prototype.simpleClone = function (promise) {
        var murmur = promise.murmur;
        var source = murmur.children[0];
        if (isMurmur(source)) {
            this.children = source.children;
            this.attr = source.attr;
            this.nodeName = source.nodeName;
        }
        else {
        }
    };
    Murmur.convert = function (obj) {
        if (obj.nodeName) {
            var nodeName = obj.nodeName, attr = obj.attr, children = obj.children;
            children = children.map(function (child) { return Murmur.convert(child); });
            var m = new Murmur(nodeName, attr, children);
            for (var _i = 0, attr_1 = attr; _i < attr_1.length; _i++) {
                var a = attr_1[_i];
                if (a.name == 'mm-holder')
                    m.placeholder = a.value;
            }
            return m;
        }
        return obj;
    };
    Murmur.clone = function (murmur) {
        if (murmur.nodeName) {
            var nodeName = murmur.nodeName, attr = murmur.attr, children = murmur.children;
            children = children.map(function (child) { return Murmur.clone(child); });
            return new Murmur(nodeName, attr, children);
        }
        return murmur;
    };
    Murmur.prepare = function (prepareObj) {
        var murmurTree;
        var murmurPromise = new murmur_promise_1.MurmurPromise(prepareObj.template || prepareObj.templateUrl);
        if (prepareObj.template) {
            murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(prepareObj.template));
            prepareObj.model && (murmurTree.model.state = prepareObj.model);
            murmurPromise.resolve(murmurTree);
        }
        else if (prepareObj.templateUrl) {
            murmur_tool_1.ajax({
                url: prepareObj.templateUrl,
                success: function (responseText) {
                    murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(responseText));
                    prepareObj.model && (murmurTree.model.state = prepareObj.model);
                    murmurPromise.resolve(murmurTree);
                }
            });
        }
        return murmurPromise;
    };
    return Murmur;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Murmur;
