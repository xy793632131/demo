module.exports = {
    init: function(t) {
        var o = this;
        o.currentPage = t, o.setNavi(), void 0 === t.cutover && (t.cutover = function(t) {
            o.cutover(t);
        }), void 0 === t.to_dial && (t.to_dial = function(t) {
            o.to_dial(t);
        }), void 0 === t.map_goto && (t.map_goto = function(t) {
            o.map_goto(t);
        }), void 0 === t.map_power && (t.map_power = function(t) {
            o.map_power(t);
        });
    },
    setNavi: function() {
        var t = this.currentPage;
        -1 != [ "pages/index/index", "pages/book/details/details", "pages/pt/details/details", "pages/goods/goods" ].indexOf(this.getCurrentPageUrl()) && t.setData({
            home_icon: !0
        }), getApp().getConfig(function(o) {
            var e = o.store.quick_navigation;
            e.home_img || (e.home_img = "/images/quick-home.png"), t.setData({
                setnavi: e
            });
        });
    },
    getCurrentPageUrl: function() {
        var t = getCurrentPages();
        return t[t.length - 1].route;
    },
    to_dial: function() {
        getApp().getConfig(function(t) {
            var o = t.store.contact_tel;
            console.log(o), getApp().core.makePhoneCall({
                phoneNumber: o
            });
        });
    },
    map_power: function() {
        var t = this.currentPage;
        getApp().getConfig(function(o) {
            var e = o.store.option.quick_map;
            void 0 !== e ? t.map_goto(e) : getApp().core.getSetting({
                success: function(o) {
                    o.authSetting["scope.userLocation"] ? t.map_goto(e) : getApp().getauth({
                        content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                        cancel: !1,
                        author: "scope.userLocation",
                        success: function(o) {
                            o.authSetting["scope.userLocation"] && t.map_goto(e);
                        }
                    });
                }
            });
        });
    },
    map_goto: function(t) {
        this.currentPage;
        var o = t.lal.split(",");
        getApp().core.openLocation({
            latitude: parseFloat(o[0]),
            longitude: parseFloat(o[1]),
            address: t.address
        });
    },
    cutover: function() {
        var t = this.currentPage;
        t.setData({
            quick_icon: !t.data.quick_icon
        });
        var o = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), e = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), i = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), a = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), n = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), p = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        });
        getApp().getConfig(function(c) {
            var r = t.data.store, s = -55;
            t.data.quick_icon ? (r.option && r.option.wxapp && r.option.wxapp.pic_url && (n.translateY(s).opacity(1).step(), 
            s -= 55), r.show_customer_service && 1 == r.show_customer_service && r.service && (a.translateY(s).opacity(1).step(), 
            s -= 55), r.option && r.option.web_service && (i.translateY(s).opacity(1).step(), 
            s -= 55), 1 == r.dial && r.dial_pic && (e.translateY(s).opacity(1).step(), s -= 55), 
            r.option && 1 == r.option.quick_map.status && (p.translateY(s).opacity(1).step(), 
            s -= 55), o.translateY(s).opacity(1).step()) : (o.opacity(0).step(), i.opacity(0).step(), 
            e.opacity(0).step(), a.opacity(0).step(), n.opacity(0).step(), p.opacity(0).step()), 
            t.setData({
                animationPlus: o.export(),
                animationcollect: i.export(),
                animationPic: e.export(),
                animationTranspond: a.export(),
                animationInput: n.export(),
                animationMapPlus: p.export()
            });
        });
    }
};