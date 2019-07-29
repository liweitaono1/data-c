/**
 * chart帮助工具集
 *各类公共方法集
 */
var utils = {
    config: {},
    parseValue: function (element) {
        var type = element.data('elType'), val = element.val();
        if (type == 'int') {
            val = parseInt(val)
        } else if (type == 'float') {
            val = parseFloat(val)
        } else {
        }
        return val;
    },
    getMaxWidth: function (htmlEl, includeSelf) {
        var self = this;
        if (htmlEl) {
            var children = $(htmlEl).children(),
                maxWidth = includeSelf ? $(htmlEl).width() : 0;
            children.each(function (i, item) {
                var curWidth;
                // width()等于0的情况是，用户没有指定其width
                curWidth = (0 === $(item).outerWidth() ? utils.getMaxWidth(item) : $(item).outerWidth());
                maxWidth = (curWidth > maxWidth) ? curWidth : maxWidth;
            }, self);
            return maxWidth;
        } else {
            return 0;
        }
    },
    /**
     * 验证数组是否多维数组
     * @param arr
     * @returns {boolean}
     */
    isMultiArr: function (arr) {
        for (i = 0, len = arr.length; i < len; i++)
            if (arr[i] instanceof Array) return true;
        return false;
    },
    getArrDeep: function (arr, index) {
        index = index || 0;
        if (arr instanceof Array) {
            index++;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] instanceof Array) {
                    return utils.getArrDeep(arr[i], index)
                } else if (!$.isPlainObject(arr[i])) {
                    index--
                }
            }
            return index;
        }
        return index;
    },
    /**
     * 合并生成随机字符串
     * @param base
     * @param len
     * @param charSet
     * @returns {string}
     */
    randomString: function (base, len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return base + '-' + randomString;
    },
    isEmpty: function (value) {
        return (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0));
    },
    setInterval: function (func, delay) {
        var instance = {};

        function tick(func, delay) {
            if (!instance.started) {
                instance.func = func;
                instance.delay = delay;
                instance.startTime = new Date().valueOf();
                instance.target = delay;
                instance.started = true;
                setTimeout(tick, delay);
            } else {
                var elapsed = new Date().valueOf() - instance.startTime,
                    adjust = instance.target - elapsed;
                instance.func();
                instance.target += instance.delay;
                setTimeout(tick, instance.delay + adjust);
            }
        };
        return tick(func, delay);
    },

    /**
     * 获取图表的中心位置
     * @returns {*[]}
     */
    getClient: function () {
        return [(chart.config.chartLoader.width() - chart.config.width) / 2, (chart.config.chartLoader.height() - chart.config.height) / 2]
    },
    //动态图
    isMap: function (chat) {
        return !!chat && chat['charttype'] === 'map';
    },
    //标题
    isTitle: function (chat) {
        return !!chat && chat['charttype'] === 'title';
    },
    //动态图
    isSvg: function (chat) {
        return !!chat && chat['charttype'] === 'svg';
    },
    isLine: function (chat) {
        return !!chat && chat['charttype'] === 'dragline';
    },
    getSvgEl: function (id) {
        return document.getElementById(id)
    },
    getSvgEl1: function (id) {
        return document.getElementsByTagName("path")
    },
    setSvg: function (chat, $this, done) {
        $this.html('');
        $.ajax({
            url: '/get_svg',
            data: {name: chat['data']['svgOption']['name']},
            type: 'post',
            success: function (data) {
                $this.html(data['svg']);
                data = null;
                typeof done === "function" && done(chat)
            }
        })
    },
    isDefineHeatmap: function (chat) {
        return !!chat && chat['charttype'] === 'defineheatmap';
    },
    isMenu: function (chat) {
        return !!chat && chat['charttype'] === 'menu';
    },
    isRotate3d: function (chat) {
        return !!chat && chat['charttype'] === 'rotate3d';
    },
    isMerrygoround: function (chat) {
        return !!chat && chat['charttype'] === 'Merrygoround';
    },
    is3D: function (chat) {
        return !!chat && chat['charttype'] === '3D';
    },
    isMarquee: function (chat) {
        return !!chat && chat['charttype'] === 'marquee';
    },
    isModel: function (chat) {
        return !!chat && chat['charttype'] === 'model';
    },
    isSelect: function (chat) {
        return !!chat && chat['charttype'] === 'select';
    },
    isTimer: function (chat) {
        return !!chat && chat['charttype'] === 'timer';
    },
    isObj: function (chat) {
        return !!chat && chat['charttype'].indexOf("obj") != -1;
    },
    isCountUp: function (chat) {
        return !!chat && chat['charttype'] === 'countUp';
    },
    isScan: function (chat) {
        return !!chat && chat['charttype'] === 'scan';
    },
    isSwitch: function (chat) {
        return !!chat && chat['charttype'] === 'switch';
    },
    isProgress: function (chat) {
        return !!chat && chat['charttype'] === 'progress';
    },
    isCarouse: function (chat) {
        return !!chat && chat['charttype'] === 'carousel';
    },
    isTable: function (chat) {
        return !!chat && chat['charttype'] === 'table';
    },
    isListview: function (chat) {
        return !!chat && chat['charttype'] === 'listview';
    },
    clickSvgByChat: function (chat) {
        var datavalue = chat['sourcetype'] == '1' ? chat['datavalue'] : chat['apidatavalue'];
        if (datavalue) {
            path = utils.getSvgEl1()
            $.each(datavalue, function (i, obj) {
                var objid = obj['objid'] || obj['objId'] || obj['obj_id'],
                    dom = utils.getSvgEl(objid)
                dom.addEventListener('dblclick', clickEvent.Clicktwo)
            })
        }
    },
    hoverSvgByChat: function (chat) {
        var datavalue = chat['sourcetype'] == '1' ? chat['datavalue'] : chat['apidatavalue'];
        if (datavalue) {
            path = utils.getSvgEl1()
            $.each(path, function (i, val) {
                // console.log(val)
                $(val).attr("opacity", "0");
                $(val).attr("data-tips", "null");
                var asd = $(val).attr('id')
                val.removeEventListener('mouseenter', hoverx);
                val.removeEventListener('mouseleave', hovery);
            });
            $.each(datavalue, function (i, obj) {
                var objid = obj['objid'] || obj['objId'] || obj['obj_id'],
                    dom = utils.getSvgEl(objid)
                objid && dom && utils.hoverByChat({'charttype': 'svg'}, obj, dom, true)
            })
        }
    },
    /**
     * 生成随机十六进制颜色
     * @returns {string}
     */
    randomColor: function () {
        var color = Math.floor(Math.random() * 16777216).toString(16);
        while (color.length < 6) {
            color = '0' + color;
        }
        return '#' + color;
    },

    autoAttr: function (option, $this, element) {
        var name = element ? element.attr('name') : null;
        name = name ? name.indexOf('.') > -1 ? name.split('.')[0] : name : null;
        $.each(option, function (method, val) {
            if (name && name !== method)
                return true;
            utils.autoSetting(val, $this)
            // console.log('$this.' + method + '(val);')
            if ($.inArray(method, chart.config.methods) > -1) {
                eval('$this.' + method + '(val)');
            } else if (method.indexOf('childE') === 0) {
                try {
                    $this.find('.' + method.split('_')[1])[0] && $.isPlainObject(val) && utils.autoAttr(val, $this.find('.' + method.split('_')[1]));
                    ($this.find(method.split('_')[1])[0] && $.isPlainObject(val)) && (utils.autoAttr(val, $this.find(method.split('_')[1])));
                } catch (e) {
                    console.log(method + '不符合递归规则', e)
                    return true;
                }
            }
        })
    },
    //拼接提交的字符串
    autoSetting: function (val, $this) {
        // console.log(chart)
        var type = $this.data('type');
        if ($.isPlainObject(val))
            $.each(val, function (k, v) {
                // console.log(k,v)
                //拼接transfom的字符串
                if (typeof k === 'string' && k.indexOf('transform') > -1) {
                    val[k] = "rotate(" + v + "deg)"
                }
                //拼接背景图片url
                if (typeof k === 'string' && k.indexOf('backgroundImage') > -1 && v.indexOf('url') < 0 && chart['config'][type]) {
                    if (v.indexOf('.') > -1) {
                        val[k] = "url(" + chart['config'][type]['imagePath'] + v + ")"
                    } else {
                        val[k] = 'url("/show_image?id=' + v + '")'
                    }
                    val['backgroundRepeat'] = 'no-repeat';
                    val['backgroundSize'] = '100% 100%'
                }
                //兼容拼接边框url
                if (typeof k === 'string' && k.indexOf('border-image-source') > -1 && v.indexOf('url') < 0 && chart['config'][type]) {
                    if (v.indexOf('.') > -1) {
                        val[k] = "url(" + chart['config'][type]['imagePath'] + v + ")"
                    } else {
                        val[k] = 'url("/show_image?id=' + v + '")'
                    }
                    val['border-image-slice'] = '10 16 15 10 fill';
                    val['border-width'] = '10px 16px 15px 10px';
                    val['border-style'] = 'solid';
                    val['background-clip'] = 'padding-box'
                }
                //最新的边框拼接
                if (typeof k === 'string' && k.indexOf('borderl') > -1 && chart['config'][type]) {
                    if (v.indexOf('.') > -1) {
                        val['border-image-source'] = "url(" + chart['config'][type]['imagePath'] + v + ")"
                    } else {
                        val['border-image-source'] = 'url("/show_image?id=' + v + '")'
                    }
                    val['border-image-slice'] = '10 16 15 10 fill';
                    val['border-width'] = '10px 16px 15px 10px';
                    val['border-style'] = 'solid';
                    val['background-clip'] = 'padding-box'
                }
                if (typeof k === 'string' && $.inArray(k, chart.config.needToInt) > -1) {
                    try {
                        val[k] = parseInt(v);
                    } catch (e) {
                        val[k] = v;
                    }
                }
            })
    },
    sleep: function (numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    },
    /**
     * 拼接请求url
     * @param url
     * @param param
     * @returns {*|string}
     */
    createURL: function (url, param) {
        if (!url) return '';
        var urlLink = '';
        $.each(param, function (item, key) {
            var link = '&' + item + "=" + key;
            urlLink += link;
        });
        if (url.indexOf('?') > -1) {
            urlLink = url + urlLink;
        } else {
            urlLink = url + "?" + urlLink.substr(1);
        }
        return urlLink.replace(' ', '');
    },

    //图标的hover事件
    hoverByChat: function (chat, obj, dom, isSvg) {
        try {
            typeof obj === 'string' && (obj = JSON.parse(obj))
        } catch (e) {
            console.warn('静态数据或api格式错误', e)
        }
        var hoverTextArr = [];
        if (obj['tips']) {
            hoverTextArr.push(obj['tips'])
        }
        if (obj['status']) {
            if (obj['status'] == 1) {
                if (utils.isScan(chat))
                    dom.css({
                        backgroundImage: "url(" + chart['config']['scan']['imagePath'] + "scan_green.gif)",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%'
                    })
                else if (utils.isObj(chat))
                    dom.css({backgroundColor: 'transparent'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', 'green');
                    dom.setAttributeNS(null, 'opacity', '0')
                    dom.setAttributeNS(null, 'stroke-opacity', '0')
                }
            } else if (obj['status'] == 2) {
                // console.log(dom, chat,)
                if (utils.isScan(chat))
                    dom.css({
                        backgroundImage: "url(" + chart['config']['scan']['imagePath'] + "scan_red.gif)",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%'
                    })
                else if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF8C69'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF8C69');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
                // console.log(hoverTextArr)
            } else if (obj['status'] == 3) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF0000'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF0000');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 4) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FFE1FF'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FFE1FF');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 5) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FFD39B'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FFD39B');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 6) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FFBBFF'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FFBBFF');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 7) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FFAEB9'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FFAEB9');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 8) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF8C69'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF8C69');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 9) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF8247'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF8247');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 10) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF7256'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF7256');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 12) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF6347'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF6347');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else if (obj['status'] == 13) {
                if (utils.isObj(chat))
                    dom.css({backgroundColor: '#FF34B3'});
                else if (isSvg) {
                    dom.setAttributeNS(null, 'fill', '#FF34B3');
                    dom.setAttributeNS(null, 'opacity', '0.5');
                    dom.setAttributeNS(null, 'stroke-opacity', '0.5')
                }
                if (obj['msg']) {
                    hoverTextArr.push('信息：' + obj['msg'])
                }
            } else {
                console.warn('状态码仅支持 1-13，实际状态码：' + obj['status'])
            }
        }
        var index, hoverDom = utils.isObj(chat) ? dom.find('.image') : dom;
        hoverTextArr = hoverTextArr.join('<br/>');
        // console.log(hoverDom)
        if (hoverTextArr == "null") {
            hoverTextArr = null
        }
        isSvg ? hoverDom.setAttributeNS(null, 'data-tips', hoverTextArr) : hoverDom.data('tips', hoverTextArr);
        // console.log(hoverDom)
        hoverTextArr && (hoverDom[0] ? hoverDom.pt({content: hoverDom.data('tips')}) : (hoverDom.addEventListener('mouseenter', hoverx),
                hoverDom.addEventListener('mouseleave', hovery))
        )
    },

    //异常提示
    error: function (content, options) {
        layer.msg(content, $.extend({
            icon: 5,
            time: 0,
            anim: 6,
            offset: '15px',
            shade: 0.1,
            shadeClose: true
        }, options));
    },

    //warning提示
    warning: function (content, options) {
        layer.msg(content, $.extend({
            icon: 7,
            time: 0,
            anim: 6,
            offset: '15px',
            shade: 0.1,
            shadeClose: true
        }, options));
    },

    //成功提示完成后处理success函数
    success: function (content, options, success) {
        var f = typeof options === 'function';
        layer.msg(content, $.extend({
            offset: '15px'
            , icon: 6
            , time: 1000,
            shade: 0.1,
        }, f ? {} : options), f ? options : success);
    },

    prompt: function (e, t) {
        var a = "";
        if (e = e || {}, "function" == typeof e && (t = e), e.area) {
            var o = e.area;
            a = 'style="width: ' + o[0] + "; height: " + o[1] + ';"',
                delete e.area
        }
        var s, l = 2 == e.formType ? '<textarea class="layui-layer-input"' + a + "></textarea>" :
            function () {
                if (e.formType == 1) {
                    return '<input type="password" class="layui-layer-input">'
                } else if (e.formType == 3) {
                    return '<input type="number" class="layui-layer-input">'

                } else {
                    return '<input type="text" class="layui-layer-input">'
                }
            }(), f = e.success;
        return delete e.success, layer.open($.extend({
            type: 1,
            btn: ["&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;"],
            content: l,
            skin: "layui-layer-prompt",
            maxWidth: $('body').width(),
            success: function (t) {
                s = t.find(".layui-layer-input"), s.attr('custom-url') ? madmin.renderSelect(s, {
                    afterLoad: function () {
                        s.val(e.value || "").focus()
                    }
                }) : s.val(e.value || "").focus(), "function" == typeof f && f(t)
            },
            resize: !1,
            yes: function (i) {
                var n = s.val();
                "" === n ? s.focus() : n.length > (e.maxlength || 500) ? r.tips("&#x6700;&#x591A;&#x8F93;&#x5165;" + (e.maxlength || 500) + "&#x4E2A;&#x5B57;&#x6570;", s, {tips: 1}) : t && t(n, i, s)
            }
        }, e))
    },
    //draggable.js方法开始
    measureMaxMin: function (container, current) {
        if (!container || !container[0]) {
            return false
        }
        var offset = container.offset(), w = container.width(), h = container.height()
        return {min: {left: 0, top: 0}, max: {left: w - current.width(), top: h - current.height()}}
    },

    offsetContain: function (current, maxMin, notMin) {
        var middleLeft = (maxMin.max.left - maxMin.min.left) / 2,
            middleTop = (maxMin.max.top - maxMin.min.top) / 2;
        if (current.left > middleLeft) {
            current.left = Math.min(current.left, maxMin.max.left)

        } else {
            current.left = Math.max(current.left, maxMin.min.left)
        }

        if (current.top > middleTop) {
            current.top = Math.min(current.top, maxMin.max.top)
        } else {
            current.top = Math.max(current.top, maxMin.min.top)
        }
        return current
    }
    //draggable.js方法结束
}