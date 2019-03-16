import Entity from '../entities/Entity.js'
import Array2D from '../utils/Array2d.js'
import { ASSET_PATHS, MAP_ITEMS as MI, ROOMS, RIGHT, LEFT, TOP, BOTTOM, TILE_COLLISION as TC, STATES } from '../utils/Const.js'
import Vector from '../utils/Vector.js'
import Random from '../utils/Random.js'

export default class Map extends Entity {
    /**
     *
     * @param game a reference ot the game object
     * @param tileAtlas the .png/.jpg whatever file
     * @param tileSize
     * @param setLength Number of tiles wide
     * @param tiles  a reference to the tile array map thing
     */
    constructor(game, dungeon, scene, map) {
        super(game, 0, 0)
        this.x = 0
        this.y = 0
        this.tileAtlas = game.getAsset(ASSET_PATHS.Dungeon)
        this.tileSize = 64
        this.setLength = 16
        this.rng = new Random()
        this.scene = scene
        if (map) {
            this.map0 = map.map0
            this.map1 = map.map1
            this.map2 = map.map2
            this.map3 = map.map3
            this.exits = map.exits
            this.rooms = map.rooms
            this.rows = map.rows
            this.cols = map.cols
        } else {
            this.dungeon = dungeon
            this.rows = dungeon.size[1]
            this.cols = dungeon.size[0]
            this.exits = [] //Array of door positions and room they enter.
            this.rooms = []
            this.buildMap()
        }
        this.count = 0
    }

    getStartPos() {
        return new Vector(
            this.dungeon.start_pos[0] * this.tileSize,
            this.dungeon.start_pos[1] * this.tileSize + 100
        )
    }

    buildMap() {
        const rooms = this.dungeon.room_count
        const size = [this.dungeon.size[0] + rooms, this.dungeon.size[1] + rooms]

        /* 
         * Map0: Base layer: floors, empty tiles and walls.
         * Map1: Object layer 1: Doors, most objects
         * Map2: Top object layer: Door ceilings
         */
        this.map0 = new Array2D(size, 0)
        this.map1 = new Array2D(size, 0)
        this.map2 = new Array2D(size, 0)
        this.map3 = new Array2D(size, 0)

        const dungeon = this.dungeon
        for (const piece of dungeon.children) {
            // console.log(piece)
            this.buildWalls(piece)
            this.buildRoom(piece)
            this.buildExits(piece)

            piece.states = {
                [STATES.Opened]: false,
                [STATES.Upgraded]: false,
                [STATES.Cleared]: false
            }
            // this.removeAllExits()
            // this.openRoomExits(1)
            this.rooms.push(piece)
        }
    }

    /**
     * 
     * @param {Array2D} map Map layer this object is created in. 
     * @param {Array} pos Map position of upper left corner of object.
     * @param {Array} object 2D array representing the object.
     */
    createObject(map, pos, object) {
        for (let row = 0; row < object.length; row++) {
            for (let col = 0; col < object[0].length; col++) {
                const point = [pos[0] + col, pos[1] + row]
                map.set(point, object[row][col])
            }
        }
    }

    /**
     * Generates corner positions and sizes of a room for wall building.
     * @param {Piece} piece Room that has these properties.
     */
    generateRoomProperties(piece) {
        const pos = piece.position
        const size = piece.size
        const w = size[0]
        const h = size[1]
        const x = pos[0]
        const y = pos[1]
        const outerPos = [x + 1, y + 1]
        const innerSize = [w - 4, h - 4]

        return {
            posNW: outerPos,
            posNE: [outerPos[0] + innerSize[0], outerPos[1]],
            posSW: [outerPos[0], outerPos[1] + innerSize[1]],
            posSE: [outerPos[0] + innerSize[0], outerPos[1] + innerSize[1]],
            outerPos: [x + 1, y + 1],
            innerPos: [x + 2, y + 2],
            innerSize: [w - 4, h - 4]
        }

    }

