var t = require("../../../utils/helper.js"), e = require("../../../wxParse/wxParse.js"), a = require("../../../components/goods/specifications_model.js"), o = require("../../../components/goods/goods_banner.js"), i = require("../../../components/goods/goods_info.js"), s = require("../../../components/goods/goods_buy.js"), n = 1, r = !1, d = !0;

Page({
    data: {
        pageType: "BOOK",
        hide: "hide",
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        }
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var a = e.user_id, o = decodeURIComponent(e.scene);
        if (void 0 !== a) a; else if (void 0 !== o) {
            var i = t.scene_decode(o);
            i.uid && i.gid ? (i.uid, e.id = i.gid) : o;
        } else if (null !== getApp().query) {
            var s = getApp().query;
            getApp().query = null, e.id = s.gid, s.uid;
        }
        this.setData({
            id: e.id
        }), n = 1, this.getGoodsInfo(e), this.getCommentList(!1);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), a.init(this), o.init(this), i.init(this), s.init(this);
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
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this), this.getCommentList(!0);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var e = this, a = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            title: e.data.goods.name,
            path: "/pages/book/details/details?id=" + e.data.goods.id + "&user_id=" + a.id,
            imageUrl: e.data.goods.pic_list[0],
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var a = t.id, o = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.details,
            method: "get",
            data: {
                gid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.info.detail;
                    e.wxParse("detail", "html", a, o);
                    var i = parseInt(t.data.info.virtual_sales) + parseInt(t.data.info.sales);
                    t.data.attr_group_list.length <= 0 && (t.data.attr_group_list = [ {
                        attr_group_name: "规格",
                        attr_list: [ {
                            attr_id: 0,
                            attr_name: "默认",
                            checked: !0
                        } ]
                    } ]);
                    var s = t.data.info;
                    s.num = t.data.info.stock, s.min_price = t.data.info.price > .01 ? t.data.info.price : "免费", 
                    s.sales_volume = t.data.info.sales, s.service_list = t.data.info.service, o.setData({
                        goods: t.data.info,
                        shop: t.data.shopList,
                        sales: i,
                        attr_group_list: t.data.attr_group_list
                    }), o.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    tabSwitch: function(t) {
        var e = this;
        "detail" == t.currentTarget.dataset.tab ? e.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : e.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: e.data.comment_list[a].pic_list[o],
            urls: e.data.comment_list[a].pic_list
        });
    },
    bespeakNow: function(t) {
        var e = this;
        if (!e.data.show_attr_picker) return e.setData({
            show_attr_picker: !0
        }), !0;
        for (var a = [], o = !0, i = e.data.attr_group_list, s = 0; s < i.length; s++) {
            var n = i[s].attr_list;
            o = !0;
            for (var r = 0; r < n.length; r++) n[r].checked && (a.push({
                attr_group_id: i[s].attr_group_id,
                attr_id: n[r].attr_id,
                attr_group_name: i[s].attr_group_name,
                attr_name: n[r].attr_name
            }), o = !1);
            if (o) return void getApp().core.showModal({
                title: "提示",
                content: "请选择" + i[s].attr_group_name,
                showCancel: !1
            });
        }
        var d = [ {
            id: e.data.goods.id,
            attr: a
        } ];
        getApp().core.redirectTo({
            url: "/pages/book/submit/submit?goods_info=" + JSON.stringify(d)
        });
    },
    goToShopList: function(t) {
        getApp().core.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    getCommentList: function(t) {
        var e = this;
        t && "active" != e.data.tab_comment || r || d && (r = !0, getApp().request({
            url: getApp().api.book.goods_comment,
            data: {
                goods_id: e.data.id,
                page: n
            },
            success: function(a) {
                0 == a.code && (r = !1, n++, e.setData({
                    comment_count: a.data.comment_count,
                    comment_list: t ? e.data.comment_list.concat(a.data.list) : a.data.list
                }), 0 == a.data.list.length && (d = !1));
            }
        }));
    }
});