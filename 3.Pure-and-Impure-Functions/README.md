Pure and Impure Functions
=============

[Section 3](https://egghead.io/lessons/javascript-redux-pure-and-impure-functions?series=getting-started-with-redux)

此篇在講述 [pure function](https://en.wikipedia.org/wiki/Pure_function) 和 impure functio 的差別。

```js
// Pure functions
// - 回傳值取決於參數
// - 相同的參數只會回傳相同的回傳值
// - 且沒有 Observable side effect 像是一些 IO, Database 的存取
// - 不會修改傳進來的參數值
function square(x) {
  return x * x;
}
function squareAll(items) {
  return items.map(square);
}

// Impure functions
function square(x) {
  updateXInDatabase(x); // 呼叫了 Database
  return x * x;
}
function squareAll(items) {
  for (let i = 0; i < items.length; i++) {
    items[i] = square(items[i]);  // 修改了傳進來的參數值
  }
}
```
