"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_es_1 = require("rxjs-es");
function formatParams(data) {
    var arr = [];
    for (var name_1 in data) {
        arr.push(encodeURIComponent(name_1) + "=" + encodeURIComponent(data[name_1]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
}
function ajax(options) {
    return rxjs_es_1.Observable.create(function (observer) {
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = formatParams(options.data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status_1 = xhr.status;
                if (status_1 >= 200 && status_1 < 300) {
                    // options.success && options.success(xhr.responseText, xhr.responseXML);
                    observer.next(xhr.responseText, xhr.responseText);
                }
                else {
                    // options.fail && options.fail(status);
                    observer.error();
                }
            }
        };
        if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
        else if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        }
    });
}
exports.ajax = ajax;
