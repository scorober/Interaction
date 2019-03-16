import Component from './Component.js'
import Random from '../../utils/Random.js'
import Map from '../../world/Map.js'
import MovementComponent from './MovementComponent.js'

export default class PatrolComponent extends Component {
    constructor(entity, map) {
        super(entity)
        this.rng = new Random()
        this.starting = true      

    }

    update() {
        if (this.starting) {
            this.targetTile = this.entity.game.sceneManager.currentScene.map.getTile(this.entity)
            this.starting = false
        }
        const currentTile = this.entity.game.sceneManager.currentScene.map.getTile(this.entity)
        if (Map.checkSameTile(this.targetTile, currentTile)) {
            this.setPatrol()
        }
    }


    getNewRoom() {
        return this.entity.game.sceneManager.currentScene.map.getRoomCenter(this.entity.game.sceneManager.currentScene.map.getRandomRoom())
    }

    setPatrol() {
        this.targetTile = this.getNewRoom()
        this.entity.getComponent(MovementComponent).setPathfindingTarget(this.targetTile)
    }

}