export const API_SERVER = window.location.protocol+"//"+window.location.host
export const GRID_SIZE =  [ 928000, 928000, 807360 ]

export let clearOldData = () => {

  if (localStorage.getItem("postProcessing") != null) {

    if (localStorage.getItem("version0.4") == null) {

      localStorage.setItem("version0.4", "1")
      localStorage.setItem("postProcessing", "off")

    }

  }

}