import { ANIMATIONS as ANIMS, ANIMATION_RATES as AR, ASSET_PATHS } from '../../utils/Const.js'

/**
 * ANIMATIONS
 */
// Values defined here for use in export object

const height = 64
const yOffset = 8


/** 
 * Animations should be defined in the order they appear in the spritesheet
 * With derivative animations appearing after the main animation, with 2 properties:
 * goBackRows, goBackHeight appearing in the first derivative animation. See PlayerCharacter's
 * ANIMS.StandNorth for usage example
 */
export default {
    // Attributes Component Configuration
    Attributes: {
        HP: 30,
        Mana: 10,
        Str: 5,
        Int: 5,
        Atk: 10,
        Matk: 5,
        Def: 15,
        Mdef: 3,
        Speed: 70,
        Name: 'MARIOTT',
        isCombat: true,
    },
    // Animation Component Configuration
    AnimationConfig: {
        // Values are repeated here for export
        Width: 64,
        Height: 64,
        Scale: 1,
        Spritesheet: ASSET_PATHS.Marriott,
        InitialAnimation: ANIMS.StandEast,
        AnimationRates: {
            [AR.Walk]: 0.06,
            [AR.Stand]: 0.1,
            [AR.Sit]: 0.2
        },
        AnimationData: {
            [ANIMS.WalkNorth]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset, }
            },
            [ANIMS.WalkWest]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset, }
            },
            [ANIMS.WalkSouth]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset, }
            },
            [ANIMS.WalkEast]: {
                frames: 9,
                rate: AR.Walk,
                options: { yOffset: yOffset, }
            },
            [ANIMS.StandNorth]: {
                goBackRows: 4,
                goBackHeight: 4 * height,
                frames: 5,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                    maxFrames: 2
                }
            },
            [ANIMS.StandWest]: {
                frames: 2,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset
                }
            },
            [ANIMS.StandSouth]: {
                frames: 2,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset
                }
            },
            [ANIMS.StandEast]: {
                frames: 2,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset
                }
            },
            [ANIMS.SitDownEast]: {
                frames: 5,
                rate: AR.Sit,
                options: {
                    yOffset: yOffset,
                    loop: false
                }
            },
            [ANIMS.StandUpEast]: {
                frames: 5,
                rate: AR.Sit,
                options: {
                    yOffset: yOffset,
                    loop: false
                }
            },
            [ANIMS.SitDownWest]: {
                frames: 5,
                rate: AR.Sit,
                options: {
                    yOffset: yOffset,
                    loop: false
                }
            },
            [ANIMS.StandUpWest]: {
                frames: 5,
                rate: AR.Sit,
                options: {
                    yOffset: yOffset,
                    loop: false
                }
            }
        }
    }
}