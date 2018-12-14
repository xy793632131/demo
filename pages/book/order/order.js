var e = !1, t = !1, o = 2;

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a), e = !1, t = !1, o = 2, this.loadOrderList(a.status || -1);
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
    },
    onHide: function(e) {
        getApp().page.onHide(this);
    },
    onUnload: function(e) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(e) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(a) {
        getApp().page.onReachBottom(this);
        var r = this;
        t || e || (t = !0, getApp().request({
            url: getApp().api.book.order_list,
            data: {
                status: r.data.status,
                page: o
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = r.data.order_list.concat(t.data.list);
                    r.setData({
                        order_list: a,
                        pay_type_list: t.data.pay_type_list
                    }), 0 == t.data.list.length && (e = !0);
                }
                o++;
            },
            complete: function() {
                t = !1;
            }
        }));
    },
    loadOrderList: function(e) {
        void 0 == e && (e = -1);
        var t = this;
        t.setData({
            status: e
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.order_list,
            data: {
                status: t.data.status
            },
            success: function(e) {
                0 == e.code && t.setData({
                    order_list: e.data.list,
                    pay_type_list: e.data.pay_type_list
                }), t.setData({
                    show_no_data_tip: 0 == t.data.order_list.length
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    orderCancel: function(e) {
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var t = e.currentTarget.dataset.id;
        getApp().request({
            url: getApp().api.book.order_cancel,
            data: {
                id: t
            },
            success: function(e) {
                0 == e.code && getApp().core.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    GoToPay: function(e) {
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.order_pay,
            data: {
                id: e.currentTarget.dataset.id
            },
            complete: function() {
                getApp().core.hideLoading();
            },
            success: function(e) {
                0 == e.code && getApp().core.requestPayment({
                    _res: e,
                    timeStamp: e.data.timeStamp,
                    nonceStr: e.data.nonceStr,
                    package: e.data.package,
                    signType: e.data.signType,
                    paySign: e.data.paySign,
                    success: function(e) {},
                    fail: function(e) {},
                    complete: function(e) {
                        "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? getApp().core.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && getApp().core.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == e.code && getApp().core.showToast({
                    title: e.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToDetails: function(e) {
        getApp().core.navigateTo({
            url: "/pages/book/order/details?oid=" + e.currentTarget.dataset.id
        });
    },
    orderQrcode: function(e) {
        var t = this, o = e.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), t.data.order_list[o].offline_qrcode ? (t.setData({
            hide: 0,
            qrcode: t.data.order_list[o].offline_qrcode
        }), getApp().core.hideLoading()) : getApp().request({
            url: getApp().api.book.get_qrcode,
            data: {
                order_no: t.data.order_list[o].order_no
            },
            success: function(e) {
                0 == e.code ? t.setData({
                    hide: 0,
                    qrcode: e.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function(e) {
        this.setData({
            hide: 1
        });
    },
    applyRefund: function(e) {
        var t = e.target.dataset.id;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.apply_refund,
            data: {
                order_id: t
            },
            success: function(e) {
                0 == e.code ? getApp().core.showModal({
                    title: "提示",
                    content: "申请退款成功",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/book/order/order?status=3"
                        });
                    }
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    comment: function(e) {
        getApp().core.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + e.target.dataset.id,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    }
});