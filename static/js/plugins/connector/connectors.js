/**
 * 连接器对象
 * @param els
 * @param config
 * @constructor
 */
function Line(els, config) {
    this.initConfig = $.extend({}, this.defaultConifg, config);
    this.els = els;
    this.realLines = chart.config.showData.show.lines || [];
    this.init();
};
// 连接器点缓存
Line.prototype.pointCache = {};
// 清除连接器的缓存
Line.prototype.clearPointCache = function () {
    this.pointCache = {};
};
// 添加点的缓存
Line.prototype.pushPointCache = function (key, value) {
    if (!this.pointCache[key]) {
        var _temp = [];
        _temp.push(value);
        this.pointCache[key] = _temp;
    } else {
        this.pointCache[key].push(value);
    }
};
// 连接器的默认配置
Line.prototype.defaultConifg = {
    operate: 'view',
};
// 连接器的点查看配置
Line.prototype.viewPointOptions = {
    enabled: false,
    paintStyle: {
        fill: 'transparent', stroke: '#transparent', radius: 1,
        strokeWidth: 0
    },
    hoverPaintStyle: {
        fill: 'transparent', stroke: '#transparent', radius: 10,
        strokeWidth: 1
    }
};

// 连接器的点编辑配置
Line.prototype.editPointOptions = {
    isTarget: true,
    isSource: true,
};
// 连接器的所有支持的点
Line.prototype.allEndPoints = {
    'Left': {x: 0, y: 0.5},
    'Top': {x: 0.5, y: 0},
    'Right': {x: 1, y: 0.5},
    'Bottom': {x: 0.5, y: 1},
};
// 连接器的初始化方法
Line.prototype.constructor = Line;

// 连接器的init方法
Line.prototype.init = function () {
    var self = this;
    self.clearPointCache();
    if (!this.els || this.els.length < 0) {
        return;
    }
    if (!this.jsi)
        this.jsi = jsPlumb.getInstance($.extend({}, this.config, this.initConfig || {}));
    // 初始化连线
    this.jsi.importDefaults({Connector: this.initConfig.connector});
    self.initConnections();
    // 根据操作模式初始化连接点
    $.each(this.els, function (i, el) {
        if (self.initConfig.operate == 'edit')
            $(el).dragUnable();
        else if (self.initConfig.operate == 'view' && chart.config.option.editSwitch)
            $(el).draggable();
        self.drawOtherEndPoint(el);
    });
    // 监听事件
    self.listening();
};
/**
 * 初始化连线
 */
Line.prototype.initConnections = function () {
    var self = this;
    // 有连线
    if (self.realLines && self.realLines.length > 0) {
        // 根据线初始化连线
        self.initConnectionsByLines();
        // 无连线直接添加所有的连接点
    } else {
        self.addPoints();
    }
};
/**
 * 根据已画的的连接点画剩余的点
 * @param el
 */
Line.prototype.drawOtherEndPoint = function (el) {
    var self = this, drawed = this.pointCache[el.id];
    // 没有画过
    if (!drawed) {
        this.addPointsFor(el)
    } else {
        // 画过了的
        var keys = Object.keys(this.allEndPoints);
        // 检查每个点是否画过，没有画过，则画出
        $.each(keys, function (i, val) {
            if ($.inArray(val, drawed) < 0) {
                self.addPointFor(el, val)
            }
        })

    }
};
/**
 * 根据线连接
 */
Line.prototype.initConnectionsByLines = function () {
    var self = this;
    // 格式化已画连接点缓存
    self.toDrawEndPoints = $.extend(true, {}, self.allEndPoints);
    self.toDrawEndPoints = $.map(self.toDrawEndPoints, function (val) {
        return val;
    });
    // 根据现有的每一条线画
    $.each(self.realLines, function (i, line) {
        self.drawLine(line);
    });
};

/**
 * 根据点的位置获取到点的类型
 * @param a
 * @returns {*}
 */
Line.prototype.getAnchor = function (a) {
    var result = null;
    $.each(this.allEndPoints, function (k, val) {
        if ($.isObjectValueEqual(val, a)) {
            result = k;
            return false;
        }
    });
    return result;
};
/**
 * 根据操作模式得到不同点的模型
 * @param anchor
 * @returns {any | {}}
 */
