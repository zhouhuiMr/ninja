/**
 * Created by zhouhui on 2016/12/22.
 */
console.info("已经加载文件：init.js");
(function(window){
    var init = function(){
        this.renderer = new PIXI.autoDetectRenderer(device.screenWidth,device.screenHeight,{
            backgroundColor: 0xFAEBD7,
        });
        this.Stage = new PIXI.Container();
        this.resources = null;
        this.ninja = new PIXI.Container();
        this.ninja = null;
        this.addNinja = function(){
            var frames = [];
            for(var i=1;i<6;i++){
                frames.push(PIXI.Texture.fromFrame("r1_"+i+".png"));
            }
            var p_ninja = new ninja(frames);
            p_ninja.body.position.x = device.screenWidth/2;
            p_ninja.body.position.y = device.screenHeight/2;
            p_ninja.body.scale.set(1,1); //设置大小
            p_ninja.body.anchor.set(0.5,0.5);//设置锚点
            p_ninja.body.animationSpeed = 0.3;//设置动画的执行速度
            p_ninja.body.play();//开始执行
            this.Stage.addChild(p_ninja.body);
            this.ninja = p_ninja;
            return p_ninja;
        }
        this.addBackground = function(texture,width,height){
            var back = new background(texture,width,height);
            this.Stage.addChild(back.body);
            return back;
        }
        this.animationStart = function(){
            animationtion();
        }
    }
    window.init = init;
})(window)

function animationtion(){
    farback.body.tilePosition.x -= 1;
    nearback.body.tilePosition.x -= 3;
    ninjagame.renderer.render(ninjagame.Stage);
    requestAnimationFrame(animationtion);
}