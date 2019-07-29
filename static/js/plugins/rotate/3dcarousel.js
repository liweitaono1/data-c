var count = 0;
var baseSpeed = 0.05;
var imageDivs = '';
var numberOfElements = 0;
var carousel1 = '';

$.fn.rotate3d = function (chat, chart) {
    // console.log(chart.config.scale)
    //暴力清除定时器
    window.clearInterval(time)
    carousel1 = $('#carousel');
    imageDivs = carousel1.children();
    numberOfElements = imageDivs.length;
    var radiusX = chat.h/1.3
    var radiusY = chat.h /7.5
    var centerX = chat.w /2.7
    var centerY = chat.h /3
    //拖拽的时候无法传speed，写死speed为0。3
    if (!chat.data) {
        var speed = 0.3

    } else {
        var speed = parseFloat(chat.data.speedSetting.speed)
        //hover时候的speed
        // carousel1.children('div').hover(function () {
        //     speed = parseFloat(chat.data.speedSetting.speed) / 2
        // }, function () {
        //     speed = parseFloat(chat.data.speedSetting.speed)
        // })
    }
    //click时候的点击事件。与轮播联动
    carousel1.children('div').click(function () {
        var id = event.target.id
        $('.carouse-navs').children().children().eq(id).trigger('click');
    })
    //创建定时器
    var time = setInterval(function startCarousel() {
        for (i = 0; i < numberOfElements; i++) {
            angle = i * (Math.PI * 2) / numberOfElements;
            imageDivsStyle = imageDivs[i].style;
            imageDivsStyle.position = 'absolute';
            posX = (Math.sin(count * (baseSpeed * speed) + angle) * radiusX + centerX);
            posY = (Math.cos(count * (baseSpeed * speed) + angle) * radiusY + centerY);
            imageDivsStyle.left = posX + "px";
            imageDivsStyle.top = posY + "px"
            // console.log(posX)
            imageDivWidth = posY;
            // console.log(imageDivWidth)
            imageDivZIndex = Math.round(imageDivWidth) + 100;
            imageDivsStyle.width = imageDivWidth + 'px';
            imageDivsStyle.zIndex = imageDivZIndex;
            angle += speed;
        }
        count++
        //判断是否走到最底部
        var data = []
        for (i = 0; i < numberOfElements; i++) {
            var dom = document.getElementById('a' + i)
            // console.log(dom)
            data.push(parseFloat(dom.style.top))
            // console.log(dom.style.width)
        }
        //取数值的最大值
        Array.prototype.max = function () {
            var max = this[0];
            this.forEach(function (ele, index, arr) {
                if (ele > max) {
                    max = ele;
                }
            })
            return max;
        }
        var ex;
        $.each(data, function (i, val) {
            if (val == data.max()) {
                ex =  i
            }
        })
        //最大的时候与下面轮播联动并改变
        if (data.max() > parseFloat(chat.h) / 3 + radiusY-10 && data.max() < parseFloat(chat.h) / 3 + radiusY+15) {
            if ($('.carouse-navs').hasClass('carouse-view-nav')) {
                $('.carouse-navs').children().children().eq(ex).trigger('click');
                // speed=0.05
            }
        } else {
            // speed =0.2
        }
    }, 40);
}