Line.prototype.getEndPoint = function (anchor) {
    var self = this;
    return $.extend({}, {'anchor': anchor},
        (
            self.initConfig.operate === 'view' ? self.viewPointOptions : self.editPointOptions
        )
    );
};
/**
 * 根据线条样式、线条的模式连接
 * @param line
 */
Line.prototype.drawLine = function (line, con, el, update) {
    update && this.jsi.deleteConnection(con)
    var self = this,
        sourceAnchor = self.getAnchor(line.sourceEndpoint.anchor),
        sourcePoint = self.jsi.addEndpoint(line.sourceId, self.getEndPoint(sourceAnchor)),
        targetAnchor = self.getAnchor(line.targetEndpoint.anchor),
        targetPoint = self.jsi.addEndpoint(line.targetId, self.getEndPoint(targetAnchor)),
        connection = self.jsi.connect($.extend({
            id: line.id,
            source: line.sourceId,
            target: line.targetId,
            sourceEndpoint: sourcePoint,
            targetEndpoint: targetPoint,
            line: line,
            update: update ? true : false
        }, line['data']['lineOption'] || {}));
    // update && connection.setProp('update', true);
    update && el.parents('form').data('con', connection);
    self.pushPointCache(line.sourceId, sourceAnchor), self.pushPointCache(line.targetId, targetAnchor),
        self.initEvent(connection);

    update || self.refreshLine(line, connection);
    return connection
};

// 线的右击事件
Line.prototype.contextmenuLine = function (connection, e) {
    var self = this;
    $('.drag-box .toolbar').hide(),
        $('.new-toolbar-new').remove();
    var toolbar = $('<ul class="dropdown-menu dropdown-context">')
        .append($('<li>').append($('<a href="javascript:;">').html('<i class="fa fa-trash"></i>&nbsp;&nbsp;删除')).on('click', function () {
            $('.new-toolbar-new').remove();
            layer.confirm('确认删除，删除之后将不能恢复！', {title: '温馨提示'}, function (index, l) {
                chart.config.lineConnector.jsi.deleteConnection(connection);
                layer.close(index);
            });
        })).addClass('new-toolbar-new').css({
            top: (e.pageY),
            left: (e.pageX)
        }).appendTo($('body'));
    toolbar.show();
};
// 线的左击事件
Line.prototype.clickLine = function (con, e) {
    $.ajax({
        url: '/operate_line',
        type: 'post',
        data: {
            show_name: chart.config.showName,
            line_id: con.id,
            op: 'get'
        },
        success: function (data) {

            chart.rendFormByChart(data, e.target, con);
        }
    })
};

// 监听连线，删除线的事件
Line.prototype.listening = function () {
    var self = this;
    this.jsi.bind("connection", function (info) {
        if (info.connection.sourceId == info.connection.targetId) {
            self.jsi.deleteConnection(info.connection);
            return false;
        }
        if (info.connection.update) {
            return false;
        }
        self.pushLine(info);
    });
    this.jsi.bind("connectionDetached", function (info) {
        self.removeLine(info.connection);
    });
};
/**
 * 删除连线
 * @param con
 * @param domId
 */
Line.prototype.removeLine = function (con, domId) {

    var self = this;
    if (con) {
        if (con.sourceId == con.targetId || con.update == true) {
            return;
        }
        $.ajax({
            url: '/operate_line',
            type: 'post',
            data: {
                show_name: chart.config.showName,
                line_id: con.id,
                op: 'remove'
            },
            success: function (data) {
                self.updateLine(con.id)
            }
        });
    } else if (domId) {
        for (var i = self.realLines.length - 1; i >= 0; i--) {
            if (self.realLines[i].sourceId == domId || self.realLines[i].targetId == domId) {
                $('[conid=' + self.realLines[i].id + ']').remove();
                self.realLines.splice(i, 1);
                // i--;
            }
        }
        $.ajax({
            url: '/operate_line',
            type: 'post',
            data: {
                show_name: chart.config.showName,
                lines: JSON.stringify(self.realLines),
                op: 'set'
            },
            success: function (data) {
            }
        })
    }
};
/**
 * 绑定事件
 * @param con
 */
Line.prototype.initEvent = function (con) {
    if (chart.config.option.editSwitch) {
        con.bind('click', this.clickLine);
        con.bind('contextmenu', this.contextmenuLine);
    }
}

/**
 * 添加线
 * @param line
 */
