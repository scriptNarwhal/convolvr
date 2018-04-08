import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class SpeechSystem {

    public world: Convolvr
    public synth: any
    public voices: any

    constructor (world: Convolvr) {
        
        let synth = window.speechSynthesis,
            voices = synth.getVoices()

        this.world = world
        this.synth = synth
        this.voices = voices
        // for(i = 0; i < voices.length ; i++) {
        //     voices[i].name + ' (' + voices[i].lang + ')'
    }

    public init (component: Component) {
        let attr = component.attrs.speech;

        if ( attr.readText !== false ) {
            if ( component.attrs.text ) { // speak text
                this.speak(component.attrs.text.lines.join(". "), "", 0)
            }
        }
        return {
            speak: (text: string, voice: string, voiceIndex?: number) => {
                this.speak(text, voice, voiceIndex)
            },
            speakAll: (lines: string[], voice: string, voiceIndex?: number) => {
                this.speak( lines.join(". "), voice, voiceIndex )
            }
        }

    }

    private speak (text: string, voiceName: string, voiceIndex?: number) {
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

