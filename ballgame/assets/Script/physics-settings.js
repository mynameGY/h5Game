cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
    let physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
    //physicsManager.gravity = cc.v2();
    // 物理步长，默认 FIXED_TIME_STEP 是 1/60
    physicsManager.FIXED_TIME_STEP = 1/30;

    // physicsManager.debugDrawFlags = 
    //     // 0;
    //     // cc.PhysicsManager.DrawBits.e_aabbBit |
    //     cc.PhysicsManager.DrawBits.e_jointBit |
    //     cc.PhysicsManager.DrawBits.e_shapeBit
    //     ;
});