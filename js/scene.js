/**
 * Created by zhouhui on 2016/12/23.
 */
console.info("已经加载文件：scene.js");
window.animationID = null;
(function (window) {
    var scene = function () {
        this.renderer = new PIXI.autoDetectRenderer(device.screenWidth, device.screenHeight, {
            backgroundColor: 0xFAEBD7
        });
        this.Stage = new PIXI.Container();
        this.clearStage = function () {
            this.Stage.removeChildren(0, this.Stage.children.length);//清空界面
        }
        //开始的菜单界面
        this.startScene = function () {
            //添加背景及左侧的小人
            window.homebg = new PIXI.Sprite(resources.homebg1.texture);
            this.Stage.addChild(homebg);
            window.homebg_p = new PIXI.Sprite(resources.homebg2.texture);
            homebg_p.anchor.set(0, 1);
            homebg_p.position.set(-(resources.homebg2.texture.width), device.screenHeight);
            this.Stage.addChild(homebg_p);

            //添加标题
            var titletexture = PIXI.Texture.fromFrame("title2.png");
            window.title = new PIXI.Sprite(titletexture);
            title.position.set(device.screenWidth / 2, titletexture.height / 2);
            title.anchor.set(0.5, 0.5);
            title.scale.set(3, 3);
            this.Stage.addChild(title);

            //添加开始按钮
            window.isBTMove = false;
            var playbacktexture = PIXI.Texture.fromFrame("playdi.png");
            window.playback = new PIXI.Sprite(playbacktexture);
            playback.anchor.set(0.5, 0.5);
            playback.position.set(device.screenWidth / 2, titletexture.height);
            playback.interactive = true;
            //添加点击事件
            playback.on('mousedown', startplay);
            playback.on('touchstart', startplay);
            this.Stage.addChild(playback);

            function startplay() {
                playback.interactive = false;//取消点击事件
                var frames = [];
                for (var i = 1; i < 4; i++) {
                    frames.push(PIXI.Texture.fromFrame("daoguang" + i + ".png"));
                }
                window.lightanimation = new PIXI.extras.AnimatedSprite(frames);
                lightanimation.anchor.set(0.5, 0.5);
                lightanimation.position.set(device.screenWidth / 2, titletexture.height);
                lightanimation.animationSpeed = 0.2;
                lightanimation.loop = false;
                //设置完成后的执行的方法
                lightanimation.onComplete = function () {
                    ninjagame.Stage.removeChild(lightanimation);
                    ninjagame.Stage.removeChild(playback);
                    delete playback;
                    isBTMove = true;
                }
                lightanimation.play();
                ninjagame.Stage.addChild(lightanimation);
            }

            window.playtop = new PIXI.Sprite(PIXI.Texture.fromFrame("play1.png"));
            playtop.position.set(device.screenWidth / 2, titletexture.height);
            playtop.anchor.set(0.5, 0.5);
            this.Stage.addChild(playtop);

            window.playbot = new PIXI.Sprite(PIXI.Texture.fromFrame("play2.png"));
            playbot.position.set(device.screenWidth / 2, titletexture.height);
            playbot.anchor.set(0.5, 0.5);
            this.Stage.addChild(playbot);

            //创建樱花的类
            window.sakuraList = new Array();
            var frames = [];
            for (var i = 1; i < 11; i++) {
                if (i > 5) {
                    frames.push(PIXI.Texture.fromFrame("huaban" + (i - 2 * (i - 5) + 1) + ".png"));
                } else {
                    frames.push(PIXI.Texture.fromFrame("huaban" + i + ".png"));
                }
            }
            var sakura = function () {
                this.body = new PIXI.extras.AnimatedSprite(frames);
            }
            for (var i = 0; i < 50; i++) {
                var s = new sakura();
                s.body.position.set(Math.random() * device.screenWidth, Math.random() * device.screenHeight);
                s.body.animationSpeed = 0.05;
                s.body.anchor.set(0.5, 0.5);
                s.body.scale.x = s.body.scale.y = Math.random() * 0.5 + 0.5;
                s.body.gotoAndPlay(Math.round(Math.random() * 10));
                sakuraList.push(s);
                this.Stage.addChild(s.body);
            }
            startSceneAnimation();
        }
        //关卡选择界面
        this.courseScene = function () {
            window.countdown = null;
            window.loadgame = null;
            //设置背景
            window.homebg = new PIXI.Sprite(resources.homebg1.texture);
            this.Stage.addChild(homebg);
            //设置返回按钮
            var bt_back = new PIXI.Sprite(PIXI.Texture.fromFrame("qianjin.png"));
            bt_back.anchor.set(0.5, 0.5);
            bt_back.scale.set(1.3, 1.3);
            bt_back.position.set(35, 35);
            bt_back.rotation = 3.1;
            bt_back.interactive = true;
            bt_back.on("mousedown", backmenu);
            bt_back.on("touchstart", backmenu);
            this.Stage.addChild(bt_back);
            //返回首页菜单
            function backmenu() {
                if (countdown != null) {
                    countdown.stop();
                    loadgame.stop();
                }
                ninjagame.clearStage();//清空舞台
                cancelAnimationFrame(animationID);
                delete window.homebg;
                delete window.selectpan;
                delete window.countdown;
                delete window.loadgame;
                ninjagame.startScene();
            }

            //添加关卡
            for (var i = 1; i < 4; i++) {
                var level = new PIXI.Sprite(PIXI.Texture.fromFrame("xiaoguan" + i + ".png"));
                level.position.set((i - 1) * 246 + 15 * i, 200);
                level.scale.set(1.5, 1.5);
                this.Stage.addChild(level);
                //添加关卡名称
                var levelname = new PIXI.Sprite(PIXI.Texture.fromFrame("g" + i + ".png"));
                levelname.scale.set(0.6, 0.6);
                levelname.position.set((i - 1) * 246 + 15 * i + 60, 340);
                this.Stage.addChild(levelname);
                level.interactive = true;
                window.selectpan = null;
                level.on("mousedown", select);
                level.on("touchstart", select);

                //设置关卡的星级
                var g = localStorage.getItem("level" + i);
                var l = 0;
                if (g == null) {
                    l = 0;
                }
                if (g >= 100 && g <= 200) {
                    l = 1;
                } else if (g > 200 && g <= 300) {
                    l = 2;
                } else if (g > 300) {
                    l = 3;
                }
                for (var j = 0; j < 3; j++) {
                    //星星
                    var star = null;
                    if (j >= l) {
                        star = new PIXI.Sprite(PIXI.Texture.fromFrame("xing1 (2).png"));
                    } else {
                        star = new PIXI.Sprite(PIXI.Texture.fromFrame("xing2 (2).png"));
                    }
                    star.position.set((i - 1) * 246 + 15 * i + j * 40 + 70, 270);
                    this.Stage.addChild(star);
                }
                //添加飞镖
                var dart1 = new PIXI.Sprite(PIXI.Texture.fromFrame("feibiao1.png"));
                dart1.scale.set(0.6, 0.6);
                dart1.position.x = level.position.x;
                dart1.position.y = level.position.y;
                this.Stage.addChild(dart1);
                var dart2 = new PIXI.Sprite(PIXI.Texture.fromFrame("feibiao2.png"));
                dart2.scale.set(0.6, 0.6);
                dart2.position.x = level.position.x + 190;
                dart2.position.y = level.position.y;
                this.Stage.addChild(dart2);
            }
            //点击选择关卡
            function select() {
                if (countdown != null) {
                    countdown.stop();
                    loadgame.stop();
                    ninjagame.Stage.removeChild(countdown);
                    ninjagame.Stage.removeChild(loadgame);
                }
                if (selectpan == null) {
                    window.selectpan = new PIXI.Sprite(PIXI.Texture.fromFrame("selectkuang.png"));
                    selectpan.scale.set(1.5, 1.5);
                    selectpan.position.x = this.position.x;
                    selectpan.position.y = this.position.y;
                    ninjagame.Stage.addChild(selectpan);
                } else {
                    selectpan.position.x = this.position.x;
                    selectpan.position.y = this.position.y;
                }
                var frames = [];
                var framesload = [];
                for (var i = 3; i > 0; i--) {
                    frames.push(PIXI.Texture.fromFrame(i + " (3).png"));
                    framesload.push(PIXI.Texture.fromFrame("loadgame" + i + ".png"));
                }
                countdown = new PIXI.extras.AnimatedSprite(frames);
                countdown.animationSpeed = 0.02;
                countdown.anchor.set(0.5, 0.5);
                countdown.position.set(device.screenWidth / 2, 150);
                countdown.loop = false;
                countdown.play();
                countdown.onComplete = function () {
                    //计算选择的关卡
                    var site = selectpan.position.x;
                    var gamelevel = -1;
                    if (site < 200) {
                        gamelevel = 1;//选择第一关
                    } else if (site > 200 && site < 300) {
                        gamelevel = 2;//选择第二关
                    } else {
                        gamelevel = 3;//选择第二关
                    }
                    ninjagame.clearStage();//清空舞台
                    cancelAnimationFrame(animationID);
                    delete window.homebg;
                    delete window.selectpan;
                    delete window.countdown;
                    delete window.loadgame;
                    ninjagame.gameScene(gamelevel);//开始游戏界面
                }
                ninjagame.Stage.addChild(countdown);
                loadgame = new PIXI.extras.AnimatedSprite(framesload);
                loadgame.anchor.set(1, 1);
                loadgame.position.set(device.screenWidth - 20, device.screenHeight - 20);
                loadgame.animationSpeed = 0.05;
                loadgame.play();
                ninjagame.Stage.addChild(loadgame);
            }

            courseSceneAnimation();
        }
        //游戏场景界面(参数选择的关卡)
        this.gameScene = function (gamelevel) {
            var fartexture = null;
            var midtexture = null;
            window.isgameove = false;//游戏是否已经结束
            window.ispause = false;//判断游戏是否暂停（true为暂停，false为正在运行）
            window.pausemenu = new Array();//存放菜单对象
            window.dartnumpic = new Array();//存放飞镖个数的图片贴图
            window.goldnumpic = new Array();//存放获得金币数量的图片贴图
            window.gamecountdown = null;//开始倒计时
            window.pause = null;//暂停按钮
            window.menurun = false;
            window.planmoveSpeed = 2;//道路的移动速度
            window.pninja = null;
            //添加按钮的点击事件
            var keydown = true;
            document.onkeydown = function (event) {
                var e = event || window.event;
                switch (e.keyCode) {
                    case 87: //w
                        pninja.jump();
                        break;
                    case 74: //j
                        pninja.throwdart();
                        break;
                    case 32:
                        if (keydown) {
                            gamepause();
                        }
                        break;
                }
            }
            document.getElementById("bt_left").onclick = function () {
                pninja.jump();
            }
            document.getElementById("bt_right2").onclick = function () {
                pninja.throwdart();
            }
            //背景
            if (gamelevel == 1) {
                fartexture = resources.farback1.texture;
                midtexture = resources.nearback1.texture;
            } else if (gamelevel == 2) {
                fartexture = resources.farback2.texture;
                midtexture = resources.nearback2.texture;
            } else {
                fartexture = resources.farback3.texture;
                midtexture = resources.nearback3.texture;
            }
            window.farbg = new PIXI.extras.TilingSprite(fartexture, device.screenWidth, device.screenHeight);
            this.Stage.addChild(farbg);
            window.midbg = new PIXI.extras.TilingSprite(midtexture, device.screenWidth, midtexture.height);
            midbg.anchor.set(0, 1);
            midbg.position.y = device.screenHeight;
            this.Stage.addChild(midbg);
            if (window.level != null) {
                delete window.level;
            }
            if (gamelevel == 1) {
                window.level = new GameLevel1();
                level.initPlane();
            } else if (gamelevel == 2) {
                window.level = new GameLevel2();
                level.initPlane();
            } else if (gamelevel == 3) {
                window.level = new GameLevel3();
                level.initPlane();
            }
            //添加暂停按钮
            pause = new PIXI.Sprite(PIXI.Texture.fromFrame("pause.png"));
            pause.anchor.set(1, 0);
            pause.position.set(device.screenWidth - 20, 20);
            this.Stage.addChild(pause);
            pause.interactive = true;
            pause.on("mousedown", gamepause);
            pause.on("touchstart", gamepause);
            function gamepause() {
                if (ispause && gamecountdown == null) {
                    pause.interactive = false;
                    keydown = false;
                    menurun = true;
                    var frames = [];
                    for (var i = 3; i > 0; i--) {
                        frames.push(PIXI.Texture.fromFrame(i + " (3).png"));
                    }
                    gamecountdown = new PIXI.extras.AnimatedSprite(frames);
                    gamecountdown.animationSpeed = 0.02;
                    gamecountdown.anchor.set(0.5, 0.5);
                    gamecountdown.position.set(device.screenWidth / 2, 250);
                    gamecountdown.loop = false;
                    gamecountdown.play();
                    gamecountdown.onComplete = function () {
                        pause.interactive = true;
                        ispause = false;//开始继续游戏
                        //忍者的动画继续执行
                        pninja.body.play();
                        for (var i = 0; i < pausemenu.length; i++) {
                            ninjagame.Stage.removeChild(pausemenu[i]);
                        }
                        pausemenu = [];
                        ninjagame.Stage.removeChild(this);
                        gamecountdown = null;
                        menurun = false;
                        keydown = true;
                    }
                    ninjagame.Stage.addChild(gamecountdown);
                } else {
                    ispause = true;//暂停游戏
                    //忍者的动画效果停止
                    pninja.body.stop();
                    keydown = true;
                    //添加菜单
                    var menulist = ["qianjin.png", "caidan.png", "chengjiu.png", "chongwan.png"];
                    for (var i = 0; i < 4; i++) {
                        var menu = new PIXI.Sprite(PIXI.Texture.fromFrame(menulist[i]));
                        if (i == 0) {
                            menu.rotation = 3.1;
                        }
                        menu.anchor.set(0.5, 0.5);
                        menu.position.set(90 * i + device.screenWidth, 40);
                        // menu.interactive = true;
                        menu.on("mousedown", menuselect);
                        menu.on("touchstart", menuselect);
                        pausemenu.push(menu);
                        ninjagame.Stage.addChild(menu);
                    }
                    function menuselect() {
                        ninjagame.clearStage();//清空舞台
                        cancelAnimationFrame(animationID);
                        delete window.ispause;
                        delete window.pausemenu;
                        delete window.gamecountdown;
                        delete window.pause;
                        delete window.menurun;
                        delete window.dartnumpic;
                        delete window.goldnumpic;
                        if (this.position.x <= 410) {
                            cancelAnimationFrame(animationID);
                            ninjagame.courseScene();
                        } else if (this.position.x > 470 && this.position.x < 520) {
                            cancelAnimationFrame(animationID);
                            ninjagame.startScene();
                        } else if (this.position.x > 550 && this.position.x < 620) {
                            // ninjagame.startScene();
                        } else if (this.position.x > 650 && this.position.x < 690) {
                            cancelAnimationFrame(animationID);
                            ninjagame.gameScene(gamelevel);
                        }
                        this.interactive = false;
                    }
                }
            }

            //添加血条贴图
            var ninjalife = new PIXI.Sprite(PIXI.Texture.fromFrame("bloodback.png"));
            ninjalife.position.set(5, 5);
            this.Stage.addChild(ninjalife);
            window.life = new PIXI.Sprite(PIXI.Texture.fromFrame("blood4.png"));
            life.position.set(5, 5);
            this.Stage.addChild(life);
            //添加金币的贴图
            var gold = new PIXI.Sprite(PIXI.Texture.fromFrame("gold.png"));
            gold.anchor.set(0.5, 0.5);
            gold.scale.set(0.7, 0.7);
            gold.position.set(400, 30);
            this.Stage.addChild(gold);
            //添加飞镖个数的提示
            var dartpic = new PIXI.Sprite(PIXI.Texture.fromFrame("dart.png"));
            dartpic.anchor.set(0.5, 0.5);
            dartpic.scale.set(0.5, 0.5);
            dartpic.position.set(110, 70);
            this.Stage.addChild(dartpic);
            window.setgoldnumpic = new numpic(5, 410, 35, goldnumpic);
            //创建飞镖+1的进度条
            window.pbar = new progress().createprogress();
            //游戏的进度条(直线以及头像 从200到500)
            var gameprogress = new PIXI.Sprite(PIXI.Texture.fromFrame("infoline.png"));
            gameprogress.height = 5;
            gameprogress.width = 200;
            gameprogress.tint = 0xB22222;
            gameprogress.position.set(300, 80);
            this.Stage.addChild(gameprogress);
            window.gamehead = new PIXI.Sprite(PIXI.Texture.fromFrame("head.png"));
            gamehead.anchor.set(0.5, 1);
            gamehead.scale.set(0.7, 0.7);
            gamehead.position.set(300, 80);
            this.Stage.addChild(gamehead);
            var frames = [];
            for (var i = 1; i < 6; i++) {
                frames.push(PIXI.Texture.fromFrame("r1_" + i + ".png"));
            }
            //添加忍者的题图
            if (gamelevel == 1) {
                pninja = new ninja(frames, device.screenHeight - 130);
            } else if (gamelevel == 2) {
                pninja = new ninja(frames, device.screenHeight - 300);
            } else if (gamelevel == 3) {
                pninja = new ninja(frames, device.screenHeight - 290);
            }
            pninja.setinit();
            gameSCeneAnimation();
        }
    }
    window.scene = scene;
})(window);

