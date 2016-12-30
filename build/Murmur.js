/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	if (window) {
	    window.Murmur = __webpack_require__(1)['default'];
	}

	exports.Murmur = __webpack_require__(1)['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_creator_1 = __webpack_require__(2);
	var murmur_field_1 = __webpack_require__(7);
	var murmur_tool_1 = __webpack_require__(3);
	var wx_parser_1 = __webpack_require__(8);
	__webpack_require__(12);
	var murmurID = 1;
	function isMurmur(obj) {
	    return obj instanceof Murmur;
	}
	var murmurRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})/g;
	var extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
	var Murmur = function () {
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
	        if (model === void 0) {
	            model = null;
	        }
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
	        } else {
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
	        } else {
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
	            var nodeName = obj.nodeName,
	                attr = obj.attr,
	                children = obj.children;
	            children = children.map(function (child) {
	                return Murmur.convert(child);
	            });
	            return new Murmur(nodeName, attr, children);
	        } else {
	            return obj;
	        }
	    };
	    Murmur.clone = function (murmur) {
	        if (murmur.nodeName) {
	            var nodeName = murmur.nodeName,
	                attr = murmur.attr,
	                children = murmur.children;
	            children = children.map(function (child) {
	                return Murmur.clone(child);
	            });
	            return new Murmur(nodeName, attr, children);
	        } else {
	            return murmur;
	        }
	    };
	    Murmur.prepare = function (renderObj) {
	        var murmurTree;
	        if (renderObj.template) {
	            murmurTree = Murmur.convert(wx_parser_1.wxParser.parseStart(renderObj.template, murmurRegex));
	            murmurTree._loc = renderObj.loc;
	            return murmurTree;
	        } else if (renderObj.templateUrl) {
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
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Murmur;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var tools = __webpack_require__(3);
	var murmur_type_1 = __webpack_require__(4);
	var MurmurDirectives = __webpack_require__(5);
	var murmur_connect_1 = __webpack_require__(6);
	var MurmurCreator = function () {
	    function MurmurCreator() {
	        this.extractValueRegexr = /\{:{0,1}\w+\}/g;
	    }
	    MurmurCreator.prototype.create = function (murmur, model) {
	        var connect;
	        if (murmur.nodeName === murmur_type_1.MurmurRegexType.TEXTNODE) {
	            connect = new murmur_connect_1.default(this.createTextNode(murmur, model), murmur_type_1.MurmurConnectTypes[0]);
	        } else {
	            var dom = document.createElement(murmur.nodeName);
	            var compiledDom = this.checkMMDirective(model, murmur, dom);
	            if (compiledDom) {
	                connect = new murmur_connect_1.default(compiledDom, murmur_type_1.MurmurConnectTypes[1]);
	            } else {
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
	            var name_1 = attr.name,
	                value = attr.value;
	            if (name_1 == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
	                var directive = new MurmurDirectives[murmur_type_1.MurmurDirectiveTypes[name_1].directive](value);
	                murmur.$directives.push(directive);
	                murmur.$repeatDirective.repeatDInstance = directive;
	                return directive.compile(model, murmur, domGenerated);
	            }
	        }
	        var _loop_1 = function (attr) {
	            var name_2 = attr.name,
	                value = attr.value;
	            if (name_2 !== "mm-repeat" && murmur_type_1.MurmurDirectiveTypes[name_2]) {
	                var directive = new MurmurDirectives[murmur_type_1.MurmurDirectiveTypes[name_2].directive](value);
	                murmur.$directives.push(directive);
	                directive.compile(model, murmur, domGenerated);
	            }
	            if (name_2 in murmur_type_1.MurmurEventTypes) {
	                var eventName = name_2.split('-')[1],
	                    callback_1 = murmur.extract(value);
	                domGenerated.addEventListener(eventName, function (e) {
	                    callback_1(murmur, e);
	                });
	            }
	        };
	        for (var _b = 0, _c = murmur.attr; _b < _c.length; _b++) {
	            var attr = _c[_b];
	            _loop_1(attr);
	        }
	        return null;
	    };
	    MurmurCreator.prototype.attachAttr = function (dom, model, murmur) {
	        for (var _i = 0, _a = murmur.attr; _i < _a.length; _i++) {
	            var a = _a[_i];
	            var htmlAttr = document.createAttribute(a.name);
	            htmlAttr.value = murmur.evalExpression(a.value, htmlAttr, murmur_type_1.MurmurFieldType.ATTR);
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
	                textNode = document.createTextNode('');
	                textNode.textContent = murmur.evalExpression(onlyChild, textNode, murmur_type_1.MurmurFieldType.TEXT);
	            } else {
	                throw new TypeError();
	            }
	        } catch (err) {
	            console.error(err);
	            textNode = document.createTextNode('');
	        } finally {
	            return textNode;
	        }
	    };
	    return MurmurCreator;
	}();
	var MurmurCreatorFactory = function () {
	    var creatorInstance;
	    return function () {
	        return creatorInstance || (creatorInstance = new MurmurCreator());
	    };
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MurmurCreatorFactory;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * 判断是否是简单值
	 *
	 * @param {any} val
	 * @returns
	 */

	function isSimpleValue(val) {
	    var type = typeof val;
	    return type === 'string' || type === 'number' || false;
	}
	exports.isSimpleValue = isSimpleValue;
	/**
	 * 去除取值表达式两侧大括号
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeBraceOfValue(str) {
	    return str.slice(1, str.length - 1);
	}
	exports.removeBraceOfValue = removeBraceOfValue;
	/**
	 * 快速排序
	 *
	 * @param {Array} arr
	 * @param {String} arr
	 * @returns
	 */
	function quickSort(arr, sortField) {
	    if (sortField === void 0) {
	        sortField = null;
	    }
	    if (arr.length <= 1) {
	        return arr;
	    }
	    var pivotIndex = Math.floor(arr.length / 2);
	    var pivot = arr.splice(pivotIndex, 1)[0],
	        pivotField = sortField ? pivot[sortField] : pivot;
	    var left = [],
	        right = [];
	    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
	        var item = arr_1[_i];
	        var itemField = sortField ? item[sortField] : item;
	        if (itemField < pivotField) {
	            left.push(item);
	        } else {
	            right.push(item);
	        }
	    }
	    return quickSort(left, sortField).concat([pivot], quickSort(right, sortField));
	}
	exports.quickSort = quickSort;
	;
	/**
	 * 判断是否是null或者undefined
	 *
	 * @param {any} val
	 * @returns
	 */
	function isNothing(val) {
	    return val === null || val === undefined;
	}
	exports.isNothing = isNothing;
	/**
	 * 设置默认值并返回
	 *
	 * @param {any} val
	 * @param {any} expected
	 * @returns
	 */
	function setDefault(val, expected) {
	    return isNothing(val) ? val = expected : val;
	}
	exports.setDefault = setDefault;
	/**
	 * 去除等号两侧的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeEqualSpace(str) {
	    return str.replace(/\s*\=\s*/g, '=');
	}
	exports.removeEqualSpace = removeEqualSpace;
	/**
	 * 修正空格个数。
	 * 将多个相连的空格缩减为一个空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeMultiSpace(str) {
	    return str.replace(/\s{2,}/g, " ");
	}
	exports.removeMultiSpace = removeMultiSpace;
	/**
	 * 移除所有的空格
	 *
	 * @export
	 * @param {string} str
	 * @returns {string}
	 */
	function removeAllSpace(str) {
	    return str.replace(/\s*/g, '');
	}
	exports.removeAllSpace = removeAllSpace;
	/**
	 * 在当前节点的后面添加兄弟节点
	 *
	 * @export
	 * @param {Node} node 当前节点
	 * @param {Node} refrenceNode 待添加节点
	 */
	function addSibling(node, refrenceNode) {
	    var parentNode = node.parentNode;
	    var nextSibling = node.nextSibling;
	    if (nextSibling) {
	        parentNode.insertBefore(refrenceNode, nextSibling);
	    } else {
	        parentNode.appendChild(refrenceNode);
	    }
	}
	exports.addSibling = addSibling;
	/**
	 * 返回不带冒号的属性值
	 *
	 * @export
	 * @param {string} val
	 * @returns {string}
	 */
	function removeFirstColon(val) {
	    if (val[0] === ':') {
	        return val.slice(1);
	    }
	    return val;
	}
	exports.removeFirstColon = removeFirstColon;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	exports.MurmurRegexType = {
	    TEXTNODE: 'TEXTNODE',
	    NODESTART: 'NODESTART',
	    NODEEND: 'NODEEND',
	    NODECLOSESELF: 'NODECLOSESELF'
	};
	var MurmurFieldType;
	(function (MurmurFieldType) {
	    MurmurFieldType[MurmurFieldType["ATTR"] = 0] = "ATTR";
	    MurmurFieldType[MurmurFieldType["TEXT"] = 1] = "TEXT";
	})(MurmurFieldType = exports.MurmurFieldType || (exports.MurmurFieldType = {}));
	exports.MurmurDirectiveTypes = {
	    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
	    "mm-if": { name: "mm-if", directive: "IfDirective" }
	};
	var MurmurConnectTypes;
	(function (MurmurConnectTypes) {
	    MurmurConnectTypes[MurmurConnectTypes["DOM"] = 0] = "DOM";
	    MurmurConnectTypes[MurmurConnectTypes["DIRECTIVE"] = 1] = "DIRECTIVE";
	})(MurmurConnectTypes = exports.MurmurConnectTypes || (exports.MurmurConnectTypes = {}));
	var MurmurEventTypes;
	(function (MurmurEventTypes) {
	    MurmurEventTypes[MurmurEventTypes["mm-click"] = 0] = "mm-click";
	})(MurmurEventTypes = exports.MurmurEventTypes || (exports.MurmurEventTypes = {}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = this && this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var murmur_core_1 = __webpack_require__(1);
	var murmur_tool_1 = __webpack_require__(3);
	var MurmurDirective = function () {
	    function MurmurDirective(directiveExpression) {
	        this.directiveExpression = directiveExpression;
	    }
	    return MurmurDirective;
	}();
	exports.MurmurDirective = MurmurDirective;
	var RepeatDirective = function (_super) {
	    __extends(RepeatDirective, _super);
	    function RepeatDirective() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.murmurList = [];
	        return _this;
	    }
	    RepeatDirective.prototype.compile = function (model, murmur, domGenerated) {
	        // murmur.$repeatDirective.inRepeat=true;
	        var dExp = this.directiveExpression;
	        var fragment = document.createDocumentFragment();
	        if (model[dExp]) {
	            for (var _i = 0, _a = model[dExp]; _i < _a.length; _i++) {
	                var a = _a[_i];
	                var clone = murmur_core_1.default.clone(murmur);
	                clone.$repeatDirective.$repeatEntrance = false;
	                clone.$repeatDirective.$repeatEntity = true;
	                clone.$repeatDirective.repeatModel = a;
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
	        var repeatArr = updateData[this.directiveExpression];
	        var keysNeedToBeUpdate = Object.keys(updateData);
	        if (repeatArr) {
	            var repeatArrLength = repeatArr.length,
	                mmListLength = this.murmurList.length;
	            this.lengthCheck(repeatArr, murmur);
	            for (var i = 0; i < repeatArrLength; i++) {
	                var repeatObj = repeatArr[i];
	                var m = this.murmurList[i];
	                if (m) {
	                    m.$repeatDirective.repeatModel = repeatObj;
	                    m.replaceRepeatModelOfChild(repeatObj);
	                    m.dispatchUpdate(updateData, keysNeedToBeUpdate.concat(Object.keys(repeatObj)));
	                }
	            }
	        }
	    };
	    RepeatDirective.prototype.lengthCheck = function (repeatArr, murmur) {
	        var repeatArrLength = repeatArr.length,
	            mmListLength = this.murmurList.length;
	        if (mmListLength > repeatArrLength) {
	            this.removeExcessMurmur(mmListLength, repeatArrLength);
	        }
	        if (mmListLength < repeatArrLength) {
	            this.addExtraMurmur(repeatArr, murmur, mmListLength, repeatArrLength);
	        }
	    };
	    RepeatDirective.prototype.removeExcessMurmur = function (mmListLength, repeatArrLength) {
	        while (repeatArrLength < mmListLength) {
	            this.murmurList[--mmListLength]._connected.get().remove();
	            this.murmurList.pop();
	        }
	    };
	    RepeatDirective.prototype.addExtraMurmur = function (repeatArr, murmur, mmListLength, repeatArrLength) {
	        while (mmListLength < repeatArrLength) {
	            var clone = murmur_core_1.default.clone(murmur),
	                newDom = void 0,
	                lastDom = void 0;
	            clone.$repeatDirective.$repeatEntrance = false;
	            clone.$repeatDirective.$repeatEntity = true;
	            clone.$repeatDirective.repeatModel = repeatArr[mmListLength++];
	            newDom = clone.create(murmur.model);
	            lastDom = this.murmurList[mmListLength - 2]._connected.get();
	            murmur_tool_1.addSibling(lastDom, newDom);
	            this.murmurList.push(clone);
	        }
	    };
	    return RepeatDirective;
	}(MurmurDirective);
	exports.RepeatDirective = RepeatDirective;
	var IfDirective = function (_super) {
	    __extends(IfDirective, _super);
	    function IfDirective() {
	        return _super.apply(this, arguments) || this;
	    }
	    IfDirective.prototype.compile = function (model, murmur, domGenerated) {
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
	        } else {
	            dom.style.display = '';
	        }
	    };
	    return IfDirective;
	}(MurmurDirective);
	exports.IfDirective = IfDirective;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_type_1 = __webpack_require__(4);
	var Connect = function () {
	    function Connect(dom, type) {
	        this.dom = dom;
	        this.type = type;
	    }
	    Connect.prototype.isSimpleDom = function () {
	        return this.type == murmur_type_1.MurmurConnectTypes[0];
	    };
	    Connect.prototype.get = function () {
	        return this.dom;
	    };
	    return Connect;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Connect;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_type_1 = __webpack_require__(4);
	var MurmurField = function () {
	    function MurmurField(value, expression, type, unit) {
	        this.value = value;
	        this.expression = expression;
	        this.type = type;
	        this.unit = unit;
	    }
	    MurmurField.prototype.dispatchSync = function (murmur) {
	        switch (this.type) {
	            case murmur_type_1.MurmurFieldType.TEXT:
	                {
	                    this.doSyncText(murmur);
	                    break;
	                }
	            default:
	                {
	                    this.doSyncAttr(murmur);
	                }
	        }
	    };
	    MurmurField.prototype.doSyncText = function (murmur) {
	        this.unit.textContent = murmur.evalExpression(this.expression, this.unit, murmur_type_1.MurmurFieldType.TEXT);
	    };
	    MurmurField.prototype.doSyncAttr = function (murmur) {
	        this.unit.value = murmur.evalExpression(this.expression, this.unit, murmur_type_1.MurmurFieldType.ATTR);
	    };
	    return MurmurField;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MurmurField;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports.wxParser=__webpack_require__(9)['default']();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var wxParser_tool_1 = __webpack_require__(10);
	var wxParser_type_1 = __webpack_require__(11);
	function isText(obj) {
	    return obj.type == wxParser_type_1.TEXTNODE;
	}
	var WxDomParser = (function () {
	    function WxDomParser() {
	        this.nodeRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>/g;
	        this.attrRegex = /[\w\-]+=['"][\s\S]*?['"]/g;
	    }
	    WxDomParser.prototype.parseStart = function (htmlStr, optionRegex) {
	        if (optionRegex === void 0) { optionRegex = this.nodeRegex; }
	        var matchResult = this.findAllNodes(htmlStr, optionRegex);
	        return this.makeWxTree(matchResult);
	    };
	    WxDomParser.prototype.findAllNodes = function (htmlStr, optionRegex) {
	        if (optionRegex === void 0) { optionRegex = this.nodeRegex; }
	        var result;
	        var allMatches = [], nextIndex = 0;
	        while (result = optionRegex.exec(htmlStr)) {
	            var match = result[0], startTag = result[1], startTagName = result[2], attr = result[3], endSelf = result[4], endTagName = result[5], exp = result[6];
	            var index = result.index, length_1 = match.length;
	            if (index > nextIndex) {
	                allMatches.push({
	                    type: wxParser_type_1.TEXTNODE,
	                    value: htmlStr.slice(nextIndex, index)
	                });
	            }
	            if (exp) {
	                allMatches.push({
	                    type: wxParser_type_1.TEXTNODE,
	                    value: exp
	                });
	            }
	            nextIndex = index + length_1;
	            var type = void 0;
	            if (startTagName) {
	                type = wxParser_type_1.NODESTART;
	            }
	            else if (endTagName) {
	                type = wxParser_type_1.NODEEND;
	            }
	            else {
	                type = wxParser_type_1.NODECLOSESELF;
	            }
	            allMatches.push({
	                type: type, match: match, attr: attr, startTag: startTag, startTagName: startTagName, endSelf: endSelf, endTagName: endTagName, index: index, length: length_1
	            });
	        }
	        return allMatches;
	    };
	    WxDomParser.prototype.makeWxTree = function (results) {
	        var openTreeList = [{ nodeName: 'ROOT', attr: [], children: [] }];
	        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
	            var node = results_1[_i];
	            this.make(node, openTreeList);
	        }
	        return openTreeList[0];
	    };
	    WxDomParser.prototype.make = function (result, openTreeList) {
	        var tree = openTreeList[openTreeList.length - 1];
	        if (isText(result)) {
	            tree.children.push({ nodeName: wxParser_type_1.TEXTNODE, attr: [], children: [result.value] });
	        }
	        else {
	            if (result.endTagName) {
	                openTreeList.pop();
	            }
	            else {
	                var nodeName = result.startTagName;
	                if (result.endSelf) {
	                    tree.children.push({ nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] });
	                }
	                else if (nodeName) {
	                    var newOpenTree = { nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] };
	                    tree.children.push(newOpenTree);
	                    openTreeList.push(newOpenTree);
	                }
	            }
	        }
	    };
	    WxDomParser.prototype.getAttributes = function (attr) {
	        var slimAttr = wxParser_tool_1.removeMultiSpace(wxParser_tool_1.removeEqualSpace(attr));
	        var attrArray = [];
	        var attrExpression;
	        while (attrExpression = this.attrRegex.exec(attr)) {
	            var p = attrExpression[0].split('=');
	            attrArray.push({
	                name: p[0],
	                value: p[1].replace(/["']/g, '')
	            });
	        }
	        return attrArray;
	    };
	    return WxDomParser;
	}());
	var wxDomParserFactory = (function () {
	    var wxDomParser;
	    return function () {
	        return wxDomParser || (wxDomParser = new WxDomParser());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = wxDomParserFactory;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * 去除等号两侧的空格
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeEqualSpace(str) {
	    return str.replace(/\s*\=\s*/g, '=');
	}
	exports.removeEqualSpace = removeEqualSpace;
	/**
	 * 修正长度大于2的空格，修正为1
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	function removeMultiSpace(str) {
	    return str.replace(/\s{2,}/g, " ");
	}
	exports.removeMultiSpace = removeMultiSpace;
	/**
	 * 移除所有的空格
	 *
	 * @export
	 * @param {string} str
	 * @returns {string}
	 */
	function removeAllSpace(str) {
	    return str.replace(/\s*/g, '');
	}
	exports.removeAllSpace = removeAllSpace;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	exports.TEXTNODE = 'TEXTNODE';
	exports.NODESTART = 'NODESTART';
	exports.NODEEND = 'NODEEND';
	exports.NODECLOSESELF = 'NODECLOSESELF';


/***/ },
/* 12 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]

	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }

	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }

	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body

	    if (typeof input === 'string') {
	      this.url = input
	    } else {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split('\r\n').forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ }
/******/ ]);