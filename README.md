# [Ghost](https://github.com/TryGhost/Ghost) [![Build Status](https://travis-ci.org/TryGhost/Ghost.svg?branch=master)](https://travis-ci.org/TryGhost/Ghost)

#### Quickstart:

在控制台，切换到工作目录，执行以下命令
1. `git clone https://github.com/ghostchina/Ghost.zh.git`  
1. `npm install -g grunt-cli`
1. `npm install`
1. `grunt init` (and `grunt prod` if you want to run Ghost in production mode)
1. `npm start`

### 使用mysql
1. 复制 config.example.js ，命名为 config.js 。
修改文件config.js  中的development 下的数据库配置信息 ，

```
database: {
            client: 'mysql',
            connection: {
                host     : '127.0.0.1',
                user     : 'yourname',
                password : 'password',
                database : 'ghost_blog',
                charset  : 'UTF8_GENERAL_CI'
            }
        },

```


### 常见问题

1  npm start ghost 正常运行以后，访问/ghost 无法进入后台，显示的状态码为302
答： 进入ghost 后台系统会自动检测更新，是否有新版本,但是国内无法访问这个地址 update.ghost.org.

解决办法:替换 /core/server/update-check.js  190行

```
    return updateCheckRequest().then(updateCheckResponse).otherwise(updateCheckError);
```  
为

```
    //return updateCheckRequest().then(updateCheckResponse).otherwise(updateCheckError);
    deferred.resolve();
```  

2 数据库中文乱码
修改confi.js中database的字符集设置

```
	charset: 'UTF8_GENERAL_CI'
```

3 主页显示很慢,界面很久才展示出来
答:  还是因为google背墙乐，主题中引用了一个谷歌字体，删掉
content/themes/casper/default.hbs 中的19行

```
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Noto+Serif:400,700,400italic|Open+Sans:700,400" />
```

## Copyright & License
[Ghos官网](http://ghost.org)，[ghostchina 中文网](http://www.ghostchina.com/)

Copyright (c) 2013-2014 Ghost Foundation - Released under the [MIT license](LICENSE).
