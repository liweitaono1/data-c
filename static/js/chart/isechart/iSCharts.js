/**
 * 首次加载百度ECharts
 * @param chat
 * @param data
 * @param isRenderForm
 */
var isechart = function (chat, data, isRenderForm, datavalueby, loader) {
    //动态加载js
    function loadScript(url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    chart.setChartTheme('chalk', function (edit) {
            var chart_p, myChart, drag_p, toolBar, chartLine, id;
            !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime(),
                    chart_p = $('<div id="' + id + '" class="echart">')
                        .css('width', chat['w']).css('height', chat['h']),
                    chart.pushCache(chat),
                    chart_p.data('chart', chat),
                    myChart = echarts.init(chart_p[0], 'chalk'),
                    chart.config.charts[chat['name']] = myChart,
                    drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                        .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                        .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                        .data('chartName', chat['name']).append(chart_p)
                        .appendTo(loader ? loader : chart.config.chartLoader),
                    drag_p.data('echart', myChart),
                    // 编辑操作
                edit && (
                    toolBar = chart.config.toolBar.clone(),
                        chartLine = chart.config.chartLine.clone(),
                        toolBar.children().each(function () {
                            $(this).data('chartName', chat['name'])
                        }),
                        drag_p.prepend(chartLine).prepend(toolBar).append($('<div class="drag-coor">')),
                        // drag_p.addClickEvent(),
                        drag_p.addHoverEvent(),
                        drag_p.draggable(),
                        drag_p.keything()
                ),
                edit || (
                    drag_p.css('cursor', 'default'),
                        drag_p.removeClass('drag-box-hover'),
                        chart_p.css('cursor', 'default')
                ),
                chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
            );
            chart.config.charts[chat['name']] && (myChart = chart.config.charts[chat['name']]);
            myChart.clear();
            if (chat.data.name) {
                loadScript('/static/js/chart/echart/' + chat.data.name + '.js', function () {
                    refreshExtraOption(chat, data, datavalueby, myChart)
                });
            } else {
                refreshExtraOption(chat, data, datavalueby, myChart)
            }
            if (utils.isMap(chat)) {
                chart.setRound({option: chat.data, myChart: myChart, datavalue: datavalueby});
                chart.setMapHover({option: chat.data, myChart: myChart, datavalue: datavalueby});
            }
            //判断是否是bmp地图,初始状态
            if (data.setInterval === true) {
                var datavalue = chat.datavalue;
                data.series[2].data = eval(data.series[2].data);
                //将series2中的值赋值给seris0
                var place2 = data.series[2].data
                var place0 = data.series[0].data
                if (place0 != []) {
                    place2[0].value.pop()
                    place0[0].coords[0] = place2[0].value;
                    place2[1].value.pop()
                    place0[1].coords[0] = place2[1].value;
                    place2[2].value.pop()
                    place0[2].coords[0] = place2[2].value;
                }
                myChart.setOption(data, true);
                if (data.bmap) {
                    // 获取百度地图实例，使用百度地图自带的控件
                    var bmap = myChart.getModel().getComponent('bmap').getBMap();
                    //bmap控制事件
                    // bmap.addControl(new BMap.MapTypeControl());
                    bmap.disableDragging();//禁止拖拽事件
                    bmap.removeContextMenu();//禁止右击菜单
                    //bmap增加右击事件
                    bmap.addEventListener('rightclick', function () {
                        $(chart.config.chartDom).children('.toolbar').show();
                    })
                }
            } else {
                myChart.setOption(data, true);
            }

            isRenderForm && (chart.rendFormByChart(chat, drag_p));
            //判断bmp地图，增加定时
            if (data.setInterval === true) {
                setInterval(() => {
                    var option = myChart.getOption()
                    option.series[2].data = getSeries(chat['datavalue'])
                    //将series2中的值赋值给seris0
                    var place2 = option.series[2].data
                    var place0 = option.series[0].data
                    //舍去series2素组中的随后一个数据
                    if (place0 != []) {
                        place2[0].value.pop()
                        //将随机获得的数据赋值给lines的data
                        place0[0].coords[0] = place2[0].value;
                        place2[1].value.pop()
                        place0[1].coords[0] = place2[1].value;
                        place2[2].value.pop()
                        place0[2].coords[0] = place2[2].value;
                    }
                    myChart.setOption({
                        series: [option.series[0], option.series[1], option.series[2]]
                    }, false);
                    if (data.bmap) {
                        var bmap = myChart.getModel().getComponent('bmap').getBMap();
                        bmap.disableDragging()
                        bmap.removeContextMenu();//禁止右击菜单
                        //bmap增加右击事件
                        bmap.addEventListener('rightclick', function () {
                            $(chart.config.chartDom).children('.toolbar').show();
                        })
                    }
                }, 6000);
            }
            //判断是否为饼图，是则加载点击事件
            if (chat && data.click == true) {
                drag_p.data('echart').on('dblclick', clickEvent.Clicktwo);
            }
            if (chat && data.run == true) {
                drag_p.data('echart').on('dblclick', clickEvent.Clickrun);
            }
            if (chat.data.defaultOption && chat.data.defaultOption.highlight && $.isPlainObject(chat.data.defaultOption.highlight)) {
                var highOption = $.extend({}, {
                    type: 'highlight'
                }, chat.data.defaultOption.highlight);
                myChart.dispatchAction(highOption);
            }
        }
    )

}