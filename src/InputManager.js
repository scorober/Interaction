import { CTX_EVENTS } from './utils/Const.js'
import Vector from './utils/Vector.js'

export default class InputManager {
    constructor() {
        this.ctx = null
        this.downKeys = {}
        // (x, y) coordinate: Current mouse position over the canvas
        this.mousePosition = null
        // (x, y) coordinate: Right clicks, left clicks, all overwrite this value
        this.newLeftClick = false
        this.lastLeftClickPosition = false

        this.newRightClick = false
        this.lastRightClickPosition = false
        // (e) Event object: Last mouse wheel event stored here
        this.mouseWheel = null
    }

    registerEventListeners(ctx) {
        this.ctx = ctx
        this.ctx.canvas.addEventListener(CTX_EVENTS.LeftClick,
            e => {
                this.lastLeftClickPosition = this.getXandY(e)
                this.newLeftClick = true
            },
            false
        )

        this.ctx.canvas.addEventListener(CTX_EVENTS.RightClick,
            e => {
                this.lastRightClickPosition = this.getXandY(e)
                this.newRightClick = true
                e.preventDefault()
            },
            false
        )

        this.ctx.canvas.addEventListener(CTX_EVENTS.MouseMove,
            e => { this.mousePosition = this.getXandY(e) },
            false
        )

        this.ctx.canvas.addEventListener(CTX_EVENTS.MouseWheel,
            e => { this.mouseWheel = e }, false)

        this.ctx.canvas.addEventListener(CTX_EVENTS.KeyDown,
            e => {
                /** e.code cooresponds to strings describing the key like ArrowUp, ArrowDown, KeyE, KeyW, Digit5, e.t.c */
                this.downKeys[e.code] = true
            },
            false
        )

        this.ctx.canvas.addEventListener(CTX_EVENTS.KeyUp,
            e => { this.downKeys[e.code] = false },
            false
        )
    }

    getXandY(e) {
        const x = e.clientX - this.ctx.canvas.getBoundingClientRect().left
        const y = e.clientY - this.ctx.canvas.getBoundingClientRect().top
        return new Vector(x, y)
    }

    /**
     * Reset values between game loops to prevent overlap
     */
    clear() {
        this.downKeys = {}
        this.newLeftClick = false
        this.lastLeftClickPosition = false
        this.newRightClick = false
        this.lastRightClickPosition = false
        this.mouseWheel = null
    }

    hasRightClick() {
        return this.newRightClick
    }

    getRightClick() {
        if (this.hasRightClick()) {
            this.newRightClick = false
            return this.lastRightClickPosition
        } else {
            return false
        }
    }

    hasLeftClick() {
        return this.newRightClick
    }

    getLeftClick() {
        if (this.hasLeftClick()) {
            this.newRightClick = false
            return this.lastRightClickPosition
        } else {
            return false
        }
    }
}
