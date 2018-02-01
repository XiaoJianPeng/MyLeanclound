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
        <input Type="button" value="根据Id更新数组" @click="updateById('5a72db84ac502e00389ce1ee')">
        <input Type="button" value="按条件更新" @click="update()">
        <input Type="button" value="更新数组" @click="updateArr()">
         
        <input Type="button" value="删除某个用户" @click="deleteUser('5a72cf881b69e60037c93e90')">
        <br>
        <input Type="button" value="批量删除" @click="getAll()">
        <div>
          <hr>
         <h3>文件 </h3>
         <input Type="button" value="从数据流创建文件" @click="createFile()">
         <br>
         <input type="file" id="photoFileUpload" @change="uploadFile" /> 
         <input Type="button" value="上传" @click="upload()">
         <br>
         <progress v-show="progressCurrent>0" :value="progressCurrent" max=100 ></progress>

         <input Type="button" value="删除文件" @click="deleteFile()">
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
      file:{},
      users:[],
      currName:'',
      name:'张三',
      gender:'男',
      age:'23',
      number:100,
      phone:'15188305021',
      progressCurrent:0
    }
  },
  methods:{
    userAdd(){      
      //新建对象
      var reminder1 = new Date('2015-11-11 07:10:00');    
      var reminders = [reminder1];
      var userInfo=new UserInfo();
      userInfo.set('name',this.name);
      userInfo.set('gender',this.gender);
      userInfo.set('Age',this.age);
      userInfo.set('Phone',this.phone);
      userInfo.set('number',this.number);
      userInfo.set('reminders',reminders);
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
    updateById(value){ //根据id更新
      var reminder1 = new Date('2015-11-11 08:15:00');
      var reminder2 = new Date('2015-11-11 08:20:00');
      var reminder3 = new Date('2015-11-11 08:30:00');
      var reminders = [reminder1, reminder2, reminder3];
      var user =new AV.Object.createWithoutData('UserInfo',value)
      // user.set('reminders',reminders);
      user.addUnique('reminders',reminders);
      user.save();
    },
    update(){//按条件更新
      new AV.Query(UserInfo).first().then(function(user){
        var num=-1;
        alert(user.get('number'));
        user.increment('number',num);
        return user.save(null,{
          query:new AV.Query(UserInfo).greaterThanOrEqualTo('number',-num),
          fetchWhenSave:true,
        });
      }).then(function(user){
        console.log('当前数字：',user.get('number'));
      }).catch(function(error){
        console.log('1'+error);
      })
    },
    updateArr(){
      var reminder1 = new Date('2015-11-11 07:15:00');
      var reminder2 = new Date('2015-11-11 07:20:00');
      var reminder3 = new Date('2015-11-11 07:30:00');
      var reminders = [reminder1, reminder2, reminder3];
      var user =new AV.Object('UserInfo');
      user.addUnique('reminders',reminders);
      user.save().then(function(user){
        console.log(user.id);
      },function(error){
        console.error(error);
      });
    },
    deleteUser(value){
      var user=AV.Object.createWithoutData('UserInfo',value);
  
      user.destroy().then(function(success){    
        if(success.createdAt==null){
          alert('要删除的用户不存在！');
        }
        else{
          alert('删除成功！');
        }
        
      },function(error){
        alert(error)
      });
    },
    getAll(){
      var ui1 = new UserInfo();
      ui1. id='5a72cf4f2f301e0041f46f0d';
      var ui2 = new UserInfo();
      ui2.id='5a71a3080b6160004450b5d2';
      var UserInfos=[ui1,ui2];//构建一个本地AV.Object对象数组
      //批量删除
      AV.Object.destroyAll(UserInfos).then(function(){
        alert('删除成功！');
      },function(error){
        console.error(error);
      })
    },
    createFile(){//从数据流构建文件
      var data ={base64:'6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf'};
      var file=new AV.File('resume.txt',data);
      file.save();

      var bytes= [0xBE, 0xEF, 0xCA, 0xFE];
      var byteArrayFile=new AV.File('myFile.txt',bytes);
      byteArrayFile.save();
    },
    uploadFile($event){//获取选中的文件
      this.file = $event.target.files[0];
    },
    upload(){
      if(this.file.name==null){
        alert('文件为空！');
        return;
      }     
      var _this=this;   
      var file=new AV.File(this.file.name,this.file);
      //保存文件
      file.save({
        onprogress(e){//监听上传进度
          console.log(e);
          _this.progressCurrent=e.percent;
        }
      }).then(function(file){
        console.log(file.url());
      },function(error){
        console.error(error);
      });
    },
    deleteFile(){
      var file =AV.File.createWithoutData('5a72f5f3ac502e00389d9c09');
      file.destroy().then(function(success){
        alert('删除成功！');
      },function(error){
        console.error(error);
      });
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
