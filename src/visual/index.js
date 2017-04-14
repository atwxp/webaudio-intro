import { createContext, BufferLoader } from '../lib/index'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 360

const SMOOTHING = 0.8
const FFT_SIZE = 512

const requestAnimationFrame = (function () {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) {
            setTimeout(callback, 1000 / 16)
        }
})()

class VisualSample {
    constructor(songUrl) {
        const context = this.context = createContext()

        this.analyser = context.createAnalyser()
        // default min -100, max -30
        this.analyser.minDecibels = -140
        this.analyser.maxDecibels = 0
        this.analyser.connect(context.destination)

        this.freqDomain = new Float32Array(this.analyser.frequencyBinCount)
        // this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount)

        this.timeDomain = new Float32Array(this.analyser.frequencyBinCount)
        // this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount)

        this.playing = false
        this.startOffset = 0
        this.startTime = 0

        const me = this

        // load audio
        const myBufferLoader = new BufferLoader(context, songUrl, function (bufferList) {
            const button = document.querySelector('button')
            button.removeAttribute('disabled')
            button.innerHTML = 'play or pause'
            // just assume only one audio assets
            me.buffer = bufferList[0]
        })
        myBufferLoader.load()
    }

    togglePlay() {
        if (this.playing) {
            this.source.stop(0)

            this.startOffset += this.context.currentTime - this.startTime
        }

        else {
            this.startTime = this.context.currentTime

            this.source = this.context.createBufferSource()

            this.source.connect(this.analyser)

            this.source.buffer = this.buffer

            // wheather loop or not
            // this.source.loop = true

            this.source.start(0, this.startOffset % this.buffer.duration)

            requestAnimationFrame(this.draw.bind(this))
        }

        this.playing = !this.playing
    }

    draw() {
        this.analyser.FFtSize = FFT_SIZE
        this.analyser.smoothingTimeConstant = SMOOTHING

        // array of 32-bit float, normalized to [0, 1]
        this.analyser.getFloatFrequencyData(this.freqDomain)
        // this.analyser.getByteFrequencyData(this.freqDomain)

        this.analyser.getFloatTimeDomainData(this.timeDomain)
        // [0, 255], can be scaled to fit between minDecibels and maxDecibels
        // this.analyser.getByteTimeDomainData(this.timeDomain)        

        const canvas = document.querySelector('canvas')
        const canvasContext = canvas.getContext('2d')
        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT

        const barW = CANVAS_WIDTH / this.analyser.frequencyBinCount

        // draw frequency chart
        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            const value = this.freqDomain[i]

            // const percent = value / 256
            // const height = CANVAS_HEIGHT * percent
            const height = CANVAS_HEIGHT - value - 360

            const offset = CANVAS_HEIGHT - height

            canvasContext.fillStyle = 'hsl(' + i / this.analyser.frequencyBinCount * 360 + ', 100%, 50%)'

            canvasContext.fillRect(i * barW, offset, barW, height)             
        }

        // draw time chart
        canvasContext.fillStyle = '#fff'
        for (let j = 0; j < this.analyser.frequencyBinCount; j++) {
            const value = this.timeDomain[j]

            // const percent = value / 256
            // const height = CANVAS_HEIGHT * percent
            const height = CANVAS_HEIGHT /  2 + value * 200
        
            const offset = CANVAS_HEIGHT - height

            canvasContext.fillRect(j * barW, offset, 1, 2) 
        }

        if (this.playing) {
            requestAnimationFrame(this.draw.bind(this))
        }
    }

    // 某一点的频率 [0, N - 1] * fs/ N 
    // https://www.zhihu.com/question/27452867
    getFrequencyValue(frenquency) {
        const index = frenquency * 2 * this.freqDomain.length / context.sampleRate
        return this.freqDomain(index)
    }
}

const myVisual = new VisualSample(['assets/sunset.mp3'])

document.querySelector('button').addEventListener('click', () => {
    myVisual.togglePlay()
}, false)
