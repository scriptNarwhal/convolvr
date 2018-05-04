import { toggleMenu } from '../redux/actions/app-actions';
import Convolvr from '../world/world';
import UserInput from './user-input';
import ToolboxSystem from '../systems/tool/toolbox';

export default class Mouse {
    
    private input: UserInput
    private world: Convolvr
    private store: any
    private lastMovement: number[]

    constructor (userInput: UserInput, world: Convolvr ) {
        this.input = userInput
        this.world = world
        this.store = world.store
        this.lastMovement = [0,0]
    }

    init () {
        let viewport = document.querySelector("#viewport"),
            mouse = this,
            uInput: any = this.input,
            world: Convolvr = this.world

        viewport.requestPointerLock = viewport.requestPointerLock || (viewport as any).mozRequestPointerLock || (viewport as any).webkitRequestPointerLock;
        (viewport as any).style.pointerEvents = '';

        if ("onpointerlockchange" in document) {
            document.addEventListener('pointerlockchange', () => { this.lockChangeAlert(viewport) }, false);
        } else if ("onmozpointerlockchange" in document) {
            (document as Document).addEventListener('mozpointerlockchange', () => { this.lockChangeAlert(viewport) }, false);
        } else if ("onwebkitpointerlockchange" in document) {
            (document as Document).addEventListener('webkitpointerlockchange', () => { this.lockChangeAlert(viewport) }, false)
        }

        setTimeout(() => {
            let user = uInput.user

            document.addEventListener("mousedown", e => {
                if ( world.mode != "web" ) {
                    switch ( e.which ) {
                        case 1: // left mouse
                            user.toolbox.preview(0, 0) // right hand
                        break
                        case 2: // scroll wheel click
                            // tools.selectObject() .. might be handy
                        break
                        case 3: // right click
                            user.toolbox.grip( 0, 1 )
                        break
                    }
                }
            })

            document.addEventListener("mouseup", (e) => {
                let toolbox: ToolboxSystem = this.world.systems.toolbox,
                    target = (e.target as any);

                if ( world.mode != "web" && this.input.focus && target && target.tagName.toLowerCase() == "canvas" ) {
                    switch ( e.which ) {
                        case 1: // left mouse
                            toolbox.usePrimary(0) // right hand
                        break
                        case 2: // scroll wheel click
                            // tools.selectObject() .. might be handy
                        break
                        case 3: // right click
                            toolbox.grip( 0, -1 )
                        break
                    }
                }
            }, false)
        }, 250)

        document.addEventListener("mousemove", (e: any) => {
            if ( uInput.focus ) {
                let movement = [0,0];
                movement = mouse.windows10Fix([
                    (e.movementX || e.mozMovementX || e.webkitMovementX || 0),
                    (e.movementY || e.mozMovementY || e.webkitMovementY || 0)
                ])
                    
                uInput.rotationVector.y -= movement[0] / 600
                uInput.rotationVector.x -= movement[1] / 600
                mouse.lastMovement = [ ...movement ]
            }
        })
    }

    windows10Fix(movement: Array<number>) {
        if ( Math.abs(movement[0] - this.lastMovement[0]) < 160 && 
             Math.abs(movement[1] - this.lastMovement[1]) < 160) {
            return movement;
        } else {
            return [ 0, 0 ]
        }
    }

    lockChangeAlert(canvas: any) {
        var world = this.world,
            doc = (document as any),
            a = 0

        this.input.focus = (doc.pointerLockElement === canvas || doc.mozPointerLockElement === canvas || doc.webkitPointerLockElement === canvas);
        this.input.fullscreen = this.input.focus

        if ( !this.input.focus && !this.input.fullscreen && world.user.name != "" ) {
            //world.showChat();
            world.mode = "web"
            document.body.setAttribute("class", "desktop")
            this.store.dispatch( toggleMenu( true ) )
        } else {
            if (world.user.name != "") {
                if (world.mode != "stereo")
                    world.mode = "3d"

                document.body.setAttribute("class", "3d")
                this.store.dispatch( toggleMenu( false ) )
            }
        }
    }
}

