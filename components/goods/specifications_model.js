module.exports = {
    currentPage: null,
    init: function(t) {
        var a = this;
        a.currentPage = t, void 0 === t.previewImage && (t.previewImage = function(t) {
            a.previewImage(t);
        }), void 0 === t.showAttrPicker && (t.showAttrPicker = function(t) {
            a.showAttrPicker(t);
        }), void 0 === t.hideAttrPicker && (t.hideAttrPicker = function(t) {
            a.hideAttrPicker(t);
        }), void 0 === t.storeAttrClick && (t.storeAttrClick = function(t) {
            a.storeAttrClick(t);
        }), void 0 === t.numberAdd && (t.numberAdd = function(t) {
            a.numberAdd(t);
        }), void 0 === t.numberSub && (t.numberSub = function(t) {
            a.numberSub(t);
        }), void 0 === t.numberBlur && (t.numberBlur = function(t) {
            a.numberBlur(t);
        }), void 0 === t.selectDefaultAttr && (t.selectDefaultAttr = function(t) {
            a.selectDefaultAttr(t);
        });
    },
    previewImage: function(t) {
        var a = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [ a ]
        });
    },
    hideAttrPicker: function() {
        this.currentPage.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.currentPage.setData({
            show_attr_picker: !0
        });
    },
    storeAttrClick: function(t) {
        var a = this.currentPage, r = this, e = t.target.dataset.groupId, i = parseInt(t.target.dataset.id), o = JSON.parse(JSON.stringify(a.data.attr_group_list)), s = [];
        "string" == typeof (v = a.data.goods.attr) && (v = JSON.parse(v));
        for (var n in o) if (o[n].attr_group_id == e) for (var d in o[n].attr_list) {
            var p = o[n].attr_list[d];
            parseInt(p.attr_id) === i && p.checked ? p.checked = !1 : p.checked = parseInt(p.attr_id) === i;
        }
        for (var n in o) for (var d in o[n].attr_list) o[n].attr_list[d].checked && s.push(o[n].attr_list[d].attr_id);
        for (var n in o) for (var d in o[n].attr_list) if ((p = o[n].attr_list[d]).attr_id === i && !0 === p.attr_num_0) return;
        var u = [];
        for (var n in v) {
            var c = [], _ = 0;
            for (var d in v[n].attr_list) getApp().helper.inArray(v[n].attr_list[d].attr_id, s) || (_ += 1), 
            c.push(v[n].attr_list[d].attr_id);
            0 === v[n].num && _ <= 1 && u.push(c);
        }
        var g = s.length, l = [];
        if (o.length - g <= 1) for (var n in s) for (var d in u) if (getApp().helper.inArray(s[n], u[d])) for (var f in u[d]) u[d][f] !== s[n] && l.push(u[d][f]);
        for (var n in o) for (var d in o[n].attr_list) {
            var m = o[n].attr_list[d];
            getApp().helper.inArray(m.attr_id, l) && !getApp().helper.inArray(m.attr_id, s) ? m.attr_num_0 = !0 : m.attr_num_0 = !1;
        }
        a.setData({
            attr_group_list: o
        });
        var h = [], A = !0;
        for (var n in o) {
            k = !1;
            for (var d in o[n].attr_list) if (o[n].attr_list[d].checked) {
                if ("INTEGRAL" !== a.data.pageType) {
                    h.push(o[n].attr_list[d].attr_id), k = !0;
                    break;
                }
                var v = {
                    attr_id: o[n].attr_list[d].attr_id,
                    attr_name: o[n].attr_list[d].attr_name
                };
                h.push(v);
            }
            if ("INTEGRAL" !== a.data.pageType && !k) {
                A = !1;
                break;
            }
        }
        if ("INTEGRAL" === a.data.pageType || A) {
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            });
            var b = a.data.pageType, k = 0;
            if ("STORE" === b) y = getApp().api.default.goods_attr_info; else if ("PINTUAN" === b) {
                y = getApp().api.group.goods_attr_info;
                k = a.data.group_checked;
            } else {
                if ("INTEGRAL" === b) return getApp().core.hideLoading(), void r.integralMallAttrClick(h);
                if ("BOOK" === b) y = getApp().api.book.goods_attr_info; else if ("STEP" === b) y = getApp().api.default.goods_attr_info; else {
                    if ("MIAOSHA" !== b) return getApp().core.showModal({
                        title: "提示",
                        content: "pageType变量未定义或变量值不是预期的"
                    }), void getApp().core.hideLoading();
                    var y = getApp().api.default.goods_attr_info;
                }
            }
            getApp().request({
                url: y,
                data: {
                    goods_id: "MIAOSHA" === b ? a.data.id : a.data.goods.id,
                    group_id: a.data.group_checked,
                    attr_list: JSON.stringify(h),
                    type: "MIAOSHA" === b ? "ms" : "",
                    group_checked: k
                },
                success: function(t) {
                    if (getApp().core.hideLoading(), 0 == t.code) {
                        var r = a.data.goods;
                        if (r.price = t.data.price, r.num = t.data.num, r.attr_pic = t.data.pic, r.is_member_price = t.data.is_member_price, 
                        r.single_price = t.data.single_price ? t.data.single_price : 0, r.group_price = t.data.price, 
                        "MIAOSHA" === b) {
                            var e = t.data.miaosha;
                            r.price = e.price, r.num = e.miaosha_num, r.is_member_price = e.is_member_price, 
                            r.attr_pic = e.pic, a.setData({
                                miaosha_data: e
                            });
                        }
                        a.setData({
                            goods: r
                        });
                    }
                }
            });
        }
    },
    attrClick: function(t) {
        var a = this, r = t.target.dataset.groupId, e = t.target.dataset.id, i = a.data.attr_group_list;
        for (var o in i) if (i[o].attr_group_id == r) for (var s in i[o].attr_list) i[o].attr_list[s].attr_id == e ? i[o].attr_list[s].checked = !0 : i[o].attr_list[s].checked = !1;
        a.setData({
            attr_group_list: i
        });
        var n = [], d = !0;
        for (var o in i) {
            var p = !1;
            for (var s in i[o].attr_list) if (i[o].attr_list[s].checked) {
                n.push(i[o].attr_list[s].attr_id), p = !0;
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
            url: getApp().api.default.goods_attr_info,
            data: {
                goods_id: a.data.id,
                attr_list: JSON.stringify(n),
                type: "ms"
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var r = a.data.goods;
                    r.price = t.data.price, r.num = t.data.num, r.attr_pic = t.data.pic, a.setData({
                        goods: r,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        }));
    },
    integralMallAttrClick: function(t) {
        var a = this.currentPage, r = a.data.goods, e = r.attr, i = 0, o = 0;
        for (var s in e) JSON.stringify(e[s].attr_list) == JSON.stringify(t) && (i = parseFloat(e[s].price) > 0 ? e[s].price : r.price, 
        o = parseInt(e[s].integral) > 0 ? e[s].integral : r.integral, r.attr_pic = e[s].pic, 
        r.num = e[s].num, a.setData({
            attr_integral: o,
            attr_num: e[s].num,
            attr_price: i,
            status: "attr",
            goods: r
        }));
    },
    numberSub: function() {
        var t = this.currentPage, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this.currentPage, a = t.data.form.number, r = t.data.pageType;
        if (!(++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit)) return "MIAOSHA" === r && a > t.data.goods.miaosha.buy_max && 0 != t.data.goods.miaosha.buy_max ? (getApp().core.showToast({
            title: "一单限购" + t.data.goods.miaosha.buy_max,
            image: "/images/icon-warning.png"
        }), !0) : void t.setData({
            form: {
                number: a
            }
        });
        getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        });
    },
    numberBlur: function(t) {
        var a = this.currentPage, r = t.detail.value, e = a.data.pageType;
        if (r = parseInt(r), isNaN(r) && (r = 1), r <= 0 && (r = 1), r > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit && (getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), r = a.data.goods.one_buy_limit), "MIAOSHA" === e && r > a.data.goods.miaosha.buy_max && 0 != a.data.goods.miaosha.buy_max) return getApp().core.showToast({
            title: "一单限购" + a.data.goods.miaosha.buy_max,
            image: "/images/icon-warning.png"
        }), !0;
        a.setData({
            form: {
                number: r
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this.currentPage;
        if (t.data.goods && 0 == t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var r in t.data.attr_group_list[a].attr_list) 0 == a && 0 == r && (t.data.attr_group_list[a].attr_list[r].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    }
};