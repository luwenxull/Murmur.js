import Murmur,{isMurmur} from "./murmur.core"
import MurmurField from "./murmur.field"
import * as tools from "./murmur.tool"
import { MurmurFieldType, MurmurNodeType, MurmurDirectiveTypes, MurmurConnectTypes, MurmurEventTypes } from "./murmur.type"
import * as MurmurDirectives from "./murmur.directive"
import Connect from "./murmur.connect"

class MurmurCreator {
    private extractValueRegexr: RegExp = /\{:{0,1}\w+\}/g
    create(murmur: Murmur): Connect {
        let connect;
        if (murmur.nodeName === MurmurNodeType.TEXTNODE) {
            connect = new Connect(this.createTextNode(murmur), MurmurConnectTypes[0])
        } else if (murmur.nodeName === MurmurNodeType.COMMENTNODE) {
            connect = new Connect(this.createComment(murmur), MurmurConnectTypes[0])
        } else {
            let dom: Node | HTMLElement = document.createElement(murmur.nodeName);
            if (murmur.nodeName === 'ROOT') {
                dom = document.createDocumentFragment();
            }
            let compiledDom = this.checkMMDirective(murmur, dom);
            if (compiledDom) {
                connect = new Connect(compiledDom, MurmurConnectTypes[1])
            } else {
                this.attachAttr(<HTMLElement>dom, murmur);
                this.appendChildren(<HTMLElement>dom, murmur);
                connect = new Connect(dom, MurmurConnectTypes[0])
            }
        }
        return connect;
    }
    checkMMDirective(murmur: Murmur, domGenerated: Node): Node {
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
                return this.compileRepeat(murmur, domGenerated, name, value)
            }
        }
        for (let attr1 of murmur.attr) {
            let {name, value} = attr1;
            if (name !== "mm-repeat" && MurmurDirectiveTypes[name]) {
                this.compileNormal(murmur, domGenerated, name, value)
            }
            if (name in MurmurEventTypes) {
                let eventName = name.split('-')[1],
                    callback = murmur.extract(value);
                domGenerated.addEventListener(eventName, (e) => {
                    callback(murmur, e)
                })
            }
        }
        return null
    }
    compileRepeat(murmur: Murmur, domGenerated: Node, name, value) {
        let directive: MurmurDirectives.RepeatDirective = new MurmurDirectives[MurmurDirectiveTypes[name].directive](value);
        murmur.$directives.push(directive);
        murmur.$repeatDirective.repeatDInstance = directive;
        return directive.compile(murmur, domGenerated)
    }
    compileNormal(murmur: Murmur, domGenerated: Node, name, value) {
        let directive: MurmurDirectives.MurmurDirectiveItf = new MurmurDirectives[MurmurDirectiveTypes[name].directive](value);
        murmur.$directives.push(directive);
        directive.compile(murmur, domGenerated)
    }
    attachAttr(dom: HTMLElement, murmur: Murmur): void {
        for (let a of murmur.attr) {
            let htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = murmur.evalExpression(a.value, htmlAttr, MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    }
    appendChildren(parent: HTMLElement, murmur: Murmur): void {
        for (let child of murmur.children) {
            child = <Murmur>child;
            child.create(murmur.combineModel())
            let childDOM = child.getNode();
            tools.appendChild(childDOM, parent);
        }
    }
    createTextNode(murmur: Murmur) {
        let onlyChild = murmur.children[0];
        let textNode;
        try {
            if (tools.isSimpleValue(onlyChild)) {
                textNode = document.createTextNode('');
                textNode.textContent = murmur.evalExpression(<string>onlyChild, textNode, MurmurFieldType.TEXT);
            } else {
                throw new TypeError()
            }
        } catch (err) {
            console.error(err)
            textNode = document.createTextNode('')
        } finally {
            return textNode
        }
    }
    createComment(murmur:Murmur): Comment {
        let str='';
        for(let child of murmur.children){
            if(isMurmur(child)){
                child.create(murmur.combineModel())
                str+=(<HTMLElement>child.getNode()).outerHTML
            }else{
                str+=child
            }
        }
        return document.createComment(str)
    }
}


let MurmurCreatorFactory: () => MurmurCreator = (function () {
    let creatorInstance;
    return function () {
        return creatorInstance || (creatorInstance = new MurmurCreator())
    }
})()

export default MurmurCreatorFactory