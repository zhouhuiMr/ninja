/**
 * Created by zhouhui on 2016/12/22.
 */
console.info("已经加载文件：background.js");
(function(window){
    var background = function(texture,width,height){
        this.body = new PIXI.extras.TilingSprite(texture,width,width);
    }
    window.background = background
})(window)