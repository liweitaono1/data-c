/**
 * 排序地图
 * @author lsl
 */

var rang_map = function (chat, data, datavalueby) {
   var yData = [];
        var zData = [];
        zData = datavalueby
        zData.sort(function (o1, o2) {
            if (isNaN(o1.value) || o1.value == null) return -1;
            if (isNaN(o2.value) || o2.value == null) return 1;
            return o1.value - o2.value;
        });
        for (var i = 0; i < zData.length; i++) {
            yData.push(zData[i].name);
        }
        data.yAxis.data = yData
        data.series[1].data = chat.datavalue
}