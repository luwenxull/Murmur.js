import {MurmurConnectTypes} from "./murmur.type"
export default class Connect{
    constructor(public dom:Node,public type:string){}
    isSimpleDom(){
        return this.type==MurmurConnectTypes[0]
    }
    get():Node{
        return this.dom
    }
}