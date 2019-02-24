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
        this.targetTile = this.map.getTile(this.entity)

    }

    update() {
        const currentTile = this.map.getTile(this.entity)
        if (Map.checkSameTile(this.targetTile, currentTile)) {
            this.setPatrol()
        }
    }


    getNewRoom() {
        return this.map.getRoomCenter(this.map.getRandomRoom())
    }

    setPatrol() {
        this.targetTile = this.getNewRoom()
        this.entity.getComponent(MovementComponent).setPathfindingTarget(this.targetTile)
    }

}