$(function(){
  layer=layui.layer
  // 定义查询参数对象，当请求数据时，要将请求提交到服务器
  var q={
    pagenum:1,
    pagesize:2,
    cate_id:'',
    state:''
  }
  initTable()
  // 获取文章列表数据
  function initTable(){
    $.ajax({
      method:'GET',
      url:'/my/article/list',
      data:q,
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取文章列表失败')
        }
        console.log('获取文章列表成功', res)
        // 使用模板引擎渲染数据
        var htmlStr=template('tpl-table',res)
        $('tbody').html(htmlStr)
      }
    })
  }
})