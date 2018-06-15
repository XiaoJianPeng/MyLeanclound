export default {
  // ...扩展运算符使用
  expand () {
    const [first, ...rest] = [1, 2, 3, 4, 5]; 
    console.log(first)
    console.log(rest)
  }
}