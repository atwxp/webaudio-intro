import { createContext, BufferLoader } from '../lib/index'

const context = createContext()

const myBufferLoader = new BufferLoader(context, [
    '/assets/m4a1.mp3',
    '/assets/m1-garand.mp3'
], finishLoadCallback)

myBufferLoader.load()

function shoot(song, round, interval, random = 0, changePitch) {
    const time = context.currentTime

    for (let i = 0; i < round; i++) {
        const source = context.createBufferSource()

        source.buffer = song

        source.connect(context.destination)

        if (changePitch) {
            // pitch, 改变 detune 也有类似效果
            source.playbackRate.value = document.querySelector('input').value
        }

        source.start(time + i * interval + Math.random() * random)
    }
}

function finishLoadCallback(bufferList) {
    document.querySelector('.short-m4a1').addEventListener('click', () => {
        shoot(bufferList[0], 3, .1)
    }, false)

    document.querySelector('.long-m4a1').addEventListener('click', () => {
        shoot(bufferList[0], 10, .5)
    }, false)

    document.querySelector('.random-m4a1').addEventListener('click', () => {
        shoot(bufferList[0], 10, .5, 1)
    }, false)

    document.querySelector('.short-garand').addEventListener('click', () => {
        shoot(bufferList[1], 3, .1)
    }, false)

    document.querySelector('.pitch-random-garand').addEventListener('click', () => {
        shoot(bufferList[1], 3, .1, 0, true)
    }, false)
}

