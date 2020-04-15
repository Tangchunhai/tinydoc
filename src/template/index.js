module.exports = {
    getSideDocumentsTemplate(option) {
        // 上一页
        let upperPageHtml = '';
        
        if (option.upperPage != null && option.upperPage != '') {          
            upperPageHtml = `
                &lt;&nbsp;
                <a href="${option.docsDir}${option.upperPage.path}">${option.upperPage.name}</a>
            `;
        }   

        // 下一页
        let lowerPageHtml = '';

        if (option.lowerPage != null && option.lowerPage != '') {
            lowerPageHtml = `
                <a href="${option.docsDir}${option.lowerPage.path}">${option.lowerPage.name}</a>
                &nbsp;&gt;
            `;
        };

        return `
            <!DOCTYPE html>
            <html>
            
            <head>
                <meta charset="utf-8">
                <title>${option.title}</title>
                <meta name="viewport"
                    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                <link rel="stylesheet" href="${option.docsDir}static/css/docs.css">
                <link type="text/css" href="${option.docsDir}static/css/jquery.jscrollpane.css" rel="stylesheet" media="all" />
                <link type="text/css" href="${option.docsDir}static/css/atom-one-dark.css" rel="stylesheet" media="all" />
                <script src="${option.docsDir}static/js/jquery-1.10.2.js"></script>
                <script src="${option.docsDir}static/js/jquery.mousewheel.js"></script>
                <script src="${option.docsDir}static/js/jquery.jscrollpane.min.js"></script>
                <script src="${option.docsDir}static/js/highlight.min.js"></script>
                <script src="${option.docsDir}static/js/docs.js"></script>
            </head>
            
            <body>
                <!-- 头部 -->
                <div class="header">
                    <a class="logo" href="/">
                        ${option.title}
                    </a>
                    <div class="nav">
                        <%- navHtml %>
                    </div>
            
                    <div id="J-toggle" class="toggle">
                        <img src="${option.docsDir}static/images/menu.png" />
                    </div>
                </div>
            
                <div class="main">
                    <aside id="J-sidebar" class="sidebar sidebar-hide" data-toggle="sidebar-hide">
                        <div class="sidebar-nav scroll-pane">
                            <%- sideHtml %>
                        </div>
                    </aside>
                
                    <div id="J-content" class="markdown content">
                        <div class="content-body">
                            <%- mdHtml %>
                        </div>
                        
                        <!-- 页 -->
                        <div class="page-nav">
                            <ul>
                                <li>
                                    ${upperPageHtml}
                                </li>
                                <li>
                                    ${lowerPageHtml}
                                </li>
                            </ul>
                        </div>
                    </div>
            
                    <!-- 文档目录 -->
                    <aside class="catalog">
                        <div class="catalog-body">
                            <div class="catalog-title">
                                文档结构
                            </div>
                            <div id="J-catalog" class="catalog-nav"></div>
                        </div>
                    </aside>
                </div>
            </div>    
            </body>
            
            </html>
        `
    },
    getNavDocumentsTemplate(option) {
        return `
            <!DOCTYPE html>
            <html>
            
            <head>
                <meta charset="utf-8">
                <title>${option.title}</title>
                <meta name="viewport"
                    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                <link rel="stylesheet" href="${option.docsDir}static/css/docs.css">
                <link type="text/css" href="${option.docsDir}static/css/jquery.jscrollpane.css" rel="stylesheet" media="all" />
                <script src="${option.docsDir}static/js/jquery-1.10.2.js"></script>
                <script src="${option.docsDir}static/js/jquery.mousewheel.js"></script>
                <script src="${option.docsDir}static/js/jquery.jscrollpane.min.js"></script>
                <script src="${option.docsDir}static/js/docs.js"></script>
            </head>
            
            <body>
                <!-- 头部 -->
                <div class="header">
                    <a class="logo" href="/">
                        ${option.title}
                    </a>
                    <div id="J-nav" class="nav">
                        <%- navHtml %>
                    </div>
            
                    <div id="J-toggle" class="toggle">
                        <img src="${option.docsDir}static/images/menu.png" />
                    </div>
                </div>
            
                <div class="main">
                    <aside id="J-sidebar" class="sidebar sidebar-hide" style="border: none;"></aside>

                    <div id="J-content" class="markdown content">
                        <div class="content-body">
                            <%- mdHtml %>
                        </div>
                    </div>

                    <aside id="J-sidebar" class="sidebar sidebar-hide" style="border: none;"></aside>
                </div>
            </div>    
            </body>
            
            </html>
        `
    }
}