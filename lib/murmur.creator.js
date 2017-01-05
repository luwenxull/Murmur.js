"use strict";
var murmur_core_1 = require("./murmur.core");
var tools = require("./murmur.tool");
var murmur_type_1 = require("./murmur.type");
var MurmurDirectives = require("./murmur.directive");
var murmur_connect_1 = require("./murmur.connect");
var MurmurCreator = (function () {
    function MurmurCreator() {
        this.extractValueRegexr = /\{:{0,1}\w+\}/g;
    }
    MurmurCreator.prototype.create = function (murmur) {
        var connect;
        if (murmur.nodeName === murmur_type_1.MurmurNodeType.TEXTNODE) {
            connect = new murmur_connect_1.default(this.createTextNode(murmur), murmur_type_1.MurmurConnectTypes[0]);
        }
        else if (murmur.nodeName === murmur_type_1.MurmurNodeType.COMMENTNODE) {
            connect = new murmur_connect_1.default(this.createComment(murmur), murmur_type_1.MurmurConnectTypes[0]);
        }
        else {
            var dom = document.createElement(murmur.nodeName);
            if (murmur.nodeName === 'ROOT') {
                dom = document.createDocumentFragment();
            }
            var compiledDom = this.checkMMDirective(murmur, dom);
            if (compiledDom) {
                connect = new murmur_connect_1.default(compiledDom, murmur_type_1.MurmurConnectTypes[1]);
            }
            else {
                this.attachAttr(dom, murmur);
                this.appendChildren(dom, murmur);
                connect = new murmur_connect_1.default(dom, murmur_type_1.MurmurConnectTypes[0]);
            }
        }
        return connect;
    };
    MurmurCreator.prototype.checkMMDirective = function (murmur, domGenerated) {
        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
            var attr = _a[_i];
            var name_1 = attr.name, value = attr.value;
            if (name_1 == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
                return this.compileRepeat(murmur, domGenerated, name_1, value);
            }
        }
        var _loop_1 = function (attr1) {
            var name_2 = attr1.name, value = attr1.value;
            if (name_2 !== "mm-repeat" && murmur_type_1.MurmurDirectiveTypes[name_2]) {
                this_1.compileNormal(murmur, domGenerated, name_2, value);
            }
            if (name_2 in murmur_type_1.MurmurEventTypes) {
                var eventName = name_2.split('-')[1], callback_1 = murmur.extract(value);
                domGenerated.addEventListener(eventName, function (e) {
                    callback_1(murmur, e);
                });
            }
        };
        var this_1 = this;
        for (var _b = 0, _c = murmur.attr; _b < _c.length; _b++) {
            var attr1 = _c[_b];
            _loop_1(attr1);
        }
        return null;
    };
    MurmurCreator.prototype.compileRepeat = function (murmur, domGenerated, name, value) {
        var directive = new MurmurDirectives[murmur_type_1.MurmurDirectiveTypes[name].directive](value);
        murmur.$directives.push(directive);
        murmur.$repeatDirective.repeatDInstance = directive;
        return directive.compile(murmur, domGenerated);
    };
    MurmurCreator.prototype.compileNormal = function (murmur, domGenerated, name, value) {
        var directive = new MurmurDirectives[murmur_type_1.MurmurDirectiveTypes[name].directive](value);
        murmur.$directives.push(directive);
        directive.compile(murmur, domGenerated);
    };
    MurmurCreator.prototype.attachAttr = function (dom, murmur) {
        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
            var a = _a[_i];
            var htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = murmur.evalExpression(a.value, htmlAttr, murmur_type_1.MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    };
    MurmurCreator.prototype.appendChildren = function (parent, murmur) {
        for (var _i = 0, _a = murmur.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child = child;
            child.create(murmur.combineModel());
            var childDOM = child.getNode();
            tools.appendChild(childDOM, parent);
        }
        if (murmur.$mountDirective) {
            for (var _b = 0, _c = murmur.$mountDirective.callbacks; _b < _c.length; _b++) {
                var callback = _c[_b];
                callback.call(null, murmur);
            }
        }
    };
    MurmurCreator.prototype.createTextNode = function (murmur) {
        var onlyChild = murmur.children[0];
        var textNode;
        try {
            if (tools.isSimpleValue(onlyChild)) {
                textNode = document.createTextNode('');
                textNode.textContent = murmur.evalExpression(onlyChild, textNode, murmur_type_1.MurmurFieldType.TEXT);
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
    MurmurCreator.prototype.createComment = function (murmur) {
        var str = '';
        for (var _i = 0, _a = murmur.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (murmur_core_1.isMurmur(child)) {
                child.create(murmur.combineModel());
                str += child.getNode().outerHTML;
            }
            else {
                str += child;
            }
        }
        return document.createComment(str);
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
