var t, e, o, a = getApp().helper, i = "", r = require("../../wxParse/wxParse.js");

Page({
    data: {
        hide: "hide",
        time_list: {
            day: 0,
            hour: "00",
            minute: "00",
            second: "00"
        },
        p: 1,
        user_index: 0,
        show_animate: !0,
        animationTranslottery: {},
        award_bg: !1
    },
    onLoad: function(t) {
        if (getApp().page.onLoad(this, t), t.user_id && this.buyZero(), "undefined" == typeof my) {
            var o = decodeURIComponent(t.scene);
            if (void 0 !== o) {
                var i = a.scene_decode(o);
                i.gid && (t.id = i.gid);
            }
        } else if (null !== getApp().query) {
            var r = app.query;
            getApp().query = null, t.id = r.gid;
        }
        e = t.id;
    },
    onShow: function() {
        getApp().page.onShow(this), this.getGoods({
            id: e
        });
    },
    getGoods: function(t) {
        var e = this, o = t.id;
        console.log(t), getApp().core.showLoading({
            title: "加载中"
        });
        e = this;
        getApp().request({
            url: getApp().api.lottery.goods,
            data: {
                id: o,
                user_id: t.user_id,
                page: 1
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = t.data.goods.detail, a = t.data.lottery_info.end_time;
                    e.setTimeStart(a), r.wxParse("detail", "html", o, e), e.setData(t.data);
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/lottery/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    catchTouchMove: function(t) {
        return !1;
    },
    onHide: function() {
        getApp().page.onHide(this), clearInterval(o);
    },
    onUnload: function() {
        getApp().page.onUnload(this), clearInterval(o);
    },
    setTimeStart: function(t) {
        var e = this, a = new Date(), i = parseInt(t - a.getTime() / 1e3);
        clearInterval(o), o = setInterval(function() {
            var t = 0, o = 0, a = 0, r = 0;
            i > 0 && (t = Math.floor(i / 86400), o = Math.floor(i / 3600) - 24 * t, a = Math.floor(i / 60) - 24 * t * 60 - 60 * o, 
            r = Math.floor(i) - 24 * t * 60 * 60 - 60 * o * 60 - 60 * a);
            var s = {
                day: t,
                hour: o,
                minute: a,
                second: r
            };
            e.setData({
                time_list: s
            }), i--;
        }, 1e3), i <= 0 && clearInterval(o);
    },
    buyZero: function() {
        var e = this, o = !e.data.award_bg;
        e.setData({
            award_bg: o
        });
        var a = getApp().core.createAnimation({
            duration: 1e3,
            timingFunction: "linear",
            transformOrigin: "50% 50%"
        });
        e.data.award_bg ? a.width("360rpx").height("314rpx").step() : a.scale(0, 0).opacity(0).step(), 
        e.setData({
            animationTranslottery: a.export()
        });
        var i = 0;
        t = setInterval(function() {
            i % 2 == 0 ? a.scale(.9).opacity(1).step() : a.scale(1).opacity(1).step(), e.setData({
                animationTranslottery: a.export()
            }), 500 == ++i && (i = 0);
        }, 500);
    },
    submitTime: function() {
        var e = this, o = getApp().core.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%"
        }), e = this, a = 0;
        t = setInterval(function() {
            a % 2 == 0 ? o.scale(2.3, 2.3).opacity(1).step() : o.scale(2.5, 2.5).opacity(1).step(), 
            e.setData({
                animationTranslottery: o.export()
            }), 500 == ++a && (a = 0);
        }, 500);
    },
    submit: function(e) {
        var o = this, a = e.detail.formId, i = e.currentTarget.dataset.lottery_id;
        getApp().core.navigateTo({
            url: "/lottery/detail/detail?lottery_id=" + i + "&form_id=" + a
        }), clearInterval(t), o.setData({
            award_bg: !1
        });
    },
    play: function(t) {
        var e = t.target.dataset.url;
        this.setData({
            url: e,
            hide: "",
            show: !0
        }), (i = getApp().core.createVideoContext("video")).play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), i.pause();
    },
    onGoodsImageClick: function(t) {
        var e = this, o = [], a = t.currentTarget.dataset.index;
        for (var i in e.data.goods.pic_list) o.push(e.data.goods.pic_list[i].pic_url);
        getApp().core.previewImage({
            urls: o,
            current: o[a]
        });
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    buyNow: function(t) {
        var e = this, o = [], a = {
            goods_id: e.data.goods.id,
            num: 1,
            attr: JSON.parse(e.data.lottery_info.attr)
        };
        o.push(a);
        var i = [];
        i.push({
            mch_id: 0,
            goods_list: o
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(i)
        });
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = getApp().getUser(), e = this.data.lottery_info.id;
        return {
            imageUrl: this.data.goods.pic_list[0].pic_url,
            path: "/lottery/goods/goods?id=" + e + "&user_id=" + t.id
        };
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active"
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: ""
        });
    },
    getGoodsQrcode: function() {
        var t = this;
        if (t.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.lottery.qrcode,
            data: {
                goods_id: t.data.lottery_info.id
            },
            success: function(e) {
                0 == e.code && t.setData({
                    goods_qrcode: e.data.pic_url
                }), 1 == e.code && (t.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function(t) {
        var e = t.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ e ]
        });
    },
    qrcodeClose: function() {
        this.setData({
            qrcode_active: ""
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveQrcode: function() {
        var t = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: t.data.goods_qrcode,
            success: function(t) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(t) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(t) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(e) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: e.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});