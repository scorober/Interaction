import Scene from './Scene.js'
import Animation from '../../Animation.js'
import { KEYS, ASSET_PATHS} from '../../utils/Const.js'



/**
 * API:
 *    timeElapsed = running clock
 *    selectedItem = the currently highlighted menu option
 *    menuLevel = the active menu
 */
export default class TitleMenuScene extends Scene {

    constructor(game) {
        super(game)
        this.name = 'titlemenu'
        this.menuLevel = MenuLevels.MAIN
        this.menus = {}
        this.defaultTextStyles = {
            FONT: '30px arcade',
            SELECTEDCOLOR: 'white',
            BASECOLOR: 'red'
        }
        const params = {
            GAME : game,
            MANAGER: this,
            XBASE: game.surfaceWidth / 2,
            YBASE: game.surfaceHeight / 2 + 20,
        }
        this.bgAnimation = new Animation(game.getAsset(ASSET_PATHS.TitleAnimation), 960, 540, 50, 1, 0.1, 50, true, 1)
        this.timeElapsed = 0
        this.selectedItem = 0
        this.xBase = game.surfaceWidth / 2
        this.yBase = game.surfaceHeight / 2 + 20

        this.titleText = [
            {TIME: 1, TEXT: 'THE UNTITLED ADVENTURES OF', W: this.xBase, H: this.yBase - 200, COLOR: 'red',FONT: '40px arcade'},
            {TIME: 2, TEXT: 'DR. MARRIOTT', W: this.xBase, H: this.yBase - 150, COLOR: 'red', FONT: '40px arcade'},
        ]

        this.menus[MenuLevels.MAIN] = new MainLevel(params)
        params.YBASE = game.surfaceHeight / 2 + 120
        this.menus[MenuLevels.START] = new StartMenu(params)
        this.menus[MenuLevels.NEWGAME] = new GameNewMenu(params)
    }

    addMenu(menu, level){
        this.menus[level] = menu
    }

    change(menulevel){
        this.timeElapsed = 0
        this.drawspeedBuffer = 0
        this.selectedItem = 0
        const params = this.menus[this.menuLevel].exit() || {}
        this.menus[menulevel].enter(params)
        this.menuLevel = menulevel
    }

    update() {
        super.update()
        this.menus[this.menuLevel].update()
    }

    draw() {
        super.draw()
        this.menus[this.menuLevel].draw()
    }

    drawText(text){
        for(const i in text){
            const t = text[i]
            if(t.TIME === undefined
                || t.TIME === 0
                || this.timeElapsed > t.TIME){
                this.game.ctx.textAlign = t.ALIGN || 'center'
                this.game.ctx.font = t.FONT
                this.game.ctx.fillStyle = t.COLOR
                this.game.ctx.fillText(t.TEXT, t.W, t.H)
            }
        }
    }


    checkKeys(){
        return (this.game.inputManager.downKeys[KEYS.Enter]) ? 0
            : (this.game.inputManager.downKeys[KEYS.ArrowUp]
                || this.game.inputManager.downKeys[KEYS.KeyW]) ? -1
                : (this.game.inputManager.downKeys[KEYS.ArrowDown]
                    || this.game.inputManager.downKeys[KEYS.KeyS]) ? 1
                    : null
    }

}

class BaseLevel {
    constructor(params){
        this.bgAnimation = null
        this.spritesheet = params.SPRITESHEET
        this.manager = params.MANAGER
        this.optionSelected = 0
        this.menuOptions = ['']

        this.defaultFont = this.manager.defaultTextStyles.FONT
        this.defaultBaseColor = this.manager.defaultTextStyles.BASECOLOR
        this.defaultSelectedColor = this.manager.defaultTextStyles.SELECTEDCOLOR

    }
    draw(){

        if(this.bgAnimation !== null) {
            const game = this.getGame()
            this.bgAnimation.drawFrame(game, game.surfaceWidth / 2, game.surfaceHeight / 1.5) //draw animation
        }
        this.drawText(this.manager.titleText)
        this.drawText(this.menuOptions) //draw menu options

    }
    //Default update method
    update(){
        //tpm debug hack
        const oldtime = this.manager.timeElapsed
        this.manager.timeElapsed = 100
        if(this.manager.timeElapsed > 4.5 ) {
            const key = this.manager.checkKeys()
            if(null !== key){
                if(0 === key){
                    this.manager.change(this.getMenuLevel())
                }
                else {
                    this.menuOptions[this.optionSelected].COLOR = this.defaultBaseColor
                    this.optionSelected = this.verifyKeyPos(key)
                }
            }
            this.menuOptions[this.optionSelected].COLOR = this.defaultSelectedColor
        }
        this.manager.timeElapsed = oldtime
    }
    enter(){}
    exit(){}
    getGame(){return this.manager.game}
    getElapsedTime(){return this.manager.timeElapsed}
    getTick(){return this.manager.clockTick}
    getSelectedItem(){return this.manager.selectedItem}
    setSelectedItem(item){this.manager.selectedItem = item} //TODO: verify item?
    updateTitleText(text){
        if(null === text){
            this.manager.titleText = null
        }else{
            this.manager.titleText = text
        }
    }
    drawText(text){this.manager.drawText(text)}
    getDefaultTextOptions(){return this.manager.defaultTextStyles}
}

class MainLevel extends BaseLevel{

