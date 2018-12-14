var t = require("../../../utils/helper.js"), e = require("../../../wxParse/wxParse.js"), a = require("../../../components/goods/specifications_model.js"), i = require("../../../components/goods/goods_banner.js"), r = require("../../../components/goods/goods_info.js"), o = require("../../../components/goods/goods_buy.js");

Page({
    data: {
        pageType: "PINTUAN",
        hide: "hide",
        form: {
            number: 1,
            pt_detail: !1
        }
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var a = e.user_id, i = decodeURIComponent(e.scene);
        if (void 0 !== a) a; else if (void 0 !== i) {
            var r = t.scene_decode(i);
            r.uid && r.gid ? (r.uid, e.gid = r.gid) : i;
        } else if ("undefined" != typeof my && null !== getApp().query) {
            var o = getApp().query;
            getApp().query = null, e.id = o.gid;
        }
        this.setData({
            id: e.gid,
            oid: e.oid ? e.oid : 0,
            group_checked: e.group_id ? e.group_id : 0
        }), this.getGoodsInfo(e);
        var s = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: s
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this), a.init(this), i.init(this), r.init(this), o.init(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.PT_GROUP_DETAIL);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this, e = getApp().core.getStorageSync(getApp().const.USER_INFO), a = "/pages/pt/details/details?gid=" + t.data.goods.id + "&user_id=" + e.id;
        return {
            title: t.data.goods.name,
            path: a,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var a = t.gid, i = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.group.details,
            method: "get",
            data: {
                gid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    i.countDownRun(t.data.info.limit_time_ms);
                    var a = t.data.info.detail;
                    e.wxParse("detail", "html", a, i), getApp().core.setNavigationBarTitle({
                        title: t.data.info.name
                    }), getApp().core.hideNavigationBarLoading();
                    var r = (t.data.info.original_price - t.data.info.price).toFixed(2), o = t.data.info;
                    o.service_list = t.data.info.service, i.setData({
                        group_checked: i.data.group_checked ? i.data.group_checked : 0,
                        goods: o,
                        attr_group_list: t.data.attr_group_list,
                        attr_group_num: t.data.attr_group_num,
                        limit_time: t.data.limit_time_res,
                        group_list: t.data.groupList,
                        group_num: t.data.groupList.length,
                        group_rule_id: t.data.groupRuleId,
                        comment: t.data.comment,
                        comment_num: t.data.commentNum,
                        reduce_price: r < 0 ? 0 : r
                    }), i.countDown(), i.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    more: function() {
        this.setData({
            pt_detail: !0
        });
    },
    end_more: function() {
        this.setData({
            pt_detail: !1
        });
    },
    previewImage: function(t) {
        var e = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [ e ]
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (!t.data.goods || "0" === t.data.goods.use_attr) for (var e in t.data.attr_group_list) for (var a in t.data.attr_group_list[e].attr_list) 0 == e && 0 == a && (t.data.attr_group_list[e].attr_list[a].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDownRun: function(t) {
        var e = this;
        setInterval(function() {
            var a = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]) - new Date(), i = parseInt(a / 1e3 / 60 / 60 / 24, 10), r = parseInt(a / 1e3 / 60 / 60 % 24, 10), o = parseInt(a / 1e3 / 60 % 60, 10), s = parseInt(a / 1e3 % 60, 10);
            i = e.checkTime(i), r = e.checkTime(r), o = e.checkTime(o), s = e.checkTime(s), 
            e.setData({
                limit_time: {
                    days: i < 0 ? "00" : i,
                    hours: r < 0 ? "00" : r,
                    mins: o < 0 ? "00" : o,
                    secs: s < 0 ? "00" : s
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return t < 0 ? "00" : (t < 10 && (t = "0" + t), t);
    },
    goToGroup: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    goToComment: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/comment/comment?id=" + this.data.goods.id
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && getApp().core.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    buyNow: function() {
        this.submit("GROUP_BUY", this.data.group_checked);
    },
    onlyBuy: function() {
        this.submit("ONLY_BUY", 0);
    },
    submit: function(t, e) {
        var a = this, i = "GROUP_BUY" == t;
        if (!a.data.show_attr_picker || i != a.data.groupNum) return a.setData({
            show_attr_picker: !0,
            groupNum: i
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var r = a.data.attr_group_list, o = [];
        for (var s in r) {
            var n = !1;
            for (var d in r[s].attr_list) if (r[s].attr_list[d].checked) {
                n = {
                    attr_id: r[s].attr_list[d].attr_id,
                    attr_name: r[s].attr_list[d].attr_name
                };
                break;
            }
            if (!n) return getApp().core.showToast({
                title: "请选择" + r[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: r[s].attr_group_id,
                attr_group_name: r[s].attr_group_name,
                attr_id: n.attr_id,
                attr_name: n.attr_name
            });
        }
        a.setData({
            show_attr_picker: !1
        });
        var p = 0;
        a.data.oid && (t = "GROUP_BUY_C", p = a.data.oid), getApp().core.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.goods.id,
                attr: o,
                num: a.data.form.number,
                type: t,
                deliver_type: a.data.goods.type,
                group_id: e,
                parent_id: p
            })
        });
    },
    countDown: function() {
        var t = this;
        setInterval(function() {
            var e = t.data.group_list;
            for (var a in e) {
                var i = new Date(e[a].limit_time_ms[0], e[a].limit_time_ms[1] - 1, e[a].limit_time_ms[2], e[a].limit_time_ms[3], e[a].limit_time_ms[4], e[a].limit_time_ms[5]) - new Date(), r = parseInt(i / 1e3 / 60 / 60 / 24, 10), o = parseInt(i / 1e3 / 60 / 60 % 24, 10), s = parseInt(i / 1e3 / 60 % 60, 10), n = parseInt(i / 1e3 % 60, 10);
                r = t.checkTime(r), o = t.checkTime(o), s = t.checkTime(s), n = t.checkTime(n), 
                e[a].limit_time = {
                    days: r,
                    hours: o > 0 ? o : "00",
                    mins: s > 0 ? s : "00",
                    secs: n > 0 ? n : "00"
                }, t.setData({
                    group_list: e
                });
            }
        }, 1e3);
    },
    bigToImage: function(t) {
        var e = this.data.comment[t.target.dataset.index].pic_list;
        getApp().core.previewImage({
            current: t.target.dataset.url,
            urls: e
        });
    },
    groupCheck: function() {
        var t = this, e = t.data.attr_group_num, a = t.data.attr_group_num.attr_list;
        for (var i in a) a[i].checked = !1;
        e.attr_list = a;
        t.data.goods;
        t.setData({
            group_checked: 0,
            attr_group_num: e
        });
        var r = t.data.attr_group_list, o = [], s = !0;
        for (var i in r) {
            var n = !1;
            for (var d in r[i].attr_list) if (r[i].attr_list[d].checked) {
                o.push(r[i].attr_list[d].attr_id), n = !0;
                break;
            }
            if (!n) {
                s = !1;
                break;
            }
        }
        s && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: t.data.goods.id,
                group_id: t.data.group_checked,
                attr_list: JSON.stringify(o)
            },
            success: function(e) {
                if (getApp().core.hideLoading(), 0 == e.code) {
                    var a = t.data.goods;
                    a.price = e.data.price, a.num = e.data.num, a.attr_pic = e.data.pic, a.single_price = e.data.single_price ? e.data.single_price : 0, 
                    a.group_price = e.data.price, a.is_member_price = e.data.is_member_price, t.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    attrNumClick: function(t) {
        var e = this, a = t.target.dataset.id, i = e.data.attr_group_num, r = i.attr_list;
        for (var o in r) r[o].id == a ? r[o].checked = !0 : r[o].checked = !1;
        i.attr_list = r, e.setData({
            attr_group_num: i,
            group_checked: a
        });
        var s = e.data.attr_group_list, n = [], d = !0;
        for (var o in s) {
            var p = !1;
            for (var g in s[o].attr_list) if (s[o].attr_list[g].checked) {
                n.push(s[o].attr_list[g].attr_id), p = !0;
                break;
            }
            if (!p) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.single_price = t.data.single_price ? t.data.single_price : 0, 
                    a.group_price = t.data.price, a.is_member_price = t.data.is_member_price, e.setData({
                        goods: a
                    });
                }
            }
        }));
    }
});