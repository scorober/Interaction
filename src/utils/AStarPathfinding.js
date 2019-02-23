import Vector from './Vector.js'

export default class AStarPathfinding {
    constructor(world, pathStart, pathEnd) {
        this.world = world
        this.pathStart = pathStart
        this.pathEnd = pathEnd

        this.worldWidth = world[0].length
        this.worldHeight = world.length
        this.worldSize = this.worldWidth * this.worldHeight

        this.distanceFunction = this.diagonalDistance
        this.findNeighbours = this.diagonalNeighbours

        /** Any tile with a number higher than this number is considered "walkable"
         * All values below this number will be considered blocked.
         */
        this.maxWalkableTileNum = 4
    }

    // Path function, executes AStar algorithm operations
    // eslint-disable-next-line complexity
    calculatePath() {
        // create Nodes from the Start and End x,y coordinates
        const mypathStart = new Node(null, { x: this.pathStart[0], y: this.pathStart[1] }, this.worldWidth)
        const mypathEnd = new Node(null, { x: this.pathEnd[0], y: this.pathEnd[1] }, this.worldWidth)
        // create an array that will contain boolean values all world cells (if the path has been visited, it will be true)
        let visitedNodes = new Array(this.worldSize)
        // list of currently open Nodes
        let openNodes = [mypathStart]
        // list of closed Nodes
        let closedNodes = []
        // list of the final output array
        const result = []
        // reference to a Node (that is nearby)
        let myNeighbours
        // reference to a Node (that we are considering now)
        let myNode
        // reference to a Node (that starts a path in question)
        let myPath
        // temp integer variables used in the calculations
        let length, max, min, i, j
        // iterate through the open list until none are left
        while (openNodes.length > 0) {
            length = openNodes.length
            max = this.worldSize
            min = -1
            for (i = 0; i < length; i++) {
                if (openNodes[i].f < max) {
                    max = openNodes[i].f
                    min = i
                }
            }
            // grab the next node and remove it from Open array
            myNode = openNodes.splice(min, 1)[0]
            // is it the destination node?
            if (myNode.worldIndex === mypathEnd.worldIndex) {
                myPath = closedNodes[closedNodes.push(myNode) - 1]
                do {
                    result.push(new Vector(myPath.x, myPath.y))
                    myPath = myPath.parentNode
                }
                while (myPath != null)
                // clear the working arrays
                visitedNodes = closedNodes = openNodes = []
                // we want to return start to finish
                result.reverse()
            }
            else // not the destination
            {
                // find which nearby nodes are walkable
                myNeighbours = this.neighbors(myNode.x, myNode.y)
                // test each one that hasn't been tried already
                for (i = 0, j = myNeighbours.length; i < j; i++) {
                    myPath = new Node(myNode, myNeighbours[i], this.worldWidth)
                    if (!visitedNodes[myPath.worldIndex]) {
                        // estimated cost of this particular route so far
                        myPath.g = myNode.g + this.distanceFunction(myNeighbours[i], myNode)
                        // estimated cost of entire guessed route to the destination
                        myPath.f = myPath.g + this.distanceFunction(myNeighbours[i], mypathEnd)
                        // remember this new path for testing above
                        openNodes.push(myPath)
                        // mark this node in the world graph as visited
                        visitedNodes[myPath.worldIndex] = true
                    }
                }
                // remember this route as having no more untested options
                closedNodes.push(myNode)
            }
        } // keep iterating until until the Open list is empty
        return result
    }
    // eslint-disable-next-line complexity
    neighbors(x, y) {
        const n = y - 1
        const s = y + 1
        const e = x + 1
        const w = x - 1
        const nPassable = n > -1 && this.canWalkHere(x, n)
        const sPassable = s < this.worldHeight && this.canWalkHere(x, s)
        const ePassable = e < this.worldWidth && this.canWalkHere(e, y)
        const wPassable = w > -1 && this.canWalkHere(w, y)
        const result = []
        if (nPassable)
            result.push({ x: x, y: n })
        if (ePassable)
            result.push({ x: e, y: y })
        if (sPassable)
            result.push({ x: x, y: s })
        if (wPassable)
            result.push({ x: w, y: y })
        this.findNeighbours(nPassable, sPassable, ePassable, wPassable, n, s, e, w, result)
        return result
    }

    canWalkHere(x, y) {
        return ((this.world[y] != null) &&
            (this.world[y][x] != null) &&
            (this.world[y][x] <= this.maxWalkableTileNum))
    }

    manhattanDistance(point, goal) {	// linear movement - no diagonals - just cardinal directions (NSEW)
        return Math.abs(point.x - goal.x) + Math.abs(point.y - goal.y)
    }

    diagonalDistance(point, goal) {	// diagonal movement - assumes diag dist is 1, same as cardinals
        return Math.max(Math.abs(point.x - goal.x), Math.abs(point.y - goal.y))
    }

    euclideanDistance(point, goal) {	// diagonals are considered a little farther than cardinal directions
        // diagonal movement using Euclide (AC = sqrt(AB^2 + BC^2))
        // where AB = x2 - x1 and BC = y2 - y1 and AC will be [x3, y3]
        return Math.sqrt(Math.pow(point.x - goal.x, 2) + Math.pow(point.y - goal.y, 2))
    }

    // returns every available North East, South East,
    // South West or North West cell - no squeezing through
    // "cracks" between two diagonals
    // eslint-disable-next-line complexity
    diagonalNeighbours(nPassable, sPassable, ePassable, wPassable, n, s, e, w, result) {
        if (nPassable) {
            if (ePassable && this.canWalkHere(e, n))
                result.push({ x: e, y: n })
            if (wPassable && this.canWalkHere(w, n))
                result.push({ x: w, y: n })
        }
        if (sPassable) {
            if (ePassable && this.canWalkHere(e, s))
                result.push({ x: e, y: s })
            if (wPassable && this.canWalkHere(w, s))
                result.push({ x: w, y: s })

        }
    }

    // returns every available North East, South East,
    // South West or North West cell including the times that
    // you would be squeezing through a "crack"
    // eslint-disable-next-line complexity
    diagonalNeighboursFree(nPassable, sPassable, ePassable, wPassable, n, s, e, w, result) {
        nPassable = n > -1
        sPassable = s < this.worldHeight
        ePassable = e < this.worldWidth
        wPassable = w > -1
        if (ePassable) {
            if (nPassable && this.canWalkHere(e, n))
                result.push({ x: e, y: n })
            if (sPassable && this.canWalkHere(e, s))
                result.push({ x: e, y: s })
        }
        if (wPassable) {
            if (nPassable && this.canWalkHere(w, n))
                result.push({ x: w, y: n })
            if (sPassable && this.canWalkHere(w, s))
                result.push({ x: w, y: s })
        }
    }
}

// Node function, returns a new object with Node properties
// Used in the calculatePath function to store route costs, etc.
class Node {
    constructor(parentNode, point, worldWidth) {
        this.parentNode = parentNode
        this.point = point
        this.worldIndex = point.y * worldWidth + point.x
        this.x = this.point.x
        this.y = this.point.y
        this.f = 0
        this.g = 0

    }
}