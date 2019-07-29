var render = {
    /**
     * 渲染组件
     **/
    //侧边栏
    renderComponentWithMenu: function (chat, data, isRenderForm, loader) {
        var chart_p, chart_pc, drag_p, toolBar, chartLine, id;
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart echarthover">').css({
                'width': chat['w'] - 2,
                'height': chat['h']
            }).append($('<div class="nav-main" ><div class="nav-box">')),
                chart.pushCache(chat),
                chart_pc = chart_p.children().children(),
                chart_pc.append('<div class="nav"><ul class="nav-ul">'),
                chart_pc.append('<div class="nav-slide">'),
                chart_pc.append('<div class="nav-slide1">'),
                //一级菜单
                $.each(chat.datavalue, function (i, val) {
                    //如果有跳转
                    var li = $('<li class="' + val.name + '"><a href="' + val.url + '" class="home"><span>' + val.name + '</span></a>')
                    chart_pc.children('.nav').children('.nav-ul').append(li)
                    var div = $('<div class="nav-slide-o" style="display: none;">')
                    var ul = $('<ul>')
                    chart_pc.children('.nav-slide').append(div).attr('run', val.run ? val.run : '')
                    chart_pc.children('.nav-slide').children().append(ul)
                    //一级菜单选中状态
                    if (val.name == chart.config.showName) {
                        chart_pc.children('.nav').children('.nav-ul').children('.' + val.name + '').css("background-color", "#629feb");
                    }
                    //二级菜单
                    if (val.children) {
                        $(div).addClass('hasChildren')
                        $.each(val.children, function (i, valu) {
                                //判断跳转还是弹窗
                                if (valu.run) {
                                    // chart_pc.children('.nav-slide').on('click', clickEvent.clickEvent)
                                    $(ul).append($('<li class=" ' + valu.name + ' "><a><span>' + valu.name + '</span></a>').on('click', clickEvent.clickEvent).data('data', valu))
                                } else {
                                    $(ul).append($('<li class=" ' + valu.name + ' "><a href="' + valu.url + '"><span>' + valu.name + '</span></a>'))
                                }
                                //二级菜单选中状态
                                if (valu.name == chart.config.showName) {
                                    chart_pc.children('.nav').children('.nav-ul').children('.' + val.name + '').css("background-color", "#629feb");
                                    chart_pc.children('.nav-slide').children('.nav-slide-o').children('ul').children('.' + valu.name + '').css("background-color", "#629feb");
                                }

                                //三级菜单
                                var divth = $('<div class="nav-slide1-o" style="display: none;">')
                                chart_pc.children('.nav-slide1').append(divth)
                                if (valu.children) {
                                    //如果有跳转
                                    $.each(valu.children, function (i, value) {
                                        if (value.run) {
                                            $(divth).append($('<li class=" ' + value.name + ' "><a><span>' + value.name + '</span></a>').on('click', clickEvent.clickEvent).data('data', value)).addClass('hasChildren')
                                        } else {
                                            $(divth).append($('<li class=" \'+ value.name + \' "><a href="' + value.url + '"><span>' + value.name + '</span></a>')).addClass('hasChildren')
                                        }
                                        //三级菜单选中状态
                                        if (value.name == chart.config.showName) {
                                            chart_pc.children('.nav').children('.nav-ul').children('.' + val.name + '').css("background-color", "blue");
                                            chart_pc.children('.nav-slide').children('.nav-slide-o').children('ul').children('.' + valu.name + '').css("background-color", "#629feb");
                                            chart_pc.children('.nav-slide1').children('.nav-slide1-o').children('ul').children('.' + value.name + '').css("background-color", "#629feb");
                                        }
                                    })
                                }
                            }
                        )
                    }
                }),
                $(function () {
                    var thisTime;
                    var chart_li = chart_pc.children('.nav').children('.nav-ul').children('li')
                    var chart_o = chart_pc.children('.nav-slide')
                    var chart_lio = chart_pc.children('.nav-slide').children('.nav-slide-o').children('ul').children('li')
                    var chart_po = chart_pc.children('.nav-slide1')
                    //一级菜单鼠标事件
                    chart_li.mouseleave(function (even) {
                        thisTime = setTimeout(thisMouseOut, 1000);
                    })
                    //一级菜单鼠标hover事件
                    chart_li.mouseenter(function () {
                        clearTimeout(thisTime);
                        var thisUB = chart_li.index($(this));
                        if ($.trim(chart_o.children('.nav-slide-o').eq(thisUB).html()) != "" && chart_o.children('.nav-slide-o').eq(thisUB).hasClass('hasChildren')) {
                            chart_o.addClass('hover');
                            chart_o.children('.nav-slide-o').hide();
                            chart_o.children('.nav-slide-o').eq(thisUB).show();
                        } else {
                            chart_o.removeClass('hover');
                        }
                    })

                    //一级菜单鼠标离开事件
                    function thisMouseOut() {
                        chart_o.removeClass('hover');//二级菜单去除属性hover
                        chart_po.removeClass('hover');//三级菜单去除属性hover
                    }

                    //二级菜单鼠标事件
                    chart_lio.mouseenter(function () {
                        clearTimeout(thisTime);
                        var thisUB = chart_lio.index($(this));
                        if ($.trim(chart_po.children('.nav-slide1-o').eq(thisUB).html()) != "" && chart_po.children('.nav-slide1-o').eq(thisUB).hasClass('hasChildren')) {
                            chart_po.addClass('hover');
                            chart_po.children('.nav-slide1-o').hide();
                            chart_po.children('.nav-slide1-o').eq(thisUB).show();
                        } else {
                            chart_po.removeClass('hover');
                        }
                        chart_lio.addClass('hover');
                    })
                    //二级菜单鼠标离开事件
                    chart_lio.mouseleave(function () {
                        thisTime = setTimeout(thisMouseOut, 1000);
                        chart_po.removeClass('hover');
                    })
                    //三级级菜单鼠标事件
                    chart_po.mouseenter(function () {
                        clearTimeout(thisTime);
                        chart_po.addClass('hover');
                    })
                    //三级级菜单离开鼠标事件
                    chart_po.mouseleave(function () {
                        chart_po.removeClass('hover');
                    })
                }),
                chart_p.children('.nav-main').hide(),
                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p).append($('<div class="drag-coor">'))
                    .appendTo(loader ? loader : chart.config.chartLoader),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),
                    chart_p.data('type', chat['charttype']),
                    drag_p.data('echart', chart_p)),
                drag_p.setHover(chat),
            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default'),
                chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
            ),
                chart.config.charts[chat['name']] = chart_p
        );
        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
        request.serialize(chat)
        chart_p.setOption(data, chat);
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        return chart_p
    },
    //炫酷旋转3D
    // renderComponentWithRotate3d: function (chat, data, isRenderForm, loader) {
    //     var w = parseFloat(chat['w']) + 100;
    //     var h = parseFloat(chat['h']) + 100
    //     // console.log(w, h)
    //     if (!chat.apidatavalue) {
    //         var rotate = chat.datavalue
    //     } else {
    //         var rotate = chat.apidatavalue
    //     }
    //     var chart_p, chart_pc, drag_p, toolBar, chartLine, id;
    //     !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart echarthover">').css({
    //             'width': w,
    //             'height': h
    //         }).append($('<div id="carousel">')),
    //             chart.pushCache(chat),
    //             chart_pc = chart_p.children(),
    //             $.each(rotate, function (i, val) {
    //                 chart_pc.append('<div id="a' + i + '" style="min-width: 100px"><a><img id="' + i + '"  style="width:150%;display:block;height:auto;" src="/static/images/icons/circle' + i + '.png"></a></div>')
    //             }),
    //
    //             drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
    //                 .css('width', w).css('height', h).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
    //                 .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
    //                 .data('chartName', chat['name']).append(chart_p).append($('<div class="drag-coor">'))
    //                 .appendTo(loader ? loader : chart.config.chartLoader),
    //             drag_p.rotate3d(chat, chart),
    //         chart.config.option.editSwitch && (
    //             toolBar = chart.config.toolBar.clone(),
    //                 chartLine = chart.config.chartLine.clone(),
    //                 toolBar.children().each(function () {
    //                     $(this).data('chartName', chat['name'])
    //                 }),
    //                 drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
    //                 drag_p.addClickEvent(),
    //                 drag_p.addHoverEvent(),
    //                 drag_p.draggable(),
    //                 chart_p.data('type', chat['charttype']),
    //                 drag_p.data('echart', chart_p)
    //         ),
    //         chart.config.option.editSwitch || (
    //             drag_p.css('cursor', 'default'),
    //                 drag_p.removeClass('drag-box-hover'),
    //                 chart_p.css('cursor', 'default'),
    //             chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
    //         ),
    //             chart.config.charts[chat['name']] = chart_p
    //     )
    //     ;
    //     chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
    //     request.serialize(chat)
    //     chart_p.setOption(data, chat);
    //     isRenderForm && (chart.rendFormByChart(chat, drag_p))
    //     return chart_p
    // },
    //旋转木马
    renderComponentWithMerrygoround: function (chat, data, isRenderForm, loader) {
        // console.log(chart)
        var options = chat.data.options
        if (!chat.apidatavalue) {
            var rotate = chat.datavalue
        } else {
            var rotate = chat.apidatavalue
        }
        var chart_p, chart_pc, drag_p, toolBar, chartLine, id;
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart echarthover">').css({
                'width': chat['w'] - 2,
                'height': chat['h']
            }).append($('<div class="wrap"><div id="showcase" class="noselect" ></div></div>')),
                chart.pushCache(chat),
                chart_pc = chart_p.children().children('#showcase'),
                $.each(rotate, function (i, val) {
                    chart_pc.append('<img class="cloud9-item" src="/static/images/icons/circle' + i + '.png" alt=' + i + '></div></div>')
                }),

                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p).append($('<div class="drag-coor">'))
                    .appendTo(loader ? loader : chart.config.chartLoader),
                // console.log(chat.data.options),
                $(function () {
                    drag_p.Cloud9Carousel(chat.data.options)
                    function rendered(carousel) {
                        var ex = carousel.nearestItem().element.alt
                        if ($('.carouse-navs').hasClass('carouse-view-nav')) {
                            $('.carouse-navs').children().children().eq(ex).trigger('click');
                        }
                    }
                }),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),
                    chart_p.data('type', chat['charttype']),
                    drag_p.data('echart', chart_p)
            ),
            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default'),
                chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
            ),
                chart.config.charts[chat['name']] = chart_p
        )
        ;
        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
        request.serialize(chat)
        chart_p.setOption(data, chat);
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        return chart_p
    },
    //边框
    renderComponentWithBorder: function (chat, data, isRenderForm, loader) {
        chart.renderComponent(chat, data, isRenderForm, loader)
    },
    //装饰
    renderComponentWithDecorate: function (chat, data, isRenderForm, loader) {
        chart.renderComponent(chat, data, isRenderForm, loader)
    },
    //表格
    renderComponentWithTable: function (chat, data, isRenderForm, loader) {
        // console.log(chat)
        var table = chart.renderComponent(chat, data, isRenderForm, loader)

    },
    initTable: function (chat) {
        chat.tableOption = chat.data.tableOption || {};
        chat.tableOption.data = chat.data.tableData || [];
        chat.tableOption.columns = [chat.data.columnOption];
    },
    //实例
    renderComponentWithObj: function (chat, data, isRenderForm, loader) {
        var chart_p, drag_p, toolBar, chartLine, id;
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart">')
                .css({
                    'width': chat['w'] - 2,
                    'height': chat['h']
                }).append($('<div class="image">').css({
                    'height': '80%',
                    width: '100%',
                    "margin": "0 auto"
                }).data('type', chat['charttype'])).append(
                    $('<div class="text">').css({width: '100%'}).data('type', chat['charttype'])
                ),
                chart.pushCache(chat),

                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p).append($('<div class="drag-coor">'))
                    .appendTo(loader ? loader : chart.config.chartLoader),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),
                    // chart_p.domready(chart_p, chat)
                    chart_p.data('type', chat['charttype']),
                    drag_p.data('echart', chart_p)
            ),
            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default'),
                chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
            ),
                chart.config.charts[chat['name']] = chart_p
        )
        ;
        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
        request.serialize(chat)
        chart_p.setOption(data, chat);
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        return chart_p
    },
    //3D机房
    renderComponentWith3D: function (chat, data, isRenderForm, loader) {
        var chart_p, drag_p, toolBar, chartLine, id;
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart">')
                .css({
                    'width': chat['w'] - 2,
                    'height': chat['h'],
                }).data('type', chat['charttype']),
                chart.pushCache(chat),
                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p)
                    .appendTo(loader ? loader : chart.config.chartLoader),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),
                    chart_p.data('type', chat['charttype']),
                    drag_p.data('echart', chart_p)),
            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default')
            ),
                chart.config.charts[chat['name']] = chart_p,
            chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
        );
        chart_p.event3D(chart_p, chat),
        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
        request.serialize(chat)
        chart_p.setOption(data, chat);
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        return chart_p
    },
    //svg渲染
    renderComponentWithSvg: function (chat, data, isRenderForm, loader) {
        var chart_p, drag_p, toolBar, chartLine, id;
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart">')
                .css({
                    'width': chat['w'] - 2,
                    'height': chat['h'],

                }).data('type', chat['charttype']),
                chart.pushCache(chat),

                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p)
                    .appendTo(loader ? loader : chart.config.chartLoader),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),

                    chart_p.data('type', chat['charttype']),
                    drag_p.data('echart', chart_p)),
            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default')
            ),
                chart.config.charts[chat['name']] = chart_p,
                utils.setSvg(chat, chart_p, function () {
                    utils.hoverSvgByChat(chat);
                    utils.clickSvgByChat(chat);
                }),
            chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
        );
        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
        request.serialize(chat)
        chart_p.setOption(data, chat);
        // console.log(drag_p.data())
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        return chart_p
    },
    //标题渲染
    renderComponentWithTitle: function (chat, data, isRenderForm, loader) {
        var title = chart.renderComponent(chat, data, isRenderForm, loader);
        // console.log(chat)
        if (chat.data.clickOption) {
            chart.config.option.editSwitch || (title.setClick(chat), title.css({cursor: 'pointer'}));
        }
    },
    //模具渲染
    renderComponentWithModel: function (chat, data, isRenderForm, loader) {
        var yangshi = data.css.theme
        var index = data.optionx.sequence
        var model = chart.renderComponent(chat, data, isRenderForm, loader, yangshi, index)

    },
    //跑马灯渲染
    renderComponentWithMarquee: function (chat, data, isRenderForm, loader) {
        var marque = chart.renderComponent(chat, data, isRenderForm, loader, 'marquee')
        // console.log(data)
        marque.marquee(data['marqueeOption'] || {})
    },
    //时间渲染
    renderComponentWithTimer: function (chat, data, isRenderForm, loader) {
        var timerQ = chart.renderComponent(chat, data, isRenderForm, loader)
        timerQ.QTimer(data['timerOption'] || {})
    },
    //数字翻牌器
    renderComponentWithCountUp: function (chat, data, isRenderForm, loader) {
        var countUpQ = chart.renderComponent(chat, data, isRenderForm, loader)
        if (data['countUpOption']['endVal'] == null) {
            countUpQ.countup(data['countUpOption'] ? (data['countUpOption']['endVal'] = data['dataNumber'], data['countUpOption']) : {endVal: data['dataNumber']});
            // data['countUpOption']['startVal']=data['countUpOption']['endVal']
        } else {
            data['countUpOption']['startVal'] = data['countUpOption']['endVal']
            countUpQ.countup(data['countUpOption'] ? (data['countUpOption']['endVal'] = data['dataNumber'], data['countUpOption']) : {endVal: data['dataNumber']});
        }
    },
    //进度条
    renderComponentWithProgress: function (chat, data, isRenderForm, loader) {
        var pQ = chart.renderComponent(chat, data, isRenderForm, loader)
        // console.log(data['progressOption'])
        pQ.progress(data['progressOption'])
    },
    //滚动列表
    renderComponentWithListview: function (chat, data, isRenderForm, loader) {
        var listviewQ = chart.renderComponent(chat, data, isRenderForm, loader);
        listviewQ.html(data.listviewValue);
        if (!listviewQ.data('tableSlider'))
            listviewQ.tableSlider(data['listviewOption']);
    },
    // 加载轮播
    renderComponentWithCarousel: function (chat, data, isRenderForm, loader) {
        var carouse = chart.renderComponent(chat, data, isRenderForm, loader);
        // 初始化轮播
        carousel.init(chat, carouse, 'view')
    },
    //自定义热力图
    renderComponentWithDefineheatmap: function (chat, data, isRenderForm, loader) {
        var chart_p, drag_p, toolBar, chartLine, id, heatmapInstance;
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime() , chart_p = $('<div id="' + id + '" class="echart">')
                .css({
                    'width': chat['w'] - 2,
                    'height': chat['h']
                }).append($('<div class="image">').css({
                    'height': '100%',
                    width: '100%',
                    "margin": "0 auto",
                    "z-index": '-100'
                }).data('type', chat['charttype'])),
                chart.pushCache(chat),
                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p).append($('<div class="drag-coor">'))
                    .appendTo(loader ? loader : chart.config.chartLoader),
                heatmapInstance = h337.create($.extend({}, {
                        container: chart_p[0],
                    }, chat['data']['heatmapConfig'])
                ),
                chart_p.data('heatmap', heatmapInstance),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),
                    chart_p.data('type', chat['charttype']),
                    drag_p.data('echart', chart_p)),

            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default'),
                chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
            ),
                chart.config.charts[chat['name']] = chart_p
        );
        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);
        request.serialize(chat)
        chart_p.setOption(data, chat);
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        return chart_p
    },
}