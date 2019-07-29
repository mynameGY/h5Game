
cc.Class({
    extends: cc.Component,

    properties: {
        mouseJoint: true,
    },
    
    TABLE_WIDTH:1000,
    TABLE_HEIGTH:500,

    onLoad () {
        let node = new cc.Node();

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        if (this.mouseJoint) {
            // add mouse joint
            let joint = node.addComponent(cc.MouseJoint);
            joint.mouseRegion = this.node;    
        }
        
        this._addBound(node, 0,500/2, 1000, 20);
        this._addBound(node, 0, -500/2, 1000, 20);
        this._addBound(node, -1000/2, 0, 20, 500);
        this._addBound(node, 1000/2, 0, 20, 500);

        node.parent = this.node;
    },

    start () {

    },

    update (dt) {},

    _addBound (node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    }
});
