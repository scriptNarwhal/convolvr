import { rgba } from '../util'

export let modalStyle = (mobile) => {
    return {
        width: '100%',
        minWidth: '320px',
        height: mobile ? '86%' : '92%',
        padding: '1em',
        position: 'absolute',
        top: mobile ? '64px' : '0px',
        right: '0px',
        bottom: '0px',
        margin: 'auto',
        borderRadius: '0.2em',
        border: '0.15em solid rgb(60,60,60)',
        backgroundColor: "rgba(0,0,0,0.88)"
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
    background: 'black'
}