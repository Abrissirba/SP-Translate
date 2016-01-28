# SP Translate

SP Translate is a Google Chrome Extension that can be used on a SharePoint site. 
SP Translate will lookup the language/locale that the page is using and then try to find the english term for that text. 
This can be useful when you are new to SharePoint and working on a page that only has one locale enabled and tries to google something. 
The answers you get are almost always in english and can, somtetimes, be hard to map to what you see on the screen.

## Usage

Go in to a SharePoint site and click on the SP Translate icon in the URL field.

Make sure that the extension is available by fist building the project and then [add it to chrome](https://developer.chrome.com/extensions/getstarted#unpacked)

## Building

In order to build this project you need node and gulp installed.

Before you build you need to set the location for where the SharePoint localization resource files. You do this by setting the SP_RESOURCE_DIR in gulpfile.babel.js.
If you set SP_RESOURCE_DIR to null it will default to 
```
C:\Program Files\Common Files\microsoft shared\Web Server Extensions\15\Resources
```

To build the project just run
```
gulp build
```