/**
 * 半饼图
 * @author lsl
 */

var semicircle = function (chat, data, datavalueby) {
    console.log(data)
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