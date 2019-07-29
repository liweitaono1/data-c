/**
 * 三等指标图
 * @author lsl
 */

var third_indicator = function (chat, data, datavalueby) {
    if (data.series[0].color1 && data.series[0].color2 && data.series[0].color3) {
        data.series[0].axisLine.lineStyle.color[1][1] = data.series[0].color1
        data.series[0].axisLine.lineStyle.color[3][1] = data.series[0].color2
        data.series[0].axisLine.lineStyle.color[5][1] = data.series[0].color3
    }
}