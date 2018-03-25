import UserUpdateHandler from './user-update'
import ToolActionHandler from './tool-action'
import RTCHandler from './rtc'

export default class SocketHandlers {

    constructor ( world, socket ) {

        this.world = world
        this.socket = socket
        this.userUpdateHandler = new UserUpdateHandler( this, world, socket )
        this.toolActionHandler = new ToolActionHandler( this, world, socket )
        this.rtcHandler = new RTCHandler( this, world, socket )

    }

}