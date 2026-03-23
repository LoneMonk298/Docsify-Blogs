
<div id="container" class="layui-container">
    <div class="nav">
        <a v-for="(item,index) in nodes"  @click="goToAnchor(item)" href="javascript:void(0)">{{item.moduleName}}</a>
    </div>
    <fieldset class="layui-elem-field" style="padding: 8px;" v-for="(item,index) in nodes">
        <a :id="item.moduleId" style="position: relative;top:-50px;"></a>
        <legend>{{item.moduleName}}</legend>
        <div class="layui-row">
            <div class="layui-col-xs12 layui-col-sm12 layui-col-md2 no" v-for="(part,index) in item.parts">
                <a :href="theHref(part)" target="_blank">{{theName(part)}}</a>
            </div>
    </fieldset>
</div>

<script>
    (function(){
         new Vue({
            el:'#container',
            data() {
                return {
                    nodes: [
                        {
                            moduleId: 'my-project',
                            moduleName: '我的项目',
                            parts:[
                                '个人主页@https://zgg.leleosd.top/',


                            ]
                        },
                        {
                            moduleId: 'offen-tool',
                            moduleName: '常用工具',
                            parts:[
                                '🍉调整与压缩图片@https://tool.xuecan.net/image-resize/',
                                '定稿设计@https://gd74865930.qiye.gaoding.com/smartdesign',
                                '百度统计@https://tongji.baidu.com/main/homepage/22511391/homepage/index',
                                '软件个锤子@https://www.rjgcz.com/',
                                '无忧软件网@https://www.wycad.com/',
                                '🔨锤子在线工具网@https://www.toolhelper.cn/Home/Index',
                                '多媒体在线工具@https://ezgif.com/video-compressor?err=expired',
                                '在线视频转码@https://video.online-convert.com/convert-to-mp4',
                                'PDF解密@https://smallpdf.com/cn/unlock-pdf#r=unlock',
                                '二维码生成器@https://cli.im/',
                                'Webm to video@https://www.freeconvert.com/mp4-to-webm/download',
                                'EPUB to MOBI@https://www.freeconvert.com/zh/epub-to-mobi',
                                'Free DNS@https://dns.he.net/index.cgi',
                                'Processon作图@https://www.processon.com/login',
                                'Drawio作图@https://app.diagrams.net/',
                                '华为云容器服务@https://console.huaweicloud.com/swr/?agencyId=9fb50aa2b84e4d9f820bb6d32ca2b5ab&region=cn-south-1&locale=zh-cn#/swr/warehouse/detail/hw_008618613073290_01/mangoorg/flask-api/guide',
                                'Doocs MD@https://doocs.gitee.io/md/',
                                'Maven宝库@https://mvnrepository.com/'
                            ]
                        },
                        {
                            moduleId: 'resource-project',
                            moduleName: '相关素材',
                            parts:[
                                'Gif动图大全@https://www.aigei.com/lib/gif/',
                                '校徽矢量图大全@https://www.urongda.com/',
                                '80电子书@https://txt80.cc/',
                                '畅读网@https://nicefread.cn/',
                                'Z-Library@https://zh.17760704.ru/',
                                '哲风壁纸@https://haowallpaper.com/?isSel=false&page=1',
                                'win美化包@https://re.xcdream.com/pcmh/windowsthemes',
                                '千库网@https://588ku.com/so/shuqianye/'
                            ]
                        },
                        {
                            moduleId: 'ai-about',
                            moduleName: 'AI相关',
                            parts:[
                                'picsart@https://picsart.com/create',
                                'AI网站导航@https://www.dongaigc.com/nav'
                             
                            ]
                        }, 
                        {
                            moduleId: 'resource-nav',
                            moduleName: 'IT导航',
                            parts:[
                                '亚马逊云服务@https://eu-north-1.signin.aws.amazon.com/',
                                '胖虎的工具箱@https://www.955code.com/',
                                'JDK下载@https://blog.lupf.cn/articles/2022/02/24/1645713619397.html#toc_h2_17',
                                '各操作系统包@https://pkgs.org/',
                                'NPM packages@https://www.npmjs.com/settings/mgang/packages',
                                'DockerHub@https://hub.docker.com/'
                            ]
                        },
                        {
                            moduleId: 'front-ui',
                            moduleName: '前端相关',
                            parts:[
                                'Vercel@https://vercel.com/',
                                'Heyui@https://www.heyui.top/',
                                'Vlink@https://vlink.cc/admin/make',
                                'Material Design Icons@https://materialdesignicons.com/cdn/1.6.50-dev/',
                                'BootCDN@https://www.bootcdn.cn/all/',
                                'Docsify@https://docsify.js.org/#/zh-cn/',
                                'favicon网站图标获取@https://favicon.im/zh'
                            ]
                        },
                        {
                            moduleId: 'open-project',
                            moduleName: '开源项目',
                            parts:[
                                    '深度学习飞桨@https://www.paddlepaddle.org.cn/',
                                    '网络工具frp@https://github.com/fatedier/frp',
                                    'spring-boot-demo@https://github.com/xkcoding/spring-boot-demo',
                                    'spring-brick@https://gitee.com/starblues/springboot-plugin-framework-parent',
                                    'sofa-jarslink@https://github.com/sofastack/sofa-jarslink',
                                    'JavaGuide轻量级http框架@https://github.com/Snailclimb/jsoncat',
                                    '代码导航@https://github.com/liyupi/code-nav',
                                    '微信Markdown编辑器@https://github.com/doocs/md'
                            ]
                        },
                        {
                            moduleId: 'al-study',
                            moduleName: '算法学习',
                            parts:[
                                '左神算法@https://github.com/mg0324/zuoshen-algorithm',
                                '算法4可视化@https://algs4.cs.princeton.edu/home/'
                            ]
                        },
                        {
                            moduleId: 'it-man',
                            moduleName: 'IT大牛',
                            parts:[
                                'JavaGuide@https://github.com/Snailclimb',
                                'toBeBetterJavaer@https://github.com/itwanger/toBeBetterJavaer',
                                '龙进的博客@https://longjin666.cn/',
                                'liyupi@https://github.com/liyupi'
                            ]
                        },
                        {
                            moduleId: 'rspb',
                            moduleName: '嵌入式',
                            parts:[
                                '树莓派操作系统@https://www.raspberrypi.com/software/operating-systems/',
                                'Image Converter — LVGL@https://www.raspberrypi.com/software/operating-systems/'

                            ]
                        }
    
                    ]
                };
            },
            methods: {
               goToAnchor(item) {
                const el = document.getElementById(item.moduleId);
                if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                }
            },
            theName(v) {
                return v.split('@')[0];
            },
            theHref(v) {
                return v.split('@')[1];
            }
            }
        });
        importLayuiCss();
        importLayuiRowCss();
    })();

    function importLayuiCss(){
        var hm = document.createElement("link");
        hm.href = "https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css";
        hm.rel = "stylesheet";
        var s = document.getElementsByTagName("link")[0]; 
        s.parentNode.insertBefore(hm, s);
    }

    function importLayuiRowCss(){
        var hm = document.createElement("link");
        hm.href = "./css/layui-row.css";
        hm.rel = "stylesheet";
        var s = document.getElementsByTagName("link")[0]; 
        s.parentNode.insertBefore(hm, s);
    }
</script>