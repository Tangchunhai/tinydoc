## 背景
在学习中，了解问题的本质，把知识管理起来是件不容的事情。出于复杂简单化的原则，花时间开发了这个小系统。

## 我的使用场景
1、搭建班子
<img src="https://github.com/Tangchunhai/tinydoc/blob/master/example/static/images/example/1.png" />

2、团队代码规范文档
<img src="https://github.com/Tangchunhai/tinydoc/blob/master/example/static/images/example/2.png" />

## tinydoc介绍
tinydoc是一款微文档生成系统，用Markdown格式编写，可以快速的写出文档，基于Node.js编译生成一个完整的HTML静态网站。

## 功能介绍
1、支持部署和直接打开HTML访问（不需要部署）。

2、支持文档目录结构。

3、支持移动端。

## 使用方法

### 左侧导航
编辑项目根目录sideNav.md编辑左侧导航配置文件，模块化分类，对应文件目录编写Markdown文件即可，左侧导航目录统一放在documents目录下。

### 网址导航
编辑项目根目录nav.md编辑菜单导航配置文件，对应文件目录编写Markdown文件即可，导航目录统一放在nav目录下。

## 生成静态
```
npm run build