/**
 * 菜单界面的动画
 * */
function startSceneAnimation() {
    stats.begin();
    if (ninjagame.Stage.children.length > 0) {
        //小人移动的效果
        var p_x = homebg_p.position.x;
        if (p_x < 0) {
            homebg_p.position.x += 10;
        }
        //樱花飘落的效果
        for (var i = 0; i < sakuraList.length; i++) {
            var sakura = sakuraList[i].body;
            sakura.position.y += 3;
            sakura.position.x -= 2;
            sakura.rotation += 0.05;
            if (sakura.position.x < 0 || sakura.position.y > device.screenHeight) {
                sakura.position.set(Math.random() * device.screenWidth, Math.random() * device.screenHeight);
            }
        }
        //标题的动画效果
        if (title.scale.x <= 1.2 || title.scale.y <= 1.2) {
            title.texture = PIXI.Texture.fromFrame("title3.png");
        } else {
            title.scale.x = title.scale.y -= 0.08;
        }
        //按钮的移动效果
        if (isBTMove) {
            playtop.position.x += 40;
            playbot.position.x -= 40;
            if (playbot.position.x < -181) {
                isBTMove = false;
                sakuraList = [];
                ninjagame.clearStage();//清空舞台
                //删除全局变量
                delete window.homebg;
                delete window.homebg_p;
                delete window.title;
                delete window.playtop;
                delete window.playbot;
                delete window.sakuraList;
            }
        }
        ninjagame.renderer.render(ninjagame.Stage);
        requestAnimationFrame(startSceneAnimation);
    } else {
        ninjagame.courseScene();
    }
    stats.end();
}
/**
 * 关卡界面的动画
 * */
