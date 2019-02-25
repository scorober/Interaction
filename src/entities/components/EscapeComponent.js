import Component from './Component.js'
import Vector from '../../utils/Vector.js'
import Random from '../../utils/Random.js'
import MovementComponent from './MovementComponent.js'
import Map from '../../world/Map.js'

export default class EscapeComponent extends Component {
    constructor(entity, map) {
        super(entity)
        this.knownEnemies = []
        this.knownRooms = []
        this.map = map
        this.rng = new Random()
        this.currentRoom = this.map.getRoomByTile(this.map.getTile(entity))
        this.targetTile = this.map.getTile(this.entity)
        this.foundEscape = false
        this.evading = false

    }

    update() {
        const currentTile = this.map.getTile(this.entity)
        const nearEnemies = this.entity.game.sceneManager.currentScene.getNearbyEnemies(this.entity, 250)

        //Set the current room.
        this.currentRoom = this.map.getRoomByTile(this.map.getTile(this.entity))
        //Check if arrived at destination.
        this.checkArrived(currentTile)
        //Add room to visited rooms.
        this.checkRoomVisited()
        //Check if this is the exit. If so stop searching for rooms and head to center.
        if (this.currentRoom.tag === 'exit') {
            if (this.foundEscape === false) {
                this.foundEscape = true
                this.goToRoom(this.currentRoom.id)
            }
            this.checkArrived(currentTile)
        }

        if (this.knownEnemies.length > 0 && this.knownEnemies.length === nearEnemies.length) {
            this.evading = true
            const mobVectors = []
            for (let i = 0; i < nearEnemies.length; i++) {
                const playerVec = Vector.vectorFromEntity(this.entity)
                const mv0 = Vector.vectorFromEntity(nearEnemies[i])
                const mv1 = Vector.vectorFromEntity(this.knownEnemies[i])
                if (playerVec.distance(mv0) < playerVec.distance(mv1)) {
                    mobVectors.push(mv1.subtract(mv0))
                }
            }
            this.handleEvasion(mobVectors)
        }


        if (nearEnemies.length > 0) {
            // this.goToRoom(this.getNewRoom())
            this.knownEnemies = nearEnemies.slice()
        } else {
            this.evading = false
        }

    }

    handleEvasion(vectors) {
        
    }

    checkArrived(currentTile) {
        if (Map.checkSameTile(this.targetTile, currentTile)) {
            if (this.foundEscape) {
                console.log('escaped!!!')
            } else {
                this.goToRoom(this.getNewRoom())
            }      
        }
    }

    checkRoomVisited() {
        if (!this.knownRooms.includes(this.currentRoom)) {
            this.knownRooms.push(this.currentRoom)
        }
    }

    getEnemyVector(ke, ne) {
        return Vector.vectorFromEntity(ke).subtract(Vector.vectorFromEntity(ne))
    }

    checkIfExit() {
        return this.map.getRoomByTile(this.map.getTile(entity)).tag === 'exit'
    }

    getNewRoom() {
        let id = this.map.getRandomRoom()
        while (this.knownRooms.includes(id)) {
            id = this.map.getRandomRoom()
        }
        return id
    }

    /**
     * @param {Number} id 
     */
    goToRoom(id) {
        this.targetTile = this.map.getRoomCenter(id)
        this.entity.getComponent(MovementComponent).setPathfindingTarget(this.targetTile)
    }

}