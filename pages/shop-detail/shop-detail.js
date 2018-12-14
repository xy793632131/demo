var e = require("../../wxParse/wxParse.js");

Page({
    data: {
        score: [ 1, 2, 3, 4, 5 ]
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var o = this;
        o.setData({
            shop_id: t.shop_id
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_detail,
            method: "GET",
            data: {
                shop_id: t.shop_id
            },
            success: function(t) {
                if (0 == t.code) {
                    o.setData(t.data);
                    var a = t.data.shop.content ? t.data.shop.content : "<span>暂无信息</span>";
                    e.wxParse("detail", "html", a, o);
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/shop/shop"
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    mobile: function() {
        var e = this;
        getApp().core.makePhoneCall({
            phoneNumber: e.data.shop.mobile
        });
    },
    goto: function() {
        var e = this;
        "undefined" != typeof my ? e.location() : getApp().core.getSetting({
            success: function(t) {
                t.authSetting["scope.userLocation"] ? e.location() : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    author: "scope.userLocation",
                    success: function(t) {
                        t.authSetting["scope.userLocation"] && e.location();
                    }
                });
            }
        });
    },
    location: function() {
        var e = this.data.shop;
        getApp().core.openLocation({
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            name: e.name,
            address: e.address
        });
    },
    onShareAppMessage: function(e) {
        getApp().page.onShareAppMessage(this);
        var t = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            path: "/pages/shop-detail/shop-detail?shop_id=" + this.data.shop_id + "&user_id=" + t.id
        };
    }
});