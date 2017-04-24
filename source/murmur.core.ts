import MurmurCreatorFactory from "./murmur.creator"
import MurmurField from "./murmur.field"
import { isNothing, removeAllSpace, removeBraceOfValue, removeFirstColon, ajax, appendChild } from "./murmur.tool"
import { MurmurDirectiveItf, RepeatDirective, MountDirective } from "./murmur.directive"
import Connect from "./murmur.connect"
import { wxParser } from "wx-parser"
import { MurmurPromise } from "./murmur.promise"
import { MurmurPromiseType } from "./murmur.type"

export interface MurmurItf {
    nodeName: string,
    attr: { name: string, value: string }[]
    children: Array<Murmur | string>
}

let murmurID = 1;

export function isMurmur(obj: Murmur | string): obj is Murmur {
    return obj instanceof Murmur
}

let extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
export default class Murmur implements MurmurItf {
    public nodeName: string;
    public attr: { name: string, value: string }[];
    public children: Array<Murmur | string>;
    public model: { exotic, state } = { exotic: null, state: null };
    public $directives: MurmurDirectiveItf[] = [];
    public $repeatDirective: { $repeatEntrance: boolean, $repeatEntity: boolean, repeatDInstance: RepeatDirective } = { $repeatEntrance: true, $repeatEntity: false, repeatDInstance: null };
    public $ifDirective: { shouldReturn: boolean, spaceHolder: Text } = { shouldReturn: true, spaceHolder: null };
    public $mountDirective: MountDirective;
    public _connected: Connect;
    public _fields: { [p: string]: MurmurField } = {};
    public _loc: string;
    public refClue: string;
    public placeholder: string;
    public refPromise: MurmurPromise = null;
    public logicParents:{}={};
    private murmurID: number;
    private rendered:boolean=false;
    constructor(tagName, attr, children) {
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
        this.murmurID = murmurID++;
    }
    create(exotic = null): Connect {
        this.model.exotic = exotic;
        this._connected = MurmurCreatorFactory().create(this);
        if (this.$mountDirective) {
            for (let callback of this.$mountDirective.callbacks) {
                callback.call(null, this)
            }
        }
        return this._connected
    }
    render(loc: string, success?: (murmur: Murmur) => void) {
        this.rendered=true;
        this.create();
        let childNodes = (<Node>this.getNode()).childNodes;
        let root = document.getElementById(loc);
        appendChild(Array.prototype.slice.call(childNodes, 0), root);
        if (success) {
            success.call(null, this)
        }
    }
    update(updateObj) {
        this.model.state = this.model.state || {};
        Object.assign(this.model.state, updateObj);
        this.dispatchUpdate(updateObj, Object.keys(updateObj));
    }
    dispatchUpdate(updateObj, keysNeedToBeUpdate) {
        if (this._connected.isSimpleDom()) {
            for (let $d of this.$directives) {
                $d.update(this, updateObj)
            }
            this.doUpdate(updateObj, keysNeedToBeUpdate);
            for (let child of this.children) {
                if (isMurmur(child)) {
                    child.model.exotic = this.combineModel()
                    child.dispatchUpdate(updateObj, keysNeedToBeUpdate)
                }
            }
        } else {
            this.$repeatDirective.repeatDInstance.update(this, updateObj)
        }
    }
    doUpdate(updateObj, keysNeedToBeUpdate) {
        let fieldKeys = Object.keys(this._fields);
        for (let field of fieldKeys) {
            if (keysNeedToBeUpdate.indexOf(removeFirstColon(field)) !== -1) {
                this._fields[field].dispatchSync(this);
            }
        }
    }
    evalExpression(val: string, unit, fieldType): string {
        let copyVal = val;
        if (!isNothing(val)) {
            let matches = val.match(extractValueRegexr);
            if (matches) {
                for (let m of matches) {
                    let key = removeBraceOfValue(removeAllSpace(m));
                    let value = this.extract(key);
                    this._fields[key] = new MurmurField(value, val, fieldType, unit)
                    copyVal = copyVal.replace(m, value);
                }
            }
        }
        return copyVal
    }
    extract(field) {
        let model = this.combineModel(),
            exotic = this.model.exotic;
        if (removeAllSpace(field).indexOf(':') === 0) {
            return exotic[field.slice(1)]
        } else {
            return model[field]
        }
    }
    combineModel() {
        return Object.assign({}, this.model.exotic || {}, this.model.state || {})
    }
    iterateChildren(ifBreak): Murmur {
        if (ifBreak(this)) {
            return this
        }
        let murmurChildren = this.children;
        let result;
        if (this.$repeatDirective.repeatDInstance) {
            murmurChildren = this.$repeatDirective.repeatDInstance.murmurList
        }
        for (let child of murmurChildren) {
            if (isMurmur(child)) {
                if (ifBreak(child)) {
                    return child
                }
                if (result = child.iterateChildren(ifBreak)) {
                    return result
                }
            }
        }
        return result
    }
    ref(ref: string) {
        let fn = murmur => murmur.refClue === ref;
        let refMurmur = this.iterateChildren(fn);
        return refMurmur
    }
    holder(placeholder: string) {
        let fn = murmur => murmur.placeholder === placeholder;
        let refMurmur = this.iterateChildren(fn);
        return refMurmur
    }
    replace(murmurPromise: MurmurPromise) {
        // this.refPromise = murmurPromise
        murmurPromise.then((murmur) => {
            this.children = [murmur];
            // this.model.state=Object.assign(this.model.state||{},murmur.model.state||{});
        })
    }
    getNode(): Node | Node[] {
        if (this.$repeatDirective.repeatDInstance) {
            let nodeArray = [];
            for (let murmur of this.$repeatDirective.repeatDInstance.murmurList) {
                nodeArray.push(murmur.getNode())
            }
            return nodeArray
        } else {
            if (this.$ifDirective.shouldReturn) {
                return this._connected.getDOM()
            } else {
                return this.$ifDirective.spaceHolder
            }
        }
    }
    lineTo(murmur:Murmur,name:string){
        murmur.logicParents[name]=this;
    }
    getLine(name:string){
        return this.logicParents[name];
    }
    static convert(obj, needReplace: Array<Murmur>): Murmur {
        if (obj.nodeName) {
            let {nodeName, attr, children} = obj;
            children = children.map(child => Murmur.convert(child, needReplace));
            let m: Murmur = new Murmur(nodeName, attr, children);
            for (let a of attr) {
                if (a.name == 'mm-holder') {
                    m.placeholder = a.value;
                    needReplace.push(m)
                }
            }
            return m
        }
        return obj
    }
    static clone<T extends MurmurItf>(murmur: T) {
        if (murmur.nodeName) {
            let {nodeName, attr, children} = murmur;
            children = children.map(child => Murmur.clone(<Murmur>child));
            return new Murmur(nodeName, attr, children);
        }
        return murmur
    }
}
