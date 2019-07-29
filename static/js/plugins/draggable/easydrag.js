var drag = {// 加载画布
    loadChart: function (option) {
        var option = $.extend({}, this.config, option)
        // console.log(option.url)
        $.ajax({
            url: option.url,
            data: option.data || {},
            type: option.type || 'get',
            dataType: option.dataType || 'json',
            success: function (data) {
                $.each(data, function (i, chart) {
                    $('<div class="drag-box">').append(
                        $('<div class="box_backgruond">').append(
                            $('<img />').attr('src', (chart['bg_img'] || '/static/images/img/beij.png')).attr('title', chart['name']).attr('onerror', 'this.src="/static/images/img/beij.png"')
                        ).append(
                            $('<div class="name_add">').append(
                                $('<span>').html(chart['name'])
                            ))
                    ).data('chart', chart).appendTo(option.loader)
                })
            },
            error: function (error) {

            }
        });
    }
}