import React, { Component } from 'react'
import Button from '../components/button'
import Card from '../components/Card'
import EntityEditor from '../components/data/entity-editor'
import ComponentEditor from '../components/data/component-editor'
import PropertyEditor from '../components/data/property-editor'
import ImportToWorld from '../components/data/import-to-world'
import InventoryExport from '../components/data/inventory-export'

export default class InventoryList extends Component {

  componentWillMount () {

    this.setState({
      activated: false
    })
    
  }

  handleContextAction ( action, evt ) {

    if ( this.props.onAction )

      this.props.onAction( action, evt )

  }

  render() {

    let username = this.props.username,
        dir = this.props.dir

    return (
        <div style={Object.assign({}, styles.list(this.props.color, this.props.compact), this.props.style )} title={this.props.category }>
          <span style={styles.title}>
            { this.props.category }
            <span style={styles.new}>
              {
                this.props.category == "Entities" ? (
                  [
                    <EntityEditor username={this.props.username} key="1" />,
                    <ImportToWorld key="2" />,
                    <InventoryExport key="3" />
                  ]
                ) : this.props.category == "Components" ? (
                  <ComponentEditor username={this.props.username}/>
                ) : (
                  <PropertyEditor username={this.props.username}/>
                )
              }
              
            </span>
          </span>
      
          <div style={styles.options}>
            {
              this.props.options && this.props.options.map((opt, i) =>{
                return (
                    <Card image=''
                          clickHandler={ (e) => {
                            console.log(e, opt.name, "clicked")
                           
                          }}
                          onContextMenu={ (name, data, e) => this.handleContextAction(name, data, e) }
                          contextMenuOptions={ this.props.contextMenuOptions }
                          showTitle={true}
                          username={this.props.username}
                          dir={this.props.dir}
                          category={this.props.category}
                          title={opt.name}
                          key={i}
                    />
                )
              })
            }
          </div>
        </div>
    )

  }

}

InventoryList.defaultProps = {
    title: "File Options",
    dir: "",
    username: "",
    category: "Entities",
    showTitle: false,
    style: {},
    color: '#252525',
    compact: false,
    isImage: false,
    options: [],
    contextMenuOptions: [
        { name: "Add To World" },
        { name: "Export JSON"},
        { name: "Edit" }
    ]
}

let styles = {
  list: (color, compact) => {
    return {
      backgroundColor: 'rgb(24, 24, 24)',
      boxShadow: '0 0.25em 0.5em 0px rgba(0, 0, 0, 0.3)',
      cursor: 'pointer',
      width: '32%',
      minWidth: '320px',
      height: '100%',
      display: 'inline-block',
      marginRight: '0.5em',
      marginLeft: '8px',
      marginBottom: '0.5em',
      textAlign: "center",
      verticalAlign: 'top'
    }
  },
  option: {
    textAlign: 'left',
    paddingLeft: '0.8em',
    paddingBottom: '0.2em'
  },
  options: {
    paddingTop:'0.4em'
  },
  button: ( compact, image, close ) => {
    return {
      position: 'relative',
      top: compact ? '-50px' : close ? '-50px' : '-48px',
      right: close ? '-16px' : '-104px',
      opacity: close ? 1 : image ? 0.5 : 0.33,
      float: close ? 'right' : 'none'
    }
  },
  title: {
    width: '100%',
    height: '40px',
    display: 'block',
    textAlign: 'left',
    paddingLeft: '1em',
    paddingTop: '0.5em',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  new: {
    width: '40%',
    height: '40px',
    paddingTop: '0em',
    marginRight: '1em',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
}
