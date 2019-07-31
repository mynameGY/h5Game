
cc.Class({
    extends: cc.Component,

    properties: {
        mouseJoint: true,
        tableNode:{
            default:null,
            type:cc.Node,
        }
    },
    
    TABLE_WIDTH:1000,
    TABLE_HEIGTH:500,
    whiteCircle:cc.Node,

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
    },

    update (dt) {},
});
