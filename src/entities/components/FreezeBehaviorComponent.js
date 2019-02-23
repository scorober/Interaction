import Component from './Component.js'
import Vector from '../../utils/Vector.js'
import AnimationComponent from './AnimationComponent.js'
import Random from '../../utils/Random.js'
import {
    ANIMATIONS as ANIMS
} from '../../utils/Const.js'

export default class FreezeBehaviorComponent extends Component {
    /**
     * The freeze spell, has instant impact and affects enemies in range
     * @param {Entity} entity 
     * @param {Object} target 
     */
    constructor(entity) {
        super(entity)
        //Entity location defined when created
        this.v = Vector.vectorFromEntity(entity)
        this.count = 0
        this.delay = 200
        this.rng = new Random()
        this.animComp = this.entity.getComponent(AnimationComponent)
        const cb = () => {
            this.entity.removeFromWorld = true
        }
        this.animComp.setAnimation(ANIMS.Impact, cb)
        this.delay = 200
        this.count = 0
    }

    update() {

    }

    draw() {

    }

    generateEffects() {
        
    }
}