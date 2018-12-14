module.exports = {
    currentPage: null,
    shoppingCart: null,
    init: function(t, r) {
        var a = this;
        a.currentPage = t, a.shoppingCart = r, void 0 === t.showDialogBtn && (t.showDialogBtn = function(t) {
            a.showDialogBtn(t);
        }), void 0 === t.attrClick && (t.attrClick = function(t) {
            a.attrClick(t);
        }), void 0 === t.onConfirm && (t.onConfirm = function(t) {
            a.onConfirm(t);
        }), void 0 === t.guigejian && (t.guigejian = function(t) {
            a.guigejian(t);
        }), void 0 === t.close_box && (t.close_box = function(t) {
            a.close_box(t);
        }), void 0 === t.hideModal && (t.hideModal = function(t) {
            a.hideModal(t);
        });
    },
    showDialogBtn: function(t) {
        var r = this.currentPage, a = this, i = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code && (r.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), a.resetData(), a.updateData(), a.checkAttrNum());
            }
        });
    },
    resetData: function() {
        this.currentPage.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            temporaryGood: {
                price: "0.00",
                num: 0
            }
        });
    },
    updateData: function() {
        var t = this.currentPage, r = t.data.currentGood, a = t.data.carGoods, i = JSON.parse(r.attr), o = r.attr_group_list;
        for (var e in i) {
            var n = [];
            for (var s in i[e].attr_list) n.push([ i[e].attr_list[s].attr_id, r.id ]);
            for (var d in a) {
                var c = [];
                for (var u in a[d].attr) c.push([ a[d].attr[u].attr_id, a[d].goods_id ]);
                if (n.sort().join() === c.sort().join()) {
                    for (var _ in o) for (var p in o[_].attr_list) for (var h in n) {
                        if (parseInt(o[_].attr_list[p].attr_id) === parseInt(n[h])) {
                            o[_].attr_list[p].checked = !0;
                            break;
                        }
                        o[_].attr_list[p].checked = !1;
                    }
                    var g = {
                        price: a[d].price
                    };
                    return void t.setData({
                        attr_group_list: o,
                        check_num: a[d].num,
                        check_goods_price: a[d].goods_price,
                        checked_attr: n,
                        temporaryGood: g
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var r = this.currentPage, a = r.data.carGoods;
        for (var i in a) {
            var o = [];
            for (var e in a[i].attr) o.push([ a[i].attr[e].attr_id, a[i].goods_id ]);
            o.sort().join() === t.sort().join() && r.setData({
                check_num: a[i].num,
                check_goods_price: a[i].goods_price
            });
        }
    },
    attrClick: function(t) {
        var r = this.currentPage, a = this, i = parseInt(t.target.dataset.groupId), o = parseInt(t.target.dataset.id), e = r.data.attr_group_list, n = r.data.currentGood, s = JSON.parse(n.attr), d = [];
        for (var c in e) if (e[c].attr_group_id == i) for (var u in e[c].attr_list) (D = e[c].attr_list[u]).attr_id == o && !0 !== D.checked ? D.checked = !0 : D.checked = !1;
        var _ = [];
        for (var c in e) for (var u in e[c].attr_list) !0 === (D = e[c].attr_list[u]).checked && (_.push([ D.attr_id, n.id ]), 
        d.push(D.attr_id));
        var p = JSON.parse(n.attr), h = r.data.temporaryGood;
        for (var g in p) {
            v = [];
            for (var l in p[g].attr_list) v.push([ p[g].attr_list[l].attr_id, n.id ]);
            if (v.sort().join() === _.sort().join()) {
                if (0 === parseInt(p[g].num)) return;
                h = parseFloat(p[g].price) ? {
                    price: parseFloat(p[g].price).toFixed(2),
                    num: p[g].num
                } : {
                    price: parseFloat(n.price).toFixed(2),
                    num: p[g].num
                };
            }
        }
        var f = [];
        console.log(d);
        for (var c in s) {
            var v = [], m = 0;
            for (var u in s[c].attr_list) getApp().helper.inArray(s[c].attr_list[u].attr_id, d) || (m += 1), 
            v.push(s[c].attr_list[u].attr_id);
            0 === s[c].num && m <= 1 && f.push(v);
        }
        var k = d.length, G = [];
        if (e.length - k <= 1) for (var c in d) for (var u in f) if (getApp().helper.inArray(d[c], f[u])) for (var g in f[u]) f[u][g] !== d[c] && G.push(f[u][g]);
        console.log(G), console.log(d);
        for (var c in e) for (var u in e[c].attr_list) {
            var D = e[c].attr_list[u];
            getApp().helper.inArray(D.attr_id, G) && !getApp().helper.inArray(D.attr_id, d) ? D.is_attr_num = !0 : D.is_attr_num = !1;
        }
        a.resetData(), a.checkUpdateData(_), r.setData({
            attr_group_list: e,
            temporaryGood: h,
            checked_attr: _
        });
    },
    checkAttrNum: function() {
        var t = this.currentPage, r = t.data.attr_group_list, a = JSON.parse(t.data.currentGood.attr), i = t.data.checked_attr, o = [];
        for (var e in i) o.push(i[e][0]);
        for (var e in a) {
            var n = [], s = 0;
            for (var d in a[e].attr_list) {
                var c = a[e].attr_list[d].attr_id;
                getApp().helper.inArray(c, o) ? s += 1 : n.push(c);
            }
            if (r.length - s == 1 && 0 == a[e].num) for (var u in r) for (var _ in r[u].attr_list) {
                var p = r[u].attr_list[_];
                getApp().helper.inArray(p.attr_id, n) && (p.is_attr_num = !0);
            }
        }
        t.setData({
            attr_group_list: r
        });
    },
    onConfirm: function(t) {
        var r = this.currentPage, a = r.data.attr_group_list, i = r.data.checked_attr, o = r.data.currentGood;
        if (i.length === a.length) {
            var e = r.data.check_num ? r.data.check_num + 1 : 1, n = JSON.parse(o.attr);
            for (var s in n) {
                var d = [];
                for (var c in n[s].attr_list) if (d.push([ n[s].attr_list[c].attr_id, o.id ]), d.sort().join() === i.sort().join()) {
                    var u = n[s].price ? n[s].price : o.price, _ = n[s].attr_list;
                    if (e > n[s].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var p = r.data.carGoods, h = 1, g = parseFloat(u * e).toFixed(2);
            for (var l in p) {
                var f = [];
                for (var v in p[l].attr) f.push([ p[l].attr[v].attr_id, p[l].goods_id ]);
                if (f.sort().join() === i.sort().join()) {
                    h = 0, p[l].num = p[l].num + 1, p[l].goods_price = parseFloat(u * p[l].num).toFixed(2);
                    break;
                }
            }
            1 !== h && 0 !== p.length || p.push({
                goods_id: o.id,
                attr: _,
                goods_name: o.name,
                goods_price: u,
                num: 1,
                price: u
            }), r.setData({
                carGoods: p,
                check_goods_price: g,
                check_num: e
            }), this.shoppingCart.carStatistics(r), this.attrGoodStatistics(), this.shoppingCart.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var r = this.currentPage, a = r.data.checked_attr, i = r.data.carGoods, o = r.data.check_num ? --r.data.check_num : 1;
        r.data.currentGood;
        for (var e in i) {
            var n = [];
            for (var s in i[e].attr) n.push([ i[e].attr[s].attr_id, i[e].goods_id ]);
            if (n.sort().join() === a.sort().join()) return i[e].num > 0 && (i[e].num -= 1, 
            i[e].goods_price = parseFloat(i[e].num * i[e].price).toFixed(2)), r.setData({
                carGoods: i,
                check_goods_price: i[e].goods_price,
                check_num: o
            }), this.shoppingCart.carStatistics(r), this.attrGoodStatistics(), void this.shoppingCart.updateGoodNum();
        }
    },
    attrGoodStatistics: function() {
        var t = this.currentPage, r = t.data.currentGood, a = t.data.carGoods, i = t.data.quick_list, o = t.data.quick_hot_goods_lists, e = 0;
        for (var n in a) a[n].goods_id === r.id && (e += a[n].num);
        for (var n in i) for (var s in i[n].goods) parseInt(i[n].goods[s].id) === r.id && (i[n].goods[s].num = e);
        for (var n in o) parseInt(o[n].id) === r.id && (o[n].num = e);
        t.setData({
            quick_list: i,
            quick_hot_goods_lists: o
        });
    },
    close_box: function(t) {
        this.currentPage.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.currentPage.setData({
            showModal: !1
        });
    }
};