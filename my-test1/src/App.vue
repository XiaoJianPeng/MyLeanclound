<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div>
      <div>
        {{ a | data }}
       <label for="">用户名:</label>
          <input type="text" value="" v-model="acount">
          <br>
          <label for="">密  码:</label>
          <input type="text" value="" v-model="password">
          <br>
          <input type="button" value="登录" @click="login">
       </div>
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
        <input Type="button" value="内嵌查询测试" @click="testQuery">
         <input Type="button" value="测试异步" @click="testAsync">
        <input Type="button" value="统计数量" @click="total">
        <input Type="button" value="添加用户" @click="userAdd">
        <input Type="button" value="查询" @click="queryById('5a7199949f545416300cd78e')">
        <input Type="button" value="根据Id更新数组" @click="updateById('5a72db84ac502e00389ce1ee')">
        <input Type="button" value="按条件更新" @click="update()">
        <input Type="button" value="更新数组" @click="updateArr()">
         
        <input Type="button" value="删除某个用户" @click="deleteUser('5a72cf881b69e60037c93e90')">
        <br>
        <input Type="button" value="批量删除" @click="deleteBatch()">
        <div>
          <hr>
          <h3>文件 </h3>
          <input Type="button" value="从数据流创建文件" @click="createFile()">
          <br>
          <input type="file" id="photoFileUpload" @change="uploadFile" /> 
          <input type="button" value="上传" @click="upload()">
          <br>
          <progress v-show="progressCurrent>0" :value="progressCurrent" max=100 ></progress>
          <input type="button" value="删除文件" @click="deleteFile()">
          <input type="button" value="保存(关联文件)" @click="saveFile()">
          <input type="button" value="查询(关联文件)" @click="queryFile()">
          <br>
          <img v-for="(item,index) in imgList" :key="index" :src="item" alt="明星" />
        </div>
      </div>
      <div>
        <hr>
        <h3>查询</h3>
        <input type="button" value="按条件查询" @click="query">
        <input type="button" value="创建关系对象tag和todoFolder" @click="createRelation">
        <input type="button" value="关系查询" @click="query">
        <input type="button" value="内嵌查询" @click="queryIn">
        <input type="button" value="向手机发送验证码" @click="send">
        <div>
          <ul>
            <li v-for="item in result " v-text="item">
            </li>
          </ul>
          
        </div>
      </div>
      <div>
        <input type="button" value="注册用户" @click="register">
        <input type="button" value="用第三方账号登录" @click="signUpOther">
        <input type="button" value="测试" @click="test">
        <br>
        <input type="file" id="photoFileUpload1" @change="batchUlFile" /> 
        <input type="button" value="批量上传" @click="batchUpload()">
        <br>
      </div>
    </div>
    <hr>
     <div>
        <input type="button" value="角色设置" @click="roleSet">
      
      </div>
  </div>
</template>

