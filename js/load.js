/**
 * Created by zhouhui on 2016/12/22.
 */
console.info("已经加载文件：load.js");
(function(window){
    var loadstart = function(){
        //加载资源的方法
        this.loadresources = function(){
            var loader = PIXI.loader;
            loader.add("homebg1","/ninja/resources/background/bg1.png");
            loader.add("homebg2","/ninja/resources/background/bg2.png");
            loader.add("prop","/ninja/resources/prop/prop.json");
            loader.add("scene","/ninja/resources/background/scene.json");
            loader.add("ninja","/ninja/resources/ninja/ninja.json");
            loader.add("farback1","/ninja/resources/background/background1_1.png");
            loader.add("nearback1","/ninja/resources/background/background1_2.png");
            loader.add("farback2","/ninja/resources/background/background2_1.png");
            loader.add("nearback2","/ninja/resources/background/background2_2.png");
            loader.add("farback3","/ninja/resources/background/background3_1.png");
            loader.add("nearback3","/ninja/resources/background/background3_2.png");
            loader.load(function(loader, resources){
                document.body.removeChild(document.getElementById("loadingspan"));
                window.resources = resources;
                window.ninjagame = new scene();
                window.stats = new Stats();
                stats.setMode(0);
                document.getElementById("gamestage").appendChild(ninjagame.renderer.view);
                document.body.appendChild( stats.domElement );
                ninjagame.startScene();
            });
            loader.onProgress.add(function(data){
                $("#loadingspan p").html("正在加载数据..."+Math.round(data.progress)+"%");
            });
        }
    }
    window.loadstart = loadstart;
})(window);
new loadstart().loadresources();