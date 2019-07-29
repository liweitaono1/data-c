var DetailViewer = window.DetailViewer = function (manager, options) {
    var g3d = manager.g3d;
    var dm = manager.dm;
    var gl = g3d.getGL();
    var maxSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    var canvas = ht.Default.createElement('canvas');

    canvas.dynamic = true;

    ht.Default.setImage('controlPanel', canvas);
    // console.log(ht)
    var info = window.info = {image: 'controlPanel'};

    function refrishControlPanel() {
        console.log(info)
        if (!info.json) return;

        var g = ht.Default.initContext(canvas);

        g.clearRect(0, 0, info.width, info.height);
        ht.Default.drawImage(g, info.json, 0, 0, info.width, info.height, controlPanel, g3d);
    }

    ht.Default.handleImageLoaded = function (name, image) {
        if (name.indexOf('symbols') >= 0) refrishControlPanel();

        if (name.indexOf('机柜弹窗.json') < 0) return;

        var w = image.width, h = image.height;
        var max = Math.max(w, h);
        var size = Math.min(max, maxSize);
        var k = size / max;
        w *= k;
        h *= k;

        info.width = w;
        info.height = h;
        info.json = image;
        info.k = k;

        ht.Default.setCanvas(canvas, w, h, 1);
        refrishControlPanel();
    };

    var sky = new ht.Node();
    sky.s3([100, 100, 100]);
    var baseUrl = 'assets/天空盒/';
    var imageType = '.png';
    sky.s({
        'top.image': baseUrl + '1' + imageType,
        'left.image': baseUrl + '2' + imageType,
        'front.image': baseUrl + '3' + imageType,
        'right.image': baseUrl + '4' + imageType,
        'back.image': baseUrl + '5' + imageType,
        'bottom.image': baseUrl + '6' + imageType,
        'all.reverse.flip': true
    });

    var controlPanel;
    this.getControlPanel = function () {
        return controlPanel;
    };

    var rotationInterval;
    var dr = Math.PI / 180 * 2, PI2 = Math.PI * 2;

    function startRotatePanel() {
        if (rotationInterval) return;

        refrishControlPanel();
        controlPanel.s('shape3d.image', info.image);

        rotationInterval = setInterval(function () {
            controlPanel.setRotation((controlPanel.getRotation() - dr) % PI2);
        }, 120);
    }

    function stopRotatePanel() {
        if (!rotationInterval) return;

        clearInterval(rotationInterval);

        rotationInterval = null;

        controlPanel.s('shape3d.image', info.oldImage);
        controlPanel.s('shape3d.texture.scale', info.k);
    }

    this.initScene = function initScene() {
        g3d.setSkyBox(sky);

        // 强制绘制，后在设置面板不可见，让浏览器在后台加载面板资源
        g3d.validateImpl();

        controlPanel = dm.getDataByTag('controlPanel');
        controlPanel.s({
            'select.brightness': 1,
            '3d.visible': false
        });
        info.oldImage = controlPanel.s('shape3d.image');
        controlPanel.s('shape3d.image', info.image);
        controlPanel.a('value', 0.5);

        dm.remove(controlPanel);
    }

    var eyeBack, centerBack;
    var focusData;
    var opacityMap = {};
    var opacity = 0.1;
    var lastRayMode;

    this.getFocusData = function () {
        return focusData;
    };

    g3d.mi(function (e) {
        if (e.kind === 'doubleClickData') {
            showDataDetail(e.data);
        }
    });

    showDataDetail = this.showDataDetail = function (data) {
        if (data.getDisplayName() !== 'Cabinet') return;

        eyeBack = ht.Default.clone(g3d.getEye());
        centerBack = ht.Default.clone(g3d.getCenter());

        g3d.flyTo(data, {animation: true, direction: [0, 0.9, 2]});

        focusData = data;

        if (!controlPanel.dm()) dm.add(controlPanel);
        controlPanel.setParent(data);
        controlPanel.setX(data.getX());
        controlPanel.setY(data.getY());
        controlPanel.s('3d.visible', true);

        startRotatePanel();

        dm.each(function (d) {
            if (d === focusData || !d.s('3d.selectable') || d === controlPanel) return;

            if (!opacityMap[d.getId()]) {
                opacityMap[d.getId()] = {
                    'shape3d.opacity': d.s('shape3d.opacity'),
                    'shape3d.transparent': d.s('shape3d.transparent'),
                    'all.opacity': d.s('all.opacity'),
                    'all.transparent': d.s('all.transparent'),
                    'left.opacity': d.s('left.opacity'),
                    'left.transparent': d.s('left.transparent'),
                    'right.opacity': d.s('right.opacity'),
                    'right.transparent': d.s('right.transparent'),
                    'front.opacity': d.s('front.opacity'),
                    'front.transparent': d.s('front.transparent'),
                    'back.opacity': d.s('back.opacity'),
                    'back.transparent': d.s('back.transparent'),
                    'top.opacity': d.s('top.opacity'),
                    'top.transparent': d.s('top.transparent'),
                    'bottom.opacity': d.s('bottom.opacity'),
                    'bottom.transparent': d.s('bottom.transparent'),
                    '3d.selectable': d.s('3d.selectable')
                };
            }

            d.s({
                'shape3d.opacity': opacity,
                'shape3d.transparent': true,
                'all.opacity': opacity,
                'all.transparent': true,
                'left.opacity': opacity,
                'left.transparent': true,
                'right.opacity': opacity,
                'right.transparent': true,
                'front.opacity': opacity,
                'front.transparent': true,
                'back.opacity': opacity,
                'back.transparent': true,
                'top.opacity': opacity,
                'top.transparent': true,
                'bottom.opacity': opacity,
                'bottom.transparent': true,
                '3d.selectable': false
            });
        });
    }

    function focusTo(g3d, eye, center, cb) {
        if (g3d.vr.isPresenting()) {
            cb();
            return;
        }

        var e = ht.Default.clone(g3d.getEye()),
            c = ht.Default.clone(g3d.getCenter());

        if (!eye) eye = e;
        if (!center) center = c;

        var edx = eye[0] - e[0],
            edz = eye[1] - e[1],
            edy = eye[2] - e[2],
            cdx = center[0] - c[0],
            cdz = center[1] - c[1],
            cdy = center[2] - c[2];
        ht.Default.startAnim({
            duration: 500,
            finishFunc: cb,
            action: function (v) {
                g3d.setEye([
                    e[0] + edx * v,
                    e[1] + edz * v,
                    e[2] + edy * v
                ]);
                g3d.setCenter([
                    c[0] + cdx * v,
                    c[1] + cdz * v,
                    c[2] + cdy * v
                ]);
            }
        });
    };

    var sm = g3d.sm();
    sm.ms(function (e) {
        handleSelectionChange(sm.ld());
    });

    window.addEventListener('mousemove', function (e) {
        if (controlPanel) handleMove(g3d.getDataAt(e));
    });

    var handleMove = this.handleMove = function (data) {
        if (!controlPanel) return;
        if (data === controlPanel) stopRotatePanel();
        else if (controlPanel.s('3d.visible')) startRotatePanel();
    };
    var handleSelectionChange = this.handleSelectionChange = function (data) {
        if (data === focusData || data === controlPanel) return;

        if (eyeBack && centerBack) {
            stopRotatePanel();

            if (controlPanel.dm()) dm.remove(controlPanel);
            controlPanel.s('3d.visible', false);
            controlPanel.setParent(null);

            focusTo(g3d, eyeBack, centerBack, function () {
                dm.each(function (d) {
                    if (d === focusData) return;

                    d.s(opacityMap[d.getId()]);
                });

                focusData = null;

                eyeBack = null;
                centerBack = null;
            });
            return true;
        }
    };


    var startRotationTimer;
    window.addEventListener('touchstart', function (e) {
        if (!controlPanel) return;

        if (g3d.getDataAt(e) === controlPanel) {
            stopRotatePanel();

            if (startRotationTimer) {
                clearTimeout(startRotationTimer);
                startRotationTimer = null;
            }
        }
    });
    window.addEventListener('touchend', function (e) {
        if (!controlPanel) return;

        if (!startRotationTimer && !rotationInterval && controlPanel.s('3d.visible')) {
            startRotationTimer = setTimeout(function () {
                startRotationTimer = null;
                if (!controlPanel.s('3d.visible')) return;
                startRotatePanel();
            }, 5000);
        }
    });
};