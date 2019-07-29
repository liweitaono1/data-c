/**
 * 动态创建加载表单元素
 */
var createElement = {

    /**
     * 添加序列
     */
    addSeriesRefresh: function (element, sData, index, myChart) {
        var formData = {}, vData = $.isPlainObject(sData) ? $.extend({}, sData) : null;
        formData['data.' + element['chartkey'] + '.' + (index - 1)] = sData,
            chart.setOptionByFormData(formData, chart.config.clickChart),
        vData && (vData['color'] = vData['lineStyle'] ? vData['lineStyle']['color'] ? vData['lineStyle']['color'] : utils.randomColor() : utils.randomColor())
        chart.setExtraOptionByValue(JSON.stringify(formData), vData, index - 1);
        var chat = $.extend(true, {}, chart.config.clickChart)
        chart.createOption(chat, function (data, chat, datavalue) {
            if (chart.isChart(chat['charttype'])) {
                chart.renderEChart(chat, data, false, datavalue, false)
            } else {
                chart.renderComponents(chat, data, false)
            }
        });
        chart.refreshChartData(chart.config.clickChart.name, chat);
    },

    /**
     * 加载子元素
     */
    createFormElementByChildrenValue: function (panelBody, element, value, is_add) {
        if (element['isDuckTyping']) {
            $.each(value, function (i, val) {
                var index = (parseInt(panelBody.find('.group-container').length || 0) + 1)
                var group = $('<div class="group-container">').append($('<span class="text">').html(element['name'] + '&nbsp;' + index))
                    .append(
                        element.canAdd && $('<span style="float: right;margin-top: -6px">').append(
                        $('<a class="btn btn-link removeContainer" href="javascript:;" title="点击删除' + element['name'] + index + '">')
                            .data('index', index).data('name', element['name']).html('<i class="fa fa-remove"></i>&nbsp;&nbsp;删除').on('click', function () {
                            var dataIndex = $(this).data('index'), name = $(this).data('name')
                            $(this).parents('.group-container').nextAll('.group-container').each(function (i) {
                                $(this).find('.removeContainer').data('index', dataIndex + i)
                                $(this).find('span.text').html(name + (dataIndex + i))
                                $(this).find('input, select').each(function () {
                                    $(this).data('index', dataIndex + i)
                                    $(this).data('chartKey') && $(this).attr('name', $(this).data('chartKey').replace('${i}', (dataIndex - 1 + i)))
                                })
                            });
                            $(this).parents('.group-container').remove();
                            createElement.addSeriesRefresh(element, null, dataIndex, panelBody.parents('form').data('chartDom').data('echart'))

                        })))
                    .append($('<div class="divider">')).appendTo(panelBody);
                var formContainer = $('<div class="form-container">').appendTo(group), sData = {},
                    myChart;
                chart.createFormElement({
                    'formtype': 'select',
                    'name': '类型',
                    value: chart.config.chartTypeCache,
                    chartkey: element['chartkey'] + '.${i}.type',
                    realChartKey: element['chartkey'] + '.' + (index - 1) + '.type',
                    index: index,
                    onChange: function (e) {
                        $(e).parent().parent().parent().nextAll().remove();
                        createElement.createFormByType({type: $(e).val(),}, element, sData, formContainer, true, panelBody, $(e).data('index'))
                    }
                }, [val['type']], formContainer)
                createElement.createFormByType(val, element, sData, formContainer, is_add, panelBody, index)
            });
        } else {
            // console.log(value, element)
            $.each(value, function (i, val) {
                var index = (parseInt(panelBody.find('.group-container').length || 0) + 1)
                var group = $('<div class="group-container">').append($('<span class="text">').html(element['name'] + '&nbsp;' + index))
                    .append(
                        element.canAdd && $('<span style="float: right;margin-top: -6px">').append(
                        $('<a class="btn btn-link removeContainer" href="javascript:;" title="点击删除' + element['name'] + index + '">')
                            .data('index', index).data('name', element['name']).html('<i class="fa fa-remove"></i>&nbsp;&nbsp;删除').on('click', function () {
                            var dataIndex = $(this).data('index'), name = $(this).data('name')
                            $(this).parents('.group-container').nextAll('.group-container').each(function (i) {
                                $(this).find('.removeContainer').data('index', dataIndex + i)
                                $(this).find('span.text').html(name + (dataIndex + i))
                                $(this).find('input, select').each(function () {
                                    $(this).data('chartKey') && $(this).attr('name', $(this).data('chartKey').replace('${i}', (dataIndex - 1 + i)))
                                })
                            });
                            $(this).parents('.group-container').remove();
                            createElement.addSeriesRefresh(element, null, dataIndex, panelBody.parents('form').data('chartDom').data('echart'))

                        })))
                    .append($('<div class="divider">')).appendTo(panelBody);
                var formContainer = $('<div class="form-container">').appendTo(group), sData = {},
                    myChart;
                createElement.createElByData(element.children, val, index, is_add, sData, formContainer)
                is_add && chart.config.clickChart && (myChart = panelBody.parents('form').data('chartDom').data('echart'), createElement.addSeriesRefresh(element, sData, index, myChart))
            })
        }
    },

    /**
     *
     * 根据type判断
     */
    createFormByType: function (val, element, sData, formContainer, is_add, panelBody, index) {
        var data = chart.config.typeCache[val['type'] || chart.config.chartTypeCache[0]['value']], myChart;
        if (!data) {
            $('<div class="has-error">').html('该类型 “' + val['type'] + '”暂不支持动态属性').appendTo(formContainer);
            return;
        }
        var typeData = data[element['chartkey']]['elements'];
        if (!typeData || typeData.length < 1) {
            $('<div class="has-error">').html('该类型 “' + val['type'] + '”的“' + element['chartkey'] + '”属性暂不支持动态属性').appendTo(formContainer);
            return;
        }

        sData = data[element['chartkey']] ? data[element['chartkey']]['value'][0] : sData;
        createElement.createElByData(typeData, val, index, is_add, sData, formContainer);
        is_add && chart.config.clickChart && (myChart = panelBody.parents('form').data('chartDom').data('echart'), createElement.addSeriesRefresh(element, sData, index, myChart))
    },

    /**
     *
     * 获取data
     */
    createElByData: function (data, val, index, is_add, sData, formContainer) {
        // console.log(val)
        if (data)
            $.each(data, function (j, el) {
                // console.log(j,el)
                var v;
                // 替换真实chartkey
                el['realChartKey'] = el['chartkey'].replaceAll('\\$\\{i\\}', (index - 1) + '');
                // 取出option 的值
                var chartkeys = el.chartkey.split('-').map(function (key) {
                    return key.split('${i}')[1].substr(1);
                });
                v = chart.getOptionValue(val, chartkeys.join('-'));
                // console.log(v, val)
                if (chartkeys[0] == "") {
                    v.push(val)
                } else {
                    v = chart.getOptionValue(val, chartkeys.join('-'));
                    // console.log(chartkeys, v, val)
                    // console.log(v, utils.isEmpty(v),chart.getSystemValue(el, index))
                    // console.log(v)
                    // 未定义的去系统默认值
                    v = utils.isEmpty(v) ? createElement.getSystemValue(el, index) : v;
                    // console.log(v)
                    // 转换成数组格式
                    v = $.isArray(v) ? utils.isEmpty(v) ? [] : v : [v];
                    var temp = {};
                    // console.log(temp,sData)
                    // 添加赋默认值
                    is_add && chart.config.clickChart && (chart.setOptionByFormData(temp, sData))
                    // console.log(v)
                    // console.log(el.getValue, val)
                    // 替换本地变量
                    if (el && el.getValue && typeof el.getValue === 'string' && el.getValue.indexOf('${') === 0 && el.getValue.indexOf('}') === el.getValue.length - 1) {
                        try {
                            el.value = eval(el.getValue.replace('${', '').replace('}', ''))
                        } catch (e) {
                            console.warn('去本地变量error:' + e.toString())
                        }
                    }
                }
                chart.createFormElement(el, v, formContainer)

            })
    },
    /**
     * 获取默认值
     */
    getSystemValue: function (el, index) {
        var name = el['chartkey'];
        // 改变系列名称
        if (name.indexOf('series') > -1 && name.indexOf('name') > -1) {
            return '系列' + index
        }
        // 改变线条颜色
        if (name.indexOf('series') > -1 && name.indexOf('lineStyle') > -1 && name.indexOf('color') > -1) {
            return utils.randomColor();
        }
        // 改变区域颜色
        if (name.indexOf('series') > -1 && name.indexOf('areaStyle') > -1 && name.indexOf('color') > -1) {
            return utils.randomColor();
        }

        return ''
    },

    /**
     * 创建panel 并加载子元素
     * @param element
     * @param value
     * @param loader
     * @returns {*|jQuery}
     */
    createElementByName: function (element, value, loader) {
        var panelId = utils.randomString('panel', 10)
        var panel = $('<div class="panel panel-default">').append(
            $('<div class="panel-heading" style="background: #161616;color: #fff"  data-toggle="collapse" href="' + panelId + '">').append(
                $('<h4 class="panel-title">').append(
                    $('<i class="fa fa-angle-double-down collapse">')
                ).append('&nbsp;&nbsp;' + element['name'])
            ).css('cursor', 'pointer').on('click', function () {
                var i = $(this).find('i.fa.collapse')
                var target = $('#' + $(this).attr('href'))
                if (target.hasClass('in')) {
                    i.addClass('fa-angle-double-down').removeClass('fa-angle-double-up')
                    target.removeClass('in')
                } else {
                    i.addClass('fa-angle-double-up').removeClass('fa-angle-double-down')
                    target.addClass('in')
                }
                return false;
            })
        ).appendTo(loader);
        var panelBody = $('<div class="panel-body" style="background:#161616;color: #fff">').appendTo(
            $('<div id="' + panelId + '" class="panel-collapse collapse">').appendTo(panel));

        element.canAdd && panel.find('.panel-title').append(
            $('<span style="float: right;margin-top: -6px">').append(
                $('<a class="btn btn-link" href="javascript:;" title="点击添加' + element['name'] + '">').html('<i class="fa fa-plus"></i>&nbsp;&nbsp;添加').on('click', function () {
                    createElement.createFormElementByChildrenValue(panelBody, element, eval('chart.config.addDefaultValue.' + element['chartkey']), true)
                    return false;
                })));
        createElement.createFormElementByChildrenValue(panelBody, element, value[0]);
        return panelBody
    },
    /**
     * 创建input
     * @param element
     * @param value
     * @param loader
     */
    createElementByInput: function (element, value, loader) {
        // console.log(element, value)
        var id = utils.randomString('id', 10), $input = '';
        $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
        ).append(
            $('<div class="col-sm-9">').append(
                $input = $('<input type="text" class="form-control" id="' + id + '" name="' + (element['realChartKey'] || element['chartkey']) + '" placeholder="' + element['name'] + '" value="' + (utils.isEmpty(value) ? '' : value[0]) + '">').data('notOption', element['notOption'] || false)
                    .data('chartKey', element['chartkey']).data('elType', element['elType'] || '')
            )
        ).appendTo(loader);
        utils.autoAttr(element, $input)
    },
    /**
     * 创建doubleinput
     * @param element
     * @param value
     * @param loader
     */
    createElementByDoubleInput: function (element, value, loader) {
        var id = utils.randomString('id', 10), $input = '',
            realChartKey = element['realChartKey'] || element['chartkey'];

        $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
        ).append(
            $('<div class="col-sm-4">').append(
                $input = $('<input type="text" class="form-control" id="' + id + '" name="' + (realChartKey.split('-')[0]) + '" placeholder="' + (element['placeholder'] ? element['placeholder'].split('-')[0] : '') + '" value="' + (value[0] || '') + '">').data('notOption', element['notOption'] || false)
                    .data('chartKey', realChartKey.split('-')[0]))
        ).append($('<div class="separator">').append(element['separator'] || '')).append(
            $('<div class="col-sm-4">').append(
                $input = $('<input type="text" class="form-control" id="' + id + '" name="' + (realChartKey.split('-')[1]) + '" placeholder="' + (element['placeholder'] ? element['placeholder'].split('-')[1] : '') + '"  value="' + (value[1] || '') + '">').data('notOption', element['notOption'] || false)
                    .data('chartKey', realChartKey.split('-')[1])
            )).appendTo(loader);
        // console.log(value)
        utils.autoAttr(element, $input)
    },
    /**
     * 创建上传按钮
     * @param element
     * @param value
     * @param loader
     */
    createElementByLoad: function (element, value, loader) {
        // console.log(element)
        var id = utils.randomString('id', 10);
        var formGroup = $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),
            col = $('<div class="col-sm-8">').appendTo(formGroup),
            btn = $('<button type="button" class="btn btn-primary upload"' +
                ' id="' + id + ' "  data-name=' + element['name'] + ' data-id=' + element['package'] + '>').html(element['buttonText'] || '').appendTo(col);
        btn.on('click', function (e) {
            layer.open({
                type: 2,
                title: '素材选择',
                shadeClose: true,
                shade: 0.8,
                area: ['80%', '90%'],
                content: '/show_package'
            });
        })
    },
    /**
     * 创建数据源
     * @param element
     * @param value
     * @param loader
     */
    createElementBySelectdata: function (element, value, loader) {
        var id = utils.randomString('id', 10)
        var formGroup = $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),
            select = $('<select class="form-control nselect" style="background: #202326;color: #FFFFFF" id="' + id + '" value="' + chart.config.clickChart.database + '" name="' + (element['realChartKey'] || element['chartkey']) + '">')
                .data('chartKey', element['chartkey']).data('change', element['onChange'] || '').data('notOption', element['notOption'] || false).data('index', element['index']).appendTo(
                    $('<div class="col-sm-9">').appendTo(formGroup)
                ),
            SQL = $('<div style="height: 70px"><label for="' + id + '" class="col-sm-3 control-label custom-label">SQL编辑:</label></div>').appendTo(formGroup),
            form = $('<form id="formdata">').appendTo(formGroup)
        var selectvalue = chart.config.clickChart.database
        //判断类型
        // console.log(chart.config.clickChart)
        var data
        //datatype是1和5的数据类型渲染
        if (chart.config.clickChart.datatype == 1 || chart.config.clickChart.datatype == 5) {
            //排除轮播柱状图的情形
            if (chart.config.clickChart.chartid == 208) {
                data = chart.config.clickChart.data.baseOption.series
            } else {
                data = chart.config.clickChart.data.series
            }
            if (typeof (chart.config.clickChart.datavalue) == 'object' && typeof (chart.config.clickChart.datavalue.y[0]) == 'object' && chart.config.clickChart.datavalue.y[0][0]) {
                // console.log(chart.config.clickChart.editsql)
                var x = $('<div><label class="control-label col-xs-3">x</label><div class="col-xs-9"><textarea id="sql" class="sql" name="x" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.x[0] : '') + '</textarea> ').appendTo(form)
                $.each(data, function (i, val) {
                    var j = i + 1
                    y = $('<div><label class="control-label col-xs-3">y' + j + '</label><div class="col-xs-9"><textarea class="sql" name="y' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['y' + j] : '') + '</textarea> ').appendTo(form)
                })
            } else {
                var y = $('<div><label class="control-label col-xs-3">y</label><div class="col-xs-9"><textarea class="sql" name="y" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.y[0] : '') + '</textarea> ').appendTo(form)
                $.each(data, function (i, val) {
                    var j = i + 1, x = 'x' + j
                    x = $('<div><label class="control-label col-xs-3">x' + j + '</label><div class="col-xs-9"><textarea class="sql" name="x' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['x' + j] : '') + '</textarea> ').appendTo(form)
                })
            }
        }
        //datatype是2的数据类型渲染
        else if (chart.config.clickChart.datatype == 2 || chart.config.clickChart.datatype == 11) {
            if (chart.config.clickChart.charttype == 'defineheatmap') {
                var x = $('<div><label class="control-label col-xs-3">x</label><div class="col-xs-9"><textarea class="sql" name="x" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.x : '') + '</textarea>').appendTo(form)
                var y = $('<div><label class="control-label col-xs-3">y</label><div class="col-xs-9"><textarea class="sql" name="y" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.y : '') + '</textarea>').appendTo(form)
                var value = $('<div><label class="control-label col-xs-3">value</label><div class="col-xs-9"><textarea class="sql" name="value" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.value : '') + '</textarea>').appendTo(form)
            } else {
                var name = $('<div><label class="control-label col-xs-3">name</label><div class="col-xs-9"><textarea class="sql" name="name" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.name : '') + '</textarea>').appendTo(form)
                var value = $('<div><label class="control-label col-xs-3">value</label><div class="col-xs-9"><textarea class="sql" name="value" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.value : '') + '</textarea> ').appendTo(form)
            }
        }
        //datatype是3的数据类型渲染
        else if (chart.config.clickChart.datatype == 3) {
            if (chart.config.clickChart.data.bubble) {
                var name = $('<div><label class="control-label col-xs-3">name</label><div class="col-xs-9"><textarea class="sql" name="name" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.name : '') + '</textarea>').appendTo(form)
                var x = $('<div><label class="control-label col-xs-3">X坐标</label><div class="col-xs-9"><textarea class="sql" name="x" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.x : '') + '</textarea>').appendTo(form)
                var y = $('<div><label class="control-label col-xs-3">Y坐标</label><div class="col-xs-9"><textarea class="sql" name="y" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.y : '') + '</textarea> ').appendTo(form)
            } else {
                var name = $('<div><label class="control-label col-xs-3">X坐标</label><div class="col-xs-9"><textarea class="sql" name="x" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.x : '') + '</textarea>').appendTo(form)
                var value = $('<div><label class="control-label col-xs-3">Y坐标</label><div class="col-xs-9"><textarea class="sql" name="y" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.y : '') + '</textarea> ').appendTo(form)
            }
        }

        //datatype是4的数据类型渲染
        else if (chart.config.clickChart.datatype == 4) {
            var name = $('<div><label class="control-label col-xs-3">sql</label><div class="col-xs-9"><textarea class="sql" name="textedit" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.textedit : '') + '</textarea>').appendTo(form)
            var value = $('<div><label class="control-label col-xs-3">索引</label><div class="col-xs-9"><textarea class="sql" name="equary" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.equary : '') + '</textarea>').appendTo(form)
        }

        //datatype是6的数据类型渲染
        else if (chart.config.clickChart.datatype == 6) {
            $.each(chart.config.clickChart.data.columnOption, function (i, val) {
                var name = $('<div><label class="control-label col-xs-3">' + val.title + '</label><div class="col-xs-9"><textarea class="sql" name=' + val.field + ' style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql[val.field] : '') + '</textarea>').appendTo(form)
            })
        }
        //datatype是7的数据类型渲染
        else if (chart.config.clickChart.datatype == 7) {
            var name = $('<div><label class="control-label col-xs-3">sql</label><div class="col-xs-9"><textarea class="sql" name="textedit" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.textedit : '') + '</textarea>').appendTo(form)
        }
        //datatype是8的数据类型渲染
        else if (chart.config.clickChart.datatype == 8) {
            var tips = $('<div><label class="control-label col-xs-3">tips</label><div class="col-xs-9"><textarea class="sql" name="tips" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.tips : '') + '</textarea>').appendTo(form)
            var status = $('<div><label class="control-label col-xs-3">status</label><div class="col-xs-9"><textarea class="sql" name="status" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.status : '') + '</textarea>').appendTo(form)
            var msg = $('<div><label class="control-label col-xs-3">msg</label><div class="col-xs-9"><textarea class="sql" name="msg" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.msg : '') + '</textarea>').appendTo(form)
        }
        //datatype是9的数据类型渲染
        else if (chart.config.clickChart.datatype == 9) {
            var tips = $('<div><label class="control-label col-xs-3">objid</label><div class="col-xs-9"><textarea class="sql" name="objid" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.objid : '') + '</textarea>').appendTo(form)
            var status = $('<div><label class="control-label col-xs-3">status</label><div class="col-xs-9"><textarea class="sql" name="status" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.status : '') + '</textarea>').appendTo(form)
            var msg = $('<div><label class="control-label col-xs-3">msg</label><div class="col-xs-9"><textarea class="sql" name="msg" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.msg : '') + '</textarea>').appendTo(form)
        }
        //datatype是10的数据类型渲染
        else if (chart.config.clickChart.datatype == 10) {
            var tips = $('<div><label class="control-label col-xs-3">name</label><div class="col-xs-9"><textarea class="sql" name="name" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.name : '') + '</textarea>').appendTo(form)
            var status = $('<div><label class="control-label col-xs-3">status</label><div class="col-xs-9"><textarea class="sql" name="status" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.status : '') + '</textarea>').appendTo(form)
            var msg = $('<div><label class="control-label col-xs-3">tips</label><div class="col-xs-9"><textarea class="sql" name="msg" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.msg : '') + '</textarea>').appendTo(form)
        }
        //datatype是13的数据类型渲染
        else if (chart.config.clickChart.datatype == 13) {
            var tips = $('<div><label class="control-label col-xs-3">name</label><div class="col-xs-9"><textarea class="sql" name="name" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.name : '') + '</textarea>').appendTo(form)
            var status = $('<div><label class="control-label col-xs-3">value</label><div class="col-xs-9"><textarea class="sql" name="value" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql.value : '') + '</textarea>').appendTo(form)
        }
        //datatype是12的数据类型渲染
        else if (chart.config.clickChart.datatype == 12) {
            if (chart.config.clickChart.data.match) {
                $.each(chart.config.clickChart.data.series, function (i, val) {
                    var j = i + 1
                    var name = $('<div><label class="control-label col-xs-3">name' + j + '</label><div class="col-xs-9"><textarea class="sql" name="name' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['name' + j] : '') + '</textarea>').appendTo(form)
                    var value = $('<div><label class="control-label col-xs-3">value' + j + '</label><div class="col-xs-9"><textarea class="sql" name="value' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['value' + j] : '') + '</textarea>').appendTo(form)
                })
            } else {
                $.each(chart.config.clickChart.data.options, function (i, val) {
                    var j = i + 1
                    var tips = $('<div><label class="control-label col-xs-3">name' + j + '</label><div class="col-xs-9"><textarea class="sql" name="name' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['name' + j] : '') + '</textarea>').appendTo(form)
                    var status = $('<div><label class="control-label col-xs-3">value' + j + '</label><div class="col-xs-9"><textarea class="sql" name="value' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['value' + j] : '') + '</textarea>').appendTo(form)
                    var year = $('<div><label class="control-label col-xs-3">year</label><div class="col-xs-9"><textarea class="sql" name="year' + j + '" style="min-width: 100%">' + (chart.config.clickChart.editsql ? chart.config.clickChart.editsql['year' + j] : '') + '</textarea>').appendTo(form)
                })
            }
        }
        //编辑器渲染
        $('.CodeMirror').remove()
        var done = $('<div style="float:right;margin-right: 10px;margin-top: 10px" id="done" class="layui-btn layui-btn-sm layui-btn-normal">执行</div>').appendTo(form)
        Array.from(document.getElementsByClassName('sql')).forEach(function (val, i) {
            // console.log(val)
            var editor = CodeMirror.fromTextArea(val, {
                lineNumbers: false,     // 显示行数
                indentUnit: 4,         // 缩进单位为4
                styleActiveLine: true, // 当前行背景高亮
                matchBrackets: true,   // 括号匹配
                theme: '3024-night',
                mode: "text/x-mysql",
                autofocus: true,
                lineWrapping: true,    // 自动换行
            });
            //编辑框赋值
            editor.setValue(editor.getValue());
            // console.log(editor)
            editor.on("change", function (editor, changes) {
                val.innerHTML = editor.getValue();
            });
        }),
            //select option渲染
            $.ajax({
                url: 'datasource_list',
                type: 'post',
                success: function (res) {
                    defaultdata = res.data[0]._id
                    $.each(res.data, function (i, val) {
                        select.append($('<option>', {value: val._id, text: val.name}))
                    })
                    selectvalue ? $(".nselect option[value='" + selectvalue + "']").attr("selected", "selected") : $(".nselect option[value='" + res.data[0]._id + "']").attr("selected", "selected");
                    //执行按钮点击事件
                    $('#done').on('click', function () {
                        var sqldata = decodeURIComponent($('#formdata').serialize(), true).replace(/\+/g, " ").split('&') //分割字符串
                        // console.log(sqldata)
                        var SQLdata  //最终传参的数据
                        var cache = {} //存放数据对象
                        $.each(sqldata, function (i, val) {
                            //取val中第一个等一号所在的位置
                            var equary = val.indexOf('=') + 1

                            //自定义replace方法
                            function replacePos(strObj, pos, replacetext) {
                                var str = strObj.substr(0, pos - 1) + replacetext + strObj.substring(pos, strObj.length);
                                return str;
                            }

                            var mystr = replacePos(val, equary, ":");   //将字符串中第一个等于号替换成：
                            var keydata = mystr.split(':')[1]   //去取：前的部分字符串
                            var keykey = mystr.split(':')[0]    //取：后的部分字符串
                            //判断数据类型为2和5的
                            if (chart.config.clickChart.datatype == 1 ||
                                chart.config.clickChart.datatype == 5) {
                                //相同keypush到一个数组中
                                if (!cache[keykey]) {
                                    cache[keykey] = []
                                }
                                cache[keykey].push(keydata)//对象赋值
                                SQLdata = cache
                            } else if (
                                chart.config.clickChart.datatype == 2 ||
                                chart.config.clickChart.datatype == 3 ||
                                chart.config.clickChart.datatype == 4 ||
                                chart.config.clickChart.datatype == 6 ||
                                chart.config.clickChart.datatype == 7 ||
                                chart.config.clickChart.datatype == 9 ||
                                chart.config.clickChart.datatype == 10 ||
                                chart.config.clickChart.datatype == 11 ||
                                chart.config.clickChart.datatype == 12 ||
                                chart.config.clickChart.datatype == 13
                            ) {
                                //相同keypush到一个数组中
                                if (!cache[keykey]) {
                                    cache[keykey] = []
                                }
                                cache[keykey] = keydata
                                var data = []
                                data.push(cache)//将对象转化为数组
                                SQLdata = data
                            }//其他数据datatype
                            else if (chart.config.clickChart.datatype == 8) {
                                //相同keypush到一个数组中
                                if (!cache[keykey]) {
                                    cache[keykey] = []
                                }
                                cache[keykey] = keydata
                                SQLdata = cache
                            }
                        })
                        //请求，将sql字段保存到数据库
                        $.ajax({
                            url: '/update_chart',
                            data: {
                                showname: chart.config.showName,
                                chartname: chart.config.clickChart.name,
                                chartkey: JSON.stringify([['sql', JSON.stringify(SQLdata)], ['editsql', cache]])
                            },
                            type: 'post',
                            success: function (res) {
                                //存放数据库字段
                                chart.config.clickChart.sql = JSON.stringify(SQLdata)
                                chart.config.clickChart.editsql = cache
                            }
                        })
                        //请求数据库，并渲染
                        var sqlid = chart.config.clickChart.database ? chart.config.clickChart.database : defaultdata
                        $.ajax({
                            url: 'datasource_execute',
                            type: 'post',
                            data: {id: sqlid, sql: JSON.stringify(SQLdata), datatype: chart.config.clickChart.datatype},
                            success: function (resdata) {
                                if (resdata.error) {
                                    layer.msg(resdata.error);
                                } else {
                                    var p_form = $('[name=database]').parents('form')
                                    var myChart = p_form.data('chartDom').data('echart')
                                    var chat = $.extend(true, {}, chart.config.clickChart)
                                    var datavalueby1 = resdata
                                    chat.datavalue = datavalueby1
                                    chart.createOption(chat, function (data, chat, datavalueby) {
                                        refreshExtraOption(chat, data, datavalueby, myChart)
                                    });
                                }
                            }
                        })
                    })
                }
            })
    },
    /**
     * 创建下拉框
     * @param element
     * @param value
     * @param loader
     */
    createElementBySelect: function (element, value, loader) {
        var id = utils.randomString('id', 10)
        var formGroup = $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),
            select = $('<select class="form-control" id="' + id + '" name="' + (element['realChartKey'] || element['chartkey']) + '">')
                .data('chartKey', element['chartkey']).data('change', element['onChange'] || '').data('notOption', element['notOption'] || false).data('index', element['index']).appendTo(
                    $('<div class="col-sm-9">').appendTo(formGroup)
                )
        if ($.isPlainObject(element['value'])) {
            $.each(element['value'], function (value, text) {
                select.append($('<option>', {value: value, text: text}))
            })
        } else if ($.isArray(element['value'])) {
            $.each(element['value'], function (i, op) {
                select.append($('<option>', op))
            })
        }
        utils.autoAttr(element, select)
        value[0] && select.val(value[0]);
        select.multiselect({buttonClass: 'btn btn-default-btn', buttonWidth: '100%'})
    },
    /**
     * 创建拾色器
     * @param element
     * @param value
     * @param loader
     */
    createElementByColor: function (element, value, loader) {
        var id = utils.randomString('id', 10)
        var formGroup = $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),

            input = $('<input type="text" class="form-control"' +
                ' id="' + id + '"  name="' + (element['realChartKey'] || element['chartkey']) + '"  placeholder="' + element['name'] + '" value="' + (value[0] || '') + '">').data('chartKey', element['chartkey']).data('notOption', element['notOption'] || false).appendTo(
                $('<div class="col-sm-9">').appendTo(formGroup)
            )
        input.ColorPicker({
            onChange: function (hsb, hex, rgb) {
                input.val('#' + hex);
                chart.refreshChart(input)
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onSubmit: function (hsb, hex, rgb, el) {
                $(el).val('#' + hex);
                $(el).ColorPickerHide();
                chart.refreshChart($(el))
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(this.value);
            }
        })
    },
    /**
     * 创建截屏器
     * @param element
     * @param value
     * @param loader
     */
    createElementByScreenSnap: function (element, value, loader) {
        var id = utils.randomString('id', 10);
        var formGroup = $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),
            col = $('<div class="col-sm-9">').appendTo(formGroup),
            btn = $('<button type="button" class="btn btn-primary"' +
                ' id="' + id + '">').html(element['buttonText'] || '').appendTo(col),
            img = $('<img class="preview-img">').attr('src', value[0] || element.value).appendTo(
                $('<div class="screen-shot-preview">').appendTo(col));
        btn.on('click', function (e) {
            typeof element['onClick'] === 'function' && element['onClick']({
                dom: btn[0],
                imageDom: img[0],
                orEvent: e
            })
        })
    },
    createElementByButton: function (element, value, loader) {
        var id = utils.randomString('id', 10);
        var formGroup = $('<div class="form-group">').append(
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),
            col = $('<div class="col-sm-9">').appendTo(formGroup),
            btn = $('<button type="button" class="btn btn-primary"' +
                ' id="' + id + '">').html(element['buttonText'] || '').appendTo(col);
        btn.on('click', function (e) {
            var params = {dom: btn[0], orEvent: e},
                chartDom = btn.parents('form').data('chartDom');
            carousel.operate(chartDom, 'edit');
            chart.rendPageForm()
        })
    },
    /**
     * 创建checkBox
     * @param element
     * @param value
     * @param loader
     */
    createElementByBoolean: function (element, value, loader) {
        var id = utils.randomString('id', 10)
        var formGroup = $('<div class="form-group">').append(
            $('<div class="col-sm-9">').append($('<div class="checkbox checkbox-primary">').append(
                $('<input  id="' + id + '" name="' + (element['realChartKey'] || element['chartkey']) + '" class="styled" type="checkbox">').attr('checked', !!value[0]).data('chartKey', element['chartkey']).data('notOption', element['notOption'] || false)
                ).append($('<label>').html(element['name'])).addClass('col-xs-offset-3')
            )).appendTo(loader)
    },
    /**
     * 创建editor
     * @param element
     * @param value
     * @param loader
     */
    createElementByEditor: function (element, value, loader) {
        var id = utils.randomString('id', 10)
        var formGroup = $('<div class="form-group">').append(element['name'] &&
            $('<label for="' + id + '" class="col-sm-3 control-label custom-label">' + element['name'] + '</label>')
            ).appendTo(loader),
            textarea = $('<textarea class="form-control"' +
                ' id="' + id + '"  name="' + (element['realChartKey'] || element['chartkey']) + '" >').data('chartKey', element['chartkey']).data('notOption', element['notOption'] || false).appendTo(
                $('<div class="' + (element['name'] ? "col-sm-9" : "col-sm-12") + '">').appendTo(formGroup)
            )
        utils.autoAttr(element, textarea)
        value[0] && textarea.html(typeof value[0] === 'string' ? value[0] : JSON.stringify(value[0]))
    },
}