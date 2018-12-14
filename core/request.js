module.exports = function(e) {
    e.data || (e.data = {});
    var t = this.core, a = this.core.getStorageSync(this.const.ACCESS_TOKEN), o = this.core.getStorageSync(this.const.FORM_ID_LIST);
    a && (e.data.access_token = a), e.data._version = this._version, e.data._platform = this.platform, 
    !this.is_login && this.page.currentPage && (this.is_login = !0, this.login({}));
    var s = this;
    o && o.length >= 1 && s.is_form_id_request && (s.is_form_id_request = !1, s.request({
        url: s.api.default.form_id,
        method: "POST",
        data: {
            formIdList: JSON.stringify(o)
        },
        success: function(e) {
            s.core.removeStorageSync(s.const.FORM_ID_LIST);
        },
        complete: function() {
            s.is_form_id_request = !0;
        }
    })), t.request({
        url: e.url,
        header: e.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: e.data || {},
        method: e.method || "GET",
        dataType: e.dataType || "json",
        success: function(a) {
            -1 == a.data.code ? (s.core.hideLoading(), s.page.setUserInfoShow(), s.is_login = !1) : -2 == a.data.code ? t.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : e.success && e.success(a.data);
        },
        fail: function(a) {
            if (console.warn("--- request fail >>>"), console.warn("--- " + e.url + " ---"), 
            console.warn(a), console.warn("<<< request fail ---"), e && e.noHandlerFail) "function" == typeof e.fail && e.fail(a.data); else {
                var o = getApp();
                o.is_on_launch ? (o.is_on_launch = !1, t.showModal({
                    title: "网络请求出错",
                    content: a.errMsg || "",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && e.fail && e.fail(t);
                    }
                })) : (t.showToast({
                    title: a.errMsg,
                    image: "/images/icon-warning.png"
                }), e.fail && e.fail(a));
            }
        },
        complete: function(a) {
            if (200 != a.statusCode && a.data && a.data.code && 500 == a.data.code) {
                var o = a.data.data.message;
                t.showModal({
                    title: "系统错误",
                    content: o + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(o) {
                        o.confirm && t.setClipboardData({
                            data: JSON.stringify({
                                data: a.data.data,
                                object: e
                            })
                        });
                    }
                });
            }
            e.complete && e.complete(a);
        }
    });
};