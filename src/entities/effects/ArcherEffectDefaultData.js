import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'

const yOffset = 20

export default {
    Attributes: {
        Damage: 10,
        Speed: 800
    },
    AnimationConfig: {
        Scale: .75,
        Spritesheet: ASSET_PATHS.ArcherEffects,
        InitialAnimation: ANIMS.Projectile,
        AnimationRates: {
            [AR.Projectile]: .15,
            [AR.Impact]: .13
        },
        AnimationData: {
            [ANIMS.Impact]: {
                frames: 12,
                rate: AR.Impact,
                options: {
                    width: 192,
                    height: 192,
                    yOffset: yOffset
                }
            },
            [ANIMS.Projectile]: {
                frames: 7,
                rate: AR.Projectile,
                options: {
                    width: 32,
                    height: 64,
                    yOffset: yOffset
                }
            }
        }
    }
}