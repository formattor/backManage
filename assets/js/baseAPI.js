// 调用ajax接口
$.ajaxPrefilter(function(options){
  // console.log(options.url);
  options.url='http://ajax.frontend.itheima.net'+options.url;
  // 统一有权限的请求头设置header
  if(options.url.indexOf('/my/')!==-1){
    options.headers={
      Authorization:localStorage.getItem('token')||''
    }
  }
  // 全局挂载complete回调
  options.complete=function(res) {
    if(res.responseJSON.status===1&&res.responseJSON.message==='身份认证失败！'){
        localStorage.removeItem('token')
        location.href='/login.html'
    }
  }
})