import Murmur from "./murmur.core"
import MurmurField from "./murmur.field"
import * as tools from "./murmur.tool"
import { MurmurFieldType, MurmurRegexType, MurmurDirectiveTypes, MurmurConnectTypes, MurmurEventTypes } from "./murmur.type"
import * as MurmurDirectives from "./murmur.directive"
import Connect from "./murmur.connect"

class MurmurCreator {
    private extractValueRegexr: RegExp = /\{:{0,1}\w+\}/g
    create(murmur: Murmur, model): Connect {
        let connect;
        if (murmur.nodeName === MurmurRegexType.TEXTNODE) {
            connect = new Connect(this.createTextNode(murmur, model), MurmurConnectTypes[0])
        } else {
            let dom: Node | HTMLElement = document.createElement(murmur.nodeName);
            let compiledDom = this.checkMMDirective(model, murmur, dom);
            if (compiledDom) {
                connect = new Connect(compiledDom, MurmurConnectTypes[1])
            } else {
                this.attachAttr(<HTMLElement>dom, model, murmur);
                this.appendChildren(<HTMLElement>dom, model, murmur);
                connect = new Connect(dom, MurmurConnectTypes[0])
            }
        }
        return connect;
    }
    checkMMDirective(model, murmur: Murmur, domGenerated: Node): Node {
        let fragment: Node = document.createDocumentFragment();
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
                let directive = new MurmurDirectives[MurmurDirectiveTypes[name].directive](value);
                murmur.$directives.push(directive);
                murmur.$repeatDirective.repeatDInstance = directive;
                return directive.compile(model, murmur, domGenerated)
            }
        }
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name !== "mm-repeat" && MurmurDirectiveTypes[name]) {
                let directive: MurmurDirectives.MurmurDirectiveItf = new MurmurDirectives[MurmurDirectiveTypes[name].directive](value);
                murmur.$directives.push(directive);
                directive.compile(model, murmur, domGenerated)
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
    attachAttr(dom: HTMLElement, model, murmur: Murmur): void {
        for (let a of murmur.attr) {
            let htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = murmur.evalExpression(a.value, htmlAttr, MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    }
    appendChildren(parent: HTMLElement, model, murmur: Murmur): void {
        for (let child of murmur.children) {
            child = <Murmur>child;
            child.$repeatDirective.repeatModel = murmur.$repeatDirective.repeatModel
            parent.appendChild(child.create(model))
        }
    }
    createTextNode(murmur: Murmur, model) {
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
}


let MurmurCreatorFactory: () => MurmurCreator = (function () {
    let creatorInstance;
    return function () {
        return creatorInstance || (creatorInstance = new MurmurCreator())
    }
})()

export default MurmurCreatorFactory