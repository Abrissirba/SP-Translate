(function(global){
    'use strict';
    var translations = {};
    //var init = false;

    function setTranslations(){
        var elements = document.getElementsByTagName('*');

        var i = elements.length;
        while (--i > -1) {
            if(translations[elements[i].innerHTML.trim()]){
                elements[i].innerHTML = elements[i].innerHTML + ' <span class="sp-translation">(' + translations[elements[i].innerHTML.trim()] + ')</span>';
            }
        }
    }

    function getTranslations(locale, cb){
        var xhr = new XMLHttpRequest();
        //xhr.open('GET', chrome.extension.getURL('../sp_locales/' + locale + '.json'), true);
        xhr.open('GET', 'https://sptranslate.azurewebsites.net/' + locale + '.json', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                translations = JSON.parse(xhr.responseText);
                if(cb){
                   cb();
                }
            }
        };
        xhr.send();
    }

    function addStyle(){
        var css = 'span.sp-translation { color: rgba(255, 0, 0, 0.75); }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }

    function ready(cb, wait){
        if ( document.readyState === 'complete' ) {
            setTimeout( cb, wait );
        }
        else{
            return setTimeout( function(){
                ready(cb, wait);
            }, 1 );
        }
    }

    function isSharePointSite(){
        var generatorEl = document.querySelector('meta[name=GENERATOR]');
        if(generatorEl){
            return generatorEl.content ? generatorEl.content.indexOf('SharePoint') > -1 : false;
        }
        return false;
    }

    function getLocale(){
        var langEl = document.querySelector('html[lang]');
        return langEl ? langEl.lang : null;
    }

    if(chrome && chrome.extension) {
        chrome.extension.onMessage.addListener(function(msg) {
            if(msg.action === 'refresh'){
                ready(setTranslations, msg.wait);
            }
        });
    }


    var lang = getLocale();
    if(isSharePointSite() && lang) {
        addStyle();

        getTranslations(lang);

        // ready(function(){
        //     if(!init){
        //         init = true;
        //         getTranslation(lang, setTranslations);
        //     }
        // }, 1000);
    }

    if(global){
        global.setTranslations = setTranslations;
        global.getTranslations = getTranslations;
    }

})(window);