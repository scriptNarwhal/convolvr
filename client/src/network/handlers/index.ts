import UserUpdateHandler from './user-update'
import ToolActionHandler from './tool-action'
import RTCHandler from './rtc'
import Convolvr from '../../world/world';

export default class SocketHandlers {
    private world: Convolvr
    public socket: any
    public userUpdateHandler: UserUpdateHandler
    public toolActionHandler: ToolActionHandler
    public rtcHandler: RTCHandler 

    constructor ( world: Convolvr, socket: any ) {
        this.world = world
        this.socket = socket
        this.userUpdateHandler = new UserUpdateHandler( this, world, socket )
        this.toolActionHandler = new ToolActionHandler( this, world, socket )
        this.rtcHandler = new RTCHandler( this, world, socket )
    }
}