    /**
     * Builds the default floor and walls on map base layer.
     * @param {Piece} piece Current piece 
     */
    buildWalls(piece) {

        //Corners and sizes
        const p = this.generateRoomProperties(piece)

        //Set floor
        this.map0.set_square(p.innerPos, p.innerSize, 4, true)

        //North
        this.map0.set_horizontal_line(this.alterPos(p.outerPos, 1, 0), p.innerSize[0] - 1, MI.WallNorth[0][0])
        this.map0.set_horizontal_line(p.innerPos, p.innerSize[0] - 1, MI.WallNorth[1][0])
        //East
        this.map0.set_vertical_line(this.alterPos(p.posNE, 1, 2), p.innerSize[1] - 3, MI.WallEast[1])
        this.map0.set_vertical_line(this.alterPos(p.posNE, 0, 2), p.innerSize[1] - 3, MI.WallEast[0])
        //South
        this.map0.set_horizontal_line(this.alterPos(p.posSW, 2, 0), p.innerSize[0] - 3, MI.WallSouth[0][0])
        this.map0.set_horizontal_line(this.alterPos(p.posSW, 2, 1), p.innerSize[0] - 3, MI.WallSouth[1][0])
        //West
        this.map0.set_vertical_line(this.alterPos(p.posNW, 0, 2), p.innerSize[1] - 3, MI.WallWest[0])
        this.map0.set_vertical_line(this.alterPos(p.innerPos, 0, 1), p.innerSize[1] - 3, MI.WallWest[1])

        //Add corners
        this.createObject(this.map0, p.posNE, MI.ICornerNE)
        this.createObject(this.map0, p.posNW, MI.ICornerNW)
        this.createObject(this.map0, p.posSW, MI.ICornerSW)
        this.createObject(this.map0, p.posSE, MI.ICornerSE)
    }

    // eslint-disable-next-line complexity
    /**
     * Builds objects in tagged rooms.
     * @param {Piece} piece Room objects will be built in.
     */
    buildRoom(piece) {
        const center = piece.global_pos(piece.get_center_pos())
        switch (piece.tag) {
            case ROOMS.Initial:
                this.createObject(this.map1, center, MI.ChestClosed)
                break
            case ROOMS.Any:
                this.createObject(this.map1, this.alterPos(center, -1, -1), MI.Rug)
                break
            case ROOMS.Treasure:
                this.createObject(this.map1, center, MI.ChestOpen)
                break
            case ROOMS.Exit:
                this.createObject(this.map1, center, MI.StairsN)
                break
        }
    }

    
    /**
     * Builds exits for each piece in a room.
     * @param {Piece} piece Room that generates exits.
     */
    // eslint-disable-next-line complexity
    buildExits(piece) {
        for (const exit of piece.exits) {
            const tiles = []
            //Create the floor between rooms
            const exitPos = piece.global_pos(exit[0])
            //Create this exit door
            if (exit[1] === TOP || exit[1] === BOTTOM) {
                const transPos = this.alterPos(exitPos, 0, -2)
                this.createObject(this.map0, transPos, MI.DoorPathV)
                if (exit[1] === TOP) {
                    const doorPos = this.alterPos(piece.global_pos(exit[0]), -1, 1)
                    this.createObject(this.map1, doorPos, MI.Door0)
                    this.createObject(this.map3, doorPos, MI.Door0Top)
                    tiles.push(this.alterPos(doorPos, 1, 1))
                    tiles.push(this.alterPos(doorPos, 2, 1))
                    this.addExit(exit[2].id, piece.id, tiles)
                } else {
                    const doorPos = this.alterPos(piece.global_pos(exit[0]), -1, -2)
                    this.createObject(this.map1, doorPos, MI.Door180)
                    this.createObject(this.map3, doorPos, MI.Door180Top)
                    tiles.push(this.alterPos(doorPos, 1, 0))
                    tiles.push(this.alterPos(doorPos, 2, 0))
                }
            } else {  //East and West
                const transPos = this.alterPos(exitPos, -2, 0)
                this.createObject(this.map0, transPos, MI.DoorPathH)
                if (exit[1] === RIGHT) {
                    const doorPos = this.alterPos(exitPos, 1, -1)
                    this.createObject(this.map1, doorPos, MI.Door90)
                    this.createObject(this.map3, doorPos, MI.Door90Top)
                    tiles.push(this.alterPos(doorPos, 1, 1))
                    tiles.push(this.alterPos(doorPos, 1, 2))
                }
                if (exit[1] === LEFT) {
                    const doorPos = this.alterPos(piece.global_pos(exit[0]), -2, -1)
                    this.createObject(this.map1, doorPos, MI.Door270)
                    this.createObject(this.map3, doorPos, MI.Door270Top)
                    tiles.push(this.alterPos(doorPos, 0, 1))
                    tiles.push(this.alterPos(doorPos, 0, 2))
                }
            }
        }
    }

