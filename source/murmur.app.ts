import Murmur from "./murmur.core"
import {MurmurPromise} from "./murmur.promise"
import {wxParser} from "wx-parser"
import {getTemplate} from "./murmur.tool"
// import {Observable} from "rxjs-es/Rx"
interface configItf {
    name: string,
    model?,
    template: string,
    templateUrl?: string,
}

export default class App {
    constructor(public appManager: {} = {}) {
    }

    config(config: configItf) {
        let murmurPromise: MurmurPromise;
        // this.appManager[config.name] = murmurPromise = new MurmurPromise(config.template || config.templateUrl);
        // if (config.template) {
        //     this.doConvert(config.template, config, murmurPromise)
        // } else if (config.templateUrl) {
        //     ajax({
        //         url: config.templateUrl,
        //         success: responseText => {
        //             this.doConvert(responseText, config, murmurPromise);
        //         }
        //     })
        // } else {
        //     throw new Error('请传入正确的模板字符串或地址！')
        // }
        let observable = getTemplate(config);
        observable.subscribe({
            next(template){
                this.doConvert(template, config, observable)
            }
        })

        // return murmurPromise
    }

    doConvert(template, prepareObj: configItf, murmurPromise: MurmurPromise) {
        let needReplace: Murmur[] = [];
        let murmurTree: Murmur = murmurPromise.murmur = Murmur.convert(wxParser.parseStart(template), needReplace);
        prepareObj.model && (murmurTree.model.state = prepareObj.model);
        if (needReplace.length) {
            for (let holderMurmur of needReplace) {
                let substitution = this.getPromise(holderMurmur.placeholder);
                murmurPromise.depends(substitution);
                holderMurmur.replace(substitution);
                murmurPromise.checkDependencies();
            }
        } else {
            murmurPromise.resolve();
        }
        
    }

    getPromise(name) {
        return this.appManager[name]
    }
}