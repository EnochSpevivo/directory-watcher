## what is this?
* a very simple node package that uses [`chokidar`](https://github.com/paulmillr/chokidar) to observe a `target` directory and mirror any and all changes to `source` directory.

## how do i use it?
* `npm start -- "source/directory" "target/directory"`
  * particularly useful when paired with an OS script that starts automatically on start up. 
  
```
:: start-on-startup.bat

@echo off
cd "path/to/directory/watcher"
npm start -- "source/directory" "target/directory"
```