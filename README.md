# Utilibot

JavaScript-based modular Discord bot. Nothing much more than that. This is a template to build your own. Built for any platform that supports the screen command.

### Usage

Add the module files anywhere you feel like. Add their internal name, proper name, and file location to ``modules.json``. 
Like so:

```
"internal name here":{
  "name":"proper name here",
  "loc":"module file location"
}
```
The "active" key you see in there will get added by the script.
This file gets read at boot and is continuously modified. 
Make sure it is in the same directory as ``modman.js``.

### Requirements

This was built for Node 12.16 and Ubuntu 16.04, so it should work fine there and later versions too.
