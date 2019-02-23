/**
 * This class is modified from the original so that it doesn't depend on the 'random-seed' module.
 */

export default class Random {
    constructor(seed) {
        this.m = 0x80000000
        this.a = 651354887
        this.c = 65269

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1))
          
    }

    nextInt() {
        return this.state = (this.a * this.state + this.c) % this.m
    }

    int(min, max) {
        const rangeSize = max - min
        const rndFloat = this.nextInt() / this.m
        return min + Math.floor(rndFloat * rangeSize)
    }

    float() {
        return this.nextInt() / (this.m - 1)
    }

    vec(min, max){
        //min and max are vectors [int, int]
        //returns [min[0]<=x<=max[0], min[1]<=y<=max[1]]
        return [this.int(min[0], max[0]), this.int(min[1], max[1])]
    }

    choose(items, remove=false) {
        const idx = this.int(0, items.length - 1)
        if (remove) {
            return items.splice(idx, 1)[0]
        } else {
            return items[idx]
        }
    }

    maybe(probability) {
        return this.float() <= probability
    }
}

/**
 * Creates a random UUID
 *
 * @returns {string}
 */
export function create_UUID(){
    let dt = new Date().getTime()
    const uuid = 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0
        dt = Math.floor(dt/16)
        return (c=='x' ? r :(r&0x3|0x8)).toString(16)
    })
    return uuid
}