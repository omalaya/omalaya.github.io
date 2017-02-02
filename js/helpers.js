/**
 * Created by Alex on 02.02.2017.
 */

//////////////////////////////////
// General
//////////////////////////////////

function log(obj) {
    console.log(obj)
}

function loadCss(url) {
    if (!window.LoadedCss)
        window.LoadedCss = []

    // Check if css already loaded
    if (LoadedCss.indexOf(url) >= 0)
        return

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);

    // Save as loaded
    LoadedCss[LoadedCss.length] = url
}

function addToUrl(newParams, replaceFlag) {
    var currentParams = (replaceFlag) ? "" : location.search
    window.history.pushState({}, '', currentParams + newParams)
}

function getUrlParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


//////////////////////////////////
// String
//////////////////////////////////

String.prototype.startsWith = function (startStr) {
    return startStr == this.substr(0, startStr.length);
}

String.prototype.strAfter = function (startStr) {
    return this.substr(startStr.length).trim()
}

String.prototype.getLineStartsWith = function (startStr, breakWord) {
    var result = null
    var lines = this.split("\n")
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(startStr)) {
            return lines[i]
        }
        if (breakWord && lines[i].startsWith(breakWord))
            return result
    }
    return result
}

//////////////////////////////////
// jQuery
//////////////////////////////////

function $tag(tag, id, css) {
    var element = document.createElement(tag);
    if (id) element.id = id;
    if (css) element.style.cssText = css;
    return $(element);
}

function $parseId($selector) {
    return $selector.attr("id").substr(2)
}
