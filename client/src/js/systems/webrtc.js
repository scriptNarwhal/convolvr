import {send} from '../network/socket'
//WebRTC boilerplate stuff based off of http://web-engineering.info/node/57

export default class WebRTCSystem {
    constructor (world) {
        this.world = world
        var localVideoStream = null,
            peerConn = null,
            peerConnCfg = {'iceServers': [
                    {'url': 'stun:stun.services.mozilla.com'}, 
                    {'url': 'stun:stun.l.google.com:19302'}
                ]
            }
            this.peerConnCfg = peerConnCfg
            this.localVideoElem = document.getElementById('localVideo')
            this.remoteVideoElem = document.getElementById('remoteVideo')
            this.videoCallButton = document.getElementById("videoCallButton")
            this.endCallButton = document.getElementById("endCallButton")
            
        if (navigator.getUserMedia && this.videoCallButton) { // probably don't need a button to use this.. debug later
            this.videoCallButton.addEventListener("click", this.initiateCall)
            this.endCallButton.addEventListener("click", function (evt) {
                send("rtc", {"closeConnection": true })
            });
        } else {
            console.log("Sorry, your browser does not support WebRTC!")
        }
    }
    prepareCall() {
        this.peerConn = new RTCPeerConnection(peerConnCfg)
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
    createAndSendOffer() {
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
    
    answerCall () {
        this.prepareCall()
        // get the local stream, show it in the local video element and send it
        navigator.getUserMedia({ "audio": true, "video": true }, stream => {
            localVideo.src = URL.createObjectURL(stream)
            this.peerConn.addStream(stream)
            createAndSendAnswer()
        }, error => { console.log(error) })
    }
    createAndSendAnswer () {
        let connection = this.peerConn
        connection.createAnswer(
            answer => {
                let ans = new RTCSessionDescription(answer)
                connection.setLocalDescription(ans, ()=>{ send("rtc", {"sdp": ans })}, error => {console.log(error)} )
            },
            error => { 
                console.log(error)
            }
        );
    }
    endCall () {
        peerConn.close()
        this.localVideoStream.getTracks().forEach(track => {
            track.stop()
        })
        this.localVideo.src = ""
        this.remoteVideo.src = ""
        this.videoCallButton.removeAttribute("disabled")
        this.endCallButton.setAttribute("disabled", true)
    }
    getVideo (params) {

    }
    init (component) { 
        
        return {
            connect: (params) => {
                this.connect(params)
            },
            disconnect: (params) => {
                this.disconnect(params)
            },
            getVideo: (params) => {
                this.getVideo(params)
            }
        }
    }
}