    constructor(params) {
        super(params)
        this.level = MenuLevels.MAIN


        this.menuOptions = [
            {TIME: 3, TEXT: 'START', W: params.XBASE, H: params.YBASE + 5, COLOR: this.defaultBaseColor, FONT: '30px arcade'},
            {TIME: 3.4, TEXT: 'OPTIONS', W: params.XBASE, H: params.YBASE + 40, COLOR: this.defaultBaseColor, FONT: '30px arcade'},
            {TIME: 3.8, TEXT: 'HIGH SCORES', W: params.XBASE, H: params.YBASE + 75, COLOR: this.defaultBaseColor, FONT: '30px arcade'},
            {TIME: 4.2, TEXT: 'EXIT', W: params.XBASE, H: params.YBASE + 105, COLOR: this.defaultBaseColor, FONT: '30px arcade'}

        ]
    }


    verifyKeyPos(key){
        key += this.optionSelected
        return this.optionSelected = (key < 0) ? 3 //if user hit 'up' at top option, loop to bot
            : this.optionSelected = (key > 3) ? 0 //if user hit 'down' on bottom, loop  to top
                : key //otherwise keep value as is
    }

    getMenuLevel(){
        return (this.optionSelected === 0) ? MenuLevels.START
            : (this.optionSelected === 1) ? MenuLevels.OPTIONS
                : (this.optionSelected === 2) ? MenuLevels.HIGHSCORE
                    : this.optionSelected === 3 ? MenuLevels.EXIT
                        : MenuLevels.START
    }
    exit(){
        this.manager.titleText[0].TIME = 0
        this.manager.titleText[1].TIME = 0
    }
}

class StartMenu extends BaseLevel {

    constructor(params){
        super(params)
        this.level = MenuLevels.START

        this.menuOptions = [
            {TIME: 0, TEXT: 'NEW GAME', W: params.XBASE, H: params.YBASE - 150, COLOR: 'white', FONT: '40px arcade'},
            {TIME: 0, TEXT: 'LOAD GAME', W: params.XBASE, H: params.YBASE - 100, COLOR: 'red', FONT: '40px arcade'},
        ]

    }
    enter(params){
        params

    }

    verifyKeyPos(key){
        if(key){key++}// TODO: Hacky code. Thanks esLint
        return (this.optionSelected === 1) ? 0 : 1 //if user hit 'down' on bottom, loop  to top
    }
    getMenuLevel(){
        return (this.optionSelected === 0) ? MenuLevels.NEWGAME
            : (this.optionSelected === 1) ? MenuLevels.NEWGAME
                : MenuLevels.START
    }

}

class GameNewMenu extends BaseLevel{
    constructor(params){
        super(params)
        this.level = MenuLevels.NEWGAME
        const game = this.getGame()



        this.characterAnims = [
            new Animation(game.getAsset(ASSET_PATHS.ArcherPlayer), 128, 116, 15, 1, 0.05, 15, true, 1.5),
            new Animation(game.getAsset(ASSET_PATHS.Swordman), 128, 116, 15, 1, 0.05, 15, true, 1.5),
            new Animation(game.getAsset(ASSET_PATHS.MagePlayer), 128, 128, 15, 1, 0.05, 15, true, 1.5)
        ]
    }

    draw(){
        const game = this.getGame()
        if(this.characterAnims.length === 3){
            //archer
            this.characterAnims[0].drawFrame(game, game.surfaceWidth / 3 - 5, game.surfaceHeight / 2)
            //swordman
            this.characterAnims[1].drawFrame(game, game.surfaceWidth, game.surfaceHeight / 2)
            //mage
            this.characterAnims[2].drawFrame(game, game.surfaceWidth*3/4, game.surfaceHeight / 2)
        }
        super.draw()
    }

    update(){

    }
    exit(){

    }
    enter(){
        this.updateTitleText()
    }
}



const MenuLevels = {
    MAIN: 1,
    START: 2,
    OPTIONS: 3,
    HIGHSCORE: 4,
    EXIT: 5,
    NEWGAME: 6,
    SELECTCHAR: 7,
}
//
// class CharacterBoxBuilder{
//
//     constructor(spriteSheet, type, ctx, x, y
//         , frameWidth, frameHeight, sheetWidth
//         , row, frameDur, frames, isLoop, scale){
//         this.isInit = false
//         this.ctx = ctx
//         this.startX = x
//         this.startY = y
//         this.spriteSheet = spriteSheet
//         this.frameWidth = frameWidth
//         this.frameHeight = frameHeight
//         this.sheetWidth = sheetWidth
//         this.row = row
//         this.frameDuration = frameDur
//         this.frames = frames
//         this.loop = true
//         this.scale = scale
//         this.elapsedTime = 0
//         this.totalTime = frameDur * frames
//         this.tick = 0
//
//         /*
//         type === 1 ? this.initArcher(spritesheet, ctx)
//             : type === 2 ? this.initSwordman(spritesheet, ctx)
//                 : this.initMage(spritesheet, ctx)
//         //todo: else, init error msg
//         */
//     }
//
//
//     draw(){//this.x = x this.y = y
//         if (this.elapsedTime >= this.totalTime){//isDone()
//             if(this.loop)this.elapsedTime = 0
//             else this.elapsedTime -= this.tick
//         }
//         const frame = Math.floor(this.elapsedTime / this.frameDuration)
//         const xindex = frame % this.sheetWidth
//         const yindex = this.frameHeight * (this.row - 1)
//         this.ctx.drawImage(
//             this.spriteSheet,
//             xindex * this.frameWidth,
//             yindex,
//             this.frameWidth,
//             this.frameHeight,
//             this.startX,//(this.startX - (this.frameWidth * this.scale / 2)),
//             (this.startY - (this.frameHeight * this.scale * 0.9)),
//             this.frameWidth,
//             this.frameHeight
//         )
//     }
//     update(tick){this.tick += tick}
//
// }