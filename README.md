## Murmur.js

### 安装

```javascript
npm install --save murmur-orz.js
```

### 快速上手

<pre></pre>

```javascript
let app=new Mpp();
let demo=app.prepare({
    name:'demo',
    template:'<div>{greet}</div>',
  	model:{greet:'world'}
})
demo.render('app');
```

### API

### Mpp：构造函数。

#### new Mpp():Mpp

获取一个应用管理对象

```javascript
let app=new Mpp();
```

#### Mpp#prepare(description)：MurmurPromise

在当前app上注册一个组件,返回一个MurmurPromise对象，这是一个内置的**类promise**对象，用于管理异步代码。

```javascript
let demo=app.prepare({
  name:"demo",
  template:'<div>hello world</div>'，
  model:{}
})
```

*description对象：*

- name?:组件名称。可选
- template?:HTML字符串。可选
- templateUrl?:HTML字符串地址(默认使用template参数渲染)。可选
- model?数据模型。可选

*渲染指令：*

- {key}:取值表达式。从模型中取值

- mm-repeat="key":重复渲染指令。

- mm-if="key":是否渲染指令。

- mm-show="key":是否显示指令。

- mm-mount="key":渲染完成指令。当渲染完成时执行对应回调。此时dom及其子节点已渲染完成，但是还没有添加到document文档对象中。

  ```javascript
  // <div mm-mount="afterMount" ...>
  {afterMount:function(murmur){
    //murmur是当前节点的管理对象，也是内部的核心对象,会作为第一个参数传给该函数
    //更多关于murmur对象的信息请看下文
  }}
  ```


- mm-holder="name"：组件嵌套指令，name代表组件名。当遇到该指令时，会自动将指定组件作为子节点嵌套进指令出现节点中，原有的子节点会被删除。

  ```javascript
  // <div mm-holder="footer" ...>
  app.prepare({
    name:"footer",
    template:'<div>i am footer</div>'
  })
  //渲染结果
  //<div mm-holder="footer" ...>
  //	<div>i am footer</div>
  //</div>
  ```


- mm-ref="name"：给当前节点设置引用的指令，父节点可以通过该引用名获取到当前节点。具体参考Murmur对象

*事件绑定*

- mm-click="key":绑定click事件

  ```javascript
  // mm-click="click"
  {click:function(murmur,e){
    //murmur是当前节点的管理对象，也是内部的核心对象,会作为第一个参数传给该函数
    //第二个对象为event对象
  }}
  ```

  ​

### MurmurPromise

#### MurmurPromise#render(id,callback?)

```javascript
demo.render('demo',function(){
  //成功渲染之后的回调函数
})
```

- id:dom的id。应用会被渲染到该dom下。
- callback?：成功之后的回调。可选。

### Murmur

#### Murmur#getNode()

获取当前dom节点

#### Murmur#update(updateData)

更新当前节点，所有子节点也会更新。新的数据会合并到原有数据上。