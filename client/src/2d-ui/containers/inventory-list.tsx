import * as React from "react"; import { Component } from "react";
import { isMobile } from '../../config'
import Button from '../components/button'
import Card from '../components/card'
import EntityEditor from '../components/data/entity-editor'
import ComponentEditor from '../components/data/component-editor'
import AttributeEditor from '../components/data/attribute-editor'
import ImportToSpace from '../components/data/import-to-world'
import InventoryExport from '../components/data/inventory-export'

export default class InventoryList extends Component<any, any> {

  public defaultProps = {
    title: "File Options",
    dir: "",
    username: "",
    fetching: false,
    category: "Entities",
    showTitle: false,
    style: {},
    color: '#252525',
    compact: false,
    isImage: false,
    options: [] as any[],
    contextMenuOptions: [
      { name: "Add To Space" },
      { name: "Export JSON" },
      { name: "Edit" }
    ]
  }

  componentWillMount() {
    this.setState({
      activated: false
    })
  }

  handleContextAction(action: any, data: any, e: any) {
    if (this.props.onAction)
      this.props.onAction(action, data, e)

  }

  render() {
    let username = this.props.username,
      dir = this.props.dir;

    return (
      <div style={Object.assign({}, styles.list(this.props.color, this.props.compact), this.props.style)} title={this.props.category}>
        <span style={styles.title}>
          {this.props.category}
          <span style={styles.new}>
            {
              this.props.category == "Entities" ? (
                [
                  <EntityEditor username={this.props.username} key="1" />,
                  <ImportToSpace key="2" />,
                  <InventoryExport key="3" />
                ]
              ) : this.props.category == "Components" ? (
                <ComponentEditor username={this.props.username}
                  entityEditMode={false}
                />
              ) : (
                    <AttributeEditor username={this.props.username}
                      entityEditMode={false}
                    />
                  )
            }

          </span>
        </span>

        <div style={styles.options}>
          {
            this.props.fetching == false && this.props.options && this.props.options.map((opt: any, i: number) => {
              return (
                <Card clickHandler={(e: any, name: string) => { this.handleContextAction("Export JSON", { itemIndex: i }, e) }}
                  onContextMenu={(name: string, data: any, e: any) => { this.handleContextAction(name, { ...data, itemIndex: i }, e) }}
                  contextMenuOptions={this.props.contextMenuOptions}
                  showTitle={true}
                  compact={true}
                  image=''
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


let styles = {
  list: (color: string, compact: boolean) => {
    return {
      cursor: 'pointer',
      width: isMobile() ? '100%' : '32%',
      minWidth: '240px',
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
    paddingTop: '0.4em'
  },
  button: (compact: boolean, image: string, close: boolean) => {
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
    paddingTop: '0.5em'
  },
  new: {
    width: '40%',
    height: '40px',
    paddingTop: '0em',
    marginRight: '1em'
  }
}
