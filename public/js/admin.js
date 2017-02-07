/**
 * list页 删除功能
 * @type {依赖 Jquery}
 */
$(function() {
  $('.del').click(function(e) {
    // 获取节点及ID
    var target = $(e.target)
    var id = target.data('id')
    var tr = $('.item-id-' + id)
    // 打印节点及数据
    console.log(target,id,tr)

    // 异步发送删除数据的请求
    $.ajax({
      type: 'DELETE',
      url: '/admin/list?id=' + id
    })
    .done(function(results) {
      if (results.success === 1) {
        if (tr.length > 0) {
          tr.remove()
        }
      }
    })
  })
})
