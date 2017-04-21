import React, { Component } from 'react'
import Button from './button'

let styles = {
  bar: () => {
    return {
      cursor: 'pointer',
      width: '100%',
      left: '0',
      top: '0',
      position: 'fixed',
      paddingLeft: '74px',
      marginTop: '0.2em',
      height: '48px',
      display: 'inline-block',
      marginRight: '0.5em',
      marginBottom: '0.5em'
    }
  },
  title: {
    width: '100%',
    height: '40px',
    display: 'block',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  option: {
    fontSize: "20pt",
    display: 'inline-block',
    float: 'left',
    marginRight: '0.5em'
  },
  home: {
    fontSize: "20pt",
    display: 'inline-block',
    float: 'left',
    marginLeft: '1em'
  },
  fileOption: {
    padding: '1em',
    paddingBottom: 0,
    height: '48px',
    display: 'inline-block',
    width: 'auto'
  },
  fileOptions: {
    display: 'none'
  }
}

export default class LocationBar extends Component {
  componentWillMount () {
    this.setState({

    })
  }
  render() {
    return (
        <div style={styles.bar()}>
          <div onClick={ e=> { this.props.onItemSelect(this.props.label, 0) } }
               style={styles.home}
          >
            <span style={{ marginRight: '0.3em' }}>
              { this.props.label }
            </span>
          </div>
            {
              this.props.path.map((opt, i) =>{
                return (
                  <div style={styles.option}
                       onClick={ e=> { this.props.onItemSelect(opt, i) } }
                       key={i}
                  >
                    { opt } /
                  </div>
                )
              })
            }
            <div style={styles.fileOptions}>
              <Button title="Upload File"
                      style={styles.fileOption}
                      onClick={e=> this.props.onOptionClick(e, "upload-file")}
              />
              <Button title="New File"
                      style={styles.fileOption}
                      onClick={e=> this.props.onOptionClick(e, "new-file")}
              />
              <Button title="New Folder"
                      style={styles.fileOption}
                      onClick={e=> this.props.onOptionClick(e, "new-folder")}
              />
            </div>
        </div>
    )
  }
}

LocationBar.defaultProps = {
  path: [],
  username: "",
  label: "",
  onOptionClick: (e, option) => {

  }
}
