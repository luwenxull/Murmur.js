let Murmur = require('../Murmur').Murmur
window.app = Murmur.prepare({
    templateUrl: 'template.html',
    loc: 'app',
    ok: function (tree) {
        console.log(tree);
        tree.render({
            src: 'http://ggoer.com/favicon.ico',
            name: 'luwenxu',
            cn1: 'red',
            cn2: 'test',
            position: 'fe',
            location: "suzhou",
            click: function (murmur,e) {
                murmur.update({src:'https://i.ytimg.com/vi/7UjBV8D4un8/hqdefault.jpg?custom=true&w=196&h=110&stc=true&jpg444=true&jpgq=90&sp=68&sigh=6AsWhNuO9Z3nCsJ_u9knxYu_Y9k'})
            },
            click2:function(murmur,e){
                murmur.update({location:'beijing',cn1:'green'})
            },
            people: [{
                age: 24,
                show: true
            }]
        });
    }
})


setTimeout(function () {
    app().update({
        cn1: 'blue',
        people: [{
            age: 30,
            show:true
        }, {
            age: 26,
            show: true
        }, {
            age: 27,
            show: true
        }]
    });
}, 3000)