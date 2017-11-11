import { rgba } from '../util'

export let modalStyle = (mobile) => {
    return {
        width: '100%',
        minWidth: '320px',
        height: mobile ? '86%' : '88%',
        padding: '1em',
        paddingLeft: mobile ? '0em' : '1em',
        position: 'absolute',
        top: mobile ? '64px' : '0px',
        right: '0px',
        bottom: '0px',
        margin: 'auto',
        borderRadius: '0.2em',
        border: '0.15em solid rgb(60,60,60)',
        borderTop: 'rgb(51, 51, 51) 1em solid',
        backgroundColor: "rgba(14, 14, 14, 0.96)",
        boxShadow: "0px 10px 100px rgba(0, 0, 0, 0.92)"
    }
}

export let basicInputStyle = {
    display: 'block',
    marginBottom: '0.5em'
}

export let lightboxStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
    // background: rgba(0, 0, 0, 0.1)
}

export let textAreaStyle = {
    margin: '0px',
    width: '95%',
    height: '358px',
    color: 'white',
    marginBottom: '0.5em',
    padding: '0.5em',
    background: 'rgba(0, 0, 0, 0.16)'
}

let compactWidth = (compact) => compact ? '52px' : '60px'

export let tabStyle = (compact) => { 
    let width = compactWidth(compact),
        top = compact ? "-3px" : 0,
        marginLeft = compact ? '-6px' : 0

    return {
      color: 'rgba(255,255,255,0.92)',
      fontSize: '15px',
      position: 'relative',
      display: 'inline-block',
      height: width,
      marginLeft,
      width,
      top
    }
}

export let tabTitleStyle = ( mobile ) => {
    return {
      transition: "all 0.3s linear",
      height: 0,
      opacity: 0,
      position: 'relative',
      top: mobile ? '0px' : '-15px'
    }
  }

  export let buttonStyle = (compact) => { 
    let width = compactWidth(compact)
    return {
        display: 'inline-block',
        height: width,
        width
    }
  }

  export let buttonInnerStyle = (compact) => {
    let width = compactWidth(compact)
    return {
        transition: 'all 0.2s linear',
        height: width,
        width,
        display: 'block',
        backgroundSize: '60%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%',
        cursor: 'pointer'
    }
  }

  export let buttonFileStyle = () => {
      return {
        position: 'relative',
        bottom: '-1.5em',
        left: '0.5em',
        width: '92px',
        opacity: 0
      }
  }