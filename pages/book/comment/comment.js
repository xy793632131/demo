var t = !1, e = !1, o = 2;

Page({
    data: {},
    onLoad: function(a) {
        getApp().page.onLoad(this, a), t = !1, e = !1, o = 2;
        var n = this;
        n.setData({
            gid: a.id
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.comment,
            data: {
                gid: a.id
            },
            success: function(t) {
                getApp().core.hideLoading(), 1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), 0 == t.code && (0 == t.data.comment.length && getApp().core.showModal({
                    title: "提示",
                    content: "暂无评价",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), n.setData({
                    comment: t.data.comment
                })), n.setData({
                    show_no_data_tip: 0 == n.data.comment.length
                });
            }
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(a) {
        getApp().page.onReachBottom(this);
        var n = this;
        e || t || (e = !0, getApp().request({
            url: getApp().api.group.comment,
            data: {
                gid: n.data.gid,
                page: o
            },
            success: function(e) {
                if (0 == e.code) {
                    var a = n.data.comment.concat(e.data.comment);
                    n.setData({
                        comment: a
                    }), 0 == e.data.comment.length && (t = !0);
                }
                o++;
            },
            complete: function() {
                e = !1;
            }
        }));
    },
    bigToImage: function(t) {
        var e = this.data.comment[t.target.dataset.index].pic_list;
        getApp().core.previewImage({
            current: t.target.dataset.url,
            urls: e
        });
    }
});