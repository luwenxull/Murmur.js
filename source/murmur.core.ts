import MurmurCreatorFactory from "./murmur.creator"
import MurmurField from "./murmur.field"
import { isNothing, removeAllSpace } from "./murmur.tool"
import { MurmurDirectiveItf, RepeatDirective } from "./murmur.directive"
import Connect from "./murmur.connect"
import { wxParser } from "wx-parser"

import "whatwg-fetch"

export interface MurmurItf {
    nodeName: string,
    attr: { name, value }[]
    children: Array<Murmur | string>
}

interface renderItf {
    model
    template: string
    templateUrl?: string
    loc:string
    ok?:(tree:Murmur)=>void
}
let murmurID = 1;

function isMurmur(obj: Murmur | string): obj is Murmur {
    return obj instanceof Murmur
}
export default class Murmur implements MurmurItf {
    public nodeName: string
    public attr: { name, value }[]
    public children: Array<Murmur | string>
    public model: any
    public $repeatDirective: { $repeatEntrance: boolean, $repeatEntity: boolean, repeatModel, repeatDInstance: RepeatDirective } = { $repeatEntrance: true, $repeatEntity: false, repeatModel: null, repeatDInstance: null }
    public _connected: Connect
    public _fields: { [p: string]: MurmurField } = {}
    public $directives: MurmurDirectiveItf[] = []
    public murmurID: number
    constructor(tagName, attr, children) {
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
        this.murmurID = murmurID++;
    }
    create(model = null): Node {
        this.model = model;
        this._connected = MurmurCreatorFactory().create(this, model);
        return this._connected.dom
    }
    dispatchUpdate(updateObj) {
        if (this._connected.isSimpleDom()) {
            this.doUpdate(updateObj)
            for (let child of this.children) {
                if (isMurmur(child)) {
                    child.dispatchUpdate(updateObj)
                }
            }
        } else {
            this.$repeatDirective.repeatDInstance.update(this, updateObj)
        }
    }
    doUpdate(updateObj) {
        let fieldKeys = Object.keys(this._fields);
        for (let field of fieldKeys) {
            let newVal = this.extract(field);
            if (this._fields[field].attrCatcher) {
                this._fields[field].attrCatcher.value = newVal;
            } else {
                this._connected.get().textContent = newVal;
            }
        }
    }
    update(updateObj) {
        Object.assign(this.model, updateObj);
        this.dispatchUpdate(updateObj);
    }
    extract(field) {
        let repeatModel = this.$repeatDirective.repeatModel;
        if (removeAllSpace(field).indexOf(':') === 0) {
            return repeatModel[field.slice(1)]
        } else {
            return this.model[field]
        }
    }
    replaceRepeatModelOfChild(newModel) {
        for (let child of this.children) {
            if (isMurmur(child)) {
                child.$repeatDirective.repeatModel = newModel;
                child.replaceRepeatModelOfChild(newModel);
            }
        }
    }
    static convert(obj): Murmur {
        if (obj.nodeName) {
            let {nodeName, attr, children} = obj;
            children = children.map(child => Murmur.convert(child));
            return new Murmur(nodeName, attr, children);
        } else {
            return obj
        }
    }
    static clone<T extends MurmurItf>(murmur: T) {
        if (murmur.nodeName) {
            let {nodeName, attr, children} = murmur;
            children = children.map(child => Murmur.clone(<Murmur>child));
            return new Murmur(nodeName, attr, children);
        } else {
            return murmur
        }
    }
    static render(renderObj: renderItf) {
        let finalTemplate;
        if (renderObj.template) {
            finalTemplate=renderObj.template;
            Murmur.append(finalTemplate,renderObj)
        } else if (renderObj.templateUrl) {
            fetch(renderObj.templateUrl).then(function (response) {
                return response.text()
            }).then(function (body) {
                finalTemplate=body;
                Murmur.append(finalTemplate,renderObj)
            })
        }
    }
    static append(template,renderObj:renderItf){
        let murmurRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})/g;
        let murmurTree=Murmur.convert(wxParser.parseStart(template,murmurRegex));
        let domRoot=murmurTree.create(renderObj.model);
        let doc=document.getElementById(renderObj.loc);
        doc.appendChild(domRoot.childNodes[0]);
        renderObj.ok && renderObj.ok(murmurTree);
    }
}
