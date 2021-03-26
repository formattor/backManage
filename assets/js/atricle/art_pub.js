$(function(){
  var layer=layui.layer
  var form=layui.form
  initCate()

  
  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 绑定选择封面按钮
  $('#btnChooseImage').on('click',function(){
    $('#coverFile').click()
  })

  // 监听coverfile的change事件
  $('#coverFile').on('change',function(e){
    // 获取到文件列表数组
    var files=e.target.files
    if(files.length===0){
      return
    }
    // 根据文件创建对应的url
    var newImgURL=URL.createObjectURL(files[0])
    // 为裁剪区重新设置图片
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })

  // 加载文章分类
  function initCate() {
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取文章分类失败')
        }
        // 模板引擎渲染下拉菜单
        var htmlStr=template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        // 调用form.render()渲染表单
        form.render()
      }
    })
  }

  // 定义文章发布状态
  var art_state='已发布'
  // 存为草稿
  $('#btnSave2').on('click',function(){
    art_state='草稿'
  })

  // 发布文章方法
  function publishArticle(fd){
    console.log(fd, '文章数据')
    $.ajax({
      method:'POST',
      url:'/my/article/add',
      data:fd,
      // 如果向服务器提交formdata必须要添加以下两个配置
      contentType:false,
      processData:false,
      success:function(res){
        if(res.status!==0){
          return layer.msg('发表文章失败')
        }
        console.log(fd,'发布文章成功')
        layer.msg('发布文章成功')
        location.href='/article/art_list.html'
      }
    })
  }

  // 监听表单提交事件
  $('#form-pub').on('submit',function(e){
    e.preventDefault();

    // 创建FormData对象
    var fd=new FormData($(this)[0])
    fd.append('state',art_state)

    // 将裁剪的封面转为文件
    $image
  .cropper('getCroppedCanvas', { 
    // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {       
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 图片文件追加到fd
      fd.append('cover_img',blob)
      // 臣妾做不到阿
      // fd.forEach(function(v,k){
      //   console.log(k,v);
      // })
      // console.log(fd,'未传参文章数据')
      // 发起ajax
      publishArticle(fd)
    })
  })

})