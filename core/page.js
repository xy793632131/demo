module.exports = {
    currentPage: null,
    currentPageOptions: {},
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list", "pages/order/order" ],
    onLoad: function(e, t) {
        this.currentPage = e, this.currentPageOptions = t;
        var o = this;
        if (this.setUserInfo(), this.setWxappImg(), this.setStore(), this.setParentId(t), 
        this.getNavigationBarColor(), this.setDeviceInfo(), this.setPageClasses(), this.setPageNavbar(), 
        this.setBarTitle(), "function" == typeof e.onSelfLoad && e.onSelfLoad(t), o._setFormIdSubmit(), 
        "undefined" != typeof my && "pages/login/login" != e.route && t && (e.options || (e.options = t), 
        getApp().core.setStorageSync("last_page_options", t)), "lottery/goods/goods" == e.route && t) {
            if (t.user_id) var n = t.user_id, a = t.id; else if (t.scene && isNaN(t.scene)) {
                var i = decodeURIComponent(t.scene);
                if (i && (i = getApp().helper.scene_decode(i)) && i.uid) var n = i.uid, a = i.gid;
            }
            getApp().request({
                data: {
                    user_id: n,
                    lottery_id: a
                },
                url: getApp().api.lottery.clerk,
                success: function(e) {
                    e.code;
                }
            });
        }
        e.navigatorClick = function(t) {
            o.navigatorClick(t, e);
        }, e.setData({
            __platform: getApp().platform
        }), void 0 === e.showToast && (e.showToast = function(e) {
            o.showToast(e);
        }), getApp().shareSendCoupon = function(e) {
            o.shareSendCoupon(e);
        }, void 0 === e.setTimeList && (e.setTimeList = function(e) {
            return o.setTimeList(e);
        }), void 0 === e.showLoading && (e.showLoading = function(e) {
            o.showLoading(e);
        }), void 0 === e.hideLoading && (e.hideLoading = function(e) {
            o.hideLoading(e);
        }), void 0 === e.modalConfirm && (e.modalConfirm = function(e) {
            o.modalConfirm(e);
        }), void 0 === e.modalClose && (e.modalClose = function(e) {
            o.modalClose(e);
        }), void 0 === e.modalShow && (e.modalShow = function(e) {
            o.modalShow(e);
        }), void 0 === e.myLogin && (e.myLogin = function() {
            o.myLogin();
        }), void 0 === e.getUserInfo && (e.getUserInfo = function(e) {
            o.getUserInfo(e);
        }), void 0 === e.getPhoneNumber && (e.getPhoneNumber = function(e) {
            o.getPhoneNumber(e);
        }), void 0 === e.bindParent && (e.bindParent = function(e) {
            o.bindParent(e);
        }), void 0 === e.closeCouponBox && (e.closeCouponBox = function(e) {
            o.closeCouponBox(e);
        }), void 0 === e.relevanceSuccess && (e.relevanceSuccess = function(e) {
            o.relevanceSuccess(e);
        }), void 0 === e.relevanceError && (e.relevanceError = function(e) {
            o.relevanceError(e);
        });
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().orderPay.init(e, getApp()), require("../components/quick-navigation/quick-navigation.js").init(this.currentPage);
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    onPullDownRefresh: function(e) {
        this.currentPage = e;
    },
    onReachBottom: function(e) {
        this.currentPage = e;
    },
    onShareAppMessage: function(e) {
        this.currentPage = e, setTimeout(function() {
            getApp().shareSendCoupon(e);
        }, 1e3);
    },
    imageClick: function(e) {
        console.log("image click", e);
    },
    textClick: function(e) {
        console.log("text click", e);
    },
    tap1: function(e) {
        console.log("tap1", e);
    },
    tap2: function(e) {
        console.log("tap2", e);
    },
    formSubmit_collect: function(e) {
        e.detail.formId;
        console.log("formSubmit_collect--\x3e", e);
    },
    setUserInfo: function() {
        var e = this.currentPage, t = getApp().getUser();
        t && e.setData({
            __user_info: t
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            t.setData({
                __wxapp_img: e.wxapp_img,
                store: e.store
            });
        });
    },
    setStore: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            e.store && t.setData({
                store: e.store,
                __is_comment: e.store ? e.store.is_comment : 1,
                __is_sales: e.store ? e.store.is_sales : 1,
                __is_member_price: e.store ? e.store.is_member_price : 1,
                __is_share_price: e.store ? e.store.is_share_price : 1,
                __alipay_mp_config: e.alipay_mp_config
            });
        });
    },
    setParentId: function(e) {
        var t = this.currentPage, o = this;
        if ("/pages/index/index" == t.route && o.setOfficalAccount(), e) {
            var n = 0;
            if (e.user_id) n = e.user_id; else if (e.scene) {
                if (isNaN(e.scene)) {
                    var a = decodeURIComponent(e.scene);
                    a && (a = getApp().helper.scene_decode(a)) && a.uid && (n = a.uid);
                } else -1 == t.route.indexOf("clerk") && (n = e.scene);
                o.setOfficalAccount();
            } else if (null !== getApp().query) {
                var i = getApp().query;
                n = i.uid;
            }
            n && void 0 !== n && (getApp().core.setStorageSync(getApp().const.PARENT_ID, n), 
            getApp().trigger.remove(getApp().trigger.events.login, "TRY_TO_BIND_PARENT"), getApp().trigger.add(getApp().trigger.events.login, "TRY_TO_BIND_PARENT", function() {
                t.bindParent({
                    parent_id: n,
                    condition: 0
                });
            }));
        }
    },
    showToast: function(e) {
        var t = this.currentPage, o = e.duration || 2500, n = e.title || "", a = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: n
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof a && a();
        }, o);
    },
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], o = getApp().core.getSystemInfoSync();
        if (o.model) {
            o.model.indexOf("iPhone X") >= 0 && (o.model = "iPhone X");
            for (var n in t) t[n].model == o.model && e.setData({
                __device: t[n].id
            });
        }
    },
    setPageNavbar: function() {
        function e(e) {
            var t = !1;
            for (var n in e.navs) {
                var a = e.navs[n].url, i = o.route || o.__route__ || null;
                if (e.navs[n].params) {
                    a = e.navs[n].new_url;
                    for (var r in o.options) -1 == i.indexOf("?") ? i += "?" : i += "&", i += r + "=" + o.options[r];
                }
                console.log(i), a === "/" + i ? (e.navs[n].active = !0, t = !0) : e.navs[n].active = !1;
            }
            t && o.setData({
                _navbar: e
            });
        }
        var t = this, o = this.currentPage, n = getApp().core.getStorageSync("_navbar");
        n && e(n);
        var a = !1;
        for (var i in t.navbarPages) if (o.route == t.navbarPages[i]) {
            a = !0;
            break;
        }
        a && getApp().request({
            url: getApp().api.default.navbar,
            success: function(o) {
                0 == o.code && (e(o.data), getApp().core.setStorageSync("_navbar", o.data), t.setPageClasses());
            }
        });
    },
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && e.data._navbar.navs.length > 0 && (t += " show_navbar"), 
        t && e.setData({
            __page_classes: t
        });
    },
    showLoading: function(e) {
        var t = t;
        t.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setTimeList: function(e) {
        function t(e) {
            return e <= 0 && (e = 0), e < 10 ? "0" + e : e;
        }
        var o = "00", n = "00", a = "00", i = 0;
        return e >= 86400 && (i = parseInt(e / 86400), e %= 86400), e < 86400 && (a = parseInt(e / 3600), 
        e %= 3600), e < 3600 && (n = parseInt(e / 60), e %= 60), e < 60 && (o = e), {
            d: i,
            h: t(a),
            m: t(n),
            s: t(o)
        };
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, o = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var n in o) o[n].url === t && getApp().core.setNavigationBarTitle({
            title: o[n].title
        });
    },
    getNavigationBarColor: function() {
        var e = getApp(), t = this;
        e.request({
            url: e.api.default.navigation_bar_color,
            success: function(o) {
                0 == o.code && (e.core.setStorageSync(getApp().const.NAVIGATION_BAR_COLOR, o.data), 
                t.setNavigationBarColor(), e.navigateBarColorCall && "function" == typeof e.navigateBarColorCall && e.navigateBarColorCall(o));
            }
        });
    },
    setNavigationBarColor: function() {
        var e = this.currentPage, t = getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR);
        t && (getApp().core.setNavigationBarColor(t), e.setData({
            _navigation_bar_color: t
        })), getApp().navigateBarColorCall = function(t) {
            getApp().core.setNavigationBarColor(t.data), e.setData({
                _navigation_bar_color: t.data
            });
        };
    },
    navigatorClick: function(e, t) {
        var o = e.currentTarget.dataset.open_type;
        if ("redirect" == o) return !0;
        if ("wxapp" != o) {
            if ("tel" == o) {
                var n = e.currentTarget.dataset.tel;
                getApp().core.makePhoneCall({
                    phoneNumber: n
                });
            }
            return !1;
        }
    },
    shareSendCoupon: function(e) {
        var t = getApp();
        t.core.showLoading({
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(o) {
            var n = o.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), n && t.core.navigateTo({
                url: n
            });
        }), t.request({
            url: t.api.coupon.share_send,
            success: function(t) {
                0 == t.code && e.setData({
                    get_coupon_list: t.data.list
                });
            },
            complete: function() {
                t.core.hideLoading();
            }
        });
    },
    bindParent: function(e) {
        var t = getApp();
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var o = t.getUser();
            t.core.getStorageSync(t.const.SHARE_SETTING).level > 0 && 0 != e.parent_id && t.request({
                url: t.api.share.bind_parent,
                data: {
                    parent_id: e.parent_id,
                    condition: e.condition
                },
                success: function(e) {
                    0 == e.code && (o.parent = e.data, t.setUser(o));
                }
            });
        }
    },
    _setFormIdSubmit: function(e) {
        var t = this.currentPage;
        t._formIdSubmit || (t._formIdSubmit = function(e) {
            var o = e.currentTarget.dataset, n = e.detail.formId, a = o.bind || null, i = o.type || null, r = o.url || null, s = getApp().core.getStorageSync(getApp().const.FORM_ID_LIST);
            s && s.length || (s = []);
            var c = [];
            for (var p in s) c.push(s[p].form_id);
            switch ("the formId is a mock one" === n || getApp().helper.inArray(n, c) || (s.push({
                time: getApp().helper.time(),
                form_id: n
            }), getApp().core.setStorageSync(getApp().const.FORM_ID_LIST, s)), t[a] && "function" == typeof t[a] && t[a](e), 
            i) {
              case "navigate":
                r && getApp().core.navigateTo({
                    url: r
                });
                break;

              case "redirect":
                r && getApp().core.redirectTo({
                    url: r
                });
                break;

              case "switchTab":
                r && getApp().core.switchTab({
                    url: r
                });
                break;

              case "reLaunch":
                r && getApp().core.reLaunch({
                    url: r
                });
                break;

              case "navigateBack":
                r && getApp().core.navigateBack({
                    url: r
                });
            }
        });
    },
    modalClose: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了关闭按钮");
    },
    modalConfirm: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了确定按钮");
    },
    modalShow: function(e) {
        this.currentPage.setData({
            modal_show: !0
        }), console.log("点击会弹出弹框");
    },
    getUserInfo: function(e) {
        var t = this;
        "getUserInfo:ok" == e.detail.errMsg && getApp().core.login({
            success: function(o) {
                var n = o.code;
                t.unionLogin({
                    code: n,
                    user_info: e.detail.rawData,
                    encrypted_data: e.detail.encryptedData,
                    iv: e.detail.iv,
                    signature: e.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        var e = this;
        "my" === getApp().platform && (console.log(getApp().login_complete), getApp().login_complete || (getApp().login_complete = !0, 
        my.getAuthCode({
            scopes: "auth_user",
            success: function(t) {
                e.unionLogin({
                    code: t.authCode
                });
            },
            fail: function(e) {
                getApp().login_complete = !1, getApp().core.redirectTo({
                    url: "/pages/index/index"
                });
            }
        })));
    },
    unionLogin: function(e) {
        var t = this.currentPage, o = this;
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    t.setData({
                        __user_info: e.data
                    }), getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token), 
                    getApp().trigger.run(getApp().trigger.events.login);
                    var n = getApp().core.getStorageSync(getApp().const.STORE);
                    e.data.binding || !n.option.phone_auth || n.option.phone_auth && 0 == n.option.phone_auth ? o.loadRoute() : ("undefined" == typeof wx && o.loadRoute(), 
                    o.setPhone()), o.setUserInfoShowFalse();
                } else getApp().login_complete = !1, getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    getPhoneNumber: function(e) {
        var t = this.currentPage, o = this;
        "getPhoneNumber:fail user deny" == e.detail.errMsg ? getApp().core.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权"
        }) : (getApp().core.showLoading({
            title: "授权中"
        }), getApp().core.login({
            success: function(n) {
                if (n.code) {
                    var a = n.code;
                    getApp().request({
                        url: getApp().api.user.user_binding,
                        method: "POST",
                        data: {
                            iv: e.detail.iv,
                            encryptedData: e.detail.encryptedData,
                            code: a
                        },
                        success: function(e) {
                            if (0 == e.code) {
                                var n = t.data.__user_info;
                                n.binding = e.data.dataObj, getApp().setUser(n), t.setData({
                                    PhoneNumber: e.data.dataObj,
                                    __user_info: n,
                                    binding: !0,
                                    binding_num: e.data.dataObj
                                }), o.loadRoute();
                            } else getApp().core.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function(e) {
                            getApp().core.hideLoading();
                        }
                    });
                } else getApp().core.showToast({
                    title: "获取用户登录态失败！" + n.errMsg
                });
            }
        }));
    },
    setUserInfoShow: function() {
        var e = this.currentPage;
        "wx" == getApp().platform ? e.setData({
            user_info_show: !0
        }) : this.myLogin();
    },
    setPhone: function() {
        var e = this.currentPage;
        "undefined" == typeof my && e.setData({
            user_bind_show: !0
        });
    },
    setUserInfoShowFalse: function() {
        this.currentPage.setData({
            user_info_show: !1
        });
    },
    closeCouponBox: function(e) {
        this.currentPage.setData({
            get_coupon_list: ""
        });
    },
    relevanceSuccess: function(e) {
        console.log(e);
    },
    relevanceError: function(e) {
        console.log(e);
    },
    setOfficalAccount: function(e) {
        this.currentPage.setData({
            __is_offical_account: !0
        });
    },
    loadRoute: function() {
        var e = this.currentPage, t = this;
        "pages/index/index" == e.route || getApp().core.redirectTo({
            url: "/" + e.route + "?" + getApp().helper.objectToUrlParams(e.options)
        }), t.setUserInfoShowFalse();
    }
};