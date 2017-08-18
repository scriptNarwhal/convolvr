export const API_SERVER = window.location.protocol+"//"+window.location.host
export const GRID_SIZE =  [ 928000, 928000, 807360 ]

export let detectWorldDetailsFromURL = () => {

    let url = window.location.pathname,
        params = url.split("/"),
        slashes = params.length -1,
        coords = [0,0,0],
        nonWorlds = ["login", "network", "chat", "files", "settings", "worlds", "new-world"],
        isWorld = true,
        worldDetails = [ "convolvr", "Overworld" ]

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

    if (localStorage.getItem("version0.4") == null) {

      localStorage.setItem("version0.4", "1")
      localStorage.setItem("postProcessing", "off")

    }

  }

}

