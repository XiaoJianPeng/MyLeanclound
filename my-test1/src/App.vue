<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div>
       <div>
        <label for="name">姓名：</label><input type="text" v-model="name"> 
        <br><label for="gender">性别：</label><input type="text" v-model="gender"> 
        <br><label for="age">年龄</label><input type="text" v-model="age"> 
        <br><label for="phone">手机号：</label><input type="text" v-model="phone"> 
        <br>
        <span>当前添加用户{{currName}}的信息为：{{usermsg}}</span>
        <br>

      </div>
      <div>
        <input Type="button" value="添加用户" @click="userAdd">
        <input Type="button" value="查询" @click="queryById('5a7199949f545416300cd78e')">
        <input Type="button" value="获取所有用户" @click="getAll()">
        <div>
          所有用户列表
          <span v-for="item in users">
            {{item.name}}  {{item.gender}}  {{item.Age}}  {{item.Phone}}
          </span>
        </div>
      </div>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
  // var AV = require('leancloud-storage');
  import AV from 'leancloud-storage'
  //声明类型
  var UserInfo =AV.Object.extend('UserInfo');
  export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Leancloud',
      usermsg:{},
      users:[],
      currName:'',
      name:'张三',
      gender:'男',
      age:'23',
      phone:'15188305021'
    }
  },
  methods:{
    userAdd(){      
      //新建对象
      var userInfo=new UserInfo();
      userInfo.set('name',this.name);
      userInfo.set('gender',this.gender);
      userInfo.set('Age',this.age);
      userInfo.set('Phone',this.phone);
      userInfo.save().then(function (user){
       this.usermsg=user.toJSON();
      }.bind(this),function(error){
        console.error(error);
      })
    },
    queryById(value){
      var query=new AV.Query('UserInfo');
      query.get(value).then(function (user) {
        //获取成功
        this.currName=user.get('name'); //单独获取某个属性值
        this.usermsg=user.toJSON();
      }.bind(this),function(error){
        console.error(error);
      });
    },
    getAll(){
      var ui1 = new UserInfo();
      ui1.id='5a71a3080b6160004450b5d2';
      var ui2 = new UserInfo();
      ui2.id='5a71a0bcac502e005ce4e2e5';
      var UserInfos=[ui1,ui2];//构建一个本地AV.Object对象数组
      //批量获取
      AV.Object.fetchAll(UserInfos).then(function(UserInfos){
        console.log(UserInfos);
        console.log(UserInfos.length());
        this.users=UserInfos.toJSON();
      }.bind(this),function(error){
        console.error(error);
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
