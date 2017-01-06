import Murmur from "./murmur.core"
import { MurmurPromise } from "./murmur.promise"
import { MurmurPromiseType } from "./murmur.type"
import { wxParser } from "wx-parser"
import { isNothing, removeAllSpace, removeBraceOfValue, removeFirstColon, ajax, appendChild } from "./murmur.tool"

interface prepareItf {
    name: string,
    model?,
    template: string,
    templateUrl?: string,
}

export default class App {
    constructor(public appManager: {} = {}) { }
    prepare(prepareObj: prepareItf) {
        let murmurPromise: MurmurPromise;
        this.appManager[prepareObj.name] = murmurPromise = new MurmurPromise(prepareObj.template || prepareObj.templateUrl);
        if (prepareObj.template) {
            this.doConvert(prepareObj.template, prepareObj, murmurPromise)
        } else if (prepareObj.templateUrl) {
            ajax({
                url: prepareObj.templateUrl,
                success: responseText => {
                    this.doConvert(responseText, prepareObj, murmurPromise)
                }
            })
        }
        return murmurPromise
    }
    doConvert(template, prepareObj: prepareItf, murmurPromise: MurmurPromise) {
        let needReplace: Murmur[] = [];
        let murmurTree: Murmur = murmurPromise.murmur = Murmur.convert(wxParser.parseStart(template), needReplace);
        prepareObj.model && (murmurTree.model.state = prepareObj.model);
        if (needReplace.length) {
            for (let holderMurmur of needReplace) {
                let substitution = this.getPromise(holderMurmur.placeholder)
                murmurPromise.depends(substitution);
                holderMurmur.replace(substitution);
                murmurPromise.checkDependencies();
            }
        } else {
            murmurPromise.resolve();
        }
        // murmurPromise.resolve(murmurTree);
    }
    getPromise(name) {
        return this.appManager[name]
    }
}