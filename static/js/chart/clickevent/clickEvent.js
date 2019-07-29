var clickEvent = {
    //菜单栏弹窗事件

    clickEvent: function (event) {
        var data1 = $(this).data('data');
        console.log(data1)
        $.ajax({
            url: '/get_shows',
            type: 'post',
            data: {name: data1.run, op: 'edit'},
            success: function (data) {
                // console.log(data)
                w1 = parseFloat(data1.size) / 100  //宽的比列
                bi = data.show.screen.height / data.show.screen.width  //宽高比
                h1 = parseInt(data.show.screen.height); //弹出层的高
                h = h1 * w1//弹出层实际宽度
                w = h / bi
                parent.layer.closeAll()
                parent.layer.open({
                    type: 2,
                    title: false,
                    closeBtn: 0,
                    shadeClose: true,
                    shade: 0.9,
                    scrollbar: false,
                    area: [w + 'px', h + 'px'],
                    content: 'get_show_view?name=' + data1.run + ''
                });
            }
        })
    },
    //饼图点击事件
    Clicktwo: function (pa) {
        //判断数据中是否有address数据，有就跳转到address，没有取pa.name
        var address = []
        if (pa.data && pa.data.address) {
            address = pa.data.address
        } else {
            address = pa.name
        }
        //取弹出层的showname的宽高比例
        $.ajax({
            url: '/get_shows',
            type: 'post',
            data: {name: address, op: 'edit'},
            success: function (data) {
                //判断是否有点击事件
                if (chart.config.clickChart == null) {
                    w1 = 0.95
                } else if (chart.config.clickChart.data.clickSetting) {
                    w1 = parseFloat(chart.config.clickChart.data.clickSetting.clickname) / 100  //宽的比列
                } else
                    console.warn('请配置点击事件')
                //判断是否有弹窗内容
                if (data.show == null) {
                    console.warn('弹出框不存在，请新建')
                } else {
                    bi = data.show.screen.height / data.show.screen.width  //宽高比
                    h1 = parseInt(data.show.screen.height); //弹出层的高
                    h = h1 * w1//弹出层实际宽度
                    w = h / bi
                    parent.layer.closeAll()
                    parent.layer.open({
                        type: 2,
                        title: false,
                        closeBtn: 0,
                        shadeClose: true,
                        shade: 0.8,
                        scrollbar: false,
                        area: [w + 'px', h + 'px'],
                        content: '/get_show_view?name=' + address + ''
                    });
                    return false
                }
            }
        })
    },
//饼图跳转事件
    Clickrun: function (pa) {
        //判断数据中是否有address数据，有就跳转到address，没有取pa.name
        var address = []
        if (pa.data && pa.data.address) {
            address = pa.data.address
        } else {
            address = pa.name
        }
        window.open('get_show_view?name=' + address + '');
    },
//图标点击事件的方法
    clickone: function () {
        var chartDom = $(this), $carouse = chartDom.parents('.echart'),
            carouseName = $carouse.parents('.drag-box').data('chartName'), pageIndex = $carouse.data('pageIndex'),
            chartName = $(this).data('chartName');
        // console.log(this);
        // $(this).children('.navigator-line').hide()
        $(this).parent().find('.drag-box').removeClass('drag-box-hovered');
        $(this).addClass('drag-box-hovered');
        if (carousel.eidtSwitch) {
            $.ajax({
                url: '/get_carouse_charts',
                data: {
                    'showname': chart.config.showName,
                    carouse_name: carouseName,
                    chartname: chartName,
                    op: 'edit',
                    page_index: pageIndex
                },
                type: 'post',
                success: function (data) {
                    // console.log(data)
                    var mFunction = chartDom.find('.echart').data('mutualFunction')
                    typeof mFunction === 'function' && mFunction(data['charts'], chartDom)
                    chart.rendFormByChart(data['charts'], chartDom)
                }
            });
        } else {
            $.ajax({
                url: '/get_sys_charts',
                data: {'showname': chart.config.showName, chartname: chartName, op: 'edit'},
                type: 'post',
                success: function (data) {
                    var mFunction = chartDom.find('.echart').data('mutualFunction')
                    typeof mFunction === 'function' && mFunction(data['charts'], chartDom)
                    // console.log(data['charts'])
                    var reldata
                    if (data['charts'].sourcetype == '1') {
                        reldata = data['charts'].datavalue
                    } else if (data['charts'].sourcetype == '2') {
                        reldata = data['charts'].apidatavalue
                    } else if (data['charts'].sourcetype == 4) {
                        if (data['charts']['database'] && data['charts']['sql']) {
                            $.ajax({
                                url: 'datasource_execute',
                                type: 'post',
                                data: {
                                    id: data['charts']['database'],
                                    sql: data['charts']['sql'],
                                    datatype: data['charts']['datatype']
                                },
                                success: function (res) {
                                    if (res.status == 1) {
                                        console.warn(res.msg)
                                    } else {
                                        reldata = res
                                    }
                                }
                            })
                        }
                    }
                    //描述圆饼图特例
                    if (data['charts']['chartid'] == '106') {
                        data['charts']['data']['series']['0']['data'] = reldata
                    } else if (data['charts']['chartid'] == '210')
                    //渐变饼图特例
                    {
                        data['charts']['data']['series']['0']['data'] = reldata['0']
                        data['charts']['data']['series']['1']['data'] = reldata['1']
                    } else if (data['charts']['chartid'] == '202' || data['charts']['chartid'] == '400')
                    //气泡图与炫酷地图
                    {
                        data['charts']['data']['series']['0']['data'] = reldata
                    }
                    chart.rendFormByChart(data['charts'], chartDom)
                    // console.log(1111111111111111111111111)
                }
            });
        }
    }
}


