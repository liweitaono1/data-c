/**
 * 气泡图
 * @author lsl
 */

var bubble = function (chat, data, datavalueby) {
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