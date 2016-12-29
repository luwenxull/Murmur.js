import MurmurCreatorFactory from "./murmur.creator"
import MurmurField from "./murmur.field"
import { isNothing, removeAllSpace } from "./murmur.tool"
import { MurmurDirectiveItf, RepeatDirective } from "./murmur.directive"
import Connect from "./murmur.connect"

export interface MurmurItf {
    nodeName: string,
    attr: { name, value }[]
    children: Array<Murmur | string>
}
let murmurID=1;

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
    public _fileds: { [p: string]: MurmurField } = {}
    public $directives: MurmurDirectiveItf[] = []
    public murmurID:number
    constructor(tagName, attr, children) {
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
        this.murmurID=murmurID++;
    }
    create(model = null): Node {
        this.model = model;
        this._connected = MurmurCreatorFactory().create(this, model);
        return this._connected.dom
    }
    dispatchUpdate(updateObj) {
        if (this._connected.isSimpleDom()) {
            this.directlyUpdate(updateObj)
            for (let child of this.children) {
                if (isMurmur(child)) {
                    child.dispatchUpdate(updateObj)
                }
            }
        } else {
            this.$repeatDirective.repeatDInstance.update(this)
        }
    }
    directlyUpdate(updateObj){
        let newKeys = Object.keys(updateObj), oldKeys = Object.keys(this._fileds);
        for (let nk of newKeys) {
            if (oldKeys.indexOf(nk) !== -1) {
                let v = updateObj[nk], field = this._fileds[nk];
                if (field.attrCatcher) {
                    field.attrCatcher.value = v;
                } else {
                    this._connected.get().textContent = v;
                }
            }
        }
    }
    extract(field) {
        let repeatModel = this.$repeatDirective.repeatModel;
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
}
