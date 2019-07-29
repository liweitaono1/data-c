/**
 * 刷新Echart
 * @param element
 */
var refreshExtraOption = function (chat, data, datavalueby, myChart) {
    //legend的后置属性selected
    if (chat && data && chat.selected) {
        var selected = {};
        $.each(data.series, function (i, val) {
            var datas = data.series[i].selected;
            var datasname = data.series[i].name;
            selected[datasname] = datas
        })
        data.legend.selected = selected
    }
    //动态加载各个图表的js
    if (chat && data && data.name) {
        var jsname = data.name
        eval(jsname + '(chat, data, datavalueby, myChart)');
    }

    //饼图labels小数位数格式化
    if (chat && chat.charttype == "pie") {
        if (chat.data.tooltip && chat.data.tooltip.xs) {
            chat.data.tooltip.formatter = ""
            chat.data.tooltip.formatter = (function (value) {
                if (chat.data.tooltip.percent == false) {
                    if (parseFloat(value.data) == 0) {
                        return parseFloat(value.data).toFixed(0);
                    } else
                        return value.name + ':' + '<br/>' + parseFloat(value.value).toFixed(chat.data.tooltip.xs) + chat.data.tooltip.dw + '(' + value.percent + '%)';
                } else {
                    if (parseFloat(value.data) == 0) {
                        return parseFloat(value.data).toFixed(0);
                    } else
                        return value.name + ':' + '<br/>' + parseFloat(value.value).toFixed(chat.data.tooltip.xs) + chat.data.tooltip.dw + '(' + value.percent + '%)';
                }
            })
        }
    }

    //柱状图label小数位数格式化
    if (chat && chat.charttype == "bar") {
        $.each(chat.data.series, function (i, val) {
            if (chat.data.series[i] && chat.data.series[i].xs) {
                //判断如果label数据格式中没有normal对象走
                if (!chat.data.series[i].label.normal) {
                    //labels判断是否有formatter，有就分割字符串，没有定义为undefined
                    if (chat.data.series[i].label && chat.data.series[i].label.formatter) {
                        var labelformatter = chat.data.series[i].label.formatter.split("}")[1]
                    } else {
                        labelformatter = undefined
                    }
                    //label小数位数
                    chat.data.series[i].label.formatter = (function (value) {
                        if (labelformatter == undefined) {
                            if (parseFloat(value.data) == 0) {
                                return parseFloat(value.data).toFixed(0);
                            } else
                                return parseFloat(value.data).toFixed(chat.data.series[i].xs);
                        } else {
                            if (parseFloat(value.data) == 0) {
                                return parseFloat(value.data).toFixed(0) + labelformatter;
                            } else
                                return parseFloat(value.data).toFixed(chat.data.series[i].xs) + labelformatter;
                        }
                    })
                } else {
                    //labels判断是否有formatter，有就分割字符串，没有定义为undefined
                    if (chat.data.series[i].label.normal && chat.data.series[i].label.normal.formatter) {
                        var labelformatter = chat.data.series[i].label.normal.formatter.split("}")[1]
                    } else {
                        labelformatter = undefined
                    }
                    //label小数位数
                    chat.data.series[i].label.normal.formatter = (function (value) {
                        if (labelformatter == undefined) {
                            if (parseFloat(value.data) == 0) {
                                return parseFloat(value.data).toFixed(0);
                            } else
                                return parseFloat(value.data).toFixed(chat.data.series[i].xs);
                        } else {
                            if (parseFloat(value.data) == 0) {
                                return parseFloat(value.data).toFixed(0) + labelformatter;
                            } else
                                return parseFloat(value.data).toFixed(chat.data.series[i].xs) + labelformatter;
                        }
                    })
                }
                //tips判断是否有formatter，有就分割字符串，没有定义为undefined
                if (chat.data.series[i].tooltip && chat.data.series[i].tooltip.formatter) {
                    var tipsformatter = chat.data.series[i].tooltip.formatter.split("}")[1]
                } else {
                    tipsformatter = undefined
                }
                //tips小数位数
                chat.data.series[i].tooltip.formatter = (function (value) {
                    if (tipsformatter == undefined) {
                        if (parseFloat(value.data) == 0) {
                            return parseFloat(value.data).toFixed(0);
                        } else
                            return value.seriesName + '<br/>' + value.name + ':' + parseFloat(value.data).toFixed(chat.data.series[i].xs) + chat.data.series[i].tooltip.dw;
                    } else {
                        if (parseFloat(value.data) == 0) {
                            return parseFloat(value.data).toFixed(0) + tipsformatter;
                        } else
                            return value.seriesName + '<br/>' + value.name + ':' + parseFloat(value.data).toFixed(chat.data.series[i].xs) + tipsformatter;
                    }
                })
            }
        })
    }

    //判断饼图，设置中心位置
    if (chat && chat.charttype === "pie" && data.series[0].left && data.series[0].center) {
        data.series[0].center[0] = data.series[0].left;
        data.series[0].center[1] = data.series[0].right;
    }
    //三等指标图
    if (chat && chat.chartid == '108') {
        if (data.series[0].color1 && data.series[0].color2 && data.series[0].color3) {
            data.series[0].axisLine.lineStyle.color[1][1] = data.series[0].color1
            data.series[0].axisLine.lineStyle.color[3][1] = data.series[0].color2
            data.series[0].axisLine.lineStyle.color[5][1] = data.series[0].color3
        }
    }

    // 判断动态仪表盘
    if (chat && chat.chartid == '226') {
         data.series[1].detail.textStyle.fontSize = data.TextSetting.fontSize
        data.series[1].detail.textStyle.color = data.TextSetting.color
        //中心位置
        data.series[0].center = [data.PanSetting.X, data.PanSetting.X]
        data.series[1].center = [data.PanSetting.X, data.PanSetting.X]
        //数据范围
        data.series[0].min = data.PanSetting.small
        data.series[1].min = data.PanSetting.small
        data.series[0].max = data.PanSetting.big
        data.series[1].max = data.PanSetting.big
        //图标名字
        data.series[1].name = datavalueby.name
        data.series[1].data[0].value = datavalueby.value
        data.series[1].detail.formatter = [datavalueby.value + (data.PanSetting.unit), datavalueby.name].join('\n')
        //颜色属性修改
        if (data.ColorSetting.color) {
            data.series[0].axisLine.lineStyle.color[0][1] = data.ColorSetting.color
            data.series[0].axisTick.lineStyle.color = data.ColorSetting.color
            data.series[0].splitLine.lineStyle.color = data.ColorSetting.color
            data.series[0].axisLabel.textStyle.color = data.ColorSetting.color
            data.series[1].itemStyle.normal.color = data.ColorSetting.color
        }
    }

    //判断半圆图
    if (chat && chat.chartid == '225') {
        var date = []
        var prcent
        percent = parseFloat((datavalueby[0].value / datavalueby[1].value) * 100).toFixed(2);
        date.push({
                value: datavalueby[0].value,
                name: datavalueby[0].name,
                itemStyle: {
                    normal: {
                        color: data.series[0].color1
                    }
                },
                label: {
                    normal: {
                        postion: "center"
                    }
                },
                tooltip: {
                    show: true,
                    formatter: '' + datavalueby[0].name + '：' + datavalueby[0].value + '(' + percent + '%)'
                }
            },
            {
                value: datavalueby[1].value - datavalueby[0].value,
                itemStyle: {
                    normal: {
                        color: data.series[0].color2,
                        label: {
                            show: false
                        },

                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        color: data.series[0].color2
                    }
                },
                tooltip: {
                    show: false
                },
                name: ''
            },
            {
                value: datavalueby[1].value,
                tooltip: {
                    show: false
                },
                itemStyle: {
                    normal: {
                        color: 'rgba(0,0,0,0)',
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        color: 'rgba(0,0,0,0)'
                    }
                },
                name: 'hide'
            })
        data.series[0].data = date
    }

    //判断双层柱状图
    if (chat && chat.chartid == '223') {
        data.xAxis[0].data = datavalueby.x
        $.each(data.series, function (i, val) {
            data.series[i].data = datavalueby.y[i]
            if (data.series[i].h) {
                data.series[i].symbolSize[0] = data.series[i].h
            }
            if (data.series[i].w) {
                data.series[i].symbolSize[1] = data.series[i].w
            }
        })
        if (data.SetColor.color1 && data.SetColor.color2 && data.SetColor.color3) {
            data.series[1].itemStyle.normal.color = (function () {
                return function () {
                    return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                        offset: 0,
                        color: data.SetColor.color1
                    }, {offset: 1, color: data.SetColor.color2}, {offset: 1, color: data.SetColor.color3}])
                }
            })()
        }
    }

    //气泡图
    if (chat && chat.chartid == '202') {
        var color = ['#f467ce', '#7aabe2', '#ff7123', '#ffc400', '#5e333f', '#6b3442', '#8a3647', '#68333f', '#FFC125']
        $.each(chat.data.series['0'].data, function (i, val) {
            if (!val.symbolSize && !val.itemStyle) {
                val.symbolSize = 140
                val.itemStyle = {}
                val.itemStyle.normal = {}
                val.itemStyle.normal.color = color[i]
            }

        })
    }

    //判断是否为分裂饼图
    if (chat && data.pie) {
        var reldata = [];
        var redata = [];
        redata = datavalueby;
        if (redata.length == 1) {
            redata[0].sum = 0
        }
        var sum = 0
        $.each(datavalueby, function (i, val) {
            sum += val.value
        })
        for (var i = 0; i < redata.length; i++) {
            reldata.push({
                value: redata[i].value,
                name: redata[i].name,
                sum: sum,
                itemStyle: {
                    normal: {
                        borderWidth: 4,
                        shadowBlur: 0,
                        borderColor: data.fillcolor[i],
                        shadowColor: data.fillcolor[i]
                    }
                }
            }, {
                value: sum / 60,
                name: '',
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
                }
            });
        }
        data.series[0].data = reldata;
        chat.data.series[0].itemStyle.normal.label.formatter = (function () {
            return function (params) {
                var percent = 0;
                var total = 0;
                for (var i = 0; i < redata.length; i++) {
                    total += redata[i].value;
                }
                percent = ((params.value / total) * 100).toFixed(2);
                if (params.name !== '') {
                    return params.name + ':' + params.value + '家,' + '' + '占' + percent + '%';
                } else {
                    return '';
                }
            }
        })()
        //视图显示
        data.series[0].radius[0] = data.series[0].small;
        data.series[0].radius[1] = data.series[0].big;
    }


    //判断是否是轮播柱状图
    if (chat && data.timebar) {
        chat.data.baseOption.xAxis[0].data = chat.datavalue.x
        $.each(datavalueby.y, function (i, val) {
            chat.data.options[i].series.data = val
            if (chat.data.options[i].series.xs) {
                chat.data.options[0].series.label.formatter = (function (value) {
                    if (parseFloat(value.data) == 0) {
                        return parseFloat(value.data).toFixed(0);
                    } else
                        return parseFloat(value.data).toFixed(chat.data.options[0].series.xs);
                })
            }
            if (chat.data.options[i].series.itemStyle.normal && chat.data.options[i].series.itemStyle.normal.color2) {
                color1 = chat.data.options[0].series.itemStyle.normal.color1
                color2 = chat.data.options[0].series.itemStyle.normal.color2
                chat.data.options[0].series.itemStyle.normal.color = (function () {
                    return function () {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '' + color1 + ''
                        }, {offset: 1, color: '' + color2 + ''}])
                    }
                })()
                color3 = chat.data.options[1].series.itemStyle.normal.color1
                color4 = chat.data.options[1].series.itemStyle.normal.color2
                chat.data.options[1].series.itemStyle.normal.color = (function () {
                    return function () {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '' + color3 + ''
                        }, {offset: 1, color: '' + color4 + ''}])
                    }
                })()
                color5 = chat.data.options[2].series.itemStyle.normal.color1
                color6 = chat.data.options[2].series.itemStyle.normal.color2
                chat.data.options[2].series.itemStyle.normal.color = (function () {
                    return function () {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '' + color5 + ''
                        }, {offset: 1, color: '' + color6 + ''}])
                    }
                })()
                color7 = chat.data.options[3].series.itemStyle.normal.color1
                color8 = chat.data.options[3].series.itemStyle.normal.color2
                chat.data.options[3].series.itemStyle.normal.color = (function () {
                    return function () {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '' + color7 + ''
                        }, {offset: 1, color: '' + color8 + ''}])
                    }
                })()
            }
        })
    }

    //判断是否是进度壮图
    if (chat && data.progress) {
        data.yAxis[1].data = datavalueby.x['1'].reverse()
        color1 = data.Barsetting.color1
        color2 = data.Barsetting.color2
        data.series[1].itemStyle.normal.color = (function () {
            return function () {
                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: '' + color1 + ''
                }, {offset: 1, color: '' + color2 + ''}])
            }
        })()
    }

    //判断是否为匹配度
    if (chat && data.match) {
        for (i = 0; i < data.series.length; i++) {
            datavalueby[i][0].itemStyle = data.series[i].setting.itemStyle
            datavalueby[i][1].itemStyle = data.series[i].setting.itemStyle
            data.series[i].data = datavalueby[i];
        }
    }

    // 3D地图
    if (chat && data.geo3D && data.series[0] && data.series[1]) {
        for (i = 0; i < data.series.length; i++) {
            data.series[i].data = datavalueby[i];
        }
    }

    //判断是否为渐变图，渐变图的设置
    if (chat && data.gradient === true && data.series[0]) {
        console.log(1212)
        //定义三种颜色
        color1 = data.ColorSetting.color1
        color2 = data.ColorSetting.color2
        color3 = data.ColorSetting.color3
        //渐变颜色函数
        data.series[0].itemStyle.normal.color = (function () {
            return function () {
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 1,
                    color: '' + color1 + ''
                }, {offset: 0.5, color: '' + color2 + ''}, {offset: 0, color: '' + color3 + ''}])
            }
        })()
    }

    //判断是否为轮播地图
    if (chat && data.rangmap2 === true) {
        for (i = 0; i < chat.data.options.length; i++) {
            chat.data.options[i].series.data = datavalueby[i];
        }
    }

    //判断是否为排名地图
    if (chat && data.rangmap === true) {
        var yData = [];
        var zData = [];
        zData = datavalueby
        zData.sort(function (o1, o2) {
            if (isNaN(o1.value) || o1.value == null) return -1;
            if (isNaN(o2.value) || o2.value == null) return 1;
            return o1.value - o2.value;
        });
        for (var i = 0; i < zData.length; i++) {
            yData.push(zData[i].name);
        }
        data.yAxis.data = yData
        data.series[1].data = chat.datavalue
    }

    //描述圆饼图
    if (chat && chat.chartid == "106") {
        if (!chat.data.series[0].data[0].itemStyle) {
            chat.data.series[0].data[0].itemStyle = {}
            chat.data.series[0].data[0].itemStyle.normal = {}
            chat.data.series[0].data[0].itemStyle.normal.color = '#3dd4de'
            chat.data.series[0].data[0].itemStyle.normal.shadowColor = '#3dd4de'
            chat.data.series[0].data[0].itemStyle.normal.shadowBlur = '10'
        }
        if (!chat.data.series[0].data[0].label) {
            chat.data.series[0].data[0].label = {}
            chat.data.series[0].data[0].label.normal = {}
            chat.data.series[0].data[0].label.normal.formatter = '{d}'
            chat.data.series[0].data[0].label.normal.position = 'center'
            chat.data.series[0].data[0].label.normal.textStyle = {}
            chat.data.series[0].data[0].label.normal.textStyle.color = "#3dd4de"
            chat.data.series[0].data[0].label.normal.textStyle.fontSize = "35"
        }
        //显示label
        chat.data.series[0].data[0].label.normal.show = 'true'
        if (!chat.data.series[0].data[1].itemStyle) {
            chat.data.series[0].data[1].itemStyle = {}
            chat.data.series[0].data[1].itemStyle.normal = {}
            chat.data.series[0].data[1].itemStyle.normal.color = 'rgba(44,59,70,1)'
            chat.data.series[0].data[1].itemStyle.normal.label = {}
            chat.data.series[0].data[1].itemStyle.normal.label.show = false
            // chat.data.series[0].data[1].itemStyle.normal.shadowBlur = '10'
        }
    }

    //炫酷地图
    if (chat && chat.chartid == "400") {
        chat.data.series['0'].data = datavalueby['0']
        if (!chat.data.series['0'].data['0'].symbolSize) {
            chat.data.series['0'].data['0'].symbolSize = '10'
            chat.data.series['0'].data['0'].itemStyle = {}
            chat.data.series['0'].data['0'].itemStyle.color = '#FFC125'
        }
    }

    //判断是否为渐变饼图
    if (chat && chat.chartid == '210') {
        //数据拼接
        $.each(datavalueby, function (i, val) {
            chat.data.series[i].data = val
        })
        //初始数据一拼接
        chat.data.series['0'].data[0].itemStyle = {}
        chat.data.series['0'].data[0].itemStyle = chat.data.date.itemStyle
        //初始数据二拼接
        var addcolor = [["#FF7671", "#A14AFF"], ['#FFEA4F', '#F89212'], ['#57FFE0', '#3469E2']]
        if (!chat.data.series['1'].data[0].itemStyle) {
            $.each(chat.data.series[1].data, function (i, val) {
                    val.itemStyle = {}
                    val.itemStyle.normal = {}
                    val.itemStyle.normal.color = {}
                    val.itemStyle.normal.color.colorStops = []
                    val.itemStyle.normal.color.colorStops[0] = {}
                    val.itemStyle.normal.color.colorStops[1] = {}
                    val.itemStyle.normal.color.colorStops[0].offset = 0
                    val.itemStyle.normal.color.colorStops[1].offset = 1
                    val.itemStyle.normal.color.colorStops[0].color = chat.data.date.color[i][0]
                    val.itemStyle.normal.color.colorStops[1].color = chat.data.date.color[i][1]
                }
            )
        }
        //图例数据
        $.each(datavalueby[1], function (i, res) {
            chat.data.legend.data.push(res.name)
        })
    }

    // 判断是否为985图
    if (chat && data && data.gradientpie) {
        $.each(datavalueby, function (i, val) {
            chat.data.series[i].data = val
        })
        $.each(chat.datavalue[1], function (i, res) {
            chat.data.legend.data.push(res.name)
        })
    }

    if (utils.isMap(chat)) {
        chart.setRound({option: chat.data, myChart: myChart, datavalue: datavalueby});
        chart.setMapHover({option: chat.data, myChart: myChart, datavalue: datavalueby});
    }
    // myChart.clear();
    myChart.setOption(data, true);
}