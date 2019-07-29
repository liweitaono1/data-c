/**
 * 渐变柱状图
 * @author lsl
 */

var gradient_column = function (chat, data, datavalueby) {
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