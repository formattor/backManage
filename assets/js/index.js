$(function(){
  // 调用函数
  getUserInfo()
  // 将layer赋值，似乎不需要
  // var layer=layui.layer
  // 退出
  $('#btnLogout').on('click',function(){
    // console.log('ok');
    layer.confirm('确定退出?', {icon: 3, title:'提示'}, function(index){
      localStorage.removeItem('token')
      location.href='/login.html'
      layer.close(index);
    });
  })
})


// 获取用户基本信息
function getUserInfo(){
  $.ajax({
    method:'GET',
    url:'/my/userinfo',
    // headers:{
    //   Authorization:localStorage.getItem('token')||''
    // },
    success:function(res){
      if(res.status!==0){
        return layui.layer.msg('获取用户信息失败')
      }
      // 渲染图片
      // console.log(res);
      renderAvatar(res.data)
    },
    // complete:function(res){
    //   // console.log(res, 'complete')
    //   if(res.responseJSON.status===1&&res.responseJSON.message==='身份认证失败！'){
    //     localStorage.removeItem('token')
    //     location.href='/login.html'
    //   }
    // }
  })
}

// 渲染图片
function renderAvatar(user){
  console.log(user)
  var userPic=user.user_pic
  var name=user.nickname||user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;'+ name)
  if(userPic!==null){
    $('.layui-nav-img').attr('src',userPic).show()
    $('.text_avatar').hide()
  }else{
    $('.layui-nav-img').hide()
    var first=name[0].toUpperCase()
    $('.text_avatar').html(first).show()
  }
}
