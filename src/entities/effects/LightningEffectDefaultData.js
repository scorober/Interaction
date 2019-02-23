import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'

const yOffset = 20

export default {
    Attributes: {
        Damage: 10,
        Speed: 380
    },
    AnimationConfig: {
        Scale: 1,
        Spritesheet: ASSET_PATHS.Lightning,
        InitialAnimation: ANIMS.Projectile,
        AnimationRates: {
            [AR.Projectile]: .15,
            [AR.Impact]: .13
        },
        AnimationData: {
            [ANIMS.Effect0]: {
                frames: 7,
                rate: AR.Projectile,
                options: {
                    width: 64,
                    height: 64,
                    yOffset: yOffset
                }
            },
            [ANIMS.Impact]: {
                frames: 7,
                rate: AR.Projectile,
                options: {
                    width: 96,
                    height: 96,
                    yOffset: yOffset
                }
            },
            [ANIMS.Projectile]: {
                frames: 11,
                rate: AR.Impact,
                options: {
                    width: 48,
                    height: 48,
                    yOffset: yOffset
                }
            }
        }
    }
}