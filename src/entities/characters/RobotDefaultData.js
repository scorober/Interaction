import {
    ANIMATIONS as ANIMS,
    ANIMATION_RATES as AR,
    ASSET_PATHS
} from '../../utils/Const.js'

/**
 * ANIMATIONS
 */
// Values defined here for use in export object
const attackWidth = 384
const attackHeight = 192
const height = 192
const width = 192
const yOffset = 10
const impactSize = 244


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
        Speed: 50,
        Name: 'ROBOT',
        isCombat: true,
    },
    // Animation Component Configuration
    AnimationConfig: {
        // Values are repeated here for export
        Width: 192,
        Height: 192,
        Scale: 0.5,
        Spritesheet: ASSET_PATHS.Robot,
        InitialAnimation: ANIMS.StandEast,
        AnimationRates: {
            [AR.Walk]: 0.08,
            [AR.Stand]: 0.6,
            [AR.Shoot]: 0.15,
            [AR.Impact]: 0.1
        },
        AnimationData: {
            [ANIMS.AttackWest]: {
                frames: 16,
                rate: AR.Shoot,
                options: {
                    yOffset: yOffset,
                    width: attackWidth,
                    height: attackHeight
                }
            },
            [ANIMS.AttackEast]: {
                frames: 16,
                rate: AR.Shoot,
                options: {
                    yOffset: yOffset,
                    width: attackWidth,
                    height: attackHeight
                }
            },
            // Copy of ShootWest
            [ANIMS.AttackNorth]: {
                frames: 16,
                goBackRows: 2,
                goBackHeight: 2 * attackHeight,
                rate: AR.Shoot,
                options: {
                    yOffset: yOffset,
                    width: attackWidth,
                    height: attackHeight
                }
            },
            // Copy of ShootEast
            [ANIMS.AttackSouth]: {
                frames: 16,
                rate: AR.Shoot,
                options: {
                    yOffset: yOffset,
                    width: attackWidth,
                    height: attackHeight
                }
            },
            // Standing
            [ANIMS.StandWest]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }
            },
            [ANIMS.StandEast]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of StandWest
            [ANIMS.StandNorth]: {
                frames: 8,
                goBackRows: 2,
                goBackHeight: 2 * height,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of StandEast
            [ANIMS.StandSouth]: {
                frames: 8,
                rate: AR.Stand,
                options: {
                    yOffset: yOffset,
                }

            },
            // Walking
            [ANIMS.WalkWest]: {
                frames: 9,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            [ANIMS.WalkEast]: {
                frames: 9,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of WalkWest
            [ANIMS.WalkSouth]: {
                goBackRows: 2,
                goBackHeight: 2 * height,
                frames: 9,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            // Copy of WalkEast
            [ANIMS.WalkNorth]: {
                frames: 9,
                width: width,
                height: height,
                rate: AR.Walk,
                options: {
                    yOffset: yOffset,
                }
            },
            // Impact
            [ANIMS.Impact]: {
                frames: 10,
                rate: AR.Impact,
                options: {
                    loop: false,
                    maxFrames: 12,
                    width: impactSize,
                    height: impactSize 
                }
            },

        }
    }
}