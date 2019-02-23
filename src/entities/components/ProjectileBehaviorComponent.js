import Component from './Component.js'
import Vector from '../../utils/Vector.js'
import MovementComponent from './MovementComponent.js'
import AnimationComponent from './AnimationComponent.js'
import { ANIMATIONS as ANIMS } from '../../utils/Const.js'

export default class ProjectileBehavior extends Component {
    /**
     * This component moves a projectile and switches animations.
     * Projectiles can have 3 stages. (Initial, Projectile, and Impact)
     * Projectiles must have projectile and impact animations, initial is optional.
     * 
     * @param {Entity} entity A reference to the Entity this Component is attached to.
     * @param {Vector} target  Target of the projectile
     * @param {boolean} initial  True if this projectile has an initial animation
     */
    constructor(entity, target, hasInitialAnimation) {
        super(entity)
        this.v = Vector.vectorFromEntity(entity)
        this.target = new Vector(target.x, target.y)
        const t = new Vector(target.x, target.y)
        this.angle = Vector.getAngle(this.v, this.target) //TODO flip arrow sprite
        this.dir = t.subtract(this.v).normalized()
        this.animComp = this.entity.getComponent(AnimationComponent)
        this.animComp.setAngle(this.angle)
        if (hasInitialAnimation) {
            this.animComp.setAnimation(ANIMS.Initial, () => {
                this.animComp.setAnimation(ANIMS.Projectile)
            })
        } else {
            this.animComp.setAnimation(ANIMS.Projectile)
        }
    }

    /**
     * Called each update cycle
     * Moves projectile, if target is reached switches to impact anim and does damage.
     */
    update() {
        this.v = Vector.vectorFromEntity(this.entity)
        if (this.v.distance(this.target) < 20) {
            const cb = () => {
                this.impact()
                this.entity.removeFromWorld = true
            }
            this.animComp.setAnimation(ANIMS.Impact, cb)
        } else {
            this.entity.getComponent(MovementComponent).move(this.dir)
        }
    }

    draw() { }

    /**
     * Call on an attack or Attribute component from the caster to do damage.
     */
    impact() {

    }
}