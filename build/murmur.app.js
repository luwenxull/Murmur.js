"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var murmur_core_1 = require("./murmur.core");
var wx_parser_1 = require("wx-parser");
var murmur_tool_1 = require("./murmur.tool");
var App = (function () {
    function App(appManager) {
        if (appManager === void 0) { appManager = {}; }
        this.appManager = appManager;
    }
    App.prototype.config = function (config) {
        var murmurPromise;
        // this.appManager[config.name] = murmurPromise = new MurmurPromise(config.template || config.templateUrl);
        // if (config.template) {
        //     this.doConvert(config.template, config, murmurPromise)
        // } else if (config.templateUrl) {
        //     ajax({
        //         url: config.templateUrl,
        //         success: responseText => {
        //             this.doConvert(responseText, config, murmurPromise);
        //         }
        //     })
        // } else {
        //     throw new Error('请传入正确的模板字符串或地址！')
        // }
        var observable = murmur_tool_1.getTemplate(config);
        observable.subscribe({
            next: function () {
                var arg = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arg[_i] = arguments[_i];
                }
                console.log(arg);
            }
        });
        // return murmurPromise
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
    };
    App.prototype.getPromise = function (name) {
        return this.appManager[name];
    };
    return App;
}());
exports.default = App;
