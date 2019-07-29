/**
 * 炫酷地图
 * @author lsl
 */

var cool_map = function (chat, data, datavalueby) {
    $.each(datavalueby, function (i, val) {
        chat.data.series[i].data = val
    })
    $.each(chat.datavalue[1], function (i, res) {
        chat.data.legend.data.push(res.name)
    })
}