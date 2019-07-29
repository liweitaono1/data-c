/**
 * 轮播柱状图
 * @author lsl
 */

var carousel_column = function (chat, data, datavalueby) {

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