import Component from './Component.js'
import AnimationComponent from './AnimationComponent.js'
import AStarPathfinding from '../../utils/AStarPathfinding.js'
import Map from '../../world/Map.js'
import { DIRECTIONS, ANIMATIONS as ANIMS } from '../../utils/Const.js'
import Vector from '../../utils/Vector.js'

export default class MovementComponent extends Component {
    /**
     * @param {Entity} entity A reference to the Entity this Component is attached to
     * @param {Object} attributesConfig Attributes configuration object for this character.
     */
    constructor(entity, attributes) {
        super(entity)
        this.direction = DIRECTIONS.East
        this.speed = attributes.Speed
        this.path = []

        this.followTarget = null
        this.followTargetLastPos = null
        this.following = false
        this.moving = false
    }

    /**
     * Called each update cycle
     */
    update() {
        if (this.path.length > 0) {
            this.moving = true
            this.handlePathMovement()
            this.entity.getComponent(AnimationComponent).setDirectionalAnimation(this.direction, {
                north: ANIMS.WalkNorth,
                east: ANIMS.WalkEast,
                south: ANIMS.WalkSouth,
                west: ANIMS.WalkWest
            })
        } else if (this.moving) {
            this.moving = false
            this.entity.getComponent(AnimationComponent).setDirectionalAnimation(this.direction, {
                north: ANIMS.StandNorth,
                east: ANIMS.StandEast,
                south: ANIMS.StandSouth,
                west: ANIMS.StandWest

            })
        }
        if (this.following) {
            this.handleFollowing()
        }
    }

    /**
     * Called each draw cycle
     */
    draw() { }

    /**
     * Checks whether the follow target has moved and calculates new path if necessary
     */
    handleFollowing() {
        const followTargetPos = Map.worldToTilePosition(this.followTarget, this.entity.game.getTileSize())
        if (this.followTargetLastPos == null || this.followTargetLastPos.x != followTargetPos.x || this.followTargetLastPos.y != followTargetPos.y) {
            this.followTargetLastPos = followTargetPos
            this.setPathfindingTarget(this.getTileBehind(this.followTarget))
        }
    }

    /**
     * Handles movement according to previously calculated path.
     * Removes a tile from the path array when the Entity is close enough to it.
     * Updates this.direction
     */
    handlePathMovement() {
        const tile = this.path[0]
        const tilePosition = Map.tileToWorldPosition(tile, this.entity.game.sceneManager.currentScene.map.tileSize)
        // dx and dy are the x and y distances between this Entity and the tile in world position (pixels)
        let dx = tilePosition.x - this.entity.x
        let dy = tilePosition.y - this.entity.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.entity.game.getTileSize() / 2) {
            if (this.path.length > 0) {
                this.path.splice(0, 1)
            }
        } else {
            dx = dx / distance
            dy = dy / distance
            this.move(new Vector(dx, dy))
            this.direction = this.calculateDirection(dx, dy)
        }
    }

    /**
     * Moves the Entity according to its speed and the game's clock tick
     * @param {Vector} vec The vector representing the direction to move
     */
    move(vec) {
        this.entity.x += vec.x * this.entity.game.clockTick * this.speed
        this.entity.y += vec.y * this.entity.game.clockTick * this.speed
    }

    /**
     * Calculates the direction of the Entity based on current movement
     * @param {Number} dx The change in x this frame 
     * @param {Number} dy The change in y this frame
     */
    calculateDirection(dx, dy) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                return DIRECTIONS.East
            } else {
                return DIRECTIONS.West
            }
        } else {
            if (dy > 0) {
                return DIRECTIONS.South
            } else {
                return DIRECTIONS.North
            }
        }
    }

    /**
     * Sets the path to the specified tile index
     * @param {Number} x The x index of the tile to pathfind to (x values increase starting from the left going right)
     * @param {Number} y The y index of the tile to pathfind to (y values increase starting from the top going down)
     */
    setPathfindingTarget(tile) {
        const currentTile = this.getCurrentTile()
        const pathfinder = new AStarPathfinding(this.entity.game.getWorld(), [currentTile.x, currentTile.y], [tile.x, tile.y])
        this.path = pathfinder.calculatePath()
    }



    /**
     * Sets the follow target and sets following to true
     * @param {Entity} entity The Entity to follow
     */
    setFollowTarget(entity) {
        this.followTarget = entity
        this.following = true
    }

    /**
     * Sets following to false
     */
    stopFollowing() {
        this.following = false
    }

    /**
     * Sets the Entity's current direction
     * @param {Symbol} direction The direction to face the Entity
     */
    setDirection(direction) {
        this.direction = direction
    }

    /**
     * Gets the Entity's current tile position
     * @returns {Object} The current tile position object {x, y}
     */
    getCurrentTile() {
        return Map.worldToTilePosition(this.entity, this.entity.game.getTileSize())
    }

    /**
     * @returns {Symbol} The Entity's current facing
     */
    getDirection() {
        return this.direction
    }

    /**
     * Calculates the tile relative to this Entity's direction
     * If that tile is not available, calculates another tile near the Entity
     * Note: Could result in block-ins for the PlayerCharacter
     */
    getTileBehind(entity) {
        const entityTile = Map.worldToTilePosition(entity, this.entity.game.getTileSize())
        switch (this.entity.getComponent(MovementComponent).direction) {
            case DIRECTIONS.North:
                return new Vector(entityTile.x, entityTile.y + 1)
            case DIRECTIONS.South:
                return new Vector(entityTile.x, entityTile.y - 1)
            case DIRECTIONS.East:
                return new Vector(entityTile.x - 1, entityTile.y)
            case DIRECTIONS.West:
            default:
                return new Vector(entityTile.x + 1, entityTile.y)
        }
    }

    setSpeed(speed) {
        this.speed = speed
    }
}