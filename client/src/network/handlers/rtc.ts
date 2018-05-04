import Convolvr from "../../world/world";
import WebRTCSystem from "../../systems/video/webrtc";

export default class RTCHandler {
    
    public handlers: any
    
    private socket: any
    private world: Convolvr

    constructor (handlers: any, world: Convolvr, socket: any ) {

        this.world = world
        this.handlers = handlers
        socket.on("rtc", (packet: any) => {

            let signal = JSON.parse( packet ),
                webrtc: WebRTCSystem = this.world.systems.webrtc,

            peerConn = (webrtc as any).peerConn
        
            // TODO:// look up component to pass to answer / end call

            if (!peerConn)
                webrtc.answerCall(null, {}) // TODO:// look up component to pass to answer / end call
        
            if (signal.sdp) {
                peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        
            } else if (signal.candidate) {
                peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate))
        
            } else if (signal.closeConnection){
                webrtc.endCall(null, {}) // TODO:// look up component to pass to answer / end call
            }

        })
    }
}