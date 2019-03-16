import Scene from './Scene.js'
import Map from '../Map.js'
import Dungeon from '../generators/Dungeon.js'
import Entity from '../../entities/Entity.js'
import RobotData from '../../entities/characters/RobotDefaultData.js'
import MovementComponent from '../../entities/components/MovementComponent.js'
import AnimationComponent from '../../entities/components/AnimationComponent.js'
import PatrolComponent from '../../entities/components/PatrolComponent.js'
import MageData from '../../entities/characters/MageDefaultData.js'
import EscapeComponent from '../../entities/components/EscapeComponent.js'
import { KEYS } from '../../utils/Const.js'

export default class FirstLevel extends Scene {
    constructor(game) {
        super(game)
        this.name = 'level1'
        //Initialize a dungeon with options, possibly move to the scene superclass w/ parameters.
        const dungeon = new Dungeon({
            size: [2000, 2000],
            // seed: 'abcd', //omit for generated seed
            rooms: {
                initial: {
                    min_size: [12, 12], //Floor size
                    max_size: [12, 12],
                    max_exits: 4,

                },
                any: {
                    min_size: [15, 15],
                    max_size: [20, 20],
                    max_exits: 4
                },

                exit: {
                    min_size: [15, 15],
                    max_size: [20, 20],
                    max_exits: 4
                }
            },
            max_corridor_length: 15,
            min_corridor_length: 15,
            corridor_density: 0, //corridors per room, remove corridors? They'll be tagged as such.
            symmetric_rooms: true, // exits must be in the center of a wall if true. Setting true will make design easier
            interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
            max_interconnect_length: 10,
            room_count: 20
        })

        dungeon.generate()

        const map = new Map(game, dungeon, this)
        this.setMap(map)
        const start = this.map.getStartPos()

        for (let i = 0; i < 10; i++) {
            const robot = this.createRobotPatroller(game, map)
            this.addEntity(robot)
        }

        const mage = this.createEscapeArtist(game, start, map)
        this.addEntity(mage)
        this.setCamera(mage)
    }

    createEscapeArtist(game, start, map) {
        const mage = new Entity(game, start)
        mage.addComponent(new AnimationComponent(mage, MageData.AnimationConfig))
        mage.addComponent(new MovementComponent(mage, MageData.Attributes))
        mage.addComponent(new EscapeComponent(mage, map))
        return mage
    }

    createRobotPatroller(game, map) {
        const pos = Map.tileToWorldPosition(map.getRoomCenter(map.getRandomRoom()), 64)
        const robot = new Entity(game, pos)
        robot.addComponent(new AnimationComponent(robot, RobotData.AnimationConfig))
        robot.addComponent(new MovementComponent(robot, RobotData.Attributes))
        robot.addComponent(new PatrolComponent(robot, map))
        return robot
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