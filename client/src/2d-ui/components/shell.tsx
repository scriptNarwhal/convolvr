/* General shell / dashboard UI */
import * as React from "react"; import { Component } from "react";
import { Shell, shellStyles } from "energetic-ui"

import SideMenu from '../components/side-menu'
interface ShellProps {
  dispatch?: (action: any) => void
  sideMenu?: any,
  cwd?: any[]
  currentSpace?: string
  worldUser?: string
  username?: string
  reactPath?: string
  users?: any[]
  listFiles?: Function
  sendMessage?: Function
  toggleMenu?: Function
  noBackground?: boolean
  stereoMode?: boolean
  htmlClassName?: string
  innerStyle?: any
  data?: any
  hasMenu?: boolean
  menuOnly?: boolean
  menuOpen?: boolean
}

import { connect } from 'react-redux'
import { toggleMenu } from '../../2d-ui/redux/actions/app-actions'
import {
    sendMessage
} from '../../2d-ui/redux/actions/message-actions'
import {
  listFiles
} from '../../2d-ui/redux/actions/file-actions'

export default connect(
  (state: any, ownProps: ShellProps) => {
    return {
      sideMenu: SideMenu,
      cwd: state.files.listDirectories.workingPath,
      currentSpace: state.spaces.current,
      worldUser: state.spaces.worldUser,
      username: state.users.loggedIn != false ? state.users.loggedIn.name : "Human",
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      reactPath: window.location.href  //state.routing.locationBeforeTransitions.pathname
    }
  },
  (dispatch: any) => {
    return {
      listFiles: (username: string, dir: string) => {
          dispatch(listFiles(username, dir))
      },
      toggleMenu: (force: boolean) => {
        dispatch(toggleMenu(force))
      },
      sendMessage: (message: string, from: string, files: any[], avatar: string, space: string) => {
        dispatch(sendMessage(message, from, files, avatar, space))
      },
    }
  }
)(Shell as React.ComponentType<any>)