import InteractionComponent from './InteractionComponent.js'
import { STATES } from '../../../utils/Const.js';

export default class DoorInteractionComponent extends InteractionComponent {
    constructor(entity, tiles, destination, room) {
        super(entity)
        this.tiles = tiles
        this.destination = destination
        this.room = room
    }

    
    update() {
        super.update()
    }

    draw() {

    }

    setRightClick() {
        this.entity.game.sceneManager.currentScene.map.openExit(this.tiles)
        this.entity.game.sceneManager.currentScene.map.getRoom(this.destination).states[STATES.Opened] = true
        this.entity.removeFromWorld = true
    }

    unsetRightClick() {

    }

    setLeftClick() {

    }

    unsetLeftClick() {

    }
}