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

let murmurRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})/g;

export default class Murmur implements MurmurItf {
    public nodeName: string
    public attr: { name, value }[]
    public children: Array<Murmur | string>
    public model: any
    public $repeatDirective: { $repeatEntrance: boolean, $repeatEntity: boolean, repeatModel, repeatDInstance: RepeatDirective } = { $repeatEntrance: true, $repeatEntity: false, repeatModel: null, repeatDInstance: null }
    public _connected: Connect
    public _fields: { [p: string]: MurmurField } = {}
    public _loc:string
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
    render(model){
        let root=this.create(model);
        let childNodes=root.childNodes;
        let loc=document.getElementById(this._loc);
        for(let i=0;i<childNodes.length;i++){
            loc.appendChild(childNodes[i])
        }
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
    static prepare(renderObj: renderItf) {
        let murmurTree:Murmur;
        if (renderObj.template) {
            murmurTree=Murmur.convert(wxParser.parseStart(renderObj.template,murmurRegex));
            murmurTree._loc=renderObj.loc;
            return murmurTree
        } else if (renderObj.templateUrl) {
            return fetch(renderObj.templateUrl).then(function (response) {
                return response.text()
            }).then(function (body) {
                murmurTree=Murmur.convert(wxParser.parseStart(body,murmurRegex));
                murmurTree._loc=renderObj.loc;
                return murmurTree
            }).then(murmurTree=>{
                renderObj.ok && renderObj.ok(murmurTree);
                return murmurTree
            })
        }
    }
}
