Page({
    data: {
        markers: []
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), t.mch_id && (this.setData({
            mch_id: t.mch_id
        }), this.getShopData());
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    getShopData: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.mch.shop,
            data: {
                mch_id: t.data.mch_id,
                tab: 0,
                cat_id: 0
            },
            success: function(e) {
                if (0 == e.code) {
                    var o = e.data.shop, a = [ {
                        iconPath: "/mch/images/img-map.png",
                        id: 0,
                        width: 20,
                        height: 43,
                        longitude: o.longitude,
                        latitude: o.latitude
                    } ];
                    t.setData({
                        markers: a,
                        shop: e.data.shop
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading(), t.setData({
                    loading: !1
                });
            }
        });
    },
    callPhone: function(t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    map_power: function() {
        var t = this;
        getApp().getConfig(function(e) {
            var o = t.data.shop;
            void 0 !== o ? t.map_goto(o) : getApp().core.getSetting({
                success: function(e) {
                    e.authSetting["scope.userLocation"] ? t.map_goto(o) : getApp().getauth({
                        content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                        cancel: !1,
                        author: "scope.userLocation",
                        success: function(e) {
                            e.authSetting["scope.userLocation"] && t.map_goto(o);
                        }
                    });
                }
            });
        });
    },
    map_goto: function(t) {
        getApp().core.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address
        });
    }
});