    getDoorBox(tiles) {
        let minX = Number.MAX_VALUE
        let minY = Number.MAX_VALUE
        let maxX = Number.MIN_VALUE
        let maxY = Number.MIN_VALUE

        tiles.forEach(function(tile) {
            minX = Math.min(minX, tile[0])
            minY = Math.min(minY, tile[1])
            maxX = Math.max(maxX, tile[0])
            maxY = Math.max(maxY, tile[1])
        })
        return {
            x: minX * this.tileSize,
            y: minY * this.tileSize,
            width: (maxX - minX) * this.tileSize,
            height: (maxY - minY) * this.tileSize
        }
    }

    /**
     * Replaces door tiles with floor tiles.
     * @param {Array} tiles Door tiles that need to be replaced with floor
     */
    openExit(tiles) {
        for (let i = 0; i < tiles.length; i++) {
            this.map2.set(tiles[i], 13)
        }
    }

    /**
     * Populates an array of exits for entity creation. Matches pairs with doors.
     * @param {Number} destination ID of the destination room.
     * @param {Number} room ID of the current room.
     * @param {Array} tiles Array of tile positions that represent the exit door.
     */
    addExit(destination, room, tiles) {
        let newExit = true
        this.exits.forEach(function(exit) {
            if (exit.destination === room && exit.room === destination) {
                //push tiles to existing exit
                newExit = false

                for (let i = 0; i < tiles.length; i++) {
                    exit.tiles.push(tiles[i])
                }
    
            }
        })
        if (newExit) {
            //Add new exit
            this.exits.push( 
                {
                    tiles: tiles,
                    room: room,
                    destination: destination,
                }
            )
        } 
    }

    /**
     * Mostly for debugging. Replaces all doors with floor tiles.
     */
    removeAllExits() {
        for (let i = 0; i < this.exits.length; i++) {
            this.openExit(this.exits[i].tiles)
        }
    }

    openRoomExits(id) {
        for (let i = 0; i < this.exits.length; i++) {
            if (this.exits[i].room === id ) {
                this.openExit(this.exits[i].tiles)
            }
        }
    }

    /**
     * Alters a position array for use with Array2D and dungeon generator.
     * @param {Array} pos A map position.
     * @param {Number} dx Change in x.
     * @param {Number} dy Change in y.
     */
    alterPos(pos, dx, dy) {
        return [pos[0] + dx, pos[1] + dy]
    }

    /**
     * Builds the pathfinding array from all map layers.
     * If a collidable tile exists in one of the layers that tile
     * coordinate is marked collidable.
     */
    // eslint-disable-next-line complexity
    getPathfindingArray() {
        const array = []
        for (let i = 0; i < this.map0.rows.length; i++) {
            array[i] = []
            for (let j = 0; j < this.map0.rows[i].length; j++) {

                const tile0 = this.map0.get([j, i])
                const tile1 = this.map1.get([j, i])
                const tile2 = this.map2.get([j, i])

                if (tile0 === 0 && tile1 === 0 && tile2 === 0) {
                    array[i][j] = 115 //Set to value that doesn't exist 
                    //in TC array to show empty space
                } else {
                    const layeredTiles = [tile0, tile1, tile2]
                    const nonZeroTiles = []
                    for (let i = 0; i < 3; i++) {
                        if (layeredTiles[i] !== 0) {
                            nonZeroTiles.push(this.mapValueToPathfindingValue(layeredTiles[i]))
                        }
                    }
                    let max = 0
                    for (let i = 0; i < nonZeroTiles.length; i++) {
                        max = Math.max(max, nonZeroTiles[i])
                    }
                    array[i][j] = max
                }
            }
        }
        return array

    }

    /**
     * Values in the map coorespond to tileset tiles.
     * i.e. 0 is empty, 38 is door, 4 is regular floor.
     * The pathing algorithm uses a maxWalkable value, so anything above 4 for example
     * is "unwalkable". This method changes walkable tiles (doors which are 38) to
     * a lower value that the algorithm deems "walkable".
     */
    mapValueToPathfindingValue(value) {
        return TC[value]
    }

    update() { }

