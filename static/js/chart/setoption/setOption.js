/**
 * 全局设置属性
 * @param option
 * @param element
 */
$.fn.setOption = function (option, chat, element) {
    var $this = $(this);
    // 组件 表格 渲染
    if ((utils.isTable(chat))) {
        render.initTable(chat);
        $this.bootstrapTable('refreshOptions', chat.tableOption);
        utils.autoAttr(option, $this);
    } else if (utils.isScan(chat)) {
        // utils.autoAttr(option, $this, element);
    } else {
        utils.autoAttr(option, $this);
    }
    //标题边框的判断
    //如果charttype是标题，然后在判断上下左右边框是否为true，为ture添加css样式
    if (chat.charttype == "title") {
        // console.log(chat.data.css['bordertopwidth'])
        if (chat.data && chat.data.border) {
            if (chat.data.border.top == false) {
                $this.css('border-top-width', '0px')
            } else {
                $this.css('border-top-width', chat.data.css['bordertopwidth'] + 'px')
                $this.css('border-top-color', chat.data.css['bordertopcolor'])
            }
            if (chat.data.border.bottom == false) {
                $this.css('border-bottom-width', '0px')
            } else {
                $this.css('border-bottom-width', chat.data.css['borderbottomwidth'] + 'px')
                $this.css('border-bottom-color', chat.data.css['borderbottomcolor'])
            }
            if (chat.data.border.left == false) {
                $this.css('border-left-width', '0px')
            } else {
                $this.css('border-left-width', chat.data.css['borderleftwidth'] + 'px')
                $this.css('border-left-color', chat.data.css['borderleftcolor'])
            }
            if (chat.data.border.right == false) {
                $this.css('border-right-width', '0px')
            } else {
                $this.css('border-right-width', chat.data.css['borderrightwidth'] + 'px')
                $this.css('border-right-color', chat.data.css['borderrightcolor'])
            }
        }
    }
    //动态联动的判断
    var style = [];//存放api的样式
    //获取类型是静态数据的索引和状态
    if (chat.charttype == "linkage") {
        var statusStyle = new Array()
        $.each(chat.datavalue || chat.apidatavalue, function (i, val) {
            if (val.status == 1) {
                style = "flame";
            } else if (val.status == 2) {
                style = "Halo";
            } else {
                style = "square";
            }
            statusStyle.push(style)
        })
    }
    $.each(statusStyle, function (i, val) {
        // console.log(i, val)
        $("[index=" + i + "]").removeClass("flame")
        $("[index=" + i + "]").removeClass("Halo")
        $("[index=" + i + "]").removeClass("square")
        $("[index=" + i + "]").addClass(val)
    })
    option = $.extend(true, {}, option);
    // 修改静态数据

    // 组件数字翻牌渲染
    if (utils.isCountUp(chat) && $this.data('countUp')) {
        $this.countup('update', option['dataNumber']);
    }
    //模具添加
    if (element && element.attr('name') && utils.isModel(chat)) {
        //改变的是样式才会改变css的class
        if (element.attr('name') == "css.theme") {
            $this.attr('class', function () {
                return element.val() + ' ' + 'echart';
            })
        } else if (element.attr('name') == "optionx.sequence") {
            $this.attr('index', function () {
                return element.val();
            })
        }
    }
    //下拉框添加
    if (utils.isSelect(chat)) {
        $(".selector").remove()
        $this.append("<select  class=\"selector\" style='width: " + chat.w + "px'></select>")
        $.each(chat.datavalue, function (i, v) {
            $(".selector").append("<option value=" + v.value + ">" + v.name + "</option>");
        });
        $(".selector").val(chat.selectvalue);
        $(".selector").change(function () {
            $.ajax({
                url: '/update_chart',
                type: 'post',
                data: {
                    showname: chart.config.showName, chartname: chat.name, chartkey:
                        JSON.stringify([['selectvalue', $(".selector").val()]])
                }, success: function () {
                    chat.selectvalue = $(".selector").val()
                    chart.bindMutualFunctionWithSelect(chat, $("#chat.mutualOption.targetSource"))
                    chart.bindMutualFunctionWithSelect(chat, $("#chat.mutualOption.targetSource1"))
                }
            })
        })

    }
    if (element && element.attr('name') && utils.isTitle(chat)) {

    }
    // 跑马灯
    if (element && element.attr('name') && utils.isMarquee(chat)) {
        $this.html(option['html'] || option['text']);
        $this.marquee('destroy');
        $this.marquee(option['marqueeOption']);
    }
    //listview
    if (element && element.attr('name') && utils.isListview(chat) && (element.attr('name').indexOf('listviewOption') > -1 || element.attr('name').indexOf('sourcetype') > -1 || element.attr('name').indexOf('datavalue') > -1)) {
        option['listviewOption'].data = chat.data.listviewValue;
        $this.tableSlider('refresh', option['listviewOption']);
    }
    // 组件 时间
    if (element && element.attr('name') && utils.isTimer(chat)) {
        $this.QTimer('update', option['timerOption']);
    }
    // 组件数字翻牌渲染
    if (element && element.attr('name') && element.attr('name').indexOf('countUpOption') > -1 && utils.isCountUp(chat)) {
        $this.countup('refresh', option['countUpOption']);
    }
    //组件扫描图的渲染
    // if ((utils.isObj(chat) || utils.isScan(chat))) {
    //     var datavalue = chat['sourcetype'] == '1' ? chat['datavalue'] : chat['apidatavalue'];
    //     utils.hoverByChat(chat, datavalue || {}, $this);
    // }
    // 组件 obj 渲染
    if (element && (utils.isObj(chat) || utils.isScan(chat))) {
        var datavalue = chat['sourcetype'] == '1' ? chat['datavalue'] : chat['apidatavalue'];
        utils.hoverByChat(chat, datavalue || {}, $this);
    }
    // 组件 热力图 渲染
    if (utils.isDefineHeatmap(chat)) {
        var datavalue = chat['sourcetype'] == '1' ? chat['datavalue'] : chat['apidatavalue'];
        $this.data('heatmap').setData({
            max: 100,
            min: 0, data: datavalue
        })
    }
    // 轮播渲染
    if (element && element.attr('name') && utils.isCarouse(chat)) {
        var carouselOption = $.extend({}, {
            titCell: '.carouse-navs .carouse-nav-number',
            trigger: 'click'
        }, chat['data']['carouselOption']);
        $this.SuperSlide(carouselOption);

    }
    // 组件进度条渲染
    if (element && element.attr('name') && utils.isProgress(chat)) {
        $this.progress(option['progressOption']);
    }
    // 组件 动态图 渲染
    if ((utils.isSvg(chat)) && element) {
        utils.hoverSvgByChat(chat);
        utils.clickSvgByChat(chat);
    }
    //菜单栏渲染
    if ((utils.isMenu(chat)) && element) {
    }
    // console.log(utils.isMerrygoround(chat))
    //旋转木马
    if (utils.isMerrygoround(chat) && element) {
        var options = chat.data.options
        console.log(options)
        $this.Cloud9Carousel(options)

    }
    // 组件 动态图 渲染
    if ((utils.isSvg(chat) && element && element.attr('name').indexOf('svgOption') > -1)) {
        // console.log(2222)
        utils.setSvg(chat, $this, function () {
            utils.hoverSvgByChat(chat);
            utils.clickSvgByChat(chat);
        });
    }

    if (element && utils.is3D(chat)) {
        $this.empty()
        $this.event3D($this, chat)
    }
    if (utils.isLine(chat)) {
    }
    //位置的重新设定
    $this.setposition(chat, element)
    // 更新缓存
    $this.data('chart', chat);
}
//设置位置的w和h
$.fn.setposition = function (chat, element) {
    var $this = $(this).parent('.drag-box');
    if (element && element.attr('name') == "pos") {
        if (chat.pos == "left") {
            chart.config.clickChart.x = 0
            $this.css('left', '0px');
        } else if (chat.pos == "right") {
            var right = parseInt(chart.config.showData.show.screen.width) - parseInt(chat.w)
            chart.config.clickChart.x = right
            $this.css('left', right + 'px');
        } else if (chat.pos == "center") {
            var center = (parseInt(chart.config.showData.show.screen.width) - parseInt(chat.w)) / 2
            chart.config.clickChart.x = center
            $this.css('left', center + 'px');
        }
        // console.log(chat)
    }
    if (element && element.attr('name') == "w") {
        $this.css('width', chat.w + 'px');
    } else if (element && element.attr('name') == "h") {
        $this.css('height', chat.h + 'px');
    } else if (element && element.attr('name') == "x") {
        $this.css('left', chat.x + 'px');
    } else if (element && element.attr('name') == "y") {
        $this.css('top', chat.y + 'px');
    }
    if (element && element.attr('name') == "w" || element && element.attr('name') == "h") {
        $this.data('echart') && $this.data('echart').resize();
    }
}

