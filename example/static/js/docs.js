$(function () {
    document.querySelectorAll('pre').forEach(function(block) {
        hljs.highlightBlock(block);
    });

    // 替换首页路径
    var location = window.location;

    if (location.host != '') {
        $('.logo').attr('href', 'http://' + location.host);
    } else {
        var urlArr = location.href.split('/');
        urlArr.splice(urlArr.length - 1, 1);

        if (location.href.indexOf('index.html') < 0) {
            urlArr.splice(urlArr.length - 1, 1);
        }

        var urls = urlArr.join('/') + '/index.html';

        $('.logo').attr('href', urls);
    }

    
    // 右侧目录导航
    $('#J-content').find('h1, h2, h3').each((i, item) => {
        $(item).attr('id', $(item).text());

        var tagName = $(item)[0].tagName;
        var li = '';

        if (tagName == 'H1') {
            li += `<a class="h1" href="#${$(item).text()}">${$(item).text()}</a>`;
        } else if (tagName == 'H2') {
            li += `<a class="h2" href="#${$(item).text()}">${$(item).text()}</a>`;
        } else if (tagName == 'H3') {
            li += `<a class="h3" href="#${$(item).text()}">${$(item).text()}</a>`;
        } else if (tagName == 'H4') {
            li += `<a class="h4" href="#${$(item).text()}">${$(item).text()}</a>`;
        } else if (tagName == 'H5') {
            li += `<a class="h5" href="#${$(item).text()}">${$(item).text()}</a>`;
        } else if (tagName == 'H6') {
            li += `<a class="h6" href="#${$(item).text()}">${$(item).text()}</a>`;
        }

        $('#J-catalog').append(li);
    });

    // 当前页高亮
    var url = window.location.href;

    $('#J-sidebar li').each(function(i, item) {
        var aDom = $(item).find('a');

        var href = aDom.attr('href');
        href = href.replace(/^..\//g, '');
        aDom.removeAttr('class', 'active');

        if (url.indexOf(href) != -1) {
            aDom.attr('class', 'active');
        }
    });

    // 导航高亮
    var pathname = window.location.pathname;

    $('#J-nav ul li').each(function(i, item) {
        var aDom = $(item).find('a');
        var href = aDom.attr('href');
        aDom.removeAttr('class', 'active');

        if (url.indexOf(href) != -1) {
            aDom.attr('class', 'active');
        }
    });

    // 侧栏伸展
    $('#J-toggle').click(function() {
        var sidebarDom = $('#J-sidebar');
        var toggleName = sidebarDom.attr('data-toggle');

        if (toggleName == 'sidebar-hide') {
            sidebarDom.removeClass('sidebar-hide');
            sidebarDom.addClass('sidebar-show');
            sidebarDom.attr('data-toggle', 'sidebar-show');
        } else {
            sidebarDom.removeClass('sidebar-show');
            sidebarDom.addClass('sidebar-hide');
            sidebarDom.attr('data-toggle', 'sidebar-hide');
        }
    });

    // 窗口自适应
    $(window).resize(function() {
        $('.scroll-pane').css('max-height', 'calc(100vh - 62px)');
    });

    // 点击锚点定位，解决偏移
    window.onhashchange = function() {
        var target = $(decodeURIComponent(location.hash));

        if (target.length == 1) {
             var top = target.offset().top;

             if (top > 85) {
                 $('html, body').animate({scrollTop: top - 86}, 500);
             } else {
                $('html, body').animate({scrollTop: top - 200}, 500);
             }
        } 
    }

    // 文档目录结构随着滚动条高亮
    $(window).scroll(function() {
        var $el = $('#J-catalog');
        var $items = $('#J-content').find('h1, h2, h3, h4, h5, h6');
        var offTop = 100;
        var top = $(document).scrollTop();
        var currentId = 0;

        if ($(document).scrollTop() <= 60) {
            $el.find('a').removeClass('active').eq(0).addClass('active');
        }

        $items.each(function() {
            var m = $(this),
                itemTop = m.offset().top;

            if (top > itemTop - offTop) {
                currentId = m.attr('id');
            } else {
                return false;
            }
        });

        var currentCatalogEl = $el.find('.active');
        var currentCatalogName = currentCatalogEl.attr('href') == null ? '' : currentCatalogEl.attr('href').replace(/\#/, '');

        if (currentId && currentCatalogName != currentId) {
            currentCatalogEl.removeClass('active');
            $el.find('[href=#'+ currentId +']').addClass('active');
        }
    });

    // 侧栏滚动条
    var $el = $('.scroll-pane').jScrollPane({
        verticalGutter: -16
    });

    extensionPlugin = {
        extPluginOpts: {
            // speed for the fadeOut animation
            mouseLeaveFadeSpeed: 500,

            // scrollbar fades out after hovertimeout_t milliseconds
            hovertimeout_t: 1000,
            // if set to false, the scrollbar will be shown on mouseenter and hidden on mouseleave
            // if set to true, the same will happen, but the scrollbar will be also hidden on mouseenter after "hovertimeout_t" ms
            // also, it will be shown when we start to scroll and hidden when stopping
            useTimeout: false,

            // the extension only applies for devices with width > deviceWidth
            deviceWidth: 980
        },
        hovertimeout: null, // timeout to hide the scrollbar
        isScrollbarHover: false,// true if the mouse is over the scrollbar
        elementtimeout: null,	// avoids showing the scrollbar when moving from inside the element to outside, passing over the scrollbar
        isScrolling: false,// true if scrolling
        addHoverFunc: function () {
            // run only if the window has a width bigger than deviceWidth
            if ($(window).width() <= this.extPluginOpts.deviceWidth) return false;

            var instance = this;

            // functions to show / hide the scrollbar
            $.fn.jspmouseenter = $.fn.show;
            $.fn.jspmouseleave = $.fn.fadeOut;

            // hide the jScrollPane vertical bar

            var $vBar = this.getContentPane().siblings('.jspVerticalBar').hide();

            /*
             * mouseenter / mouseleave events on the main element
             * also scrollstart / scrollstop - @James Padolsey : http://james.padolsey.com/javascript/special-scroll-events-for-jquery/
             */
            $el.bind('mouseenter.jsp', function () {
                // show the scrollbar
                $vBar.stop(true, true).jspmouseenter();

                if (!instance.extPluginOpts.useTimeout) return false;
                // hide the scrollbar after hovertimeout_t ms
                clearTimeout(instance.hovertimeout);

                instance.hovertimeout = setTimeout(function () {
                    // if scrolling at the moment don't hide it
                    if (!instance.isScrolling)
                        $vBar.stop(true, true).jspmouseleave(instance.extPluginOpts.mouseLeaveFadeSpeed || 0);
                }, instance.extPluginOpts.hovertimeout_t);
            }).bind('mouseleave.jsp', function () {
                // hide the scrollbar
                if (!instance.extPluginOpts.useTimeout)
                    $vBar.stop(true, true).jspmouseleave(instance.extPluginOpts.mouseLeaveFadeSpeed || 0);
                else {
                    clearTimeout(instance.elementtimeout);

                    if (!instance.isScrolling)
                    $vBar.stop(true, true).jspmouseleave(instance.extPluginOpts.mouseLeaveFadeSpeed || 0);
                }
            });

            if (this.extPluginOpts.useTimeout) {
                $el.bind('scrollstart.jsp', function () {
                    // when scrolling show the scrollbar
                    clearTimeout(instance.hovertimeout);
                    instance.isScrolling = true;
                    $vBar.stop(true, true).jspmouseenter();
                }).bind('scrollstop.jsp', function () {
                    // when stop scrolling hide the scrollbar (if not hovering it at the moment)
                    clearTimeout(instance.hovertimeout);

                    instance.isScrolling = false;

                    instance.hovertimeout = setTimeout(function () {
                        if (!instance.isScrollbarHover)
                            $vBar.stop(true, true).jspmouseleave(instance.extPluginOpts.mouseLeaveFadeSpeed || 0);
                    }, instance.extPluginOpts.hovertimeout_t);
                });
                // wrap the scrollbar
                // we need this to be able to add the mouseenter / mouseleave events to the scrollbar
                var $vBarWrapper = $('<div/>').css({
                    position: 'absolute',
                    left: $vBar.css('left'),
                    top: $vBar.css('top'),
                    right: $vBar.css('right'),
                    bottom: $vBar.css('bottom'),
                    width: $vBar.width(),
                    height: $vBar.height()

                }).bind('mouseenter.jsp', function () {
                    clearTimeout(instance.hovertimeout);
                    clearTimeout(instance.elementtimeout);

                    instance.isScrollbarHover = true;

                    // show the scrollbar after 100 ms.
                    // avoids showing the scrollbar when moving from inside the element to outside, passing over the scrollbar								
                    instance.elementtimeout = setTimeout(function () {
                        $vBar.stop(true, true).jspmouseenter();
                    }, 100);
                }).bind('mouseleave.jsp', function () {
                    // hide the scrollbar after hovertimeout_t
                    clearTimeout(instance.hovertimeout);
                    instance.isScrollbarHover = false;
                    instance.hovertimeout = setTimeout(function () {
                        // if scrolling at the moment don't hide it
                        if (!instance.isScrolling)
                            $vBar.stop(true, true).jspmouseleave(instance.extPluginOpts.mouseLeaveFadeSpeed || 0);

                    }, instance.extPluginOpts.hovertimeout_t);
                });

                $vBar.wrap($vBarWrapper);
            }
        }
    }

    try {
        jspapi = $el.data('jsp');
        $.extend(true, jspapi, extensionPlugin);
        jspapi.addHoverFunc();
    } catch(err) {
        
    }
});
