/**
 * 判断是否是简单值
 * 
 * @param {any} val
 * @returns
 */
export function isSimpleValue(val) {
    let type = typeof val;
    return type === 'string' || type === 'number' || false
}


/**
 * 去除取值表达式两侧大括号
 * 
 * @param {string} str
 * @returns {string}
 */
export function removeBraceOfValue(str: string): string {
    return str.slice(1, str.length - 1)
}


/**
 * 快速排序
 * 
 * @param {Array} arr
 * @param {String} arr
 * @returns
 */
export function quickSort(arr,sortField=null) {
    if (arr.length <= 1) { return arr; }
    let pivotIndex = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIndex, 1)[0],pivotField=sortField?pivot[sortField]:pivot;
    let left = [],right = [];
    for(let item of arr){
        let itemField=sortField?item[sortField]:item;
        if (itemField < pivotField) {
            left.push(item);
        } else {
            right.push(item);
        }
    }
    return quickSort(left,sortField).concat([pivot], quickSort(right,sortField));
};

/**
 * 判断是否是null或者undefined
 * 
 * @param {any} val
 * @returns
 */
export function isNothing(val){
    return val===null || val===undefined
}

/**
 * 设置默认值并返回
 * 
 * @param {any} val
 * @param {any} expected
 * @returns
 */
export function setDefault(val,expected){
    return isNothing(val)?(val=expected):val   
}

/**
 * 去除等号两侧的空格
 * 
 * @param {string} str
 * @returns {string}
 */
export function removeEqualSpace(str:string):string{
    return str.replace(/\s*\=\s*/g,'=')
}

/**
 * 修正空格个数。
 * 将多个相连的空格缩减为一个空格
 * 
 * @param {string} str
 * @returns {string}
 */
export function removeMultiSpace(str:string):string{
    return str.replace(/\s{2,}/g," ")
}

/**
 * 移除所有的空格
 * 
 * @export
 * @param {string} str
 * @returns {string}
 */
export function removeAllSpace(str:string):string{
    return str.replace(/\s*/g,'')
}

/**
 * 在当前节点的后面添加兄弟节点
 * 
 * @export
 * @param {Node} node 当前节点
 * @param {Node} refrenceNode 待添加节点
 */
export function addSibling(node:Node,refrenceNode:Node):void{
    let parentNode=node.parentNode;
    let nextSibling=node.nextSibling;
    if(nextSibling){
        parentNode.insertBefore(refrenceNode,nextSibling)
    }else{
        parentNode.appendChild(refrenceNode)
    }
}