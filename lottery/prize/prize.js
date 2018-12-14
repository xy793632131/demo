var t = !1, a = !0;

Page({
    data: {
        naver: "prize",
        list: [],
        page: 1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.setData({
            status: t.status || 0
        });
        var e = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.lottery.prize,
            data: {
                status: e.data.status,
                page: e.data.page
            },
            success: function(t) {
                0 == t.code && (e.setData({
                    list: t.data.list
                }), null != t.data.list && t.data.list.length > 0 && (a = !1));
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        a || this.loadData();
    },
    loadData: function() {
        if (!t) {
            t = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var e = this, s = e.data.page + 1;
            getApp().request({
                url: getApp().api.lottery.prize,
                data: {
                    status: e.data.status,
                    page: s
                },
                success: function(t) {
                    if (0 == t.code) {
                        if (null == t.data.list || 0 == t.data.list.length) return void (a = !0);
                        e.setData({
                            list: e.data.list.concat(t.data.list),
                            page: s
                        });
                    } else e.showToast({
                        title: t.msg
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), t = !1;
                }
            });
        }
    }
});