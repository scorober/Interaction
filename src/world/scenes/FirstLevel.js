import Scene from './Scene.js'
import Map from '../Map.js'
import Dungeon from '../generators/Dungeon.js'
import Background from '../Background.js'
import Entity from '../../entities/Entity.js'
import { ASSET_PATHS } from '../../utils/Const.js'

import PlayerCharacterData from '../../entities/characters/PlayerCharacterDefaultData.js'
import ArcherData from '../../entities/characters/ArcherDefaultData.js'
import RobotData from '../../entities/characters/RobotDefaultData.js'

import MovementComponent from '../../entities/components/MovementComponent.js'
import PlayerInputComponent from '../../entities/components/PlayerInputComponent.js'
import AnimationComponent from '../../entities/components/AnimationComponent.js'
import CollisionComponent from '../../entities/components/CollisionComponent.js'
import AttributeComponent from '../../entities/components/AttributeComponent.js'
import CombatComponent from '../../entities/components/CombatComponent.js'
import EnemyInteractionComponent from '../../entities/components/InteractionComponent/EnemyInteractionComponent.js'
import Vector from '../../utils/Vector.js'
import PatrolComponent from '../../entities/components/PatrolComponent.js'
import MageData from '../../entities/characters/MageDefaultData.js'
import EscapeComponent from '../../entities/components/EscapeComponent.js'

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
        // dungeon.print()

        const map = new Map(game, game.getAsset(ASSET_PATHS.Dungeon), 64, 16, dungeon, this)
        this.setMap(map)
        this.setBackground(new Background(game, game.getAsset(ASSET_PATHS.Background)))
        const start = this.map.getStartPos()

        const playerCharacter = this.createPlayerCharacter(game, start)
        // const archer = this.createArcher(game, start, playerCharacter)

        this.setPlayer(playerCharacter)
        this.addEntity(playerCharacter)
        // this.addEntity(archer)
        this.addEntity(game.camera)
        this.game.camera.setFollowedEntity(playerCharacter)

        for (let i = 0; i < 10; i++) {
            const robot = this.createRobotPatroller(game, map)
            this.addEntity(robot)
        }

        const mage = this.createEscapeArtist(game, start, map)
        this.addEntity(mage)


    }

    createEscapeArtist(game, start, map) {
        const mage = new Entity(game, start)
        mage.addComponent(new AnimationComponent(mage, MageData.AnimationConfig))
        mage.addComponent(new MovementComponent(mage, MageData.Attributes))
        mage.addComponent(new AttributeComponent(mage, MageData.Attributes))
        mage.addComponent(new CollisionComponent(mage, MageData.Attributes))
        mage.addComponent(new EnemyInteractionComponent(mage))
        mage.addComponent(new CombatComponent(mage))
        mage.addComponent(new EscapeComponent(mage, map))
        return mage
    }

    createRobotPatroller(game, map) {
        const pos = Map.tileToWorldPosition(map.getRoomCenter(map.getRandomRoom()), 64)
        const robot = new Entity(game, pos)
        robot.addComponent(new AnimationComponent(robot, RobotData.AnimationConfig))
        robot.addComponent(new MovementComponent(robot, RobotData.Attributes))
        robot.addComponent(new AttributeComponent(robot, RobotData.Attributes))
        robot.addComponent(new CollisionComponent(robot))
        robot.addComponent(new EnemyInteractionComponent(robot))
        robot.addComponent(new CombatComponent(robot))
        robot.addComponent(new PatrolComponent(robot, map))
        return robot
    }

    createArcher(game, start, playerCharacter) {
        const archer = new Entity(game, start, ArcherData.Attributes)
        archer.addComponent(new AnimationComponent(archer, ArcherData.AnimationConfig))
        archer.addComponent(new MovementComponent(archer, ArcherData.Attributes))
        archer.addComponent(new AttributeComponent(archer, ArcherData.Attributes))
        archer.addComponent(new CollisionComponent(archer))
        archer.addComponent(new EnemyInteractionComponent(archer))
        archer.addComponent(new CombatComponent(archer))
        archer.getComponent(MovementComponent).setFollowTarget(playerCharacter)
        return archer
    }

    createPlayerCharacter(game, start) {
        const pc = new Entity(game, start, PlayerCharacterData.Attributes)
        pc.addComponent(new AnimationComponent(pc, PlayerCharacterData.AnimationConfig))
        pc.addComponent(new AttributeComponent(pc, PlayerCharacterData.Attributes))
        pc.addComponent(new MovementComponent(pc, PlayerCharacterData.Attributes))
        pc.addComponent(new CollisionComponent(pc))
        pc.addComponent(new CombatComponent(pc))
        pc.addComponent(new PlayerInputComponent(pc))
        return pc
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