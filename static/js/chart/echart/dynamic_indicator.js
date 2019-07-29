/**
 * 动态指标图
 * @author lsl
 */

var dynamic_indicator = function (chat, data, datavalueby) {
    data.series[1].detail.textStyle.fontSize = data.TextSetting.fontSize
    data.series[1].detail.textStyle.color = data.TextSetting.color
    //中心位置
    data.series[0].center = [data.PanSetting.X, data.PanSetting.X]
    data.series[1].center = [data.PanSetting.X, data.PanSetting.X]
    //数据范围
    data.series[0].min = data.PanSetting.small
    data.series[1].min = data.PanSetting.small
    data.series[0].max = data.PanSetting.big
    data.series[1].max = data.PanSetting.big
    //图标名字
    data.series[1].name = datavalueby.name
    data.series[1].data[0].value = datavalueby.value
    data.series[1].detail.formatter = [datavalueby.value + (data.PanSetting.unit), datavalueby.name].join('\n')
    //颜色属性修改
    if (data.ColorSetting.color) {
        data.series[0].axisLine.lineStyle.color[0][1] = data.ColorSetting.color
        data.series[0].axisTick.lineStyle.color = data.ColorSetting.color
        data.series[0].splitLine.lineStyle.color = data.ColorSetting.color
        data.series[0].axisLabel.textStyle.color = data.ColorSetting.color
        data.series[1].itemStyle.normal.color = data.ColorSetting.color
    }
}