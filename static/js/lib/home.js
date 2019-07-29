var home = {
    config: {
        url: ''
    },

    //ajax请求刷新页面（data为template的值）
    ajaxdata: function (data, option) {
        if (data == 1 || data == 9) {
            $.ajax({
                url: 'home',
                type: 'post',
                data: {
                    showtemplate: data
                },
                success: function (res) {
                    $('#chartLoader').children('#addchatrt').remove()
                    home.eachdata(res, option)
                }
            })
        } else {
            $.ajax({
                url: 'home',
                type: 'post',
                success: function (res) {
                    $('#chartLoader').children('#addchatrt').remove()
                    home.eachdata(res, option)
                }
            })
        }
    },

    //判断请求的template
    templatedata: function () {
        if ($('#totalChart').hasClass('actively')) {
            var data = 0
        } else if ($('#relaesChart').hasClass('actively')) {
            var data = 9
        } else if ($('#norelaesChart').hasClass('actively')) {
            var data = 1
        }
        return data
    },

    //统计总数，发布，未发布数据（data为整个数据）
    renddata: function (data) {
        $.ajax({
            url: 'home',
            type: 'post',
            success: function (res) {
                var release = 0
                $.each(res, function (i, val) {
                    if (val.template == '9') {
                        release = release + 1
                    }
                })
                $('#chartCount').text(data.length)
                $('#release').text(release)
                $('#norelease').text(data.length - release)
            }
        })
    },

    //循环渲染div
    eachdata: function (data, option) {
        $.each(data, function (i, chart) {
            $('<div class="col-md-4" id="addchatrt">')
                .append($('<div class="box_list">')
                    .append($('<div class="box_backgruond">')
                        .append($('<img />').attr('src', (chart['bg_img'] || '/static/images/img/beij.png')).attr('title', chart['name'])))
                    .append($('<p class="button_bottom">')
                        .append($('<span class="modify_name"  style=" color: #fff;font-size:17px;display: block;" onclick="modify_name(this)">').append($('<i class="iconfont icon-icon_bianji" ></i>'))
                            .append($('<span>').html(chart['name'])))
                        .append($('<span>').append(chart['template'] == '9' ? $('<i class="iconfont icon-icon-bang" style="color: #144EA4" ></i>') : $('<i class="iconfont icon-icon-bang" ></i>'))
                            .append(chart['template'] == '9' ? $('<span style=" cursor: pointer; color: #144EA4" class="has_release">').html("已发布") : $('<span>').html("未发布"))))
                    .append($('<div class="hover_background">')
                        .append($('<div class="edit_show">')
                            .append($('<p><h href="javascript:;"><span>编辑可视化</span></p>').data('id', chart['name']).on('click', function (e) {
                                // 编辑事件
                                location.href = option.editUrl + '?name=' + $(this).data('id');
                            }))
                            .append($('<p>')
                                .append($('<h href="javascript:;" class="copy_name" onclick="copy_name(this)">')
                                //复制事件
                                    .append($(' <i class="iconfont view_cop icon-fuzhi" dataid="' + chart['name'] + '"></i>').data('id', chart['name'])))
                                .append($('<h href="javascript:;" >')
                                    .append($(' <i class="iconfont icon-Home_icon_yanjing" dataid="' + chart['name'] + '"></i>').data('id', chart['name']).on('click', function (e) {
                                        // 预览事件
                                        window.open(option.viewUrl + '?name=' + $(this).data('id'))
                                    })))
                                .append($('<h href="javascript:;" class="copy_name" onclick="render_data(this)">')
                                //发布事件
                                    .append($(' <i class="iconfont view_cop icon-icon_fabu"  dataid="' + chart['name'] + '"></i>').data('id', chart['name'])))
                                .append($('<h href="javascript:;">')
                                //删除事件
                                    .append($(' <i class="iconfont view_cop icon-icon-shanchu" dataid="' + chart['name'] + '"></i>').data('id', chart['name']).on('click', function (e) {
                                        var name = $(this).data('id')
                                        var row = $(this)
                                        layer.confirm('确认删除，删除之后将不能恢复！', {title: '温馨提示'}, function (l, index) {
                                            $.ajax({
                                                url: '/del_show',
                                                data: {name: name},
                                                type: 'post',
                                                success: function (res) {
                                                    var option = $.extend({}, this.config, option)
                                                    var ajaxdata = home.templatedata()
                                                    if (res === '删除成功') {
                                                        layer.closeAll()
                                                        row.parents('.mar_bot').remove();
                                                        layer.msg('删除成功', $.extend({
                                                            offset: '15px'
                                                            , icon: 6
                                                            , time: 1000,
                                                            shade: 0.1,
                                                        }))
                                                        home.ajaxdata(ajaxdata, option)
                                                    } else {
                                                        layer.closeAll()
                                                        layer.msg('删除失败，请联系管理员', $.extend({
                                                            icon: 5,
                                                            time: 0,
                                                            anim: 6,
                                                            offset: '15px',
                                                            shade: 0.1,
                                                            shadeClose: true
                                                        }, ''));
                                                    }

                                                }
                                            })

                                        })
                                        return false
                                    })))
                            ))))
                .appendTo($('#chartLoader'))
        })
    },

    //渲染div
    addChart: function (option) {
        var option = $.extend({}, this.config, option)
        $.ajax({
            url: option.url,
            data: option.data || {},
            type: option.type || 'get',
            dataType: option.dataType || 'json',
            success: function (data) {
                home.eachdata(data, option)
                home.renddata(data)
            },
            error: function (error) {
            }
        });
    },

    //将div加载到页面
    buildECharts: function (option) {
        /**
         * 加载
         */
        home.addChart(option)
        /**
         * 发布标签的点击事件
         */
        $(document).on('click', '.has_release', function () {
            var name = $(this).data('name')
            layer.confirm('是否需要取消发布', {
                time: 20000, //20s后自动关闭
                title: false,
                btn: ['确认', '取消']
            }, function () {
                $.ajax({
                    url: 'update_show',
                    type: 'post',
                    data: {
                        name: name,
                        update: JSON.stringify({template: 0})
                    },
                    success: function (res) {
                        layer.closeAll()
                        $('#chartLoader').children('#addchatrt').remove()
                        home.addChart(option)
                    }
                });
            })
        })
        /**
         * 总数的点击事件
         */
        $('#totalChart').on('click', function () {
            $.ajax({
                url: 'home',
                type: 'post',
                success: function (data) {
                    $('#totalChart').css('color', '#fff').addClass('actively');
                    $('#relaesChart').css('color', '#8D8E95').removeClass('actively');
                    $('#norelaesChart').css('color', '#8D8E95').removeClass('actively');
                    $('#chartLoader').children('#addchatrt').remove()
                    home.addChart(option)
                }
            })
        })
        /**
         * 发布的点击事件
         */
        $('#relaesChart').on('click', function () {
            $.ajax({
                url: 'home',
                type: 'post',
                data: {
                    showtemplate: '9'
                },
                success: function (data) {
                    $('#totalChart').css('color', '#8D8E95').removeClass('actively');
                    $('#relaesChart').css('color', '#fff').addClass('actively');
                    $('#norelaesChart').css('color', '#8D8E95').removeClass('actively');
                    $('#chartLoader').children('#addchatrt').remove()
                    home.eachdata(data, option)
                }
            })
        })
        /**
         * 未发布的点击事件
         */
        $('#norelaesChart').on('click', function () {
            $.ajax({
                url: 'home',
                type: 'post',
                data: {
                    showtemplate: '1'
                },
                success: function (data) {
                    $('#totalChart').css('color', '#8D8E95').removeClass('actively');
                    $('#relaesChart').css('color', '#8D8E95').removeClass('actively');
                    $('#norelaesChart').css('color', '#fff').addClass('actively');
                    $('#chartLoader').children('#addchatrt').remove()
                    home.eachdata(data, option)
                }
            })
        })
    }
}