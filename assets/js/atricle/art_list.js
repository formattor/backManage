$(function(){
  var layer=layui.layer
  var form=layui.form
  var laypage=layui.laypage
  // 定义补领函数
  function padZero(n) {
    return n>9?n:'0'+n
  }
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat=function(date){
    const dt=new Date(date)

    var y=dt.getFullYear()
    var m=padZero(dt.getMonth())
    var d=padZero(dt.getDate())

    var hh=padZero(dt.getHours())
    var mm=padZero(dt.getMinutes())
    var ss=padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  // 定义查询参数对象，当请求数据时，要将请求提交到服务器
  var q={
    pagenum:1,
    pagesize:2,
    cate_id:'',
    state:''
  }
  initTable()
  initCate()
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
        // console.log('获取文章列表成功', res)
        // 使用模板引擎渲染数据
        var htmlStr=template('tpl-table',res)
        $('tbody').html(htmlStr)
        // 调用渲染分页方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类
  function initCate() {
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取文章分类失败')
        }
        // 模板引擎渲染
        var htmlStr=template('tpl-cate',res)
        // console.log(htmlStr, '模板引擎')
        $('[name=cate_id]').html(htmlStr)
        // 重新渲染 刷新
        form.render()
      }
    })
  }

  // 筛选绑定submit事件
  $('#form-search').on('submit',function (e) {
    e.preventDefault();
    // 获取表单中的值
    var cate_id=$('[name=cate_id]').val()
    var state=$('[name=state]').val()
    // 将值填入q中
    q.cate_id=cate_id
    q.state=state
    // 根据q重新渲染数据
    initTable()
  })

  // 定义分页的方法
  function renderPage(total) {
    // console.log(total, '总条数')
    // 渲染分页
    laypage.render({
      elem:'pageBox',
      count:total,
      limit:q.pagesize,
      curr:q.pagenum,
      layout:['count','limit','prev','page','next','skip'],
      limits:[2,5,10,20],
      // 分页切换触发
      jump:function(obj,first) {
        // console.log(obj.curr, '当前页码')
        // 把页码复制到q
        q.pagenum=obj.curr
        q.pagesize=obj.limit
        // initTable()
        // console.log(first);
        if(!first){
          initTable()
        }
      }
    })
  }

  // 代理方式为删除点击函数，因为此按钮是动态渲染出来的
  $('tbody').on('click','.btn-delete',function(){
    var len=$('.btn-delete').length
    console.log(len, '删除按钮数量')
    var id=$(this).attr('data-id')
    // 确认删除？
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      //do something
      $.ajax({
        method:'GET',
        url:'/my/article/delete/'+id,
        success:function(res){
          if(res.status!==0){
            return layer.msg('删除文章失败')
          }
          console.log(res, '文章删除状态')
          layer.msg('删除文章成功')
          // 没数据之后此时页面没变
          if(len===1){
            q.pagenum=q.pagenum===1?1:q.pagenum-1
          }
          initTable()
        }
      })
      layer.close(index);
    });
  })
  
})