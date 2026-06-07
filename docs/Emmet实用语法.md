# 前端Emmet插件常用语法

---

+ Emmet是什么? +
  
Emmet是一款编辑器插件，支持多种编辑器支持。在前端开发中，Emmet 使用缩写语法快速编写HTML、XML、CSS 以及实现其他的功能，极大的提高前端开发效率。

---
## 常用语法

### 1. html开发基础语法
#### 1.1 基础语法
1. `!`: 快速生成html骨架
   > 创建一个html文件，输入`!`回车即可生成骨架。
2. `#`: 快速生成id
   > `div#id` => `<div id="id"></div>`
3. `.`: 快速生成class
   > `div.box` => `<div class="box"></div>`
4. `[]`: 快速生成属性
   > `a[title="标题"]` => `<a href="lonemonk.xyz" title="标题"></a>`
5. `{}`: 快速生成内容
   > `h1{标题}` => `<h1>标题</h1>`
6. 综合练习
   > `div.box#id[title="这是综合训练"]{标题}` => `<div class="box" id="id" title="这是综合训练">标题</div>`

#### 1.2 批量生成
1. `*`: 批量生成
   > `div.number*3` => <br> 
   `<div class="number"></div>` <br>
   `<div class="number"></div>` <br>
   `<div class="number"></div>`
2. `$*`: 批量生成序号，从 1 开始
   > `div#number$*3` => <br>
   `<div id="number1"></div>` <br>
   `<div id="number2"></div>` <br>
   `<div id="number3"></div>`
3. `$$`: 批量生成序号，从 01 开始
   > `div#number$$*3` => <br>
   `<div id="number01"></div>` <br>
   `<div id="number02"></div>` <br>
   `<div id="number03"></div>`
4. `$@2`: 批量生成序号，从 2 开始
   > `div#number$@2*3` => <br>
   `<div id="number2"></div>` <br>
   `<div id="number3"></div>` <br>
   `<div id="number4"></div>`
5. `$@-`: 批量生成序号，倒序到 1 结束
   > `div#number$@-*3` => <br>
   `<div id="number3"></div>` <br>
   `<div id="number2"></div>` <br>
   `<div id="number1"></div>`
6. `$@-2`: 批量生成序号，倒序到 2 结束
   > `div#number$@-2*3` => <br>
   `<div id="number4"></div>` <br>
   `<div id="number3"></div>` <br>
   `<div id="number2"></div>`
7. 综合练习
   > `div.item$*3#number$$@-6` => <br>
   `<div class="item1" id="number08"></div>` <br>
   `<div class="item2" id="number07"></div>` <br>
   `<div class="item3" id="number06"></div>`

#### 1.3 嵌套生成
1. `>`: 儿子生成
   > `ul>li` => `<ul><li></li></ul>`
2. `+`: 兄弟生成
   > `p+p` => `<p></p><p></p>`
3. `+>`: 兄弟儿子生成
   > `ul>li+p` => `<ul><li></li><p></p></ul>`
4. `^`: 兄弟同级
   > `main>h1^p` => `<main><h1></h1></main><p></p>`
5. `()`: 嵌套生成
   >`(ui>li*2)*2` 等价于 `ui*2>li*2` => <br>
   `<ui><li></li><li></li></ui>` <br>
   `<ui><li></li><li></li></ui>` 
6. 综合练习 
   > `div.box>h2{标题}+p{内容}^button#item$$@3*2` => <br>
   `<div class="box"><h2>标题</h2><p>内容</p></div>`
   `<button id="item01"></button><button id="item02"></button>`

#### 1.4 默认Tag生成（非重要）
1. 默认`div`，省略`div`Tag，默认补全
   > `.class` => `<div class="class"></div>`
2. 默认`li`，在`ul`中省略`li`
   > `ul>.item*2` => <br>
   `<ul><li class="item"></li>` <br>
   `<li class="item"></li></ul>`
