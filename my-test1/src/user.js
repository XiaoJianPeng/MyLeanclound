import AV from 'leancloud-storage'

//构建一个AV.Object
//var User=AV.Object.extend('User'); 

//ES6语法 声明一个AV.Object
class User extends AV.Object{}
//向SDK注册这个Class
AV.Object.register(User);

//声明类型
var UserInfo =AV.Object.extend('UserInfo');
