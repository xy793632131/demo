var t = !1, e = !0, a = !1;

Page({
    data: {
        p: 1,
        naver: "index"
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this), getApp().core.showLoading({
            title: "加载中"
        });
        var t = this;
        t.data.p = 1, getApp().request({
            url: getApp().api.lottery.index,
            success: function(a) {
                if (0 == a.code) {
                    t.setData(a.data), null != a.data.new_list && a.data.new_list.length > 0 && (e = !1);
                    var i = [];
                    a.data.new_list.forEach(function(t, e, a) {
                        i.push(t.end_time);
                    }), t.setTimeStart(i);
                }
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        }), getApp().request({
            url: getApp().api.lottery.setting,
            success: function(t) {
                if (0 == t.code) {
                    var e = t.data.title;
                    e && getApp().core.setNavigationBarTitle({
                        title: e
                    });
                }
            }
        });
    },
    onHide: function() {
        getApp().page.onHide(this), clearInterval(a);
    },
    onUnload: function() {
        getApp().page.onUnload(this), clearInterval(a);
    },
    setTimeStart: function(t) {
        var e = this, i = [];
        clearInterval(a), a = setInterval(function() {
            t.forEach(function(t, e, a) {
                var n = new Date(), o = parseInt(t - n.getTime() / 1e3);
                if (o > 0) var r = Math.floor(o / 86400), l = Math.floor(o / 3600) - 24 * r, s = Math.floor(o / 60) - 24 * r * 60 - 60 * l, p = Math.floor(o) - 24 * r * 60 * 60 - 60 * l * 60 - 60 * s;
                var c = {
                    day: r,
                    hour: l,
                    minute: s,
                    second: p
                };
                i[e] = c;
            }), e.setData({
                time_list: i
            });
        }, 1e3);
    },
    submit: function(t) {
        var e = t.detail.formId, a = t.currentTarget.dataset.lottery_id;
        getApp().core.navigateTo({
            url: "/lottery/detail/detail?lottery_id=" + a + "&form_id=" + e
        });
    },
    onReachBottom: function() {
        e || this.loadData();
    },
    loadData: function() {
        if (!t) {
            t = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var a = this, i = a.data.p + 1;
            getApp().request({
                url: getApp().api.lottery.index,
                data: {
                    page: i
                },
                success: function(t) {
                    if (0 == t.code) {
                        var n = a.data.new_list;
                        if (null == t.data.new_list || 0 == t.data.new_list.length) return void (e = !0);
                        n = n.concat(t.data.new_list), a.setData({
                            new_list: n,
                            p: i
                        });
                        var o = [];
                        n.forEach(function(t, e, a) {
                            o.push(t.end_time);
                        }), a.setTimeStart(o);
                    } else a.showToast({
                        title: t.msg
                    });
                },
                complete: function(e) {
                    getApp().core.hideLoading(), t = !1;
                }
            });
        }
    }
});