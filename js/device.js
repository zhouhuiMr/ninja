/**
 * Created by zhouhui on 2016/12/16.
 * 判断打开的浏览器所在的设备是移动端还是pc端
 */
(function(window){
    var device = function(){
        this.screenWidth= document.documentElement.clientWidth;//屏幕的宽度
        this.screenHeight = document.documentElement.clientHeight;//屏幕的高度
        this.toleft = 0;
        this.totop = 0;
        //判断当前使用的设备
        this.judgeeDevice = function(){
            if(this.screenWidth >800){
                this.toleft = (this.screenWidth - 800)/2;
                this.totop = (this.screenHeight-600)/2
                this.screenWidth = 800;
                this.screenHeight= 600;
            }
            var p =navigator.platform.toLocaleLowerCase();//获取设备的平台
            if(p.indexOf("win")==0 ||p.indexOf("mac")==0){
                //这是pc端
            }else{
                //手机端（添加按钮进行控制）
                //向页面中添加按钮
                document.getElementById("bt_left").style.display = 'block';
                // document.getElementById("bt_right1").style.display = 'block';
                document.getElementById("bt_right2").style.display = 'block';
            }
            document.getElementsByTagName("body")[0].onclick = function(){}
            document.getElementsByTagName("body")[0].addEventListener('touchstart',function(){});
            document.getElementsByTagName("body")[0].addEventListener('touchend',function(){});
        }
    }
    window.device = new device();
})(window);
device.judgeeDevice();
//初始化容器的大小
document.getElementById("gamestage").style.width =  device.screenWidth +"px";
document.getElementById("gamestage").style.height = device.screenHeight + "px";
document.getElementById("gamestage").style.marginTop = device.totop+"px";
//设置加载动画所在的位置
document.getElementById("loadingspan").style.left = (device.screenWidth/2-150+device.toleft)+"px";
document.getElementById("loadingspan").style.top = (device.screenHeight/2-150+device.totop)+"px";