const contextConstructor = (window.AudioContext
    || window.webkitAudioContext
    || window.mozAudioContext
    || window.oAudioContext
    || window.msAudioContext)

if (contextConstructor) {
    const context = new contextConstructor()
    
}
else {
}