function courseSceneAnimation() {
    stats.begin();
    ninjagame.renderer.render(ninjagame.Stage);
    animationID = requestAnimationFrame(courseSceneAnimation);
    stats.end();
}

/**
 * 游戏界面的动画
 * */
function gameSCeneAnimation() {
    stats.begin();
    if (!isgameove) {
        if (!ispause) {
            farbg.tilePosition.x -= 0.2;
            midbg.tilePosition.x -= 1;
            level.movePlane();//道路的移动
            level.thingmove();//其他对象的移动
            pninja.isdrop = true;
            if (gamehead.position.x <= 500) {
                gamehead.position.x += 0.02;
            } else {
                if (level.level == 1 || level.level == 2) {
                    isgameove = true;
                    pninja.gamewin();
                } else if (level.level == 3 && finalboss != null) {
                    if (finalboss.life == 0) {
                        isgameove = true;
                        pninja.gamewin();
                    }
                }
            }
            if (level.level == 1 || level.level == 2 || level.level == 3) {
                if (gamehead.position.x > 490) {
                    level.randomplane = false;
                }
            }
            //添加加血药
            if (level.addredmedicine <= gamehead.position.x) {
                level.redmedicinenum++;
                level.addredmedicine = 390 + 60 * level.redmedicinenum - Math.random() * 20;
                window.predmedicine = new redmedicine();
                var pp = level.planeList[level.planeList.length - 1];
                if (pp.position.y > device.screenHeight) {
                    predmedicine.setinit(pp.position.x, level.planeList[level.planeList.length - 2].position.y - level.planeList[level.planeList.length - 2].texture.height);
                } else {
                    predmedicine.setinit(pp.position.x, pp.position.y - pp.texture.height);
                }

                level.isaddmedicine = true;
            }
            //添加血药之后进行判断
            if (level.redmedicinenum > 0 && level.isaddmedicine) {
                predmedicine.body.position.x -= planmoveSpeed;
                if (pninja.body.containsPoint(predmedicine.body.position) && level.isaddmedicine) {
                    ninjagame.Stage.removeChild(predmedicine.body);
                    delete window.predmedicine;
                    level.isaddmedicine = false;
                    if (pninja.life < 4) {
                        pninja.life++;
                    }
                }
                if (level.isaddmedicine) {
                    if (predmedicine.body.position.x < -30) {
                        ninjagame.Stage.removeChild(predmedicine.body);
                        delete window.predmedicine;
                        level.isaddmedicine = false;
                    }
                }
            }

            for (var i = 0; i < level.planeList.length; i++) {
                var p = level.planeList[i];
                //判断道路贴图是否包含人物的圆点
                if (pninja.body.position.x >= p.position.x && pninja.body.position.x <= p.position.x + p.texture.width) {
                    if (pninja.body.position.y <= p.position.y - p.texture.height + 30 && pninja.body.position.y >= p.position.y - p.texture.height) {
                        pninja.isdrop = false;
                        //跳起速度为零说明跳起过，点击按钮的时候速度被初始化为
                        if (pninja.jumpspeed <= 0) {
                            pninja.jumpcount = 0;
                        }
                        //如果有动画，将动画停到第四帧
                        if (!pninja.body.playing) {
                            pninja.body.play();
                        }
                        if (pninja.body.position.x < 200) {
                            pninja.body.position.x += 2;
                        }
                        break;
                    }
                }
                //碰到墙壁需要向后移动，其速度与道路的移动速度一致
                if (p.position.x - pninja.body.position.x <= pninja.body.texture.width / 2 && p.position.x - pninja.body.position.x > 0) {
                    if (pninja.body.position.y >= p.position.y - p.texture.height) {
                        pninja.body.position.x -= planmoveSpeed;
                        break;
                    }
                }
            }
            //跳起来并且没有达到最高点
            if (pninja.isjump && pninja.jumpspeed > 0) {
                pninja.body.position.y -= (pninja.jumpspeed - 0.2);
                pninja.jumpspeed -= 0.2;
                pninja.isdrop = false;
                if (pninja.body.playing) {
                    pninja.body.gotoAndStop(3);
                }
            }
            //是否开始下落
            if (pninja.isdrop) {
                pninja.body.position.y += 4;
                if (pninja.body.playing) {
                    pninja.body.gotoAndStop(4);
                }
                if (pninja.body.position.y >= device.screenHeight + pninja.body.texture.height) {
                    pninja.life = 0;
                }
            }
            //飞镖重新填充的时间
            if (pninja.istime) {
                pninja.progressrate += 0.5;
                pbar.width = pninja.progressrate;
                if (pninja.progressrate >= 56) {
                    pninja.progressrate = 4;
                    pninja.dartNum += 1;
                    if (pninja.dartNum >= pninja.maxdartNum) {
                        pninja.istime = false;
                    }
                    setdartnumpic.setDartNumPic();
                }
            }
            //判断忍者所剩的血量
            if (pninja.life <= 0) {
                isgameove = true;
                pninja.gameove();
            } else {
                life.texture = PIXI.Texture.fromFrame("blood" + pninja.life + ".png");
            }
        } else if (ispause && !isgameove) {
            //获取第一个菜单的位置
            var site = pausemenu[0].position.x;
            if (site > device.screenWidth / 2) {
                for (var i = 0; i < pausemenu.length; i++) {
                    pausemenu[i].position.x -= 10;
                    pausemenu[i].rotation -= 0.1;
                }
            }
            if (pausemenu[0] != 0 && site <= device.screenWidth / 2) {
                for (var i = 0; i < pausemenu.length; i++) {
                    if (i == 0) {
                        pausemenu[i].rotation = 3.1;
                    } else {
                        pausemenu[i].rotation = 0;
                    }
                    pausemenu[i].interactive = true;//移动到最后在设置可以点击
                }
            }
        }
        if (menurun) {
            for (var i = 0; i < pausemenu.length; i++) {
                pausemenu[i].position.x -= 15;
                pausemenu[i].rotation -= 0.1;
            }
        }
    } else {
        //游戏已经结束
        if (level.ninjaContainer.children.length > 0 && !level.randomplane) {
            level.thingmove();//其他对象的移动
            pninja.isdrop = true;
            for (var i = 0; i < level.planeList.length; i++) {
                var p = level.planeList[i];
                //判断道路贴图是否包含人物的圆点
                if (pninja.body.position.x >= p.position.x && pninja.body.position.x <= p.position.x + p.texture.width) {
                    if (pninja.body.position.y <= p.position.y - 5 * p.texture.height / 6 && pninja.body.position.y >= p.position.y - p.texture.height) {
                        pninja.isdrop = false;
                        //跳起速度为零说明跳起过，点击按钮的时候速度被初始化为
                        if (pninja.jumpspeed <= 0) {
                            pninja.jumpcount = 0;
                        }
                        //如果有动画，将动画停到第四帧
                        if (!pninja.body.playing) {
                            pninja.body.play();
                        }
                        break;
                    }
                }
            }
            //跳起来并且没有达到最高点
            if (pninja.isjump && pninja.jumpspeed > 0) {
                pninja.body.position.y -= (pninja.jumpspeed - 0.2);
                pninja.jumpspeed -= 0.2;
                pninja.isdrop = false;
                if (pninja.body.playing) {
                    pninja.body.gotoAndStop(3);
                }
            }
            //是否开始下落
            if (pninja.isdrop) {
                pninja.body.position.y += 4;
                if (pninja.body.playing) {
                    pninja.body.gotoAndStop(4);
                }
                if (pninja.body.position.y >= device.screenHeight + pninja.body.texture.height) {
                    pninja.life = 0;
                }
            }
            pninja.body.position.x += 2;
            if (pninja.body.position.x > device.screenWidth + pninja.body.texture.width || pninja.body.position.y > device.screenHeight + pninja.body.texture.height) {
                level.ninjaContainer.destroy();
            }
        }
    }
    ninjagame.renderer.render(ninjagame.Stage);
    animationID = requestAnimationFrame(gameSCeneAnimation);
    stats.end();
}

