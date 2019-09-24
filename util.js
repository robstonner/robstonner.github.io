var util = {
    clear: function(el) {
        el.innerHTML = "";
    },
    replace: function(el, content) {
        el.innerHTML = "";
        el.innerHTML = content;
    },
    qid: function(id) {
        return document.getElementById(id);
    },
    qa: function(tag) {
        return document.querySelectorAll(tag);
    },
    q: function(tag) {
        return document.querySelector(tag);
    },
    on: function(el, event, func) {
        el.addEventListener(event, func);
    },
    mdf: function(md) {
        return window.markdeep.format(md);
    },
    flash: function(el, content) {
        el.style.opacity = 1;
        el.innerHTML = content;
        var d = 100;
        for (var i = 0; i <= 600; i++) {
            setTimeout(function() {
                el.style.opacity = (el.style.opacity - (1/600)).toFixed(4);
            }, d);
            d += 2;
        }
    }
}