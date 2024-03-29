import AssetManager from './src/AssetManager.js'
import GameEngine from './src/GameEngine.js'
import { ASSET_PATHS } from './src/utils/Const.js'

const assetManager = new AssetManager()

// // const socket = io.connect('http://24.16.255.56:8888')
// // console.log(socket)
// window.onload = function () {

    


  
//     console.log('aldskfjaodlsjfo;pasijdfp')
  
//     socket.on('load', function (data) {
//         console.log(data)
//     })
  
  
//     saveButton.onclick = function () {
//         console.log('save')
//         text.innerHTML = 'Saved.'
//         socket.emit('save', { studentname: 'Chris Marriott', statename: 'aState', data: 'Goodbye World' })
//     }
  
//     loadButton.onclick = function () {
//         console.log('load')
//         text.innerHTML = 'Loaded.'
//         socket.emit('load', { studentname: 'Chris Marriott', statename: 'aState' })
//     }
// }
  

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
