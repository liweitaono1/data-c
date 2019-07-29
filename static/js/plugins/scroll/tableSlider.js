(function ($) {


    function TableSlider(el, option) {
        this.fadeEnd = false;
        this.$el = $(el);
        this.__h = 0;
        this.clone = this.$el.children().clone(true);
        this.option = $.extend({}, $.fn.tableSlider.default,
            this.$el.data() || {}, option);

        // console.log(this)
        // 初始化
        this.init();
        // console.log(this.init())
    };

    TableSlider.prototype = {
        // new 方法
        constructor: TableSlider,
        // 初始化
        init: function () {
            // 存在子节点
            // 至少移动一行
            this.option.vis = Math.max(1, parseInt(this.option.vis));
            if ($(this.option.sliCell, this.$el)[0])
                this.animate();
        },
        animate: function () {
            switch (this.option.effect) {
                // 渐隐渐显
                case 'fade':
                    this.calculateByDirection();
                    this.animateFade();
                    break;
                default:
                    this.animateFade();
                    break;
            }
        },
        // 根据移动方向确定移动轨迹
        calculateByDirection: function () {
            var _this = this;
            switch (this.option.direction) {
                case 'bottom':
                    this.$el.css('bottom', 0);
                    this.cssDirection = 'top',
                        this.fadeCon = ':lt(' + this.option.vis + ')',
                        this.removeCon = ':gt(' + (this.$el.find(this.option.sliCell).length - this.option.vis - 1) + ')';
                    break;
                case 'top':
                    this.$el.css('top', 0)
                    this.cssDirection = 'bottom',
                        this.fadeCon = ':gt(' + (this.$el.find(this.option.sliCell).length - this.option.vis - 1) + ')',
                        this.removeCon = ':lt(' + this.option.vis + ')';
                    break;
            }
            this.$el.find(this.option.sliCell + this.removeCon).each(function (i, obj) {
                _this.__h += obj.offsetHeight;
            })
        },
        /**
         * 渐隐渐显
         */
        animateFade: function () {
            clearInterval(this.__b);
            this.o = 0;
            this.elClone = this.$el.find(this.option.sliCell + this.removeCon).clone(true);
            this.elClone.css({
                opacity: 0,
                filter: 'alpha(opacity=0)'
            });
            this.$el.css(this.cssDirection, -this.__h + 'px');
            this.anim();
        },
        anim: function () {
            var _this = this;
            this.__a = window.setInterval(function () {
                _this.animH()
            }, 20);
        },
        animH: function () {
            var _t = parseInt(this.$el.css(this.cssDirection)), _this = this;
            if (_t >= -1) {
                window.clearInterval(this.__a);
                _this.$el.css(this.cssDirection, 0);

                _this.$el.find(_this.option.sliCell + _this.removeCon).remove();
                if (this.option.direction == 'bottom') {
                    this.$el.find(this.option.sliCell).parent().prepend(this.elClone);
                }
                else if (this.option.direction == 'top') {
                    this.$el.find(this.option.sliCell).parent().append(this.elClone);
                }
                this.__c = setInterval(function () {
                    _this.animO()
                }, 20);
                //this.auto();
            } else {
                var __t = Math.abs(_t) - Math.ceil(Math.abs(_t) * .07);
                this.$el.css(this.cssDirection, -__t + 'px');
            }
        },
        animO: function () {
            this.o += 2;
            if (this.o == 100) {
                clearInterval(this.__c);
                this.$el.find(this.option.sliCell + this.fadeCon).css({
                    opacity: 1,
                    filter: 'alpha(opacity=100)'
                });
                this.auto();
            } else {
                this.$el.find(this.option.sliCell + this.fadeCon).css({
                    opacity: this.o / 100,
                    filter: 'alpha(opacity=' + this.o / 100 + ')'
                });
            }

        },
        auto: function () {
            var _this = this;
            this.__b = setInterval(function () {
                _this.animateFade()
            }, this.option.interTime);
        },
        // 刷新
        refresh: function (option) {
            this.option = $.extend({}, this.option, option);
            clearInterval(this.__a), clearInterval(this.__b), clearInterval(this.__c),
                clearInterval(this.__h)
            this.$el.children().remove();
            this.$el.append(this.option.data);
            this.init();
        },
    };


    $.fn.tableSlider = function (option) {
        var method = typeof arguments[0] == "string" && arguments[0];
        var args = method && Array.prototype.slice.call(arguments, 1) || arguments;
        // get a reference to the first marquee found
        var self = (this.length == 0) ? null : $.data(this[0], "tableSlider");
        // console.log(this, $.data(this[0], "tableSlider") ,option)

        // if a method is supplied, execute it for non-empty results
        if (self && method && this.length) {

            // if request a copy of the object, return it
            if (method.toLowerCase() == "object") return self;
            // if method is defined, run it and return either it's results or the chain
            else if (self[method]) {
                // define a result variable to return to the jQuery chain
                var result;
                this.each(function (i) {
                    // apply the method to the current element
                    var r = $.data(this, "tableSlider")[method].apply(self, args);
                    // if first iteration we need to check if we're done processing or need to add it to the jquery chain
                    if (i == 0 && r) {
                        // if this is a jQuery item, we need to store them in a collection
                        if (!!r.jquery) {
                            result = $([]).add(r);
                            // otherwise, just store the result and stop executing
                        } else {
                            result = r;
                            // since we're a non-jQuery item, just cancel processing further items
                            return false;
                        }
                        // keep adding jQuery objects to the results
                    } else if (!!r && !!r.jquery) {
                        result = result.add(r);
                    }
                });

                // return either the results (which could be a jQuery object) or the original chain
                return result || this;
                // everything else, return the chain
            } else return this;
            // initializing request
        } else {
            this.each(function (i, elem) {
                var tableSlider = new TableSlider(elem, option);
                $.data(elem, 'tableSlider', tableSlider)
            });
            return this;
        }
    };

    $.fn.tableSlider.default = {
        sliCell: '.list-view li',
        effect: 'fade',
        direction: 'bottom',
        interTime: 5000,
        vis: 1,
        fadeOption: {
            fadeTime: 100,
        },
    }

    $.fn.tableSlider.constructor = TableSlider;


})(jQuery);
