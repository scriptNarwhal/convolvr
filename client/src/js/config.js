export const API_SERVER = window.location.protocol+"//"+window.location.host
export const APP_ROOT = "" // change this if running off of a subdir, eg: "convolvr/" for domain.com/convolvr/user/world
export const GRID_SIZE =  [ 42.18181818181818, 42.18181818181818, 36.698181818181816 ]
export const GLOBAL_SPACE = [ 0, 1, 0 ]

export let detectWorldDetailsFromURL = () => {

    let url = window.location.pathname,
        params = url.split("/"),
        slashes = params.length -1,
        coords = [0,0,0],
        nonWorlds = ["login", "network", "chat", "files", "settings", "worlds", "new-world"],
        isWorld = true,
        worldDetails = [ "world", "Convolvr" ]

    nonWorlds.map( nWorld => {
        if ( url.indexOf(`/${nWorld}`) == 0 ) {
            isWorld = false
        }
    })

    if ( params.length > 2 )

        worldDetails = [ params[1], params[2] ]

    
    if ( params.length > 4 && url.search( 'at/*\.*\.*' ) > -1 ) 

        coords = params[4].split(".").map( v => parseInt(v) )

    if ( isWorld && slashes >= 2 )
        
        worldDetails = [params[1], params[2], isWorld, coords]
        
    
    return worldDetails

}

export let clearOldData = () => {

  if (localStorage.getItem("postProcessing") != null) {

    if (localStorage.getItem("version0.41") == null) {

      localStorage.setItem("version0.41", "1")
      localStorage.setItem("postProcessing", "off")
      localStorage.setItem("shadows", window.innerWidth < 720 ? 0 : 1 )

    }

  }

}

export let isMobile = () => window.innerWidth < 480 || window.devicePixelRatio >= 1.5 && window.innerWidth < 1280