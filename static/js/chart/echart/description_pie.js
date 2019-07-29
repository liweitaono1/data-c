/**
 * 描述圆饼图
 * @author lsl
 */

var description_pie = function (chat, data, datavalueby) {
    if (!chat.data.series[0].data[0].itemStyle) {
        chat.data.series[0].data[0].itemStyle = {}
        chat.data.series[0].data[0].itemStyle.normal = {}
        chat.data.series[0].data[0].itemStyle.normal.color = '#3dd4de'
        chat.data.series[0].data[0].itemStyle.normal.shadowColor = '#3dd4de'
        chat.data.series[0].data[0].itemStyle.normal.shadowBlur = '10'
    }
    if (!chat.data.series[0].data[0].label) {
        chat.data.series[0].data[0].label = {}
        chat.data.series[0].data[0].label.normal = {}
        chat.data.series[0].data[0].label.normal.formatter = '{d}'
        chat.data.series[0].data[0].label.normal.position = 'center'
        chat.data.series[0].data[0].label.normal.textStyle = {}
        chat.data.series[0].data[0].label.normal.textStyle.color = "#3dd4de"
        chat.data.series[0].data[0].label.normal.textStyle.fontSize = "35"
    }
    //显示label
    chat.data.series[0].data[0].label.normal.show = 'true'
    if (!chat.data.series[0].data[1].itemStyle) {
        chat.data.series[0].data[1].itemStyle = {}
        chat.data.series[0].data[1].itemStyle.normal = {}
        chat.data.series[0].data[1].itemStyle.normal.color = 'rgba(44,59,70,1)'
        chat.data.series[0].data[1].itemStyle.normal.label = {}
        chat.data.series[0].data[1].itemStyle.normal.label.show = false
        // chat.data.series[0].data[1].itemStyle.normal.shadowBlur = '10'
    }
}