    draw() {
        this.count++
        if (Math.floor(this.count % 100) === 0) {
            console.log(this.scene.camera)
        }
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const tile = this.map0.get([c, r])
                const objTile = this.map1.get([c, r])
                const objTile2 = this.map2.get([c,r])
                this.drawTile(c, r, tile)
                this.drawTile(c, r, objTile)
                this.drawTile(c, r, objTile2)
            }
        }
    }

    drawTop() {
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const objTile1 = this.map3.get([c, r])
                this.drawTile(c, r, objTile1)
            }
        }
    }

    /**
     * Draw a tile at [c, r]
     * @param {*} c Column 
     * @param {*} r Row
     * @param {*} tile Tile being drawn
     */
    drawTile(c, r, tile) {
        
        const cam = this.game.sceneManager.currentScene.camera
        const width = this.game.ctx.canvas.width
        const height = this.game.ctx.canvas.height
        const centerTile = Map.worldToTilePosition(new Vector(cam.xView + width / 2, cam.yView + height / 2), this.tileSize)
        const tilesWide = Math.ceil(width / this.tileSize)
        const tilesTall = Math.ceil(height / this.tileSize)
        const tileInView = this.tileInView(c, r, centerTile, tilesWide + 2, tilesTall + 2)
        if (tile && tileInView) {
            const tileX = c * this.tileSize - cam.xView
            const tileY = r * this.tileSize - cam.yView
            this.game.ctx.drawImage(
                this.tileAtlas,
                ((tile - 1) % this.setLength * this.tileSize),
                Math.floor((tile - 1) / this.setLength) * this.tileSize,
                this.tileSize,
                this.tileSize,
                Math.floor(tileX - this.tileSize / 2), //Placement on canvas
                Math.floor(tileY - this.tileSize / 2),
                this.tileSize,
                this.tileSize
            )
        }
    }


    tileInView(r, c, centerTile, tilesWide, tilesTall) {
        return (c > centerTile.y - tilesTall / 2 &&
            c < centerTile.y + tilesTall / 2 &&
            r > centerTile.x - tilesWide / 2 &&
            r < centerTile.x + tilesWide / 2)
    }

    static tileToWorldPosition(obj, tileSize) {
        return new Vector(
            obj.x * tileSize,
            obj.y * tileSize
        )
    }

    /**
     * Converts from world coordinates (measured in pixels starting from the top left of the Map)
     * to 
     */
    static worldToTilePosition(obj, tileSize) {
        return new Vector(
            Math.floor((obj.x + tileSize / 2) / 64),
            Math.floor((obj.y + tileSize / 2) / 64)
        )
    }

    /**
     * Generates a radius for spawners to create an area for mobs to spawn.
     * @param {Object} piece The piece this radius covers. 
     */
    getRadius(piece) {
        const size = Math.min(piece.size[0], piece.size[1])
        return Math.floor((size - 6) / 2 * 64)
    }

    /**
     * Index of room in array is equal to id - 1.
     * @param {Number} id 
     */
    getRoom(id) {
        return this.rooms[id - 1]
    }

    /**
     * Get the center tile of a room.
     * @param {Number} id Id of room to find center of.  
     */
    getRoomCenter(id) {
        const room = this.getRoom(id)
        return new Vector(
            room.global_pos(room.get_center_pos())[0],
            room.global_pos(room.get_center_pos())[1]
        )
       
    }

    /**
     * Returns a random int id out of all but initial room.
     */
    getRandomRoom() {
        return this.rng.int(2, this.rooms.length)
    }

    /**
     * Checks if two tiles are the same...
     * TODO use vector equals...
     * @param {Vector} tile0 
     * @param {Vector} tile1 
     */
    static checkSameTile(tile0, tile1) {
        return tile0.x === tile1.x && tile0.y === tile1.y
    }


    /**
     * Gets the room ID based on the position of a tile.
     * @param {Vector} tile Tile to be checked.
     */
    getRoomByTile(tile) {
        // const pos = Map.worldToTilePosition(Vector.vectorFromEntity(entity), this.tileSize)
        for (let i = 0; i < this.rooms.length; i++) {
            const x0 = this.rooms[i].position[0]
            const x1 = x0 + this.rooms[i].size[0]
            const y0 = this.rooms[i].position[1]
            const y1 = y0 + this.rooms[i].size[1]
            if (tile.x >= x0 && tile.x <= x1 && tile.y >= y0 && tile.y <= y1) {
                return this.rooms[i]
            }
        }
    }

    getMap() {
        return  {
            map0: this.map0,
            map1: this.map1,
            map2: this.map2,
            map3: this.map3,
            rooms: this.rooms,
            exits: this.exits,
            rows: this.rows,
            cols: this.cols

        }
    }

    
    getTile(entity) {
        return  Map.worldToTilePosition(Vector.vectorFromEntity(entity), 64)
    }
}