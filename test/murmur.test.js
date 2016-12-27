let Murmur = require('../index')
console.log(Murmur);
let wxParser = require('wx-parser');
let root = wxParser.parseStart(`<div class="{position}" data-resourceid="4902196">
<p mm-repeat="p in people"></p>
<p>is {position} {src}</p>
<img src='{src}'/>
</div>`);

let rootDom = Murmur.convert(root);
document.body.appendChild(rootDom.create({
    src: 'http://ggoer.com/favicon.ico',
    name: 'luwenxu',
    position: 'fe',
    people: [{age:24}]
}));
console.log(rootDom);
setTimeout(function () {
    rootDom.update({
        name: 'daidai',
        position: 'be'
    });
}, 3000)