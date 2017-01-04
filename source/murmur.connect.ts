import {MurmurConnectTypes} from "./murmur.type"
export default class Connect{
    constructor(public dom:Node|Comment,public type:string){}
    isSimpleDom(){
        return this.type==MurmurConnectTypes[0]
    }
    getDOM():Node{
        return this.dom
    }
}