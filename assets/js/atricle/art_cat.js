$(function(){
  var layer=layui.layer
  var form=layui.form
  // 获取文章分类列表
  initArtcateList()
  function initArtcateList(){
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取文章分类失败')
        }
        // console.log(res, '成功')
        var htmlStr=template('tpl-table',res)
        $('tbody').html(htmlStr)
      }
    })
  }


  var indexAdd=null
  // 添加类别
  $('#btnAddCate').on('click',function(){
    indexAdd=layer.open({
      type:1,
      area:['500px','250px'],
      title:'添加类别',
      content:$('#dialog-add').html()
    })
  })

  // 通过代理来为form绑定submit事件
  $('body').on('submit','#form-add',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/addcates',
      data:$(this).serialize(),
      success:function(res){
        if(res.status!==0){
          return layer.msg('新增分类失败')
        }
        initArtcateList()
        layer.msg('新增分类成功')
        layer.close(indexAdd)
      }
    })
  })

  var indexEdit=null;
  //代理为编辑按钮点击绑定
  $('tbody').on('click','#btn-edit',function(){
    // console.log('ok')
    indexEdit=layer.open({
      type:1,
      area:['500px','250px'],
      title:'编辑类别',
      content:$('#dialog-edit').html()
    })
    var id=$(this).attr('data-id')
    // console.log(id);
    $.ajax({
      method:'GET',
      url:'/my/article/cates/'+id,
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取数据失败')
        }
        // console.log('获取数据成功',res.data)
        form.val('form-edit',res.data)
      }
    })

    // 通过代理绑定submit修改表单数据
    $('body').on('submit','#form-edit',function(e){
      e.preventDefault()
      $.ajax({
        method:'POST',
        url:'/my/article/updatecate',
        data:$(this).serialize(),
        success:function(res){
          console.log('更新分类数据', res)
          if(res.status!==0){
            return layer.msg('更新分类数据失败！')
          }
          layer.msg('更新分类数据成功！')
          layer.close(indexEdit)
          initArtcateList()
        }
      })
    })

    // 删除数据 代理
    $('tbody').on('click','#btn-delete',function(){
      var id=$(this).attr('data-id')
      layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){   
        $.ajax({
          method:'GET',
          url:'/my/article/deletecate/'+id,
          success:function(res){
            if(res.status!==0){
              return layer.msg('删除分类失败')
            }
            layer.msg('删除分类成功')
            layer.close(index);
            initArtcateList()
          }
        })
      });
    })
  })
})