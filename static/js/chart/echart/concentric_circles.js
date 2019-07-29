/**
 * 同心圆饼图
 * @author lsl
 */

var concentric_circles = function (chat, data, datavalueby) {
    for (i = 0; i < data.series.length; i++) {
        datavalueby[i][0].itemStyle = data.series[i].setting.itemStyle
        datavalueby[i][1].itemStyle = data.series[i].setting.itemStyle
        data.series[i].data = datavalueby[i];
    }
}