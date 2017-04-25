import Murmur from "./Murmur.core"
import {wxParser} from "wx-parser"
import {getTemplate} from "./Murmur.tool"
import Component from "./Murmur.component"
interface configItf {
    name: string,
    model?,
    template: string,
    templateUrl?: string,
}

export default class App {
    constructor(public appManager: {} = {}) {
    }

    component(config: configItf) {
        let observableConfig = getTemplate(config);
        observableConfig.subscribe({
            next: template => {
                this.compileComponent(template, config, observableConfig)
            }
        })
    }

    compileComponent(template, config: configItf, observableConfig) {
        let component = new Component(config.name);
        let rootTree: Murmur = Murmur.convert(wxParser.parseStart(template),component);
        // config.model && (rootTree.model.state = config.model);
        component.setRootTree(rootTree)
    }
}