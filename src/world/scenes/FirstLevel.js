import Scene from './Scene.js'
import Map from '../Map.js'
import Dungeon from '../generators/Dungeon.js'
import Background from '../Background.js'
import Entity from '../../entities/Entity.js'
import { ASSET_PATHS, SPAWNERS } from '../../utils/Const.js'

import PlayerCharacterData from '../../entities/characters/PlayerCharacterDefaultData.js'
import ArcherData from '../../entities/characters/ArcherDefaultData.js'
import MarriottData from '../../entities/characters/MarriottDefaultData.js'

import MovementComponent from '../../entities/components/MovementComponent.js'
import MarriottMovementComponent from '../../entities/components/MarriottMovementComponent.js'
import PlayerInputComponent from '../../entities/components/PlayerInputComponent.js'
import AnimationComponent from '../../entities/components/AnimationComponent.js'
import SpawnerBehaviorComponent from '../../entities/components/SpawnerBehaviorComponent.js'
import CollisionComponent from '../../entities/components/CollisionComponent.js'
import AttributeComponent from '../../entities/components/AttributeComponent.js'
import CombatComponent from '../../entities/components/CombatComponent.js'
import SpawnerData from '../../entities/effects/SpawnerDefaultData.js'
import EnemyInteractionComponent from '../../entities/components/InteractionComponent/EnemyInteractionComponent.js'
import MarriottInteractionComponent from '../../entities/components/InteractionComponent/MarriottInteractionComponent.js'
import Vector from '../../utils/Vector.js'
import DoorInteractionComponent from '../../entities/components/InteractionComponent/DoorInteractionComponent.js'

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
                    position: [100, 100] //OPTIONAL pos of initial room 
                },
                any: {
                    min_size: [15, 15],
                    max_size: [25, 27],
                    max_exits: 4
                },
                spawn: {
                    min_size: [15, 15],
                    max_size: [25, 25],
                    max_exits: 4
                },
                empty: {
                    min_size: [15, 15],
                    max_size: [25, 25],
                    max_exits: 4
                },
                exit: {
                    min_size: [15, 15],
                    max_size: [20, 20],
                    max_exits: 1
                },
                treasure: {
                    min_size: [12, 12],
                    max_size: [21, 12],
                    max_exits: 3
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

        const map = new Map(game, game.getAsset(ASSET_PATHS.Dungeon), 64, 16, dungeon, this)
        this.setMap(map)
        this.setBackground(new Background(game, game.getAsset(ASSET_PATHS.Background)))
        const start = this.map.getStartPos()

        const playerCharacter = this.createPlayerCharacter(game, start)
        const archer = this.createArcher(game, start, playerCharacter)

        this.setPlayer(playerCharacter)
        this.addEntity(playerCharacter)
        this.addEntity(archer)
        this.addEntity(game.camera)
        this.game.camera.setFollowedEntity(playerCharacter)

        this.createMapEntities(game, map)

    }

    createMapEntities(game, map) {
        this.createSpawners(game, map)
        this.createExits(game, map)
    }

    createExits(game, map) {
        
        for (const exit of map.exits) {
            const doorBox = map.getDoorBox(exit.tiles)
            const door = new Entity(game, new Vector(doorBox.x, doorBox.y))
            door.addComponent(new DoorInteractionComponent(door, exit.tiles, exit.destination, exit. room))
            door.addComponent(new CollisionComponent(door, doorBox))
            this.addEntity(door)
        }
    }


    createSpawners(game, map) {
        for (const mapSpawner of map.spawners) {
            const spawner = new Entity(game, mapSpawner.pos)
            spawner.addComponent(new AnimationComponent(spawner, SpawnerData.AnimationConfig))
            spawner.addComponent(new SpawnerBehaviorComponent(spawner, this, SPAWNERS.Mage, mapSpawner.r, 4, mapSpawner.room))
            this.addEntity(spawner)
        }
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
        pc.addComponent(new MarriottInteractionComponent(pc))
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