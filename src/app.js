const fs = require("fs");
const fsExtra = require("fs-extra");
const marked = require("marked");
const katex = require('katex');
const path = require("path");
const ejs = require('ejs');
const utils = require('./utils/utils.js');
const template = require('./template');

// 配置
marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    latexRender: katex.renderToString.bind(katex)
});

class app {
    constructor() {
        this.dir =  path.join(__dirname); // 当前目录
        this.title = '搭建班子';
        this.outputDir = `dist`; // 输出文件目录
    }
    
    async init() {
        // 删除文件夹
        await this._delDir('dist');

        // 复制静态文件到输出目录
        fsExtra.copy(`${this.dir}/static`, `${this.outputDir}/static`, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('success');
            }
        });

        // 生成首页
        this.createIndex();   

        // 生成导航
        this.createNav();

        // 生成侧栏
        this.createSideNav();        
    }

    createIndex() {
        // 读取导航
        const navPathList = fs.readFileSync(`${this.dir}/nav.md`, 'utf8');
        const newNavPathList = navPathList.replace(/.md/g, '.html').replace(/\(/g, `\(`); // 匹配左侧菜单的内容文件路径替换后缀和要生成的文档目录

        // 读取左侧菜单
        const sideNavPathList = fs.readFileSync(`${this.dir}/sideNav.md`, 'utf8');
        const newSideNavPathList = sideNavPathList.replace(/.md/g, '.html').replace(/\(/g, `\(`); // 匹配左侧菜单的内容文件路径替换后缀和要生成的文档目录

        // 读取首页
        const indexData = fs.readFileSync(`${this.dir}/index.md`, 'utf8');
        
        // 解析内容为HTML
        const sideHtml = marked(newSideNavPathList);
        const navHtml = marked(newNavPathList);
        const mdHtml = marked(indexData);

        const documentsTemplate = template.getSideDocumentsTemplate({
            docsDir: '',
            title: this.title,
            navHtml: navHtml,
            sideHtml: sideHtml,
            mdHtml: mdHtml
        });

        const pageHtml = ejs.render(documentsTemplate, {
            navHtml,
            sideHtml,
            mdHtml
        });

        // 创建目录
        try {
            utils.mkdirsSync(this.outputDir, (e) => {
                console.log(e);
            });
        } catch(e) {

        }

        // 写入文件
        fs.writeFile(`${this.outputDir}/index.html`, pageHtml, 'utf8', function (error) {
            if (error) {
                console.log('生成首页：', error);
            }
        });              
    }
    createNav() {
        // 读取导航对应.md内容生成HTML
        const data = fs.readFileSync(`${this.dir}/nav.md`, 'utf8');
        const navPathList = data.match(/\((.+?)\)/g); // 匹配左侧菜单的内容文件路径
        const newNavPathList = data.replace(/.md/g, '.html').replace(/\(/g, `\(`); // 匹配左侧菜单的内容文件路径替换后缀和要生成的文档目录

        // 遍历左侧菜单
        navPathList.forEach((item) => {
            const documentsPath = `${this.dir}/${item.replace(/\(/, '').replace(/\)/, '')}`;

            // 读取文档内容
            fs.readFile(documentsPath, "utf8", (err, data) => {
                if (!err) {
                    // 拼接要生成的文件目录、文件名
                    const mdPaths = item.replace(/\(/, '').replace(/\)/, '').replace(/.md/, '.html'); // 匹配去掉两边括号，替换文件后缀
                    let mdDirs = mdPaths.split('/'); // 切割文件路径
                    const mdPathName = mdDirs[mdDirs.length - 1]; // 获取文件名
                    mdDirs.pop(); // 删除mdDirs数组里文件名
                    const mdDirPath = `${this.outputDir}/${mdDirs.join('/')}`;
                    
                    // 创建目录
                    try {
                        utils.mkdirsSync(mdDirPath, (e) => {
                            console.log(e);
                        });
                    } catch(e) {

                    }

                    // 解析内容为HTML
                    const navHtml = marked(newNavPathList);
                    const mdHtml = marked(data);

                    const documentsTemplate = template.getNavDocumentsTemplate({
                        docsDir: '../',
                        title: this.title,
                        navHtml: navHtml,
                        mdHtml: mdHtml
                    });

                    const pageHtml = ejs.render(documentsTemplate, {
                        navHtml,
                        mdHtml
                    });

                    // 写入文件
                    fs.writeFile(mdDirPath + '/' + mdPathName, pageHtml, 'utf8', function (error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                
                        // console.log('写入成功');
                    });
                } else {
                    console.log(err);
                }
            });                
        });
    }

    createSideNav() {
        // 读取导航
        const navPathList = fs.readFileSync(`${this.dir}/nav.md`, 'utf8');
        const newNavPathList = navPathList.replace(/.md/g, '.html').replace(/\(/g, `\(../`); // 匹配左侧菜单的内容文件路径替换后缀和要生成的文档目录

        // 读取左侧菜单
        const data = fs.readFileSync(`${this.dir}/sideNav.md`, 'utf8');
        const sideNavNameList = data.match(/\[(.+?)\]/g); // 匹配左侧菜单的内容文件名称
        const sideNavPathList = data.match(/\((.+?)\)/g); // 匹配左侧菜单的内容文件路径
        const newSideNavPathList = data.replace(/.md/g, '.html').replace(/\(/g, `\(../`); // 匹配左侧菜单的内容文件路径替换后缀和要生成的文档目录

        // 遍历左侧菜单
        sideNavPathList.forEach((item, index) => {
            const documentsPath = `${this.dir}/documents/${item.replace(/\(/, '').replace(/\)/, '')}`;


            // 读取文档内容
            fs.readFile(documentsPath, "utf8", (err, data) => {
                if (!err) {
                    // 处理内容图片路径
                    let content = data.replace(/..\/..\//g, '../');
                    
                    // 拼接要生成的文件目录、文件名
                    const mdPaths = item.replace(/\(/, '').replace(/\)/, '').replace(/.md/, '.html'); // 匹配去掉两边括号，替换文件后缀
                    let mdDirs = mdPaths.split('/'); // 切割文件路径
                    const mdPathName = mdDirs[mdDirs.length - 1]; // 获取文件名
                    mdDirs.pop(); // 删除mdDirs数组里文件名
                    const mdDirPath = `${this.outputDir}/${mdDirs.join('/')}`;

                    // 上一页
                    const upperPage = this._upperPage(index, sideNavNameList, sideNavPathList);

                    // 下一页
                    const lowerPage = this._lowerPage(index, sideNavNameList, sideNavPathList);

                    // 创建目录
                    try {
                        utils.mkdirsSync(mdDirPath, (e) => {
                            console.log(e);
                        });
                    } catch(e) {

                    }

                    // 解析内容为HTML
                    const sideHtml = marked(newSideNavPathList);
                    const navHtml = marked(newNavPathList);
                    const mdHtml = marked(content);

                    const documentsTemplate = template.getSideDocumentsTemplate({
                        docsDir: '../',
                        title: this.title,
                        navHtml: navHtml,
                        sideHtml: sideHtml,
                        mdHtml: mdHtml,
                        upperPage: upperPage,
                        lowerPage: lowerPage
                    });

                    const pageHtml = ejs.render(documentsTemplate, {
                        navHtml,
                        sideHtml,
                        mdHtml
                    });

                    // 写入文件
                    fs.writeFile(mdDirPath + '/' + mdPathName, pageHtml, 'utf8', function (error) {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                
                        // console.log('写入成功');
                    });
                } else {
                    console.log(err);
                }
            });                
        });
    }
    _upperPage(index, sideNavNameList, sideNavPathList) {
        const upperIndex = index - 1;

        if (upperIndex >= 0) {
            const upperPageName = sideNavNameList[upperIndex].replace(/\[/, '').replace(/\]/, ''); // 匹配去掉两边[]
            const upperPagePath = sideNavPathList[upperIndex].replace(/\(/, '').replace(/\)/, '').replace(/.md/, '.html'); // 匹配去掉两边括号，替换文件后缀

            return {
                name: upperPageName,
                path: upperPagePath
            };
        } else  {
            return '';
        }
    }
    _lowerPage(index, sideNavNameList, sideNavPathList) {
        const upperIndex = index + 1;

        if (upperIndex < sideNavPathList.length) {
            const upperPageName = sideNavNameList[upperIndex].replace(/\[/, '').replace(/\]/, ''); // 匹配去掉两边[]
            const upperPagePath = sideNavPathList[upperIndex].replace(/\(/, '').replace(/\)/, '').replace(/.md/, '.html'); // 匹配去掉两边括号，替换文件后缀

            return {
                name: upperPageName,
                path: upperPagePath
            };
        } else  {
            return '';
        }
    }
    _delDir(path) {
        let files = [];

        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);

            files.forEach((file) => {
                let curPath = path + "/" + file;

                if (fs.statSync(curPath).isDirectory()) {
                    this._delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });

            fs.rmdirSync(path);
        }
    } 
}

// 生成文档
const App = new app;
App.init();