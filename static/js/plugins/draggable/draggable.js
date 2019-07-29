/**
 * author levi
 * url http://levi.cg.am
 */
var moved = false;
$(function () {
    $(document).mousemove(function (e) {
        if (!!this.move) {
            var posix = !document.move_target ? {'x': 0, 'y': 0} : document.move_target.posix,
                callback = document.call_down || function () {
                    if (!moved) {
                        $(this.move_target).trigger('click');
                        moved = true;
                    }

                    $(this.move_target).children('.navigator-line').show();
                    var maxMin = utils.measureMaxMin($(this.move_target).parent(), $(this.move_target));
                    var c = {
                        'top': (e.pageY - posix.y) / chart.config.scale,
                        'left': (e.pageX - posix.x) / chart.config.scale
                    }
                    // console.log(this.move)
                    // console.log(utils)
                    var current = utils.offsetContain(c, maxMin)
                    // console.log(current);
                    // chart.config.clickChart=false
                    //对宽高取四舍五入
                    var move_top = Math.round(current.top);
                    var move_left = Math.round(current.left);
                    // console.log(move_top,move_left);
                    //对宽高赋值
                    current.top = move_top;
                    current.left = move_left;
                    // console.log(current)
                    //为div的样式添加css的style
                    //  $("[name=x]").html(move_top)
                    $(this.move_target).find('.navigator-line-left').css("width", current.left);
                    $(this.move_target).find('.navigator-line-top').css("height", current.top);
                    //拼接显示数据字符串
                    var showdata = current.left + "," + current.top
                    // console.log(showdata)
                    $(this.move_target).find('.navigator-line-account').html(showdata);
                    $(this.move_target).css(current);
                    chart.config.lineConnector && (chart.config.lineConnector.jsi.repaintEverything(), chart.config.lineConnector.refreshConnectEffect());
                    $("[name=x]").val(current.left);
                    $("[name=y]").val(current.top);

                };

            callback.call(this, e, posix);
        }
    }).mouseup(function (e) {
        if (!!this.move) {
            var callback = document.call_up || function () {
            };
            callback.call(this, e);
            $.extend(this, {
                'move': false,
                'move_target': null,
                'call_down': false,
                'call_up': false
            });
        }

    });

    $.fn.draggable = function () {
        if (!$(this).data('drag')) {
            var $box = $(this).mousedown(function (e) {

                var offset = $(this).position(), $this = $(this)
                // var c_offset = $(this).parent().offset()
                this.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
                $.extend(document, {
                    'move': true, 'move_target': this, call_up: function () {
                        moved = false;
                        //将css去掉px单位
                        var leftone = parseInt($this.css('left'))
                        var topone = parseInt($this.css('top'))
                        $box.off('click', clickEvent.clickone);
                        $box.on('click', function () {
                            return false;
                        })
                        if (carousel.eidtSwitch) {
                            var $carouse = carousel.$carouse,
                                carouseName = $carouse.parents('.drag-box').data('chartName'),
                                pageIndex = $carouse.data('pageIndex');
                            $.ajax({
                                url: '/pos_carouse_charts',
                                type: 'post',
                                data: {
                                    showname: chart.config.showName
                                    , carouse_name: carouseName,
                                    page_index: pageIndex,
                                    chartname: $box.data('chartName'), update:
                                        JSON.stringify({'x': $this.css('left'), 'y': $this.css('top')})
                                }, success: function () {
                                    // $box.off('click', Clicktwo)
                                    $box.on('click', clickEvent.clickone);
                                    $box.trigger('click');
                                }
                            })
                        } else {
                            $.ajax({
                                url: '/update_chart',
                                type: 'post',
                                data: {
                                    showname: chart.config.showName, chartname: $this.data('chartName'), chartkey:
                                        JSON.stringify([['x', leftone], ['y', topone]])
                                }, success: function () {
                                    // $box.off('click', Clicktwo)
                                    $box.off('click', clickEvent.clickone)
                                    $box.on('click', clickEvent.clickone);
                                    // $box.on('click', Clicktwo)
                                    $box.trigger('click');
                                }
                            })
                        }
                        // var carouselOption = null;
                        // chart.utils.isCarouse(chart.config.clickChart) && (
                        //     carouselOption = $.extend({}, {
                        //         titCell: '.carouse-navs .carouse-nav',
                        //         trigger: 'click'
                        //     }, chart.config.clickChart['data']['carouselOption']), $box.children('.echart').slider(carouselOption))
                    }
                });
            }).on('mousedown', '.drag-coor', function (e) {
                $box = $(this).parent('.drag-box');
                var posix = {
                    'w': $box.width(),
                    'h': $box.height(),
                    'x': e.pageX,
                    'y': e.pageY
                };

                $.extend(document, {
                    'move': true, 'call_down': function (e) {
                        // console.log(chart)
                        moved = false;

                        $box.off('click', clickEvent.clickone);
                        $box.on('click', function () {
                            return false;
                        })
                        var w = Math.max(4 / chart.config.scale, (e.pageX - posix.x) / chart.config.scale + posix.w),
                            h = Math.max(4 / chart.config.scale, (e.pageY - posix.y) / chart.config.scale + posix.h);
                        $box.css({
                            'width': w,
                            'height': h
                        });
                        $box.children('.echart')[0] ? $box.children('.echart').css({
                            'width': w,
                            'height': h,
                        }) : $box.find('.echart').css({
                            'width': w,
                            'height': h,
                        });
                        // console.log(chart)
                        // var chat = {w,h}
                        // $box.children('.echart').rotate3d(chat)

                    }, call_up: function () {
                        // console.log($box.find('.echart').css('width'), $box.find('.echart').css('height'), '-------------')
                        if (carousel.eidtSwitch) {
                            var $carouse = carousel.$carouse,
                                carouseName = $carouse.parents('.drag-box').data('chartName'),
                                pageIndex = $carouse.data('pageIndex');
                            $.ajax({
                                url: '/pos_carouse_charts',
                                type: 'post',
                                data: {
                                    showname: chart.config.showName,
                                    page_index: pageIndex,
                                    carouse_name: carouseName, chartname: $box.data('chartName'), update:
                                        JSON.stringify({'w': $box.width(), 'h': $box.height()})
                                }
                            })
                        } else {
                            $box.data('echart') && $box.data('echart').resize();
                            $.ajax({
                                url: '/update_chart',
                                type: 'post',
                                data: {
                                    showname: chart.config.showName, chartname: $box.data('chartName'), chartkey:
                                        JSON.stringify([['w', $box.width()], ['h', $box.height()]])
                                }, success: function () {
                                    $box.off('click', clickEvent.clickone)
                                    $box.on('click', clickEvent.clickone);
                                    $box.trigger('click');
                                }
                            })
                        }
                        $box.data('echart') && $box.data('echart').resize();
                        var s = $box.children('.echart');
                        var carouselOption = null;
                        utils.isCarouse(s.data('chart')) && (
                            carouselOption = $.extend({}, {
                                titCell: '.carouse-navs .carouse-nav-number',
                                trigger: 'click'
                            }, s.data('chart')['data']['carouselOption']), s[0] && s.SuperSlide(carouselOption))
                        chart.config.lineConnector && (chart.config.lineConnector.jsi.repaintEverything(), chart.config.lineConnector.refreshConnectEffect());


                    }
                });
                return false;
            })
            $(this).data('drag', true);
        }
    }

    $.fn.dragUnable = function () {
        if ($(this).data('drag')) {
            $(this).data('drag', false);
            $(this).find('.navigator-line').hide();
            $(this).find('.toolbar').hide();
            $(this).off('mousedown');
        }
    }

});

