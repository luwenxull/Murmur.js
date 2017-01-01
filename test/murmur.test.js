let Murmur = require('../Murmur').Murmur
let app = Murmur.prepare({
    // templateUrl: 'template.html',
    template: '<div>{name}</div><img mm-ref="img"/>',
    loc: 'app',
})/*.then(function (tree) {
    tree.ref('img')
}).then(function(){
    tree.render({
        src: 'http://ggoer.com/favicon.ico',
        name: 'luwenxu',
        cn1: 'red',
        cn2: 'test',
        position: 'fe',
        location: "suzhou",
        click: function (murmur, e) {
            murmur.update({
                src: 'http://tva1.sinaimg.cn/crop.239.0.607.607.50/006l0mbojw1f7avkfj1oej30nk0xbqc6.jpg'
            })
        },
        click2: function (murmur, e) {
            murmur.update({
                location: 'beijing',
                cn1: 'green'
            })
        },
        people: [{
            age: 24,
            show: true
        }, {
            age: 25,
            show: false
        }]
    });
})*/

let footer=Murmur.prepare({
    template:'<footer>this is footer</footer>'
})

app.then(function(app){
    app.ref('img').replaceWith(footer);
    // app.ref('img').append(footer);
}).then(function(app){
    app.render({name:'luwenxu'})
})
// setTimeout(function () {
//     app().update({
//         cn1: 'blue',
//         people: [{
//             age: 30,
//             show: true
//         }, {
//             age: 26,
//             show: true
//         }, {
//             age: 27,
//             show: true
//         }]
//     });
// }, 3000)