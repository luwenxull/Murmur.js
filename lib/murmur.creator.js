"use strict";
var murmur_field_1 = require("./murmur.field");
var tools = require("./murmur.tool");
var murmur_type_1 = require("./murmur.type");
var MurmurDirectives = require("./murmur.directive");
var murmur_connect_1 = require("./murmur.connect");
var MurmurCreator = (function () {
    function MurmurCreator() {
        this.extractValueRegexr = /\{:{0,1}\w+\}/g;
    }
    MurmurCreator.prototype.create = function (murmur, model) {
        var connect;
        if (murmur.nodeName === murmur_type_1.MurmurRegexType.TEXTNODE) {
            connect = new murmur_connect_1.default(this.createTextNode(murmur, model), murmur_type_1.MurmurConnectTypes[0]);
        }
        else {
            var dom = document.createElement(murmur.nodeName);
            var compiledDom = this.checkMMDirective(model, murmur, dom);
            if (compiledDom) {
                connect = new murmur_connect_1.default(compiledDom, murmur_type_1.MurmurConnectTypes[1]);
            }
            else {
                this.attachAttr(dom, model, murmur);
                this.appendChildren(dom, model, murmur);
                connect = new murmur_connect_1.default(dom, murmur_type_1.MurmurConnectTypes[0]);
            }
        }
        return connect;
    };
    MurmurCreator.prototype.checkMMDirective = function (model, murmur, domGenerated) {
        var fragment = document.createDocumentFragment();
        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
            var attr = _a[_i];
            var name_1 = attr.name, value = attr.value;
            if (name_1 == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
                var directive = new MurmurDirectives[murmur_type_1.MurmurDirectiveTypesMap[name_1].directive](value);
                murmur.$directives.push(directive);
                murmur.$repeatDirective.repeatDInstance = directive;
                return directive.compile(model, murmur, domGenerated);
            }
        }
        for (var _b = 0, _c = murmur.attr; _b < _c.length; _b++) {
            var attr = _c[_b];
            var name_2 = attr.name, value = attr.value;
            if (name_2 !== "mm-repeat" && murmur_type_1.MurmurDirectiveTypesMap[name_2]) {
                var directive = new MurmurDirectives[murmur_type_1.MurmurDirectiveTypesMap[name_2].directive](value);
                murmur.$directives.push(directive);
                directive.compile(model, murmur, domGenerated);
            }
        }
        return null;
    };
    MurmurCreator.prototype.attachAttr = function (dom, model, murmur) {
        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
            var a = _a[_i];
            var htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = this.extractFromModel(a.value, model, murmur, htmlAttr, murmur_type_1.MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    };
    MurmurCreator.prototype.appendChildren = function (parent, model, murmur) {
        for (var _i = 0, _a = murmur.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child = child;
            child.$repeatDirective.repeatModel = murmur.$repeatDirective.repeatModel;
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
                    var key = tools.removeBraceOfValue(m);
                    var value = murmur.extract(key);
                    murmur._fileds[key] = new murmur_field_1.default(value, fieldType, attr);
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
