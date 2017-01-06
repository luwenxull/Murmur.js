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
        var murmurTree, murmurPromise;
        this.appManager[prepareObj.name] = murmurPromise = new murmur_promise_1.MurmurPromise(prepareObj.template || prepareObj.templateUrl);
        if (prepareObj.template) {
            murmurTree = murmur_core_1.default.convert(wx_parser_1.wxParser.parseStart(prepareObj.template));
            prepareObj.model && (murmurTree.model.state = prepareObj.model);
            murmurPromise.resolve(murmurTree);
        }
        else if (prepareObj.templateUrl) {
            murmur_tool_1.ajax({
                url: prepareObj.templateUrl,
                success: function (responseText) {
                    murmurTree = murmur_core_1.default.convert(wx_parser_1.wxParser.parseStart(responseText));
                    prepareObj.model && (murmurTree.model.state = prepareObj.model);
                    murmurPromise.resolve(murmurTree);
                }
            });
        }
        return murmurPromise;
    };
    return App;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
