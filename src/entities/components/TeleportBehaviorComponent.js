import Component from './Component.js'
import AnimationComponent from './AnimationComponent.js'
import { ANIMATIONS as ANIMS } from '../../utils/Const.js'
import Vector from '../../utils/Vector.js'
import Map from '../../world/Map.js'

export class TeleportBehaviorComponent extends Component {
    constructor(entity, targetEntity, target) {
        super(entity)
        this.targetEntity = targetEntity
        this.target = target
        this.targetEntity.getComponent(AnimationComponent).getCurrentAnimation().setDraw(false)
        if (!this.checkValidTarget()) {
            this.target = Vector.vectorFromEntity(targetEntity)
        }
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
        const checkTile = Map.worldToTilePosition(this.target, 64)
        return this.entity.game.getWorld()[checkTile.y][checkTile.x] <= 4
    }
}