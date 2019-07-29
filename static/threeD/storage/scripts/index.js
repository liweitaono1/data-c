/**
 * 3D渲染
 * @param chat
 */
$.fn.event3D = function (event, chat) {
    dataModel = new ht.DataModel();
    g3d = new ht.graph3d.Graph3dView(dataModel);
    g3d.addToDOM(event[0]);
    //交互事件
    g3d.addInteractorListener(function (e) {
        // console.log(e.kind)
    });
    var dm = g3d.dm();
    ht.Default.xhrLoad('main/' + chat.data.DOpion.name + '.json', function (json) {
        json = ht.Default.parse(json);
        var scene = json.scene;
        g3d.setEye(scene.eye);
        g3d.setCenter(scene.center);
        g3d.setFar(scene.far);
        g3d.setNear(scene.near);
        // 反序列化
        dm.deserialize(json);
        //渲染shape3D颜色和添加node
        dataModel.each(function (data) {
            //取实时数据
            var nodedata
            if (!chat.apidatavalue){
                nodedata=chat.datavalue
            } else
                nodedata=chat.apidatavalue
            //数据与node数据匹配
            $.each(nodedata, function (i, val) {
                if (data._displayName == val.name) {
                    // console.log(val.name,val.message)
                    if (val.status == "alarm") {
                        data.s({
                            'shape3d.blend': "red",
                            'shape3d.color': "red",
                            'note': val.message,
                            'note.background': 'red',
                            'note.toggleable': true,
                            'note.expanded': true,
                            'note.autorotate':true,
                            'note.reverse.flip':true,
                        })
                    }
                }

            })
        })

    });
}