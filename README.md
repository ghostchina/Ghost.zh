# [Ghost](https://github.com/TryGhost/Ghost) [![Build Status](https://travis-ci.org/TryGhost/Ghost.svg?branch=master)](https://travis-ci.org/TryGhost/Ghost)

#### Quickstart:
1. 请先切换到 stable 分支，再clone 代码
2. 复制 config.example.js ，命名为 config.js 。
修改文件config.js  中的development 下的数据库配置信息 ，

```
database: {
            client: 'mysql',
            connection: {
                host     : '127.0.0.1',
                user     : 'root',
                password : 'root',
                database : 'bigertech_blog',
                charset  : 'UTF8_GENERAL_CI'
            }
        },

```

在控制台，切换到工作目录，执行以下命令

1. `npm install -g grunt-cli`
1. `npm install`
1. `grunt init` (and `grunt prod` if you want to run Ghost in production mode)
1. `npm start`



### 
常见问题
1.  npm start ghost 正常运行以后，访问/ghost 无法进入后台，显示的状态码为302
答： 进入ghost 后台系统会自动检测更新，是否有新版本,但是国内无法访问这个地址 update.ghost.org。代码在


解决办法
替换 /core/server/update-check.js  190行
```
    return updateCheckRequest().then(updateCheckResponse).otherwise(updateCheckError);
```
为
```
    //return updateCheckRequest().then(updateCheckResponse).otherwise(updateCheckError);
    deferred.resolve();
```


## Copyright & License
ghostchina

Copyright (c) 2013-2014 Ghost Foundation - Released under the [MIT license](LICENSE).
