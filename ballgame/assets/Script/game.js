
cc.Class({
    extends: cc.Component,


    properties: {
        red:{
            default:null,
            type:cc.Node
        },
        blue:{
            default:null,
            type:cc.Node
        },
        yellow:{
            default:null,
            type:cc.Node
        },
        gravity: cc.p(0, -320), // 系统默认的
    },
    _isGame:false,
    _isTouch:false,
    _isMove:false,
    _startX:0,
    _startY:0,
    _blueX:0,
    _blueY:0,
    _currentX:0,
    _currentY:0,

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        let width   = this.node.width;
        let height  = this.node.height;
        let node = new cc.Node();
        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        this._addBound(node, 0, height/2, width, 20);
        this._addBound(node, 0, -height/2, width, 20);
        this._addBound(node, -width/2, 0, 20, height);
        this._addBound(node, width/2, 0, 20, height);

        node.parent = this.node;
    },
    start () {
        this.isGame = true;
        this.blue.on("touchstart",function(event){
            this.startX = event.getLocationX();
            this.startY = event.getLocationY();
            this.blueX = this.blue.x;
            this.blueY = this.blue.y;
            this.isTouch =true;
        },this);

        this.blue.on("touchend",function(event){
            this.isTouch = false;
            this.isMove = false;
        },this);
        this.blue.on("touchcancel",function(event){
            this.isTouch = false;
            this.isMove = false;
        },this);

        this.node.on("touchmove",function(event){
            this.isMove = true;
            this.currentX = event.getLocationX();
            this.currentY = event.getLocationY();
        },this);
    },

    redTween:false,
    redTween2:false,
    update (dt) {
        if(!this.isGame)return;
        if(this.isTouch && this.isMove){
            var newV2 = cc.v2(this.blueX + this.currentX - this.startX,this.blueY + this.currentY - this.startY);
            this.blue.setPosition(newV2);
        }
        var rigid = this.yellow.getComponent(cc.RigidBody).linearVelocity;
        if(Math.abs(this.red.x - this.yellow.x) < 40 && this.redTween && !this.redTween2){
            this.redTween2 = true;
            console.log("--------+ "+Math.abs(this.red.x - this.yellow.x)+" +---------");
            cc.tween(this.red)
            .to(0.3, { position: cc.v2(550, 0)})
            .call(()=>{this.redTween2 = false;})
            .start();
        }else if(this.yellow.x > 0 && !this.redTween && rigid.x >= 0){
            console.log("+++++++++++++"+this.yellow.x+"+++++++++++++");
            this.redTween = true;
            cc.tween(this.red)
                .to(0.3, { position: cc.v2(this.yellow.x + 30, this.yellow.y + 30)})
                .call(()=>{this.redTween = false;})
                .start();
        }
    },

    over:function(own){
        this.isGame = false;
        if(own == "left"){
            console.log("+++++++++++++机器人胜利+++++++++++++");
        }else{
            console.log("+++++++++++++我方胜利+++++++++++++");
        }
        this.node.getChildByName("overPanel").active = true;
    },

    gameStart:function(){
        console.log("+++++++++++++gameStart+++++++++++++");
        this.isGame = true;
        this.node.getChildByName("overPanel").active = false;
    },

    _addBound (node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    },

});
