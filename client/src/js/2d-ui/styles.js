import { rgba } from '../util'

export let modalStyle = {
    width: '100%',
    minWidth: '320px',
    height: '92%',
    padding: '1em',
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    margin: 'auto',
    border: '0.1em solid white',
    backgroundColor: "black",
    backgroundImage: 'linear-gradient(rgb(12, 12, 12), rgb(17, 17, 17), rgb(33, 33, 33))'
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
    height: '100%',
    background: rgba(0, 0, 0, 0.5)
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