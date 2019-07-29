// 轮播插件
var carousel = {
    // 初始化轮播页面
    init: function (chat, carouse, op_type) {
        carousel.eidtSwitch = true, // 轮播编辑开关-默认关闭
            carousel.pageIndex = -1, // 轮播当前页码-默认-1
            carousel.$carouse = carouse, // 轮播载体
            carousel.op_type = op_type, // 轮播模式 view: 查看模式  edit: 编辑模式
            carousel.chat = chat, // 轮播数据
            carousel.zIndex = 999999999, // 轮播层次
            carousel.CZIndex = 0
        // 轮播
        carousel.$carouseItem = $('<div class="carouse-item">').appendTo($('<div class="carouse">').appendTo(carousel.$carouse)),
            carousel.$carouseNav = $('<ul>').appendTo($('<div class="carouse-navs">').appendTo(carousel.$carouse)),
            carousel.tempSwitch = false,
            carousel.cPage = undefined;
        // 渲染轮播
        carousel.render();
        carousel.operate();
        // carousel.tempSwitch && (chart.config.option.editSwitch = true);
        return carousel.$carouse
    },
    findItem: function () {
        return carousel.$carouse[0] ? carousel.$carouse.find('.carouse-item') : undefined;
    },
    findNavs: function () {
        return carousel.$carouse[0] ? carousel.$carouse.find('.carouse-navs ul') : undefined;
    },
    findPages: function () {
        return carousel.$carouse[0] ? carousel.$carouse.find('.carouse-page') : undefined;
    },
    operate: function (carouse, op_type) {
        carousel.$carouse = carouse ? carouse.data('echart') : carousel.$carouse,
            carousel.op_type = op_type || carousel.op_type;
        carousel.$carouse.find('.drag-box').removeClass('drag-box-hovered');
        carousel.$carouse.find('.navigator-line').hide()//将div.navigator-line隐藏
        if (carousel.op_type === 'view') {
            carousel.eidtSwitch = false;
            if (carousel.$carouse.find('.carouse-cover')[0]) {
                carousel.$carouse.find('.carouse-cover').remove();
                chart.config.option.editSwitch && carousel.$carouse.append($('<div class="carouse-cover">'));
            } else {
                chart.config.option.editSwitch && carousel.$carouse.append($('<div class="carouse-cover">'));
            }
            ;

            carousel.$carouse.parents('.drag-box').css({
                zIndex: carousel.$carouse.parents('.drag-box').data('zIndex')
            });
            carousel.$carouse.find('.drag-box').each(function (i, obj) {
                $(obj).css({
                    zIndex: $(obj).data('zIndex') ? $(obj).data('zIndex') : ""
                });
            });
            chart.config.chartLoader.find('.carouse-mask').remove();
            chart.config.chartLoader.find('.carouse-editor').remove();
            carousel.$carouse.parents('.drag-box').draggable();
            carousel.$carouse.css('overflow', 'hidden');
            carousel.$carouse.find('.carouse-navs').removeClass('carouse-edit-nav');
            carousel.$carouse.data('playStateFun') && carousel.$carouse.data('playStateFun')()
            if (!chart.config.option.editSwitch) {
                carousel.$carouse.parents('.drag-box').dragUnable()
            }
        } else {
            carousel.eidtSwitch = true;
            carousel.$carouse.find('.carouse-cover').hide();
            chart.config.chartLoader.prepend($('<div class="carouse-mask">').css({
                zIndex: carousel.zIndex - 1
            }));
            carousel.$carouse.parents('.drag-box').data('zIndex', carousel.$carouse.parents('.drag-box').css('zIndex')).css({'zIndex': 'auto'})
            carousel.$carouse.find('.drag-box').each(function (i, obj) {
                $(obj).data('zIndex', $(obj).css('zIndex')).css({
                    zIndex: carousel.CZIndex = (carousel.zIndex + i + 1)
                });
            });
            carousel.$carouse.css('overflow', 'visible')
            // console.log(carousel.$carouse.data('pauseStateFun'))
            carousel.$carouse.data('pauseStateFun') && carousel.$carouse.data('pauseStateFun')();
            carousel.$carouse.find('.carouse-navs').addClass('carouse-edit-nav').css('transform', 'scale(1)');
            chart.config.chartLoader.prepend($('<div class="carouse-editor">').css({
                position: 'absolute',
                left: carousel.$carouse.parents('.drag-box').css('left'),
                top: carousel.$carouse.parents('.drag-box').css('top'),
                width: carousel.$carouse.parents('.drag-box').css('width'),
                height: carousel.$carouse.parents('.drag-box').css('height'),
                zIndex: carousel.zIndex,
                backgroundColor: '#333333'
            }).append($('<div class="carouse-close" title="点击关闭">').append('<i class="fa fa-close fa-3x"></i>').on('click', function () {
                carousel.operate('', 'view')
            })));
            carousel.$carouse.parents('.drag-box').children('.toolbar').hide();
            carouse.dragUnable();
        }
    },
    // 渲染视图
    render: function () {
        // 必要检查
        if (!carousel.chat || !carousel.chat['data']) {
            console.log('轮播加载失败....chat or data不存在');
            return;
        }
        if (!carousel.chat['data']['pages'] || !$.isArray(carousel.chat['data']['pages'])) {
            console.log('轮播加载失败....pages 不存在 or pages 类型错误');
            return;
        }
        // 加载图表
        if (carousel.chat['data']['carouseView'] === 'newChart') {
            carousel.createPageHeader(carousel.chat['data']['pages']);
            carousel.renderChart();
        }
        // 加载视图
        else if (carousel.chat['data']['carouseView'] === 'newView') {
            carousel.renderView();
        }
        // 加载网页
        else if (carousel.chat['data']['carouseView'] === 'newWebPage') {
            carousel.renderWebPage();
        } else {
            console.log('轮播加载失败.... carouseView: ' + carousel.chat['data']['carouseView'] + '不存在');
        }
        //
        carousel.refresh();
    },
    refresh: function (option) {
        var carouselOption = $.extend({}, {
            titCell: '.carouse-navs .carouse-nav-number',
            trigger: 'click'
        }, option || carousel.chat['data']['carouselOption']);
        carousel.$carouse.SuperSlide(carouselOption);
    },
    // 渲染图表
    renderChart: function () {
        $.each(carousel.chat['data']['pages'], function (i, page) {
            if (!page['children'] || !$.isArray(page['children'])) {
                return true;
            }
            // 新增轮播页面
            var carousePage = carousel.createCarousePage(page);
            $.each(page['children'], function (i, chat) {
                chart.renderChartForm(chat, false, carousePage);
            })

        });
    },

    // 加载视图
    renderView: function () {

    },

    // 加载网页
    renderWebPage: function () {

    },
    // 新增轮播页面
    createCarousePage: function (page) {
        return $('<div class="carouse-page">').appendTo(carousel.findItem());
    },
    // 新增
    createPageHeader: function (pages) {
        // console.log(pages)
        if (chart.config.option.editSwitch) {
            $('<div class="carouse-nav">').html('-').on('click', function (e) {
                var $carouse = carousel.$carouse,
                    carouseName = $carouse.parents('.drag-box').data('chartName'),
                    pageIndex = $carouse.data('pageIndex') || 0;
                // console.log(pageIndex)
                $.ajax({
                    url: '/del_carouse_charts',
                    type: 'post',
                    data: {
                        showname: chart.config.showName,
                        page_index: pageIndex,
                        carouse_name: carouseName,
                        op: 'delete_page'
                    },
                    success: function (data) {
                        // console.log(pages)
                        carousel.$carouse.find('.carouse-page:eq(' + (carousel.$carouse.data('pageIndex') || 0) + ')').remove();
                        carousel.$carouse.find('.carouse-nav-number:eq(' + (carousel.$carouse.data('pageIndex') || 0) + ')').remove();
                        carousel.$carouse.find('.carouse-nav-number:first').trigger('click');
                        carousel.$carouse.find('.carouse-nav-number').each(function (i, obj) {
                            $(obj).html(i + 1);
                        })
                    }
                });
                return false;

            }).appendTo(carousel.$carouseNav);
        }
        $.each(pages, function (i, page) {
            if (page.children) {
                if (chart.config.option.editSwitch)
                    $('<div class="carouse-nav carouse-nav-number">').html((i + 1)).appendTo(carousel.$carouseNav);
                else {
                    $('<div class="carouse-nav carouse-nav-number">').appendTo(carousel.$carouseNav);
                    carousel.$carouseNav.parent().show().addClass('carouse-view-nav');
                }
            }
        });
        if (chart.config.option.editSwitch) {
            $('<div class="carouse-nav">').html('+').on('click', function (e) {
                var $carouse = carousel.$carouse,
                    carouseName = $carouse.parents('.drag-box').data('chartName'),
                    pageIndex = carousel.findPages().length;
                $.ajax({
                    url: '/pos_carouse_charts',
                    type: 'post',
                    data: {
                        showname: chart.config.showName,
                        page_index: pageIndex,
                        carouse_name: carouseName,
                        op: 'add_page'
                    },
                    success: function (data) {
                        // console.log(data)
                        carousel.createCarousePage();
                        var nav = $('<div class="carouse-nav carouse-nav-number">').html(carousel.findPages().length).insertAfter(carousel.findNavs().children('.carouse-nav-number:last'))
                        carousel.refresh();
                        nav.trigger('click');
                    }
                });
                return false;
            }).appendTo(carousel.$carouseNav);
        }
    }

}