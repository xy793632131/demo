var a = !1;

Page({
    data: {
        page: 1,
        num: 0
    },
    onLoad: function(a) {
        if (getApp().page.onLoad(this, a), a) {
            var t = this;
            t.setData(a), getApp().core.showLoading({
                title: "加载中"
            }), getApp().request({
                url: getApp().api.lottery.lucky_code,
                data: {
                    id: a.id
                },
                success: function(a) {
                    if (0 == a.code) {
                        t.setData(a.data);
                        var e = a.data;
                        if (e.award && e.award.lucky_code == a.data.own.lucky_code) n = a.data.parent.length; else var n = a.data.parent.length + 1;
                        t.setData({
                            num: n
                        });
                    }
                },
                complete: function(a) {
                    getApp().core.hideLoading();
                }
            });
        }
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    userload: function() {
        if (!a) {
            a = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var t = this, e = t.data.page + 1;
            getApp().request({
                url: getApp().api.lottery.lucky_code,
                data: {
                    id: t.data.id,
                    page: e
                },
                success: function(n) {
                    if (0 == n.code) {
                        if (null == n.data.parent || 0 == n.data.parent.length) return void (a = !0);
                        t.setData({
                            parent: t.data.parent.concat(n.data.parent),
                            page: e,
                            num: t.data.parent.concat(n.data.parent).length
                        });
                    } else t.showToast({
                        title: n.msg
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), this.data.is_loading = !1;
                }
            });
        }
    }
});