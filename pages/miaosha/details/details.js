var t = require("../../../utils/helper.js"), a = require("../../../wxParse/wxParse.js"), e = require("../../../components/goods/goods_banner.js"), o = require("../../../components/goods/specifications_model.js"), i = require("../../../components/goods/goods_info.js"), s = require("../../../components/goods/goods_buy.js"), r = 1, n = !1, d = !0, c = 0;

Page({
    data: {
        pageType: "MIAOSHA",
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
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        }
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a), c = 0, r = 1, n = !1, d = !0;
        var e = a.user_id, o = decodeURIComponent(a.scene), i = 0;
        if (void 0 !== e) e; else if ("undefined" == typeof my) {
            if (void 0 !== a.scene) {
                i = 1;
                var o = decodeURIComponent(a.scene), s = t.scene_decode(o);
                s.uid && s.gid ? (s.uid, a.id = s.gid) : o;
            }
        } else if (null !== getApp().query) {
            i = 1;
            var p = getApp().query;
            getApp().query = null, a.id = p.gid;
        }
        var g = this;
        g.setData({
            id: a.id,
            scene_type: i
        }), g.getGoods(), g.getCommentList();
    },
    getGoods: function() {
        var t = this, e = {};
        t.data.id && (e.id = t.data.id), t.data.goods_id && (e.goods_id = t.datat.goods_id), 
        e.scene_type = t.data.scene_type, getApp().request({
            url: getApp().api.miaosha.details,
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    var o = e.data.detail;
                    a.wxParse("detail", "html", o, t);
                    var i = e.data, s = e.data.miaosha, r = [];
                    for (var n in i.pic_list) r.push(i.pic_list[n].pic_url);
                    i.pic_list = r, i.min_price = s.new_small_price, i.sales_volume = s.sell_num, t.setData({
                        goods: i,
                        attr_group_list: e.data.attr_group_list,
                        miaosha_data: e.data.miaosha.miaosha_data
                    }), 1 == t.data.scene_type && t.setData({
                        id: e.data.miaosha.miaosha_goods_id
                    }), t.data.goods.miaosha && t.setMiaoshaTimeOver(), t.selectDefaultAttr();
                }
                1 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(t) {
        var a = this;
        t && "active" != a.data.tab_comment || n || d && (n = !0, getApp().request({
            url: getApp().api.miaosha.comment_list,
            data: {
                goods_id: a.data.id,
                page: r
            },
            success: function(e) {
                0 == e.code && (n = !1, r++, a.setData({
                    comment_count: e.data.comment_count,
                    comment_list: t ? a.data.comment_list.concat(e.data.list) : e.data.list
                }), 0 == e.data.list.length && (d = !1));
            }
        }));
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.goods.miaosha ? this.submit("BUY_NOW") : getApp().core.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function(t) {}
        });
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.miaosha_data && a.data.miaosha_data.rest_num > 0 && a.data.form.number > a.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (1e3 * this.data.goods.miaosha.begin_time > Date.parse(new Date())) return getApp().core.showToast({
            title: "活动未开始",
            image: "/images/icon-warning.png"
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var e = a.data.attr_group_list, o = [];
        for (var i in e) {
            var s = !1;
            for (var r in e[i].attr_list) if (e[i].attr_list[r].checked) {
                s = {
                    attr_id: e[i].attr_list[r].attr_id,
                    attr_name: e[i].attr_list[r].attr_name
                };
                break;
            }
            if (!s) return getApp().core.showToast({
                title: "请选择" + e[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[i].attr_group_id,
                attr_group_name: e[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        "ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.id,
                attr: JSON.stringify(o),
                num: a.data.form.number
            },
            success: function(t) {
                getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), getApp().core.hideLoading(), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t && (a.setData({
            show_attr_picker: !1
        }), getApp().core.redirectTo({
            url: "/pages/miaosha/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.id,
                attr: o,
                num: a.data.form.number
            })
        }));
    },
    favoriteAdd: function() {
        var t = this;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: t.data.goods.id
            },
            success: function(a) {
                if (0 == a.code) {
                    var e = t.data.goods;
                    e.is_favorite = 1, t.setData({
                        goods: e
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var t = this;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: t.data.goods.id
            },
            success: function(a) {
                if (0 == a.code) {
                    var e = t.data.goods;
                    e.is_favorite = 0, t.setData({
                        goods: e
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        var a = this;
        "detail" == t.currentTarget.dataset.tab ? a.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : a.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var a = this, e = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: a.data.comment_list[e].pic_list[o],
            urls: a.data.comment_list[e].pic_list
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), e.init(this), o.init(this), i.init(this), s.init(this);
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
        var a = this, e = getApp().getUser();
        return {
            path: "/pages/miaosha/details/details?id=" + this.data.id + "&user_id=" + e.id,
            success: function(t) {
                1 == ++c && getApp().shareSendCoupon(a);
            },
            title: a.data.goods.name,
            imageUrl: a.data.goods.pic_list[0]
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        function t() {
            var t = e.data.goods.miaosha.end_time - e.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, e.data.goods.miaosha.now_time++, e.setData({
                goods: e.data.goods,
                miaosha_end_time_over: a(t)
            });
        }
        function a(t) {
            var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60, i = 0;
            return a >= 1 && (a -= 1, i = 1), {
                h: a < 10 ? "0" + a : "" + a,
                m: e < 10 ? "0" + e : "" + e,
                s: o < 10 ? "0" + o : "" + o,
                type: i
            };
        }
        var e = this;
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: a
        });
    }
});