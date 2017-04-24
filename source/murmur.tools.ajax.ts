import {Observable} from "rxjs-es";

function formatParams(data) {
    let arr = [];
    for (let name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
}

interface optionItf {
    url: string
    type?: string
    data?
    dataType?
    success?: (t, xml) => void
    fail?: (statusCode) => void
}
export function ajax(options: optionItf) {
    return Observable.create(observer=>{
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        let params = formatParams(options.data);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let status = xhr.status;
                if (status >= 200 && status < 300) {
                    // options.success && options.success(xhr.responseText, xhr.responseXML);
                    observer.next(xhr.responseText,xhr.responseText)
                } else {
                    // options.fail && options.fail(status);
                    observer.error()
                }
            }
        };

        if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        } else if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        }
    })
}
