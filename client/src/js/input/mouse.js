export default class Mouse {
    
    constructor ( userInput, world ) {

        this.input = userInput
        this.world = world

    }

    init () {

        let viewport = document.querySelector("#viewport"),
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

        document.addEventListener("mousemove", function (e) {

            if ( uInput.focus ) {
 
                uInput.rotationVector.y -= (e.movementX || e.mozMovementX || e.webkitMovementX || 0) / 600.0
                uInput.rotationVector.x -= (e.movementY || e.mozMovementY || e.webkitMovementY || 0) / 600.0

            }

        })

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
                            //this.user.toolbox.useSecondary(0, 1) // right hand // change tool option in forward direction
                            // refactor this to grab entity
                        break

                    }
                }

            })

            document.addEventListener("mouseup", (e) => {

                let user = this.input.user

                if ( world.mode != "web" ) {

                    switch ( e.which ) {

                        case 1: // left mouse
                            user.toolbox.usePrimary(0, 0) // right hand
                        break
                        case 2: // scroll wheel click
                            // tools.selectObject() .. might be handy
                        break
                        case 3: // right click
                            //this.user.toolbox.useSecondary(0, 1) // right hand // change tool option in forward direction
                            // refactor this to grab entity
                        break

                    }
                }

            }, false)

        }, 250)

    }

    lockChangeAlert( canvas ) {

        var world = this.world,
            a = 0

        this.input.focus = (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas);
        this.input.fullscreen = this.focus
        console.log("focus", this.focus)

        if ( !this.input.fullscreen && world.user.username != "" ) {

            //world.showChat();
            world.mode = "web"
            document.body.setAttribute("class", "desktop")

        } else {

            if (world.user.username != "") {

                if (world.mode != "stereo")

                    world.mode = "3d"


                document.body.setAttribute("class", "3d")

            }

        }

    }

}

