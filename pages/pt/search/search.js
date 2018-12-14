var t = 1;

Page({
    data: {
        history_show: !1,
        search_val: "",
        list: [],
        history_info: [],
        show_loading_bar: !1,
        emptyGoods: !1,
        newSearch: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var o = this;
        getApp().core.getStorage({
            key: "history_info",
            success: function(t) {
                t.data.length > 0 && o.setData({
                    history_info: t.data,
                    history_show: !0
                });
            }
        });
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
    onReachBottom: function(o) {
        getApp().page.onReachBottom(this);
        var a = this;
        a.data.emptyGoods || (a.data.page_count <= t && a.setData({
            emptyGoods: !0
        }), t++, a.getSearchGoods());
    },
    toSearch: function(t) {
        var o = t.detail.value, a = this;
        if (o) {
            var e = a.data.history_info;
            e.unshift(o);
            for (var s in e) {
                if (e.length <= 20) break;
                e.splice(s, 1);
            }
            getApp().core.setStorageSync(getApp().const.HISTORY_INFO, e), a.setData({
                history_info: e,
                history_show: !1,
                keyword: o,
                list: []
            }), a.getSearchGoods();
        }
    },
    cancelSearchValue: function(t) {
        getApp().core.navigateBack({
            delta: 1
        });
    },
    newSearch: function(o) {
        var a = this, e = !1;
        a.data.history_info.length > 0 && (e = !0), t = 1, a.setData({
            history_show: e,
            list: [],
            newSearch: [],
            emptyGoods: !1
        });
    },
    clearHistoryInfo: function(t) {
        var o = this, a = [];
        getApp().core.setStorageSync(getApp().const.HISTORY_INFO, a), o.setData({
            history_info: a,
            history_show: !1
        });
    },
    getSearchGoods: function() {
        var o = this, a = o.data.keyword;
        a && (o.setData({
            show_loading_bar: !0
        }), getApp().request({
            url: getApp().api.group.search,
            data: {
                keyword: a,
                page: t
            },
            success: function(a) {
                if (0 == a.code) {
                    if (o.data.newSearch) e = a.data.list; else var e = o.data.list.concat(a.data.list);
                    o.setData({
                        list: e,
                        page_count: a.data.page_count,
                        emptyGoods: !0,
                        show_loading_bar: !1
                    }), a.data.page_count > t && o.setData({
                        newSearch: !1,
                        emptyGoods: !1
                    });
                }
            },
            complete: function() {}
        }));
    },
    historyItem: function(t) {
        var o = t.currentTarget.dataset.keyword, a = this;
        a.setData({
            keyword: o,
            history_show: !1
        }), a.getSearchGoods();
    }
});