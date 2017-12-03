import {send} from '../../network/socket'
//WebRTC boilerplate stuff based off of https://github.com/dimircea/WebRTC

export default class WebRTCSystem {

    constructor (world) {

        this.world = world

        let localVideoStream = null,
            peerConn = null,
            peerConnCfg = {'iceServers': [
                    {'url': 'stun:stun.services.mozilla.com'}, 
                    {'url': 'stun:stun.l.google.com:19302'}
                ]
            }

        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate
        window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition 
        || window.msSpeechRecognition || window.oSpeechRecognition

        this.peerConnCfg = peerConnCfg
        this.localVideoElem = document.getElementById('localVideo')
        this.remoteVideoElem = document.getElementById('remoteVideo')
        this.videoCallButton = document.getElementById("videoCallButton")
        this.endCallButton = document.getElementById("endCallButton")
            
        if ( navigator.getUserMedia && this.videoCallButton ) { // probably don't need a button to use this.. debug later

            this.videoCallButton.addEventListener("click", this.initiateCall)
            this.endCallButton.addEventListener("click", evt => {
                send("rtc", {"closeConnection": true })
            })

        } else {
            console.log("Sorry, your browser does not support WebRTC!")
        }
        
    }

    prepareCall( component, params ) {

        this.peerConn = new RTCPeerConnection( this.peerConnCfg )
        this.peerConn.onicecandidate = this.onIceCandidateHandler
        this.peerConn.onaddstream = this.onAddStreamHandler

    }
    
    onIceCandidateHandler (evt) {

        if (!evt || !evt.candidate) return
        send("rtc", {"candidate": evt.candidate })

    }

    onAddStreamHandler (evt) {

        this.videoCallButton.setAttribute("disabled", true)
        this.endCallButton.removeAttribute("disabled")
        this.remoteVideo.src = URL.createObjectURL(evt.stream)

    }

    createAndSendOffer( component, params ) {

        let connection = this.peerConn
        connection.createOffer(
            offer => {
                let off = new RTCSessionDescription(offer);
                connection.setLocalDescription(new RTCSessionDescription(off), () => { send("rtc", {"sdp": off }) }, error => {console.log(error)})
            }, 
            error => { 
                console.log(error)
            }
        )

    }

    createAndSendAnswer ( component, params ) {

        let connection = this.peerConn
        connection.createAnswer(
            answer => {
                let ans = new RTCSessionDescription(answer)
                connection.setLocalDescription(ans, ()=>{ send("rtc", {"sdp": ans })}, error => {console.log(error)} )
            },
            error => { 
                console.log(error)
            }
        )

    }

    initiateCall ( component, params ) {

        let connection = this.peerConn,
            localStream = this.localVideoStream,
            localVideo = this.localVideoElem,
            webrtc = this

        prepareCall()
        // get the local stream, show it in the local video element and send it
        navigator.getUserMedia({"audio": true, "video": true }, stream => {
            localStream = stream
            localVideo.src = URL.createObjectURL(localVideoStream)
            connection.addStream(localVideoStream)
            webrtc.createAndSendOffer()
        }, error => { console.log(error)})

    }

    answerCall ( component, params ) {

        let connection = this.peerConn,
            localStream = this.localVideoStream,
            localVideo = this.localVideoElem,
            webrtc = this

        this.prepareCall()
        // get the local stream, show it in the local video element and send it
        navigator.getUserMedia({"audio": true, "video": true }, stream => {
            localStream = stream
            localVideo.src = URL.createObjectURL(stream)
            connection.addStream(stream)
            webrtc.createAndSendAnswer()
        }, error => { console.log(error) })

    }

    endCall ( component, params ) {

        this.peerConn.close()
        this.localVideoStream.getTracks().forEach(track => {
            track.stop()
        })
        this.localVideo.src = ""
        this.remoteVideo.src = ""
        this.videoCallButton.removeAttribute("disabled")
        this.endCallButton.setAttribute("disabled", true)

    }

    getVideo ( video ) {

        if ( video == "local" ) {

            return this.localVideo

        } else {

            return this.remoteVideo

        }

    }

    init ( component ) { 
        
        return {
            initiateCall: (params) => {
                this.initiateCall( component, params)
            },
            getVideo: ( video ) => {
                this.getVideo( component, params )
            },
            answerCall: (params) => {
                this.answerCall( component, params )
            },
            endCall: (params) => {
                this.endCall( component, params )
            },

        }
    }
}

