/**
 * 轮播地图
 * @author lsl
 */

var carousel_map = function (chat, data, datavalueby) {

  for (i = 0; i < chat.data.options.length; i++) {
            chat.data.options[i].series.data = datavalueby[i];
        }

}