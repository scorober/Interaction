import Vector from './Vector.js'

export class CollisionLayer {

    constructor() {
        this.collidables = []
    }

    addCollidable(e) {

        //TODO: Collidable object that contains entity as well as x/y location for easy reference?
        this.collidables.push(e)

    }

    /**
     * Returns an array of entities that collide with a given entity
     * @param entity the entity to check collision for
     * @returns {*[]}
     */
    getCollidableArray(entity){

        return this.collidables.filter(e =>
            (e.UUID !== entity.UUID) && (entity.location.distance(e.hitbox.location) <= (entity.radius + e.hitbox.radius + 1))
        )
    }

    /**
     * Given an entity and a destination, this func will return true or false if there are any collisions.
     * @param entity the entity to check collision for
     * @param destination the x,y vector
     * @returns {boolean}
     */
    collides(entity, destination) {

        if (!entity.hitbox) {
            return null
        }
        for (let i = 0; i < this.collidables.length; i++) {
            const e = this.collidables[i]
            if (e.UUID !== entity.UUID) {
                const distance = destination.distance(e.hitbox.location)
                const rads = entity.hitbox.radius + e.hitbox.radius + 0.5
                //console.log('distance:', distance)
                //console.log('rads: ', rads)
                if (distance <= rads) {
                    return true
                }
            }
        }
        return false
    }

}

//TODO: Implement other shapes like box? Can be used together.
export class HitCircle{

    constructor(radius, x, y){
        this.radius = radius
        this.location = new Vector(x, y)
    }

    /**
     * Updates the hitbox coords with new x/y value
     * @param x
     * @param y
     */
    update(x, y){
        this.location.x = x
        this.location.y = y
    }
}