import Scene from './Scene.js'
import Map from '../Map.js'
import Entity from '../../entities/Entity.js'
import MovementComponent from '../../entities/components/MovementComponent.js'
import AnimationComponent from '../../entities/components/AnimationComponent.js'
import EscapeComponent from '../../entities/components/EscapeComponent.js'
import MageData from '../../entities/characters/MageDefaultData.js'
import Camera from '../../entities/Camera.js';

export default class LoadLevel extends Scene {
    constructor(game, state) {
        super(game)
        this.name = state.name
        const map = new Map(game, null, this, state.map)
        this.setMap(map)
        this.createEntities(game, state.entities)
        this.findMage()
        console.log(this.entities)

    }

    createEntities(game, entities) {
        for (let i = 0; i < entities.length; i++) {
            const e = entities[i]
            const entity = new Entity(game, { x: e.x, y: e.y })
            entity.removeFromWorld = e.removeFromWorld
            entity.UUID = e.UUID
            entity.states = e.states
            e.components.forEach((c) => {
                c.entity = entity
                entity.addComponent(c)
            })
            this.addEntity(entity)
        }
    }
    createEscapeArtist(game, start, map) {
        const mage = new Entity(game, start)
        mage.addComponent(new AnimationComponent(mage, MageData.AnimationConfig))
        mage.addComponent(new MovementComponent(mage, MageData.Attributes))
        mage.addComponent(new EscapeComponent(mage, map))
        return mage
    }

    findMage() {
        console.log(this.entities.length)
        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i]
            if (e.getComponent(EscapeComponent)) {
                this.setCamera(e)

            }
        }
        console.log(this.entities.length)
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