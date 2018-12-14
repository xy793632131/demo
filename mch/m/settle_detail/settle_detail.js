Page({
    data: {
        settle_type: "",
        settleList: [],
        page: 1,
        loading: !1,
        no_more: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        e.setData({
            settle_type: t.settle_type
        }), e.getSettleList();
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this), this.getSettleList();
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
    },
    getSettleList: function() {
        var t = this;
        if (!t.data.loading && !t.data.no_more) {
            t.setData({
                loading: !0
            });
            var e = t.data.settle_type, a = t.data.page;
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            }), getApp().request({
                url: getApp().api.mch.user.settle_log,
                data: {
                    settle_type: e,
                    page: a
                },
                success: function(e) {
                    0 == e.code ? e.data.list.length > 0 ? t.setData({
                        settleList: t.data.settleList.concat(e.data.list),
                        page: a + 1
                    }) : t.setData({
                        no_more: !0
                    }) : getApp().core.showModal({
                        title: "提示",
                        content: e.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && getApp().core.navigateBack();
                        }
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), t.setData({
                        loading: !1
                    });
                }
            });
        }
    }
});