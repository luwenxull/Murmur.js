let Murmur = require('../Murmur').Murmur
let app = Murmur.prepare({
    templateUrl: 'template.html',
    // template: '<div>{age}</div><img mm-ref="footer"/>',
    loc: 'app',
})/*.then(function (tree) {
    tree.ref('img')
}).then(function(){
    
})*/

let footer=Murmur.prepare({
    templateUrl:'footer.html'
})
let author=Murmur.prepare({
    template:'{author}'
})
footer.then(function(f){
    f.ref('author').refTo(author)
})
app.then(function(app){
    app.ref('footer').refTo(footer);
}).then(function(app){
    console.log(app);
    app.render({
        src: 'http://ggoer.com/favicon.ico',
        name: 'luwenxu',
        cn1: 'red',
        cn2: 'test',
        author:"big lu",
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
        mount:function(dom,murmur){
            console.log(dom,murmur)
        },
        people: [{
            age: 24,
            show: true
        }, {
            age: 25,
            show: true
        }]
    });
})
// setTimeout(function () a{
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