3. 默认`tr`，在`table`中省略`tr`,默认`td`，在`tr`中省略`td`
   > `table>.row*2>.col*2` => <br>
   `<table>` <br>
    `<tr class="row">` <br>
    `<td class="col"></td>`
    `<td class="col"></td>`
    `</tr>` <br>
    `<tr class="row">` <br>
    `<td class="col"></td>`
    `<td class="col"></td>`
    `</tr>` <br>
   `</table>`

#### 1.4 默认属性生成（非重要）
1. `a`: 默认添加`href`属性
   > `a` => `<a href=""></a>`
2. `a:link`: 添加`href:http://"`属性
   > `a:link` => `<a href="http://"></a>`
3. `a:mail`: 添加`href:mailto:`属性
   > `a:mail` => `<a href="mailto:"></a>`
4. `a:tel`: 添加`href:tel:`属性
   > `a:tel` => `<a href="tel:"></a>`
5. `script:src`: 添加`src`属性
   > `script:src` => `<script src=""></script>`
6. `img:src`: 添加`src`属性
   > `img:src` => `<img src="">`
7. `meta`: 添加`charset`属性
   > `meta` => `<meta charset="">`
***很多默认属性，可以自行尝试，不再赘述***

#### 1.5 表单生成（扩展）
1. `form`: 默认添加`action`属性
   > `form` => `<form action=""></form>`
2. `form:get`: 添加`method`属性
   > `form:get` => `<form method="get"></form>`
3. `form:post`: 添加`method`属性
   > `form:post` => `<form method="post"></form>`
4. `input`: 默认添加`type`属性
   > `input` => `<input type="text">`
5. `select`: 默认添加`name`属性和`id`属性
   > `select` => `<select name="" id=""></select>`

---

### 2. Emmet实时演示
学完上述语法，可以尝试下面的实时演示，这里暂时不正常显示CSS的效果，后续补充，<br>**在下面输入 Emmet 缩写，可以查看展开后的 HTML 和实时预览效果。**

<div class="emmet-playground" data-emmet="ul>li.item$*3>a{第 $ 项}"></div>

可以尝试输入：

1. `!`
2. `ul>li*3`
3. `.box>h2{标题}+p{内容}`
4. `table>tr*2>td*3` <br>
 ……

### 3. （补充）CSS生成
1. `m10px` => `margin: 10px;`
2. `p10px` => `padding: 10px;`
3. `b10px` => `border: 10px;`
4. `m10p` => `margin: 10%;`
5. `m10r` => `margin: 10rem;`
6. `m10-20-10-20` => `margin: 10px 20px 10px 20px;`
7. `m10p20p` => `margin: 10% 20%;`
8. `mt10p` => `margin-top: 10%;`
9. `mb10p` => `margin-bottom: 10%;`
10. `ml10p` => `margin-left: 10%;`
11. `mr10p` => `margin-right: 10%;`
12. `m-10` => `margin: -10px;`
13. `m-10--20` => `margin: -10px -20px;`
14. `c` => `color:;`
15. `c#f` => `color: #ffffff;`
16. `c#f0` => `color: #f0f0f0;`
17. `color:rgb` => `color: rgb();`
18. `color:rgba` => `color: rgba();`
19. `pore` => `position: relative;`
20. `poab` => `position: absolute;`
21. `posf` => `position: fixed;`
22. `z1` => `z-index: 1;`
23. `d:n` => `display: none;`
24. `d:b` => `display: block;`
25. `d:i` => `display: inline;`
26. `ov:h` => `overflow: hidden;`
27. `cur:p` => `cursor: pointer;`
28. `ta:l` => `text-align: left;`
29. `fw:b` => `font-weight: bold;`
30. `fz12` => `font-size: 12px;`
31. `fz14!` => `font-size: 14px !important;`<br>
……

**<h1>参考文档：
https://docs.emmet.io/cheat-sheet/</h1>**