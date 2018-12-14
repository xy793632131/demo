module.exports = {
    currentPage: null,
    init: function(o) {
        var t = this;
        t.currentPage = o, void 0 === o.goods_recommend && (o.goods_recommend = function(o) {
            t.goods_recommend(o);
        });
    },
    goods_recommend: function(o) {
        var t = this.currentPage;
        t.setData({
            is_loading: !0
        });
        var a = t.data.page || 2;
        getApp().request({
            url: getApp().api.default.goods_recommend,
            data: {
                goods_id: o.goods_id,
                page: a
            },
            success: function(e) {
                if (0 == e.code) {
                    if (o.reload) d = e.data.list;
                    if (o.loadmore) var d = t.data.goods_list.concat(e.data.list);
                    t.data.drop = !0, t.setData({
                        goods_list: d
                    }), t.setData({
                        page: a + 1
                    });
                }
            },
            complete: function() {
                t.setData({
                    is_loading: !1
                });
            }
        });
    }
};