<script>
  // var AV = require('leancloud-storage');
  import AV,{ Query } from 'leancloud-storage'
  import Filters from './components/filters'
  //声明类型
  var UserInfo =AV.Object.extend('UserInfo');
  var Imgs = AV.Object.extend('Imgs');
  var Todo =AV.Object.extend('Todo');

  export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Leancloud',
      a: Date.now(),
      usermsg:{},
      file:{},
      users:[],
      currName:'',
      name:'张三',
      gender:'男',
      age:'23',
      number:100,
      phone:'15188305021',
      progressCurrent:0,
      imgList:[],
      result:{},      
      acount:'15188305020',
      password:'123'
    }
  },
  filters: {
  data:function (input) {
    var d = new Date(input);
    // var year = d.getFullYear();
    // var month = d.getMonth() + 1;
    // var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
    // var hour = d.getHours();
    // var minutes = d.getMinutes();
    // var seconds = d.getSeconds();
    // return year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    return Filters.formatDate(d, 'yyyy-MM-dd hh:mm')
  }
},
  methods:{
    testAsync() {
      Test.box5()
    },
    testQuery () {
      var query =new AV.Query('UserInfo')
      let orgs = AV.User.current().get('manageOrgs')
      var cql = 'select * from UserInfo where org in ()'
      orgs.forEach(element => {
        cql=cql.replace(')', '"'+element +'",)') 
      })
      // var quData = AV.Query.or(query)
      // quData.find().then((results) => {
      //   console.log(results)
      // }).catch((error) => {
      //   console.error(error)
      // })
      cql=cql.replace(',)', ')')
      console.log(cql)
      // var cql = 'select * from UserInfo where org in (?)'
      // var pvalues =[ orgStr]
      AV.Query.doCloudQuery(cql).then(function (data){
        console.log(data.results)
      }).catch(function(error) {
        console.error(error)
      })
      // var query =new AV.Query('UserInfo')
      // // 构造截至日期     
      // var innerQuery = new AV.Query('User')
      // innerQuery.equalTo('username','肖建朋')
      // // innerQuery.select(['manageOrgs'])
      // innerQuery.find().then((results) => {
      //   console.log(results)
      // }).catch((error) => {
      //   console.error(error)
      // })
      // query.matchesQuery('org', innerQuery)
      // query.find().then((results) => {
      //   console.log(results)
      // }).catch((error) => {
      //   console.error(error)
      // })
    },
    roleSet() {
      var roleAcl = new AV.ACL();
      roleAcl.setPublicReadAccess(true);
      roleAcl.setPublicWriteAccess(false);

      // 当前用户是该角色的创建者，因此具备对该角色的写权限
      roleAcl.setWriteAccess(AV.User.current(), true)
      var Admin = new AV.Role('Admin',roleAcl)
      // console.log(Admin)
      Admin.save().then(function (res) {
        console.log(res)
      }).catch(function (error) {
        console.error(error)
      })
    },
    total() {
      var query = new AV.Query('UserInfo')
      query.equalTo('age', '10')
      query.count().then(function (res) {
         let data = {
          org: 'ss',
          res
        }
        console.log(data)
      }).catch(function (error) {
        console.error(error)
      })
    },
    batchUlFile($event) {
      var localFile=$event.target.files[0];
      // console.log(localFile)
      var imgs = new Imgs()
      imgs.set('name',localFile.name)
      
      var file=new AV.File(localFile.name,localFile);
      imgs.set('image',file)
      this.imgList.push(imgs);
    },
    batchUpload() {
      console.log(this.imgList)
      AV.Object.saveAll(this.imgList).then(function(res){
        console.log(res);
      }).catch(function(error){
        console.error(error);
      })
    },
    login(){
      var _this=this;
       console.log(this.acount+';' +this.password);
       AV.User.logInWithMobilePhone(this.acount, this.password).then(function (loginedUser) {
            console.log('登录成功:'+loginedUser.toJSON());
        }, (function (error) {
            console.log(error.code);
            // console.error(error);   
            if(code==211||code==210){
                _this.$http.post('http://s.sishuxuefu.com:8008/AttendanceWebService.asmx/CheckInAndDataSync', {
                    acount:acount,
                    password:password
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.error(error);
                });
            }         
        }));
    },
    userAdd(){//添加用户      
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
    queryById(value){//根据Id查询
      var query=new AV.Query('UserInfo');
      query.get(value).then(function (user) {
        //获取成功
        this.currName=user.get('name'); //单独获取某个属性值
        console.log(user.get('typePointer').id)
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
    deleteBatch(){//批量删除
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
        console.log(file);
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
    },
    saveFile(){//保存图片并关联其他对象
      var file = AV.File.withURL('Satomi_Ishihara.gif', 'http://ww3.sinaimg.cn/bmiddle/596b0666gw1ed70eavm5tg20bq06m7wi.gif');
      
      file.save().then(function(file1) {
          // 文件保存成功
          console.log(file.url());
          var todo = new Todo();
          todo.set('girl',file1);
          todo.set('topic','明星');
          todo.save().then(function (todo){
            console.log(todo);
          },function(error){
            console.error(error);
          });
      }, function(error) {
        // 异常处理
        console.error(error);
      });    
    },
    queryFile(){     //查询对象关联图片文件
      var _this=this;
      var query =new AV.Query('Todo');
      query.equalTo('topic','明星');
      query.include('girl');
      query.find().then(list=>{
        list.map(todo=>{
          var file=todo.get('girl');
          _this.imgList.push(file.get('url'));
        });
      });
      console.log(this.imgList);
    },
    query(){//条件查询
      var _this=this;
      var q=new AV.Query('UserInfo');
      // q.equalTo('number',100);//等于
      q.lessThan('number', 101); //小于
      q.startsWith('name', '张');
      q.find().then(function(result){
        _this.result=result;
      },function(error){
        console.error(error);
      })
    },
    createRelation(){//创建关系对象
      // var tag1 =new AV.Object('Tag');
      // tag1.set('name','今日必做');
      // var tag2 =new AV.Object('Tag');
      // tag2.set('name','老婆吩咐');
      // var tag3 =new AV.Object('Tag');
      // tag3.set('name','十分重要');
      // var tags=[tag1,tag2,tag3];
      // //批量保存tag
      // AV.Object.saveAll(tags).then(function(savedTags){
      //   console.log('保存成功！1');
      //   var todoFolder=new AV.Object('TodoFolder');
      //   todoFolder.set('name','家庭');
      //   todoFolder.set('priority',1);
      //   var relation =todoFolder.relation('tags');//relation已废弃
      //   relation.add(tag1);
      //   relation.add(tag2);
      //   relation.add(tag3);
      //   console.log('2');
      //   todoFolder.save();
      //   console.log('3');
      // },function(error){
      //   console.error(error);
      // });
      //更新Pointer 类型字段的值
      var type=AV.Object.createWithoutData('Types','5a741052128fe1003da0c771')
      type.set('title', 'C类用户(三)')
      var user = AV.Object.createWithoutData('UserInfo', '5a7199949f545416300cd78e');
      // 修改属性 
      user.set('typePointer', type);
      // 保存到云端
      user.save().then(function (res) {
        console.log(res)
      }).catch(function (error) {
        console.error(error)
      })     
    },
    queryIn(){
      var _this=this;
      var innerQuery =new AV.Query('Types');
      innerQuery.equalTo('title','A类用户');
      var query=new AV.Query('UserInfo');

      query.matchesQuery('typePointer',innerQuery);
      query.find().then(function(result){
        _this.result=result;
      },function(error){
        console.error(error);
      });
      // query.doesNotMatchQuery('typePointer',innerQuery);
    },
    send(){
      AV.Cloud.requestSmsCode('15188305020').then(function(success){
        console.log(success);
      },function(error){
        console.error(error);
      });
    },
    register(){
       // 新建 AVUser 对象实例
      var user = new AV.User();
      // 设置用户名
      user.setUsername('Tom');
      // 设置密码
      user.setPassword('!@#123');
      // 设置邮箱
      user.setEmail('892825058@qq.com');
      user.setMobilePhoneNumber('15188305020');
      user.signUp().then(function (loginedUser) {
          console.log(loginedUser);
      }, function (error) {
        console.error(error);
      });
    },
    signUpOther(){
      AV.User.signUpOrlogInWithAuthData({
      // 微博（weibo）用 uid
      // 微信（weixin）和 QQ（qq）用 openid
      "openid": "oPrJ7uM5Y5oeypd0fyqQcKCaRv3o",
      "access_token": "OezXcEiiBSKSxW0eoylIeNFI3H7HsmxM7dUj1dGRl2dXJOeIIwD4RTW7Iy2IfJePh6jj7OIs1GwzG1zPn7XY_xYdFYvISeusn4zfU06NiA1_yhzhjc408edspwRpuFSqtYk0rrfJAcZgGBWGRp7wmA",
      "expires_at": "2016-01-06T11:43:11.904Z"
      }, 'qq').then(function (s) {
      
      }, function (e) {

      });
    },
    test(){
      // 将内容按章节顺序添加到页面上
      var chapterIds = [
        '584e1c408e450a006c676162', // 第一章
        '584e1c43128fe10058b01cf5', // 第二章
        '581aff915bbb500059ca8d0b'  // 第三章
      ];

      new AV.Query('Chapter').get(chapterIds[0]).then(function(chapter0) {
        // 向页面添加内容
        addHtmlToPage(chapter0.get('content'));
        // 返回新的 Promise
        return new AV.Query('Chapter').get(chapterIds[1]);
      }).then(function(chapter1) {
        addHtmlToPage(chapter1.get('content'));
        return new AV.Query('Chapter').get(chapterIds[2]);
      }).then(function(chapter2) {
        addHtmlToPage(chapter2.get('content'));
        // 完成
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
