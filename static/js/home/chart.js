var chart = {
    /**
     * 全局配置
     */
    config: {
        charts: {},
        option: {
            editSwitch: false,
        },
        intervals: [],
        propertyLoader: $('#propertyLoader'),
        chartLoader: $('#chartLoader'),
        dataLoader: $('#dataLoader'),
        mutualLoader: $('#mutualLoader'),
        attributesLoader: $('#attributesLoader'),
        chartTypeCache: [],
        typeCache: {},
        zindex_data: [],
        elementCacher: [],
        allowSelectedOption: {'pie': 'all', title: 'all', select: 'all', bar: 'all'},
        scale: 1,
        scaleHeight: 1,
        needToInt: ['fontSize', 'marginTop', 'borderTopWidth'],
        methods: ['css', 'text', 'html', 'attr', 'addClass'],
        needToChangeMarquee: ['datavalue', 'api.url', 'sourcetype', 'api.interval'],
        chartTypes: ['line', 'bar', 'funnel', 'scatter', 'pie', 'map', 'gauge', 'radar'],
        border: {imagePath: '/static/images/components/border/'},
        linkage: {imagePath: '/static/images/components/linkage/'},
        decorate: {imagePath: '/static/images/components/decorate/'},
        obj: {imagePath: '/static/images/components/obj/'},
        scan: {imagePath: '/static/images/components/scan/'},
        defineheatmap: {imagePath: '/static/images/components/defineheatmap/'},
        timerCache: {},
        showData: undefined,
        showName: $('#show_name').val(),
        chartLine: $('<div class="navigator-line">')
            .append($('<div class="navigator-line-left">'))
            .append($('<div class="navigator-line-top">'))
            .append($('<div class="navigator-line-account" style="font-size: 18.5877px; left: -9.29385px; top: -9.29385px;">')),
        toolBar: $('<div class="btn-group btn-group-xs toolbar">')
            .append($('<button type="button" class="btn btn-default layer" title="设置图层">').append($('<i class="fa fa-cogs">')))
            .append($('<button type="button" class="btn btn-default copy" title="复制">').append($('<i class="fa fa-copy">')))
            .append($('<button type="button" class="btn btn-default delete" title="删除">').append($('<i class="fa fa-trash">'))),

        dataSettingOptions: {
            help: {
                formElement: {
                    name: '帮助文档',
                    formtype: 'name'
                },
                helpText: {
                    formElement: {
                        formtype: 'url',
                        isFull: true,
                        url: 'show.data.bg.name'
                    }
                }
            },
            setting: {
                formElement: {
                    name: '数据源',
                    isFull: true,
                    formtype: 'name'
                },
                sourceType: {
                    formElement_dataSource: {
                        formtype: 'select',
                        name: '数据源类型',
                        isFull: true,
                        value: {1: "静态数据", 2: "API", 3: "交互", 4: "数据源"},
                        notOption: true,
                        chartkey: 'sourcetype',
                        onChange: function (e, val, chat) {
                            if (val == 2) {
                                // $('[name=datavalue]').attr('name', 'api.url').attr('rows', 3).val(chat.api.url || '')
                                $('[name=datavalue]').parent().parent().hide()
                                $('[name="api.interval"]').parent().parent().show()
                                $('[name="api.url"]').parent().parent().show()
                                $('[name="database"]').parent().parent().hide();
                            } else if (val == 1) {
                                var text = typeof chat.datavalue !== 'object' ? chat.datavalue : JSON.stringify(chat.datavalue);
                                $('[name=datavalue]').parent().parent().show()
                                chart.getlineeditor()
                                $('[name="api.url"]').parent().parent().hide()
                                $('[name="api.interval"]').parent().parent().show()
                                $('[name="database"]').parent().parent().hide();
                            } else if (val == 4) {
                                $('[name=datavalue]').parent().parent().hide();
                                $('[name="api.interval"]').parent().parent().hide()
                                $('[name="api.url"]').parent().parent().hide()
                                $('[name="database"]').parent().parent().show()
                                chart.getlineeditor2()
                            } else {
                                // $('[name=datavalue]').attr('name', 'api.url').attr('rows', 3).val(chat.api.url || '')
                                $('[name=datavalue]').parent().parent().hide()
                                $('[name="api.interval"]').parent().parent().hide()
                                $('[name="api.url"]').parent().parent().show()
                                $('[name="database"]').parent().parent().hide();
                            }
                        }
                    },
                    formElement_datavalue: {
                        formtype: 'editor',
                        // name: '静态数据',
                        isFull: true,
                        chartkey: 'datavalue',
                        attr: {rows: 8},
                        notOption: true,
                    },
                    formElement_api: {
                        formtype: 'input',
                        chartkey: 'api.url',
                        name: 'API',
                        isFull: true,
                        attr: {rows: 3},
                        notOption: true,
                    },
                    formElement_4: {
                        formtype: 'input',
                        name: '间隔时间',
                        isFull: true,
                        chartkey: 'api.interval',
                        notOption: true,
                    },
                    formElement_5: {
                        formtype: 'selectdata',
                        name: '选择数据源',
                        isFull: true,
                        chartkey: 'database',
                        notOption: true,
                    }
                },
            },
            onload: function () {
                if ($('[name=sourcetype]').val() == 1) {
                    $('[name="api.url"]').parent().parent().hide();
                    $('[name=database]').parent().parent().hide();
                    chart.getlineeditor()
                } else if ($('[name=sourcetype]').val() == 2) {
                    $('[name="database"]').parent().parent().hide();
                    $('[name=datavalue]').parent().parent().hide();
                } else if ($('[name=sourcetype]').val() == 4) {
                    $('[name=datavalue]').parent().parent().hide();
                    $('[name="api.url"]').parent().parent().hide();
                    $('[name="api.interval"]').parent().parent().hide();
                } else {
                    $('[name="database"]').parent().parent().hide();
                    $('[name=datavalue]').parent().parent().hide();
                    $('[name="api.interval"]').parent().parent().hide();
                }
            }
        },
        mutualSettingOptions: {
            setting: {
                formElement: {
                    name: '交互设置',
                    formtype: 'name',
                    chartkey: 'mutualOptions',
                    canAdd: true,
                    notOption: true,
                    children: [
                        {
                            name: '目标源',
                            formtype: 'select',
                            chartkey: 'mutualOptions.${i}.targetSource',
                            isFull: true,
                            getValue: '${chart.config.elementCache}',
                            onChange: function (e, val, chat) {
                                // utils.sleep(1000)
                                $('#' + val).parent().addClass('drag-box-hovered')
                                var index = 0;
                                var timer = window.setInterval(function () {
                                    if ($('#' + val).parent().hasClass('drag-box-hovered')) {
                                        $('#' + val).parent().removeClass('drag-box-hovered')
                                    } else {
                                        $('#' + val).parent().addClass('drag-box-hovered')
                                    }
                                    if (index > 4) {
                                        window.clearInterval(timer)
                                    }
                                    index++;
                                }, 500)
                                $('#' + val).parent().removeClass('drag-box-hovered')
                            },
                        },
                        {
                            formtype: 'doubleInput',
                            separator: ':',
                            isFull: true,
                            name: '参数',
                            placeholder: '参数名-参数key',
                            chartkey: 'mutualOptions.${i}.data.key-mutualOptions.${i}.data.value',
                        }
                    ]
                },
            },
        },
        clickChart: undefined,
        isFull: true,
        width: 300,
        height: 200,
        addDefaultValue: {
            yAxis: [{
                type: 'value',
            }],
            xAxis: [{
                type: 'value',
            }],
            series: [
                {
                    name: '',
                    lineStyle: {color: ''},
                    areaStyle: {color: ''},
                }
            ],
            columnOption: [
                {
                    field: 'field${i}',
                    title: '名称${i}',
                    align: 'center',
                    width: 100,
                }
            ],
            mutualOptions: [
                {
                    targetSource: '',
                    data: {
                        key: '',
                        value: ''
                    }
                }
            ],
            color: [
                ''
            ]
        },
        defaultOption: {
            'title': {'name': '主标题', 'formtype': 'name'},
            'legend': {'name': '图例组件', 'formtype': 'name'},
            'grid': {'name': '绘图网格', 'formtype': 'name'},
            'polar': {'name': '极坐标系', 'formtype': 'name'},
            'radiusAxis': {'name': '径向轴', 'formtype': 'name'},
            'angleAxis': {'name': '角度轴', 'formtype': 'name'},
            'radar': {'name': '雷达图坐标', 'formtype': 'name'},
            'tooltip': {'name': '提示框', 'formtype': 'name'},
            'toolbox': {'name': '工具栏', 'formtype': 'name'},
            'timeline': {'name': '时间轴', 'formtype': 'name'},
            "dataRange": {'name': '数据范围组件', 'formtype': 'name'}
        }
    },
    /**
     * 静态数据编辑器渲染
     * @param theme
     * @param done
     */
    getlineeditor: function () {
        //change事件remove现有
        $('.CodeMirror').remove()
        //change事件add新的编辑器
        Array.from(document.getElementsByName('datavalue')).forEach(function (val, i) {
            var editor = CodeMirror.fromTextArea(val, {
                indentUnit: 4,         // 缩进单位为4
                styleActiveLine: true, // 当前行背景高亮
                matchBrackets: true,   // 括号匹配
                mode: "javascript",
                theme: '3024-night',
                autofocus: true,
                lineWrapping: true,    // 自动换行
                extraKeys: {
                    "F2": function autoFormat(editor) {
                        var totalLines = editor.lineCount();
                        editor.autoFormatRange({line: 0, ch: 0}, {line: totalLines});
                    }//代码格式化
                }
            });
            // console.log(editor.options)
            //编辑框赋值
            editor.setValue(editor.getValue());
            //编辑框的change事件
            editor.on("change", function (editor, changes) {
                $.ajax({
                    url: '/update_chart',
                    data: {
                        showname: chart.config.showName,
                        chartname: chart.config.clickChart.name,
                        chartkey: JSON.stringify([['datavalue', jQuery.parseJSON(editor.getValue().replace(/\s+/g, ""))]])
                    },
                    type: 'post',
                    success: function (res) {
                    }
                })
            });
            //焦点离开事件
            editor.on('blur', function () {
                var p_form = $('[name=datavalue]').parents('form')
                var myChart = p_form.data('chartDom').data('echart')
                var chat = $.extend(true, {}, chart.config.clickChart)
                var datavalueby1 = editor.getValue()
                chat.datavalue = datavalueby1
                chart.createOption(chat, function (data, chat, datavalueby) {
                    refreshExtraOption(chat, data, datavalueby, myChart)
                });
            })
        })
        //重定义编辑器的高度
        $('.CodeMirror').css('height', '200px')
    },

    /**
     * api编辑器数据源渲染
     * @param theme
     * @param done
     */
    getlineeditor2: function () {
        //change事件remove现有
        $('.CodeMirror').remove()
        //change事件add新的编辑器，并且配置
        Array.from(document.getElementsByClassName('sql')).forEach(function (val, i) {
            var editor = CodeMirror.fromTextArea(val, {
                indentUnit: 4,         // 缩进单位为4
                styleActiveLine: true, // 当前行背景高亮
                matchBrackets: true,   // 括号匹配
                mode: "text/x-mysql",
                theme: '3024-night',
                autofocus: true,
                lineWrapping: true,    // 自动换行
                extraKeys: {
                    "F2": function autoFormat(editor) {
                        var totalLines = editor.lineCount();
                        editor.autoFormatRange({line: 0, ch: 0}, {line: totalLines});
                    }//代码格式化
                }
            });
            editor.on("change", function (editor, changes) {
                // console.log(val)
                val.innerHTML = editor.getValue();
            });
            //编辑框赋值
            editor.setValue(editor.getValue());
            $('.CodeMirror-measure').css('display', 'none')
            //

        })
    },

    /**
     * 设置echart主题
     * @param theme
     * @param done
     */
    setChartTheme: function (theme, done) {
        var editSwitch = chart.config.option.editSwitch;
        echarts.registerTheme(theme, echartTheme);
        typeof done === "function" && done(editSwitch)
    },
    /**
     * 加载
     */
    //获得图层
    Gettuceng: function (data) {
        $('.jq22').empty()
        if (data && data['show']) {
            var datas = []
            $('.jq22').append('<ol class="dd-list">')
            $.each(data['show']['data']['charts'], function (i, val) {
                if (val.z_index == null) {
                    val.z_index = 0
                }
                datas.push({
                    z_index: val.z_index,
                    chartDomId: val.chartDomId,
                    name: val.name
                })
            })
            var compare = function (obj1, obj2) {
                var val1 = obj1.z_index;
                var val2 = obj2.z_index;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
            $.each(datas.sort(compare), function (i, val) {
                $('.jq22').children('.dd-list').append('<li class="dd-item" data-id=' + i + '><div data-id="' + val.chartDomId + '" class="dd-handle nihao" style="font-size: 10px">' + val.name + '')
            })
        }
        $('.nihao').click(function () {
            $('#' + $(this).data('id') + '').trigger('click');
        })

    },
    //加载
    init: function (option) {
        chart.config.option = $.extend({}, chart.config.option, option);
        chart.config.chartLoader = option.chartLoader;
        $.ajax({
            url: '/get_shows',
            type: 'post',
            data: {name: chart.config.showName, op: 'edit'},
            success: function (data) {
                chart.Gettuceng(data)
                chart.setPropertyCache(function () {
                    chart.config.showData = data;
                    chart.renderShow(data);
                    chart.config.lineConnector = new Line($('.drag-box'));
                    typeof option['done'] === 'function' && option['done']();
                });
            }
        })
    },
    /**
     * 放置
     * @param done
     * @param type
     */
    setPropertyCache: function (done, type) {
        // 请求参数
        var data = {};
        type && (data['type'] = type);
        // 根据type请求支持的属性 没有type请求所有类型的属性
        $.ajax({
            url: 'get_property',
            type: 'post',
            data: data,
            success: function (data) {
                // 迭代所有的属性
                $.each(data, function (i, pro) {
                    // 赋值所有的type
                    chart.config.typeCache[pro['type']] = pro['properties'];
                    chart.config.chartTypeCache.push({value: pro['type'], text: pro['name']})
                });
                typeof done === 'function' && done();
            }
        })
    },
    /**
     * 根据数据加载
     * @param data
     */
    renderShow: function (data) {
        // if(chart.config.showData['show']) {
        chart.rendPage();
        if (chart.config.showData['show']) {
            chart.renderCharts(data);
        }
    },
    /**
     * 加载动态页面
     */
    rendPage: function () {
        // console.log(chart.config)
        // if (chart.config.showData.show.bg_image == "null") {
        // } else {
        chart.rendPageSetting()
        // }
        if (chart.config.option.editSwitch) chart.rendPageForm()
    },
    rendPageSetting: function () {
        // console.log()
        if (chart.config.showData.show.bg_image && chart.config.showData.show.bg_image.indexOf('.') < 0) {
            // console.log(1111)
            chart.config.chartLoader.css({
                'background-image': 'url("/show_image?id=' + chart.config.showData['show']['bg_image'] + '")',
                'background-color': chart.config.showData.show.bg_color,
                'backgroundRepeat': "no-repeat",
                'backgroundSize': '100% 100%'
            })
        } else {
            chart.config.chartLoader.css({
                'background-image': "url(/static/images/bg/" + (chart.config.showData['show'] ? (chart.config.showData['show']['bg_image'] || 'img1.jpg') : '/static/images/bg/img1.jpg') + ") ",
                'background-size': '100% 100%',
            })
        }

        if (chart.config.showData.show && chart.config.showData.show.bg_image == "null") {
            chart.config.chartLoader.css({
                'background-image': '',
                'background-color': chart.config.showData.show.bg_color,
            })
        }
        chart.renderPageScreen();
    },
    renderPageScreen: function (show) {
        show = show || chart.config.showData;
        var screenWidth = show.show ? show.show.screen ? (show.show.screen.width || 1920) : 1920 : 1920,
            screenHeight = show.show ? show.show.screen ? (show.show.screen.height || 1080) : 1080 : 1080;
        chart.config.scale = ((chart.config.option.editSwitch ? $('#chartCanvas')[0].offsetWidth - 120 : $('html')[0].offsetWidth) / parseInt(screenWidth)).toFixed(6)
        chart.config.scaleHeight = ((chart.config.option.editSwitch ? $('#chartCanvas')[0].offsetWidth - 120 : $('html')[0].offsetWidth) / parseInt(screenWidth)).toFixed(6)
        chart.config.chartLoader.css(
            {
                width: screenWidth,
                height: screenHeight,
                transform: "scale(" + chart.config.scale + " ," + chart.config.scaleHeight + ")"
            });
        //放大缩小功能
        $('#range').val(chart.config.scale)
        $('#range').mouseup(function () {
            chart.config.scale = $(this).val()
            $('#chartLoader').css('transform', 'scale(' + $(this).val() + ',' + $(this).val() + ')')
        })
    },
    /**
     * 加载页面设置表单
     */
    rendPageForm: function () {
        $('#dataTab').hide();
        $('#mutualTab').hide();
        $('#propertyTab').find('a').trigger('click');
        $('#attributesTab').hide();
        chart.config.propertyLoader.html('')
        this.config.form = $('<form class="form-horizontal">').appendTo(chart.config.propertyLoader).data('chartDom', chart.config.chartLoader).data('isPage', true)
        $.ajax({
            url: 'get_page',
            type: 'post',
            success: function (data) {
                data[0].pageSettingOptions.setting.screenShot.formElement.onClick = (function () {
                        return function (ev) {
                            $(ev.dom).text('截取封面中...').attr('disabled', true);
                            var cloneDiv = $('<div style="height: 1px;overflow: hidden;">').append($('#chartLoader').deepClone().css('transform', 'scale(1)')).appendTo($('body'))
                            html2canvas(cloneDiv.find('#chartLoader')[0], {
                                allowTaint: true,
                                useCORS: true,
                                taintTest: true,
                            }).then(function (canvas) {
                                cloneDiv.remove()
                                var fileName = new Date().getTime() + '.png';
                                // $('body').append(canvas)
                                canvas.toBlob(function (blob) {
                                    var file = new File([blob], fileName),
                                        formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('name', chart.config.showName);
                                    formData.append('update', '{}');
                                    $.ajax({
                                        url: '/update_show',
                                        type: 'post',
                                        contentType: false,
                                        processData: false,
                                        data: formData,
                                        success: function (data) {
                                            chart.config.showData.show.bg_img = data.bg_img;
                                            $(ev.imageDom).attr('src', data.bg_img)
                                            $(ev.dom).text('截取封面').attr('disabled', false);
                                        }
                                    });
                                });
                            }).catch(function (e) {
                                console.error('error', e);
                            });
                        }
                    }
                )()
                chart.rendFormByOptionValue(data[0].pageSettingOptions, chart.config.showData, chart.config.propertyLoader, chart.config.form)
            }
        })
    },
    /**
     * 加载图表
     * @param data
     */
    renderCharts: function (data) {
        $.each(data['show']['data']['charts'], function (i, ch) {
            chart.renderChartForm(ch)
        })
        // 农委定时器
        if (!chart.config.option.editSwitch) {
            var c_charts_1 = ['#echart-kKdpE90Upg', '#echart-RkyNY0F4l1', '#echart-Af7g308znb', '#echart-51AB23A046']
            var c_charts_2 = ['#echart-kKdpE90Upg', '#echart-D0C9786C4E', '#echart-RkyNY0F4l1', '#echart-39CB6741BC',
                '#echart-Af7g308znb', '#echart-C548CBF76F', '#echart-51AB23A046', '#echart-05EAC468FC', '#echart-7DEF620610']
            var loop_charts = [];
            loop_charts = c_charts_2;
            $.each(c_charts_2, function (i, obj) {
                if (!$(obj + '.echart')[0]) {
                    loop_charts = c_charts_1
                    return false;
                }
            })
            var loop = 0
            window.setInterval(function () {
                if (loop === loop_charts.length) {
                    loop = 0;
                }
                $(loop_charts[loop]).trigger('click');
                loop++;
            }, 5000)
        }
    },
    /**
     * 首次加载图表
     * @param chat
     * @param isRenderForm
     */
    renderChartForm: function (chat, isRenderForm, loader) {
        // console.log(chat)
        if (!carousel.eidtSwitch) {
            //列出所有index
            if (chat['z_index'] == null) {
                chat['z_index'] = 0
            }
            chart.config.zindex_data.push(chat['z_index'])
            Array.prototype.max = function () {
                var max = this[0];
                this.forEach(function (ele, index, arr) {
                    if (ele > max) {
                        max = ele;
                    }
                })
                return max;
            }
            //取所有index重的最大值
            var max_index = parseInt(chart.config.zindex_data.max());
            // console.log(max_index)
            //判断是否是新增，新增就是在最大的index+1
            if (isRenderForm === true) {
                chat['z_index'] = max_index + 1;
                $.ajax({
                    url: '/update_chart',
                    data: {
                        showname: chart.config.showName,
                        chartname: chat.name,
                        chartkey: JSON.stringify([['z_index', max_index + 1]])
                    },
                    type: 'post',
                    success: function (res) {
                        chart.config.showData.show.data.charts.push(res)
                        var data = chart.config.showData
                        chart.Gettuceng(data)
                    }
                })
            }
        }
        chart.createOption(chat, function (data, chat, datavalue) {
            // console.log(chat)
            // 兼容轮播代码不存在名称命名一个随机名称
            chat['name'] || (chat['name'] = utils.randomString(chat['charttype'], 6));
            if (chart.isChart(chat['charttype'])) {
                chart.renderEChart(chat, data, isRenderForm, datavalue, loader,);
            } else {
                chart.renderComponents(chat, data, isRenderForm, loader);
            }
        });
    },
    renderComponents: function (chat, data, isRenderForm, loader) {
        // obj兼容问题
        if (chat['charttype'].indexOf("obj") != -1) {
            chat['charttype'] = "obj"
        }
        var method = chat['charttype'].replace(chat['charttype'].charAt(0), chat['charttype'].charAt(0).toUpperCase()),
            element = typeof render['renderComponentWith' + method] === "function" ? render['renderComponentWith' + method](chat, data, isRenderForm, loader) : chart.renderComponent(chat, data, isRenderForm, loader)
        return element

    },

    renderComponent: function (chat, data, isRenderForm, loader, addClass, index) {
        var chart_p, drag_p, toolBar, chartLine, id = '';
        !chart.config.charts[chat['name']] && (id = chat['chartDomId'] ? chat['chartDomId'] : 'echart' + new Date().getTime(), chart_p = $('<div id="' + id + '" class="echart " index="' + (index ? index : "") + '">')
                .css('width', chat['w'] - 2).css('height', chat['h']).addClass(addClass || ''),
                chart.pushCache(chat),

                chart_p.data('type', chat['charttype']),
                drag_p = $('<div class="drag-box drag-box-hover" id="' + (chat['dragDomId'] || '') + '">')
                    .css('width', chat['w']).css('height', chat['h']).css('zIndex', chat['z_index'] || (carousel.eidtSwitch ? carousel.CZIndex + 1 : 'auto'))
                    .css('left', parseInt(chat['x'])).css('top', parseInt(chat['y']))
                    .data('chartName', chat['name']).append(chart_p)
                    .appendTo(loader ? loader : chart.config.chartLoader),
            utils.isProgress(chat) && chart_p.css({overflow: 'visible'}),
                drag_p.data('echart', chart_p),
            chart.config.option.editSwitch && (
                toolBar = chart.config.toolBar.clone(),
                    chartLine = chart.config.chartLine.clone(),
                    toolBar.children().each(function () {
                        $(this).data('chartName', chat['name'])
                    }),
                    drag_p.append($('<div class="drag-coor">')).prepend(chartLine).prepend(toolBar),
                    drag_p.addClickEvent(),
                    drag_p.addHoverEvent(),
                    drag_p.draggable(),
                    drag_p.keything())
                ,
            chart.config.option.editSwitch || (
                drag_p.css('cursor', 'default'),
                    drag_p.removeClass('drag-box-hover'),
                    chart_p.css('cursor', 'default'),
                    chart_p.setClick(chat)
            ),
                chart.config.charts[chat['name']] = chart_p,
            chat['mutual'] && (chart.bindMutualFunctions(chat, drag_p))
        );

        chart.config.charts[chat['name']] && (chart_p = chart.config.charts[chat['name']]);

        request.serialize(chat)

        utils.isTable(chat) && (render.initTable(chat),
            chart_p.bootstrapTable(chat.tableOption))
        chart_p.setOption(data, chat);
        isRenderForm && (chart.rendFormByChart(chat, drag_p))
        // console.log(11111111111111111111111111111)
        return chart_p
    },
    /**
     * 是否是图表类
     * @param chartType
     * @returns {boolean}
     */
    isChart: function (chartType) {
        return $.inArray(chartType, chart.config.chartTypes) > -1;
    },

    renderEChart: function (chat, data, isRenderForm, datavalueby, loader) {
        isechart(chat, data, isRenderForm, datavalueby, loader);
    },
    // 是否轮显
    setRound: function (op) {
        var isRound = false;
        // 迭代系列
        $.each(op.option.series, function (i, sery) {
            // 清除定时器
            if (!chart.config.intervals[i])
                chart.config.intervals[i] = {};
            if (chart.config.intervals[i]['interval']) {
                window.clearInterval(chart.config.intervals[i]['interval'])
            }
            if (sery.isRound) {
                var roundData = op.datavalue[i];
                // console.log(op, '------', chart.config.intervals)
                chart.config.intervals[i]['index'] = (op.indexes && op.indexes[i]) ? op.indexes[i].index : 0;
                // 默认执行一次
                if (chart.config.intervals[i]['index'] >= roundData.length) {
                    chart.config.intervals[i]['index'] = 0;
                }
                // sery.data = [roundData[chart.config.intervals[i]['index']]];
                // chart.config.intervals[i]['index']++;
                // op.option.geo.zoom = 1
                // op.myChart.setOption(op.option);
                // 开启轮显定时器
                chart.config.intervals[i]['interval'] = window.setInterval(function () {
                    if (chart.config.intervals[i]['index'] >= roundData.length) {
                        chart.config.intervals[i]['index'] = 0;
                    }
                    sery.data = [roundData[chart.config.intervals[i]['index']]];
                    chart.config.intervals[i]['index']++;
                    if (sery.roundEffect)
                        chart.resetMapOption(op)
                    else {
                        op.myChart.setOption(op.option)
                    }
                }, 5000);
                isRound = true;
            }
        });
        // 不轮显的操作
        if (!isRound) {
            op.myChart.setOption(op.option);
        }
    },
    resetMapOption: function (op) {
        if (op.option.geo) {
            console.log(op)
            op.option.geo.zoom = 0.4;
            op.myChart.clear();
            op.myChart.setOption(op.option);
            chart.zoomAnimation(op)
        }
    },
    setMapHover: function (op) {
        // console.log(op)
        chart.config.mapZoomed = true, chart.config.mapName = undefined
        var isRound = false, cloneOption = $.extend(true, {}, op.option);
        op.myChart.off('mouseover')
        op.myChart.on('mouseover', function (params) {
            // console.log(chart.config.mapZoomed, '+++++++')
            if (params.name && (!chart.config.mapName || chart.config.mapName != params.name)) {
                $.each(cloneOption.series, function (i, sery) {
                    if (sery.isRound) {
                        if (chart.config.intervals[i]['interval']) {
                            window.clearInterval(chart.config.intervals[i]['interval'])
                        }
                        isRound = true;
                    }
                    var roundValue = $.extend(true, {}, op.datavalue[i])
                    sery.data = $.map(roundValue, function (val) {
                        if (val.name == params.name) {
                            val.symbolSize = (val.symbolSize || sery.symbolSize || 10);
                            return val;
                        }
                    });
                });
                op.myChart.setOption(cloneOption);
            }
        });
        op.myChart.off('mouseout')
        op.myChart.on('mouseout', function () {
            if (chart.config.mapZoomed)
                if (isRound) {
                    chart.setRound($.extend({}, {indexes: chart.config.intervals}, op))
                } else {
                    op.myChart.setOption(op.option);
                }
        });
    },
    zoomAnimation: function (op) {
        chart.config.mapZoomed = false;
        var count = null;
        var zoom = function (per) {
            if (!count) count = per;
            count = count + per;
            // console.log(per,count);
            op.myChart.setOption({
                geo: {
                    zoom: count
                }
            });
            if (count < 1) window.requestAnimationFrame(function () {
                zoom(0.2);
            })
            else {
                chart.config.mapZoomed = true;
            }
        };
        window.requestAnimationFrame(function () {
            zoom(0.2);
        });
    },
    /**
     * 存放缓存
     * @param chat
     */
    pushCache: function (chat) {
        if (chat['chartDomId']) {
            chart.config.elementCacher.push({
                'value': chat['chartDomId'],
                text: chat['name'],
                'type': chat['charttype']
            })
        }
    },
    removeCache: function (value) {
        $.each(chart.config.elementCacher, function (i, obj) {
            if (obj && value === obj['value']) {
                chart.config.elementCacher.splice(i, 1)
            }
        })
    },
    /**
     * 根据表单数据设置数据
     * @param formData
     * @param option
     * @returns {*}
     */
    setOptionByFormData: function (formData, option) {
        // console.log(formData)
        $.each(formData, function (optionKey, optionVal) {
            var deepKeys = optionKey.indexOf('.') > -1 ? optionKey.split('.') : [optionKey];
            $.each(deepKeys, function (j, key) {
                if (j !== deepKeys.length - 1)
                    chart.setValue(option, j, deepKeys)
                else {
                    chart.setValue(option, j, deepKeys, optionVal)
                }
            })
        })
        return option
    },

    getOptionValue: function (option, keys) {
        // console.log(option, 111111111, keys)
        if (!keys) return [];
        var result = [];
        keys = keys.indexOf('-') > -1 ? keys.split('-') : [keys];
        // console.log(keys, '-------', option)
        $.each(keys, function (i, key) {
            // (key.indexOf('data') !== 0 && key.indexOf('show') !== 0) && (key = 'data.' + key)
            // console.log(key)
            var deepKeys = key.indexOf('.') > -1 ? key.split('.') : [key];
            var str = 'option';
            for (var i = 0; i <= deepKeys.length - 1; i++) {
                str += '["' + deepKeys[i] + '"]';
            }
            try {
                var ev = eval(str);
                (ev === undefined || ev === null) || result.push(ev);
            } catch (e) {
                // console.log(str + ': 格式错误', e)
            }
        })
        return result;
    },
    /**
     * 动态设置值
     * @param option
     * @param j
     * @param deepKeys
     * @param val
     */
    setValue: function (option, j, deepKeys, val) {
        // console.log(option, j, deepKeys, val)
        var str = 'option', op = 'option'
        for (var i = 0; i <= j; i++) {
            str += '["' + deepKeys[i] + '"]'
        }
        if (!val) {
            if (!eval(str)) {
                eval((str + '= {}'))
            } else if (val === false) {
                eval((str + '= val'))
            } else if (val == '') {
                eval((str + '= val'))
            } else if (val === null) {
                for (var i = 0; i <= j - 1; i++) {
                    op += '["' + deepKeys[i] + '"]'
                }
                var index = deepKeys[deepKeys.length - 1];
                // console.log(index)
                if ($.isArray(eval(op))) {
                    var operate = op + '.splice(' + index + ', 1)';
                    eval((operate))
                } else if ($.isPlainObject(eval(op))) {
                    var operate = 'delete ' + op + '[' + index + ']';
                    eval((operate))
                }
            }
        } else {
            eval((str + '= val'))
        }
    },
    /**
     * 根据数据加载表单
     * @param chat
     * @param chartDom
     */
    rendFormByChart: function (chat, chartDom, con) {
        // console.log(4444444444444444444444)
        // console.log(chat,chat['notsource'],11111111111111,chat['source'])
        chart.config.chartDom = chartDom
        chart.config.clickChart = chat
        $('#dataTab').show();
        $('#mutualTab').show();
        $('#propertyTab').find('a').trigger('click');
        $('#attributesTab').show();
        //只显datavalue，不限时属性栏目
        chat['notProperty'] || chart.rendPropertyForm(chat, chartDom, con)
        chat['notProperty'] && ($('#propertyTab').hide(), $('#dataTab').find('a').trigger('click'));
        //只显示图片，不显示数据
        chat['notsource'] || chart.rendDataForm(chat, chartDom);
        chat['notsource'] && $('#dataTab').hide();
        //显示图片显示数据
        // chat['source'] || chart.rendDataForm(chat, chartDom);
        // chat['source'] && $('#dataTab').show();
        //交互
        chat['mutual'] && (chart.rendMutualForm(chat, chartDom));
        chat['mutual'] || $('#mutualTab').hide();
        //高级属性
        chat['attributes'] && (chart.rendattributesForm(chat, chartDom));
        chat['attributes'] || $('#attributesTab').hide();
    },
    /**
     * 加载属性表单
     * @param chat
     * @param chartDom
     */
    rendPropertyForm: function (chat, chartDom, con) {
        $('#propertyTab').show(), $('#propertyTab').find('a').trigger('click')
        chart.config.propertyLoader.html('')
        this.config.form = $('<form class="form-horizontal"  id="' + new Date().getTime() + '" onkeydown="if(event.keyCode==13){return false;}">').data('chartName', chat['name']).data('chartDom', chartDom || '').data('con', con || '').appendTo(chart.config.propertyLoader)
        chart.rendFormByOptionValue($.extend({}, chat.data), chat, this.config.form)
    },
    /**
     * 加载数据表单
     * @param chat
     * @param chartDom
     */
    rendDataForm: function (chat, chartDom, con) {
        chart.config.dataLoader.html('')
        this.config.form = $('<form class="form-horizontal" id="' + new Date().getTime() + '" onkeydown="if(event.keyCode==13){return false;}">').data('chartName', chat['name']).data('chartDom', chartDom || '').appendTo(chart.config.dataLoader)
        chart.rendFormByOptionValue($.extend({}, this.config.dataSettingOptions), chat, this.config.form)
        typeof this.config.dataSettingOptions['onload'] === 'function' && this.config.dataSettingOptions['onload']()
    },

    /**
     * 加载交互表单
     * @param chat
     * @param chartDom
     */
    rendMutualForm: function (chat, chartDom) {
        chart.config.mutualLoader.html('')
        this.config.form = $('<form class="form-horizontal" id="' + new Date().getTime() + '" onkeydown="if(event.keyCode==13){return false;}">').data('chartName', chat['name']).data('chartDom', chartDom || '').appendTo(chart.config.mutualLoader)
        chart.config.elementCache = $.extend(true, {}, chart.config.elementCacher);
        // var cache1 = $.extend(true, {}, chart.config.elementCacher);
        // 验证缓存的图表类型是否是允许的类型
        chart.config.elementCache = chart.validateOptionDisable(chart.config.elementCache);
        // 渲染交互表单
        chart.rendFormByOptionValue($.extend({}, this.config.mutualSettingOptions), chat, this.config.form)
        // gc helper
        cache = null
    },

    /**
     * 加载高级设置表单
     * @param chat
     * @param chartDom
     */
    rendattributesForm: function (chat, chartDom) {
        chart.config.attributesLoader.html('')
        this.config.form = $('<form class="form-horizontal" id="' + new Date().getTime() + '" onkeydown="if(event.keyCode==13){return false;}">').data('chartName', chat['name']).data('chartDom', chartDom || '').appendTo(chart.config.attributesLoader)
        // console.log(this.config.form,chat.settingattributes)
        // console.log(chart.config.clickChart)
        chart.rendFormByOptionValue($.extend({}, chat.settingattributes), chat, this.config.form)
    },


    /**
     * 验证缓存的图表类型是否是允许的类型
     * @param cache
     * @returns {Array}
     */
    validateOptionDisable: function (cache) {
        // 根据点击的图标类型取出允许的类型
        var allowSelected = chart.config.allowSelectedOption[chart.config.clickChart['charttype']] || [],
            result = [];
        // 判断缓存的图表类型是否在允许的类型，不允许则disabled
        $.each(cache, function (i, obj) {
            // console.log(cache)
            if (
                // 去除自身
                (allowSelected === 'all' && chart.config.clickChart['chartDomId'] === obj['value']) ||
                (allowSelected !== 'all' && ($.inArray(obj['type'], allowSelected) === -1
                    || chart.config.clickChart['chartDomId'] === obj['value']))) {
                obj['disabled'] = true;
            }
            // 转化成数组类型
            result.push(obj)
        });
        // gc helper
        allowSelected = null;
        return result
    },
    /**
     * 创建与数据结构类似的值
     * @param option
     * @param optionValue
     * @param loader
     */
    rendFormByOptionValue: function (option, optionValue, loader) {
        // console.log(option,optionValue,22222222222222)
        this.findOptionValue(option, optionValue, loader);
        loader.find('.panel-heading').trigger('click');
    },

    bindMutualFunctions: function (chat, chartDom) {
        var method = chat['charttype'].replace(chat['charttype'].charAt(0), chat['charttype'].charAt(0).toUpperCase()),
            element = typeof chart['bindMutualFunctionWith' + method] === "function" ? chart['bindMutualFunctionWith' + method](chat, chartDom) : chart.bindMutualFunction(chat, chartDom)
    },
    bindMutualFunction: function (chat, chartDom) {
        if (chat.data.mutualOptions && (Object.keys(chat.data.mutualOptions).length > 0 || chat.data.mutualOptions.length > 0)) {
            // console.log(chartDom.children(".echart").removeClass('echart'))
            if (chart.isChart(chat['charttype'])) {
                chartDom.data('echart').on('click', function (pa) {
                    chart.mutualFunction(chat, chartDom, pa);
                });
            } else {
                chartDom.find('.echart').data('mutualFunction', (function () {
                    return function (chat, chartDom) {
                        chart.mutualFunction(chat, chartDom)
                    };
                })(chat, chartDom));

            }
        }


    },
    /**
     * 交互函数
     * @param chat
     * @param chartDom
     * @param pa
     */
    mutualFunction: function (chat, chartDom, pa) {
        // var a_charts = [
        //     '#echart-CC766A96E2',
        //     '#echart-T9V1lWoLwh',
        //     '#echart-FF45378D4D',
        //     '#echart-4AFC4D1C89',
        //     '#echart-62A625D1AA',
        //     '#echart-A784465EC8',
        //     '#echart-5F9217FAFB',
        //     '#echart-D115F9C024',
        // ];
        // $.each(a_charts, function (i, val) {
        //     //判断点击的是标题，取消css的color
        //     if (!pa && chat.chartDomId !== "echart-S8UmqKn0kH") {
        //         $(val).css('color', 'rgb(73, 250, 250)');
        //     }
        //     chartDom[0].id == $(val).parents('.drag-box')[0].id || $(val).parents('.drag-box').removeClass('Ortitle');
        // })
        // if (chat.charttype == 'title' && chartDom.hasClass('Ortiltle') && chat.chartDomId !== "echart-S8UmqKn0kH") {
        //     chartDom.find('.echart').css('color', 'rgb(73, 250, 250)');
        //     chartDom.removeClass('Ortiltle')
        // } else {
        //     chartDom.addClass('Ortiltle')
        //     chartDom.find('.echart').css('color', '#099efb')
        // }
        // if (chat.charttype == 'title' && chat.apidatavalue) {
        //     var date1 = chat.apidatavalue
        // } else {
        //     var date1 = chat.datavalue
        // }
        // console.log(typeof (chartDom.attr('pie')) == "string")
        $.each(chat.data.mutualOptions, function (i, option) {
            var chart_id = option.targetSource ? option.targetSource : '',
                myChart, params = {}, echart_chart, url;
            chart_id && ($('#' + chart_id)[0] && (
                myChart = $('#' + chart_id).parents('.drag-box').data('echart'),
                option.data && (
                    pa && (params[option.data.key] = pa.data[option.data.value]),
                    pa || (params[option.data.key] = date1),
                        echart_chart = $('#' + chart_id).data('chart'),
                    chartDom.hasClass('Ortiltle') && (url = utils.createURL(echart_chart['api']['url'], params)),
                    chartDom.hasClass('Ortiltle') || (url = utils.createURL(echart_chart['api']['url'])),
                        // 请求拼接好的字符串
                    url && $.ajax({
                        url: '/getPostByUrl',
                        // url编码
                        data: {url: encodeURI(url)},
                        type: 'post',
                        success: function (data) {
                            // 获取组装的属性
                            echart_chart.apidatavalue = data
                            try {
                                echart_chart.apidatavalue = JSON.parse(data)
                            } catch (e) {
                            }
                            request.createOptionByStatic(echart_chart, function (data1, chat, datavalueby) {
                                if (chart.isChart(chat['charttype'])) {
                                    refreshExtraOption(echart_chart, data1, datavalueby, myChart)

                                } else {
                                    myChart.setOption(data1, chat, $('<input name="html">'))
                                }
                            }, true)
                        }
                    })
                )))
        })
        // if (pa) {
        //     if (pa && typeof (chartDom.attr('pie')) == "string") {
        //         chartDom.removeAttr('pie')
        //     } else {
        //         chartDom.attr('pie', pa.data.name)
        //     }
        // }
        // 写死的，交付农委的项目，完成后删除
        // var c_charts = [
        //     '#echart-E0D11461B4',
        //     '#echart-AC13F8192E',
        //     '#echart-DC421D938D',
        //     '#echart-2B3436FB19',
        //     '#echart-CF4876F4A9',
        //     '#echart-51AB23A046',
        //     '#echart-90E40FEE0B',
        //     '#echart-1405F9E9F4',
        //     '#echart-AC2F2BB93E',
        //     '#echart-54C758C572',
        //     '#echart-D0C9786C4E',
        //     '#echart-39CB6741BC',
        //     '#echart-C548CBF76F',
        //     '#echart-05EAC468FC',
        //     '#echart-kKdpE90Upg',
        //     '#echart-RkyNY0F4l1',
        //     '#echart-Af7g308znb',
        //     '#echart-51AB23A046',
        //     '#echart-7DEF620610',
        // ];
        // $.each(c_charts, function (i, val) {
        //     $(val) || c_charts.slice(i, 1);
        //     $(val).data('color') && $(val).css('color', 'rgb(73, 250, 250)');
        // })
    },
    /**
     * 递归json数据创建元素
     * @param option
     * @param optionValue
     * @param loader
     */
    findOptionValue: function (option, optionValue, loader) {
        // console.log(1)
        $.each(option, function (key, val) {
            // console.log(key)
            if (key === 'pages')
                return true;
            if (!val || val['notPanel'] || typeof val === 'string') {

            } else if (chart.config.defaultOption[key]) {
                var el = chart.config.defaultOption[key]
                // console.log(key, val)
                loader = chart.createFormElement(el, '', chart.config.form);
            }
            if (typeof key === 'string' && key.indexOf('formElement') > -1) {
                var value = [], chartKey = '';
                if (val['chartkey']) if (val['isFull'])
                    chartKey = val['chartkey']
                else {
                    chartKey = 'data.' + val['chartkey']
                }
                // console.log(chartKey,optionValue)
                value = chart.getOptionValue(optionValue, chartKey) || []
                if (utils.isEmpty(value)) {
                    utils.isEmpty(value) && (value = [])
                }

                !$.isArray(value) && (value = [value]);
                if (val['formtype'] === 'name') {
                    loader = chart.config.form;
                    // console.log(value)
                    loader = chart.createFormElement(val, value, loader);
                } else {
                    // console.log(val, value)
                    chart.createFormElement(val, value, loader);
                }
            } else if ($.isPlainObject(val) || $.isArray(val)) {
                chart.findOptionValue(val, optionValue, loader)
            }
        })
    },
    /**
     * 创建表单元素
     * @param element
     * @param value
     * @param loader
     * @returns {boolean|*}
     */
    createFormElement: function (element, value, loader) {
        var method = element['formtype'].replace(element['formtype'].charAt(0), element['formtype'].charAt(0).toUpperCase()),
            element = typeof createElement['createElementBy' + method] === "function" && createElement['createElementBy' + method](element, value, loader)
        return element
    },
    /**
     * 更改数据后刷新图形并保存
     * @param element
     */
    refreshChart: function (element) {
        // console.log(chart.config)
        if (element.hasClass('sql')) {
        } else {
            var chat = chart.config.clickChart
            var p_form = element.parents('form'),
                isPage = p_form.data('isPage'),
                myChart = p_form.data('chartDom'),
                con = p_form.data('con');
            if (isPage) {
                myChart.refreshPage(element)
                element.attr('name') && chart.refreshChartData('', chart.config.showData)
            } else if (chart.isChart(chart.config.clickChart['charttype'])) {
                chart.refreshEChart(element)
                //位置的重定位(echart改变图表大小需要改变多个div的大小)
                var chat1 = chart.config.chartDom.children('.echart')
                if (element && element.attr('name') == "w") {
                    chart.config.chartDom.css('width', chat.w + 'px');
                    chart.config.chartDom.children('.echart').css('width', chat.w + 'px');
                    chat1.children().css('width', chat.w + 'px');
                    chat1.children().children().css('width', chat.w + 'px');
                } else if (element && element.attr('name') == "h") {
                    chart.config.chartDom.css('height', chat.h + 'px');
                    chart.config.chartDom.children('.echart').css('height', chat.h + 'px');
                    chat1.children().css('height', chat.h + 'px');
                    chat1.children().children().css('height', chat.h + 'px');
                } else if (element && element.attr('name') == "x") {
                    chart.config.chartDom.css('left', chat.x + 'px');
                    // chart.config.chartDom.children('.echart').css('left', chat.x + 'px');
                    // chat1.children().css('left', chat.x + 'px');
                    // chat1.children().children().css('left', chat.x + 'px');
                } else if (element && element.attr('name') == "y") {
                    chart.config.chartDom.css('top', chat.y + 'px');
                    // chart.config.chartDom.children('.echart').css('top', chat.y + 'px');
                    // chat1.children().css('top', chat.y + 'px');
                    // chat1.children().children().css('top', chat.y + 'px');
                }
                element.attr('name') && chart.refreshChartData(element.parents('form').data('chartName'))
            } else if (!utils.isLine(chart.config.clickChart)) {
                chart.refreshComponents(element)
                element.attr('name') && chart.refreshChartData(element.parents('form').data('chartName'))
            } else {
                var formData = {}, val = utils.parseValue(element);
                if (!element.data('notOption'))
                    formData['data.' + element.attr('name')] = element.attr('type') !== 'checkbox' ? val : element.is(':checked');
                else
                    formData[element.attr('name')] = element.attr('type') !== 'checkbox' ? val : element.is(':checked');
                chart.setOptionByFormData(formData, chart.config.clickChart);
                chart.config.lineConnector.refreshLine(chart.config.clickChart, con, element, true)
            }
        }
    },
    /**
     * 刷新百度图表
     * @param element
     */
    refreshEChart: function (element) {
        // console.log(element)
        var p_form = element.parents('form')
        // console.log(chart.config)
        var myChart = p_form.data('chartDom').data('echart')
        var formData = {}, val = utils.parseValue(element);
        if (!element.data('notOption'))
            formData['data.' + element.attr('name')] = element.attr('type') !== 'checkbox' ? val : element.is(':checked');
        else
            formData[element.attr('name')] = element.attr('type') !== 'checkbox' ? val : element.is(':checked');
        chart.setOptionByFormData(formData, chart.config.clickChart);
        chart.setExtraOptionByElement(element);
        var chat = $.extend(true, {}, chart.config.clickChart)
        chart.createOption(chat, function (data, chat, datavalueby) {
            // console.log(data, chat, datavalueby)
            refreshExtraOption(chat, data, datavalueby, myChart)
            //圆饼图的点击事件关闭
            if (chart.config.chartDom && chart.config.chartDom.data) {
                //弹窗
                if (chat && chat.data.click == false) {
                    chart.config.chartDom.data('echart').off('dblclick', clickEvent.Clicktwo);
                } else {
                    chart.config.chartDom.data('echart').off('dblclick', clickEvent.Clicktwo);
                    chart.config.chartDom.data('echart').on('dblclick', clickEvent.Clicktwo);
                }
                //跳转
                if (chat && chat.data.run == false) {
                    chart.config.chartDom.data('echart').off('dblclick', clickEvent.Clickrun);
                } else {
                    chart.config.chartDom.data('echart').off('dblclick', clickEvent.Clickrun);
                    chart.config.chartDom.data('echart').on('dblclick', clickEvent.Clickrun);
                }
            }
        });
        chat = null;
    },
    /**
     * 刷新组件
     * @param element
     */
    refreshComponents: function (element) {
        var p_form = element.parents('form'),
            myChart = p_form.data('chartDom')[0] ? (p_form.data('chartDom').data('echart') || p_form.data('chartDom')) : p_form.data('chartDom');
        var formData = {}, val = utils.parseValue(element);
        if (!element.data('notOption'))
            formData['data.' + element.attr('name')] = element.attr('type') !== 'checkbox' ? val : element.is(':checked');
        else
            formData[element.attr('name')] = element.attr('type') !== 'checkbox' ? val : element.is(':checked');
        chart.setOptionByFormData(formData, chart.config.clickChart);
        var chat = $.extend(true, {}, chart.config.clickChart)
        chart.createOption(chat, function (data, chat) {
            myChart.setOption(data, chat, element);
        });
        chat = null;
    },
    /**
     * 保存图表数据
     * @param chartName
     */
    refreshChartData: function (chartName, chat) {
        var data = $.extend({}, true, chat || chart.config.clickChart);
        request.serialize(data, true);
        data['show'] && (data = data['show']);
        if (carousel.eidtSwitch) {
            $.ajax({
                url: '/get_carouse_charts',
                data: {
                    'showname': chart.config.showName,
                    carouse_name: carousel.$carouse.parent('.drag-box').data('chartName'),
                    chartname: chartName,
                    op: 'edit',
                    page_index: carousel.$carouse.data('pageIndex'),
                    update: JSON.stringify(data),
                },
                type: 'post',
                success: function (data) {
                }
            });
        } else if (!utils.isLine(chat)) {
            // console.log(data)
            $.ajax({
                url: '/update_show',
                type: 'post',
                data: {
                    name: chart.config.showName,
                    chartname: chartName,
                    update: JSON.stringify(data)
                },
                success: function (data) {
                }
            })
        } else {
        }
    },
    /**
     * 根据元素设置额外参数
     * @param element
     */
    setExtraOptionByElement: function (element) {
        var name = element.attr('name');
        // console.log(element, name)
        name && chart.setExtraOptionByValue(name, element.val())
    },
    /**
     * 根据名称，值设置额外参数
     * @param name
     * @param value
     * @param index
     */
    setExtraOptionByValue: function (name, value, index) {
        var formData = {};
        // 改变系列名称
        if (name.indexOf('series') > -1 && name.indexOf('name') > -1) {
            if (index === undefined || index === null) {
                index = name.match(/\d\./)[0];
                index = index.substr(0, index.length - 1);
            }
            formData['data.' + 'legend.data.' + index] = value['name'] || value;
            chart.setOptionByFormData(formData, chart.config.clickChart);
        }
        // 改变线条颜色
        if (name.indexOf('series') > -1 && name.indexOf('lineStyle') > -1 && name.indexOf('color') > -1) {
            if (index === undefined || index === null) {
                index = name.match(/\d\./)[0];
                index = index.substr(0, index.length - 1);
            }
            formData['data.' + 'color.' + index] = value['color'] || value;
            chart.setOptionByFormData(formData, chart.config.clickChart);
        }
        if (name.indexOf('series') > -1 && value === null) {
            formData['data.' + 'legend.data.' + index] = null;
            chart.setOptionByFormData(formData, chart.config.clickChart);
        }
    },
    /**
     * 合并图表数据
     * @param chat
     */
    createOption: function (chat, done) {
        // console.log(chat)
        try {
            typeof chat['datavalue'] === "string" && (chat['datavalue'] = JSON.parse(chat['datavalue']))
        } catch (e) {
        }
        if (chat['sourcetype'] == 1) {
            request.clearTimerCache(chat);
            request.createOptionByStatic(chat, done);
        } else if (chat['sourcetype'] == 2) {
            chat['api']['url'] && (request.ajaxPost(chat, done), chat['api']['interval'] && (chart.config.timerCache[chat['name']] && request.clearTimerCache(chat), chart.config.timerCache[chat['name']] = window.setInterval(function () {
                request.ajaxPost(chat, done)
            }, chat['api']['interval'])))
            chat['api']['url'] || request.createOptionByStatic(chat, done)
        } else if (chat['sourcetype'] == 3) {
            request.clearTimerCache(chat);
            chat['api']['url'] && (request.ajaxPost(chat, done, true))
            chat['api']['url'] || request.createOptionByStatic(chat, done)
        } else if (chat['sourcetype'] == 4) {
            request.clearTimerCache(chat);
            // chart.createOptionByStatic(chat, done);
            chat['sql'] && (request.sqlPost(chat, done, true))
            chat['sql'] || request.createOptionByStatic(chat, done)
        }
    }
}

/**
 * 选择图表类型生成动态图表及表单
 */

$(document).on('click', '.chartDom', function () {
    // console.log(chart)
    if (chart.config.option.editSwitch) {
        var xy = utils.getClient();
        var chartname = utils.randomString($(this).data('chartname'), 6);
        if (carousel.eidtSwitch) {
            var $carouse = carousel.$carouse,
                carouseName = $carouse.parents('.drag-box').data('chartName'), pageIndex = $carouse.data('pageIndex');
            $.ajax({
                url: '/get_carouse_charts',
                data: {
                    showname: chart.config.showName,
                    chartid: $(this).data('chartid'),
                    dragDomId: utils.randomString('drag-box', 10),
                    carouse_name: carouseName,
                    chartname: chartname,
                    x: 0,
                    y: 0,
                    w: $(this).data('charttype') === 'carousel' ? 550 : chart.config.width,
                    h: chart.config.height,
                    op: 'create',
                    page_index: pageIndex
                },
                type: 'post',
                success: function (res) {
                    chart.renderChartForm(res['charts'], true, $carouse.find('.carouse-item').children('.carouse-page:eq(' + pageIndex + ')'))
                }
            });
        } else {
            $.ajax({
                url: '/get_sys_charts',
                data: {
                    chartid: $(this).data('chartid'),
                    charttype: $(this).data('charttype'),
                    dragDomId: utils.randomString('drag-box', 10),
                    chartDomId: utils.randomString('echart', 10),
                    chartname: chartname,
                    showname: chart.config.showName,
                    x: xy[0],
                    y: xy[1],
                    w: $(this).data('charttype') === 'carousel' ? 550 : chart.config.width,
                    h: chart.config.height,
                    op: 'create'
                },
                type: 'post',
                success: function (res) {
                    chart.renderChartForm(res['charts'], true)
                }
            })
        }
    }
})

/**
 * 背景点击事件
 */

$(document).on('click', '#chartLoader', function (e) {
    if (chart.config.option.editSwitch) {
        chart.rendPageForm()
        $(e.target).find('.drag-box').removeClass('drag-box-hovered');
        $(this).find('.toolbar').hide();
        $(this).find('.navigator-line').hide()//将div.navigator-line隐藏
        $('.new-toolbar-new').remove();
    }
})

/**
 * 图表hover事件
 */

$.fn.addHoverEvent = function () {
    //禁止图表的右击事件
    $(this).oncontextmenu = function () {
        return false;
    };
    //绑定图表的右击事件
    $(this).contextmenu(function () {
        // console.log($(this))
        $(this).children('.toolbar').show();
        return false;
    })
    //图表hover事件
    $(this).hover(function () {
        $(this).children('.echart').children('.menu-wrap').show()
        $(this).children('.drag-coor').show()
    }, function () {
        $(this).children('.drag-coor').hide()
        $(this).children('.echart').children('.menu-wrap').hide()
    })
    //删除的点击事件
    $(this).on('click', '.toolbar .delete', function (e) {
            var $this = $(this), chartName = $(this).data('chartName');
            $this.parents('.toolbar').hide();
            layer.confirm('确认删除，删除之后将不能恢复！', {title: '温馨提示'}, function (l, index) {
                if (carousel.eidtSwitch) {
                    var $carouse = carousel.$carouse,
                        carouseName = $carouse.parents('.drag-box').data('chartName'),
                        pageIndex = $carouse.data('pageIndex');
                    $.ajax({
                        url: '/del_carouse_charts',
                        data: {
                            showname: chart.config.showName,
                            chartname: chartName,
                            page_index: pageIndex,
                            carouse_name: carouseName
                        },
                        type: 'post',
                        success: function (res) {
                            if (res === '删除成功') {
                                $this.parent().parent('.drag-box').remove();
                                request.clearTimerCache({'name': chartName});
                                chart.rendPageForm();
                            } else {
                                utils.error('删除失败，请联系管理员！')
                            }
                            layer.closeAll();
                        }
                    });
                } else {
                    $.ajax({
                        url: '/del_chart',
                        data: {showname: chart.config.showName, chartname: chartName},
                        type: 'post',
                        success: function (res) {
                            //删除showData的数据
                            for (var i = chart.config.showData.show.data.charts.length - 1; i >= 0; i -= 1) {
                                if (chart.config.showData.show.data.charts[i].name == chartName) {
                                    chart.config.showData.show.data.charts.splice(i, 1)
                                }
                            }
                            // console.log(chart.config.showData)
                            //删除成功
                            if (res === '删除成功') {
                                // console.log(111)
                                chart.config.lineConnector.removeLine(false, $this.parent().parent('.drag-box')[0].id);
                                chart.removeCache($this.parent().parent('.drag-box').find('.echart')[0].id);
                                $this.parent().parent('.drag-box').remove();
                                chart.config.lineConnector.refresh({}, $('.drag-box'))
                                request.clearTimerCache({'name': chartName});
                                chart.rendPageForm();
                                carousel.eidtSwitch = false;
                                var data = chart.config.showData
                                // console.log(data)
                                chart.Gettuceng(data)
                            } else {
                                utils.error('删除失败，请联系管理员！')
                            }
                            layer.closeAll()
                        }
                    })
                }

            })
            return false
        }
    )

    //复制的点击事件
    $(this).on('click', '.toolbar .copy', function (e) {
        var $this = $(this),
            chartName = $(this).data('chartName');
        var NEWData = chartName.split('-')[0]
        var newname = utils.randomString(NEWData, 6)
        $this.parents('.toolbar').hide();
        layer.confirm('确认复制，即将复制本图表到屏幕上！', {title: '温馨提示'}, function (l, index) {
            $.ajax({
                url: '/copy_chart',
                data: {
                    showname: chart.config.showName,
                    copyname: chartName,
                    newname: newname
                },
                type: 'post',
                success: function (res) {
                    chart.renderChartForm(res['charts'], true)
                }
                // }
            })
            layer.closeAll()
        })
        return false
    })
    //图表的层次事件
    $(this).on('click', '.toolbar .layer', function (e) {
        var $this = $(this), chartName = $(this).data('chartName'), dragBox = $this.parents('.drag-box');
        $this.parents('.toolbar').hide();
        utils.prompt({title: '请输入图层索引', formType: 3, value: dragBox.css('zIndex') || 0}, function (value, index) {
            $.ajax({
                url: '/update_chart',
                data: {
                    showname: chart.config.showName,
                    chartname: chartName,
                    chartkey: JSON.stringify([['z_index', value]])
                },
                type: 'post',
                success: function (res) {
                    if (res)
                        utils.success('修改成功', function () {
                            dragBox.css('zIndex', value)
                        })

                    else {
                        // console.log(res)
                        utils.error('修改失败，请联系管理员！')
                    }
                }
            })
            layer.close(index)
        })
        return false
    })
}
/**
 * 图标点击事件
 */
$.fn.addClickEvent = function () {
    // console.log('lsl')
    $(this).on('click', clickEvent.clickone);
}
/**
 * 表单元素改变事件
 */
$(document).on('change', 'input,select,textarea', function (e) {
    if (typeof $(e.target).data('change') === 'function') {
        $(e.target).data('change')(e.target, $(e.target).val(), chart.config.clickChart)
    }
    $(e.target).attr('name') && chart.refreshChart($(e.target))
})
hoverx = function (e) {
    index = layer.tips(e.target.getAttributeNS(null, 'data-tips'), e.target, {
        tips: 1,
        time: 0,
    });
}
hovery = function () {
    layer.close(index)
}
$.fn.refreshPage = function (element) {
    var name = element.attr('name'), val = element.val(),
        formData = {};
    formData[name] = val;
    chart.setOptionByFormData(formData, chart.config.showData);
    chart.rendPageSetting();
};
$.fn.deepClone = function (deep) {
    var cloneCont = $(this).clone(deep),
        originalCanvas = $(this).find('canvas'),
        cloneCanvas = cloneCont.find('canvas')
    $.each(originalCanvas, function (index, value) {
        var originalContext = originalCanvas[index].getContext("2d");
        var imageData = originalContext.getImageData(0, 0, originalCanvas[index].width, originalCanvas[index].height);
        var cloneContext = cloneCanvas[index].getContext("2d");
        cloneContext.putImageData(imageData, 0, 0);
    });
    var svges = cloneCont[0].getElementsByTagName('svg');
    $.each(svges, function (i, s) {
        if (s) {
            if (s.getElementsByTagName('image')[0]) {
                var img = new Image(), oldImg = s.getElementsByTagName('image')[0],
                    width = parseInt(s.parentNode.style.width.replace('px', '')),
                    maxWidth = oldImg.getAttributeNS(null, 'width'), maxHeight = oldImg.getAttributeNS(null, 'height'),
                    height = parseInt(s.parentNode.style.height.replace('px', ''));
                img.src = oldImg.getAttributeNS('http://www.w3.org/1999/xlink', 'href'),
                    img.width = width, img.height = height;
                AutoSize(img, maxWidth, maxHeight)
                s.parentNode.appendChild(img),
                    s.parentNode.removeChild(s)
            }
        }

    })
    return cloneCont
}


function AutoSize(newImg, maxWidth, maxHeight) {
    if (newImg.width / newImg.height <= maxWidth / maxHeight) //原图片宽高比例 大于 图片框宽高比例
    {
        newImg.width = newImg.width;   //以框的宽度为标准
        newImg.height = newImg.width / (maxWidth / maxHeight);
    } else {   //原图片宽高比例 小于 图片框宽高比例
        newImg.width = newImg.height * (maxWidth / maxHeight);
        newImg.height = newImg.height;   //以框的高度为标准
    }

}


//菜单预览hover事件隐藏和显示
$.fn.setHover = function (chat) {
    $(this).hover(function () {
        $(this).children('.echart').children('.nav-main').show()
    }, function () {
        $(this).children('.echart').children('.nav-main').hide()
    })
}
//在线地图的json
var geoCoordMap = {
    '加拿大': [-75.43, 45.25],
    '乌兹别克斯坦': [69.18, 45.25],
    '蒙古': [106.53, 47.55],
    '澳大利亚': [149.07, -35.17],
    '俄罗斯': [37.37, 55.45],
    '乌克兰': [30.5234, 50.4501],
    '挪威': [43, 59.54],
    '美国': [-77.02, 38.53],
    '墨西哥': [-99.09, 19.24],
    '荷兰': [4.53, 52.22],
    '巴西': [-48, -15.5],
    '瑞典': [18.1, 59.18],
    '伊朗': [51, 35],
    '土耳其': [32.52, 39.56],
    '日本': [139.46, 35.42],
    '丹麦': [12.34, 55.43],
    '南非': [28.02, -26.12],
    '菲律宾': [121, 15],
    '智利': [-70.4, -33.27],
    '塞尔维亚': [20.28, 44.49],
    '波兰': [19.08, 51.55],
    '四川': [104.06, 30.67],
    '西藏': [91.11, 29.9],
    '北京': [116.463, 39.92],
    '新疆': [87.68, 43.77],
    '哈尔滨': [125.42, 44.04],
    '重庆': [106.55, 29.57],
    '山西': [110.15, 34.26],
    '黑龙江': [130.85, 45.82],
    '浙江': [118.55, 27.57],
    '河南': [110.55, 31.23],
    '安徽': [117.2, 31.86]
};

var convertData = function (data) {
    // console.log(data)
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};

function randNum2(min, max, num) {
    if (num > max - min) {
        console.error('范围太小');
        return false;
    }
    var range = max - min,
        minV = min + 1, //实际上可以取的最小值
        arr = [],
        tmp = "";

    function GenerateANum(i) {
        for (i; i < num; i++) {
            var rand = Math.random(); //  rand >=0  && rand < 1
            tmp = Math.floor(rand * range + minV);
            // console.log('i',i,tmp);

            if (arr.indexOf(tmp) == -1) {
                arr.push(tmp)
            } else {
                GenerateANum(i);
                break;
            }

        }
    }

    GenerateANum(0); //默认从0开始
    return arr;
}

function getSeries(data) {
    var nums = randNum2(2, 3, 1)[0]
    var arrIndex = randNum2(0, 31, nums)
    var tempArr = []
    arrIndex.forEach((item) => {
        tempArr.push(data[item])
    })
    return convertData(tempArr)
}

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
