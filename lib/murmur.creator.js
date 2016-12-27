"use strict";
var murmur_field_1 = require("./murmur.field");
var tools = require("./murmur.tool");
var murmur_type_1 = require("./murmur.type");
var MurmurCreator = (function () {
    function MurmurCreator() {
        this.extractValueRegexr = /\{\w+\}/g;
    }
    MurmurCreator.prototype.create = function (murmur, model) {
        if (murmur.nodeName === murmur_type_1.MurmurRegexType.TEXTNODE) {
            return this.createTextNode(murmur, model);
        }
        else {
            var dom = document.createElement(murmur.nodeName);
            this.attachAttr(dom, model, murmur);
            this.appendChildren(dom, model, murmur);
            return dom;
        }
    };
    MurmurCreator.prototype.attachAttr = function (dom, model, murmur) {
        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
            var a = _a[_i];
            // let key = this.extractFromModel(a.name, model, murmur, MurmurFieldType.ATTR),
            var value = this.extractFromModel(a.value, model, murmur, a, murmur_type_1.MurmurFieldType.ATTR);
            // a.name=key;
            a.value = value;
            dom.setAttributeNode(a);
        }
    };
    MurmurCreator.prototype.appendChildren = function (parent, model, murmur) {
        for (var _i = 0, _a = murmur.children; _i < _a.length; _i++) {
            var child = _a[_i];
            parent.appendChild(child.create(model));
        }
    };
    MurmurCreator.prototype.createTextNode = function (murmur, model) {
        var onlyChild = murmur.children[0];
        var textNode;
        try {
            if (tools.isSimpleValue(onlyChild)) {
                textNode = document.createTextNode(this.extractFromModel(onlyChild, model, murmur));
            }
            else {
                throw new TypeError();
            }
        }
        catch (err) {
            console.error(err);
            textNode = document.createTextNode('');
        }
        finally {
            return textNode;
        }
    };
    MurmurCreator.prototype.extractFromModel = function (val, model, murmur, attr, fieldType) {
        if (attr === void 0) { attr = null; }
        if (fieldType === void 0) { fieldType = murmur_type_1.MurmurFieldType.TEXT; }
        var newString = val;
        if (!tools.isNothing(val)) {
            var matches = val.match(this.extractValueRegexr);
            if (matches) {
                for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                    var m = matches_1[_i];
                    var key = tools.removeBraceOfValue(m), value = model[key];
                    murmur._fileds[key] = new murmur_field_1.default(value, fieldType, attr || null);
                    newString = val.replace(m, value);
                }
            }
        }
        return newString;
    };
    return MurmurCreator;
}());
var MurmurCreatorFactory = (function () {
    var creatorInstance;
    return function () {
        return creatorInstance || (creatorInstance = new MurmurCreator());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MurmurCreatorFactory;