Line.prototype.pushLine = function (line) {
    var self = this;
    var l = {};
    $.extends(l, line.connection, ['id']);
    $.extends(l, line, ['sourceId', 'targetId']);
    l.sourceEndpoint = {anchor: $.extends({}, line.sourceEndpoint.anchor, ['x', 'y'])};
    l.targetEndpoint = {anchor: $.extends({}, line.targetEndpoint.anchor, ['x', 'y'])};
    l.data = {'lineOption': {connector: this.initConfig.connector}};
    $.ajax({
        url: '/operate_line',
        type: 'post',
        data: {
            show_name: chart.config.showName,
            update: JSON.stringify(l),
            op: 'add'
        }, success: function (data) {
            self.realLines = data.lines;
            $.each(self.realLines, function (i, obj) {
                if (obj['id'] == line.connection.id) {
                    line.connection.setProp('line', obj)
                }
            });
            self.initEvent(line.connection);
            self.clickLine(line.connection, {})
        }
    });
};

/**
 * 刷新连线效果
 */
Line.prototype.refreshConnectEffect = function () {
    var self = this;
    $.each(this.jsi.getAllConnections(), function (i, con) {
        self.refreshLine(con.line, con);
    });
};
/**
 * 更新连线
 * @param line
 * @param update
 */
Line.prototype.updateLine = function (line, update) {
    var self = this;
    $.each(this.realLines, function (i, obj) {
        if (obj['id'] == (update ? line.id : line)) {
            self.realLines.splice(i, 1);
            update || $('[conid=' + obj.id + ']').remove();
            update && self.realLines.push(line);
        }
        ;
    });
};

/**
 * 刷新连线
 * @param line
 * @param con
 * @param isModify
 */
Line.prototype.refreshLine = function (line, con, el, isModify) {
    isModify && (con.setProp('update', true), con = this.drawLine(line, con, el, true));
    con.setProp('line', line);
    $('[conid=' + line.id + ']').remove();
    if (line && line.data.effect && line.data.effect.value) {
        switch (line.data.effect.value) {
            case 'flow':
                var transform = con.connector.path.getAttribute('transform')
                transform.substr(1, transform.length - 1);
                transform = transform.replace(',', 'px,').replace(')', 'px)')
                $('<div  conid="' + con.id + '">').css(
                    {
                        position: 'absolute',
                        top: con.connector.svg.style.top,
                        left: con.connector.svg.style.left
                    }
                ).append($('<div>').css({
                    transform: transform,
                    'webkitTransform': transform
                }).append($('<div class="line-effect">').css({
                    offsetPath: 'path("' + con.connector.getPathData() + '")',

                }))).appendTo(chart.config.chartLoader)
                break;
        }
    }
    isModify && this.updateLine(line, true), $.ajax({
        url: '/operate_line',
        type: 'post',
        data: {
            show_name: chart.config.showName,
            'line_id': line.id,
            op: 'modify',
            update: JSON.stringify(line)
        }
    })

};
/**
 * 添加连接点
 */
Line.prototype.addPoints = function () {
    var self = this;
    $.each(this.els, function (i, el) {
        self.addPointsFor(el);
    });
};
/**
 * 为一个元素添加连接点
 * @param el
 */
Line.prototype.addPointsFor = function (el) {
    this.addPointFor(el, "Right");
    this.addPointFor(el, "Left");
    this.addPointFor(el, "Top");
    this.addPointFor(el, "Bottom");
};
/**
 * 为一个元素添加一个连接点
 * @param el
 * @param anchor
 */
Line.prototype.addPointFor = function (el, anchor) {
    this.jsi.addEndpoint(el, this.getEndPoint(anchor));
};
/**
 * 整体刷新方法
 * @param option
 * @param els
 */
Line.prototype.refresh = function (option, els) {
    this.initConfig = $.extend(this.initConfig, option || {});
    this.els = els || this.els;
    this.jsi.reset();
    this.init();
};

/**
 * 连接器标准配置
 * @type {{Anchor: string[], Anchors: string[], ConnectionsDetachable: boolean, ConnectionOverlays: *[][], Connector: string, Container: string, DoNotThrowErrors: boolean, DragOptions: {cursor: string, zIndex: number}, DropOptions: {}, Endpoint: string, Endpoints: *[], EndpointOverlays: Array, EndpointStyle: {fill: string, stroke: string, radius: number, strokeWidth: number}, EndpointStyles: *[], EndpointHoverStyle: {fill: string, stroke: string, radius: number, cursor: string, strokeWidth: number}, EndpointHoverStyles: *[], HoverPaintStyle: {stroke: string, strokeWidth: number}, LabelStyle: {color: string}, LogEnabled: boolean, Overlays: Array, MaxConnections: number, PaintStyle: {stroke: string, strokeWidth: number, joinstyle: string}, ReattachConnections: boolean, RenderMode: string, Scope: string, reattach: boolean}}
 */