/**
 * 设置第一关的常见场景
 * 设置m2铺满，m2之后只能是m2或者m3，
 * m3之后必为间隔（距离待定）
 * 间隔之后为m4 或者 m5 或者m1
 * 之后若为m4之后必为空格
 * m1之后为m2
 * m5之后为m5或者间隔
 * */
(function (window) {
    //游戏的第一个选择
    var GameLevel1 = function () {
        this.level = 1;
        this.planeList = new Array();
        this.propList = new Array();
        this.dartList = new Array();//飞镖列表
        this.coinList = new Array();//金币的列表
        this.bossList = new Array();//boss存放的列表
        this.skillList = new Array();//技能存放的列表
        this.planeContainer = new PIXI.Container();//存放道路贴图的容器
        this.propContainer = new PIXI.Container();//道路上的道具的贴图
        this.coinContainer = new PIXI.Container();//存放金币的容器
        this.bossContainer = new PIXI.Container();//存放boss的容器
        this.ninjaContainer = new PIXI.Container();//存放忍者及飞镖贴图的容器
        this.lastimg = "m2";//默认最后一张贴图的类型
        this.setIsHigh = true;//设置道路为高处还是低处
        this.randomplane = true; //添加的道路是否随机(true为随机添加，false为添加固定的贴图);
        this.addredmedicine = 390 - Math.random() * 30;
        this.redmedicinenum = 0;
        this.isaddmedicine = false;
        //初始化场景中的物体哦
        this.initPlane = function () {
            var m2 = PIXI.Texture.fromFrame("m2.png");//最开始的道路贴图
            for (var i = 0; i < 10; i++) {
                var plane = new PIXI.Sprite(m2);
                plane.anchor.set(0, 1);
                plane.position.set(i * m2.width, device.screenHeight);
                this.planeContainer.addChild(plane);
                this.planeList.push(plane);
            }
            ninjagame.Stage.addChild(this.planeContainer);//添加道路贴图的容器，存放道路贴图
            ninjagame.Stage.addChild(this.propContainer);//添加道路上的道具贴图以及天上飞行的动物的贴图
            ninjagame.Stage.addChild(this.coinContainer);//添加道路上的金币的贴图
            ninjagame.Stage.addChild(this.bossContainer);//添加道路上的boss的贴图
            ninjagame.Stage.addChild(this.ninjaContainer);//添加忍者以及飞镖贴图
            //添加npc的动物
            var npcframe1 = [];
            for (var i = 1; i < 4; i++) {
                npcframe1.push(PIXI.Texture.fromFrame("npc1_" + i + ".png"));
            }
            npcframe1.push(PIXI.Texture.fromFrame("npc1_3.png"));
            npcframe1.push(PIXI.Texture.fromFrame("npc1_2.png"));
            npcframe1.push(PIXI.Texture.fromFrame("npc1_1.png"));
            window.npc1 = new PIXI.extras.AnimatedSprite(npcframe1);
            npc1.anchor.set(0.5, 0.5);
            npc1.position.set(device.screenWidth + 50 + Math.random() * 200, Math.random() * 300 + 20);
            npc1.animationSpeed = 0.2;
            npc1.play();
            this.ninjaContainer.addChild(npc1);
        }
        //道路贴图的变换
        this.movePlane = function () {
            var sitex = this.planeList[0].position.x,//第一个贴图的位置
                planew = this.planeList[0].getBounds().width;
            var lastw = this.planeList[this.planeList.length - 1].getBounds().width;
            if (sitex <= -planew) {
                var pic = null;
                var prop = null;
                if (this.randomplane) {
                    if (this.lastimg == "m2") {
                        var r = Math.round(Math.random());
                        if (r == 0) {
                            pic = PIXI.Texture.fromFrame("m2.png");
                            this.lastimg = "m2";
                        } else if (r == 1) {
                            pic = PIXI.Texture.fromFrame("m3.png");
                            this.lastimg = "m3";
                        }
                    } else if (this.lastimg == "m3") {
                        pic = PIXI.Texture.fromFrame("bg.png");
                        this.lastimg = "blank";
                    } else if (this.lastimg == "blank") {
                        var r = Math.round(Math.random() * 3);
                        if (r == 0 || r == 3) {
                            pic = PIXI.Texture.fromFrame("m1.png");
                            this.lastimg = "m1";
                        } else if (r == 1) {
                            pic = PIXI.Texture.fromFrame("m4.png");
                            this.lastimg = "m4";
                        } else if (r == 2) {
                            pic = PIXI.Texture.fromFrame("m5.png");
                            this.lastimg = "m5";
                        }
                    } else if (this.lastimg == "m1") {
                        pic = PIXI.Texture.fromFrame("m2.png");
                        this.lastimg = "m2";
                    } else if (this.lastimg == "m4") {
                        pic = PIXI.Texture.fromFrame("bg.png");
                        this.lastimg = "blank";
                    } else if (this.lastimg == "m5") {
                        var r = Math.round(Math.random() * 2);
                        if (r == 0) {
                            pic = PIXI.Texture.fromFrame("m4.png");
                            this.lastimg = "m4";
                        } else if (r == 1) {
                            pic = PIXI.Texture.fromFrame("m5.png");
                            this.lastimg = "m5";
                        } else if (r == 2) {
                            pic = PIXI.Texture.fromFrame("bg.png");
                            this.lastimg = "blank";
                        }
                    }
                } else {
                    //添加固定的贴图
                    if (this.lastimg == "m5" || this.lastimg == "m4" || this.lastimg == "blank" || this.lastimg == "m3") {
                        pic = PIXI.Texture.fromFrame("m1.png");
                        this.lastimg = "m1";
                    } else if (this.lastimg == "m1") {
                        pic = PIXI.Texture.fromFrame("m2.png");
                        this.lastimg = "m2"
                    } else if (this.lastimg == "m2") {
                        pic = PIXI.Texture.fromFrame("m2.png");
                        this.lastimg = "m2"
                    }
                }
                //创建道路贴图对象
                var plane = new PIXI.Sprite(pic);
                //贴图锚点
                plane.anchor.set(0, 1);
                //贴图特殊位置
                if (this.lastimg == "m1") {
                    var r = Math.round(Math.random());
                    if (r == 0) {
                        this.setIsHigh = true;
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                    } else if (r == 1) {
                        this.setIsHigh = false;
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + plane.texture.height / 2);
                    }
                } else if (this.lastimg == "m4") {
                    var r = Math.round(Math.random() * 4);
                    if (r == 0) {
                        prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg1_11.png"));
                        prop.position.set(this.planeList[this.planeList.length - 1].position.x + lastw + plane.texture.width / 4, device.screenHeight - plane.texture.height / 2 - 60);
                    } else if (r == 1) {
                        prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg1_14.png"));
                        prop.position.set(this.planeList[this.planeList.length - 1].position.x + lastw + plane.texture.width / 4, device.screenHeight - plane.texture.height / 2 - 60);
                    }
                    plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 40);
                } else if (this.lastimg == "m5") {
                    plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 95);
                } else if (this.lastimg == "blank") {
                    plane.width = 80;
                    plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + plane.texture.height * 3);
                } else {
                    var r = Math.round(Math.random() * 4);
                    if (r == 0) {
                        prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg1_11.png"));
                    } else if (r == 1) {
                        prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg1_14.png"));
                    }
                    if (this.setIsHigh) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                        if (r < 2) {
                            prop.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 1 * plane.texture.height / 2 - 20);
                        }
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + plane.texture.height / 2);
                        if (r < 2) {
                            prop.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 20);
                        }
                    }
                }
                if (this.randomplane) {
                    if (this.lastimg == "m1" || this.lastimg == "m2") {
                        var r = Math.round(Math.random() * 3);
                        if (r == 1) {
                            new coingroup().setcurvegroup(plane);
                        } else if (r == 2) {
                            new coingroup().setlinegroup(plane);
                        }
                    }
                    if (this.lastimg == "m4" || this.lastimg == "m5") {
                        var r = Math.round(Math.random() * 1);
                        if (r == 1) {
                            new coingroup().setlinegroup(plane);
                        }
                    }
                    if (this.lastimg == "m3") {
                        var r = Math.round(Math.random() * 2);
                        if (r == 1) {
                            var fat = new fatboss();
                            fat.stand();
                            fat.body.position.set(plane.position.x + plane.texture.width / 2, plane.position.y - 2 * plane.texture.height / 3 + 10);
                            this.bossList.push(fat);
                            this.bossContainer.addChild(fat.body);
                        }
                    }

                    if (this.lastimg == "m4") {
                        var r = Math.round(Math.random() * 1);
                        if (r == 1) {
                            new bomb().setinit(plane.position.x + 9 * plane.texture.width / 10, plane.position.y - 5 * plane.texture.height / 6);
                        }
                    }
                }
                this.planeContainer.addChild(plane);
                this.planeList.push(plane);

                //删除第一个贴图
                this.planeContainer.removeChild(this.planeList[0]);
                this.planeList.splice(0, 1);
                if (prop != null) {
                    prop.anchor.set(0, 1);
                    this.propList.push(prop);
                    this.propContainer.addChild(prop);
                }
            }
            //道路移动的方法
            for (var i = 0; i < this.planeList.length; i++) {
                this.planeList[i].position.x -= planmoveSpeed;
            }
            for (var i = 0; i < this.propList.length; i++) {
                if (this.propList[i].position.x < -75) {
                    this.propContainer.removeChild(this.propList[i]);
                    this.propList.splice(i, 1);
                    break;
                } else {
                    this.propList[i].position.x -= planmoveSpeed;
                }
            }
        }
        this.thingmove = function () {
            if (npc1.position.x < -50) {
                npc1.position.set(device.screenWidth + 50 + Math.random() * 200, Math.random() * 300 + 20);
            } else {
                npc1.position.x -= 1;
            }
            //飞镖的移动效果
            for (var i = 0; i < this.dartList.length; i++) {
                var d = this.dartList[i];
                if (d.body.position.x <= device.screenWidth) {
                    d.body.position.x += 5;
                } else {
                    this.ninjaContainer.removeChild(d.body);
                    this.dartList.splice(i, 1);
                    break;
                }
            }
            //金币的移动
            for (var i = 0; i < this.coinList.length; i++) {
                var c = this.coinList[i];
                if (pninja.body.containsPoint(c.position)) {
                    //忍者吃到金币
                    this.coinContainer.removeChild(c);
                    this.coinList.splice(i, 1);
                    pninja.goldnum += 1;
                    setgoldnumpic.setGoldNumPic();//金币数量贴图的变换
                    break;
                }
                if (c.position.x >= 0) {
                    c.position.x -= planmoveSpeed;
                } else {
                    this.coinContainer.removeChild(c);
                    this.coinList.splice(i, 1);
                    break;
                }
            }
            //boss移动的效果
            loop:for (var i = 0; i < this.bossList.length; i++) {
                var f = this.bossList[i];
                if (!this.bossList[i].usedskill && f.body.position.x <= f.useskilldistance) {
                    f.useskill();
                    f.usedskill = true;
                }
                //判断是否和飞镖相撞
                for (var j = 0; j < this.dartList.length; j++) {
                    if (f.body.containsPoint(this.dartList[j].body.position)) {
                        f.life -= 1;
                        new skillboom(this.dartList[j].body.position.x, this.dartList[j].body.position.y);
                        if (f.life <= 0) {
                            this.bossContainer.removeChild(f.body);
                            this.bossList.splice(i, 1);
                            this.ninjaContainer.removeChild(this.dartList[j].body);
                            this.dartList.splice(j, 1);
                            if (f.flag == "fatboss") {
                                pninja.killnum.fatboss += 1;
                            } else if (f.flag == "bomb") {
                                pninja.killnum.bomb += 1;
                            }
                            break loop;
                        } else {
                            this.ninjaContainer.removeChild(this.dartList[j].body);
                            this.dartList.splice(j, 1);
                            break;
                        }
                    }
                }
                var iscontain = false;
                if (f.flag == "bomb") {
                    iscontain = pninja.body.containsPoint(f.body.position);
                } else {
                    iscontain = f.body.containsPoint(pninja.body.position);
                }
                //判断忍者是否和其相撞
                if (iscontain) {
                    new skillboom(f.body.position.x, f.body.position.y - f.body.getBounds().height / 2);
                    this.bossContainer.removeChild(f.body);
                    this.bossList.splice(i, 1);
                    pninja.life -= 1;
                    break;
                }
                //判断是否移出画面，移出删除，否则移动
                if (f.body.position.x > -100) {
                    this.bossList[i].body.position.x -= planmoveSpeed;
                } else {
                    this.bossContainer.removeChild(f.body);
                    this.bossList.splice(i, 1);
                    break;
                }
            }
            //敌人释放的技能的移动
            for (var i = 0; i < this.skillList.length; i++) {
                var skill = this.skillList[i];
                if (pninja.body.containsPoint(skill.position)) {
                    new skillboom(skill.position.x, skill.position.y);
                    pninja.life -= 1;
                    this.bossContainer.removeChild(skill);
                    this.skillList.splice(i, 1);
                    break;
                }
                if (skill.position.x >= -100) {
                    skill.position.x -= 6;
                } else {
                    this.bossContainer.removeChild(skill);
                    this.skillList.splice(i, 1);
                    break;
                }
            }
        }
    }
    window.GameLevel1 = GameLevel1;
    //游戏的第二个选择
    var GameLevel2 = function () {
        this.level = 2;
        this.planeList = new Array();
        this.propList = new Array();
        this.dartList = new Array();//飞镖列表
        this.coinList = new Array();//金币的列表
        this.bossList = new Array();//boss存放的列表
        this.skillList = new Array();//技能存放的列表
        this.planeContainer = new PIXI.Container();//存放道路贴图的容器
        this.propContainer = new PIXI.Container();//道路上的道具的贴图
        this.coinContainer = new PIXI.Container();//存放金币的容器
        this.bossContainer = new PIXI.Container();//存放boss的容器
        this.ninjaContainer = new PIXI.Container();//存放忍者及飞镖贴图的容器
        this.lastimg = "n2";//默认最后一张贴图的类型
        this.setIsHigh = true;//设置道路为高处还是低处
        this.randomplane = true; //添加的道路是否随机(true为随机添加，false为添加固定的贴图);
        this.addredmedicine = 390 - Math.random() * 30;
        this.redmedicinenum = 0;
        this.isaddmedicine = false;
        this.initPlane = function () {
            var n2 = PIXI.Texture.fromFrame("n2.png");//最开始的道路贴图
            for (var i = 0; i < 9; i++) {
                var plane = new PIXI.Sprite(n2);
                plane.anchor.set(0, 1);
                plane.position.set(i * n2.width, device.screenHeight);
                this.planeContainer.addChild(plane);
                this.planeList.push(plane);
            }
            ninjagame.Stage.addChild(this.planeContainer);//添加道路贴图的容器，存放道路贴图
            ninjagame.Stage.addChild(this.propContainer);//添加道路上的道具贴图以及天上飞行的动物的贴图
            ninjagame.Stage.addChild(this.coinContainer);//添加道路上的金币的贴图
            ninjagame.Stage.addChild(this.bossContainer);//添加道路上的boss的贴图
            ninjagame.Stage.addChild(this.ninjaContainer);//添加忍者以及飞镖贴图

            //添加npc的动物
            window.npcframe1 = [];
            for (var i = 1; i < 4; i++) {
                npcframe1.push(PIXI.Texture.fromFrame("npc1_" + i + ".png"));
            }
            npcframe1.push(PIXI.Texture.fromFrame("npc1_3.png"));
            npcframe1.push(PIXI.Texture.fromFrame("npc1_2.png"));
            npcframe1.push(PIXI.Texture.fromFrame("npc1_1.png"));
            window.npcframe2 = [];
            for (var i = 1; i < 7; i++) {
                npcframe2.push(PIXI.Texture.fromFrame("npc4_" + i + ".png"));
            }
            window.npc1 = new PIXI.extras.AnimatedSprite(npcframe2);
            npc1.anchor.set(0.5, 0.5);
            npc1.position.set(device.screenWidth + 50 + Math.random() * 200, Math.random() * 170 + 30);
            npc1.animationSpeed = 0.2;
            npc1.play();
            this.ninjaContainer.addChild(npc1);
        }
        this.movePlane = function () {
            var sitex = this.planeList[0].position.x,//第一个贴图的位置
                planew = this.planeList[0].getBounds().width;
            var lastw = this.planeList[this.planeList.length - 1].getBounds().width;
            if (sitex <= -planew) {
                var pic = null;
                var prop = null;
                if (this.randomplane) {
                    if (this.lastimg == "n2") {
                        var r = Math.round(Math.random());
                        if (r == 0) {
                            pic = PIXI.Texture.fromFrame("n2.png");
                            this.lastimg = "n2";
                        } else if (r == 1) {
                            pic = PIXI.Texture.fromFrame("n3.png");
                            this.lastimg = "n3";
                        }
                    } else if (this.lastimg == "n3") {
                        pic = PIXI.Texture.fromFrame("bg.png");
                        pic.width = 80;
                        this.lastimg = "blank";
                    } else if (this.lastimg == "blank") {
                        var r = Math.round(Math.random() * 2);
                        if (r == 1) {
                            pic = PIXI.Texture.fromFrame("n1.png");
                            this.lastimg = "n1";
                        } else if (r == 2 || r == 0) {
                            pic = PIXI.Texture.fromFrame("n4.png");
                            this.lastimg = "n4";
                        }
                    } else if (this.lastimg == "n1") {
                        pic = PIXI.Texture.fromFrame("n2.png");
                        this.lastimg = "n2";
                    } else if (this.lastimg == "n4") {
                        pic = PIXI.Texture.fromFrame("bg.png");
                        this.lastimg = "blank";
                    }
                } else {
                    if (this.lastimg == "blank" || this.lastimg == "n3" || this.lastimg == "n4") {
                        pic = PIXI.Texture.fromFrame("n1.png");
                        this.lastimg = "n1";
                    } else if (this.lastimg == "n1") {
                        pic = PIXI.Texture.fromFrame("n2.png");
                        this.lastimg = "n2";
                    } else if (this.lastimg == "n2") {
                        pic = PIXI.Texture.fromFrame("n2.png");
                        this.lastimg = "n2";
                    }
                }
                //创建道路贴图对象
                var plane = new PIXI.Sprite(pic);
                //贴图锚点
                plane.anchor.set(0, 1);
                if (this.lastimg == "blank") {
                    plane.width = 80;
                    plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + 200);
                } else if (this.lastimg == "n4") {
                    var r = Math.round(Math.random());
                    if (r == 0) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 80);
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 160);
                    }
                } else if (this.lastimg == "n1") {
                    var r = Math.round(Math.random());
                    if (r == 0) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + 100);
                        this.setIsHigh = false;
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                        this.setIsHigh = true;
                    }
                } else {
                    if (this.setIsHigh) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + 100);
                    }
                }

                var radom = Math.round(Math.random()); //随机数为1的时候添加道路物品
                if (radom == 1 && this.lastimg != "blank" && this.lastimg != "n3" && this.lastimg != "n4") {
                    var random1 = Math.round(Math.random());
                    var proptexture = null;
                    if (random1 == 1) {
                        proptexture = PIXI.Texture.fromFrame("bg2_11.png");
                    } else {
                        proptexture = PIXI.Texture.fromFrame("bg2_12.png");
                    }
                    var prop = new PIXI.Sprite(proptexture);
                    prop.position.set(plane.position.x + Math.random() * plane.getBounds().width, plane.position.y - plane.getBounds().height + (Math.random() * 20 + 30));
                    prop.anchor.set(0, 1);
                    this.propList.push(prop);
                    this.propContainer.addChild(prop);
                }

                if (this.randomplane) {
                    if (this.lastimg == "n2" || this.lastimg == "n4") {
                        var r = Math.round(Math.random() * 3);
                        if (r == 1) {
                            new coingroup().setcurvegroup(plane);
                        } else if (r == 2) {
                            new coingroup().setlinegroup(plane);
                        }
                    }
                    if (this.lastimg == "n2" || this.lastimg == "n3" || this.lastimg == "n4") {
                        var r = Math.round(Math.random() * 4);
                        if (r == 1) {
                            new bomb().setinit(plane.position.x + Math.random() * plane.texture.width, plane.position.y - plane.getBounds().height + 20);
                        }
                    }
                    if (this.lastimg == "n2" || this.lastimg == "n3") {
                        var rr = Math.round(Math.random() * 5);
                        if (rr == 2) {
                            var crocodile = new crocodileboss();
                            crocodile.stand();
                            crocodile.body.position.set(plane.position.x + plane.texture.width / 2, plane.position.y - plane.texture.height + 50);
                            this.bossList.push(crocodile);
                            this.bossContainer.addChild(crocodile.body);
                        }
                    }
                }
                this.planeContainer.addChild(plane);
                this.planeList.push(plane);

                //删除第一个贴图
                this.planeContainer.removeChild(this.planeList[0]);
                this.planeList.splice(0, 1);
            }
            //道路移动的方法
            for (var i = 0; i < this.planeList.length; i++) {
                this.planeList[i].position.x -= planmoveSpeed;
            }
            //道路上的物体的移动
            for (var i = 0; i < this.propList.length; i++) {
                if (this.propList[i].position.x < -75) {
                    this.propContainer.removeChild(this.propList[i]);
                    this.propList.splice(i, 1);
                    break;
                } else {
                    this.propList[i].position.x -= planmoveSpeed;
                }
            }
        }
        this.thingmove = function () {
            if (npc1.position.x < -50) {
                var framerandom = Math.round(Math.random() * 2);
                if (framerandom == 1) {
                    npc1.textures = npcframe1;
                } else {
                    npc1.textures = npcframe2;
                }
                npc1.position.set(device.screenWidth + 50 + Math.random() * 200, Math.random() * 170 + 30);
            } else {
                npc1.position.x -= 1;
            }
            //飞镖的移动效果
            for (var i = 0; i < this.dartList.length; i++) {
                var d = this.dartList[i];
                if (d.body.position.x <= device.screenWidth) {
                    d.body.position.x += 5;
                } else {
                    this.ninjaContainer.removeChild(d.body);
                    this.dartList.splice(i, 1);
                    break;
                }
            }
            //金币的移动
            for (var i = 0; i < this.coinList.length; i++) {
                var c = this.coinList[i];
                if (pninja.body.containsPoint(c.position)) {
                    //忍者吃到金币
                    this.coinContainer.removeChild(c);
                    this.coinList.splice(i, 1);
                    pninja.goldnum += 1;
                    setgoldnumpic.setGoldNumPic();//金币数量贴图的变换
                    break;
                }
                if (c.position.x >= 0) {
                    c.position.x -= planmoveSpeed;
                } else {
                    this.coinContainer.removeChild(c);
                    this.coinList.splice(i, 1);
                    break;
                }
            }

            //boss移动的效果
            loop2:for (var i = 0; i < this.bossList.length; i++) {
                var f = this.bossList[i];
                if (!this.bossList[i].usedskill && f.body.position.x <= f.useskilldistance) {
                    f.useskill();
                    if (f.body.position.x > 750) {
                        f.useskilldistance = 750 - Math.random() * 100;
                    } else {
                        f.usedskill = true;
                    }
                }
                //判断是否和飞镖相撞
                for (var j = 0; j < this.dartList.length; j++) {
                    if (f.body.containsPoint(this.dartList[j].body.position)) {
                        f.life -= 1;
                        new skillboom(this.dartList[j].body.position.x, this.dartList[j].body.position.y);
                        if (f.life <= 0) {
                            this.bossContainer.removeChild(f.body);
                            this.bossList.splice(i, 1);
                            this.ninjaContainer.removeChild(this.dartList[j].body);
                            this.dartList.splice(j, 1);
                            if (f.flag == "bomb") {
                                pninja.killnum.bomb += 1;
                            } else if (f.flag == "crocodile") {
                                pninja.killnum.crocodile += 1;
                            }
                            break loop2;
                        } else {
                            this.ninjaContainer.removeChild(this.dartList[j].body);
                            this.dartList.splice(j, 1);
                            break;
                        }
                    }
                }
                var iscontain = false;
                if (f.flag == "bomb") {
                    iscontain = pninja.body.containsPoint(f.body.position);
                } else if (f.flag == "crocodile") {
                    iscontain = f.body.containsPoint(pninja.body.position);
                    if (iscontain) {
                        f.body.stop();
                    }
                }
                //判断忍者是否和其相撞
                if (iscontain) {
                    new skillboom(f.body.position.x, f.body.position.y - f.body.getBounds().height / 2);
                    this.bossContainer.removeChild(f.body);
                    this.bossList.splice(i, 1);
                    pninja.life -= 1;
                    break;
                }
                //判断是否移出画面，移出删除，否则移动
                if (f.body.position.x > -100) {
                    f.body.position.x -= planmoveSpeed;
                } else {
                    this.bossContainer.removeChild(f.body);
                    this.bossList.splice(i, 1);
                    break;
                }

            }
            //敌人释放的技能的移动
            for (var i = 0; i < this.skillList.length; i++) {
                var skill = this.skillList[i];
                if (pninja.body.containsPoint(skill.position)) {
                    new skillboom(skill.position.x, skill.position.y);
                    pninja.life -= 1;
                    this.bossContainer.removeChild(skill);
                    this.skillList.splice(i, 1);
                    break;
                } else {
                    if (skill.position.x >= -100) {
                        skill.position.x -= 6;
                    } else {
                        this.bossContainer.removeChild(skill);
                        this.skillList.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    window.GameLevel2 = GameLevel2;
    //第三关选择
    var GameLevel3 = function () {
        this.level = 3;
        this.planeList = new Array();
        this.propList = new Array();
        this.dartList = new Array();//飞镖列表
        this.coinList = new Array();//金币的列表
        this.bossList = new Array();//boss存放的列表
        this.skillList = new Array();//技能存放的列表
        this.lightingBall = new Array();//最终boss释放的闪电球技能
        this.planeContainer = new PIXI.Container();//存放道路贴图的容器
        this.propContainer = new PIXI.Container();//道路上的道具的贴图
        this.coinContainer = new PIXI.Container();//存放金币的容器
        this.bossContainer = new PIXI.Container();//存放boss的容器
        this.ninjaContainer = new PIXI.Container();//存放忍者及飞镖贴图的容器
        this.lastimg = "b2";//默认最后一张贴图的类型
        this.setIsHigh = true;//设置道路为高处还是低处
        this.randomplane = true; //添加的道路是否随机(true为随机添加，false为添加固定的贴图);
        this.addredmedicine = 390 - Math.random() * 30;
        this.redmedicinenum = 0;
        this.isaddmedicine = false;
        this.number = 0;
        this.initPlane = function () {
            var b2 = PIXI.Texture.fromFrame("b2.png");//最开始的道路贴图
            for (var i = 0; i < 9; i++) {
                var plane = new PIXI.Sprite(b2);
                plane.anchor.set(0, 1);
                plane.position.set(i * b2.width, device.screenHeight);
                this.planeContainer.addChild(plane);
                this.planeList.push(plane);
            }
            ninjagame.Stage.addChild(this.planeContainer);//添加道路贴图的容器，存放道路贴图
            ninjagame.Stage.addChild(this.propContainer);//添加道路上的道具贴图以及天上飞行的动物的贴图
            ninjagame.Stage.addChild(this.coinContainer);//添加道路上的金币的贴图
            ninjagame.Stage.addChild(this.bossContainer);//添加道路上的boss的贴图
            ninjagame.Stage.addChild(this.ninjaContainer);//添加忍者以及飞镖贴图

            //添加npc的动物
            var npcframe1 = [];
            for (var i = 1; i < 4; i++) {
                npcframe1.push(PIXI.Texture.fromFrame("npc1_" + i + ".png"));
            }
            npcframe1.push(PIXI.Texture.fromFrame("npc1_3.png"));
            npcframe1.push(PIXI.Texture.fromFrame("npc1_2.png"));
            npcframe1.push(PIXI.Texture.fromFrame("npc1_1.png"));
            window.npc1 = new PIXI.extras.AnimatedSprite(npcframe1);
            npc1.anchor.set(0.5, 0.5);
            npc1.position.set(device.screenWidth + 250 + Math.random() * 200, Math.random() * 170 + 30);
            npc1.animationSpeed = 0.2;
            npc1.play();
            this.ninjaContainer.addChild(npc1);
            var npcframe3 = [];
            for (var i = 1; i < 4; i++) {
                npcframe3.push(PIXI.Texture.fromFrame("npc3_" + i + ".png"));
            }
            npcframe3.push(PIXI.Texture.fromFrame("npc3_3.png"));
            window.npc3 = new PIXI.extras.AnimatedSprite(npcframe3);
            npc3.anchor.set(0.5, 0.5);
            npc3.scale.set(0.7, 0.7);
            npc3.position.set(device.screenWidth + 50 + Math.random() * 200, Math.random() * 100 + 100);
            npc3.animationSpeed = 0.02;
            npc3.play();
            this.ninjaContainer.addChild(npc3);
            window.finalboss = null;
        }
        this.movePlane = function () {
            var sitex = this.planeList[0].position.x,//第一个贴图的位置
                planew = this.planeList[0].getBounds().width;
            var lastw = this.planeList[this.planeList.length - 1].getBounds().width;
            if (sitex <= -planew) {
                var pic = null;
                var prop = null;
                if (this.randomplane) {
                    if (this.lastimg == "b2") {
                        var r = Math.round(Math.random());
                        if (r == 0) {
                            pic = PIXI.Texture.fromFrame("b2.png");
                            this.lastimg = "b2";
                        } else if (r == 1) {
                            pic = PIXI.Texture.fromFrame("b3.png");
                            this.lastimg = "b3";
                        }
                    } else if (this.lastimg == "b3") {
                        var r = Math.round(Math.random());
                        if (r == 0) {
                            pic = PIXI.Texture.fromFrame("b4.png");
                            this.lastimg = "b4";
                        } else if (r == 1) {
                            pic = PIXI.Texture.fromFrame("bg.png");
                            pic.width = 80;
                            this.lastimg = "blank";
                        }
                    } else if (this.lastimg == "blank") {
                        var r = Math.round(Math.random() * 2);
                        if (r == 1) {
                            pic = PIXI.Texture.fromFrame("b1.png");
                            this.lastimg = "b1";
                        } else if (r == 2 || r == 0) {
                            pic = PIXI.Texture.fromFrame("b4.png");
                            this.lastimg = "b4";
                        }
                    } else if (this.lastimg == "b1") {
                        pic = PIXI.Texture.fromFrame("b2.png");
                        this.lastimg = "b2";
                    } else if (this.lastimg == "b4") {
                        var r = Math.round(Math.random());
                        if (r == 1) {
                            pic = PIXI.Texture.fromFrame("b1.png");
                            this.lastimg = "b1";
                        } else {
                            pic = PIXI.Texture.fromFrame("bg.png");
                            this.lastimg = "blank";
                        }
                    }
                } else {
                    if (this.lastimg == "blank" || this.lastimg == "b3" || this.lastimg == "b4") {
                        pic = PIXI.Texture.fromFrame("b1.png");
                        this.lastimg = "b1";
                    } else if (this.lastimg == "b1") {
                        pic = PIXI.Texture.fromFrame("b2.png");
                        this.lastimg = "b2";
                    } else if (this.lastimg == "b2") {
                        pic = PIXI.Texture.fromFrame("b2.png");
                        this.lastimg = "b2";
                    }
                }
                //创建道路贴图对象
                var plane = new PIXI.Sprite(pic);
                //贴图锚点
                plane.anchor.set(0, 1);
                if (this.lastimg == "blank") {
                    plane.width = 80;
                    plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + 200);
                } else if (this.lastimg == "b4") {
                    var r = Math.round(Math.random());
                    if (r == 0) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight - 80);
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                    }
                } else if (this.lastimg == "b1") {
                    var r = Math.round(Math.random());
                    if (r == 0) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + 100);
                        this.setIsHigh = false;
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                        this.setIsHigh = true;
                    }
                } else {
                    if (this.setIsHigh) {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight);
                    } else {
                        plane.position.set(this.planeList[this.planeList.length - 1].position.x + lastw, device.screenHeight + 100);
                    }
                }

                var radom = Math.round(Math.random() * 3); //随机数为1的时候添加道路物品
                if (radom == 1) {
                    var prop = null;
                    if (this.lastimg == "b2") {
                        prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg3_13.png"));
                        prop.position.set(plane.position.x, plane.position.y - plane.texture.height + 90);
                    }
                    if (this.lastimg == "b2" || this.lastimg == "b1" || this.lastimg == "b4") {
                        var radom1 = Math.round(Math.random());
                        if (radom1 == 1) {
                            prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg3_11.png"));
                        } else {
                            prop = new PIXI.Sprite(PIXI.Texture.fromFrame("bg3_12.png"));
                        }
                        prop.position.set(plane.position.x + 30, plane.position.y - plane.texture.height + 50);
                    }
                    if (prop != null) {
                        prop.anchor.set(0, 1);
                        this.propList.push(prop);
                        this.propContainer.addChild(prop);
                    }
                }
                if (this.randomplane) {
                    if (this.lastimg == "b3") {
                        var r = Math.round(Math.random() * 2);
                        if (r == 1) {
                            var fat = new fatboss();
                            fat.stand();
                            fat.body.position.set(plane.position.x + plane.texture.width / 2, plane.position.y - plane.texture.height + 50);
                            this.bossList.push(fat);
                            this.bossContainer.addChild(fat.body);
                        }
                    }
                    if (this.lastimg == "b2") {
                        var r = Math.round(Math.random() * 4);
                        if (r == 1) {
                            new bomb().setinit(plane.position.x + Math.random() * plane.texture.width, plane.position.y - plane.getBounds().height + 20);
                        }
                    }
                    if (this.lastimg == "b2" || this.lastimg == "b4") {
                        var r = Math.round(Math.random() * 4);
                        if (r == 1) {
                            new coingroup().setcurvegroup(plane);
                        } else if (r == 2) {
                            new coingroup().setlinegroup(plane);
                        }
                    }
                } else {
                    if (finalboss == null) {
                        finalboss = new dragonboss();
                        finalboss.setinit();
                        //设置最终boss的初始位置
                        if (this.setIsHigh) {
                            finalboss.body.position.set(1160, 200);
                        } else {
                            finalboss.body.position.set(1160, 300);
                        }
                    }
                }
                this.planeContainer.addChild(plane);
                this.planeList.push(plane);

                //删除第一个贴图
                this.planeContainer.removeChild(this.planeList[0]);
                this.planeList.splice(0, 1);
            }
            //道路移动的方法
            for (var i = 0; i < this.planeList.length; i++) {
                this.planeList[i].position.x -= planmoveSpeed;
            }
            //道路上的物体的移动
            for (var i = 0; i < this.propList.length; i++) {
                if (this.propList[i].position.x < -75) {
                    this.propContainer.removeChild(this.propList[i]);
                    this.propList.splice(i, 1);
                    break;
                } else {
                    this.propList[i].position.x -= planmoveSpeed;
                }
            }
        }
        this.thingmove = function () {
            //dragonboss的移动及技能的释放(//攻击阶段，0、飞入屏幕（固定位置）；1、向上飞；2、释放闪电球；3、往下飞；4、接近忍者；5、喷火；6、boss和火焰向前移动；7、退回喷火的开始位)
            if (finalboss != null) {
                if (finalboss.life > 0) {
                    var h = 0;
                    if (!this.setIsHigh) {
                        h = 100;
                    }
                    if (finalboss.phases == 0) {
                        if (finalboss.body.position.x < device.screenWidth - 200) {
                            finalboss.phases = 1;
                        } else {
                            finalboss.body.position.x -= 3;
                        }
                    } else if (finalboss.phases == 1) {
                        if (finalboss.body.position.y < 100 + h) {
                            finalboss.phases = 2;
                        } else {
                            finalboss.body.position.y -= 3;
                        }
                    } else if (finalboss.phases == 2) {
                        finalboss.lightningAttack();
                    } else if (finalboss.phases == 3) {
                        if (finalboss.body.position.y > 200 + h) {
                            finalboss.phases = 4;
                        } else {
                            finalboss.body.position.y += 3;
                        }
                    } else if (finalboss.phases == 4) {
                        if (finalboss.body.position.x < device.screenWidth - 220) {
                            finalboss.phases = 5;
                        } else {
                            finalboss.body.position.x -= 4;
                        }
                    } else if (finalboss.phases == 5) {
                        if (finalboss.fireskill == null) {
                            finalboss.fireAttack();
                        }
                    } else if (finalboss.phases == 6) {
                        if (finalboss.body.position.x < device.screenWidth - 380) {
                            finalboss.phases = 7;
                        } else {
                            finalboss.fireskill.position.x -= 2;
                            finalboss.body.position.x -= 2;
                        }
                    } else if (finalboss.phases == 7) {
                        if (finalboss.body.position.x > device.screenWidth - 300) {
                            finalboss.fly();
                            finalboss.phases = 8;
                        } else {
                            finalboss.fireskill.position.x += 2;
                            finalboss.body.position.x += 2;
                        }
                    } else if (finalboss.phases == 8) {
                        if (finalboss.body.position.x > device.screenWidth - 200) {
                            finalboss.fired = false;
                            finalboss.phases = 1;
                        } else {
                            finalboss.body.position.x += 1;
                        }
                    }
                    if (finalboss.fireskill != null) {
                        var dx = Math.abs(finalboss.fireskill.position.x - pninja.body.position.x),
                            dy = Math.abs(finalboss.fireskill.position.y - pninja.body.position.y)
                        if (dx < 30 && dy < 45 && !finalboss.fired) {
                            pninja.life -= 1;
                            finalboss.fired = true;
                        }
                    }
                }
            }
            //闪电球的移动效果
            if (this.lightingBall.length > 0) {
                for (var i = 0; i < this.lightingBall.length; i++) {
                    var lighting = this.lightingBall[i];
                    //判断是否与忍者相撞
                    if (pninja.body.containsPoint(lighting.position)) {
                        pninja.life--;
                        ninjagame.Stage.removeChild(lighting);
                        new skillboom(lighting.position.x, lighting.position.y);
                        this.lightingBall.splice(i, 1);
                        break;
                    } else if (lighting.position.y > device.screenHeight - (240 - h)) {
                        ninjagame.Stage.removeChild(lighting);
                        new skillboom(lighting.position.x, lighting.position.y);
                        this.lightingBall.splice(i, 1);
                        break;
                    } else {
                        lighting.position.x -= 3;
                        lighting.position.y += 2;
                    }
                }
            }

            //npc移动效果
            if (npc3 != null) {
                if (npc3.position.x < -50) {
                    if (this.randomplane) {
                        npc3.position.set(device.screenWidth + 50 + Math.random() * 200, Math.random() * 170 + 30);
                        this.number = 0;
                    } else {
                        npc3.destroy();
                        npc3 = null;
                    }
                } else {
                    npc3.position.x -= 1;
                    npc3.position.y = Math.sin(Math.PI / 50 * this.number) * 30 + 100;
                    this.number++;
                }
            }
            if (npc1 != null) {
                if (npc1.position.x < -50) {
                    if (this.randomplane) {
                        npc1.position.set(device.screenWidth + 250 + Math.random() * 200, Math.random() * 170 + 30);
                    } else {
                        npc1.destroy();
                        npc1 = null;
                    }
                } else {
                    npc1.position.x -= 1;
                }
            }
            //飞镖的移动效果
            for (var i = 0; i < this.dartList.length; i++) {
                var d = this.dartList[i];
                if (d.body.position.x <= device.screenWidth) {
                    d.body.position.x += 5;
                } else {
                    this.ninjaContainer.removeChild(d.body);
                    this.dartList.splice(i, 1);
                    break;
                }
                //判断飞镖是否击中最终的boss
                if (finalboss != null) {
                    var dx = Math.abs(finalboss.body.position.x - d.body.position.x),//x轴方向的距离
                        dy = Math.abs(finalboss.body.position.y - d.body.position.y);//y轴方向的距离
                    //判断是否击中
                    if (dx < 40 && dy < 60) {
                        if (finalboss.life > 0) {
                            finalboss.life--;
                            new skillboom(d.body.position.x, d.body.position.y);
                        }
                        if (finalboss.life <= 0) {
                            pninja.killnum.dragon += 1;
                            new skillboom(finalboss.body.position.x, finalboss.body.position.y);
                            if(finalboss.fireskill != null){
                                finalboss.fireskill.destroy();
                            }
                        }
                        this.ninjaContainer.removeChild(d.body);
                        this.dartList.splice(i, 1);
                        break;
                    }
                }
            }
            //金币的移动
            for (var i = 0; i < this.coinList.length; i++) {
                var c = this.coinList[i];
                if (pninja.body.containsPoint(c.position)) {
                    //忍者吃到金币
                    this.coinContainer.removeChild(c);
                    this.coinList.splice(i, 1);
                    pninja.goldnum += 1;
                    setgoldnumpic.setGoldNumPic();//金币数量贴图的变换
                    break;
                }
                if (c.position.x >= 0) {
                    c.position.x -= planmoveSpeed;
                } else {
                    this.coinContainer.removeChild(c);
                    this.coinList.splice(i, 1);
                    break;
                }
            }

            //boss移动的效果
            loop2:for (var i = 0; i < this.bossList.length; i++) {
                var f = this.bossList[i];
                if (!this.bossList[i].usedskill && f.body.position.x <= f.useskilldistance && f.flag == "fatboss") {
                    f.useskill();
                    if (f.body.position.x > 750) {
                        f.useskilldistance = 750 - Math.random() * 100;
                    } else {
                        f.usedskill = true;
                    }
                }
                //判断是否和飞镖相撞
                for (var j = 0; j < this.dartList.length; j++) {
                    if (f.body.containsPoint(this.dartList[j].body.position)) {
                        f.life -= 1;
                        new skillboom(this.dartList[j].body.position.x, this.dartList[j].body.position.y);
                        if (f.life <= 0) {
                            this.bossContainer.removeChild(f.body);
                            this.bossList.splice(i, 1);
                            this.ninjaContainer.removeChild(this.dartList[j].body);
                            this.dartList.splice(j, 1);
                            if (f.flag == "bomb") {
                                pninja.killnum.bomb += 1;
                            } else if (f.flag == "crocodile") {
                                pninja.killnum.crocodile += 1;
                            } else if (f.flag == "fatboss") {
                                pninja.killnum.fatboss += 1;
                            }
                            break loop2;
                        } else {
                            this.ninjaContainer.removeChild(this.dartList[j].body);
                            this.dartList.splice(j, 1);
                            break;
                        }
                    }
                }
                var iscontain = false;
                if (f.flag == "bomb") {
                    iscontain = pninja.body.containsPoint(f.body.position);
                } else if (f.flag == "crocodile") {
                    iscontain = f.body.containsPoint(pninja.body.position);
                    if (iscontain) {
                        f.body.stop();
                    }
                } else if (f.flag == "fatboss") {
                    iscontain = f.body.containsPoint(pninja.body.position);
                }
                //判断忍者是否和其相撞
                if (iscontain) {
                    new skillboom(f.body.position.x, f.body.position.y - f.body.getBounds().height / 2);
                    this.bossContainer.removeChild(f.body);
                    this.bossList.splice(i, 1);
                    pninja.life -= 1;
                    break;
                }
                //判断是否移出画面，移出删除，否则移动
                if (f.body.position.x > -100) {
                    f.body.position.x -= planmoveSpeed;
                } else {
                    this.bossContainer.removeChild(f.body);
                    this.bossList.splice(i, 1);
                    break;
                }
            }
            //敌人释放的技能的移动
            for (var i = 0; i < this.skillList.length; i++) {
                var skill = this.skillList[i];
                if (pninja.body.containsPoint(skill.position)) {
                    new skillboom(skill.position.x, skill.position.y);
                    pninja.life -= 1;
                    this.bossContainer.removeChild(skill);
                    this.skillList.splice(i, 1);
                    break;
                } else {
                    if (skill.position.x >= -100) {
                        skill.position.x -= 6;
                    } else {
                        this.bossContainer.removeChild(skill);
                        this.skillList.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    window.GameLevel3 = GameLevel3;
})(window);
