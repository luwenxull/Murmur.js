import Murmur from "./Murmur.core";
let ComponentManager: {
    [prop: string]: any
} = {};

export default class Component {
    public rootTree: Murmur;
    public name: string;

    constructor(name: string) {
        this.name = name;
        ComponentManager[name] = this;
    }

    setRootTree(murmur: Murmur) {
        this.rootTree = murmur
    }
}