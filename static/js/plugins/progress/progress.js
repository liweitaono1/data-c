var Loader = (function ($) {
    //loading队列
    var Queue = function () {
        var loadings = [];

        return {
            //添加一个loading任务
            push: function (loading) {
                loadings.push(loading);
            },
            //执行队列中的任务
            flush: function () {
                if (this.isEmpty()) return;

                var self = this;

                function play() {
                    //队列是否处于执行状态
                    self.playing = true;
                    //从队列取第一个任务开始执行
                    loadings.shift().start(function () {
                        if (self.isEmpty()) {
                            //队列执行完毕
                            self.playing = false;
                            //调用外部可能设置有的回调
                            self.onComplete && self.onComplete();
                            return;
                        }
                        //执行队列中的下一个任务
                        play();
                    });
                }

                //执行队列当前的第一个任务
                play();
            },
            //外部可用来设置队列执行完毕时的回调
            set: function (onComplete) {
                this.onComplete = onComplete;
            },
            //外部可用来判断队列是否正在执行
            isPlaying: function () {
                return !!this.playing;
            },
            //外部可用来判断队列是否为空
            isEmpty: function () {
                return !loadings.length;
            }
        }
    };

    //定义加载任务
    var Loading = function (duration, progress, interval) {

        //duration 该任务的加载时间
        //progress 该任务加载过程中提供给外部的回调，外部在此回调内更新进度条的样式
        //interval 加载的有效范围，如[20,30]，表示该任务定义的是从20%加载到30%的过程

        return {
            start: function (finished) {
                //finished是当前任务执行完毕时的回调
                var startTime = Date.now();

                function step() {
                    var endTime = Date.now();
                    var p = (endTime - startTime) / duration;
                    if (p > 1) {
                        p = 1;
                    }
                    //计算当前的加载进度，并通知外部进行进度条百分比的更新
                    progress(interval[0] + (interval[1] - interval[0]) * p);

                    p < 1 ? requestAnimationFrame(step) : finished();
                }

                requestAnimationFrame(step);
            }
        }
    };

    return function (element, options) {
        var opts = $.extend({}, options),
            $element = $(element),
            $progress_bar = $element.find('.progress-bar')[0] ? $element.find('.progress-bar') : ($progress = $('<div class="progress">').appendTo($element),
            $('<div class="progress-bar progress-bar-striped">').appendTo($progress)),
            $progress_value = $element.find('.progress-value')[0] ? $element.find('.progress-value') :$('<div class="progress-value">').appendTo($progress_bar),
            decimal = opts.decimal || 0,//进度值需保留的小数位数
            active = opts.active || true,//是否加进度条的条纹效果
            duration = opts.duration || 1500,//定义进度条加载效果从0%加载到100%需要的时间
            lastValue = 0;//上一次的进度值

        //定义一个加载进度动画的队列
        var queue = new Queue();


        //设置颜色
        function _setColor(color) {
            $progress_bar.css('backgroundColor', color);
        }

        //设置进度条的状态
        function _setState(val) {
            var percent1 = val * 4;

            var percent = Math.min(100, val).toFixed(decimal) + '%';
            $progress_bar.css('width', percent);
            $progress_value.text(percent);

        }

        //设置进度值
        function _setValue(val, n) {
            val = parseFloat(val) / n;
            if (isNaN(val)) return;
            /**
             * duration / 100 用于计算进度条显示完加载1%的效果需要的时间
             * (val - lastValue) * duration / 100 得出当前进度范围内整个加载效果显示完需要的时间
             */

            queue.push(
                new Loading((val - lastValue) * duration / 100, _setState, [lastValue, val])
            );
            lastValue = val;

            //如果队列没有在执行，那么需要再次手动执行下队列
            if (!queue.isPlaying()) {
                queue.flush();
            }
        }


        //切换进度条的条纹动画
        function _toggle() {
            $progress_bar.toggleClass('active');
        }

        //销毁
        function _destroy() {
            $progress_bar.removeClass('active');
            $element.remove();
            $element = null;
            $progress_bar = null;
            $progress_value = null;
            opts = null;
        }

        //初始化
        _setState(0);
        active && _toggle();

        return {
            toggle: _toggle,
            setValue: _setValue,
            setState: _setState,
            setColor: _setColor,
            destroy: _destroy
        };
    }
})($)


$.fn.progress = function (op) {

    this.each(function (i, dom) {
        new $.progress(dom, op)
    })

}

$.progress = function (dom, op) {
    op = $.extend({}, $.progress.defaults, op)
    var loader = new Loader(dom, {});
    loader.setState(op.value, (op.limit || 100) / 100);
    loader.setValue(op.value, (op.limit || 100) / 100);
    loader.setColor(op.color);
}

$.progress.defaults = {
    limit: 100,
    value: 50,
    color: "#337ab7"
}





