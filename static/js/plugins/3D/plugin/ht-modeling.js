!function (V, l, j) {
    "use strict";
    var x = "ht", v = V[x], d = null, D = Math, u = D.PI, c = D.cos, h = D.sin, Q = D.abs, M = D.max, L = D.sqrt,
        o = 1e-5, t = v.Default, Z = t.def, O = t.startAnim, I = t.createMatrix, N = t.transformVec,
        F = t.getInternal(), i = F.addMethod, S = F.superCall, A = F.toPointsArray, C = F.createNormals,
        E = F.toFloatArray, f = F.glMV, B = F.batchShape, e = F.createNodeMatrix, z = F.getFaceInfo,
        m = F.transformAppend, p = F.drawFaceInfo, G = F.createAnim, w = F.cube(), a = w.is, y = w.vs, J = w.uv,
        q = F.ui(), T = v.Node, g = v.Shape, U = "h", W = "v", X = "front", H = "back", Y = "left", r = "right",
        n = "top", s = "bottom", k = "dw.expanded", $ = ".expanded", R = "dw.angle", K = ".angle",
        P = function (G, D, Q) {
            Z(x + "." + G, D, Q)
        }, b = function (N, v, W) {
            W ? N.push(v.x, v.y) : N.push(v.x, v.y, v.z)
        }, _ = [1, 0, 0], Gi = function (l, f, H, $) {
            var e, g, K, B, J = 0, D = [];
            if ($) for (e = $.length; e > J; J += 3) g = $[J], K = $[J + 1], B = $[J + 2], D.push(new Tl([new xk([f[3 * g], f[3 * g + 1], f[3 * g + 2]], _, H ? [H[2 * g], H[2 * g + 1], 0] : d), new xk([f[3 * K], f[3 * K + 1], f[3 * K + 2]], _, H ? [H[2 * K], H[2 * K + 1], 0] : d), new xk([f[3 * B], f[3 * B + 1], f[3 * B + 2]], _, H ? [H[2 * B], H[2 * B + 1], 0] : d)], l)); else for (e = f.length; e > J; J += 3) g = J, K = J + 1, B = J + 2, D.push(new Tl([new xk([f[3 * g], f[3 * g + 1], f[3 * g + 2]], _, H ? [H[2 * g], H[2 * g + 1], 0] : d), new xk([f[3 * K], f[3 * K + 1], f[3 * K + 2]], _, H ? [H[2 * K], H[2 * K + 1], 0] : d), new xk([f[3 * B], f[3 * B + 1], f[3 * B + 2]], _, H ? [H[2 * B], H[2 * B + 1], 0] : d)], l));
            return D
        }, ej = [Y, X, r, H, n, s], Sf = ej.concat("csg"), es = [0, 6, 12, 18, 24, 30], ih = function (X, l, k) {
            for (var B = e(X), $ = [], I = 0; 6 > I; I++) for (var g = ej[I], S = es[I], s = k ? l.getFaceUv(X, g) : d, Q = k ? l.getFaceUvScale(X, g) : d, j = k ? l.getFaceUvOffset(X, g) : d, H = 0; 2 > H; H++) {
                var x, T, b, R = a[S + 3 * H], r = a[S + 3 * H + 1], z = a[S + 3 * H + 2];
                if (k) {
                    if (s) {
                        var i = 8 * I;
                        x = [s[2 * R - i], s[2 * R + 1 - i], 0], T = [s[2 * r - i], s[2 * r + 1 - i], 0], b = [s[2 * z - i], s[2 * z + 1 - i], 0]
                    } else x = [J[2 * R], J[2 * R + 1], 0], T = [J[2 * r], J[2 * r + 1], 0], b = [J[2 * z], J[2 * z + 1], 0];
                    Q && (x[0] *= Q[0], x[1] *= Q[1], T[0] *= Q[0], T[1] *= Q[1], b[0] *= Q[0], b[1] *= Q[1]), j && (x[0] += j[0], x[1] += j[1], T[0] += j[0], T[1] += j[1], b[0] += j[0], b[1] += j[1])
                }
                $.push(new Tl([new xk(N([y[3 * R], y[3 * R + 1], y[3 * R + 2]], B), _, x), new xk(N([y[3 * r], y[3 * r + 1], y[3 * r + 2]], B), _, T), new xk(N([y[3 * z], y[3 * z + 1], y[3 * z + 2]], B), _, b)], X))
            }
            return Qq.$15n($)
        }, an = function (m, Y) {
            var M, t = m.data.getAttaches();
            if (t && t.each(function (i) {
                i instanceof co && i.s("attach.operation") && (M || (M = []), M.push(i))
            }), M) {
                var R;
                ej.forEach(function (d) {
                    var F = Gi(d, m[d].vs, m[d].tuv);
                    R = R ? R.concat(F) : F
                }), R = Qq.$15n(R), M.forEach(function (q) {
                    var i = q.s("attach.operation");
                    R[i] && (R = R[i](ih(q, m.gv, m.csg.tuv)))
                }), ej.forEach(function (f) {
                    f = m[f], f.vs = [], f.tuv && (f.tuv = [])
                }), R.$19n().forEach(function (P) {
                    var a = P.$10n;
                    if (a instanceof co) {
                        if (a.s("attach.cull")) return;
                        a = "csg"
                    }
                    for (var w = m[a], n = w.vs, J = w.tuv, Q = P.$9n, k = 2; k < Q.length; k++) b(n, Q[0].$24n), b(n, Q[k - 1].$24n), b(n, Q[k].$24n), J && (b(J, Q[0].uv, !0), b(J, Q[k - 1].uv, !0), b(J, Q[k].uv, !0))
                })
            }
            Sf.forEach(function (x) {
                var t = m[x];
                t.visible && t.vs.length ? (t.ns = C(t.vs), E(t, "vs"), E(t, "tuv")) : delete m[x]
            }), Y && (B(m, d, Y), m.clear())
        };
    i(t, {
        createFrameModel: function (I, f, j, c) {
            I = I == d ? .07 : I, f = f == d ? I : f, j = j == d ? I : j, c = c ? c : {};
            var _ = c.top, N = c.bottom, t = c.left, C = c.right, q = c.front, K = c.back, u = [], b = [];
            return q === !0 ? (u.push(-.5, .5, .5, -.5, -.5, .5, .5, -.5, .5, .5, -.5, .5, .5, .5, .5, -.5, .5, .5), b.push(0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0)) : q === !1 || (u.push(-.5, .5, .5, -.5, -.5, .5, -.5 + I, -.5, .5, -.5 + I, -.5, .5, -.5 + I, .5, .5, -.5, .5, .5, .5 - I, .5, .5, .5 - I, -.5, .5, .5, -.5, .5, .5, -.5, .5, .5, .5, .5, .5 - I, .5, .5, -.5 + I, .5, .5, -.5 + I, .5 - f, .5, .5 - I, .5 - f, .5, .5 - I, .5 - f, .5, .5 - I, .5, .5, -.5 + I, .5, .5, -.5 + I, -.5 + f, .5, -.5 + I, -.5, .5, .5 - I, -.5, .5, .5 - I, -.5, .5, .5 - I, -.5 + f, .5, -.5 + I, -.5 + f, .5), b.push(0, 0, 0, 1, I, 1, I, 1, I, 0, 0, 0, 1 - I, 0, 1 - I, 1, 1, 1, 1, 1, 1, 0, 1 - I, 0, I, 0, I, f, 1 - I, f, 1 - I, f, 1 - I, 0, I, 0, I, 1 - f, I, 1, 1 - I, 1, 1 - I, 1, 1 - I, 1 - f, I, 1 - f)), K === !0 ? (u.push(-.5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5), b.push(1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0)) : K === !1 || (u.push(-.5, .5, -.5, -.5 + I, -.5, -.5, -.5, -.5, -.5, -.5 + I, -.5, -.5, -.5, .5, -.5, -.5 + I, .5, -.5, .5 - I, .5, -.5, .5, -.5, -.5, .5 - I, -.5, -.5, .5, -.5, -.5, .5 - I, .5, -.5, .5, .5, -.5, -.5 + I, .5, -.5, .5 - I, .5 - f, -.5, -.5 + I, .5 - f, -.5, .5 - I, .5 - f, -.5, -.5 + I, .5, -.5, .5 - I, .5, -.5, -.5 + I, -.5 + f, -.5, .5 - I, -.5, -.5, -.5 + I, -.5, -.5, .5 - I, -.5, -.5, -.5 + I, -.5 + f, -.5, .5 - I, -.5 + f, -.5), b.push(1, 0, 1 - I, 1, 1, 1, 1 - I, 1, 1, 0, 1 - I, 0, I, 0, 0, 1, I, 1, 0, 1, I, 0, 0, 0, 1 - I, 0, I, f, 1 - I, f, I, f, 1 - I, 0, I, 0, 1 - I, 1 - f, I, 1, 1 - I, 1, I, 1, 1 - I, 1 - f, I, 1 - f)), t === !0 ? (u.push(-.5, .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, .5, -.5, .5, -.5), b.push(0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0)) : t === !1 || (u.push(-.5, .5, -.5, -.5, -.5, -.5, -.5, -.5, -.5 + j, -.5, -.5, -.5 + j, -.5, .5, -.5 + j, -.5, .5, -.5, -.5, .5, .5 - j, -.5, -.5, .5 - j, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, .5, -.5, .5, .5 - j, -.5, .5, -.5 + j, -.5, .5 - f, -.5 + j, -.5, .5 - f, .5 - j, -.5, .5 - f, .5 - j, -.5, .5, .5 - j, -.5, .5, -.5 + j, -.5, -.5 + f, -.5 + j, -.5, -.5, -.5 + j, -.5, -.5, .5 - j, -.5, -.5, .5 - j, -.5, -.5 + f, .5 - j, -.5, -.5 + f, -.5 + j), b.push(0, 0, 0, 1, j, 1, j, 1, j, 0, 0, 0, 1 - j, 0, 1 - j, 1, 1, 1, 1, 1, 1, 0, 1 - j, 0, j, 0, j, f, 1 - j, f, 1 - j, f, 1 - j, 0, j, 0, j, 1 - f, j, 1, 1 - j, 1, 1 - j, 1, 1 - j, 1 - f, j, 1 - f)), C === !0 ? (u.push(.5, .5, -.5, .5, -.5, .5, .5, -.5, -.5, .5, -.5, .5, .5, .5, -.5, .5, .5, .5), b.push(1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0)) : C === !1 || (u.push(.5, .5, -.5, .5, -.5, -.5 + j, .5, -.5, -.5, .5, -.5, -.5 + j, .5, .5, -.5, .5, .5, -.5 + j, .5, .5, .5 - j, .5, -.5, .5, .5, -.5, .5 - j, .5, -.5, .5, .5, .5, .5 - j, .5, .5, .5, .5, .5, -.5 + j, .5, .5 - f, .5 - j, .5, .5 - f, -.5 + j, .5, .5 - f, .5 - j, .5, .5, -.5 + j, .5, .5, .5 - j, .5, -.5 + f, -.5 + j, .5, -.5, .5 - j, .5, -.5, -.5 + j, .5, -.5, .5 - j, .5, -.5 + f, -.5 + j, .5, -.5 + f, .5 - j), b.push(1, 0, 1 - j, 1, 1, 1, 1 - j, 1, 1, 0, 1 - j, 0, j, 0, 0, 1, j, 1, 0, 1, j, 0, 0, 0, 1 - j, 0, j, f, 1 - j, f, j, f, 1 - j, 0, j, 0, 1 - j, 1 - f, j, 1, 1 - j, 1, j, 1, 1 - j, 1 - f, j, 1 - f)), _ === !0 ? (u.push(.5, .5, .5, .5, .5, -.5, -.5, .5, -.5, -.5, .5, -.5, -.5, .5, .5, .5, .5, .5), b.push(1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1)) : _ === !1 || (u.push(.5, .5, .5, .5, .5, -.5, .5 - I, .5, -.5, .5 - I, .5, -.5, .5 - I, .5, .5, .5, .5, .5, -.5 + I, .5, .5, -.5 + I, .5, -.5, -.5, .5, -.5, -.5, .5, -.5, -.5, .5, .5, -.5 + I, .5, .5, .5 - I, .5, .5, .5 - I, .5, .5 - j, -.5 + I, .5, .5 - j, -.5 + I, .5, .5 - j, -.5 + I, .5, .5, .5 - I, .5, .5, .5 - I, .5, -.5 + j, .5 - I, .5, -.5, -.5 + I, .5, -.5, -.5 + I, .5, -.5, -.5 + I, .5, -.5 + j, .5 - I, .5, -.5 + j), b.push(1, 1, 1, 0, 1 - I, 0, 1 - I, 0, 1 - I, 1, 1, 1, I, 1, I, 0, 0, 0, 0, 0, 0, 1, I, 1, 1 - I, 1, 1 - I, 1 - j, I, 1 - j, I, 1 - j, I, 1, 1 - I, 1, 1 - I, j, 1 - I, 0, I, 0, I, 0, I, j, 1 - I, j)), N === !0 ? (u.push(.5, -.5, .5, -.5, -.5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5), b.push(1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0)) : N === !1 || (u.push(.5, -.5, .5, .5 - I, -.5, -.5, .5, -.5, -.5, .5 - I, -.5, -.5, .5, -.5, .5, .5 - I, -.5, .5, -.5 + I, -.5, .5, -.5, -.5, -.5, -.5 + I, -.5, -.5, -.5, -.5, -.5, -.5 + I, -.5, .5, -.5, -.5, .5, .5 - I, -.5, .5, -.5 + I, -.5, .5 - j, .5 - I, -.5, .5 - j, -.5 + I, -.5, .5 - j, .5 - I, -.5, .5, -.5 + I, -.5, .5, .5 - I, -.5, -.5 + j, -.5 + I, -.5, -.5, .5 - I, -.5, -.5, -.5 + I, -.5, -.5, .5 - I, -.5, -.5 + j, -.5 + I, -.5, -.5 + j), b.push(1, 0, 1 - I, 1, 1, 1, 1 - I, 1, 1, 0, 1 - I, 0, I, 0, 0, 1, I, 1, 0, 1, I, 0, 0, 0, 1 - I, 0, I, j, 1 - I, j, I, j, 1 - I, 0, I, 0, 1 - I, 1 - j, I, 1, 1 - I, 1, I, 1, 1 - I, 1 - j, I, 1 - j)), {
                vs: u,
                uv: b
            }
        }
    }), i(v.Style, {
        "dw.flip": !1,
        "dw.s3": [.999, .999, .5],
        "dw.t3": j,
        "dw.expanded": !1,
        "dw.toggleable": !0,
        "dw.axis": "left",
        "dw.start": 0,
        "dw.end": u / 2,
        "dw.angle": 0,
        "attach.cull": !1,
        "attach.operation": "subtract"
    }, !0), ej.forEach(function (O) {
        var s = {};
        s[O + $] = !1, s[O + ".toggleable"] = !1, s[O + ".axis"] = Y, s[O + ".start"] = 0, s[O + ".end"] = u / 2, s[O + K] = 0, i(v.Style, s, !0)
    });
    var Qq = function () {
        this.$4n = []
    };
    Qq.$15n = function (A) {
        var a = new Qq;
        return a.$4n = A, a
    }, Qq.prototype = {
        clone: function () {
            var u = new Qq;
            return u.$4n = this.$4n.map(function (s) {
                return s.clone()
            }), u
        }, $19n: function () {
            return this.$4n
        }, union: function (m) {
            var n = new xd(this.clone().$4n), G = new xd(m.clone().$4n);
            return n.$3n(G), G.$3n(n), G.$6n(), G.$3n(n), G.$6n(), n.$7n(G.$2n()), Qq.$15n(n.$2n())
        }, subtract: function (n) {
            var N = new xd(this.clone().$4n), f = new xd(n.clone().$4n);
            return N.$6n(), N.$3n(f), f.$3n(N), f.$6n(), f.$3n(N), f.$6n(), N.$7n(f.$2n()), N.$6n(), Qq.$15n(N.$2n())
        }, intersect: function (E) {
            var V = new xd(this.clone().$4n), n = new xd(E.clone().$4n);
            return V.$6n(), n.$3n(V), n.$6n(), V.$3n(n), n.$3n(V), V.$7n(n.$2n()), V.$6n(), Qq.$15n(V.$2n())
        }, inverse: function () {
            var f = this.clone();
            return f.$4n.map(function (D) {
                D.flip()
            }), f
        }
    }, Qq.cube = function (r) {
        r = r || {};
        var w = new mb(r.center || [0, 0, 0]),
            c = r.radius ? r.radius.length ? r.radius : [r.radius, r.radius, r.radius] : [1, 1, 1];
        return Qq.$15n([[[0, 4, 6, 2], [-1, 0, 0]], [[1, 3, 7, 5], [1, 0, 0]], [[0, 1, 5, 4], [0, -1, 0]], [[2, 6, 7, 3], [0, 1, 0]], [[0, 2, 3, 1], [0, 0, -1]], [[4, 5, 7, 6], [0, 0, 1]]].map(function (e) {
            return new Tl(e[0].map(function (y) {
                var d = new mb(w.x + c[0] * (2 * !!(1 & y) - 1), w.y + c[1] * (2 * !!(2 & y) - 1), w.z + c[2] * (2 * !!(4 & y) - 1));
                return new xk(d, new mb(e[1]))
            }))
        }))
    }, Qq.sphere = function (V) {
        function Y(g, B) {
            g *= 2 * u, B *= u;
            var J = new mb(c(g) * h(B), c(B), h(g) * h(B));
            N.push(new xk(W.$20n(J.$21n(k)), J))
        }

        V = V || {};
        for (var N, W = new mb(V.center || [0, 0, 0]), k = V.radius || 1, M = V.slices || 16, f = V.stacks || 8, D = [], U = 0; M > U; U++) for (var z = 0; f > z; z++) N = [], Y(U / M, z / f), z > 0 && Y((U + 1) / M, z / f), f - 1 > z && Y((U + 1) / M, (z + 1) / f), Y(U / M, (z + 1) / f), D.push(new Tl(N));
        return Qq.$15n(D)
    }, Qq.cylinder = function (_) {
        function I(b, x, f) {
            var E = 2 * x * u, y = a.$21n(c(E)).$20n(s.$21n(h(E))), q = m.$20n(v.$21n(b)).$20n(y.$21n(j)),
                k = y.$21n(1 - Q(f)).$20n(Y.$21n(f));
            return new xk(q, k)
        }

        _ = _ || {};
        for (var m = new mb(_.start || [0, -1, 0]), w = new mb(_.end || [0, 1, 0]), v = w.$13n(m), j = _.radius || 1, r = _.slices || 16, Y = v.$14n(), f = Q(Y.y) > .5, a = new mb(f, !f, 0).$12n(Y).$14n(), s = a.$12n(Y).$14n(), q = new xk(m, Y.$11n()), H = new xk(w, Y.$14n()), p = [], F = 0; r > F; F++) {
            var O = F / r, A = (F + 1) / r;
            p.push(new Tl([q, I(0, O, -1), I(0, A, -1)])), p.push(new Tl([I(0, A, 0), I(0, O, 0), I(1, O, 0), I(1, A, 0)])), p.push(new Tl([H, I(1, A, 1), I(1, O, 1)]))
        }
        return Qq.$15n(p)
    };
    var mb = function (O, L, J) {
        var G = this;
        3 == arguments.length ? (G.x = O, G.y = L, G.z = J) : "x" in O ? (G.x = O.x, G.y = O.y, G.z = O.z) : (G.x = O[0], G.y = O[1], G.z = O[2])
    };
    mb.prototype = {
        clone: function () {
            return new mb(this.x, this.y, this.z)
        }, $11n: function () {
            return new mb(-this.x, -this.y, -this.z)
        }, $20n: function (v) {
            return new mb(this.x + v.x, this.y + v.y, this.z + v.z)
        }, $13n: function (S) {
            return new mb(this.x - S.x, this.y - S.y, this.z - S.z)
        }, $21n: function (B) {
            return new mb(this.x * B, this.y * B, this.z * B)
        }, $16n: function (k) {
            return new mb(this.x / k, this.y / k, this.z / k)
        }, $23n: function (c) {
            return this.x * c.x + this.y * c.y + this.z * c.z
        }, lerp: function (n, b) {
            return this.$20n(n.$13n(this).$21n(b))
        }, length: function () {
            return L(this.$23n(this))
        }, $14n: function () {
            return this.$16n(this.length())
        }, $12n: function (M) {
            var C = this;
            return new mb(C.y * M.z - C.z * M.y, C.z * M.x - C.x * M.z, C.x * M.y - C.y * M.x)
        }
    };
    var xk = function (J, T, a) {
        var B = this;
        B.$24n = new mb(J), B.$22n = new mb(T), B.uv = a ? new mb(a) : null
    };
    xk.prototype = {
        clone: function () {
            var R = this;
            return new xk(R.$24n.clone(), R.$22n.clone(), R.uv ? R.uv.clone() : null)
        }, flip: function () {
            this.$22n = this.$22n.$11n()
        }, $18n: function (K, v) {
            var H = this;
            return new xk(H.$24n.lerp(K.$24n, v), H.$22n.lerp(K.$22n, v), H.uv ? H.uv.lerp(K.uv, v) : null)
        }
    };
    var Yh = function (v, l) {
        this.$22n = v, this.w = l
    };
    Yh.$17n = function (M, U, P) {
        var s = U.$13n(M).$12n(P.$13n(M)).$14n();
        return new Yh(s, s.$23n(M))
    }, Yh.prototype = {
        clone: function () {
            return new Yh(this.$22n.clone(), this.w)
        }, flip: function () {
            var Y = this;
            Y.$22n = Y.$22n.$11n(), Y.w = -Y.w
        }, $5n: function (O, Z, J, F, W) {
            for (var H = this, M = 0, E = 1, L = 2, Q = 3, b = 0, i = [], e = 0; e < O.$9n.length; e++) {
                var n = H.$22n.$23n(O.$9n[e].$24n) - H.w, P = -o > n ? L : n > o ? E : M;
                b |= P, i.push(P)
            }
            switch (b) {
                case M:
                    (H.$22n.$23n(O.$8n.$22n) > 0 ? Z : J).push(O);
                    break;
                case E:
                    F.push(O);
                    break;
                case L:
                    W.push(O);
                    break;
                case Q:
                    for (var V = [], y = [], e = 0; e < O.$9n.length; e++) {
                        var X = (e + 1) % O.$9n.length, p = i[e], d = i[X], g = O.$9n[e], $ = O.$9n[X];
                        if (p != L && V.push(g), p != E && y.push(p != L ? g.clone() : g), (p | d) == Q) {
                            var n = (H.w - this.$22n.$23n(g.$24n)) / H.$22n.$23n($.$24n.$13n(g.$24n)), K = g.$18n($, n);
                            V.push(K), y.push(K.clone())
                        }
                    }
                    V.length >= 3 && F.push(new Tl(V, O.$10n)), y.length >= 3 && W.push(new Tl(y, O.$10n))
            }
        }
    };
    var Tl = function (g, Z) {
        var Q = this;
        Q.$9n = g, Q.$10n = Z, Q.$8n = Yh.$17n(g[0].$24n, g[1].$24n, g[2].$24n)
    };
    Tl.prototype = {
        clone: function () {
            var C = this.$9n.map(function (O) {
                return O.clone()
            });
            return new Tl(C, this.$10n)
        }, flip: function () {
            this.$9n.reverse().map(function (h) {
                h.flip()
            }), this.$8n.flip()
        }
    };
    var xd = function (n) {
        var U = this;
        U.$8n = null, U.front = null, U.back = null, U.$4n = [], n && U.$7n(n)
    };
    xd.prototype = {
        clone: function () {
            var t = this, W = new xd;
            return W.$8n = t.$8n && t.$8n.clone(), W.front = t.front && t.front.clone(), W.back = t.back && t.back.clone(), W.$4n = t.$4n.map(function (W) {
                return W.clone()
            }), W
        }, $6n: function () {
            for (var Q = this, j = 0; j < Q.$4n.length; j++) Q.$4n[j].flip();
            Q.$8n.flip(), Q.front && Q.front.$6n(), Q.back && Q.back.$6n();
            var J = Q.front;
            Q.front = Q.back, Q.back = J
        }, $1n: function (p) {
            var P = this;
            if (!P.$8n) return p.slice();
            for (var t = [], a = [], W = 0; W < p.length; W++) P.$8n.$5n(p[W], t, a, t, a);
            return P.front && (t = P.front.$1n(t)), a = P.back ? P.back.$1n(a) : [], t.concat(a)
        }, $3n: function (x) {
            var v = this;
            v.$4n = x.$1n(v.$4n), v.front && v.front.$3n(x), v.back && v.back.$3n(x)
        }, $2n: function () {
            var C = this, Z = C.$4n.slice();
            return C.front && (Z = Z.concat(C.front.$2n())), C.back && (Z = Z.concat(C.back.$2n())), Z
        }, $7n: function (U) {
            var C = this;
            if (U.length) {
                C.$8n || (C.$8n = U[0].$8n.clone());
                for (var $ = [], u = [], A = 0; A < U.length; A++) this.$8n.$5n(U[A], C.$4n, C.$4n, $, u);
                $.length && (C.front || (C.front = new xd), this.front.$7n($)), u.length && (C.back || (C.back = new xd), C.back.$7n(u))
            }
        }
    };
    var oc = "symbol", rd = v.Symbol = function (R, c, p) {
        var L = this;
        S(rd, L), L.s3(20, 20, 20), L.s({"all.visible": !1, shape: "rect"}), L.setIcon(R, c, p)
    };
    P("Symbol", T, {
        setIcon: function (P, g, l) {
            var R, W = this;
            return rd.superClass.setIcon.call(W, P), P ? (R = {
                for3d: !0,
                face: "center",
                position: 44,
                names: [P]
            }, l && (R.transaprent = !0), g && (R.autorotate = g), W.addStyleIcon(oc, R)) : W.removeStyleIcon(oc), W.setWidth(F.getImageWidth(t.getImage(P), W) || 20), R
        }
    });
    var co = v.CSGNode = function () {
        S(co, this), this.s({shape: "rect", "attach.thickness": 1.001})
    }, Ej = {
        position: 1,
        width: 1,
        height: 1,
        rotation: 1,
        rotationX: 1,
        rotationZ: 1,
        rotationMode: 1,
        tall: 1,
        elevation: 1,
        "s:attach.cull": 1,
        "s:attach.operation": 1
    };
    P("CSGNode", T, {
        _22Q: function () {
            return ui
        }, onPropertyChanged: function (v) {
            var J = this, O = J.getHost();
            co.superClass.onPropertyChanged.call(J, v), Ej[v.property] && (O instanceof Ul || O instanceof co) && O.fp("csgNodeChange", !0, !1)
        }
    });
    var ui = function (K, k) {
        S(ui, this, [K, k])
    };
    Z(ui, q.Node3dUI, {
        _80o: function (T, o, h) {
            var Q = this;
            Q._shape3d ? ui.superClass._80o.call(Q, T, o, h) : (f(Q.gv), Sf.forEach(function ($) {
                p(Q, T, o, Q[$], h)
            }))
        }, validate: function ($, h) {
            var q = this, G = q.gv, c = q.data;
            if (c.s("shape3d")) return ui.superClass.validate.call(q, $, h), q._shape3d = !0, void 0;
            q._shape3d = !1;
            var D = e(c, G.getMat(c)), U = $ && $.uv;
            q.vf2("csg", U);
            for (var I = 0; 6 > I; I++) for (var P = ej[I], Q = es[I], N = q.vf2(P, U, h), L = N.mat || D, p = N.vs, R = N.uv, k = N.tuv, n = 0; 2 > n; n++) {
                var A = a[Q + 3 * n], u = a[Q + 3 * n + 1], W = a[Q + 3 * n + 2];
                if (m(p, L, [y[3 * A], y[3 * A + 1], y[3 * A + 2]]), m(p, L, [y[3 * u], y[3 * u + 1], y[3 * u + 2]]), m(p, L, [y[3 * W], y[3 * W + 1], y[3 * W + 2]]), k) if (R) {
                    var B = 8 * I;
                    k.push(R[2 * A - B], R[2 * A + 1 - B], R[2 * u - B], R[2 * u + 1 - B], R[2 * W - B], R[2 * W + 1 - B])
                } else k.push(J[2 * A], J[2 * A + 1], J[2 * u], J[2 * u + 1], J[2 * W], J[2 * W + 1])
            }
            an(q, $, h)
        }, vf2: function (f, H, g) {
            var s, u = this, x = u.gv.getFaceVisible(u.data, f);
            return s = z(u, f, g), s.vs = [], s.tuv = x && (s.texture || H) ? [] : d, s.visible = x, s
        }
    });
    var Ul = v.CSGShape = function () {
        var V = this;
        S(Ul, V), V.s({
            "shape.background": d,
            "shape.border.width": 8
        }), V.setTall(240), V.setElevation(120), V.setThickness(14)
    };
    P("CSGShape", g, {
        IRotatable: !1, _22Q: function () {
            return pq
        }, setRotationX: function () {
        }, setRotation: function () {
        }, setRotationZ: function () {
        }, setSegments: function () {
        }
    });
    var pq = function (u, D) {
        S(pq, this, [u, D])
    };
    Z(pq, q.Shape3dUI, {
        _80o: function (T, z, S) {
            var E = this;
            E.undrawable || (f(E.gv), Sf.forEach(function (U) {
                p(E, T, z, E[U], S)
            }))
        }, validate: function (q, p) {
            var X = this, O = X.data, W = O.getPoints();
            if (X.undrawable = W.size() < 2) return X.clear(), void 0;
            var t = O.isClosePath(), D = M(O._thickness / 2, o), f = A(W, d, d, t);
            Sf.forEach(function (o) {
                X.vf(o, q && q.uv, !0, p)
            }), t && (X.left.visible = !1, X.right.visible = !1), X._12O(f, D), X._20Q(f), an(X, q, p)
        }
    });
    var Td = v.DoorWindow = function () {
        var R = this;
        S(Td, R), R.setElevation(100), R.s3(100, 200, 14)
    };
    P("DoorWindow", co, {
        IDoorWindow: !0, toggle: function (r) {
            this.setExpanded(!this.s(k), r)
        }, isExpanded: function () {
            return this.s(k)
        }, setExpanded: function (_, I) {
            var W = this, Z = W.$25n, y = W.getDataModel(), J = W.s(k);
            if (Z && (Z.stop(!0), delete W.$25n), J !== _) {
                y && y.beginTransaction();
                var p = _ ? W.s("dw.end") : W.s("dw.start");
                W.s(k, _), I = G(I), I ? (J = W.s(R), I.action = function (e) {
                    W.s(R, J + (p - J) * e)
                }, I.finishFunc = function () {
                    y && y.endTransaction()
                }, W.$25n = O(I)) : (W.s(R, p), y && y.endTransaction())
            }
        }, getMat: function () {
            var y = this, q = y.s("dw.s3"), T = y.s("dw.t3"), a = y.s("dw.flip"), G = y.s(R);
            if (q || G || T || a) {
                var S = [];
                if (a && S.push({r3: [0, u, 0]}), q && S.push({s3: q}), G) {
                    q = y.s3();
                    var z = y.s("dw.axis"), h = q[0] / 2, J = q[1] / 2;
                    q[2] / 2, z === Y ? S.push({t3: [h, 0, 0]}, {r3: [0, -G, 0]}, {t3: [-h, 0, 0]}) : z === r ? S.push({t3: [-h, 0, 0]}, {r3: [0, G, 0]}, {t3: [h, 0, 0]}) : z === n ? S.push({t3: [0, -J, 0]}, {r3: [-G, 0, 0]}, {t3: [0, J, 0]}) : z === s ? S.push({t3: [0, J, 0]}, {r3: [G, 0, 0]}, {t3: [0, -J, 0]}) : z === W ? S.push({r3: [0, G, 0]}) : z === U && S.push({r3: [G, 0, 0]})
                }
                return T && S.push({t3: T}), I(S)
            }
            return d
        }
    });
    var lf = v.CSGBox = function () {
        var K = this;
        S(lf, K), K.setElevation(100), K.s3(100, 200, 100)
    };
    P("CSGBox", co, {
        ICSGBox: !0, toggleFace: function (z, b) {
            this.setFaceExpanded(z, !this.s(z + $), b)
        }, isFaceExpanded: function (b) {
            return this.s(b + $)
        }, setFaceExpanded: function (R, o, b) {
            var B = this, V = B.$25n, F = B.s(R + $);
            if (V && (V.stop(!0), delete B.$25n), F !== o) {
                var m = o ? B.s(R + ".end") : B.s(R + ".start");
                B.s(R + $, o), b = G(b), b ? (F = B.s(R + K), b.action = function (v) {
                    B.s(R + K, F + (m - F) * v)
                }, B.$25n = O(b)) : B.s(R + K, m)
            }
        }, getFaceMat: function (C) {
            var A = this, M = A.s(C + K);
            if (!M) return d;
            var Z = A.s(C + ".axis"), V = A.s3(), c = V[0] / 2, F = V[1] / 2, O = V[2] / 2, o = [];
            return C === X && (Z === Y ? o.push({t3: [c, 0, -O]}, {r3: [0, -M, 0]}, {t3: [-c, 0, O]}) : Z === r ? o.push({t3: [-c, 0, -O]}, {r3: [0, M, 0]}, {t3: [c, 0, O]}) : Z === n ? o.push({t3: [0, -F, -O]}, {r3: [-M, 0, 0]}, {t3: [0, F, O]}) : Z === s ? o.push({t3: [0, F, -O]}, {r3: [M, 0, 0]}, {t3: [0, -F, O]}) : Z === W ? o.push({t3: [0, 0, -O]}, {r3: [0, M, 0]}, {t3: [0, 0, O]}) : Z === U && o.push({t3: [0, 0, -O]}, {r3: [M, 0, 0]}, {t3: [0, 0, O]})), C === H && (Z === Y ? o.push({t3: [-c, 0, O]}, {r3: [0, -M, 0]}, {t3: [c, 0, -O]}) : Z === r ? o.push({t3: [c, 0, O]}, {r3: [0, M, 0]}, {t3: [-c, 0, -O]}) : Z === n ? o.push({t3: [0, -F, O]}, {r3: [M, 0, 0]}, {t3: [0, F, -O]}) : Z === s ? o.push({t3: [0, F, O]}, {r3: [-M, 0, 0]}, {t3: [0, -F, -O]}) : Z === W ? o.push({t3: [0, 0, O]}, {r3: [0, M, 0]}, {t3: [0, 0, -O]}) : Z === U && o.push({t3: [0, 0, O]}, {r3: [M, 0, 0]}, {t3: [0, 0, -O]})), C === Y && (Z === Y ? o.push({t3: [c, 0, O]}, {r3: [0, -M, 0]}, {t3: [-c, 0, -O]}) : Z === r ? o.push({t3: [c, 0, -O]}, {r3: [0, M, 0]}, {t3: [-c, 0, O]}) : Z === n ? o.push({t3: [c, -F, 0]}, {r3: [0, 0, -M]}, {t3: [-c, F, 0]}) : Z === s ? o.push({t3: [c, F, 0]}, {r3: [0, 0, M]}, {t3: [-c, -F, 0]}) : Z === W ? o.push({t3: [c, 0, 0]}, {r3: [0, M, 0]}, {t3: [-c, 0, 0]}) : Z === U && o.push({t3: [c, 0, 0]}, {r3: [0, 0, M]}, {t3: [-c, 0, 0]})), C === r && (Z === Y ? o.push({t3: [-c, 0, -O]}, {r3: [0, -M, 0]}, {t3: [c, 0, O]}) : Z === r ? o.push({t3: [-c, 0, O]}, {r3: [0, M, 0]}, {t3: [c, 0, -O]}) : Z === n ? o.push({t3: [-c, -F, 0]}, {r3: [0, 0, M]}, {t3: [c, F, 0]}) : Z === s ? o.push({t3: [-c, F, 0]}, {r3: [0, 0, -M]}, {t3: [c, -F, 0]}) : Z === W ? o.push({t3: [-c, 0, 0]}, {r3: [0, M, 0]}, {t3: [c, 0, 0]}) : Z === U && o.push({t3: [-c, 0, 0]}, {r3: [0, 0, M]}, {t3: [c, 0, 0]})), C === n && (Z === Y ? o.push({t3: [c, -F, 0]}, {r3: [0, 0, M]}, {t3: [-c, F, 0]}) : Z === r ? o.push({t3: [-c, -F, 0]}, {r3: [0, 0, -M]}, {t3: [c, F, 0]}) : Z === n ? o.push({t3: [0, -F, O]}, {r3: [-M, 0, 0]}, {t3: [0, F, -O]}) : Z === s ? o.push({t3: [0, -F, -O]}, {r3: [M, 0, 0]}, {t3: [0, F, O]}) : Z === W ? o.push({t3: [0, -F, 0]}, {r3: [0, 0, M]}, {t3: [0, F, 0]}) : Z === U && o.push({t3: [0, -F, 0]}, {r3: [M, 0, 0]}, {t3: [0, F, 0]})), C === s && (Z === Y ? o.push({t3: [c, F, 0]}, {r3: [0, 0, -M]}, {t3: [-c, -F, 0]}) : Z === r ? o.push({t3: [-c, F, 0]}, {r3: [0, 0, M]}, {t3: [c, -F, 0]}) : Z === n ? o.push({t3: [0, F, -O]}, {r3: [-M, 0, 0]}, {t3: [0, -F, O]}) : Z === s ? o.push({t3: [0, F, O]}, {r3: [M, 0, 0]}, {t3: [0, -F, -O]}) : Z === W ? o.push({t3: [0, F, 0]}, {r3: [0, 0, M]}, {t3: [0, -F, 0]}) : Z === U && o.push({t3: [0, F, 0]}, {r3: [M, 0, 0]}, {t3: [0, -F, 0]})), I(o)
        }
    })
}("undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : (0, eval)("this"), Object);