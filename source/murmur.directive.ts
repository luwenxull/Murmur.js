import Murmur from "./murmur.core"
import { removeAllSpace, addSibling } from "./murmur.tool"
import Connect from "./murmur.connect"

export interface MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: Node): Node
    update(murmur: Murmur, updateData)
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
    update(murmur: Murmur, updateData) {
        let repeatArr = updateData[this.directiveExpression];
        let keysNeedToBeUpdate = Object.keys(updateData)
        if (repeatArr) {
            let repeatArrLength = repeatArr.length, mmListLength = this.murmurList.length;
            this.lengthCheck(repeatArr, murmur)
            for (let i = 0; i < repeatArrLength; i++) {
                let repeatObj = repeatArr[i];
                let m = this.murmurList[i];
                if (m) {
                    m.$repeatDirective.repeatModel = repeatObj;
                    m.replaceRepeatModelOfChild(repeatObj);
                    m.dispatchUpdate(updateData, keysNeedToBeUpdate.concat(Object.keys(repeatObj)))
                }
            }
        }
    }
    lengthCheck(repeatArr: Array<any>, murmur: Murmur) {
        let repeatArrLength = repeatArr.length, mmListLength = this.murmurList.length;
        if (mmListLength > repeatArrLength) {
            this.removeExcessMurmur(mmListLength, repeatArrLength)
        }
        if (mmListLength < repeatArrLength) {
            this.addExtraMurmur(repeatArr, murmur, mmListLength, repeatArrLength)
        }
    }
    removeExcessMurmur(mmListLength: number, repeatArrLength: number) {
        while (repeatArrLength < mmListLength) {
            (<HTMLElement>this.murmurList[--mmListLength]._connected.get()).remove()
            this.murmurList.pop();
        }
    }
    addExtraMurmur(repeatArr: any[], murmur: Murmur, mmListLength, repeatArrLength) {
        while (mmListLength < repeatArrLength) {
            let clone = Murmur.clone(murmur), newDom, lastDom
            clone.$repeatDirective.$repeatEntrance = false;
            clone.$repeatDirective.$repeatEntity = true;
            clone.$repeatDirective.repeatModel = repeatArr[mmListLength++];
            newDom = clone.create(murmur.model);
            lastDom = this.murmurList[mmListLength - 2]._connected.get();
            addSibling(lastDom, newDom);
            this.murmurList.push(clone);
        }
    }
}

export class IfDirective extends MurmurDirective implements MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: HTMLElement): Node {
        let dExp = this.directiveExpression;
        if (!murmur.extract(dExp)) {
            domGenerated.style.display = 'none'
        }
        return domGenerated
    }
    update(murmur: Murmur, updateData) {
        let dExp = this.directiveExpression;
        let dom = <HTMLElement>murmur._connected.get();
        if (!murmur.extract(dExp)) {
            dom.style.display = 'none'
        } else {
            dom.style.display = ''
        }
    }
}