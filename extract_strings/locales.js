var fs = require('fs');

var locales = [
    'en-US',
    'sv-SE'
];

function filenameIncludesLocale(filename){
    for(var i = 0; i < locales.length; i++){
        if(filename.toLowerCase().indexOf(locales[i].toLowerCase()) > -1){
            return true;
        }
    }
    return false;
}

function removeLocaleSpecificFiles(filenames){
    return filenames.filter(function(filename){
        return !filenameIncludesLocale(filename);
    });
}

function removeFileExtension(resourceDir, filenames){
    return filenames.map(function(filename){
       return resourceDir + filename.replace(/\.[^/.]+$/, "");
    });
}

function getOriginalResourceFiles(resourceDir){
    var filenames = fs.readdirSync(resourceDir);
    var orgFilenames = removeLocaleSpecificFiles(filenames);
    return  removeFileExtension(resourceDir, orgFilenames);
}

module.exports = getOriginalResourceFiles;