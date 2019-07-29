/**
 * 图标渲染时候数据请求方式
 */
var request = {
    serialize: function (option, reverse) {
        if (option.legend && option.legend.formatter && ((!reverse && typeof option.legend.formatter === 'string' && option.legend.formatter.indexOf('function') > -1) || (reverse && typeof option.legend.formatter === 'function'))) {

            reverse || (option.legend.formatter = eval("(function(){return " + option.legend.formatter + " })()"));
            reverse && (option.legend.formatter = option.legend.formatter.toString());
        }
    },
    clearTimerCache: function (chat) {
        window.clearInterval(chart.config.timerCache[chat['name']]);
        chart.config.timerCache[chat['name']] = undefined;
    },
    //数据库调用请求
    sqlPost: function (chat, done, mustDo) {
        // console.log(chat)
        $.ajax({
            url: 'datasource_execute',
            type: 'post',
            data: {id: chat.database, sql: chat.sql, datatype: chat.datatype},
            success: function (res) {
                // console.log(res)
                if (res.error) {
                    layer.msg(chat.name + '数据库失败');
                    request.createOptionByStatic(chat, done)
                } else {
                    chat.sourcevalue = res
                    request.createOptionByStatic(chat, done, false, true)
                }
            }
        })
    },
    //API调用请求
    ajaxPost: function (chat, done, mustDo) {
        $.ajax({
            url: '/getPostByUrl',
            data: {url: chat['api']['url']},
            type: 'post',
            success: function (data) {
                try {
                    data = JSON.parse(data)
                    if (data.status == 600 || data.statusCode == 500) {
                        // console.log(chat)
                        data = chat.datavalue
                    } else {
                        data = data
                    }
                } catch (e) {
                }
                if (chart.config.timerCache[chat['name']] || mustDo) {
                    chat['apidatavalue'] = data;
                    request.createOptionByStatic(chat, done, true)
                }
            }
        })
    },
    //静态数据调用请求
    createOptionByStatic: function (chat, done, isApi, issql) {
        //是否为obj
        if (chat['charttype'].indexOf("obj") != -1) {
            chat['charttype'] = "obj"
        }
        var method, datavalue = isApi ? chat['apidatavalue'] : chat['datavalue'];
        datavalue = issql ? chat['sourcevalue'] : chat['datavalue']
        chat && (
            chart.isChart(chat['charttype']) &&
            ((chat['datatype'] == 1) && initialization.generateLine(chat['data'], datavalue),
            (chat['datatype'] == 5) && initialization.generateLine(chat['data'], datavalue, true),
            (chat['datatype'] == 2) && initialization.generatePie(chat['data'], datavalue),
            (chat['datatype'] == 3) && initialization.generateScatter(chat['data'], datavalue)),
            chart.isChart(chat['charttype']) || (method =
                chat['charttype'].replace(chat['charttype'].charAt(0), chat['charttype'].charAt(0).toUpperCase()),
                typeof initialization['generateHtmlBy' + method] === 'function' ? initialization['generateHtmlBy' + method](chat, datavalue) :
                    initialization.generateHtml(chat, datavalue))
        ),
        typeof done === 'function' && done(chat.data, chat, datavalue)
    }
}