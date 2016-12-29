let Murmur = require('../index')

// let wxParser = require('wx-parser');
// let root = wxParser.parseStart(`<div class="{className}">
// <p mm-repeat="people" mm-if=":show" data-name="{name}">{:age} {location}</p>
// <p>{name} is {position}</p>
// <img src='{src}'/>
// </div>`,/(<(\w+)\s*([\s\S]*?)(\/){0,1}>)|<\/(\w+)>|(\{:{0,1}\w+\})/g);

// let rootDom = Murmur.convert(root);
// document.body.appendChild(rootDom.create({
//     src: 'http://ggoer.com/favicon.ico',
//     name: 'luwenxu',
//     className:'red',
//     position: 'fe',
//     location:"suzhou",
//     people: [{age:24,show:true}]
// }));

// setTimeout(function () {
//     rootDom.update({
//         name: 'daidai',
//         position:'nurse',
//         location: 'nanjing',
//         people:[{age:25},{age:21}]
//     });
// }, 3000)

let app=Murmur.render({
    templateUrl: 'template.html',
    loc:'app',
    model: {
        src: 'http://ggoer.com/favicon.ico',
        name: 'luwenxu',
        className: 'red',
        position: 'fe',
        location: "suzhou",
        people: [{
            age: 24,
            show: true
        }]
    },
    ok:function(tree){
        app=tree;
    }
})

setTimeout(function(){
    app.update({
        name: 'daidai',
        position:'nurse',
        location: 'nanjing',
        people:[{age:25},{age:21}]
    });
},3000)