/**
 * 跳转事件
 * @param chat
 */
$.fn.setClick = function (chat) {
    $(this).on('click', function () {
        if (chat['data'] && chat.data.clickOption && chat.data.clickOption.jumpType == 'proup') {
            $.ajax({
                url: '/get_shows',
                type: 'post',
                data: {name: chat.data.clickOption.url, op: 'edit'},
                success: function (data) {
                    w1 = parseFloat(chat.data.clickSetting.clickname) / 100  //宽的比列
                    bi = data.show.screen.height / data.show.screen.width  //宽高比
                    h1 = parseInt(data.show.screen.height); //弹出层的高
                    h = h1 * w1//弹出层实际宽度
                    w = h / bi
                    //弹出框阴影
                    if (chat.data.clickSetting.shadow) {
                        shadow = chat.data.clickSetting.shadow
                    } else {
                        shadow = 0.8
                    }
                    //弹出框位置
                    if (chat.data.clickSetting.clickposition == "null") {
                        postion = ['' + chat.data.clickSetting.w + 'px', '' + chat.data.clickSetting.h + 'px']
                    } else {
                        postion = chat.data.clickSetting.clickposition
                    }
                    if (chat['data']['clickOption']['url'].indexOf('http') > -1 && chat['data']['clickOption']['url'].indexOf('https') > -1) {
                        parent.layer.closeAll()
                        parent.layer.open({
                            type: 2,
                            title: false,
                            offset: postion,
                            closeBtn: 0,
                            shadeClose: true,
                            shade: parseFloat(shadow),
                            scrollbar: false,
                            area: [w + 'px', h + 'px'],
                            content: chat['data']['clickOption']['url']
                        });
                    } else {
                        parent.layer.closeAll()
                        parent.layer.open({
                            type: 2,
                            title: false,
                            offset: postion,
                            closeBtn: 0,
                            shadeClose: true,
                            shade: parseFloat(shadow),
                            scrollbar: false,
                            area: [w + 'px', h + 'px'],
                            content: 'get_show_view?name=' + chat['data']['clickOption']['url'] + ''
                        });
                    }
                }
            })
        }
        //返回跳转
        if (chat['data'] && chat.data.clickOption && chat.data.clickOption.jumpType == 'back') {
            parent.layer.closeAll()
        }
        if ($(this).data('mutualFunction') && typeof $(this).data('mutualFunction') === 'function') {
            $(this).css('cursor', 'pointer');
            $(this).data('mutualFunction')($(this).data('chart'), $(this).parent())
        }
        //跳转
        if (chat['data'] && chat['data']['clickOption'] && chat['data']['clickOption']['url']) {
            $(this).css('cursor', 'pointer');
            if (!chat['data']['clickOption']['jumpType']) {
                chat['data']['clickOption']['jumpType'] = 'self';
            }
            if (chat['data']['clickOption']['jumpType'] === 'self')
                if (chat['data']['clickOption']['url'].indexOf('http') > -1 || chat['data']['clickOption']['url'].indexOf('https') > -1) {
                    location.href = chat['data']['clickOption']['url'];
                } else {
                    location.href = 'get_show_view?name=' + chat['data']['clickOption']['url'] + '';
                }
            else if (chat['data']['clickOption']['jumpType'] === 'blank')
                if (chat['data']['clickOption']['url'].indexOf('http') > -1 || chat['data']['clickOption']['url'].indexOf('https') > -1) {
                    window.open(chat['data']['clickOption']['url']);
                } else {
                    window.open('get_show_view?name=' + chat['data']['clickOption']['url'] + '');
                }
            else
                return;
        }
        return false
    })
}


