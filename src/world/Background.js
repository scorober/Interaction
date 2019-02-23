import Entity from '../entities/Entity.js'

export default class Background extends Entity{
    constructor(game, spritesheet) {
        super(game, 0, 0)
        this.x = 0
        this.y = 0
        this.spritesheet = spritesheet
        this.game = game
        this.ctx = game.ctx
    }

    draw() {
        this.ctx.drawImage(this.spritesheet, this.x, this.y)
    }

    update() { }
}