Line.prototype.config = {
    //锚点位置；对任何没有声明描点的Endpoint设置锚点，用于source及target节点
    Anchor: ["Right", "Left", "Top", "Bottom"],
    Anchors: ["Right", "Left", "Top", "Bottom"],  //连线的source和target Anchor
    ConnectionsDetachable: false, //连线是否可用鼠标分离
    ConnectionOverlays: [  //连线的叠加组件，如箭头、标签
        ["Arrow", {  //箭头参数设置
            location: 1,
            visible: true,
            width: 11,
            length: 11,
            id: "ARROW",
            events: {
                click: function () {
                }
            }
        }],
        ["Label", {  //标签参数设置
            location: 0.1,
            id: "label",
            cssClass: "aLabel", //hover时label的样式名
            events: {
                tap: function () {
                }
            },
            visible: true
        }]
    ],
    Connector: "Straight", //连线的类型，流程图(Flowchart)、贝塞尔曲线等
    //父级元素id；假如页面元素所在上层不同，最外层父级一定要设置
    Container: "module",
    //如果请求不存在的Anchor、Endpoint或Connector，是否抛异常
    DoNotThrowErrors: false,
    //通过jsPlumb.draggable拖拽元素时的默认参数设置
    DragOptions: {cursor: 'pointer', zIndex: 2000},
    DropOptions: {}, //target Endpoint放置时的默认参数设置
    Endpoint: "Dot", //端点（锚点）的样式声明
    //用jsPlumb.connect创建连接时，source端点和target端点的样式设置
    Endpoints: [null, null],
    EndpointOverlays: [], //端点的叠加物
    //端点的默认样式
    EndpointStyle: {
        fill: 'transparent', stroke: '#1565C0', radius: 10,
        strokeWidth: 1
    },
    EndpointStyles: [null, null], //连线的source和target端点的样式
    //端点hover时的样式
    EndpointHoverStyle: {
        fill: '#1565C0', stroke: '#1565C0', radius: 10,
        cursor: 'crosshair',
        strokeWidth: 1
    },
    //连线的source和target端点hover时的样式
    EndpointHoverStyles: [null, null],
    //连线hover时的样式
    HoverPaintStyle: {stroke: '#1565C0', strokeWidth: 5},
    LabelStyle: {color: "black"}, //标签的默认样式，用css写法。
    LogEnabled: false, //是否开启jsPlumb内部日志
    Overlays: [], //连线和端点的叠加物
    MaxConnections: 10, //端点支持的最大连接数
    //连线样式
    PaintStyle: {stroke: '#1565C0', strokeWidth: 3, joinstyle: 'round'},
    ReattachConnections: true, //是否重新连接使用鼠标分离的线?
    RenderMode: "svg", //默认渲染模式
    Scope: "jsPlumb_DefaultScope", //范围，具有相同scope的点才可连接
    reattach: true,
};


$(function () {
    // 连线类型模式切换
    $('[line-connector=true]').on('click', function () {
        if (carousel.eidtSwitch == true) {
            // console.log($.extend({}, {operate: 'edit'}, $(this).data()))
            // chart.config.lineConnector.refresh($.extend({}, {operate: 'edit'}, $(this).data()),$('.drag-box'));
        } else {
            chart.config.lineConnector.refresh($.extend({}, {operate: 'edit'}, $(this).data()), $('.drag-box'));
        }
    });
    // 移动模式切换
    $('[line-move=true]').on('click', function () {
        chart.config.lineConnector.refresh({operate: 'view'}, $('.drag-box'));
    });
});

/**
 * 取你想取的数据
 * @param target 目标体
 * @param clone 克隆体
 * @param exclude 想取的key
 * @returns {*}
 */
$.extends = function (target, clone, exclude) {
    $.each(clone, function (k, val) {
        if ($.inArray(k, exclude) > -1) {
            target[k] = val
        }
    });
    return target;
};


/**
 * 判断两个对象是否相等
 * @param a 对象
 * @param b 对象
 * @returns {boolean}
 */
$.isObjectValueEqual = function (a, b) {

    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);


    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    return true;
};
