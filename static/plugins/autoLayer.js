(function ($) {
    //首先备份下jquery的ajax方法
    var _ajax = $.ajax;
    var index = undefined;

    //重写jquery的ajax方法
    $.ajax = function (opt) {
        //备份opt中error和success方法
        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            },
            success: function (data, textStatus) {
            }
        }
        if (opt.error) {
            fn.error = opt.error;
        }
        if (opt.success) {
            fn.success = opt.success;
        }

        //扩展增强处理
        var _opt = $.extend(opt, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //错误方法增强处理
                // console.log(XMLHttpRequest, textStatus, errorThrown)
                if (XMLHttpRequest.status === 0) {
                    if (!index)
                        index = parent.layer.alert('网络故障请稍后重试', {icon: 5, title: false, closeBtn: false}, function () {
                            location.reload();
                        });

                    return false;
                }
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus, status) {
                //成功回调方法增强处理
                if (typeof data === 'string' && data.indexOf('class="login"') > -1) {
                    if (!index)
                        index = parent.layer.alert('用户已经过期请重新登录', {
                            icon: 5,
                            title: false,
                            closeBtn: false
                        }, function () {
                            location.reload();
                        });

                    return false;
                }
                fn.success(data, textStatus);
            },
            beforeSend: function (XHR) {
            },
            complete: function (XHR, TS) {
            }
        });
        return _ajax(_opt);
    };
})(jQuery);


class Utils {
    static parse(json) {
        const that = this;
        if (typeof json === 'string')
            return this.pluginParse(json)
        else if (typeof json === 'object') {
            $.each(json, function (k, v) {
                if (typeof v === "string" && v.indexOf('{') === 0 && v.indexOf('}') === (v.length - 1))
                    json[k] = that.pluginParse(v);
            })
            return json
        }
    }

    static pluginParse(json) {
        // json字符串转换成对象
        JSON.parse(json, function (k, v) {
            if (v.indexOf && v.indexOf('function') > -1) {
                return eval("(function(){return " + v + " })()")
            }
            return v;
        });
    }
}

// 自动弹出
class AutoLayer {
    // 初始化
    constructor(selector, option) {
        this.selector = selector,
            this.option = Utils.parse(option);
        this._init()
    };

    // 加载事件
    _init() {
        $(document).on(this.option['event'] || 'click', this.selector, this._makeEvent())
    };

    // 制造事件
    _makeEvent() {
        const that = this,
            layerOption = that._makeLayerOption()
        return (function () {
            layer.open(layerOption)
        })
    };

    // 制造属性
    _makeLayerOption() {

        const that = this,
            layerOption = $.extend({}, this.option.layeroption, {
                yes: function (index, lay) {
                    // console.log(lay.find('iframe').contents().find('form'))
                    that.option.layeroption.yesReqUrl && $.ajax({
                        url: that.option.layeroption.yesReqUrl,
                        data: lay.find('iframe').contents().find('form').serialize(),
                        type: 'post',
                        success: function (res) {
                            if (!res.status) {
                                layer.close(index);
                                location.reload();
                            } else {
                                parent.layer.msg(res.msg, {
                                    icon: 5,
                                    time: 0,
                                    anim: 6,
                                    offset: '15px',
                                    shade: 0.1,
                                    shadeClose: true
                                });

                            }
                        }
                    })

                }
            })
        return layerOption
    };
}

// 调用自动加载
$(function () {
    new AutoLayer('.handler', $('.handler').data());
})


