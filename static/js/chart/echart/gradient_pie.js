/**
 * 渐变饼图
 * @author lsl
 */

var gradient_pie = function (chat, data, datavalueby) {
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