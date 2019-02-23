import { CTX_EVENTS } from './utils/Const.js'

export default class AssetManager {
    constructor() {
        this.successCount = 0
        this.errorCount = 0
        this.cache = []
        this.downloadQueue = []
    }

    queueDownload(path) {
        this.downloadQueue.push(path)
    }

    queDownloadBulk(paths){
        for(let i = 0; i < paths.length; i++) {
            this.downloadQueue.push(paths[i])
        }
    }

    downloadBulk(paths, callback){
        for(let i = 0; i < paths.length; i++) {
            this.downloadQueue.push(paths[i])
        }
        this.downloadAll(callback)
    }

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount
    }

    downloadAll(callback) {
        for (let i = 0; i < this.downloadQueue.length; i += 1) {
            const img = document.createElement('img')
            const path = this.downloadQueue[i]
            img.addEventListener(CTX_EVENTS.Load, () => {
                this.successCount++
                if (this.isDone()) callback()
            })
            img.addEventListener(CTX_EVENTS.Error, () => {
                this.errorCount++
                if (this.isDone()) callback()
            })
            img.src = path
            this.cache[path] = img
        }
    }

    getAsset(path) {
        return this.cache[path]
    }
}
