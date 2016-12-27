let Murmur = require('../index')
console.log(Murmur);
let wxParser = require('wx-parser');
let root = wxParser.parseStart(`<div class="{position}" data-resourceid="4902196" mm-repeat="a in repeat">
<p>{name}</p>is {position} {src}
<img src='{src}'/>
</div>`);

let rootDom = Murmur.convert(root);
document.body.appendChild(rootDom.create({
    src: 'http://ggoer.com/favicon.ico',
    name: 'luwenxu',
    position: 'fe',
    repeat: [1, 2]
}));
console.log(rootDom);
setTimeout(function () {
    rootDom.update({
        name: 'daidai',
        position: 'be'
    });
}, 3000)