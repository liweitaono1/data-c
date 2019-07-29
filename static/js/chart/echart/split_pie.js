/**
 * 分裂饼图
 * @author lsl
 */

var split_pie = function (chat, data, datavalueby) {

    var reldata = [];
    var redata = [];
    redata = datavalueby;
    if (redata.length == 1) {
        redata[0].sum = 0
    }
    var sum = 0
    $.each(datavalueby, function (i, val) {
        sum += val.value
    })
    for (var i = 0; i < redata.length; i++) {
        reldata.push({
            value: redata[i].value,
            name: redata[i].name,
            sum: sum,
            itemStyle: {
                normal: {
                    borderWidth: 4,
                    shadowBlur: 0,
                    borderColor: data.fillcolor[i],
                    shadowColor: data.fillcolor[i]
                }
            }
        }, {
            value: sum / 60,
            name: '',
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    color: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 0
                }
            }
        });
    }
    data.series[0].data = reldata;
    chat.data.series[0].itemStyle.normal.label.formatter = (function () {
        return function (params) {
            var percent = 0;
            var total = 0;
            for (var i = 0; i < redata.length; i++) {
                total += redata[i].value;
            }
            percent = ((params.value / total) * 100).toFixed(2);
            if (params.name !== '') {
                return params.name + ':' + params.value + '家,' + '' + '占' + percent + '%';
            } else {
                return '';
            }
        }
    })()
    //视图显示
    data.series[0].radius[0] = data.series[0].small;
    data.series[0].radius[1] = data.series[0].big;

}