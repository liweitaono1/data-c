var template = {
    config: {
        url: ''
    },
    buildECharts: function (option) {
        var option = $.extend({}, this.config, option)
        // console.log(option.url)
        $.ajax({
            url: option.url,
            data: option.data || {},
            type: option.type || 'get',
            dataType: option.dataType || 'json',
            success: function (data) {
                $.each(data, function (i, chart) {
                    // console.log(chart)
                    $('<div class="col-md-4" id="addchatrt">')
                        .append($('<div class="box_list">')
                            .append($('<div class="box_backgruond">')
                                .append($('<img />').attr('src', (chart['bg_img'] || '/static/images/img/beij.png')).attr('title', chart['name'])))
                            .append($('<div style="position: absolute;bottom: 0;width: 100%">')
                                .append($('<p style="text-align: center">')
                                    .append($('<span class=""  style="width: 100%;line-height:30px;color: #fff;font-size:17px;display: block;" onclick="modify_name(this)">')
                                        .append($('<span>').html(chart['name'])))
                                    .append($('<span>'))))
                            .append($('<div class="hover_background">')
                                .append($('<div class="edit_show">')
                                    .append($('<p><h href="javascript:;"><span>经典案例</span></p>').data('id', chart['name']))
                                    .append($('<p>')
                                        .append($('<h href="javascript:;" class="copy_name" onclick="copy_name(this)">')
                                        //复制事件
                                            .append($(' <i class="iconfont  icon-fuzhi view_cop " dataid="' + chart['name'] + '"></i>').data('id', chart['name'])))
                                        .append($('<h href="javascript:;" >')
                                            .append($(' <i class="iconfont icon-Home_icon_yanjing" dataid="' + chart['name'] + '"></i>').data('id', chart['name']).on('click', function (e) {
                                                // 预览事件
                                                window.open(option.viewUrl + '?name=' + $(this).data('id'))
                                            })))
                                        .append($('<h href="javascript:;" class="copy_name" onclick="render_data(this)">')
                                            //发布事件
                                        )
                                    ))))
                        .appendTo($('#chartLoader'))
                })
                $('#chartCount').text(data.length)

            },
            error: function (error) {

            }
        })
    }


}

// home.buildECharts({url: })