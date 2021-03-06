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

	let Mpp = __webpack_require__(1).Mpp;
	let app = new Mpp();

	app.prepare({
	    name: 'author',
	    template: 'hello {author}'
	});

	let footer = app.prepare({
	    name: 'footer',
	    templateUrl: 'footer.html',
	    model: {
	        author: 'luwenxu'
	    }
	});

	let root = app.prepare({
	    name: 'root',
	    templateUrl: 'template.html',
	    model: {
	        src: 'http://ggoer.com/favicon.ico',
	        name: 'luwenxu',
	        cn1: 'red',
	        cn2: 'test',
	        position: 'fe',
	        location: "suzhou",
	        author: "somebody",
	        date: 'today',
	        comment: "test for comment",
	        click: function (murmur, e) {
	            murmur.update({
	                src: 'http://tva1.sinaimg.cn/crop.239.0.607.607.50/006l0mbojw1f7avkfj1oej30nk0xbqc6.jpg'
	            });
	        },
	        click2: function (murmur, e) {
	            e.stopPropagation();
	            murmur.update({
	                location: 'beijing',
	                cn1: 'green'
	            });
	        },
	        update(murmur, e) {
	            e.stopPropagation();
	            murmur.update({
	                cn1: 'blue',
	                people: [{
	                    age: 30,
	                    show: true
	                }, {
	                    age: 26,
	                    show: false
	                }, {
	                    age: 27,
	                    show: false
	                }]
	            });
	        },
	        mount: function (murmur) {
	            // console.log(murmur);
	        },
	        people: [{
	            age: 24,
	            show: true
	        }, {
	            age: 25
	        }]
	    }
	});

	root.then(function () {
	    console.log(root);
	});

	root.render('app', function () {
	    console.log('d');
	});
	// console.log(root);
	console.log(app);

	// let footer = Murmur.prepare({
	//     templateUrl: 'footer.html',
	//     model: {
	//         author: 'luwenxu'
	//     }
	// })

	// app.then(function (app) {
	//     app.holder('footer').replace(footer);
	// })

	// app.then(function (app) {
	//     app.render('app', function (app) {
	//         console.log(app);
	//     });
	// })

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	if (window) {
	    window.Mpp = __webpack_require__(2)['default'];
	}

	exports.Mpp = __webpack_require__(2)['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_core_1 = __webpack_require__(3);
	var murmur_promise_1 = __webpack_require__(11);
	var wx_parser_1 = __webpack_require__(12);
	var murmur_tool_1 = __webpack_require__(5);
	var App = function () {
	    function App(appManager) {
	        if (appManager === void 0) {
	            appManager = {};
	        }
	        this.appManager = appManager;
	    }
	    App.prototype.prepare = function (prepareObj) {
	        var _this = this;
	        var murmurPromise;
	        this.appManager[prepareObj.name] = murmurPromise = new murmur_promise_1.MurmurPromise(prepareObj.template || prepareObj.templateUrl);
	        if (prepareObj.template) {
	            this.doConvert(prepareObj.template, prepareObj, murmurPromise);
	        } else if (prepareObj.templateUrl) {
	            murmur_tool_1.ajax({
	                url: prepareObj.templateUrl,
	                success: function (responseText) {
	                    _this.doConvert(responseText, prepareObj, murmurPromise);
	                }
	            });
	        } else {
	            throw new Error('请传入正确的模板字符串或地址！');
	        }
	        return murmurPromise;
	    };
	    App.prototype.doConvert = function (template, prepareObj, murmurPromise) {
	        var needReplace = [];
	        var murmurTree = murmurPromise.murmur = murmur_core_1.default.convert(wx_parser_1.wxParser.parseStart(template), needReplace);
	        prepareObj.model && (murmurTree.model.state = prepareObj.model);
	        if (needReplace.length) {
	            for (var _i = 0, needReplace_1 = needReplace; _i < needReplace_1.length; _i++) {
	                var holderMurmur = needReplace_1[_i];
	                var substitution = this.getPromise(holderMurmur.placeholder);
	                murmurPromise.depends(substitution);
	                holderMurmur.replace(substitution);
	                murmurPromise.checkDependencies();
	            }
	        } else {
	            murmurPromise.resolve();
	        }
	        // murmurPromise.resolve(murmurTree);
	    };
	    App.prototype.getPromise = function (name) {
	        return this.appManager[name];
	    };
	    return App;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = App;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_creator_1 = __webpack_require__(4);
	var murmur_field_1 = __webpack_require__(10);
	var murmur_tool_1 = __webpack_require__(5);
	var murmurID = 1;
	function isMurmur(obj) {
	    return obj instanceof Murmur;
	}
	exports.isMurmur = isMurmur;
	var extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
	var Murmur = function () {
	    function Murmur(tagName, attr, children) {
	        this.model = { exotic: null, state: null };
	        this.$directives = [];
	        this.$repeatDirective = { $repeatEntrance: true, $repeatEntity: false, repeatDInstance: null };
	        this.$ifDirective = { shouldReturn: true, spaceHolder: null };
	        this._fields = {};
	        this.refPromise = null;
	        this.logicParents = {};
	        this.rendered = false;
	        this.nodeName = tagName;
	        this.attr = attr;
	        this.children = children;
	        this.murmurID = murmurID++;
	    }
	    Murmur.prototype.create = function (exotic) {
	        if (exotic === void 0) {
	            exotic = null;
	        }
	        this.model.exotic = exotic;
	        this._connected = murmur_creator_1.default().create(this);
	        if (this.$mountDirective) {
	            for (var _i = 0, _a = this.$mountDirective.callbacks; _i < _a.length; _i++) {
	                var callback = _a[_i];
	                callback.call(null, this);
	            }
	        }
	        return this._connected;
	    };
	    Murmur.prototype.render = function (loc, success) {
	        this.rendered = true;
	        this.create();
	        var childNodes = this.getNode().childNodes;
	        var root = document.getElementById(loc);
	        murmur_tool_1.appendChild(Array.prototype.slice.call(childNodes, 0), root);
	        if (success) {
	            success.call(null, this);
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
	        var model = this.combineModel(),
	            exotic = this.model.exotic;
	        if (murmur_tool_1.removeAllSpace(field).indexOf(':') === 0) {
	            return exotic[field.slice(1)];
	        } else {
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
	        var fn = function (murmur) {
	            return murmur.refClue === ref;
	        };
	        var refMurmur = this.iterateChildren(fn);
	        return refMurmur;
	    };
	    Murmur.prototype.holder = function (placeholder) {
	        var fn = function (murmur) {
	            return murmur.placeholder === placeholder;
	        };
	        var refMurmur = this.iterateChildren(fn);
	        return refMurmur;
	    };
	    Murmur.prototype.replace = function (murmurPromise) {
	        var _this = this;
	        // this.refPromise = murmurPromise
	        murmurPromise.then(function (murmur) {
	            _this.children = [murmur];
	            // this.model.state=Object.assign(this.model.state||{},murmur.model.state||{});
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
	        } else {
	            if (this.$ifDirective.shouldReturn) {
	                return this._connected.getDOM();
	            } else {
	                return this.$ifDirective.spaceHolder;
	            }
	        }
	    };
	    Murmur.prototype.lineTo = function (murmur, name) {
	        murmur.logicParents[name] = this;
	    };
	    Murmur.prototype.getLine = function (name) {
	        return this.logicParents[name];
	    };
	    Murmur.convert = function (obj, needReplace) {
	        if (obj.nodeName) {
	            var nodeName = obj.nodeName,
	                attr = obj.attr,
	                children = obj.children;
	            children = children.map(function (child) {
	                return Murmur.convert(child, needReplace);
	            });
	            var m = new Murmur(nodeName, attr, children);
	            for (var _i = 0, attr_1 = attr; _i < attr_1.length; _i++) {
	                var a = attr_1[_i];
	                if (a.name == 'mm-holder') {
	                    m.placeholder = a.value;
	                    needReplace.push(m);
	                }
	            }
	            return m;
	        }
	        return obj;
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
	        }
	        return murmur;
	    };
	    return Murmur;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Murmur;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_core_1 = __webpack_require__(3);
	var tools = __webpack_require__(5);
	var murmur_type_1 = __webpack_require__(7);
	var MurmurDirectives = __webpack_require__(8);
	var murmur_connect_1 = __webpack_require__(9);
	var MurmurCreator = function () {
	    function MurmurCreator() {
	        this.extractValueRegexr = /\{:{0,1}\w+\}/g;
	    }
	    MurmurCreator.prototype.create = function (murmur) {
	        var connect;
	        if (murmur.nodeName === murmur_type_1.MurmurNodeType.TEXTNODE) {
	            connect = new murmur_connect_1.default(this.createTextNode(murmur), murmur_type_1.MurmurConnectTypes[0]);
	        } else if (murmur.nodeName === murmur_type_1.MurmurNodeType.COMMENTNODE) {
	            connect = new murmur_connect_1.default(this.createComment(murmur), murmur_type_1.MurmurConnectTypes[0]);
	        } else {
	            var dom = document.createElement(murmur.nodeName);
	            if (murmur.nodeName === 'ROOT') {
	                dom = document.createDocumentFragment();
	            }
	            var compiledDom = this.checkMMDirective(murmur, dom);
	            if (compiledDom) {
	                connect = new murmur_connect_1.default(compiledDom, murmur_type_1.MurmurConnectTypes[1]);
	            } else {
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
	            var name_1 = attr.name,
	                value = attr.value;
	            if (name_1 == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
	                return this.compileRepeat(murmur, domGenerated, name_1, value);
	            }
	        }
	        var _loop_1 = function (attr1) {
	            var name_2 = attr1.name,
	                value = attr1.value;
	            if (name_2 !== "mm-repeat" && murmur_type_1.MurmurDirectiveTypes[name_2]) {
	                this_1.compileNormal(murmur, domGenerated, name_2, value);
	            }
	            if (name_2 in murmur_type_1.MurmurEventTypes) {
	                var eventName = name_2.split('-')[1],
	                    callback_1 = murmur.extract(value);
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
	    };
	    MurmurCreator.prototype.createTextNode = function (murmur) {
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
	    MurmurCreator.prototype.createComment = function (murmur) {
	        var str = '';
	        for (var _i = 0, _a = murmur.children; _i < _a.length; _i++) {
	            var child = _a[_i];
	            if (murmur_core_1.isMurmur(child)) {
	                child.create(murmur.combineModel());
	                str += child.getNode().outerHTML;
	            } else {
	                str += child;
	            }
	        }
	        return document.createComment(str);
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_tools_ajax_1 = __webpack_require__(6);
	exports.ajax = murmur_tools_ajax_1.ajax;
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
	function isNode(obj) {
	    return obj instanceof Node;
	}
	function appendChild(node, parent) {
	    var childNodesArr = [];
	    if (node instanceof Array) {
	        childNodesArr = Array.prototype.slice.call(node, 0);
	    } else {
	        childNodesArr.push(node);
	    }
	    for (var _i = 0, childNodesArr_1 = childNodesArr; _i < childNodesArr_1.length; _i++) {
	        var child = childNodesArr_1[_i];
	        parent.appendChild(child);
	    }
	}
	exports.appendChild = appendChild;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	function formatParams(data) {
	    var arr = [];
	    for (var name in data) {
	        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	    }
	    arr.push(("v=" + Math.random()).replace(".", ""));
	    return arr.join("&");
	}
	function ajax(options) {
	    options.type = (options.type || "GET").toUpperCase();
	    options.dataType = options.dataType || "json";
	    var params = formatParams(options.data);
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            var status = xhr.status;
	            if (status >= 200 && status < 300) {
	                var random = Math.random() * 5000;
	                options.success && options.success(xhr.responseText, xhr.responseXML);
	            } else {
	                options.fail && options.fail(status);
	            }
	        }
	    };
	    if (options.type == "POST") {
	        xhr.open("POST", options.url, true);
	        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	        xhr.send(params);
	    } else if (options.type == "GET") {
	        xhr.open("GET", options.url + "?" + params, true);
	        xhr.send(null);
	    }
	}
	exports.ajax = ajax;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	exports.MurmurNodeType = {
	    TEXTNODE: 'TEXTNODE',
	    COMMENTNODE: 'COMMENTNODE'
	};
	var MurmurFieldType;
	(function (MurmurFieldType) {
	    MurmurFieldType[MurmurFieldType["ATTR"] = 0] = "ATTR";
	    MurmurFieldType[MurmurFieldType["TEXT"] = 1] = "TEXT";
	})(MurmurFieldType = exports.MurmurFieldType || (exports.MurmurFieldType = {}));
	exports.MurmurDirectiveTypes = {
	    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
	    "mm-if": { name: "mm-if", directive: "IfDirective" },
	    "mm-ref": { name: 'mm-ref', directive: 'RefDirective' },
	    "mm-mount": { name: 'mm-mount', directive: 'MountDirective' },
	    "mm-show": { name: "mm-show", directive: 'ShowDirective' }
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
	var MurmurPromiseType;
	(function (MurmurPromiseType) {
	    MurmurPromiseType[MurmurPromiseType["PENDING"] = 0] = "PENDING";
	    MurmurPromiseType[MurmurPromiseType["RESOLVED"] = 1] = "RESOLVED";
	    MurmurPromiseType[MurmurPromiseType["REJECTED"] = 2] = "REJECTED";
	})(MurmurPromiseType = exports.MurmurPromiseType || (exports.MurmurPromiseType = {}));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var __extends = this && this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var murmur_core_1 = __webpack_require__(3);
	var murmur_tool_1 = __webpack_require__(5);
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
	            var repeatSourceLength = repeatSource.length,
	                mmListLength = this.murmurList.length;
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
	        var repeatSourceLength = repeatSource.length,
	            mmListLength = this.murmurList.length;
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
	            var clone = murmur_core_1.default.clone(murmur),
	                newDom = void 0,
	                lastDom = void 0;
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
	}(MurmurDirective);
	exports.RepeatDirective = RepeatDirective;
	var IfDirective = function (_super) {
	    __extends(IfDirective, _super);
	    function IfDirective() {
	        return _super.apply(this, arguments) || this;
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
	}(MurmurDirective);
	exports.IfDirective = IfDirective;
	var ShowDirective = function (_super) {
	    __extends(ShowDirective, _super);
	    function ShowDirective() {
	        return _super.apply(this, arguments) || this;
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
	        } else {
	            dom.style.display = '';
	        }
	    };
	    return ShowDirective;
	}(MurmurDirective);
	exports.ShowDirective = ShowDirective;
	var RefDirective = function (_super) {
	    __extends(RefDirective, _super);
	    function RefDirective() {
	        return _super.apply(this, arguments) || this;
	    }
	    RefDirective.prototype.compile = function (murmur, domGenerated) {
	        murmur.refClue = this.directiveExpression;
	        return domGenerated;
	    };
	    RefDirective.prototype.update = function () {};
	    return RefDirective;
	}(MurmurDirective);
	exports.RefDirective = RefDirective;
	var MountDirective = function (_super) {
	    __extends(MountDirective, _super);
	    function MountDirective() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.callbacks = [];
	        return _this;
	    }
	    MountDirective.prototype.compile = function (murmur, domGenerated) {
	        var mountCallback = murmur.extract(this.directiveExpression);
	        mountCallback && this.callbacks.push(mountCallback);
	        murmur.$mountDirective = this;
	        return domGenerated;
	    };
	    MountDirective.prototype.update = function () {};
	    return MountDirective;
	}(MurmurDirective);
	exports.MountDirective = MountDirective;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_type_1 = __webpack_require__(7);
	var Connect = function () {
	    function Connect(dom, type) {
	        this.dom = dom;
	        this.type = type;
	    }
	    Connect.prototype.isSimpleDom = function () {
	        return this.type == murmur_type_1.MurmurConnectTypes[0];
	    };
	    Connect.prototype.getDOM = function () {
	        return this.dom;
	    };
	    return Connect;
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Connect;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_type_1 = __webpack_require__(7);
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var murmur_type_1 = __webpack_require__(7);
	var MurmurPromise = function () {
	    function MurmurPromise(name) {
	        this.name = name;
	        this.success = [];
	        this.one = [];
	        this.status = murmur_type_1.MurmurPromiseType.PENDING;
	        this.resolveNotify = false;
	        this.dependencies = [];
	        this.dependsBy = [];
	    }
	    MurmurPromise.prototype.then = function (fn) {
	        this.success.push(fn);
	        if (this.status === murmur_type_1.MurmurPromiseType.RESOLVED) {
	            fn.call(this, this.murmur);
	        }
	        ;
	        return this;
	    };
	    MurmurPromise.prototype.resolve = function () {
	        this.status = murmur_type_1.MurmurPromiseType.RESOLVED;
	        for (var _i = 0, _a = this.success; _i < _a.length; _i++) {
	            var success = _a[_i];
	            success(this.murmur);
	        }
	        for (var _b = 0, _c = this.one; _b < _c.length; _b++) {
	            var o = _c[_b];
	            o(this.murmur);
	        }
	        this.one = []; //注册的回调函数只会执行一次
	        for (var _d = 0, _e = this.dependsBy; _d < _e.length; _d++) {
	            var db = _e[_d];
	            db.checkDependencies();
	        }
	    };
	    MurmurPromise.prototype.depends = function (dep) {
	        this.dependencies.push(dep);
	        dep.dependsBy.push(this);
	    };
	    MurmurPromise.prototype.checkDependencies = function () {
	        var dependenciesResolved = true;
	        for (var _i = 0, _a = this.dependencies; _i < _a.length; _i++) {
	            var dependency = _a[_i];
	            if (dependency.status === murmur_type_1.MurmurPromiseType.PENDING) {
	                dependenciesResolved = false;
	            }
	        }
	        if (dependenciesResolved) {
	            this.resolve();
	        }
	    };
	    MurmurPromise.prototype.once = function (fn) {
	        if (this.status === murmur_type_1.MurmurPromiseType.RESOLVED) {
	            fn.call(this, this.murmur);
	        } else {
	            this.one.push(fn);
	        }
	        return this;
	    };
	    MurmurPromise.prototype.render = function (loc, success) {
	        var _this = this;
	        this.once(function () {
	            _this.murmur.render(loc, success);
	        });
	    };
	    return MurmurPromise;
	}();
	exports.MurmurPromise = MurmurPromise;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	exports.wxParser=__webpack_require__(13)['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var wxParser_tool_1 = __webpack_require__(14);
	var wxParser_type_1 = __webpack_require__(15);
	function isText(obj) {
	    return obj && obj.type == wxParser_type_1.TEXTNODE;
	}
	var WxDomParser = (function () {
	    function WxDomParser() {
	        this.nodeRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})|(<!--)|(-->)/g;
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
	            var match = result[0], startTag = result[1], startTagName = result[2], attr = result[3], endSelf = result[4], endTagName = result[5], exp = result[6], startComment = result[7], endComment = result[8];
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
	            else if (startComment) {
	                type = wxParser_type_1.COMMENTSTART;
	            }
	            else if (endComment) {
	                type = wxParser_type_1.COMMENTEND;
	            }
	            else {
	                type = wxParser_type_1.NODECLOSESELF;
	            }
	            allMatches.push({
	                type: type, match: match, attr: attr, startTag: startTag, startTagName: startTagName, endSelf: endSelf, endTagName: endTagName, startComment: startComment, endComment: endComment, index: index, length: length_1
	            });
	        }
	        return allMatches;
	    };
	    WxDomParser.prototype.makeWxTree = function (results) {
	        var openTreeList = [{ nodeName: 'ROOT', attr: [], children: [] }];
	        for (var i = 0; i < results.length; i++) {
	            this.make(results[i], results[i - 1], results[i + 1], openTreeList);
	        }
	        return openTreeList[0];
	    };
	    WxDomParser.prototype.make = function (result, last, next, openTreeList) {
	        var tree = openTreeList[openTreeList.length - 1];
	        if (isText(result)) {
	            if (!isText(last) && !isText(next)) {
	                if (wxParser_tool_1.removeAllSpace(result.value) !== '') {
	                    tree.children.push({ nodeName: wxParser_type_1.TEXTNODE, attr: [], children: [result.value] });
	                }
	            }
	            else {
	                tree.children.push({ nodeName: wxParser_type_1.TEXTNODE, attr: [], children: [result.value] });
	            }
	        }
	        else {
	            if (result.endTagName || result.endComment) {
	                openTreeList.pop();
	            }
	            else {
	                var nodeName = result.startTagName, startComment = result.startComment;
	                if (result.endSelf) {
	                    tree.children.push({ nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] });
	                }
	                else {
	                    if (nodeName) {
	                        var newOpenTree = { nodeName: nodeName, attr: this.getAttributes(result.attr), children: [] };
	                        tree.children.push(newOpenTree);
	                        openTreeList.push(newOpenTree);
	                    }
	                    if (startComment) {
	                        var newOpenTree = { nodeName: wxParser_type_1.COMMENTNODE, attr: [], children: [] };
	                        tree.children.push(newOpenTree);
	                        openTreeList.push(newOpenTree);
	                    }
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = new WxDomParser();


/***/ },
/* 14 */
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
/* 15 */
/***/ function(module, exports) {

	"use strict";
	exports.TEXTNODE = 'TEXTNODE';
	exports.COMMENTNODE = 'COMMENTNODE';
	exports.NODESTART = 'NODESTART';
	exports.NODEEND = 'NODEEND';
	exports.NODECLOSESELF = 'NODECLOSESELF';
	exports.COMMENTSTART = 'COMMENTSTART';
	exports.COMMENTEND = 'COMMENTEND';


/***/ }
/******/ ]);