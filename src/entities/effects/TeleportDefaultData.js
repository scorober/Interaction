import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'


export default {
    Attributes: {
        Damage: 10,
        Speed: 380
    },
    AnimationConfig: {
        Scale: 0.8,
        Width: 64,
        Height: 64,
        Spritesheet: ASSET_PATHS.Teleport,
        InitialAnimation: ANIMS.TeleportIn,
        AnimationRates: {
            [AR.Teleport]: .06,
        },
        AnimationData: {
            [ANIMS.TeleportOut]: {
                frames: 17,
                rate: AR.Teleport,
            },
            [ANIMS.TeleportIn]: {
                frames: 17,
                rate: AR.Teleport,
            },
        }
        
    }
}