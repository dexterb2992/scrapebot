$.ajax({
    url:'../try.php',
    type: 'get',
    complete: function (data){
        console.log(data);
    }
});


var DefaultMinWidth = 0,
    DefaultMinHeight = 0;
var OutputManger = function() {};
OutputManger.prototype = {
    allImgList: [],
    uniDict: {},
    init: function() {
        this.commonInit();
        this.bindObj()
    },
    commonInit: function() {
        var d = this;
        String.prototype.trim = function() {
            return this.replace(/(^\s*)|(\s*$)/g, "")
        };
        $("body").on("keydown", function(g) {
            var f = g.keyCode;
            if (g.ctrlKey) {
                if (f == 83) {
                    _gaq.push(["_trackEvent", "output", "save_ctrl_s", null, null, false]);
                    removeGA()
                }
            }
        });
        if (!localStorage.min_height || !localStorage.min_width) {
            localStorage.min_width = DefaultMinWidth;
            localStorage.min_height = DefaultMinHeight
        }
        if (localStorage.savePathType == "useTitle") {
            document.title = localStorage.title
        } else {
            if (localStorage.savePathType == "useFixedName") {
                document.title = localStorage.fixedName
            } else {
                document.title = localStorage.title
            }
        }
        $("#outputTextFormat").val(G_CONFIG.getOutputTextFormat());
        $("#renameRule").val(G_CONFIG.getRenameRule());
        $("#renamePanel input[name='radioRename']").each(function(f, g) {
            if ($(g).val() == G_CONFIG.getRenameMode()) {
                $(g).click()
            }
        });
        var e = parseInt(localStorage.min_width);
        var b = parseInt(localStorage.min_height);
        var a = function(f) {
            var g = 0;
            if (f == "min_width") {
                g = e
            } else {
                if (f == "min_height") {
                    g = b
                }
            }
            return {
                range: "min",
                value: g,
                min: 0,
                max: 1000,
                step: 10,
                animate: "fast",
                create: function(h, i) {
                    $(this).find(".ui-slider-handle").text(g)
                },
                slide: function(h, i) {
                    $(this).find(".ui-slider-handle").text(i.value)
                },
                stop: function(i, j) {
                    var k = $("#minWidthSlider").slider("value");
                    var h = $("#minHeightSlider").slider("value");
                    d.filter({
                        min_width: k,
                        min_height: h
                    })
                }
            }
        };
        $("#minWidthSlider").slider(a("min_width"));
        $("#minHeightSlider").slider(a("min_height"));
        var c = new QueneEnginer();
        c.outputManager = this;
        c.start();
        this.queneEnginer = c;
    },
    reset: function() {
        $("#list").html("")
    },
    addImgList: function(e, d) {
        var c = this;
        console.log("imgList", e);
        this.showNum();
        var a = c.allImgList.length;
        var b = 0;
        $.each(e, function(g, j) {
            if (!d) {
                if (c.uniDict[j.src] == undefined && j.src != "") {
                    b++;
                    j.index = a + b;
                    c.uniDict[j.src] = true;
                    c.allImgList.push(j)
                } else {
                    return true
                }
            }
            var h = j.width;
            var f = j.height;
            if (h * f == 0) {
                c.queneEnginer.add(j)
            } else {
                c.addToList({
                    item: j
                })
            }
        })
    },
    checkFilter: function(d) {
        var b = $("#linktxt").val();
        var g = d.min_width;
        var c = d.min_height;
        var f = d.src;
        var e = d.width;
        var a = d.height;
        if (e < g || a < c || (b != "" && f.indexOf(b) < 0)) {
            return false
        }
        return true
    },
    addToList: function(d) {
        var i = d.item;
        var a = i.src;
        var c = i.width;
        var h = i.height;
        var b = c * h;
        var e = $("#minWidthSlider").slider("value");
        var g = $("#minHeightSlider").slider("value");
        if (this.checkFilter({
                width: c,
                height: h,
                src: a,
                min_width: e,
                min_height: g
            })) {
            var f = '<li class="selectedimg"><img class="aimg" title="' + chrome.i18n.getMessage("aimg_tooltip") +
                        '" src="' + a + '" data-src="' + a + '" data-wh="' + c + "x" + h + '" data-whsum="' + b +
                        '" data-index="' + i.index + '" /><span class="picurl">' + a +
                        '</span><span class="info"><span class="wh">' + c + "x" + h + "<span></span></li>";
            $("#list").append(f);
            this.resizeImage()
        }
        this.showNum()
    },
    bindObj: function() {
        var a = this;
        $("#btnInverse").click(function() {
            a.inverseSelect()
        });
        $("#btnView").click(function() {
            a.view();
            _gaq.push(["_trackEvent", "output", "view", null, null, false])
        });
        $("#btnSave").click(function() {
            a.save();
            _gaq.push(["_trackEvent", "output", "save", null, null, false])
        });
        $("#linktxt").keypress(function(c) {
            if (c.keyCode == 13) {
                var d = $("#minWidthSlider").slider("value");
                var b = $("#minHeightSlider").slider("value");
                a.filter({
                    min_width: d,
                    min_height: b
                })
            }
        });
        $("#list").find("li").live({
            mouseenter: function() {
                $(this).find(".simple_tool").css("display", "inline");
                if (localStorage.showUrl == "1") {
                    $(this).find(".picurl").css("display", "block")
                }
            },
            mouseleave: function() {
                $(this).find(".simple_tool").css("display", "none");
                if (localStorage.showUrl == "1") {
                    $(this).find(".picurl").css("display", "none")
                }
            }
        });
        $("#list").find("li").live("click", function() {
            var b = $(this);
            var c = b.hasClass("delimg");
            a.setImageVisible(b, c);
            a.showNum()
        });
        $("#list").find(".open_link").live("click", function() {
            var b = $(this).parent().parent().find(".aimg").attr("data-src");
            window.open(b);
            return false
        });
        $("#list").find(".share_sina").live("click", function() {
            var b = $(this).parent().parent().find(".aimg").attr("src");
            a.share({
                url: b,
                title: "#Fatkun批量下载图片#",
                pic: b
            });
            return false
        });
        $("#btnSaveHelpOk").click(function() {
            $("#saveHelp").hide();
            a.saveDirect()
        });
        $("#chrome_download_settings_link").click(function() {
            chrome.tabs.create({
                url: "chrome://settings/search#" + chrome.i18n.getMessage("chrome_download_settings_url")
            })
        });
        $("#btnSaveHelpCancel").click(function() {
            $("#saveHelp").hide()
        });
        $("#sortSelect").change(function() {
            a.sortBySelect()
        });
        $("#btnMoreOption").toggle(function() {
            $(".tools").animate({
                height: "80px"
            }, 100);
            $("#proPanel").slideDown(100);
            _gaq.push(["_trackEvent", "output", "more_option", null, null, false])
        }, function() {
            $(".tools").animate({
                height: "40px"
            }, 100);
            $("#proPanel").slideUp(100)
        });
        $("#btnOutputTextShow").click(function() {
            a.output();
            $("#outputTextPanel").show()
        });
        $("#btnOutputTextClose").click(function() {
            $("#outputTextPanel").hide()
        });
        $("#outputTextFormat").keyup(function() {
            G_CONFIG.setOutputTextFormat($("#outputTextFormat").val());
            a.output()
        });
        $("#renameRule").keyup(function() {
            G_CONFIG.setRenameRule($("#renameRule").val())
        })
    },
    inverseSelect: function() {
        var a = this;
        $("#list>li").each(function(c, d) {
            var b = $(d);
            var e = b.hasClass("delimg");
            a.setImageVisible(b, e)
        })
    },
    filter: function(a) {
        var b = this;
        b.reset();
        b.addImgList(b.allImgList, true)
    },
    setImageVisible: function(a, b) {
        if (b && a.hasClass("delimg")) {
            a.removeClass("delimg")
        } else {
            if (!b && !a.hasClass("delimg")) {
                a.addClass("delimg")
            }
        }
        this.showNum()
    },
    sortBySelect: function() {
        var a = this;
        var b = $("#sortSelect").val().split(";");
        a.sort(b[0], b[1]);
        _gaq.push(["_trackEvent", "output", "sort", null, null, false])
    },
    sort: function(a, b) {
        $("#list>li").tsort(".aimg", {
            attr: a,
            order: b
        })
    },
    share: function(b) {
        var a = [];
        for (var c in b) {
            a.push(c + "=" + encodeURIComponent(b[c] || ""))
        }
        window.open("http://service.weibo.com/share/share.php?" + a.join("&"), "_blank", "width=615,height=405");
        _gaq.push(["_trackEvent", "output", "share", null, null, false])
    },
    showNum: function() {
        var d = this;
        var a = $("#list li:not(.delimg)").size();
        var c = this.allImgList.length;
        var e = MSG("process_show_start", "") + a + "/" + c + MSG("process_end", "图");
        var b = this.queneEnginer.processLeftNum;
        if (b > 0) {
            d.beforeLoad();
            e += ", " + b + MSG("process_unknow_image", "图正在获取大小")
        } else {
            d.afterLoad()
        }
        $("#imgnum").html(e)
    },
    beforeLoad: function() {
        $("#loadding").show()
    },
    afterLoad: function() {
        $("#loadding").hide();
        this.sortBySelect()
    },
    view: function() {
        var c = $("#list");
        var b = "theme_view";
        var a = c.hasClass(b);
        if (a) {
            c.removeClass(b);
            this.imgCenter($("#list .aimg"))
        } else {
            c.addClass(b);
            $.each($("#list .aimg"), function(d, e) {
                e.style.height = "auto";
                e.style.width = "auto";
                e.style.left = 0;
                e.style.top = 0
            })
        }
    },
    resizeImage: function() {
        this.imgCenter($("#list .aimg:not(.resize)"))
    },
    imgCenter: function(a) {
        a.each(function() {
            var h = $(this);
            var d = h.attr("data-wh").split("x");
            var g = parseInt(d[0]);
            var b = parseInt(d[1]);
            if (g * b > 0) {
                var c = h.parent().height();
                var f = h.parent().width();
                var e = b / g;
                if (b > c && g > f) {
                    if (b > g) {
                        g = f;
                        b = f * e;
                        $(this).css("top", (c - b) / 2)
                    } else {
                        g = c / e;
                        b = c;
                        $(this).css("left", (f - g) / 2)
                    }
                    h.width(g);
                    h.height(b)
                } else {
                    if (g > f) {
                        $(this).css("left", (f - g) / 2)
                    }
                    $(this).css("top", (c - b) / 2)
                }
                $(this).addClass("resize")
            }
        })
    },
    getFilename: function(b, e, i, d) {
        var g = this;
        var h = b.lastIndexOf("/");
        var f = b.substr(h + 1, b.length);
        h = f.lastIndexOf("?");
        if (h >= 0) {
            f = f.substr(0, h)
        }
        if (i == "1") {} else {
            if (i == "2") {
                h = f.lastIndexOf(".");
                var c = "jpg";
                var a = "";
                if (h >= 0) {
                    c = f.substr(h + 1, f.length)
                }
                a = f.substring(0, f.lastIndexOf(".") || f.length);
                f = g.replaceVarible({
                    text: d,
                    index: e,
                    ext: c,
                    name: a
                })
            }
        }
        if (f.lastIndexOf(".") < 0) {
            f = f + ".jpg"
        }
        return f
    },
    save: function() {
        var a = this;
        if (localStorage.notFirstUseSave == "1") {
            a.saveDirect()
        } else {
            $("#saveHelp").show()
        }
    },
    saveDirect: function() {
        var c = this;
        if ($("#cbSaveHelp").attr("checked")) {
            localStorage.notFirstUseSave = "1"
        }
        var b = $("#renamePanel input[name='radioRename']:checked").val();
        var a = $("#renameRule").val();
        G_CONFIG.setRenameMode(b);
        $("#list li:not(.delimg) .aimg").each(function(d, e) {
            c.saveAs(e.src, c.getFilename(e.src, d, b, a))
        })
    },
    getSafeDir: function(a) {
        return a.replace(/[|\\-\\/:*?"'<>=%$@#+-;,!\^]/g, "_")
    },
    saveAs: function(d, a) {
        if (chrome.downloads != null) {
            var c = document.title;
            var e = this.getSafeDir(c) + "/" + a;
            console.log("full_filepath", e);
            chrome.downloads.download({
                url: d,
                filename: e,
                saveAs: false,
                conflictAction: "uniquify"
            }, function(f) {
                console.log("downloadId", f, d)
            })
        } else {
            var b = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
            b.href = d;
            b.download = a;
            b.click()
        }
    },
    replaceVarible: function(d) {
        var f = d.text;
        if (d.name != null) {
            f = f.replace(/\{NAME\}/g, d.name)
        }
        if (d.ext != null) {
            f = f.replace(/\{EXT\}/g, d.ext)
        }
        if (d.link != null) {
            f = f.replace(/\{LINK\}/g, d.link)
        }
        if (d.index != null) {
            f = f.replace(/\{NO\}/g, d.index);
            var c = f.match(/\{NO([\d]+)\}/);
            if (c) {
                var b = c[1];
                var a = b.length;
                var e = d.index + 1;
                if (("" + (d.index + 1)).length < a) {
                    e = ("000000000000000000000000000000" + (d.index + 1)).substr(-a)
                }
                f = f.replace(/\{NO([\d]+)\}/g, e)
            }
        }
        return f
    },
    output: function() {
        var c = $("#outputTextFormat").val();
        var b = [];
        var a = this;
        $("#list li:not(.delimg) .aimg").each(function(d, f) {
            var e = f.src;
            var g = a.replaceVarible({
                text: c,
                index: d,
                link: e
            });
            b.push(g)
        });
        $("#outputTextArea").val(b.join("\n"))
    }
};
var QueneEnginer = function() {
    this.Quene = []
};
QueneEnginer.prototype = {
    outputManager: null,
    processTime: 100,
    loadNum: 0,
    processLeftNum: 0,
    maxDownloadNum: 5,
    add: function(a) {
        this.processLeftNum++;
        this.Quene.push(a)
    },
    start: function() {
        var a = this;
        setTimeout(function() {
            a.process()
        }, a.processTime)
    },
    process: function() {
        var b = this;
        if (this.Quene.length > 0) {
            while (this.loadNum < this.maxDownloadNum) {
                var a = this.Quene.shift();
                if (a == null) {
                    break
                }
                this.loadNum++;
                this.loadPic(a, function(c) {
                    b.loadNum--;
                    b.processLeftNum--;
                    if (c.success) {
                        var d = c.item;
                        b.outputManager.addToList({
                            item: d
                        })
                    } else {}
                    b.outputManager.showNum()
                })
            }
        }
        this.start()
    },
    loadPic: function(b, c) {
        var a = new Image();
        a.onload = function() {
            var e = parseInt(this.naturalWidth);
            var d = parseInt(this.naturalHeight);
            b.width = e;
            b.height = d;
            c({
                success: true,
                item: b
            })
        };
        a.onerror = function() {
            console.log("onerror", this.src);
            b.width = 1;
            b.height = 1;
            c({
                success: false,
                item: b
            })
        };
        a.src = b.src
    }
};
$(function() {
    var c = new OutputManger();
    c.init();

    function a(f, e, d) {
        if (f.cmd == "ADD_PIC") {
            c.addImgList(f.imgList)
        }
    }
    var b = chrome.extension.onMessage;
    if (b == undefined) {
        b = chrome.extension.onRequest
    }
    b.addListener(function(f, e, d) {
        a(f, e, d)
    })
});