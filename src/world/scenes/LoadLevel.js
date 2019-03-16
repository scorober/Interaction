import Scene from './Scene.js'
import Map from '../Map.js'
import Entity from '../../entities/Entity.js'
import MovementComponent from '../../entities/components/MovementComponent.js'
import AnimationComponent from '../../entities/components/AnimationComponent.js'
import EscapeComponent from '../../entities/components/EscapeComponent.js'
import MageData from '../../entities/characters/MageDefaultData.js'
import Camera from '../../entities/Camera.js';

export default class LoadLevel extends Scene {
    constructor(state) {
        super(state.game)
        const game = state.game
        this.name = state.name
        const map = new Map(game, null, this, state.map)
        this.setMap(map)
        const mage = this.createEntities(game, state.entities)

    }

    createEntities(game, entities) {
        var mage
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i]
            const entity = new Entity(game, { x: e.x, y: e.y })
            entity.removeFromWorld = e.removeFromWorld
            entity.states = e.states
            e.components.forEach((c) => {
                entity.addComponent(c)
            })
            this.entities.push(entity)
            if (e.followMe) {
                const cam = new Camera(game)
                this.game.camera = cam
                this.game.camera.setFollowedEntity(entity)
                this.entities.push(cam)
            }
            
        }
        return mage
    }
    createEscapeArtist(game, start, map) {
        const mage = new Entity(game, start)
        mage.addComponent(new AnimationComponent(mage, MageData.AnimationConfig))
        mage.addComponent(new MovementComponent(mage, MageData.Attributes))
        mage.addComponent(new EscapeComponent(mage, map))
        return mage
    }

    /**
     * Updates this scene.
     */
    update() {
        //NOTE: These two functions were originally done automatically in the super class, but I added them
        //here to reduce confusion, and to allow the order they are updated/rendered to be adjusted.
        this.updateMap()
        this.updateEntities()
    }

    /**
     * Draw this scene.
     */
    draw() {
        this.drawBackground()
        this.drawMap()
        this.drawEntities()
        this.drawMapTop()
    }
}