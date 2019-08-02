
cc.Class({
    extends: cc.Component,

    properties: {
        mouseJoint: true,
        tableNode:{
            default:null,
            type:cc.Node,
        },
        balls:{
            default:[],
            type:[cc.Node]
        },
        radius:15
    },
    
    TABLE_WIDTH:1000,
    TABLE_HEIGTH:500,
    whiteCircle:null,
    graphicsNode:null,
    ctx:null,

    onLoad () {
        if (this.mouseJoint) {
            // add mouse joint
            let joint = this.tableNode.addComponent(cc.MouseJoint);
            joint.mouseRegion = this.node;    
        }
    },

    start () {
        this.whiteCircle = this.node.getChildByName("whiteCircle")
        // this.whiteCircle.on("touchend",function(event){
        //     this.whiteCircle.getComponent(cc.RigidBody).applyForce(cc.v2(30000,0),cc.v2(0,0))
        // },this);

        this.node.on("mousemove",function(event){
            let arr = [];
            let target = null;
            let cursorX = event.getLocationX();
            let cursorY = event.getLocationY();
            //白球中心位置的世界坐标
            let whiteP = this.whiteCircle.convertToWorldSpace(cc.v2(this.whiteCircle.x + this.radius,this.whiteCircle.y + this.radius));
            let tanXY = (cursorY - whiteP.y)/(cursorX - whiteP.x);
            // Math.atan();
            let len = this.balls.length;
            // this.balls.sort(function(a,b){return a.y - b.y});
            //从所有球中得到在白球和鼠标链接线上的球
            for(let i = 0;i<len;i++){
                let ball = this.balls[i];
                let ballP = ball.convertToWorldSpace(cc.v2(ball.x + this.radius,ball.y + this.radius));
                //根据XY间距比值判断用x还是y判断
                if(tanXY <= 1 && tanXY > 0){
                    if((ballP.x > whiteP.x && cursorX > whiteP.x) || (ballP.x < whiteP.x && cursorX < whiteP.x)){
                        let tanXYMax = (ballP.y - whiteP.y + this.radius)/(ballP.x - whiteP.x);
                        let tanXYMin = (ballP.y - whiteP.y - this.radius)/(ballP.x - whiteP.x);
                        if(tanXYMin < tanXY&& tanXY < tanXYMax){
                            arr.push(ball);
                        }
                    }
                }else if(tanXY > 1){
                    if((ballP.y > whiteP.y && cursorY > whiteP.y) || (ballP.y < whiteP.y && cursorY < whiteP.y)){
                        let tanXYMax = (ballP.y - whiteP.y)/(ballP.x - whiteP.x -  this.radius);
                        let tanXYMin = (ballP.y - whiteP.y)/(ballP.x - whiteP.x + this.radius);
                        if(tanXYMin < tanXY  && tanXY < tanXYMax){
                            arr.push(ball);
                        }
                    }
                }else if(tanXY > -1 && tanXY < 0){
                    if((ballP.x > whiteP.x && cursorX > whiteP.x) || (ballP.x < whiteP.x && cursorX < whiteP.x)){
                        let tanXYMax = (ballP.y - whiteP.y + this.radius)/(ballP.x - whiteP.x);
                        let tanXYMin = (ballP.y - whiteP.y - this.radius)/(ballP.x - whiteP.x);
                        if(tanXYMin < tanXY && tanXY < tanXYMax){
                            console.log(tanXYMin + " : "+tanXY+":"+tanXYMax);
                            arr.push(ball);
                        }
                    }
                }else if(tanXY <= -1){
                    if((ballP.y > whiteP.y && cursorY > whiteP.y) || (ballP.y < whiteP.y && cursorY < whiteP.y)){
                        let tanXYMax = (ballP.y - whiteP.y)/(ballP.x - whiteP.x -  this.radius);
                        let tanXYMin = (ballP.y - whiteP.y)/(ballP.x - whiteP.x + this.radius);
                        if(tanXYMin < tanXY && tanXY < tanXYMax){
                            arr.push(ball);
                        }
                    }
                }
            }
            //挑选出当前可以打到的球
            let arrLen = arr.length;
            if(arrLen > 0){
                if(arrLen == 1) target = arr[0];
                for(let i = 0;i < arrLen;i++){
                    if(tanXY <= 1 && tanXY > 0){
                        if(target == null) {
                            target = arr[i];
                        }else{
                            if((arr[i].x > whiteP.x && cursorX > whiteP.x) && (target.x > arr[i].x)){
                                target = arr[i];
                            }else if((arr[i].x < whiteP.x && cursorX < whiteP.x) && (target.x < arr[i].x)){
                                target = arr[i];
                            }
                        }
                    }else if(tanXY > 1){
                        if(target == null) {
                            target = arr[i];
                        }else{
                            if((arr[i].y > whiteP.y && cursorY > whiteP.y) && (target.y > arr[i].y)){
                                target = arr[i];
                            }else if((arr[i].y < whiteP.y && cursorY < whiteP.y) && (target.y < arr[i].y)){
                                target = arr[i];
                            }
                        }
                    }else if(tanXY > -1 && tanXY < 0){
                        if(target == null) {
                            target = arr[i];
                        }else{
                            if((arr[i].x > whiteP.x && cursorX > whiteP.x) && (target.x > arr[i].x)){
                                target = arr[i];
                            }else if((arr[i].x < whiteP.x && cursorX < whiteP.x) && (target.x < arr[i].x)){
                                target = arr[i];
                            }
                        }
                    }else if(tanXY <= -1){
                        if(target == null) {
                            target = arr[i];
                        }else{
                            if((arr[i].y > whiteP.y && cursorY > whiteP.y) && (target.y > arr[i].y)){
                                target = arr[i];
                            }else if((arr[i].y < whiteP.y && cursorY < whiteP.y) && (target.y < arr[i].y)){
                                target = arr[i];
                            }
                        }
                    }
                }
            }
            if(target != null){
                console.log(target.x +" --  "+target.y);
                this.updateLine(cc.v2(this.whiteCircle.x,this.whiteCircle.y),cc.v2(target.x,target.y));
            }else{
                if(this.ctx != null)this.ctx.clear();
            }
            // console.log(event.getLocationX()+" : "+event.getLocationY());
            // console.log(this.whiteCircle.x+" & "+this.whiteCircle.y);
            // console.log(whiteP.x+" && "+whiteP.y);
        },this);
    },

    isHit:1,
    updateLine(v1,v2){
        if(this.ctx == null){
            this.ctx = this.node.getChildByName("graphics").getComponent(cc.Graphics);
        }
        this.ctx.clear();
        this.ctx.moveTo(v1.x,v1.y);
        this.ctx.lineTo(v2.x,v2.y);
        this.ctx.stroke();
        // var gra = this.node.getChildByName("graphics").getComponent(cc.Graphics);
        // gra.moveTo(50,50);
        // gra.lineTo(50,150);
        // gra.stroke();
        // console.log(this.graphicsNode);
        // if(this.graphicsNode == null || this.graphicsNode == undefined){
        //     this.graphicsNode = new cc.Node("graphicsNode");
        //     this.ctx = this.addComponent(cc.Graphics);
        //     this.graphicsNode.parent = this.node;
        // }
        // if(this.isHit == 1){
        //     this.isHit = 0;
        //     this.ctx.moveTo(0,0);
        // }
        // console.log(this.ctx);
        // this.ctx.moveTo(0,0);
        // this.ctx.lineTo(100,100);
        // this.ctx.stroke();
    },


    update (dt) {

    },
});
