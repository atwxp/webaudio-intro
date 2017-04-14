import { createContext, BufferLoader } from '../lib/index'

function init() {
    const context = createContext()

    if (context) {
        const audioAssets = [
            '/assets/baby.mp3',
            '/assets/sunset.mp3'
        ]

        const myBufferLoader = new BufferLoader(context, audioAssets, finishLoadCallback)

        myBufferLoader.load()

        function createSource(buffer) {
            const source = context.createBufferSource()

            const gainNode = context.createGain()

            source.buffer = buffer

            source.connect(gainNode)

            gainNode.connect(context.destination)

            return {
                source,
                gainNode
            }
        }

        function playHelper(buffers, iteration, fadeTime) {
            let currentTime = context.currentTime

            for (let i = 0; i < iteration; i++) {
                for (let j = 0; j < buffers.length; j++) {
                    const buffer = buffers[j]

                    const duration = buffer.duration

                    const info = createSource(buffer)

                    const gainNode = info.gainNode

                    const source = info.source

                    if (fadeTime) {
                        gainNode.gain.linearRampToValueAtTime(0, currentTime)
                        gainNode.gain.linearRampToValueAtTime(1, currentTime + fadeTime)

                        gainNode.gain.linearRampToValueAtTime(1, currentTime + duration - fadeTime)
                        gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
                    }

                    if (fadeTime) {
                        source.start(currentTime)
                    }
                    else {
                        source.start(0)
                    }

                    if (fadeTime) {
                        currentTime += duration - fadeTime
                    }
                }
            }
        }

        function finishLoadCallback(bufferList) {
            document.querySelector('.mixed').addEventListener('click', () => {
                playHelper(bufferList, 1)
            }, false)

            document.querySelector('.gradually').addEventListener('click', () => {
                playHelper(bufferList, 1, 6)
            }, false)
        }
    }
    else {

    }
}

init()
