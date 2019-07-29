/**
 * 雷达图
 * @author lsl
 */

var radar = function (chat, data, datavalueby) {
    // console.log(datavalueby, chat)
    var indicator = [],
        value = []
    for (var i = 0; i < datavalueby[0]['value'].length; i++) {
        value.push({
            value: []
        })
        $.each(datavalueby, function (j, val) {
            value[i]['value'].push(val.value[i])
        })
    }
    $.each(datavalueby, function (i, val) {
        indicator.push({
            name: val.name,
            max: 100
        })
    })
    data['radar']['indicator'] = indicator
    data.series[0].data = value
}