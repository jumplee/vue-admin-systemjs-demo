function Xroute() {
    this.controller = []; //存储路由
    this.status = false; //路由是否匹配成功， true是由路由匹配成功，false是没有路由匹配成功
};

/**
 * 指定路由执行方法
 * @param {string} name     路由匹配规则
 * @param {function} callback 回调函数
 */
Xroute.prototype.get = function (name, callback) {

    if (typeof (name) == 'string') {
        this.controller.push({
            name: name,
            callback: callback
        });
    } else {
        this.controller.push({
            name: 101,
            callback: name
        });
    }

};
/**
 * 所有的路由执行方法
 * @param {function} callback 执行的回调方法
 */
Xroute.prototype.all = function (callback) {
    this.controller.push({
        name: 102,
        callback: callback
    });
};
/**
 * 开始执行路由规则匹配成功的回调函数
 */
Xroute.prototype.hashchange = function () {
    var _this = this;
    var controller = []; //存储路由匹配成功的控制器
    var hash = window.location.hash.replace(/^#/, '').split('?');

    var pathname = hash[0] ? hash[0] : '';
    var aPathname = pathname.split('/');

    var search = hash[1] ? hash[1] : '';


    var req = {
        param: {},
        query: getQuery(),
        pathname: pathname,
        search: search
    };
    var res = {};
    var index = 0;


    //1.获取符合条件的控制器
    this.status = false;
    for (var i = 0; i < this.controller.length; i++) {

        if (this.controller[i].name == 101 || this.test(this.controller[i].name)) { //路由匹配成功
            controller.push(this.controller[i]);
        }
    }

    //执行下一个方法
    next.call(this);

    function next() {
        var cur = index;
        ++index;
        if (controller.length < index) {
            return;
        }

        if (_this.status && controller[cur].name == 101) { //跳过101的方法
            next();
        } else {
            if (typeof (controller[cur].name) == 'string') {
                req.param = getParam(controller[cur].name);
            }
            controller[cur].callback(req, res, next);
        }
    }

    /**
     * 将url地址解析成json对象
     * @param {string} rule 解析的规则
     */
    function getParam(rule) {
        var json = {};
        var aRule = rule.split('/');

        for (var i = 1; i < aRule.length; i++) {
            if (/^:[A-z][\w\d]*$/.test(aRule[i])) {
                var key = aRule[i].replace(/^:/, '');
                var value = aPathname[i];

                if (/^[0-9]+$/.test(value)) { //如果是数字，转换成数字
                    value = parseFloat(value);
                }

                json[key] = value;
            }
        }
        return json;
    }

    /**
     * 将参数解析成json对象
     */
    function getQuery() {
        var json = {};
        var aSearch = search.split('&');
        for (var i = 0; i < aSearch.length; i++) {
            var arr = aSearch[i].split('=');
            if (/^[A-z][\w\d]*$/.test(arr[0])) {
                json[arr[0]] = json[1] || null;
            }
        }
        return json;
    }
};

/**
 * 验证路由是否和当前路由正确
 * @param {string} name 路由地址
 */
Xroute.prototype.test = function (name) {
    var hash = window.location.hash;
    var url = name;
    if (hash == '') {
        hash = '#';
    }

    if (url == 102) {
        url = String(url).replace(/102/, '.*?'); //通用路由执行方法
    }

    url = '^#' + url.replace(/\/:\w[^\/]*/g, '\/([^\/]+)').replace(/\//g, '\\/') + '$'; //将路由名称转化成可用的正则表达式
    var bool = new RegExp(url).test(hash);
    if (bool && name != 102) { //有路由匹配成功，就不需要再执行101fangfa
        this.status = true;
    }
    return bool;
};

/**
 * 初始化
 * @param {boolean} set true=马上初始化，false不马上初始化
 */
Xroute.prototype.start = function (set) {
    var _this = this;
    window.addEventListener('hashchange', function () {
        _this.hashchange();
    }, false);

    _this.hashchange();
}