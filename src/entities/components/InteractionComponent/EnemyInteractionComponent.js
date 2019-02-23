import InteractionComponent from './InteractionComponent.js'
import AttributeComponent from '../AttributeComponent.js'
import AnimationComponent from '../AnimationComponent.js'
import CombatComponent from '../CombatComponent.js'
import Vector from '../../../utils/Vector.js'

export default class EnemyInteractionComponent extends InteractionComponent {
    constructor(entity) {
        super(entity)
    }

    update() {
    }

    draw() {
        super.update()
        if (this.hovered) {
            this.drawMouseover()
        }
    }

    drawMouseover() {
        const attributeComponent = this.entity.getComponent(AttributeComponent)
        const animationComponent = this.entity.getComponent(AnimationComponent)
        if (attributeComponent && animationComponent) {
            const ctx = this.entity.game.ctx
            const currentAnimation = animationComponent.getCurrentAnimation()
            const height = currentAnimation.getHeight()
            const screenPos = this.entity.game.worldToScreen(new Vector(this.entity.x, this.entity.y)) // get position on screen
            const fontSize = 14
            const HP = attributeComponent.HP.toFixed(1)
            ctx.textAlign = 'center'
            ctx.font = fontSize + 'px arcade'
            ctx.fillStyle = 'red'
            ctx.fillText(attributeComponent.Name, screenPos.x, screenPos.y + height / 2 - currentAnimation.yOffset)
            ctx.fillText('HP:' + HP, screenPos.x, screenPos.y + height / 2 - currentAnimation.yOffset + fontSize + 3)
        }
    }

    setAttacking() {
        const enemyCombatComponent = this.entity.getComponent(CombatComponent)
        if (enemyCombatComponent) {
            const player = this.entity.game.getCurrentScene().getPlayer()
            const playerCombatComponent = player.getComponent(CombatComponent)
            playerCombatComponent.setCombatTarget(enemyCombatComponent)
            enemyCombatComponent.setCombatTarget(playerCombatComponent)
        }
    }

    unsetAttacking() {
        const combatComponent = this.entity.getComponent(CombatComponent)
        if (combatComponent) {
            const player = this.entity.game.getCurrentScene().getPlayer()
            const playerCombatComponent = player.getComponent(CombatComponent)
            playerCombatComponent.unsetCombatTarget()
        }
    }

    setRightClick() {
        this.setAttacking()
    }

    unsetRightClick() {
        this.unsetAttacking()
    }

    setLeftClick() {

    }

    unsetLeftClick() {

    }
}