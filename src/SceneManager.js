/**
 * Scene manager saves all of the game scenes, and calls the correct one.
 */
import FirstLevel from './world/scenes/FirstLevel.js'
import { HitCircle, CollisionLayer } from './utils/Collision.js'
import LoadLevel from './world/scenes/LoadLevel.js'
import Camera from './entities/Camera.js'
import { KEYS } from './utils/Const.js'

export default class SceneManager {
    constructor() {
        this.game = {}
        this.scenes = []
        this.collisionLayer = {}
        this.currentScene = {}
        this.saveState
        this.socket = io.connect('http://24.16.255.56:8888')
        // console.log(this.socket)
        
        // this.socket.on('load', function (data) {
        //     const saveState = data.data
        //     console.log(saveState)
        //     return saveState
        // })
        // const express = require('express')
        // const app = express() 
        // const io = require('socket.io').listen(app.listen(port))



    }
    init(game) {
        this.game = game
        this.collisionLayer = new CollisionLayer()
        const firstlevel = new FirstLevel(game)
        this.addScene(firstlevel.name, firstlevel)
        this.currentScene = firstlevel
    }

    /**
     * Adds ascene to the collection of scenes
     * @param name the name of the new scene
     * @param scene a reference ot the scene
     */
    addScene(name, scene) {
        //TODO: Check if exists
        this.scenes[name] = scene
    }

    /**
     * Returns a scene by its name
     * @param name of the scene
     * @returns {scene}
     */
    getScene(name) {
        return this.scenes[name]
    }

    /**
     * Calls update func for active scene
     */
    update() {
        this.currentScene.update()
        if (this.game.inputManager.downKeys[KEYS.KeyS]) {
            this.game.sceneManager.save()
        }
        if (this.game.inputManager.downKeys[KEYS.KeyL]) {
            this.game.sceneManager.load()
        }
        if (this.game.inputManager.downKeys[KEYS.KeyC]) {
            console.log(this.game.camera)
        }
        // console.log(this.currentScene)
    }

    /**
     * This function calls the draw function for the active scene
     */
    draw() {
        this.currentScene.draw()
    }

    /**
     * This function changes from one scene to another
     * @param name the name of the scene you want to change to
     */
    change(name) {
        const params = {}
        this.currentScene.exit()  //exit old scene
        this.currentScene = this.getScene(name)
        this.currentScene.enter(params) //enter new scene
    }

    /**
     * Adds an entity to the collidable layer. Checks to ensure it has a hitbox before being added.
     *
     * @param entity the entity to be added.
     */
    addCollidableEntity(entity) {
        if (null != entity) {
            if (null === entity.hitbox) {
                entity.hitbox = new HitCircle(entity.radius, entity.x, entity.y)
            }
            this.collisionLayer.addCollidable(entity)
        }
    }

    getCollidablesXYScreen(pos) {
        const ret = []
        for (let i = 0; i < this.currentScene.entities.length; i++) {
            const entity = this.currentScene.entities[i]
            const collisionComponent = entity.getComponent(CollisionComponent)
            if (collisionComponent) {
                const collides = collisionComponent.checkCollisionScreen(pos)
                if (collides) {
                    ret.push(entity)
                }
            }

        }
        return ret
    }

    save() {
        const saveState = {}
        saveState.name = this.currentScene.name + 'SAVE'
        saveState.map = this.currentScene.map.getMap()
        saveState.entities = this.currentScene.getEntities()
        // saveState.game = this.game
        this.saveState = saveState
        this.currentScene.entities = []
        console.log('saving...', saveState)
        // saveState.map = 
        this.socket.emit("save", {studentname: "Scott Robertson", statename: "gameState", data: saveState})
        // console.log('saved')
        // this.currentScene.camera = null
        
    }

    load() {
        // var saveState
        const game = this.game
        const self = this
        this.socket.on('load', function (data) {
            const saveState = data.data
            // if (saveState) {
            //     const level = new LoadLevel(game, saveState)
            //     self.addScene = (level.name, level)
            //     self.currentScene = level    
            // }
            console.log('loading...', saveState)
        })
        this.socket.emit('load', { studentname: 'Scott Robertson', statename: 'gameState'})
        console.log(this.currentScene)

    
    }
}