
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},
    start () {
    },
    // update (dt) {},

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        console.log("onBeginContact");
        
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        console.log("onEndContact");
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        console.log("onPreSolve");
        var worldManifold = contact.getWorldManifold();
        var points = worldManifold.points;
        var normal = worldManifold.normal;
        otherCollider.body.applyLinearImpulse(cc.p(normal.x*100,normal.y*100),points[0])
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        console.log("onPostSolve");
    }
});
