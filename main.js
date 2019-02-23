import AssetManager from './src/AssetManager.js'
import GameEngine from './src/GameEngine.js'
import { ASSET_PATHS } from './src/utils/Const.js'

const assetManager = new AssetManager()

assetManager.downloadBulk(Object.values(ASSET_PATHS), function () {
    const canvas = document.getElementById('gameWorld')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    const gameEngine = new GameEngine()
    window.addEventListener('resize', () => {
        gameEngine.resizeCanvas(window.innerWidth, window.innerHeight)
    })
    gameEngine.assetManager = assetManager
    gameEngine.init(ctx)
    gameEngine.start()
    // eslint-disable-next-line no-console
    console.log('Game started..')
})
