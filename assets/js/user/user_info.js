$(function(){
  var form=layui.form

  var layer=layui.layer

  form.verify({
    nickname:function(value){
      if(value.length>6){
        return '长度在1~6个字符之间'
      }
    }
  })
  initUserInfo()
})
// 获取用户信息
function initUserInfo(){
  $.ajax({
    method:'GET',
    url:'/my/userinfo',
    success:function(res){
      if(res.status!==0){
        return layer.msg('获取用户信息失败')
      }
      console.log('表单数据',res.data)
      // 调用form
      // 为啥
      var form=layui.form

      form.val('formUserInfo',res.data)
    }
  })
}


// 重置表单数据
$('#btnReset').on('click',function(e){
  e.preventDefault();
  initUserInfo()
})

// 监听表单提交事件
$('.layui-form').on('submit',function(e){
  e.preventDefault()
  $.ajax({
    method:"POST",
    url:'/my/userinfo',
    data:$(this).serialize(),
    success:function(res){
      if(res.status!==0){
        return layer.msg('更新用户信息失败')
      }
      layer.msg('更新用户信息成功')
      // 调用父页面方法
      window.parent.getUserInfo()
    }
  })
})