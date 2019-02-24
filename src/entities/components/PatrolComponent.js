import Component from './Component.js'
import Random from '../../utils/Random.js'
import Vector from '../../utils/Vector.js'
import Map from '../../world/Map.js'
import MovementComponent from './MovementComponent.js';

export default class PatrolComponent extends Component {
    constructor(entity, map) {
        super(entity)
        this.rng = new Random()
        this.map = map
        this.targetTile = this.getTile()
        const currentTile = this.getTile()

    }

    update() {
        const currentTile = this.getTile()
        if (Map.checkSameTile(this.targetTile, currentTile)) {
            this.setPatrol()
        }
    }

    draw() {

    }


    getNewRoom() {
        return this.map.getRoomCenter(this.map.getRandomRoom())
    }

    setPatrol() {
        this.targetTile = this.getNewRoom()
        this.entity.getComponent(MovementComponent).setPathfindingTarget(this.targetTile)
    }

    getTile() {
        return  Map.worldToTilePosition(Vector.vectorFromEntity(this.entity), 64)
    }
}