var show_layers = {
    config: {
        url: ''
    },
    buildLayers: function (option) {
        var option = $.extend({}, this.config, option)
        // console.log(option.url)
        $.ajax({
            url: option.url,
            data: option.data || {},
            type: option.type || 'get',
            dataType: option.dataType || 'json',
            success: function (data) {
                $.each(data, function (i, chart) {
                    $('<div class="col-md-4" id="addchatrt">')
                        .append($('<div class="box_list">')
                            .append($('<div class="box_backgruond">')
                                .append($('<img />').attr('src', (chart['bg_img'] || '/static/images/img/beij.png')).attr('title', chart['name'])))
                            .append($('<p class="button_bottom">')
                                .append($('<span class="modify_name"  style=" color: #fff; margin-bottom: 8px;font-size:17px;display: block;"">')
                                    .append($('<span>').html(chart['name'])))

                                .append($('<span style=" cursor: pointer;" class="has_release"  onclick="copy_name(this)" dataid="' + chart['name'] + '">').html("创建")))
                        )
                        .appendTo($('#chartLoader'))
                })
                $('#chartCount').text(data.length)
            },
            error: function (error) {

            }
        })
    }


}