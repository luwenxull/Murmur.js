import App from "../source/Murmur.app"
let app=new App();
app.component({
    name:'author',
    template:'hello {author}'
});

let footer=app.component({
    name:'date-footer',
    templateUrl: 'footer.html',
    model: {
        author: 'luwenxu'
    }
});

let root = app.component({
    name:'root',
    templateUrl: 'template.html',
    model: {
        src: 'http://ggoer.com/favicon.ico',
        name: 'luwenxu',
        cn1: 'red',
        cn2: 'test',
        position: 'fe',
        location: "suzhou",
        author:"somebody",
        date:'today',
        comment:"test for comment",
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
            e.stopPropagation();
            murmur.update({
                cn1: 'blue',
                people: [{
                    age: 30,
                    show: true
                }, {
                    age: 26,
                    show: false
                }, {
                    age: 27,
                    show: false
                }]
            });
        },
        mount: function (murmur) {
            // console.log(murmur);
        },
        people: [{
            age: 24,
            show: true
        }, {
            age: 25,
            // show: true
        }]
    }
});

// root.then(function(){
//     console.log(root);
// });
//
// root.render('app',function(){
//     console.log('d');
// });
// console.log(root);
// console.log(app);



// let footer = Murmur.prepare({
//     templateUrl: 'footer.html',
//     model: {
//         author: 'luwenxu'
//     }
// })

// app.then(function (app) {
//     app.holder('footer').replace(footer);
// })

// app.then(function (app) {
//     app.render('app', function (app) {
//         console.log(app);
//     });
// })