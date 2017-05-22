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

    init ( component ) {
        
        let prop = component.props.speech

        if ( prop.readText !== false ) {

            if ( component.props.text ) { // speak text

                this.speak(component.props.text.lines.join(". "), false, 0)

            }
        }
        return {
            speak: (text, voice, voiceIndex) => {
                this.speak(text, voice, voiceIndex)
            }
        }

    }

    speak (text, voiceName, voiceIndex) {

        let utterThis = new SpeechSynthesisUtterance(text),
            i = 0

        if ( voiceName ) {

            for ( i = 0; i < this.voices.length; i++ ) {

                if ( this.voices[i].name === voiceName ) {

                    utterThis.voice = this.voices[i]

                }

            }

        } else {

            utterThis.voice = this.voices[ voiceIndex ]

        }
        
        synth.speak( utterThis )
    }
}

