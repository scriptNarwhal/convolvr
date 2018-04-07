import * as React from "react";
import { Component } from "react";
import Shell from "../components/shell";
import Card from "../components/card";
import LocationBar from "../components/location-bar";
import InventoryList from "./inventory-list";
import { isMobile } from "../../config";

class Inventory extends Component<any, any> {
    handleBGClick(e: any) {
        if (e.target.getAttribute("id") == "bg-toggle-menu") {
            this.props.toggleMenu(false);
            this.props.history.push("/");
        }
    }

    componentWillMount() {
        this.refreshInventory();
        this.setState({});
    }

    componentWillReceiveProps(nextProps: any) {
        let userNameChanged = nextProps.username != this.props.username,
            inventoryUpdated = this.props.inventoryUpdating && nextProps.inventoryUpdating == false;

        if (inventoryUpdated) this.refreshInventory();
    }

    refreshInventory(opts?: any) {
        this.props.getInventory(this.props.username, "Entities");
        this.props.getInventory(this.props.username, "Components");
        this.props.getInventory(this.props.username, "Properties");
    }

    componentWillUpdate(nextProps: any, nextState: any) {}

    onContextAction(name: string, data: any, e: any) {
        switch (name) {
            case "Add To Space":
                this.props.launchImportToSpace(this.props.username, data.itemIndex, data.itemData);
                break;
            case "Edit":
                this.props.editLoadedItem(data.source, this.props.username, data.category, data.itemIndex, data.itemData);
                break;
            case "Export JSON":
                this.props.launchInventoryExport(this.props.username, data.category, data.itemId, data.itemIndex, data.itemData);
                break;
        }
    }

    render() {
        // false == this.props.inventoryUpdating
        return (
            <Shell
                htmlClassName="data-view"
                innerStyle={{ paddingTop: isMobile() ? "82px" : 0, paddingLeft: isMobile() ? "10px" : "72px" }}
            >
                <div style={ isMobile() ? { paddingTop: "60px" } : { paddingTop: "0px" } }></div>
                <span
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        paddingTop: isMobile() ? "86px" : 0,
                        paddingLeft: isMobile() ? 0 : "60px"
                    }}
                    onClick={e => {
                        this.handleBGClick(e);
                    }}
                    id="bg-toggle-menu"
                >
                    {true
                        ? [
                              [this.props.inventoryEntities, "Entities"],
                              [this.props.inventoryComponents, "Components"],
                              [this.props.inventoryProperties, "Properties"]
                          ].map((inventorySet, i) => (
                              <InventoryList
                                  onAction={(name: string, data: any, e: any) => {
                                      let actionData = {
                                          ...data,
                                          source: "inventory",
                                          category: inventorySet[1],
                                          itemIndex: data.itemIndex,
                                          itemId: inventorySet[0][data.itemIndex].id,
                                          itemData: inventorySet[0][data.itemIndex]
                                      };
                                      console.info("<InventoryList> onAction ", actionData);
                                      this.onContextAction(name, actionData, e);
                                  }}
                                  fetching={this.props.inventoryUpdating}
                                  options={inventorySet[0]}
                                  username={this.props.username}
                                  style={{ zIndex: 9999 }}
                                  category={inventorySet[1]}
                                  key={i}
                              />
                          ))
                        : ""}
                </span>
            </Shell>
        );
    }
}

import { connect } from "react-redux";
import { sendMessage } from "../../redux/actions/message-actions";
import { showChat } from "../../redux/actions/app-actions";
import { listFiles, listDirectories, changeDirectory,uploadFile, uploadFiles } from "../../redux/actions/file-actions";
import {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    removeInventoryItem,
    addItemToSpace
} from "../../redux/actions/inventory-actions";
import { launchEditLoadedItem, launchInventoryExport, launchImportToSpace } from "../../redux/actions/util-actions";
import { toggleMenu } from "../../redux/actions/app-actions";

export default connect(
    (state: any, ownProps: any) => {
        return {
            loggedIn: state.users.loggedIn,
            username: state.users.loggedIn != false ? state.users.loggedIn.name : "public",
            vrMode: state.app.vrMode,
            inventoryEntities: state.inventory.items.entities,
            inventoryComponents: state.inventory.items.components,
            inventoryProperties: state.inventory.items.properties,
            inventoryUpdating: state.inventory.fetching,
            workingPath: state.files.listDirectories.workingPath,
            upload: state.files.uploadMultiple
        };
    },
    (dispatch: any) => {
        return {
            toggleMenu: (force: boolean) => {
                dispatch(toggleMenu(force));
            },
            launchImportToSpace: (username: string, index: number, data: any) => {
                dispatch(launchImportToSpace(username, index, data));
            },
            launchInventoryExport: (username: string, category: string, itemId: number, itemIndex: number, itemData: any) => {
                dispatch(launchInventoryExport(username, category, itemId, itemIndex, itemData));
            },
            getInventory: (userId: number, category: string) => {
                dispatch(getInventory(userId, category));
            },
            addInventoryItem: (userId: number, category: string, data: any) => {
                dispatch(addInventoryItem(userId, category, data));
            },
            updateInventoryItem: (userId: number, category: string, data: any) => {
                dispatch(updateInventoryItem(userId, category, data));
            },
            removeInventoryItem: (userId: number, category: string, itemId: number) => {
                dispatch(removeInventoryItem(userId, category, itemId));
            },
            uploadFile: (file: string, username: string, dir: string) => {
                dispatch(uploadFile(file, username, dir));
            },
            editLoadedItem: (source: string, username: string, category: string, index: number, data: any) => {
                dispatch(launchEditLoadedItem(source, username, category, index, data));
            }
        };
    }
)(Inventory);

let styles = {
    hr: {
        visibility: "hidden"
    }
};
