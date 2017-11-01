/**
 * Created by zhouhui on 2016/12/22.
 */
console.info("已经加载文件：ninja.js");
//忍者对象
(function (window) {
    var ninja = function (frame, y) {
        this.body = new PIXI.extras.AnimatedSprite(frame);
        this.life = 4; //生命值
        this.atk = 1;//攻击力
        this.def = 1;//防御力
        this.jumpspeed = 0;//跳起时候的速度
        this.isjump = false;//是否跳起（true为跳起，false为没有跳起）
        this.isdrop = false;//是否落下（true为落下，false为没有落下）
        this.jumpcount = 0;//跳起的次数
        this.maxdartNum = 5;//最大的飞镖数量
        this.dartNum = 5;//当前飞镖的数量初始5个，可以充能
        this.goldnum = 0;
        this.istime = false;
        this.progressrate = 4; //最大值56
        this.killnum = {"fatboss": 0, "bomb": 0, "crocodile": 0, "dragon": 0};
        //忍者初始化，将贴图添加到游戏中
        this.setinit = function () {
            this.body.anchor.set(0.5, 0.5);//设置锚点
            this.body.position.set(200, y);//设置所在的位置
            this.startRun();//设置动画的效果
            level.ninjaContainer.addChild(this.body);
            window.setdartnumpic = new numpic(2, 120, 80, dartnumpic);
            setdartnumpic.setDartNumPic();
        }
        this.startRun = function () {
            this.body.animationSpeed = 0.3;
            this.body.play();
        }
        this.stopRun = function () {
            this.body.gotoAndStop(3);
        }
        //跳跃的方法
        this.jump = function () {
            if (this.jumpcount < 2 && !ispause && !isgameove) {
                this.jumpspeed = 6;
                this.isjump = true;
                if (this.jumpcount == 0) {
                    this.body.gotoAndStop(3);
                } else {
                    this.body.gotoAndStop(4);
                }
                this.jumpcount += 1;
            }
        }
        //投掷飞镖的方法
        this.throwdart = function () {
            if (this.dartNum > 0 && !ispause && !isgameove) {
                var frames = [];
                for (var i = 1; i < 5; i++) {
                    frames.push(PIXI.Texture.fromFrame("jineng3_" + i + ".png"));
                }
                var pdart = new dart(frames);
                pdart.setinit();
                this.dartNum--;
                if (this.maxdartNum > this.dartNum && !this.istime) {
                    this.istime = true;
                    pbar.width = 0;
                }
                setdartnumpic.setDartNumPic();
            }
        }
        this.gameove = function () {
            ninjagame.Stage.removeChild(life);//血条清空
            pause.interactive = false;//暂停按钮的事件无效
            this.body.stop();
            var frames = [];
            for (var i = 1; i < 6; i++) {
                frames.push(PIXI.Texture.fromFrame("tx5_" + i + ".png"))
            }
            this.body.textures = frames;
            this.body.loop = true;
            this.body.animationSpeed = 0.1;
            this.body.play();
            var flag = 0;
            this.body.onFrameChange = function () {
                if (pninja.body.currentFrame == 4) {
                    flag++;
                }
                if (flag == 1) {
                    pninja.body.stop();
                    level.bossContainer.destroy();
                    level.bossList = [];
                    level.ninjaContainer.destroy();
                    level.coinContainer.destroy();
                    //添加失败的标题
                    var failedpic = new PIXI.Sprite(PIXI.Texture.fromFrame("shibaititle.png"));
                    failedpic.anchor.set(0.5, 0.5);
                    failedpic.position.set(device.screenWidth / 2, 150);
                    failedpic.tint = 0x0b5f8e;
                    ninjagame.Stage.addChild(failedpic);
                    if (level.level == 1) {
                        //分数比之前出入的数据小
                        var g = localStorage.getItem("level1");
                        if (g != null) {
                            if (g < pninja.goldnum) {
                                localStorage.setItem("level1", pninja.goldnum);
                            }
                        } else {
                            localStorage.setItem("level1", pninja.goldnum);
                        }
                    } else if (level.level == 2) {
                        //分数比之前出入的数据小
                        var g = localStorage.getItem("level2");
                        if (g != null) {
                            if (g < pninja.goldnum) {
                                localStorage.setItem("level2", pninja.goldnum);
                            }
                        } else {
                            localStorage.setItem("level2", pninja.goldnum);
                        }
                    } else if (level.level == 3) {
                        //分数比之前出入的数据小
                        var g = localStorage.getItem("level3");
                        if (g != null) {
                            if (g < pninja.goldnum) {
                                localStorage.setItem("level3", pninja.goldnum);
                            }
                        } else {
                            localStorage.setItem("level3", pninja.goldnum);
                        }
                    }
                    new messageboard();
                }
            }
        }
        this.gamewin = function () {
            pause.interactive = false;//暂停按钮的事件无效
            level.bossContainer.destroy();
            level.bossList = [];
            level.coinContainer.destroy();
            //添加失败的标题
            var failedpic = new PIXI.Sprite(PIXI.Texture.fromFrame("wintitle.png"));
            failedpic.anchor.set(0.5, 0.5);
            failedpic.position.set(device.screenWidth / 2, 150);
            failedpic.tint = 0x9d0212;
            ninjagame.Stage.addChild(failedpic);
            if (level.level == 1) {
                //分数比之前出入的数据小
                var g = localStorage.getItem("level1");
                if (g != null) {
                    if (g < pninja.goldnum) {
                        localStorage.setItem("level1", pninja.goldnum);
                    }
                } else {
                    localStorage.setItem("level1", pninja.goldnum);
                }
            } else if (level.level == 2) {
                //分数比之前出入的数据小
                var g = localStorage.getItem("level2");
                if (g != null) {
                    if (g < pninja.goldnum) {
                        localStorage.setItem("level2", pninja.goldnum);
                    }
                } else {
                    localStorage.setItem("level2", pninja.goldnum);
                }
            } else if (level.level == 3) {
                //分数比之前出入的数据小
                var g = localStorage.getItem("level3");
                if (g != null) {
                    if (g < pninja.goldnum) {
                        localStorage.setItem("level3", pninja.goldnum);
                    }
                } else {
                    localStorage.setItem("level3", pninja.goldnum);
                }
            }
            new messageboard();
        }
    }
    window.ninja = ninja;
    //忍者释放的飞镖的对象
    var dart = function (frame) {
        this.body = new PIXI.extras.AnimatedSprite(frame);
        this.setinit = function () {
            this.body.anchor.set(0.5, 0.5);
            this.body.scale.set(0.6, 0.6);
            this.body.position.set(pninja.body.position.x + 20, pninja.body.position.y + 20);
            this.body.animationSpeed = 0.7;
            this.body.play();
            level.dartList.push(this);
            level.ninjaContainer.addChild(this.body);
        }
    }
    window.dart = dart;
    //添加硬币对象
    var coin = function () {
        var frames = [];
        for (var i = 1; i < 4; i++) {
            frames.push(PIXI.Texture.fromFrame("jinbi" + i + ".png"));
        }
        var everycoin = new PIXI.extras.AnimatedSprite(frames);
        everycoin.anchor.set(0.5, 0.5);
        everycoin.scale.set(0.7, 0.7);
        everycoin.animationSpeed = 0.05;
        everycoin.play();
        return everycoin
    }
    //创建金币组
    var coingroup = function () {
        this.setlinegroup = function (plane) {
            var num = Math.round(plane.getBounds().width / 30);
            for (var i = 0; i < num; i++) {
                var ecoin = new coin();
                ecoin.position.set(plane.position.x + 30 * i, plane.position.y - plane.getBounds().height + 30);
                level.coinList.push(ecoin);
                level.coinContainer.addChild(ecoin);
            }
        }
        this.setcurvegroup = function (plane) {
            var num = Math.round(plane.getBounds().width / 30);
            for (var i = 0; i < 11; i++) {
                var ecoin = new coin();
                ecoin.position.set(plane.position.x + 30 * i, plane.position.y - plane.texture.height - Math.sin(Math.PI / 10 * i) * 100 - 20);
                level.coinList.push(ecoin);
                level.coinContainer.addChild(ecoin);
            }
        }
    }
    window.coingroup = coingroup;
    //设置数字的贴图(位数，开始x坐标，y坐标，存放的数组)
    var numpic = function (digits, startsitex, startsitey, arr) {
        if (digits > 0) {
            for (var i = 1; i <= digits; i++) {
                var num = new PIXI.Sprite(PIXI.Texture.fromFrame("j0.png"));
                num.anchor.set(0.5, 0.5);
                num.scale.set(1, 1);
                num.position.set(startsitex + i * 20, startsitey);
                arr.push(num);
                ninjagame.Stage.addChild(num);
            }
        }
        //飞镖数量贴图的变换
        this.setDartNumPic = function () {
            if (pninja.dartNum < 10) {
                dartnumpic[0].texture = PIXI.Texture.fromFrame("j0.png");
                dartnumpic[1].texture = PIXI.Texture.fromFrame("j" + pninja.dartNum + ".png");
            } else {
                dartnumpic[0].texture = PIXI.Texture.fromFrame("j" + parseInt(pninja.dartNum / 10) + ".png");
                dartnumpic[1].texture = PIXI.Texture.fromFrame("j" + (pninja.dartNum - parseInt(pninja.dartNum / 10) * 10) + ".png");
            }
        }
        //金币数量贴图的变换
        this.setGoldNumPic = function () {
            var len = (pninja.goldnum + "").length,//获取得分的位数
                listlen = goldnumpic.length;//获取贴图的长度位数
            for (var i = 0; i < len; i++) {
                var v = pninja.goldnum + ""
                goldnumpic[listlen - len + i].texture = PIXI.Texture.fromFrame("j" + v.substr(i, 1) + ".png");
            }
        }
    }
    window.numpic = numpic;
    var progress = function () {
        this.createprogress = function () {
            var progressback = new PIXI.Sprite(PIXI.Texture.fromFrame("progressback.png"));
            progressback.position.set(130, 55);
            ninjagame.Stage.addChild(progressback);
            var progressbar = new PIXI.Sprite(PIXI.Texture.fromFrame("progressbar.png"));
            progressbar.position.set(132, 56);
            progressbar.width = 56;
            ninjagame.Stage.addChild(progressbar);
            return progressbar;
        }
    }
    window.progress = progress;

    var skillboom = function (x, y) {
        var boomframes = [];
        for (var i = 2; i < 4; i++) {
            boomframes.push(PIXI.Texture.fromFrame("shoulei" + i + ".png"));
        }
        var boom = new PIXI.extras.AnimatedSprite(boomframes);
        boom.anchor.set(0.5, 0.5);
        boom.scale.set(0.7, 0.7);
        boom.animationSpeed = 0.1;
        boom.position.set(x, y);
        boom.loop = false;
        boom.play();
        ninjagame.Stage.addChild(boom);
        boom.onComplete = function () {
            boom.destroy();
        }
        return boom
    }
    window.skillboom = skillboom;

    /**
     * boss根据移动的距离释放技能
     * */
    var dragonboss = function () {
        this.body = null;
        this.frames = [];
        this.life = 10;//生命值
        this.lightningNum = 0;
        this.firingNum = 0;
        this.phases = 0;//攻击阶段，0、飞入屏幕（固定位置）；1、向上飞；2、释放闪电球；3、往下飞；4、接近忍者；5、喷火；6、boss和火焰向前移动；7、退回喷火的开始位置；8、退回到固定位置；
        this.fireskill = null;
        this.fired = false;//当前释放火焰技能是否已经命中一次
        this.setinit = function () {
            if (this.frames.length != 0) {
                this.frames = [];
            }
            for (var i = 1; i < 5; i++) {
                this.frames.push(PIXI.Texture.fromFrame("boss1_" + i + ".png"));
            }
            this.frames.push(PIXI.Texture.fromFrame("boss1_2.png"));
            this.frames.push(PIXI.Texture.fromFrame("boss1_1.png"));
            this.frames.push(PIXI.Texture.fromFrame("boss1_5.png"));
            this.body = new PIXI.extras.AnimatedSprite(this.frames);
            this.body.anchor.set(0.5, 0.5);
            this.body.animationSpeed = 0.1;
            this.body.scale.set(0.8, 0.8);
            this.body.play();
            this.body.onFrameChange = function(){
                if(finalboss.body.currentFrame == 5){
                    finalboss.body.gotoAndPlay(0);
                }
            }
            level.bossContainer.addChild(this.body);
        }
        this.fireAttack = function () {
            this.body.gotoAndStop(6);
            var fireframes = [];
            for (var i = 1; i < 4; i++) {
                fireframes.push(PIXI.Texture.fromFrame("jineng1_" + i + ".png"));
            }
            this.fireskill = new PIXI.extras.AnimatedSprite(fireframes);
            this.fireskill.animationSpeed = 0.05;
            this.fireskill.loop = true;;
            this.fireskill.anchor.set(0, 1);
            this.fireskill.scale.set(0.5, 0.5);
            this.fireskill.position.set(this.body.position.x - 240, this.body.position.y +160);
            this.fireskill.play();
            ninjagame.Stage.addChild(this.fireskill);
            finalboss.phases = 6;
        }
        this.lightningAttack = function () {
            if (this.lightningNum < 60) {
                var lightingFrames = [];
                for (var i = 1; i < 3; i++) {
                    lightingFrames.push(PIXI.Texture.fromFrame("txdian_" + i + ".png"));
                }
                if (this.body.currentFrame == 2) {
                    if (this.lightningNum % 15 == 0) {
                        var lightingball = new PIXI.extras.AnimatedSprite(lightingFrames);
                        lightingball.anchor.set(0.5, 0.5);
                        lightingball.scale.set(0.5, 0.5);
                        lightingball.animationSpeed = 0.1;
                        lightingball.position.set(finalboss.body.position.x-50, finalboss.body.position.y+30);
                        lightingball.play();
                        level.lightingBall.push(lightingball);
                        ninjagame.Stage.addChild(lightingball);
                    }
                    this.lightningNum++;
                }
            }else{
                this.phases = 3;
                this.lightningNum = 0;
            }
        }
        this.fly = function(){
            this.fireskill.destroy();
            this.fireskill = null;
            this.body.gotoAndPlay(0);
            this.body.onFrameChange = function(){
                if(finalboss!=null){
                    if(finalboss.body.currentFrame == 5){
                        finalboss.body.gotoAndPlay(0);
                    }
                }
            }
        }
    }
    window.dragonboss = dragonboss;

    var fatboss = function () {
        this.body = null;
        this.frames = [];
        this.life = 1;
        this.flag = "fatboss";
        this.useskilldistance = 850 - Math.random() * 100;
        this.usedskill = false;//是否使用过技能了
        //站立时候的效果
        this.stand = function () {
            if (this.frames.length != 0) {
                this.frames = [];
            }
            for (var i = 1; i < 4; i++) {
                this.frames.push(PIXI.Texture.fromFrame("boss3_" + i + ".png"));
            }
            this.frames.push(PIXI.Texture.fromFrame("boss3_4.png"));
            this.frames.push(PIXI.Texture.fromFrame("boss3_5.png"));
            this.frames.push(PIXI.Texture.fromFrame("boss3_6.png"));
            this.body = new PIXI.extras.AnimatedSprite(this.frames);
            this.body.anchor.set(0.5, 1);
            this.body.animationSpeed = 0.1;
            this.body.scale.set(0.5, 0.5);
            this.body.gotoAndStop(0);
        }
        this.useskill = function () {
            this.usedskill = true;
            this.body.textures = this.frames;
            this.body.loop = false;
            this.body.animationSpeed = 0.1;
            this.body.play();
            var f = this;
            this.body.onComplete = function () {
                //放出火球
                var fireframes = [];
                for (var i = 1; i < 4; i++) {
                    fireframes.push(PIXI.Texture.fromFrame("huoqiu" + i + ".png"));
                }
                var fireball = new PIXI.extras.AnimatedSprite(fireframes);
                fireball.anchor.set(0.5, 0.5);
                fireball.scale.set(0.6, 0.6);
                fireball.animationSpeed = 0.1;
                fireball.position.set(f.body.position.x, f.body.position.y - f.body.getBounds().height / 2);
                fireball.play();
                level.bossContainer.addChild(fireball);
                level.skillList.push(fireball);
                //重置站立状态
                f.frames = [];
                for (var i = 1; i < 4; i++) {
                    f.frames.push(PIXI.Texture.fromFrame("boss3_" + i + ".png"));
                }
                f.body.textures = f.frames;
                f.body.loop = true;
                f.body.animationSpeed = 0.1;
                f.body.play();
            }
        }
    }
    window.fatboss = fatboss;

    var crocodileboss = function () {
        this.body = null;
        this.frames = [];
        this.life = 1;
        this.flag = "crocodile";
        this.useskilldistance = 750 + Math.random() * 40;
        this.usedskill = false;//是否使用过技能了
        //站立时候的效果
        this.stand = function () {
            if (this.frames.length != 0) {
                this.frames = [];
            }
            this.frames.push(PIXI.Texture.fromFrame("boss2_4.png"));
            this.frames.push(PIXI.Texture.fromFrame("boss2_5.png"));
            this.frames.push(PIXI.Texture.fromFrame("boss2_6.png"));
            this.body = new PIXI.extras.AnimatedSprite(this.frames);
            this.body.anchor.set(0.5, 1);
            this.body.animationSpeed = 0.05;
            this.body.scale.set(0.5, 0.5);
            this.body.gotoAndStop(0);
        }
        this.useskill = function () {
            this.body.loop = false;
            var ff = this.body;
            this.body.onComplete = function () {
                //放出火球
                var fireframes = [];
                for (var i = 1; i < 4; i++) {
                    fireframes.push(PIXI.Texture.fromFrame("b" + i + " (2).png"));
                }
                var fireball = new PIXI.extras.AnimatedSprite(fireframes);
                fireball.anchor.set(0.5, 0.5);
                fireball.scale.set(0.4, 0.4);
                fireball.animationSpeed = 0.1;
                fireball.position.set(ff.position.x - ff.getBounds().width / 2, ff.position.y - ff.getBounds().height / 2);
                fireball.play();
                level.bossContainer.addChild(fireball);
                level.skillList.push(fireball);
                ff.gotoAndStop(0);
            }
            this.body.play();
        }
    }
    window.crocodileboss = crocodileboss;

    //炸弹对象
    var bomb = function () {
        this.body = new PIXI.Sprite(PIXI.Texture.fromFrame("shoulei1.png"));
        this.life = 1;
        this.usedskill = true;
        this.flag = "bomb";
        this.setinit = function (x, y) {
            this.body.anchor.set(0.5, 0.5);
            this.body.position.set(x, y);
            level.bossList.push(this);
            level.bossContainer.addChild(this.body);
        }
    }
    window.bomb = bomb;

    //加血加蓝的药
    var redmedicine = function () {
        this.body = new PIXI.Sprite(PIXI.Texture.fromFrame("dj2.png"));
        this.flag = "redmedicine";
        this.setinit = function (x, y) {
            this.body.anchor.set(0.5, 0.5);
            this.body.scale.set(0.7, 0.7);
            this.body.position.set(x, y);
            ninjagame.Stage.addChild(this.body);
        }
    }
    window.redmedicine = redmedicine;

    //信息板，显示游戏结束时候的数据统计
    var messageboard = function () {
        //金币的贴图
        var coinframes = [];
        for (var i = 1; i < 4; i++) {
            coinframes.push(PIXI.Texture.fromFrame("jinbi" + i + ".png"));
        }
        var count_coin = new PIXI.extras.AnimatedSprite(coinframes);
        count_coin.anchor.set(0.5, 0.5);
        count_coin.scale.set(1, 1);
        count_coin.animationSpeed = 0.05;
        count_coin.play();
        count_coin.position.set(250, 220);
        ninjagame.Stage.addChild(count_coin);
        //炸弹的贴图
        var bombframes = [];
        bombframes.push(PIXI.Texture.fromFrame("shoulei1.png"));
        var count_bomb = new PIXI.extras.AnimatedSprite(bombframes);
        count_bomb.anchor.set(0.5, 0.5);
        count_bomb.scale.set(1.3, 1.3);
        count_bomb.animationSpeed = 0.05;
        count_bomb.play();
        count_bomb.position.set(250, 270);
        ninjagame.Stage.addChild(count_bomb);
        //胖子boss
        var fatbossframes = [];
        for (var i = 1; i < 4; i++) {
            fatbossframes.push(PIXI.Texture.fromFrame("boss3_" + i + ".png"));
        }
        var count_fatboss = new PIXI.extras.AnimatedSprite(fatbossframes);
        count_fatboss.anchor.set(0.5, 0.5);
        count_fatboss.scale.set(0.3, 0.3);
        count_fatboss.animationSpeed = 0.05;
        count_fatboss.play();
        count_fatboss.position.set(250, 330);
        ninjagame.Stage.addChild(count_fatboss);
        //鳄鱼boss
        var crocodilebossframes = [];
        crocodilebossframes.push(PIXI.Texture.fromFrame("boss2_4.png"));
        var count_crocodileboss = new PIXI.extras.AnimatedSprite(crocodilebossframes);
        count_crocodileboss.anchor.set(0.5, 0.5);
        count_crocodileboss.scale.set(0.3, 0.3);
        count_crocodileboss.animationSpeed = 0.05;
        count_crocodileboss.play();
        count_crocodileboss.position.set(250, 370);
        ninjagame.Stage.addChild(count_crocodileboss);
        //龙boss
        var dragonbossframes = [];
        for (var i = 1; i < 5; i++) {
            dragonbossframes.push(PIXI.Texture.fromFrame("boss1_" + i + ".png"));
        }
        var count_dragonboss = new PIXI.extras.AnimatedSprite(dragonbossframes);
        count_dragonboss.anchor.set(0.5, 0.5);
        count_dragonboss.scale.set(0.3, 0.3);
        count_dragonboss.animationSpeed = 0.05;
        count_dragonboss.play();
        count_dragonboss.position.set(250, 430);
        ninjagame.Stage.addChild(count_dragonboss);
        //获得的金币数量以及消灭的敌人数量
        var data = [pninja.goldnum, pninja.killnum.bomb, pninja.killnum.fatboss, pninja.killnum.crocodile, pninja.killnum.dragon];
        var style = {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#F7EDCA',
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: false,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        };
        for (var i = 0; i < 5; i++) {
            var basicText = new PIXI.Text(data[i] + "", style);
            basicText.anchor.set(0.5, 0.5);
            basicText.position.set(500, 220 + 50 * i);
            ninjagame.Stage.addChild(basicText);
        }
        //重玩按钮
        var restart = new PIXI.Sprite(PIXI.Texture.fromFrame("chongwan.png"));
        restart.anchor.set(0.5, 0.5);
        restart.position.set(440, 500);
        restart.interactive = true;
        ninjagame.Stage.addChild(restart);
        restart.on("mousedown", restartaction);
        restart.on("touchstart", restartaction);
        function restartaction() {
            ninjagame.clearStage();//清空舞台
            delete window.ispause;
            delete window.pausemenu;
            delete window.gamecountdown;
            delete window.pause;
            delete window.menurun;
            delete window.dartnumpic;
            delete window.goldnumpic;
            cancelAnimationFrame(animationID);
            ninjagame.gameScene(level.level);
        }

        //返回首页的按钮
        var homepage = new PIXI.Sprite(PIXI.Texture.fromFrame("caidan.png"));
        homepage.anchor.set(0.5, 0.5);
        homepage.position.set(350, 500);
        homepage.interactive = true;
        ninjagame.Stage.addChild(homepage);
        homepage.on("mousedown", homepageaction);
        homepage.on("touchstart", homepageaction);
        function homepageaction() {
            ninjagame.clearStage();//清空舞台
            delete window.ispause;
            delete window.pausemenu;
            delete window.gamecountdown;
            delete window.pause;
            delete window.menurun;
            delete window.dartnumpic;
            delete window.goldnumpic;
            cancelAnimationFrame(animationID);
            ninjagame.startScene();
        }
    }
    window.messageboard = messageboard;
})(window);


