
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    gameJs:cc.Class,
    // onLoad () {},

    start () {
        this.gameJs = this.node.parent.getComponent("game");
    },

     // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("doorCollide onBeginContact");
        if(selfCollider.name == "doorLeft"){
            this.gameJs.over("right");
        }else{
            this.gameJs.over("left");
        }
    },

    // update (dt) {},
});
