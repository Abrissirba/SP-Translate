var fs = require('fs');
var async = require('async');
var spLocales = require('./locales');

var reg = new RegExp(/<data name="(.+?)"[\s\S]*?<value>(.+?)<\/value>[\s\S]*?<\/data>/g);

module.exports = function(options){
    var resourceDir = options.resourceDir || 'C:/Program Files/Common Files/microsoft shared/Web Server Extensions/15/Resources/';
    var outputDir = options.outputDir || "../app/sp_locales/";
    
    var resourceFiles = spLocales(resourceDir);

    var includedLocales = ["sv-SE"];

    var localeObjects = {
        org: {},
        "en-US": {}
    };

    includedLocales.forEach(function(locale) {
        localeObjects[locale] = localeObjects[locale] || {};
    });
                
    var asyncProcessLocaleFileFunctions = [];

    resourceFiles.forEach(function(fileName) {
        asyncProcessLocaleFileFunctions.push(processLocaleFileFactory(fileName, localeObjects, includedLocales));
    });

    async.parallel(asyncProcessLocaleFileFunctions, function(err){
        saveLocale(outputDir, 'en-US', localeObjects["en-US"]);
        includedLocales.forEach(function(locale){
            saveLocale(outputDir, locale, localeObjects[locale]); 
        });
    });
}

function processLocaleFileFactory(fileName, localeObjects, includedLocales){
    return function(cb){
        fs.readFile(getPath(fileName), 'utf8', function(err, data){
            var result;
            while((result = reg.exec(data)) !== null){
                localeObjects.org[result[1]] = result[2];
                localeObjects["en-US"][result[2]] = result[2];
            }
            
            var getStringsFromLocaleFileFunctions = [];
            includedLocales.forEach(function(locale) {
                getStringsFromLocaleFileFunctions.push(getStringsFromLocaleFileFactory(fileName, locale, localeObjects));
            });
            
            
            async.parallel(getStringsFromLocaleFileFunctions, function(){
                cb();
            });
        });
    }
}


function getStringsFromLocaleFileFactory(fileName, locale, localeObjects){
    return function(cb){
        fs.readFile(getPath(fileName, locale), 'utf8', function(err, data){
            var result, key, orgVal;

            while((result = reg.exec(data)) !== null){
                key = result[1];
                orgVal = localeObjects.org[key]
                if(key && orgVal){
                    // if(locales[locale][result[2]] && locales[locale][result[2]] !== orgVal){
                    //     console.log("CONFLICT: " + result[1] + ", " + result[2] + ", " + orgVal + ", " + locales[locale][result[2]]);
                    // }
                    localeObjects[locale][result[2]] = orgVal;
                }
            }
            cb(localeObjects[locale]);
        });
    }
}

function getPath(fileName, locale){
    fileName = locale ? fileName + "." + locale : fileName;
    return fileName + ".resx";
}

function saveLocale(outputDir, locale, localeObject){
    var stringified = JSON.stringify(localeObject, null, 4)
    fs.writeFile(outputDir + locale + ".json", stringified, function(err){
       if(err){
           console.log(err);
       } 
       console.log('Created: ' + outputDir + locale + '.json');
    });
}