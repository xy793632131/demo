function e(e) {
    t.onShowData || (t.onShowData = {}), t.onShowData.scene = e;
}

var t = getApp(), o = {
    init: function(o, a) {
        var r = this, p = getApp().api;
        r.page = o, t = a;
        var s = getApp().core.getStorageSync(getApp().const.PARENT_ID);
        s || (s = 0), r.page.orderPay = function(o) {
            function a(o, a, r) {
                o.pay_type = "WECHAT_PAY", t.request({
                    url: a,
                    data: o,
                    complete: function() {
                        getApp().core.hideLoading();
                    },
                    success: function(t) {
                        0 == t.code && (e("pay"), getApp().core.requestPayment({
                            _res: t,
                            timeStamp: t.data.timeStamp,
                            nonceStr: t.data.nonceStr,
                            package: t.data.package,
                            signType: t.data.signType,
                            paySign: t.data.paySign,
                            success: function(e) {},
                            fail: function(e) {},
                            complete: function(e) {
                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? getApp().core.redirectTo({
                                    url: "/" + r + "?status=1"
                                }) : getApp().core.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(e) {
                                        e.confirm && getApp().core.redirectTo({
                                            url: "/" + r + "?status=0"
                                        });
                                    }
                                });
                            }
                        })), 1 == t.code && getApp().core.showToast({
                            title: t.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            function i(e, o, a) {
                e.pay_type = "BALANCE_PAY";
                var r = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + r.money,
                    content: "是否使用余额",
                    success: function(r) {
                        r.confirm && (getApp().core.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), t.request({
                            url: o,
                            data: e,
                            complete: function() {
                                getApp().core.hideLoading();
                            },
                            success: function(e) {
                                0 == e.code && getApp().core.redirectTo({
                                    url: "/" + a + "?status=1"
                                }), 1 == e.code && getApp().core.showModal({
                                    title: "提示",
                                    content: e.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            var n = o.currentTarget.dataset.index, c = r.page.data.order_list[n], d = new Array();
            if (void 0 !== r.page.data.pay_type_list) d = r.page.data.pay_type_list; else if (void 0 !== c.pay_type_list) d = c.pay_type_list; else if (void 0 !== c.goods_list[0].pay_type_list) d = c.goods_list[0].pay_type_list; else {
                var g = {};
                g.payment = 0, d.push(g);
            }
            var u = getCurrentPages(), l = u[u.length - 1].route, _ = {};
            if (-1 != l.indexOf("pt")) m = p.group.pay_data, _.order_id = c.order_id; else if (-1 != l.indexOf("miaosha")) m = p.miaosha.pay_data, 
            _.order_id = c.order_id; else if (-1 != l.indexOf("book")) m = p.book.order_pay, 
            _.id = c.id; else {
                var m = p.order.pay_data;
                _.order_id = c.order_id;
            }
            _.parent_id = s, _.condition = 2, 1 == d.length ? (getApp().core.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == d[0].payment && a(_, m, l), 3 == d[0].payment && i(_, m, l)) : getApp().core.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "线上支付",
                success: function(e) {
                    e.confirm ? (getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), a(_, m, l)) : e.cancel && i(_, m, l);
                }
            });
        }, r.page.order_submit = function(a, i) {
            function n() {
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), t.request({
                    url: c,
                    method: "post",
                    data: a,
                    success: function(p) {
                        if (0 == p.code) {
                            var n = function() {
                                t.request({
                                    url: d,
                                    data: {
                                        order_id: c,
                                        order_id_list: u,
                                        pay_type: l,
                                        form_id: a.formId,
                                        parent_user_id: s,
                                        condition: 2
                                    },
                                    success: function(e) {
                                        if (0 != e.code) return getApp().core.hideLoading(), void getApp().core.showModal({
                                            title: "提示",
                                            content: e.msg,
                                            showCancel: !1,
                                            confirmText: "确认",
                                            success: function(e) {
                                                e.confirm && getApp().core.redirectTo({
                                                    url: g + "?status=0"
                                                });
                                            }
                                        });
                                        setTimeout(function() {
                                            getApp().core.hideLoading();
                                        }, 1e3), "pt" == i ? "ONLY_BUY" == r.page.data.type ? getApp().core.redirectTo({
                                            url: g + "?status=2"
                                        }) : getApp().core.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + c
                                        }) : void 0 !== r.page.data.goods_card_list && r.page.data.goods_card_list.length > 0 && 2 != a.payment ? r.page.setData({
                                            show_card: !0
                                        }) : getApp().core.redirectTo({
                                            url: g + "?status=-1"
                                        });
                                    }
                                });
                            };
                            if (getApp().page.bindParent({
                                parent_id: s,
                                condition: 1
                            }), void 0 != p.data.p_price && 0 === p.data.p_price) return "step" == i ? getApp().core.showToast({
                                title: "兑换成功"
                            }) : getApp().core.showToast({
                                title: "提交成功"
                            }), void setTimeout(function() {
                                getApp().core.redirectTo({
                                    url: "/pages/order/order?status=1"
                                });
                            }, 2e3);
                            setTimeout(function() {
                                r.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var c = p.data.order_id || "", u = p.data.order_id_list ? JSON.stringify(p.data.order_id_list) : "", l = "";
                            0 == a.payment ? t.request({
                                url: d,
                                data: {
                                    order_id: c,
                                    order_id_list: u,
                                    pay_type: "WECHAT_PAY",
                                    parent_user_id: s,
                                    condition: 2
                                },
                                success: function(t) {
                                    if (0 != t.code) {
                                        if (1 == t.code) return getApp().core.hideLoading(), void getApp().core.showToast({
                                            title: t.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            getApp().core.hideLoading();
                                        }, 1e3), e("pay"), t.data && 0 == t.data.price ? void 0 !== r.page.data.goods_card_list && r.page.data.goods_card_list.length > 0 ? r.page.setData({
                                            show_card: !0
                                        }) : getApp().core.redirectTo({
                                            url: g + "?status=1"
                                        }) : getApp().core.requestPayment({
                                            _res: t,
                                            timeStamp: t.data.timeStamp,
                                            nonceStr: t.data.nonceStr,
                                            package: t.data.package,
                                            signType: t.data.signType,
                                            paySign: t.data.paySign,
                                            success: function(e) {},
                                            fail: function(e) {},
                                            complete: function(e) {
                                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" != e.errMsg || (void 0 !== r.page.data.goods_card_list && r.page.data.goods_card_list.length > 0 ? r.page.setData({
                                                    show_card: !0
                                                }) : "pt" == i ? "ONLY_BUY" == r.page.data.type ? getApp().core.redirectTo({
                                                    url: g + "?status=2"
                                                }) : getApp().core.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + c
                                                }) : getApp().core.redirectTo({
                                                    url: g + "?status=1"
                                                })) : getApp().core.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(e) {
                                                        e.confirm && getApp().core.redirectTo({
                                                            url: g + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var a = getApp().core.getStorageSync(getApp().const.QUICK_LIST);
                                        if (a) {
                                            for (var p = a.length, s = 0; s < p; s++) for (var n = a[s].goods, d = n.length, u = 0; u < d; u++) n[u].num = 0;
                                            getApp().core.setStorageSync(getApp().const.QUICK_LISTS, a);
                                            for (var l = getApp().core.getStorageSync(getApp().const.CARGOODS), p = l.length, s = 0; s < p; s++) l[s].num = 0, 
                                            l[s].goods_price = 0, o.setData({
                                                carGoods: l
                                            });
                                            getApp().core.setStorageSync(getApp().const.CARGOODS, l);
                                            var _ = getApp().core.getStorageSync(getApp().const.TOTAL);
                                            _ && (_.total_num = 0, _.total_price = 0, getApp().core.setStorageSync(getApp().const.TOTAL, _));
                                            getApp().core.getStorageSync(getApp().const.CHECK_NUM);
                                            0, getApp().core.setStorageSync(getApp().const.CHECK_NUM, 0);
                                            for (var m = getApp().core.getStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS), p = m.length, s = 0; s < p; s++) m[s].num = 0, 
                                            o.setData({
                                                quick_hot_goods_lists: m
                                            });
                                            getApp().core.setStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS, m);
                                        }
                                    }
                                }
                            }) : 2 == a.payment ? (l = "HUODAO_PAY", n()) : 3 == a.payment && (l = "BALANCE_PAY", 
                            n());
                        }
                        1 == p.code && (getApp().core.hideLoading(), "活力币不足" == p.msg && r.page.data.store.option.step.currency_name ? getApp().core.showToast({
                            title: r.page.data.store.option.step.currency_name + "不足",
                            image: "/images/icon-warning.png"
                        }) : getApp().core.showToast({
                            title: p.msg,
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
            var c = p.order.submit, d = p.order.pay_data, g = "/pages/order/order";
            if ("pt" == i ? (c = p.group.submit, d = p.group.pay_data, g = "/pages/pt/order/order") : "ms" == i ? (c = p.miaosha.submit, 
            d = p.miaosha.pay_data, g = "/pages/miaosha/order/order") : "pond" == i ? (c = p.pond.submit, 
            d = p.order.pay_data, g = "/pages/order/order") : "scratch" == i ? (c = p.scratch.submit, 
            d = p.order.pay_data, g = "/pages/order/order") : "lottery" == i ? (c = p.lottery.submit, 
            d = p.order.pay_data, g = "/pages/order/order") : "step" == i ? (c = p.step.submit, 
            d = p.order.pay_data, g = "/pages/order/order") : "s" == i && (c = p.order.new_submit, 
            d = p.order.pay_data, g = "/pages/order/order"), 3 == a.payment) {
                var u = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + u.money,
                    content: "是否确定使用余额支付",
                    success: function(e) {
                        e.confirm && n();
                    }
                });
            } else n();
        };
    }
};

module.exports = o;