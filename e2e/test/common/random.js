var random = {
    date: function () {
        var _data = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000));
        return _data.toISOString().slice(0, 10);
    },
    dateFromTo: function (useNow) {
        if (useNow)
            var _date1 = new Date();
        else
            var _date1 = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000));
        var _date2 = new Date(+(new Date()) + Math.floor(Math.random() * 10000000000));
        var _data = [];
        _data.push(_date1 > _date2 ? _date2 : _date1);
        _data.push(_date1 < _date2 ? _date2 : _date1);
        _data[0] = _data[0].toISOString().slice(0, 10) + 'T00:00:00.000';
        _data[1] = _data[1].toISOString().slice(0, 10) + 'T00:00:00.000';
        return _data;
    },
    array: function (n) {
        return Array.apply(null, {length: n}).map(Number.call, Number);
    },
    number: function (min, max) {
        min = min || 0;
        max = max || 99999999;
        var _value = Math.round(Math.random() * max);
        return Math.min(max, Math.max(min, _value));
    },
    MIDPercent: function (merchant, user) {
        var _percent = parseFloat(random.number(1, 10) / 10);
        if (user == 0) {
            user = merchant;
            merchant = 0;
        }

        var _u = Math.round((parseFloat(user) - _percent) * 100) / 100;
        if (_u < 0) {
            _u = 0;
            _percent = parseFloat(user);
        }
        var _m = Math.round((parseFloat(merchant) + _percent) * 100) / 100;
        return {merchantPercent: _m, userPercent: _u};
    },
    name: function () {
        var name = "at" + uuid.v4().replace(/-/g, '').substr(0, 20);
        return name;
    },
    mobile: function () {
        var _d = new Date();
        return _d.getTime();
    }
};
module.exports = random;
