import Murmur from "./murmur.core"
import MurmurField from "./murmur.field"
import * as tools from "./murmur.tool"
import { MurmurFieldType, MurmurRegexType, MurmurDirectiveTypes } from "./murmur.type"
import * as MurmurDirectives from "./murmur.directive"

class MurmurCreator {
    private extractValueRegexr: RegExp = /\{\w+\}/g
    create(murmur: Murmur, model): Node {
        if (murmur.nodeName === MurmurRegexType.TEXTNODE) {
            return this.createTextNode(murmur, model)
        } else {
            let dom = document.createElement(murmur.nodeName);
            this.attachAttr(dom, model, murmur);
            this.appendChildren(dom, model, murmur);
            return dom;
        }
    }
    attachAttr(dom: HTMLElement, model, murmur: Murmur): void {
        for (let a of murmur.attr) {
            this.checkMMDirective(a, model, murmur);
            let htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = this.extractFromModel(a.value, model, murmur, htmlAttr, MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    }
    checkMMDirective(attr: { name, value }, model, murmur) {
        let name = attr.name, value = attr.value;
        if (MurmurDirectiveTypes.indexOf(name) !== -1) {
            let directive = new MurmurDirectives.RepeatDirective(value);
            directive.compile(model, murmur);
        }
    }
    appendChildren(parent: HTMLElement, model, murmur: Murmur): void {
        for (let child of murmur.children) {
            parent.appendChild((<Murmur>child).create(model))
        }
    }
    createTextNode(murmur: Murmur, model) {
        let onlyChild = murmur.children[0];
        let textNode;
        try {
            if (tools.isSimpleValue(onlyChild)) {
                textNode = document.createTextNode(this.extractFromModel(<string>onlyChild, model, murmur))
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
    extractFromModel(val: string, model, murmur: Murmur, attr = null, fieldType: string = MurmurFieldType.TEXT): string {
        let newString = val;
        if (!tools.isNothing(val)) {
            let matches = val.match(this.extractValueRegexr);
            if (matches) {
                for (let m of matches) {
                    let key = tools.removeBraceOfValue(m), value = model[key];
                    murmur._fileds[key] = new MurmurField(value, fieldType, attr)
                    newString = val.replace(m, value);
                }
            }
        }
        return newString
    }
}


let MurmurCreatorFactory: () => MurmurCreator = (function () {
    let creatorInstance;
    return function () {
        return creatorInstance || (creatorInstance = new MurmurCreator())
    }
})()

export default MurmurCreatorFactory