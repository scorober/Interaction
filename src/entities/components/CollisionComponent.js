import Component from './Component.js'
import { STATES } from '../../utils/Const.js'
import { HitCircle } from '../../utils/Collision.js'
import Map from '../../world/Map.js'
import AnimationComponent from './AnimationComponent.js'
import Vector from '../../utils/Vector.js'

export default class CollisionComponent extends Component {
    constructor(entity, staticHitBox) {
        super(entity)
        this.animationComponent = this.entity.getComponent(AnimationComponent)
        this.isStatic = false

        if (staticHitBox) {
            this.setStaticHitbox(staticHitBox)
            this.isStatic = true
            this.width = staticHitBox.width
            this.height = staticHitBox.height
        } else {
            this.setCollidableHitbox()
        }
    }

    update() {
        const pos = Map.worldToTilePosition(this.entity, this.entity.game.getTileSize())
        this.hitbox.update(pos.x, pos.y)
    }

    /**
     * Creates a static hitbox for map interaction objects.
     * @param {Object} staticHit Contains width and height of the static hitbox.
     */
    setStaticHitbox(staticHit) {
        this.entity.states[STATES.Collidable] = true
        this.radius = Math.max(staticHit.width, staticHit.height) / 2
        this.hitbox = new HitCircle(
            this.radius, this.entity.x + staticHit.width / 2, this.entity.y + staticHit.height / 2
        )
    }

    /**
     * Sets an entities state to be collidable and creates a hitbox from it's dimensions.
     * This may be replaced and moved to attribute component.
     *
     * Depreciated
     */
    setCollidableHitbox() {
        this.entity.states[STATES.Collidable] = true
        const animation = this.animationComponent.getCurrentAnimation()
        const width = animation.getWidth()
        const height = animation.getHeight()
        const yOffset = animation.yOffset
        const xOffset = 0 // This is not currently a thing in Animation
        const radius = Math.max(width, height) / 2
        this.hitbox = new HitCircle(radius, this.entity.x + xOffset, this.entity.y - height + yOffset)
    }

    /**
     * Uses the WORLD-TO-SCREEN converter in the game engine to determine if an entity is at a certain location.
     *
     * @param vector
     * @returns {boolean}
     */
    checkCollisionScreen(vector) {
        if (this.isStatic) {
            return this.checkStaticCollisionScreen(vector)
        } else {
            const currentAnim = this.entity.getComponent(AnimationComponent).getCurrentAnimation()
            const height = currentAnim.getHeight()
            const width = currentAnim.getWidth()
            const hitboxScreenPos = this.entity.game.worldToScreen(new Vector(this.entity.x, this.entity.y - height / 2)) // get position on screen
            const dist = vector.distance(hitboxScreenPos)
            if (dist < this.hitbox.radius) {
                const distY = vector.absdistanceY(hitboxScreenPos)
                const distX = vector.absdistanceX(hitboxScreenPos)
                return (distX < width && distY < height)
            }
        }

    }


    checkStaticCollisionScreen(vector) {
        const hitboxScreenPos = this.entity.game.worldToScreen(
            new Vector(this.entity.x + this.width / 2, this.entity.y + this.height / 2)
        )
        const dist = vector.distance(hitboxScreenPos)
        if (dist < this.hitbox.radius) {
            const distY = vector.absdistanceY(hitboxScreenPos)
            const distX = vector.absdistanceX(hitboxScreenPos)
            return (distX < this.width && distY < this.height)
        }
    }

    /**
     * Uses the SCREEN-TO-WORLD converter in the game engine to determine if an entity is at a certain location.
     *
     * @param vector
     * @returns {boolean}
     */
    checkCollisionWorld(vector) {
        const ret = { collides: false, distance: null }
        const dist = vector.distance(this)
        if (dist < this.size) {
            ret.distance = dist
            const distY = vector.absdistanceY(this)
            const distX = vector.absdistanceX(this)
            ret.collides = distX < this.width && distY < this.height
        }
        return ret
    }
}