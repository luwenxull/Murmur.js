"use strict";
var murmur_core_1 = require("./murmur.core");
var murmur_promise_1 = require("./murmur.promise");
var wx_parser_1 = require("wx-parser");
var murmur_tool_1 = require("./murmur.tool");
var App = (function () {
    function App(appManager) {
        if (appManager === void 0) { appManager = {}; }
        this.appManager = appManager;
    }
    App.prototype.prepare = function (prepareObj) {
        var _this = this;
        var murmurPromise;
        this.appManager[prepareObj.name] = murmurPromise = new murmur_promise_1.MurmurPromise(prepareObj.template || prepareObj.templateUrl);
        if (prepareObj.template) {
            this.doConvert(prepareObj.template, prepareObj, murmurPromise);
        }
        else if (prepareObj.templateUrl) {
            murmur_tool_1.ajax({
                url: prepareObj.templateUrl,
                success: function (responseText) {
                    _this.doConvert(responseText, prepareObj, murmurPromise);
                }
            });
        }
        else {
            throw new Error('请传入正确的模板字符串或地址！');
        }
        return murmurPromise;
    };
    App.prototype.doConvert = function (template, prepareObj, murmurPromise) {
        var needReplace = [];
        var murmurTree = murmurPromise.murmur = murmur_core_1.default.convert(wx_parser_1.wxParser.parseStart(template), needReplace);
        prepareObj.model && (murmurTree.model.state = prepareObj.model);
        if (needReplace.length) {
            for (var _i = 0, needReplace_1 = needReplace; _i < needReplace_1.length; _i++) {
                var holderMurmur = needReplace_1[_i];
                var substitution = this.getPromise(holderMurmur.placeholder);
                murmurPromise.depends(substitution);
                holderMurmur.replace(substitution);
                murmurPromise.checkDependencies();
            }
        }
        else {
            murmurPromise.resolve();
        }
        // murmurPromise.resolve(murmurTree);
    };
    App.prototype.getPromise = function (name) {
        return this.appManager[name];
    };
    return App;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
