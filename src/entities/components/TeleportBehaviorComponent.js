import Component from './Component.js'
import AnimationComponent from './AnimationComponent.js'
import { ANIMATIONS as ANIMS } from '../../utils/Const.js'

export class TeleportBehaviorComponent extends Component {
    constructor(entity, targetEntity, target) {
        super(entity)
        this.target = target
        this.targetEntity = targetEntity
        this.targetEntity.getComponent(AnimationComponent).getCurrentAnimation().setDraw(false)
        this.setTelportAnims()

     
    }

    setTelportAnims() {
        this.animComp = this.entity.getComponent(AnimationComponent)
        this.animComp.setAnimation(ANIMS.TeleportOut, () => {
            this.entity.x = this.target.x                
            this.entity.y = this.target.y
            

            this.animComp.setAnimation(ANIMS.TeleportIn, () => {
                this.targetEntity.x = this.target.x
                this.targetEntity.y = this.target.y
                this.targetEntity.getComponent(AnimationComponent).getCurrentAnimation().setDraw(true)
      
                this.entity.removeFromWorld = true
            })
        })
    }

    checkValidTarget() {
        return this.entity.game.getWorld()[this.target.x][this.target.y] <= 4
    }
}