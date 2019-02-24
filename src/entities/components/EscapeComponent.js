import Component from './Component.js'
import Vector from '../../utils/Vector.js'
import Random from '../../utils/Random.js'
import MovementComponent from './MovementComponent.js';
import Map from '../../world/Map.js'

export default class EscapeComponent extends Component {
    constructor(entity, map) {
        super(entity)
        this.knownEnemies = []
        this.knownRooms = []
        this.map = map
        this.rng = new Random()
        // this.currentRoom = this.map.getRoomByTile(this.map.getTile(entity))
        this.targetTile = this.map.getTile(this.entity)

    }

    update() {
        console.log('he')
        const currentTile = this.map.getTile(this.entity)
        // if (Map.checkSameTile(this.targetTile, currentTile)) {
        //     this.goToRoom(this.getNewRoom())
        // }
        if (!this.knownEnemies.includes(this.currentRoom)) {
            this.knownRooms.push(this.currentRoom)
        }
        // if (this.entity.game.sceneManager.currentScene.getNearbyEnemies.length > 0) {
        //     this.goToRoom(this.getNewRoom())
        //     //EXPAND HERE
        // }

    }


    checkIfExit() {
        return this.map.getRoomByTile(this.map.getTile(entity)).tag === 'exit'
    }

    getNewRoom() {
        let id
        do {
           id = this.entity.game.sceneManager.currentScene.map.getRandomRoom()
        }
        while (!this.knownRooms.includes(id)) 
        return id
    }

    /**
     * TODO THIS IS BUGGED, freezing full game!
     * @param {Number} id 
     */
    goToRoom(id) {
        this.targetTile = this.map.getRoomCenter(id)
        this.entity.getComponent(MovementComponent).setPathfindingTarget(this.targetTile)
    }

}