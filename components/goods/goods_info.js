module.exports = {
    currentPage: null,
    init: function(o) {
        var e = this;
        e.currentPage = o, void 0 === o.showShareModal && (o.showShareModal = function(o) {
            e.showShareModal(o);
        }), void 0 === o.shareModalClose && (o.shareModalClose = function(o) {
            e.shareModalClose(o);
        }), void 0 === o.getGoodsQrcode && (o.getGoodsQrcode = function(o) {
            e.getGoodsQrcode(o);
        }), void 0 === o.goodsQrcodeClose && (o.goodsQrcodeClose = function(o) {
            e.goodsQrcodeClose(o);
        }), void 0 === o.saveGoodsQrcode && (o.saveGoodsQrcode = function(o) {
            e.saveGoodsQrcode(o);
        }), void 0 === o.goodsQrcodeClick && (o.goodsQrcodeClick = function(o) {
            e.goodsQrcodeClick(o);
        });
    },
    showShareModal: function() {
        this.currentPage.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.currentPage.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var o = this.currentPage;
        if (o.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), o.data.goods_qrcode) return !0;
        var e = "", t = o.data.pageType;
        if ("PINTUAN" === t) e = getApp().api.group.goods_qrcode; else if ("BOOK" === t) e = getApp().api.book.goods_qrcode; else if ("STORE" === t) e = getApp().api.default.goods_qrcode; else {
            if ("MIAOSHA" !== t) return void getApp().core.showModal({
                title: "提示",
                content: "pageType未定义或组件js未进行判断"
            });
            e = getApp().api.miaosha.goods_qrcode;
        }
        getApp().request({
            url: e,
            data: {
                goods_id: o.data.id
            },
            success: function(e) {
                0 == e.code && o.setData({
                    goods_qrcode: e.data.pic_url
                }), 1 == e.code && (o.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.currentPage.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
        var o = this.currentPage;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: o.data.goods_qrcode,
            success: function(o) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: o.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(o) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: o.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(o) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(e) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: e.errMsg + ";" + o.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(o) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function(o) {
        var e = o.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ e ]
        });
    }
};