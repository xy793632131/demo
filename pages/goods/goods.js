var t = require("../../wxParse/wxParse.js"), e = require("../../components/shopping_cart/shopping_cart.js"), o = require("../../components/specifications_model/specifications_model.js"), a = require("../../components/goods/specifications_model.js"), i = require("../../components/goods/goods_banner.js"), s = require("../../components/goods/goods_info.js"), n = require("../../components/goods/goods_buy.js"), d = require("../../components/goods/goods_recommend.js"), c = 1, r = !1, p = !0, g = 0;

Page({
    data: {
        pageType: "STORE",
        id: null,
        goods: {},
        show_attr_picker: !1,
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
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        g = 0, c = 1, r = !1, p = !0;
        var o = t.quick;
        if (o) {
            var a = getApp().core.getStorageSync(getApp().const.ITEM);
            if (a) var i = a.total, s = a.carGoods; else var i = {
                total_price: 0,
                total_num: 0
            }, s = [];
            e.setData({
                quick: o,
                quick_list: a.quick_list,
                total: i,
                carGoods: s,
                quick_hot_goods_lists: a.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var n = decodeURIComponent(t.scene);
            if (void 0 !== n) {
                var d = getApp().helper.scene_decode(n);
                d.uid && d.gid && (t.id = d.gid);
            }
        } else if (null !== getApp().query) {
            var u = app.query;
            getApp().query = null, t.id = u.gid;
        }
        e.setData({
            id: t.id
        }), e.getGoods(), e.getCommentList();
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this), e.init(this), o.init(this, e), a.init(this), i.init(this), 
        s.init(this), n.init(this), d.init(this);
        var t = this, c = getApp().core.getStorageSync(getApp().const.ITEM);
        if (c) var r = c.total, p = c.carGoods, g = t.data.goods_num; else var r = {
            total_price: 0,
            total_num: 0
        }, p = [], g = 0;
        t.setData({
            total: r,
            carGoods: p,
            goods_num: g
        });
    },
    onHide: function() {
        getApp().page.onHide(this), e.saveItemData(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), e.saveItemData(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var t = this;
        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this, e = getApp().getUser();
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + e.id,
            success: function(e) {
                1 == ++g && t.shareSendCoupon(t);
            },
            title: t.data.goods.name,
            imageUrl: t.data.goods.pic_list[0]
        };
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function(t) {
        var e = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: e
        });
    },
    getGoods: function() {
        var e = this;
        if (e.data.quick) {
            var o = e.data.carGoods;
            if (o) {
                for (var a = o.length, i = 0, s = 0; s < a; s++) o[s].goods_id == e.data.id && (i += parseInt(o[s].num));
                e.setData({
                    goods_num: i
                });
            }
        }
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: e.data.id
            },
            success: function(o) {
                if (0 == o.code) {
                    var a = o.data.detail;
                    t.wxParse("detail", "html", a, e);
                    var i = o.data;
                    i.attr_pic = o.data.attr_pic, i.cover_pic = o.data.pic_list[0].pic_url;
                    var s = i.pic_list, n = [];
                    for (var d in s) n.push(s[d].pic_url);
                    i.pic_list = n, e.setData({
                        goods: i,
                        attr_group_list: o.data.attr_group_list,
                        btn: !0
                    }), e.goods_recommend({
                        goods_id: o.data.id,
                        reload: !0
                    }), e.selectDefaultAttr();
                }
                1 == o.code && getApp().core.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    getCommentList: function(t) {
        var e = this;
        t && "active" != e.data.tab_comment || r || p && (r = !0, getApp().request({
            url: getApp().api.default.comment_list,
            data: {
                goods_id: e.data.id,
                page: c
            },
            success: function(o) {
                0 == o.code && (r = !1, c++, e.setData({
                    comment_count: o.data.comment_count,
                    comment_list: t ? e.data.comment_list.concat(o.data.list) : o.data.list
                }), 0 == o.data.list.length && (p = !1));
            }
        }));
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
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: e.data.comment_list[o].pic_list[a],
            urls: e.data.comment_list[o].pic_list
        });
    }
});