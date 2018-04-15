import {send} from '../../network/socket'
import Convolvr from '../../world/world';
import Component from '../../core/component';
//WebRTC boilerplate stuff based off of https://github.com/dimircea/WebRTC

export default class WebRTCSystem {

    private world: Convolvr
    private localVideo: any
    private remoteVideo: any
    private peerConn: any;
    private localVideoElem: any;
    private remoteVideoElem: any;
    private localVideoStream: any;
    private peerConnCfg: any;
    private videoCallButton: any;
    private endCallButton: any;

    constructor (world: Convolvr) {
        this.world = world

        let localVideoStream = null,
            peerConn = null,
            peerConnCfg = {'iceServers': [
                    {'url': 'stun:stun.services.mozilla.com'}, 
                    {'url': 'stun:stun.l.google.com:19302'}
                ]
            },
            win = (window as any),
            nav = (navigator as any);

        nav.getUserMedia = nav.getUserMedia || nav.mozGetUserMedia || nav.webkitGetUserMedia
        win.RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection
        win.RTCIceCandidate = win.RTCIceCandidate || win.mozRTCIceCandidate || win.webkitRTCIceCandidate
        win.RTCSessionDescription = win.RTCSessionDescription || win.mozRTCSessionDescription || win.webkitRTCSessionDescription
        win.SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition || win.mozSpeechRecognition 
        || win.msSpeechRecognition || win.oSpeechRecognition

        this.peerConnCfg = peerConnCfg
        this.localVideoElem = document.getElementById('localVideo')
        this.remoteVideoElem = document.getElementById('remoteVideo')
        this.videoCallButton = document.getElementById("videoCallButton")
        this.endCallButton = document.getElementById("endCallButton")
            
        if ( navigator.getUserMedia && this.videoCallButton ) { // probably don't need a button to use this.. debug later
            this.videoCallButton.addEventListener("click", this.initiateCall)
            this.endCallButton.addEventListener("click", (evt: any) => {
                send("rtc", {"closeConnection": true })
            })
        } else {
            console.log("Sorry, your browser does not support WebRTC!")
        }
    }

    prepareCall(component: Component, params: any) {
        this.peerConn = new RTCPeerConnection( this.peerConnCfg )
        this.peerConn.onicecandidate = this.onIceCandidateHandler
        this.peerConn.onaddstream = this.onAddStreamHandler
    }
    
    onIceCandidateHandler(evt: any) {
        if (!evt || !evt.candidate) return
        send("rtc", {"candidate": evt.candidate })
    }

    onAddStreamHandler(evt: any) {
        this.videoCallButton.setAttribute("disabled", true)
        this.endCallButton.removeAttribute("disabled")
        this.remoteVideo.src = URL.createObjectURL(evt.stream)
    }

    createAndSendOffer(component: Component, params: any) {
        let connection = this.peerConn
        connection.createOffer(
            (offer: any) => {
                let off = new RTCSessionDescription(offer);
                connection.setLocalDescription(new RTCSessionDescription(off), () => { send("rtc", {"sdp": off }) }, (error: any) => {console.log(error)})
            }, 
            (error: any) => { 
                console.log(error)
            }
        )

    }

    createAndSendAnswer(component: Component, params: any) {
        let connection = this.peerConn
        connection.createAnswer(
            (answer: any) => {
                let ans = new RTCSessionDescription(answer)
                connection.setLocalDescription(ans, ()=>{ send("rtc", {"sdp": ans })}, (error: any) => {console.log(error)} )
            },
            (error: any) => { 
                console.log(error)
            }
        )

    }

    initiateCall(component: Component, params: any) {
        let connection = this.peerConn,
            localStream = this.localVideoStream,
            localVideo = this.localVideoElem,
            webrtc = this

        this.prepareCall(component, params);
        // get the local stream, show it in the local video element and send it
        navigator.getUserMedia({"audio": true, "video": true }, stream => {
            localStream = stream
            localVideo.src = URL.createObjectURL(localStream)
            connection.addStream(localStream)
            webrtc.createAndSendOffer(component, params)
        }, error => { console.log(error)})

    }

    answerCall(component: Component, params: any) {

        let connection = this.peerConn,
            localStream = this.localVideoStream,
            localVideo = this.localVideoElem,
            webrtc: WebRTCSystem = this

        this.prepareCall(component, params)
        // get the local stream, show it in the local video element and send it
        navigator.getUserMedia({"audio": true, "video": true }, stream => {
            localStream = stream
            localVideo.src = URL.createObjectURL(stream)
            connection.addStream(stream)
            webrtc.createAndSendAnswer(component, params)
        }, error => { console.log(error) })

    }

    endCall(component: Component, params: any) {

        this.peerConn.close()
        this.localVideoStream.getTracks().forEach((track: any) => {
            track.stop()
        })
        this.localVideo.src = ""
        this.remoteVideo.src = ""
        this.videoCallButton.removeAttribute("disabled")
        this.endCallButton.setAttribute("disabled", true)

    }

    getVideo(video: string) {
        if ( video == "local" ) {
            return this.localVideo
        } else {
            return this.remoteVideo
        }
    }

    init(component: Component) { 
        return {
            initiateCall: (params: any) => {
                this.initiateCall( component, params)
            },
            getVideo: ( video: string ) => {
                this.getVideo( video )
            },
            answerCall: (params: any) => {
                this.answerCall( component, params )
            },
            endCall: (params: any) => {
                this.endCall( component, params )
            }
        }
    }
}

