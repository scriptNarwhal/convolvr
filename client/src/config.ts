export const API_SERVER = window.location.protocol+"//"+window.location.host
export const APP_ROOT = "" // change this if running off of a subdir, eg: "convolvr/" for domain.com/convolvr/user/world
export const GRID_SIZE =  [ 42.18181818181818, 42.18181818181818, 36.698181818181816 ]
export const GLOBAL_SPACE = [ 0, 1, 0 ]
export const APP_NAME = "Convolvr"
export const USE_REDUX_LOG = false;

export let detectSpaceDetailsFromURL = () => {

    let url = window.location.pathname,
        params = url.split("/"),
        slashes = params.length -1,
        coords = [0,0,0],
        nonSpaces = ["login", "network", "chat", "files", "settings", "spaces", "new-world"],
        isSpace = true,
        worldDetails: any[] = [ "world", APP_NAME ]

    nonSpaces.map( nSpace => {
        if ( url.indexOf(`/${nSpace}`) == 0 ) {
            isSpace = false
        }
    })

    if ( params.length > 2 )
        worldDetails = [ params[1], params[2] ]
    
    if ( params.length > 4 && url.search( 'at/*\.*\.*' ) > -1 ) 
        coords = params[4].split(".").map( v => parseInt(v) )

    if ( isSpace && slashes >= 2 )
        worldDetails = [params[1], params[2], isSpace, coords]
            
    return worldDetails
} 

export let clearOldData = () => {
  if (localStorage.getItem("postProcessing") != null) {
    if (localStorage.getItem("version0.55") == null) {
        localStorage.clear();
        localStorage.setItem("version0.55", "1")
    }
  }
}

export let isMobile = () => {
    let ratio = window.devicePixelRatio,
        width = window.innerWidth;

    if (ratio >= 2.5) {
        return width <   window.innerHeight;
    } else {
        return width <= 480 || ratio >= 1.25 && width <= 720;
    }
}

export let isVRMode = (mode: string) => (mode == "3d" || mode == "stereo")