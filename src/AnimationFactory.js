import Animation from './Animation.js'

export default class AnimationFactory {
    /**
     * Slices the spritesheet into rows and returns Animation objects using getNextRow(...)
     * @param {HTMLImageElement} spritesheet The entire spritesheet for this Entity
     * @param {number} scale The scale at which to draw the sprites
     */
    constructor(spritesheet, height, width, scale = 1) {
        this.spritesheet = spritesheet
        this.scale = scale
        this.height = height
        this.width = width
        this.startY = 0
        this.row = 1
    }

    /**
     * Returns the next row of sprites as a single Animation object.
     * @param {Number} frames The number of sprite frames in this row
     * @param {number} rate Duration before switching to the next sprite frame
     * @returns The animation on the next row, or false if no more rows of sprites exist.
     */
    getNextRow(frameCount, rate, options = {}) {
        const defaults = {
            loop: true,
            yOffset: 0 
        }
        options = Object.assign({}, defaults, options)
        const width = options.width ? options.width : this.width
        const height = options.height ? options.height : this.height
        if (this.startY + width <= this.spritesheet.height) {
            const animation = new Animation(this.spritesheet, width, height, this.startY, frameCount, options.yOffset, rate, options.loop, this.scale, options.maxFrames)
            this.startY += height
            this.row += 1
            return animation
        } else {
            return false
        }
    }

    /**
     * Checks whether the spritesheet has another row of sprites
     * @param {Number} frameHeight The height of the expected next row
     */
    hasNextRow(frameHeight) {
        return this.startY + frameHeight <= this.spritesheet.height
    }

    /**
     * Moves the AnimationFactory back to a previous row. This can be useful to create alternative animations
     * based on the frame of a different animation. For example, LPC Standing is a modified Walking animation
     * @param {number} rows The number of rows to reverse
     * @param {number} totalHeight The total height to reverse
     */
    rewindFactory(rows, totalHeight) {
        this.rows -= rows
        this.startY -= totalHeight
    }
}