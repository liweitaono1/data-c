$(function () {

    var left = false;
    var right = false;
    var top = false;
    var bottom = false;

    $(document).on('keydown', function (ev) {
        // if (chart.config.clickChart == null) {
        //
        //     return false;
        // }
        // else {

            var oEvent = ev || event;
            var keyCode = oEvent.keyCode;
            switch (keyCode) {
                case 37:
                    left = true;
                    break;
                case 38:
                    top = true;
                    break;
                case 39:
                    right = true;
                    break;
                case 40:
                    bottom = true;
                    break;
                // case 13:
                //     return false;
            }
        // }
    });
    //执行完后，所有对应变量恢复为false，保持静止不动
    $(document).on('keyup', function (ev) {
        if (chart.config.clickChart == null) {
            return false;
        }
        else {
               //高和宽的数字去四舍五入
            var move_top = Math.round(chart.config.chartDom.position().top/chart.config.scale);
            var move_left = Math.round(chart.config.chartDom.position().left/chart.config.scale);
            // console.log(move_left, move_top)
            //为div.navigator添加高和宽的样式
            $(chart.config.chartDom).find('.navigator-line-left').css("width", move_left);
            $(chart.config.chartDom).find('.navigator-line-top').css("height", move_top);
            //拼接显示数据的字符串
            var showdata=move_left+","+move_top;
            // console.log(showdata)
            //将拼接字符串显示
            $(chart.config.chartDom).find('.navigator-line-account').html(showdata);
            //当按下对应方向键时，对应变量为true
            var oEvent = ev || event;
            var keyCode = oEvent.keyCode;
            switch (keyCode) {
                case 37:
                    left = false;
                    break;
                case 38:
                    top = false;
                    break;
                case 39:
                    right = false;
                    break;
                case 40:
                    bottom = false;
                    break;
            }
            //请求数据
            $.ajax({
                url: '/update_chart',
                type: 'post',
                data: {
                    showname: chart.config.showName,
                    chartname: chart.config.clickChart.name,
                    chartkey: JSON.stringify([['x', chart.config.chartDom.css('left')], ['y', chart.config.chartDom.css('top')]])
                }
            })
        }
    })
    //设置一个定时，时间为50左右，不要太高也不要太低
    setInterval(function () {
        // console.log(chart.config.scale)
        //当其中一个条件为true时，则执行当前函数（移动对应方向）
        if (left) {
            var abc = chart.config.chartDom.position().left - 1
            chart.config.chartDom.css('left', abc / chart.config.scale);//除以缩放比例

        } else if (top) {
            var abc1 = chart.config.chartDom.position().top - 1
            chart.config.chartDom.css('top', abc1 / chart.config.scale);
        } else if (right) {
            var abc2 = chart.config.chartDom.position().left + 1
            chart.config.chartDom.css('left', abc2 / chart.config.scale);
        } else if (bottom) {
            var abc3 = chart.config.chartDom.position().top + 1
            chart.config.chartDom.css('top', abc3 / chart.config.scale);
        }

    }, 100);


    $.fn.keything = function () {

    }
})
