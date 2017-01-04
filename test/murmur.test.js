let Murmur = require('../Murmur').Murmur
let app = Murmur.prepare({
        templateUrl: 'template.html',
        // template: '<div>{age}</div><img mm-ref="footer"/>',
        loc: 'app',
    })
    /*.then(function (tree) {
        tree.ref('img')
    }).then(function(){
        
    })*/

let footer = Murmur.prepare({
    templateUrl: 'footer.html'
})
let author = Murmur.prepare({
    template: '{author}'
})
app.then(function (app) {
    app.holder('footer').replace(footer);
})
footer.then(function (f) {
    f.holder('author').replace(author)
})
app.then(function (app) {
    app.render({
        src: 'http://ggoer.com/favicon.ico',
        name: 'luwenxu',
        cn1: 'red',
        cn2: 'test',
        author: "big lu",
        position: 'fe',
        location: "suzhou",
        ref:"test",
        click: function (murmur, e) {
            murmur.update({
                src: 'http://tva1.sinaimg.cn/crop.239.0.607.607.50/006l0mbojw1f7avkfj1oej30nk0xbqc6.jpg'
            })
        },
        click2: function (murmur, e) {
            e.stopPropagation();
            murmur.update({
                location: 'beijing',
                cn1: 'green'
            })
        },
        update(murmur, e) {
            // e.stopPropogation();
            app.update({
                cn1: 'blue',
                people: [{
                    age: 30,
                    show: true
                }, {
                    age: 26,
                    show: true
                }, {
                    age: 27,
                    show: true
                }]
            });
        },
        mount: function (dom, murmur) {
            // console.log(dom, murmur)
        },
        people: [{
            age: 24,
            show: true
        }, {
            age: 25,
            show: true
        }]
    },function(app){
        console.log(app);
    });
})