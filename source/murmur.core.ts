import MurmurCreatorFactory from "./murmur.creator"
import MurmurField from "./murmur.field"
import { isNothing, removeAllSpace, removeBraceOfValue, removeFirstColon, ajax } from "./murmur.tool"
import { MurmurDirectiveItf, RepeatDirective } from "./murmur.directive"
import Connect from "./murmur.connect"
import { wxParser } from "wx-parser"
import { MurmurPromise } from "./murmur.promise"
import { MurmurPromiseType } from "./murmur.type"
export interface MurmurItf {
    nodeName: string,
    attr: { name: string, value: string }[]
    children: Array<Murmur | string>
}

interface renderItf {
    model
    template: string
    templateUrl?: string
    loc: string
    ok?: (tree: Murmur) => void
}

let murmurID = 1;

function isMurmur(obj: Murmur | string): obj is Murmur {
    return obj instanceof Murmur
}

let murmurRegex = /(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+?\})/g;
let extractValueRegexr = /\{\s*:{0,1}\w+\s*\}/g;
export default class Murmur implements MurmurItf {
    public nodeName: string
    public attr: { name: string, value: string }[]
    public children: Array<Murmur | string>
    public primaryModel = null
    public stateModel = null
    public $repeatDirective: { $repeatEntrance: boolean, $repeatEntity: boolean, repeatDInstance: RepeatDirective } = { $repeatEntrance: true, $repeatEntity: false, repeatDInstance: null }
    public _connected: Connect
    public _fields: { [p: string]: MurmurField } = {}
    public _loc: string
    public refClue: string
    public refPromise: MurmurPromise = null;
    public $directives: MurmurDirectiveItf[] = []
    private murmurID: number
    constructor(tagName, attr, children) {
        this.nodeName = tagName;
        this.attr = attr;
        this.children = children;
        this.murmurID = murmurID++;
    }
    create(primaryModel): Node {
        this.primaryModel = primaryModel;
        this._connected = MurmurCreatorFactory().create(this);
        return this._connected.dom
    }
    render(model, success?: (murmur: Murmur) => void) {
        let notResolvedPromise = this.getAllNotResolved();
        this.handleNotResolved(notResolvedPromise, () => {
            let root = this.create(model);
            let childNodes = root.childNodes;
            let loc = document.getElementById(this._loc);
            let childNodesArr = Array.prototype.slice.call(childNodes, 0)
            for (let child of childNodesArr) {
                loc.appendChild(child)
            }
            if (success) {
                success.call(null, this)
            }
        })
    }
    getAllNotResolved(notResolvedPromise: MurmurPromise[] = []) {
        let waitPromise = this.refPromise;
        if (waitPromise) {
            if (waitPromise.status === MurmurPromiseType.PENDING) {
                notResolvedPromise.push(waitPromise)
            }
            if (waitPromise.status === MurmurPromiseType.RESOLVED) {
                waitPromise.murmur.getAllNotResolved(notResolvedPromise)
            }
        }
        for (let child of this.children) {
            if (isMurmur(child)) {
                child.getAllNotResolved(notResolvedPromise)
            }
        }
        return notResolvedPromise
    }
    handleNotResolved(notResolvedPromise: MurmurPromise[], callback) {
        let allResolved = true;
        for (let nrp of notResolvedPromise) {
            if (nrp.status === MurmurPromiseType.PENDING && !nrp.resolveNotify) {
                nrp.resolveNotify = true;
                nrp.then((murmur: Murmur) => {
                    murmur.getAllNotResolved(notResolvedPromise)
                    this.handleNotResolved(notResolvedPromise, callback)
                })
                allResolved = false;
            }
        }
        if (allResolved) {
            callback()
        }
    }
    update(updateObj) {
        this.stateModel = Object.assign({}, this.stateModel || {}, updateObj);
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
                    child.primaryModel = this.combineModelToChild()
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
        if (removeAllSpace(field).indexOf(':') === 0) {
            return this.primaryModel[field.slice(1)]
        } else {
            if (this.stateModel && field in this.stateModel) {
                return (this.stateModel || this.primaryModel)[field]
            } else {
                return this.primaryModel[field]
            }
        }
    }
    combineModelToChild() {
        if (this.stateModel) {
            return Object.assign({}, this.primaryModel, this.stateModel)
        }
        return this.primaryModel
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
    refTo(murmurPromise: MurmurPromise) {
        this.refPromise = murmurPromise
        murmurPromise.then(() => {
            this.simpleClone(murmurPromise);
        })
    }
    getNode(): Node {
        return this._connected.get()
    }
    simpleClone(promise: MurmurPromise) {
        let murmur = promise.murmur;
        let source = murmur.children[0];
        if (isMurmur(source)) {
            this.children = source.children;
            this.attr = source.attr;
            this.nodeName = source.nodeName;
        } else {
            // this=source
        }
    }
    static convert(obj): Murmur {
        if (obj.nodeName) {
            let {nodeName, attr, children} = obj;
            children = children.map(child => Murmur.convert(child));
            let m = new Murmur(nodeName, attr, children);
            for (let a of attr) {
                if (a.name == 'mm-ref') m.refClue = a.value
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
    static prepare(renderObj: renderItf, ready?) {
        let murmurTree: Murmur;
        let murmurPromise = new MurmurPromise(renderObj.template || renderObj.templateUrl);
        if (renderObj.template) {
            murmurTree = Murmur.convert(wxParser.parseStart(renderObj.template, murmurRegex));
            murmurTree._loc = renderObj.loc;
            murmurPromise.resolve(murmurTree);
        } else if (renderObj.templateUrl) {
            ajax({
                url: renderObj.templateUrl,
                success: function (responseText) {
                    murmurTree = Murmur.convert(wxParser.parseStart(responseText, murmurRegex));
                    murmurTree._loc = renderObj.loc;
                    murmurPromise.resolve(murmurTree);
                }
            })
        }
        return murmurPromise
    }
}
