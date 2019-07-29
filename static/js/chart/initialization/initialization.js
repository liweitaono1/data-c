var initialization = {
    /**
     * 初始化组件html属性
     **/
    generateHtmlByCountUp: function (chat, datavalue) {
        chat.data.dataNumber = datavalue || 0;
    },
    generateHtmlBySelect: function (chat, datavalue) {
    },
    generateHtmlByProgress: function (chat, datavalue) {
        chat.data.progressOption ? chat.data.progressOption.value = parseInt(datavalue || 0) : chat['data'] = {
            progressOption: {
                value: parseInt(datavalue || 0)
            }
        };
    },
    generateHtmlByListview: function (chat, datavalue) {
        var listtable = '';
        for (var i = 0, len = datavalue.length; i < len; i++) {
            listtable += "<li>" + datavalue[i] + "</li>"
        }
        var listtable1 = '';
        listtable1 = "<ul class='list-view'>" + listtable + "</ul>"
        chat.data.listviewValue = listtable1

    },
    generateHtmlByMerrygoround: function (chat) {

    },
    generateHtmlByObj: function (chat) {

    },
    generateHtmlBy3D: function (chat) {

    },
    generateHtmlByMenu: function (chat) {

    },
    generateHtmlByRotate3d: function (chat) {

    },
    generateHtmlByDefineheatmap: function (chat) {

    },
    generateHtmlBySvg: function (chat) {

    },
    generateHtmlByScan: function (chat) {

    },
    generateHtmlByCarousel: function (chat) {

    },
    generateHtmlByTable: function (chat, datavalue) {
        chat.data.tableData = datavalue || []
    },
    generateHtml: function (chat, datavalue) {
        var html = datavalue
        if ($.isPlainObject(html)) {
            html = JSON.stringify(html)
        }
        chat.data.html = $('<div>').append($('<li>').append(html)).html()
    },

    /**
     * 生成折线或柱状图
     *
     */
    generateLine: function (option, data, reverse) {
        if (!option) {
            console.warn('原始 option 不能为空');
            return false;
        }
        var x = reverse ? 'y' : 'x', y = reverse ? 'x' : 'y';
        // console.log(x, y, data[x])
        if (option.series && $.isArray(option.series) && option.series.length > 0) {
            var legendData = [];
            $.each(option.series, function (i, sery) {
                legendData.push(sery['name'] || '')
                data && data[y] && (sery['data'] = data[y][i])
                // 支持color function 序列化
                if (sery.itemStyle) {
                    sery.itemStyle.normal && sery.itemStyle.normal.color && typeof sery.itemStyle.normal.color === 'string' && (sery.itemStyle.normal.color.indexOf('function') > -1 && (sery.itemStyle.normal.color = eval("(function(){return " + sery.itemStyle.normal.color + " })()")))
                    sery.itemStyle.emphasis && sery.itemStyle.emphasis.color && (sery.itemStyle.emphasis.color.indexOf('function') > -1 && (sery.itemStyle.emphasis.color = eval("(function(){return " + sery.itemStyle.emphasis.color + " })()")))
                }
                // 支持label function 序列化
                if (sery.label) {
                    sery.label.normal && sery.label.normal.formatter && typeof sery.label.normal.formatter === 'string' && (sery.label.normal.formatter.indexOf('function') > -1 && (sery.label.normal.formatter = eval("(function(){return " + sery.label.normal.formatter + " })()")))
                }
            });
            option['legend'] = option['legend'] || {},
            legendData.length > 0 && (option['legend']['data'] = legendData);
        }

        !reverse && (option.xAxis && $.isArray(option.xAxis) && option.xAxis.length > 0 &&
            $.each(option.xAxis, function (i, xAxy) {
                data && data[x] && (xAxy['data'] = utils.isMultiArr(data[x]) ? data[x][i] : data[x])
            })
        )

        reverse && (option.yAxis && $.isArray(option.yAxis) && option.yAxis.length > 0 &&
            $.each(option.yAxis, function (i, yAxy) {
                data && data[x] && (yAxy['data'] = utils.isMultiArr(data[x]) ? data[x][i] : data[x])
            })
        )
    },

    /**
     * 生成饼图
     *
     */
    generatePie: function (option, data,) {
        option.series[0].data = data
        var legendData = [];
        $.each(data, function (i, obj) {
            legendData.push(obj['name']);
        })
        $.each(option.series[0].data, function (i, d) {
            d.itemStyle && d.itemStyle.normal && d.itemStyle.normal.color && d.itemStyle.normal.color.indexOf('function') > -1 && (d.itemStyle.normal.color = eval("(function(){return " + d.itemStyle.normal.color + " })()"));
        });
        // 支持 label formatter function 序列化
        if (option.series[0].label) {
            option.series[0].label.normal && option.series[0].label.normal.formatter && option.series[0].label.normal.formatter.indexOf('function') > -1 && (option.series[0].label.normal.formatter = eval("(function(){return " + option.series[0].label.normal.formatter + " })()"));
        }
        option.legend ? (option.legend.data = legendData) : (option['legend'] = {data: legendData})
        request.serialize(option)
    },

    /**
     * 生成散点图
     *
     */
    generateScatter: function (option, data,) {
        if (utils.getArrDeep(data) === 2) {
            $.each(data, function (i, obj) {
                try {
                    option.series[i].data = obj
                } catch (e) {
                    option.series.push({data: obj})
                }
            })
        } else {
            option.series[0].data = data;
        }
        if (option.series && $.isArray(option.series) && option.series.length > 0) {
            var legendData = [];
            $.each(option.series, function (i, sery) {
                legendData.push(sery['name'] || '')
            });
            option['legend'] = option['legend'] || {},
            legendData.length > 0 && (option['legend']['data'] = legendData);
        }
        request.serialize(option)
    },
}