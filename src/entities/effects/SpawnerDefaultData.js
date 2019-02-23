import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'



export default {
    Attributes: {
        Type: 'Spawner'
        //TODO Empty
    },

    AnimationConfig: {
        Width: 64,
        Height: 64,
        Scale: 2,
        Spritesheet: ASSET_PATHS.Spawner,
        InitialAnimation: ANIMS.Crashed,
        AnimationRates: {
            [AR.Console]: .3,
        },
        AnimationData: {
            [ANIMS.Crashed]: {
                frames: 16,
                rate: AR.Console
            },
            [ANIMS.Static]: {
                frames: 2,
                rate: AR.Console
            }
        }
    }
}