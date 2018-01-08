import { dispatch } from 'redux';
import { toggleMenu } from '../redux/actions/app-actions';

export default class Mouse {
    
    constructor ( userInput, world ) {

        this.input = userInput
        this.world = world
        this.store = world.store
        this.lastMovement = [0,0]

    }

    init () {

        let viewport = document.querySelector("#viewport"),
            mouse = this,
            uInput = this.input,
            world = this.world

        viewport.requestPointerLock = viewport.requestPointerLock || viewport.mozRequestPointerLock || viewport.webkitRequestPointerLock;
        viewport.style.pointerEvents = ''

        if ("onpointerlockchange" in document) {

            document.addEventListener('pointerlockchange', () => { this.lockChangeAlert(viewport) }, false)

        } else if ("onmozpointerlockchange" in document) {

            document.addEventListener('mozpointerlockchange', () => { this.lockChangeAlert(viewport) }, false)

        } else if ("onwebkitpointerlockchange" in document) {

            document.addEventListener('webkitpointerlockchange', () => { this.lockChangeAlert(viewport) }, false)

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

                let user = this.input.user

                if ( world.mode != "web" && this.input.focus && e.target.tagName.toLowerCase() == "canvas" ) {
                    switch ( e.which ) {
                        case 1: // left mouse
                            user.toolbox.usePrimary(0, 0) // right hand
                        break
                        case 2: // scroll wheel click
                            // tools.selectObject() .. might be handy
                        break
                        case 3: // right click
                            user.toolbox.grip( 0, -1 )
                        break
                    }
                }
            }, false)
        }, 250)

        document.addEventListener("mousemove", e => {
           
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

    lockChangeAlert( canvas ) {

        var world = this.world,
            a = 0

        this.input.focus = (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas);
        this.input.fullscreen = this.input.focus

        if ( !this.input.focus && !this.input.fullscreen && world.user.username != "" ) {

            //world.showChat();
            world.mode = "web"
            document.body.setAttribute("class", "desktop")
            this.store.dispatch( toggleMenu( true ) )

        } else {

            if (world.user.username != "") {
                if (world.mode != "stereo")
                    world.mode = "3d"


                document.body.setAttribute("class", "3d")
                this.store.dispatch( toggleMenu( false ) )
            }
        }
    }
}

