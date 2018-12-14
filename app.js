var e = null;

"undefined" != typeof wx && (e = "wx"), "undefined" != typeof my && (e = "my");

var t = [ {
    name: "helper",
    file: "./utils/helper.js"
}, {
    name: "const",
    file: "./core/const.js"
}, {
    name: "getConfig",
    file: "./core/config.js"
}, {
    name: "page",
    file: "./core/page.js"
}, {
    name: "request",
    file: "./core/request.js"
}, {
    name: "core",
    file: "./core/core.js"
}, {
    name: "api",
    file: "./core/api.js"
}, {
    name: "getUser",
    file: "./core/getUser.js"
}, {
    name: "setUser",
    file: "./core/setUser.js"
}, {
    name: "login",
    file: "./core/login.js"
}, {
    name: "trigger",
    file: "./core/trigger.js"
}, {
    name: "uploader",
    file: "./utils/uploader.js"
}, {
    name: "orderPay",
    file: "./core/order-pay.js"
} ], s = {
    _version: "2.8.9",
    platform: e,
    query: null,
    onLaunch: function() {
        this.getStoreData();
    },
    onShow: function(e) {
        e.scene && (this.onShowData = e), e && e.query && (this.query = e.query), this.getUser() && this.trigger.run(this.trigger.events.login);
    },
    is_login: !1,
    login_complete: !1,
    is_form_id_request: !0
};

for (var o in t) s[t[o].name] = require("" + t[o].file);

var n = s.api.index.substr(0, s.api.index.indexOf("/index.php"));

s.webRoot = n, s.getauth = function(e) {
    var t = this;
    if ("my" == t.platform) {
        if (e.success) {
            var s = {
                authSetting: {}
            };
            s.authSetting[e.author] = !0, e.success(s);
        }
    } else t.core.getSetting({
        success: function(s) {
            console.log(s), void 0 === s.authSetting[e.author] ? t.core.authorize({
                scope: e.author,
                success: function(t) {
                    e.success && e.success(t);
                }
            }) : 0 == s.authSetting[e.author] ? t.core.showModal({
                title: "是否打开设置页面重新授权",
                content: e.content,
                confirmText: "去设置",
                success: function(s) {
                    s.confirm ? t.core.openSetting({
                        success: function(t) {
                            e.success && e.success(t);
                        },
                        fail: function(t) {
                            e.fail && e.fail(t);
                        },
                        complete: function(t) {
                            e.complete && e.complete(t);
                        }
                    }) : e.cancel && t.getauth(e);
                }
            }) : e.success && e.success(s);
        }
    });
}, s.getStoreData = function() {
    var e = this, t = this.api, s = this.core;
    e.request({
        url: t.default.store,
        success: function(t) {
            0 == t.code && (s.setStorageSync(e.const.STORE, t.data.store), s.setStorageSync(e.const.STORE_NAME, t.data.store_name), 
            s.setStorageSync(e.const.SHOW_CUSTOMER_SERVICE, t.data.show_customer_service), s.setStorageSync(e.const.CONTACT_TEL, t.data.contact_tel), 
            s.setStorageSync(e.const.SHARE_SETTING, t.data.share_setting), e.permission_list = t.data.permission_list, 
            s.setStorageSync(e.const.WXAPP_IMG, t.data.wxapp_img), s.setStorageSync(e.const.WX_BAR_TITLE, t.data.wx_bar_title), 
            s.setStorageSync(e.const.ALIPAY_MP_CONFIG, t.data.alipay_mp_config), s.setStorageSync(e.const.STORE_CONFIG, t.data), 
            setTimeout(function(s) {
                e.config = t.data, e.configReadyCall && e.configReadyCall(t.data);
            }, 1e3));
        },
        complete: function() {}
    });
};

App(s);