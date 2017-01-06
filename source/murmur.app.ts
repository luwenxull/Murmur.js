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
        let murmurTree: Murmur, murmurPromise: MurmurPromise
        this.appManager[prepareObj.name] = murmurPromise = new MurmurPromise(prepareObj.template || prepareObj.templateUrl);
        if (prepareObj.template) {
            murmurTree = Murmur.convert(wxParser.parseStart(prepareObj.template));
            prepareObj.model && (murmurTree.model.state = prepareObj.model);
            murmurPromise.resolve(murmurTree);
        } else if (prepareObj.templateUrl) {
            ajax({
                url: prepareObj.templateUrl,
                success: function (responseText) {
                    murmurTree = Murmur.convert(wxParser.parseStart(responseText));
                    prepareObj.model && (murmurTree.model.state = prepareObj.model);
                    murmurPromise.resolve(murmurTree);
                }
            })
        }
        return murmurPromise
    }
}