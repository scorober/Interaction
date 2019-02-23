export default class Component {
    /**
     * 
     * @param {Entity} entity A reference to the Entity this Component is attached to
     */
    constructor(entity) {
        if (new.target === Component) {
            throw new TypeError('Cannot instantiate Component directly')
        }
        this.entity = entity
    }

    update() {
        
    }

    draw() {

    }
}