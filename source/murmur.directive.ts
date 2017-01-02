import Murmur from "./murmur.core"
import { removeAllSpace, addSibling } from "./murmur.tool"
import Connect from "./murmur.connect"

export interface MurmurDirectiveItf {
    compile(murmur: Murmur, domGenerated: Node): Node
    update(murmur: Murmur, updateData)
    murmurList?:Murmur[]   
}

export class MurmurDirective {
    constructor(public directiveExpression: string) { }
}

export class RepeatDirective extends MurmurDirective implements MurmurDirectiveItf {
    public murmurList: Murmur[] = [];
    compile(murmur: Murmur, domGenerated: Node): Node {
        let dExp = this.directiveExpression,model=murmur.primaryModel;
        let fragment = document.createDocumentFragment();
        let repeatSource;
        if (repeatSource=murmur.extract(dExp)) {
            for (let stateModel of repeatSource) {
                let clone = Murmur.clone(murmur);
                clone.$repeatDirective.$repeatEntrance = false;
                clone.$repeatDirective.$repeatEntity = true;
                clone.stateModel=stateModel
                this.murmurList.push(clone);
                let repeatDom = clone.create(model);
                fragment.appendChild(repeatDom)
            }
        }
        return fragment
    }
    update(murmur: Murmur, updateData) {
        let repeatSource = murmur.extract(this.directiveExpression);
        let keysNeedToBeUpdate = Object.keys(updateData);
        for(let currentMurmur of this.murmurList){
            currentMurmur.primaryModel=murmur.primaryModel
        }
        if (repeatSource) {
            let repeatSourceLength = repeatSource.length, mmListLength = this.murmurList.length;
            this.lengthCheck(repeatSource, murmur, updateData)
            for (let i = 0; i < repeatSourceLength; i++) {
                let currentModel = repeatSource[i];
                let m = this.murmurList[i];
                if (m) {
                    m.stateModel=currentModel;
                    m.dispatchUpdate(updateData, keysNeedToBeUpdate.concat(Object.keys(currentModel)))
                }
            }
        }
    }
    lengthCheck(repeatSource: Array<any>, murmur: Murmur, updateData) {
        let repeatSourceLength = repeatSource.length, mmListLength = this.murmurList.length;
        if (mmListLength > repeatSourceLength) {
            this.removeExcessMurmur(mmListLength, repeatSourceLength)
        }
        if (mmListLength < repeatSourceLength) {
            this.addExtraMurmur(repeatSource, murmur, mmListLength, repeatSourceLength, updateData)
        }
    }
    removeExcessMurmur(mmListLength: number, repeatSourceLength: number) {
        while (repeatSourceLength < mmListLength) {
            (<HTMLElement>this.murmurList[--mmListLength]._connected.get()).remove()
            this.murmurList.pop();
        }
    }
    addExtraMurmur(repeatSource: any[], murmur: Murmur, mmListLength, repeatSourceLength, updateData) {
        while (mmListLength < repeatSourceLength) {
            let clone = Murmur.clone(murmur), newDom, lastDom
            clone.$repeatDirective.$repeatEntrance = false;
            clone.$repeatDirective.$repeatEntity = true;
            clone.stateModel = repeatSource[mmListLength++];
            // clone.stateModel=updateData;
            newDom = clone.create(murmur.primaryModel);
            lastDom = this.murmurList[mmListLength - 2]._connected.get();
            addSibling(lastDom, newDom);
            this.murmurList.push(clone);
        }
    }
}

export class IfDirective extends MurmurDirective implements MurmurDirectiveItf {
    compile(murmur: Murmur, domGenerated: HTMLElement): Node {
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

export class RefDirective extends MurmurDirective implements MurmurDirectiveItf{
    compile(murmur: Murmur, domGenerated: HTMLElement): Node {
        murmur.refClue=this.directiveExpression;
        return domGenerated
    }
    update(){}
}

export class MountDirective extends MurmurDirective implements MurmurDirectiveItf{
    compile(murmur: Murmur, domGenerated: HTMLElement): Node {
        let mountCallback=murmur.extract(this.directiveExpression);
        mountCallback && mountCallback(domGenerated,murmur);
        return domGenerated
    }
    update(){}
}