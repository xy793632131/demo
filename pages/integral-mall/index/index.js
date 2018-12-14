var t = 0, e = -1, a = 1;

Page({
    data: {
        goods_list: []
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), a = 1, this.getGoodsList(t);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(a) {
        getApp().page.onShow(this);
        var n = this;
        getApp().request({
            url: getApp().api.integral.index,
            data: {},
            success: function(a) {
                if (0 == a.code && (a.data.today && n.setData({
                    register_day: 1
                }), n.setData({
                    banner_list: a.data.banner_list,
                    coupon_list: a.data.coupon_list,
                    integral: a.data.user.integral,
                    catList: a.data.cat_list
                }), -1 != e)) {
                    var o = [];
                    o.index = e, o.catId = t, n.catGoods({
                        currentTarget: {
                            dataset: o
                        }
                    });
                }
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    exchangeCoupon: function(t) {
        var e = this, a = e.data.coupon_list, n = t.currentTarget.dataset.index, o = a[n], i = e.data.integral;
        if (parseInt(o.integral) > parseInt(i)) e.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1
        }); else {
            if (parseFloat(o.price) > 0) s = "需要" + o.integral + "积分+￥" + parseFloat(o.price); else var s = "需要" + o.integral + "积分";
            if (parseInt(o.total_num) <= 0) return void e.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1
            });
            if (parseInt(o.num) >= parseInt(o.user_num)) return o.type = 1, void e.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1,
                coupon_list: a
            });
            getApp().core.showModal({
                title: "确认兑换",
                content: s,
                success: function(t) {
                    t.confirm && (parseFloat(o.price) > 0 ? (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 2
                        },
                        success: function(t) {
                            0 == t.code && getApp().core.requestPayment({
                                _res: t,
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                complete: function(n) {
                                    "requestPayment:fail" != n.errMsg && "requestPayment:fail cancel" != n.errMsg ? "requestPayment:ok" == n.errMsg && (o.num = parseInt(o.num), 
                                    o.num += 1, o.total_num = parseInt(o.total_num), o.total_num -= 1, i = parseInt(i), 
                                    i -= parseInt(o.integral), e.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: t.msg,
                                        coupon_list: a,
                                        integral: i
                                    })) : getApp().core.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })) : (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code && (o.num = parseInt(o.num), o.num += 1, o.total_num = parseInt(o.total_num), 
                            o.total_num -= 1, i = parseInt(i), i -= parseInt(o.integral), e.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon_list: a,
                                integral: i
                            }));
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })));
                }
            });
        }
    },
    hideModal: function() {
        this.setData({
            showModel: !1
        });
    },
    couponInfo: function(t) {
        var e = t.currentTarget.dataset;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/coupon-info/index?coupon_id=" + e.id
        });
    },
    goodsAll: function() {
        var t = this, e = t.data.goods_list, a = [];
        for (var n in e) {
            var o = e[n].goods;
            e[n].cat_checked = !1;
            for (var i in o) a.push(o[i]);
        }
        t.setData({
            index_goods: a,
            cat_checked: !0,
            goods_list: e
        });
    },
    catGoods: function(n) {
        var o = n.currentTarget.dataset, i = this, s = i.data.catList;
        t = o.catId, e = o.index;
        var r = o.index;
        if (-1 === r) {
            var p = !0;
            for (var c in s) s[c].cat_checked = !1;
        }
        if (r >= 0) for (var c in s) s[c].id == s[r].id ? (s[c].cat_checked = !0, p = !1) : s[c].cat_checked = !1;
        i.setData({
            cat_checked: p,
            catList: s,
            goods_list: []
        }), a = 1, i.getGoodsList(t);
    },
    getGoodsList: function(t) {
        var n = this;
        -1 === e && n.setData({
            cat_checked: !0
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.integral.goods_list,
            data: {
                page: a,
                cat_id: t
            },
            success: function(t) {
                if (0 === t.code) {
                    var e = n.data.goods_list;
                    t.data.list.length > 0 && (e.length > 0 && (e = e.concat(t.data.list)), 0 === e.length && (e = t.data.list), 
                    a += 1), 0 === t.data.list.length && getApp().core.showToast({
                        title: "没有更多啦",
                        icon: "none"
                    }), n.setData({
                        goods_list: e
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    goodsInfo: function(t) {
        var e = t.currentTarget.dataset.goodsId, a = this;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/goods-info/index?goods_id=" + e + "&integral=" + a.data.integral
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
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = getApp().getUser(), e = "", a = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var n in a) if ("pages/integral-mall/index/index" === a[n].url) {
            e = a[n].title;
            break;
        }
        return {
            path: "/pages/integral-mall/index/index?user_id=" + t.id,
            title: e || "积分商城"
        };
    },
    onReachBottom: function(e) {
        getApp().page.onReachBottom(this), this.getGoodsList(t);
    },
    shuoming: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/shuoming/index"
        });
    },
    detail: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/detail/index"
        });
    },
    exchange: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/exchange/index"
        });
    },
    register: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/register/index"
        });
    }
});