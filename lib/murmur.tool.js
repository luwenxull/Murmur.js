"use strict";
var murmur_tools_ajax_1 = require("./murmur.tools.ajax");
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
    if (sortField === void 0) { sortField = null; }
    if (arr.length <= 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0], pivotField = sortField ? pivot[sortField] : pivot;
    var left = [], right = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        var itemField = sortField ? item[sortField] : item;
        if (itemField < pivotField) {
            left.push(item);
        }
        else {
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
    return isNothing(val) ? (val = expected) : val;
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
    }
    else {
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
    }
    else {
        childNodesArr.push(node);
    }
    for (var _i = 0, childNodesArr_1 = childNodesArr; _i < childNodesArr_1.length; _i++) {
        var child = childNodesArr_1[_i];
        parent.appendChild(child);
    }
}
exports.appendChild = appendChild;
