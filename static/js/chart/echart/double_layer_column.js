/**
 * 双层柱状图
 * @author lsl
 */

var double_layer_column = function (chat, data, datavalueby) {
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