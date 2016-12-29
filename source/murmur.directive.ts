import Murmur from "./murmur.core"
import { removeAllSpace } from "./murmur.tool"
import Connect from "./murmur.connect"

export interface MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: Node): Node
    update(murmur:Murmur)
}

export class MurmurDirective {
    constructor(public directiveExpression: string) { }
}

export class RepeatDirective extends MurmurDirective implements MurmurDirectiveItf {
    public murmurList: Murmur[] = [];
    compile(model, murmur: Murmur, domGenerated: Node): Node {
        // murmur.$repeatDirective.inRepeat=true;
        let dExp = this.directiveExpression;
        let fragment = document.createDocumentFragment();
        if (model[dExp]) {
            for (let a of model[dExp]) {
                let clone = Murmur.clone(murmur);
                clone.$repeatDirective.$repeatEntrance = false;
                clone.$repeatDirective.$repeatEntity = true;
                clone.$repeatDirective.repeatModel = a;

                this.murmurList.push(clone);
                // clone.$repeatDirective=murmur.$repeatDirective;
                let repeatDom = clone.create(model);
                fragment.appendChild(repeatDom)
            }
        }
        // murmur.$repeatDirective.inRepeat=false;
        return fragment
    }
    update(murmur:Murmur) {
        console.log(murmur);
    }
}

export class IfDirective extends MurmurDirective implements MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: HTMLElement): Node {
        let dExp = this.directiveExpression;
        if (!murmur.extract(dExp)) {
            domGenerated.setAttribute('data-delete', '1')
        }
        return domGenerated
    }
    update() {

    }
}