$(function(){
  // 注册账号链接
  $('#link_reg').on('click',function(){
    $('.login_box').hide()
    $('.reg_box').show()
  })

  // 点击登录链接
  $('#link_login').on('click',function(){
    $('.reg_box').hide()
    $('.login_box').show()
  })

  // 从layui获取form对象
  var form=layui.form
  var layer=layui.layer
  // 通过verify来校验
  form.verify({
    // pwd校验
    pwd:[
    /^[\S]{6,12}$/,
    '密码必须6到12位，且不能出现空格'
    ],
    repwd:function(value){
      var pwd=$('.reg_box [name=password]').val()
      if(pwd!==value){
        return '两次密码不一致'
      }
    }
  })

  // 监听注册表单提交事件
  $('#form_reg').on('submit',function(e){
    e.preventDefault()
    var data={username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
    $.post('/api/reguser',data,
    function(res){
      if(res.status!==0){
        return layer.msg(res.message);
      }
      // console.log('注册成功');
      layer.msg('注册成功');
      // 模拟点击行为
      $('#link_login').click()
    }
    )
  })
  // 监听登录表单
  $('#form_login').submit(function(e){
    e.preventDefault()
    $.ajax({
      url:'/api/login',
      method:'POST',
      // 快速获取表单数据 臣妾做不到阿
      // data:$(this).serialize(),
      data:{username:$('#form_login [name=username]').val(),password:$('#form_login [name=password]').val()},
      success:function(res){
        if(res.status!==0){
          return layer.msg(res.message)
        }
        layer.msg('登录成功')
        // console.log(res);
        // 将token保存到localstorage中
        localStorage.setItem('token',res.token)
        location.href='/index.html'
      }
    })
  })
})