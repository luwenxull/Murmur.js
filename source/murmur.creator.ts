import Murmur from "./murmur.core"
import MurmurField from "./murmur.field"
import * as tools from "./murmur.tool"
import { MurmurFieldType, MurmurRegexType, MurmurDirectiveTypes, MurmurDirectiveTypesMap } from "./murmur.type"
import * as MurmurDirectives from "./murmur.directive"

class MurmurCreator {
    private extractValueRegexr: RegExp = /\{:{0,1}\w+\}/g
    create(murmur: Murmur, model): Node {
        if (murmur.nodeName === MurmurRegexType.TEXTNODE) {
            return this.createTextNode(murmur, model)
        } else {
            let dom = document.createElement(murmur.nodeName);
            this.checkMMDirective(model, murmur, dom);

            this.attachAttr(dom, model, murmur);
            this.appendChildren(dom, model, murmur);
            return dom;
        }
    }
    checkMMDirective(model, murmur: Murmur, domGenerated: Node): void {
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name == 'mm-repeat' && !murmur.controlRepeatMMDState.inRepeat) {
                let directive: MurmurDirectives.MurmurDirectiveItf = new MurmurDirectives[MurmurDirectiveTypesMap[name].directive](value);
                directive.compile(model, murmur, domGenerated)
                return 
            }
        }
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name !== "mm-repeat" && MurmurDirectiveTypesMap[name]) {
                let directive: MurmurDirectives.MurmurDirectiveItf = new MurmurDirectives[MurmurDirectiveTypesMap[name].directive](value);
                directive.compile(model, murmur, domGenerated)
            }
        }
        // return needCompile ? fragment : domGenerated
    }
    attachAttr(dom: HTMLElement, model, murmur: Murmur): void {
        for (let a of murmur.attr) {
            let htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = this.extractFromModel(a.value, model, murmur, htmlAttr, MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    }
    appendChildren(parent: HTMLElement, model, murmur: Murmur): void {
        for (let child of murmur.children) {
            child=<Murmur>child;
            if(murmur.controlRepeatMMDState.inRepeat){
                child.controlRepeatMMDState.inRepeat=true;
                child.controlRepeatMMDState.repeatModel=murmur.controlRepeatMMDState.repeatModel
            }
            parent.appendChild(child.create(model))
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
                    let key = tools.removeBraceOfValue(m);
                    let value = murmur.extract(key);
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