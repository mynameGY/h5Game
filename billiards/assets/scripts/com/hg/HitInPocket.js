cc.Class({
    extends: cc.Component,

    properties: {
        pocketNum:{
            default:"",
            displayName:"String",
        },
    },

    // onLoad () {},

    start () {
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("onBeginContact");
        if(this.pocketNum === "pocket1"){
                otherCollider.node.removeFromParent();
        }else if(this.pocketNum === "pocket2"){
                otherCollider.node.removeFromParent();
        }else if(this.pocketNum === "pocket3"){
                otherCollider.node.removeFromParent();
        }else if(this.pocketNum === "pocket4"){
                otherCollider.node.removeFromParent();
        }else if(this.pocketNum === "pocket5"){
                otherCollider.node.removeFromParent();
        }else if(this.pocketNum === "pocket6"){
                otherCollider.node.removeFromParent();
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        console.log(selfCollider.node.x,otherCollider.node.x,selfCollider.node.y , otherCollider.node.y) ;
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    }

    // update (dt) {},
});
