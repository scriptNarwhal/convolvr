export default class SpeechSystem {

    constructor (world) {
        
        let synth = window.speechSynthesis,
            voices = synth.getVoices()

        this.world = world
        this.synth = synth
        this.voices = voices
        // for(i = 0; i < voices.length ; i++) {
        //     voices[i].name + ' (' + voices[i].lang + ')'
    }

    init (component) {
        let attr = component.attrs.speech;

        if ( attr.readText !== false ) {
            if ( component.attrs.text ) { // speak text
                this.speak(component.attrs.text.lines.join(". "), false, 0)
            }
        }
        return {
            speak: (text, voice, voiceIndex) => {
                this.speak(text, voice, voiceIndex)
            },
            speakAll: (lines, voice, voiceIndex) => {
                this.speak( lines.join(". "), voice, voiceIndex )
            }
        }

    }

    speak (text, voiceName, voiceIndex) {
        let utterThis = new SpeechSynthesisUtterance(text);

        if ( voiceName ) {
            for (let i = 0; i < this.voices.length; i++ ) {
                if ( this.voices[i].name === voiceName ) {
                    utterThis.voice = this.voices[i]
                }
            }
        } else {
            utterThis.voice = this.voices[ voiceIndex ]
        }
        
        this.synth.speak( utterThis )
    }
}

