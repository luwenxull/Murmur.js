let Murmur = require('../index')
console.log(Murmur);
let wxParser = require('wx-parser');
let root = wxParser.parseStart(`<div class="{className}">
<p mm-repeat="people" mm-if=":show">{:age} {location}</p>
<p>is {position} {src}</p>
<img src='{src}'/>
</div>`);

let rootDom = Murmur.convert(root);
document.body.appendChild(rootDom.create({
    src: 'http://ggoer.com/favicon.ico',
    name: 'luwenxu',
    className:'red',
    position: 'fe',
    location:"suzhou",
    people: [{age:24,show:true},{age:21}]
}));
console.log(rootDom);
setTimeout(function () {
    rootDom.update({
        name: 'daidai',
        position: 'be'
    });
}, 3000)