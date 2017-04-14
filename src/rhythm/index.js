import { createContext, BufferLoader } from '../lib/index'

function playSound(context, buffer, time) {
    const source = context.createBufferSource()

    source.buffer = buffer

    source.connect(context.destination)

    source.start(time)
}

function loadSounds(obj, context, soundMap) {
    const names = []
    const paths = []

    for (let key in soundMap) {
        names.push(key)
        paths.push(soundMap[key])
    }

    const myBufferLoader = new BufferLoader(context, paths, bufferList => {
        for (let [index, buffer] of bufferList.entries()) {
            obj[names[index]] = buffer
        }
    })

    myBufferLoader.load()
}

class Rhythm {
    constructor() {
        const context = this.context = createContext()

        if (context) {
            loadSounds(this, context, {
                kick: '/assets/kick.wav',
                snare: '/assets/snare.wav',
                hihat: '/assets/hihat.wav'
            })
        }
        else {

        }
    }

    play() {
        const context = this.context

        const startTime = context.currentTime + 0.1

        // BPM
        const tempo = 80

        const eightNoteTime = (60 / 80) / 2

        for (let bar = 0; bar < 2; bar++) {
            let time = startTime + bar * 8 * eightNoteTime

            // play snare bass kick on beats 1, 5
            playSound(context, this.kick, time)
            playSound(context, this.kick, time + 4 * eightNoteTime)

            // play snare drum on beats 3, 7
            playSound(context, this.snare, time + 2 * eightNoteTime)
            playSound(context, this.snare, time + 6 * eightNoteTime)

            // play hi-hat every eight note
            for (let i = 0; i < 8; i++) {
                playSound(context, this.hihat, time + i * eightNoteTime)
            }
        }
    }
}

const sample = new Rhythm()

document.querySelector('button').addEventListener('click', () => {
    sample.play()
}, false)
