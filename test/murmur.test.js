let Murmur = require('../index')

let app = Murmur.prepare({
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
            people: [{
                age: 24,
                show: true
            }]
        });
    }
})

app.then(function (tree) {
    setTimeout(function () {
            tree.update({
                people: [{
                    age: 30,
                    show: true
                },{
                    age: 25,
                    show: true
                },{
                    age: 26,
                    show: true
                },{
                    age: 27,
                    show: true
                }]
            });
        }, 3000)
        // console.log('hello');
})