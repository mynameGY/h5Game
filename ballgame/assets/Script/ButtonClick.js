
cc.Class({
    extends: cc.Component,

    properties: {
        game:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    clickButton:function(){
        console.log("+++++++++++++clickButton+++++++++++++");
        this.game.getComponent('game').gameStart();
    }

    // update (dt) {},
});
