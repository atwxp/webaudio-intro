function loadAudioByXHR(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open('GET', url, true)

        xhr.responseType = 'arraybuffer'

        xhr.onload = function () {
            resolve(this.response)
        }

        xhr.onerror = function (err) {
            reject(new Error(err))
        }

        xhr.send()
    })
}

export function createContext() {
    const contextConstructor = (window.AudioContext
        || window.webkitAudioContext
        || window.mozAudioContext
        || window.oAudioContext
        || window.msAudioContext)

    return contextConstructor ? new contextConstructor() : null
}

export class BufferLoader {
    constructor(context, urlList, callback) {
        this.context = context

        this.urlList = urlList

        this.onload = callback

        this.bufferList = new Array()

        this.loadCount = 0
    }

    loadBuffer(url, index) {
        const me = this

        loadAudioByXHR(url).then(data => {
            me.context.decodeAudioData(data, buffer => {
                if (!buffer) {
                    alert('error decoding file data: ' + url)
                    return
                }

                me.bufferList[index] = buffer

                if (++me.loadCount === me.urlList.length) {
                    me.onload(me.bufferList)
                }
            }, err => {
                console.error('decodeAudioData error', err)
            })
        }, err => {
            console.error('XHR error', err)
        })
    }

    load() {
        for (let [index, val] of this.urlList.entries()) {
            this.loadBuffer(val, index)
        }
    }
}