
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
    isTouch:false,
    isMove:false,
    startX:0,
    startY:0,
    blueX:0,
    blueY:0,
    currentX:0,
    currentY:0,

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

        // let joint = node.addComponent(cc.MouseJoint);
        // joint.mouseRegion = this.node;  

        node.parent = this.node;

        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = this.gravity;
    },
    start () {
        // this.yellow.getComponent(cc.RigidBody).enabledContactListener = true;
        // this.yellow.getComponent(cc.PhysicsCircleCollider).restitution = 10;

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

    
    update (dt) {
        if(this.isTouch && this.isMove){
            var newV2 = cc.v2(this.blueX + this.currentX - this.startX,this.blueY + this.currentY - this.startY);
            this.blue.setPosition(newV2);
        }
    },

    _addBound (node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    },

});
