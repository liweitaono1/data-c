/**
 * 进度柱状图
 * @author lsl
 */

var progress_column = function (chat, data, datavalueby) {

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