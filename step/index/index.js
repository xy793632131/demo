function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e, a = require("../../utils/helper.js"), o = getApp().helper;

Page(t({
    data: (e = {
        dare: !1,
        my: "0",
        todayStep: "0",
        authorize: !0,
        overStep: "0",
        banner_list: [],
        useStep: "0",
        nowAdd: "0.00",
        today: "",
        nextAdd: "0.00",
        people: "2153",
        friend: [],
        now: !1,
        convert_ratio: "",
        activity_data: [ {
            id: 0
        }, {
            open_date: ""
        }, {
            name: ""
        }, {
            bail_currency: 0
        }, {
            step_num: 0
        } ],
        convert_max: 0,
        title: "",
        goods: [],
        user_id: 0,
        time: "",
        encrypted_data: "",
        iv: "",
        code: "",
        page: 2,
        unit_id: ""
    }, t(e, "user_id", ""), t(e, "over", !1), e),
    switch: function(t) {
        var e = 0;
        e = 1 == t.detail.value ? 1 : 0, getApp().request({
            url: getApp().api.step.remind,
            data: {
                remind: e
            }
        });
    },
    exchange: function() {
        var t = this, e = void 0, a = void 0, o = void 0, i = t.data.nowAdd, n = t.data.todayStep * (1 + i / 100), d = t.data.useStep, r = t.data.convert_ratio, s = t.data.convert_max, p = parseInt(n);
        s > 0 && p > +s && (p = +s), p -= d;
        var c = t.data.overStep, u = (p / r).toString().match(/^\d+(?:\.\d{0,2})?/);
        u < .01 || 0 == c ? getApp().core.showModal({
            content: "步数不足",
            showCancel: !1
        }) : getApp().core.showModal({
            content: "确认把" + c + "步兑换为" + u + (t.data.store.option.step.currency_name ? t.data.store.option.step.currency_name : "活力币"),
            success: function(i) {
                i.confirm && (getApp().core.showLoading({
                    title: "兑换中...",
                    mask: !0
                }), getApp().core.login({
                    success: function(i) {
                        a = i.code, getApp().core.getWeRunData({
                            success: function(i) {
                                e = i.iv, o = i.encryptedData, getApp().request({
                                    url: getApp().api.step.convert,
                                    method: "post",
                                    data: {
                                        iv: e,
                                        code: a,
                                        encrypted_data: o,
                                        num: t.data.todayStep
                                    },
                                    success: function(e) {
                                        if (getApp().core.hideLoading(), 0 == e.code) {
                                            s > 0 && p > +s && (p = +s), p -= e.list.num;
                                            var a = (+t.data.my + +e.list.convert).toFixed(2);
                                            t.setData({
                                                overStep: p,
                                                my: a,
                                                useStep: e.list.num
                                            });
                                        } else getApp().core.showModal({
                                            content: e.msg,
                                            showCancel: !1
                                        });
                                    }
                                });
                            }
                        });
                    }
                }));
            },
            fail: function(t) {
                getApp().core.hideLoading(), getApp().core.showModal({
                    content: "为确保您的正常使用，请完善授权操作",
                    showCancel: !1
                });
            }
        });
    },
    adError: function(t) {
        console.log(t.detail);
    },
    onShareAppMessage: function(t) {
        return getApp().page.onShareAppMessage(this), {
            path: "/step/dare/dare?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "步数挑战"
        };
    },
    onReachBottom: function() {
        var t = this, e = t.data.over;
        if (!e) {
            var a = this.data.encrypted_data, o = this.data.iv, i = this.data.code, n = this.data.user_id, d = this.data.goods, r = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.index,
                method: "POST",
                data: {
                    encrypted_data: a,
                    iv: o,
                    code: i,
                    user_id: n,
                    page: r
                },
                success: function(a) {
                    for (var o = 0; o < a.data.goods_data.length; o++) d.push(a.data.goods_data[o]);
                    a.data.goods_data.length < 6 && (e = !0), t.setData({
                        goods: d,
                        page: r + 1,
                        over: e,
                        loading: !1
                    });
                }
            });
        }
    },
    refresh: function() {
        getApp().core.showLoading({
            title: "步数加载中...",
            mask: !0
        });
        var t = this, e = t.data.convert_max;
        t.runData(t.data.user_id, e);
    },
    onShow: function() {
        if (0 != this.data.now) {
            var t = this, e = void 0, a = void 0, o = void 0, i = t.data.user_id;
            getApp().core.login({
                success: function(n) {
                    e = n.code, getApp().core.getWeRunData({
                        success: function(n) {
                            a = n.iv, o = n.encryptedData, getApp().request({
                                url: getApp().api.step.index,
                                method: "POST",
                                data: {
                                    encrypted_data: o,
                                    iv: a,
                                    code: e,
                                    user_id: i,
                                    page: 1
                                },
                                success: function(e) {
                                    getApp().core.hideLoading();
                                    var a = e.data.activity_data, o = e.data.user_data, i = e.data.user_data.step_currency;
                                    t.setData({
                                        activity_data: a,
                                        user_data: o,
                                        my: i
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    runData: function(e, a) {
        var o = this, i = void 0, n = void 0, d = void 0;
        getApp().core.login({
            success: function(r) {
                i = r.code, getApp().core.getWeRunData({
                    success: function(r) {
                        n = r.iv, d = r.encryptedData, getApp().request({
                            url: getApp().api.step.index,
                            method: "POST",
                            data: {
                                encrypted_data: d,
                                iv: n,
                                code: i,
                                user_id: e,
                                page: 1
                            },
                            success: function(r) {
                                getApp().core.hideLoading();
                                var s = void 0, p = void 0;
                                null == r.data.activity_data.id ? (p = !1, s = []) : (p = !0, s = r.data.activity_data);
                                var c = r.data.run_data.stepInfoList, u = r.data.user_data, g = void 0, h = [ {
                                    pic_url: "../image/ad.png"
                                } ];
                                r.data.banner_list.length > 0 && (h = r.data.banner_list);
                                var l = !1;
                                null !== r.data.ad_data && (l = r.data.ad_data.unit_id);
                                var v = u.step_currency, _ = r.data.ad_data, f = r.data.goods_data, A = c[c.length - 1].step, m = c[c.length - 1].timestamp, w = u.ratio / 10, y = u.invite_list, S = 0, D = u.now_ratio / 10, M = void 0;
                                0 == u.remind ? M = !1 : 1 == u.remind && (M = !0), u.convert_num > 0 && (S = u.convert_num);
                                var x = parseInt(A * (1 + D / 100));
                                a > 0 && x > +a && (x = +a), (x -= +S) >= 1e3 && (x = String(x).replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
                                var L = "";
                                void 0 != s.open_date && (L = s.open_date.replace(".", "").replace(".", "")), g = !(s.step_num > A), 
                                x < 0 && (x = 0);
                                var b = y.length;
                                o.setData(t({
                                    overStep: x,
                                    todayStep: A,
                                    nextAdd: w,
                                    friend: y,
                                    today: m,
                                    finish: g,
                                    nowAdd: D,
                                    my: v,
                                    now: !0,
                                    user: u,
                                    length: b,
                                    banner_list: h,
                                    useStep: S,
                                    goods: f,
                                    user_id: e,
                                    checked: M,
                                    encrypted_data: d,
                                    iv: n,
                                    page: 2,
                                    code: i,
                                    open_date: L,
                                    activity_data: s,
                                    dare: p,
                                    ad_data: _,
                                    unit_id: l
                                }, "user_id", u.user_id));
                            },
                            fail: function(t) {
                                getApp().core.showModal({
                                    content: t.errMsg,
                                    showCancel: !1
                                });
                            }
                        });
                    },
                    fail: function(t) {
                        getApp().core.showModal({
                            content: t.errMsg,
                            showCancel: !1
                        });
                    }
                });
            },
            fail: function(t) {
                getApp().core.showModal({
                    content: t.errMsg,
                    showCancel: !1
                });
            }
        });
    },
    openSetting: function() {
        var t = this;
        getApp().core.openSetting({
            success: function(e) {
                if (1 == e.authSetting["scope.werun"] && 1 == e.authSetting["scope.userInfo"]) {
                    t.setData({
                        authorize: !0
                    }), getApp().core.showLoading({
                        title: "步数加载中...",
                        mask: !0
                    });
                    var a = t.data.user_id, o = t.data.convert_max;
                    t.runData(a, o);
                }
            },
            fail: function(e) {
                t.setData({
                    authorize: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = 0;
        if (null !== t.scene) {
            var i = decodeURIComponent(t.scene), n = o.scene_decode(i);
            n.uid > 0 && (e = n.uid);
        }
        t.user_id > 0 && (e = t.user_id), this.setData({
            user_id: e,
            now: !1
        });
        var d = a.formatTime(new Date()), r = d[0] + d[1] + d[2] + d[3] + d[5] + d[6] + d[8] + d[9];
        this.setData({
            time: r
        }), getApp().core.showLoading({
            title: "步数加载中...",
            mask: !0
        }), getApp().page.onShow(this), getApp().core.showShareMenu({
            withShareTicket: !0
        });
        var s = this, p = void 0;
        getApp().request({
            url: getApp().api.step.setting,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.title, o = t.data.share_title;
                    p = t.data.convert_max, a && (getApp().core.setNavigationBarTitle({
                        title: a
                    }), s.setData({
                        title: a,
                        share_title: o
                    })), s.setData({
                        convert_ratio: t.data.convert_ratio,
                        convert_max: p
                    }), getApp().core.getSetting({
                        success: function(t) {
                            1 == t.authSetting["scope.werun"] && 1 == t.authSetting["scope.userInfo"] ? s.runData(e, p) : getApp().core.authorize({
                                scope: "scope.userInfo",
                                success: function(t) {
                                    getApp().core.authorize({
                                        scope: "scope.werun",
                                        success: function(t) {
                                            "authorize:ok" == t.errMsg && s.runData(e, p);
                                        },
                                        fail: function(t) {
                                            s.setData({
                                                authorize: !1
                                            }), getApp().core.hideLoading();
                                        }
                                    });
                                }
                            });
                        },
                        fail: function(t) {
                            s.setData({
                                authorize: !1
                            }), getApp().core.hideLoading();
                        }
                    });
                }
            },
            fail: function(t) {
                getApp().core.showModal({
                    content: t.errMsg,
                    showCancel: !1
                });
            }
        });
    }
}, "onShareAppMessage", function(t) {
    return getApp().page.onShareAppMessage(this), {
        path: "/step/index/index?user_id=" + getApp().getUser().id,
        title: this.data.share_title ? this.data.share_title : this.data.title
    };
}));