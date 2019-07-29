/**
 * 3d地图
 * @author lsl
 */

var d_map = function (chat, data, datavalueby) {
    if (data.series[0] && data.series[1]) {
        for (i = 0; i < data.series.length; i++) {
            data.series[i].data = datavalueby[i];
        }
    }
}