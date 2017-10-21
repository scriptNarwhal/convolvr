export default class RTCHandler {
    
    constructor ( handlers, world, socket ) {

        this.world = world
        this.handlers = handlers
        socket.on("rtc", packet => {

            let signal = JSON.parse( packet ),
            webrtc = this.world.systems.webrtc,
            peerConn = webrtc.peerConn
        
            if (!peerConn)
                webrtc.answerCall()
        
            if (signal.sdp) {
                peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        
            } else if (signal.candidate) {
                peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate))
        
            } else if (signal.closeConnection){
                webrtc.endCall()
            }

        })
        
    }

}