import Component from './Component.js'
import AttributeComponent from './AttributeComponent.js'

export default class CombatComponent extends Component {
    constructor(entity) {
        super(entity)
        this.attributeComponent = this.entity.getComponent(AttributeComponent)
        this.dmgTimer = 0
        this.combatTarget = false
    }

    /**
     * Update's the entity's attack timer to mitigate time between attacks.
     * Checks if the entity is dead.
     */
    update() {
        this.dmgTimer -= this.entity.game.clockTick
        if (this.checkDead()) {
            this.entity.game.removeEntityByRef(this.entity)
        }
        if (this.combatTarget && this.dmgTimer <= 0) {
            this.meleeAttack()
            this.dmgTimer = 3
        }
    }

    /**
     * Sets the current combat target to attack
     * 
     * @param {Entity} foe The Entity to begin attacking
     */
    setCombatTarget(foe) {
        this.combatTarget = foe
    }

    /**
     * Unsets the current combat target
     */
    unsetCombatTarget() {
        this.combatTarget = false
    }

    /**
     * Initiates a melee attack from this Entity to Entity foe
     */
    meleeAttack() {
        const dmg = this.calculatePhysicalDamage()
        const killed = this.combatTarget.applyPhysicalDamage(dmg)
        if (killed) {
            this.unsetCombatTarget()
        }
    }

    /**
     * Initiates a magic attack from this Entity to Entity foe
     * 
     * @param {Entity} foe  The Entity being attacked
     */
    magicAttack(foeCombatComponent) {
        const dmg = this.calculateMagicDamage()
        const killed = foeCombatComponent.applyMagicDamage(dmg)
        if (killed) {
            this.unsetCombatTarget()
        }
    }

    /**
     * Calculates the damage output of this entity so it can be applied onto it's target
     *
     * @returns {number} the damage to apply
     */
    calculatePhysicalDamage(modifiers = {}) {
        const appliedStr = modifiers.Str + this.attributeComponent.Str || this.attributeComponent.Str
        const appliedAtk = modifiers.Atk + this.attributeComponent.Atk || this.attributeComponent.Atk
        return Math.random() * appliedStr + appliedAtk
    }

    calculateMagicDamage(modifiers) {
        const appliedInt = modifiers.Int + this.attributeComponent.Int || this.attributeComponent.Int
        const appliedMatk = modifiers.Matk + this.attributeComponent.Matk || this.attributeComponent.Matk
        return Math.random() * appliedInt + appliedMatk
    }

    /**
     * Applies INCOMING damage to the entity.
     *
     * @param damage - the damage to be applied, BEFORE it is mitigated by defense
     *
     * @returns {boolean} true if entity is killed, false if still alive
     */
    applyPhysicalDamage(damage) {
        damage = Math.max(0, damage)
        damage = damage * damage / (damage + this.attributeComponent.Def)
        this.displayDamage = true
        this.damageColor = 'red'
        this.lastDamage = damage
        this.attributeComponent.HP -= damage
        //check if dead
        if (this.checkDead()) {
            this.entity.game.removeEntityByRef(this.entity)
            return true
        }
        return false
    }

    /**
     * Applies INCOMING magic dmg to the entity.
     *
     * @param damage - the damage to be applied, BEFORE it is mitigated by defense
     *
     * @returns {boolean} true if entity is killed, false if still alive
     */
    applyMagicDamage(damage) {
        damage = Math.max(0, damage)
        damage = damage * damage / (damage + this.attributeComponent.Mdef)
        this.displayDamage = true
        this.damageColor = 'blue'
        this.lastDamage = damage
        this.attributeComponent.HP = this.attributeComponent.HP - damage
        if (this.checkDead()) {
            this.entity.game.removeEntityByRef(this.entity)
            return true
        }

        return false
    }

    checkDead() {
        return this.attributeComponent.HP <= 0 || this.entity.removeFromWorld
    }

}
