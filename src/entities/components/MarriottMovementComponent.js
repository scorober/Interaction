import MovementComponent from './MovementComponent.js'
import AnimationComponent from './AnimationComponent.js'
import { ANIMATIONS as ANIMS, DIRECTIONS } from '../../utils/Const.js'


export default class MarriottMovementComponent extends MovementComponent {

    constructor(entity, attributes) {
        super(entity, attributes)
        this.sitStandAnimating = false
    }


    update() {
        if (this.sitStandAnimating === false) {
            if (this.path.length > 0) {
                // If just started moving and not currently animation
                if (this.moving === false) {
                    this.handleStanding()
                    return
                }
                this.handlePathMovement()
                this.entity.getComponent(AnimationComponent).setDirectionalAnimation(this.direction, {
                    north: ANIMS.WalkNorth,
                    east: ANIMS.WalkEast,
                    south: ANIMS.WalkSouth,
                    west: ANIMS.WalkWest
                })
            }
            else if (this.moving) {
                // If just stopped moving (because there's no more path data), but this.moving still true, and not currently animating
                this.handleSitting()
                return
            }
            if (this.following) {
                this.handleFollowing()
            }
        }
    }

    handleStanding() {
        this.sitStandAnimating = true
        const animationComponent = this.entity.getComponent(AnimationComponent)
        const cb = () => {
            this.moving = true
            this.sitStandAnimating = false
        }
        switch (this.direction) {
            case DIRECTIONS.North:
                animationComponent.setAnimation(ANIMS.StandUpEast, cb)
                break
            case DIRECTIONS.East:
                animationComponent.setAnimation(ANIMS.StandUpEast, cb)
                break
            case DIRECTIONS.West:
                animationComponent.setAnimation(ANIMS.StandUpWest, cb)
                break
            case DIRECTIONS.South:
            default:
                animationComponent.setAnimation(ANIMS.StandUpWest, cb)
                break
        }
    }


    handleSitting() {
        this.sitStandAnimating = true
        const animationComponent = this.entity.getComponent(AnimationComponent)
        const cb = () => {
            this.moving = false
            this.sitStandAnimating = false
        }
        switch (this.direction) {
            case DIRECTIONS.North:
                animationComponent.setAnimation(ANIMS.SitDownEast, cb)
                break
            case DIRECTIONS.East:
                animationComponent.setAnimation(ANIMS.SitDownEast, cb)
                break
            case DIRECTIONS.West:
                animationComponent.setAnimation(ANIMS.SitDownWest, cb)
                break
            case DIRECTIONS.South:
            default:
                animationComponent.setAnimation(ANIMS.SitDownWest, cb)
                break
        }
    }

}