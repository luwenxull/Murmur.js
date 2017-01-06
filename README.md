## Murmur.js

### 安装

```javascript
npm install --save murmur-orz.js
```

### 快速上手

<pre></pre>

```javascript
let app=new Murmur();
let demo=app.prepare({
    name:'demo',
    template:'<div>{greet}</div>',
  	model:{greet:'world'}
})
demo.render('app');
```

### API

#### new Murmur()

获取一个应用管理对象

```javascript
let app=new Murmur();
```

#### prepare(obj)

准备一个组件

```javascript
let demo=app.prepare({
  name:"demo",
  template:'<div>hello world</div>'
})
```

#### 渲染

```javascript
demo.render('demo',function(){
  //成功渲染之后的回调函数
})
```

