import MurmurCreatorFactory from "./murmur.creator"
import MurmurField from "./murmur.field"
import { isNothing, removeAllSpace } from "./murmur.tool"
import {MurmurDirectiveItf,RepeatDirective} from "./murmur.directive"

export interface MurmurItf {
    nodeName: string,
    attr: { name, value }[]
    children: Array<Murmur | string>
}

function isMurmur(obj: Murmur | string): obj is Murmur {
    return obj instanceof Murmur
}
export default class Murmur implements MurmurItf {
    public nodeName: string
    public attr: { name, value }[]
    public children: Array<Murmur | string>
    public model: any
    public repeatMMDState: { inRepeat: boolean, repeatModel,repeatDirective:RepeatDirective } = { inRepeat: false, repeatModel: null,repeatDirective:null }
    public _connected: Node
    public _fileds: { [p: string]: MurmurField } = {}
    public $directives:MurmurDirectiveItf[]=[]
    constructor(tagName, attr, children) {
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
    }
    create(model = null): Node {
        this.model = model;
        return this._connected = MurmurCreatorFactory().create(this, model);
    }
    update(updateObj) {
        let newKeys = Object.keys(updateObj), oldKeys = Object.keys(this._fileds);
        for (let nk of newKeys) {
            if (oldKeys.indexOf(nk) !== -1) {
                let v = updateObj[nk], field = this._fileds[nk];
                if (field.attrCatcher) {
                    field.attrCatcher.value = v;
                } else {
                    this._connected.textContent = v;
                }
            }
        }
        for (let child of this.children) {
            if (isMurmur(child)) {
                child.update(updateObj)
            }
        }
    }
    extract(field) {
        let repeatModel = this.repeatMMDState.repeatModel;
        if (removeAllSpace(field).indexOf(':') === 0) {
            return repeatModel[field.slice(1)]
        } else {
            return this.model[field]
        }
    }
    static convert(obj) {
        if (obj.nodeName) {
            let {nodeName, attr, children} = obj;
            children = children.map(child => Murmur.convert(child));
            // attr = attr.map(a => {
            //     let attrNode = document.createAttribute(a.name);
            //     attrNode.value = a.value;
            //     return attrNode
            // });
            return new Murmur(nodeName, attr, children);
        } else {
            return obj
        }
    }
}
