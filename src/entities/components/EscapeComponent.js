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
        this.rng = new Random()
        this.starting = true
        this.foundEscape = false
        this.evading = false
        this.escaped = false
       
    }

    // eslint-disable-next-line complexity
    update() {
        const currentTile = this.entity.game.sceneManager.currentScene.map.getTile(this.entity)
        const nearEnemies = []
        if (this.starting) {
            this.targetTile = this.entity.game.sceneManager.currentScene.map.getTile(this.entity)
            this.starting = false
        }
        //Set the current room.
        this.currentRoom = this.entity.game.sceneManager.currentScene.map.getRoomByTile(this.entity.game.sceneManager.currentScene.map.getTile(this.entity))
        //Check if arrived at destination.
        this.checkArrived(currentTile)
        //Add room to visited rooms.
        this.checkRoomVisited()
        //Check if this is the exit. If so stop searching for rooms and head to center.
        if (this.currentRoom.tag === 'exit'  && this.escaped === false) {
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
        }


        if (nearEnemies.length > 0) {
            // this.goToRoom(this.getNewRoom())
            this.knownEnemies = nearEnemies.slice()
        } else {
            this.evading = false
        }
    }


    checkArrived(currentTile) {
        if (Map.checkSameTile(this.targetTile, currentTile)) {
            if (this.foundEscape) {
                this.escaped = true
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
        return this.entity.game.sceneManager.currentScene.map.getRoomByTile(this.entity.game.sceneManager.currentScene.map.getTile(entity)).tag === 'exit'
    }

    getNewRoom() {
        let id = this.entity.game.sceneManager.currentScene.map.getRandomRoom()
        while (this.knownRooms.includes(id)) {
            id = this.entity.game.sceneManager.currentScene.map.getRandomRoom()
        }
        return id
    }

    /**
     * @param {Number} id 
     */
    goToRoom(id) {
        this.targetTile = this.entity.game.sceneManager.currentScene.map.getRoomCenter(id)
        this.entity.getComponent(MovementComponent).setPathfindingTarget(this.targetTile)
    }

}