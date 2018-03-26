import {
    FILES_LIST_FETCH,
    FILES_LIST_FAIL,
    FILES_LIST_DONE,
    FILE_DELETE_FETCH,
    FILE_DELETE_DONE,
    FILE_DELETE_FAIL,
    FILE_MOVE_FETCH,
    FILE_MOVE_DONE,
    FILE_MOVE_FAIL,
    FILE_UPLOAD_FETCH,
    FILE_UPLOAD_DONE,
    FILE_UPLOAD_FAIL,
    FILES_UPLOAD_FETCH,
    FILES_UPLOAD_DONE,
    FILES_UPLOAD_FAIL,
    TEXT_READ_FETCH,
    TEXT_READ_DONE,
    TEXT_READ_FAIL,
    TEXT_WRITE_FETCH,
    TEXT_WRITE_DONE,
    TEXT_WRITE_FAIL,
    DIRECTORIES_LIST_FETCH,
    DIRECTORIES_LIST_FAIL,
    DIRECTORIES_LIST_DONE,
    DIRECTORY_MAKE_FETCH,
    DIRECTORY_MAKE_FAIL,
    DIRECTORY_MAKE_DONE,
    SHARE_CREATE_FETCH,
    SHARE_CREATE_DONE,
    SHARE_CREATE_FAIL,
    SHARE_UPDATE_FETCH,
    SHARE_UPDATE_DONE,
    SHARE_UPDATE_FAIL,
    SHARE_DELETE_FETCH,
    SHARE_DELETE_DONE,
    SHARE_DELETE_FAIL,
    SHARE_GET_FETCH,
    SHARE_GET_DONE,
    SHARE_GET_FAIL,
    SHARES_LIST_FETCH,
    SHARES_LIST_DONE,
    SHARES_LIST_FAIL,
    CHANGE_DIRECTORY
} from '../constants/action-types';

module.exports = function files (state: any = {
  list: {
    data: false,
    fetching: false,
    error: false
  },
  listDirectories: {
    data: false,
    fetching: false,
    error: false,
    workingPath: [""]
  },
  createDirectory: {
    data: false,
    fetching: false,
    error: false
  },
  delete: {
    data: false,
    fetching: false,
    error: false
  },
  move: {
    data: false,
    fetching: false,
    error: false
  },
  upload: {
    data: false,
    fetching: false,
    error: false
  },
  uploadMultiple: {
    data: false,
    fetching: false,
    error: false
  },
  readText: {
    data: false,
    fetching: false,
    error: false
  },
  writeText: {
    data: false,
    fetching: false,
    error: false
  },
  getShare: {
    data: false,
    fetching: false,
    error: false
  },
  listShares: {
    data: false,
    fetching: false,
    error: false
  },
  createShare: {
    data: false,
    fetching: false,
    error: false
  },
  updateShare: {
    data: false,
    fetching: false,
    error: false
  },
  deleteShare: {
    data: false,
    fetching: false,
    error: false
  }
}, action: any) {
  switch (action.type) {
    case FILE_DELETE_FETCH:
      return Object.assign({}, state, {
        delete: Object.assign({}, state.delete, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case FILE_DELETE_DONE:
      return Object.assign({}, state, {
        delete: Object.assign({}, state.delete, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case FILE_DELETE_FAIL:
      return Object.assign({}, state, {
        delete: Object.assign({}, state.delete, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case FILE_MOVE_FETCH:
      return Object.assign({}, state, {
        move: Object.assign({}, state.move, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case FILE_MOVE_DONE:
      return Object.assign({}, state, {
        move: Object.assign({}, state.move, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case FILE_MOVE_FAIL:
      return Object.assign({}, state, {
        move: Object.assign({}, state.move, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case FILES_LIST_FETCH:
      return Object.assign({}, state, {
        list: Object.assign({}, state.list, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case FILES_LIST_DONE:
      return Object.assign({}, state, {
        list: Object.assign({}, state.list, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case FILES_LIST_FAIL:
      return Object.assign({}, state, {
        list: Object.assign({}, state.list, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case DIRECTORY_MAKE_FETCH:
      return Object.assign({}, state, {
        createDirectory: Object.assign({}, state.createDirectory, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case DIRECTORY_MAKE_DONE:
      return Object.assign({}, state, {
        createDirectory: Object.assign({}, state.createDirectory, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case DIRECTORY_MAKE_FAIL:
      return Object.assign({}, state, {
        createDirectory: Object.assign({}, state.createDirectory, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
      case DIRECTORIES_LIST_FETCH:
      return Object.assign({}, state, {
        listDirectories: Object.assign({}, state.listDirectories, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case DIRECTORIES_LIST_DONE:
      return Object.assign({}, state, {
        listDirectories: Object.assign({}, state.listDirectories, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case DIRECTORIES_LIST_FAIL:
      return Object.assign({}, state, {
        listDirectories: Object.assign({}, state.listDirectories, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
      case CHANGE_DIRECTORY:
        return Object.assign({}, state, {
          listDirectories: Object.assign({}, state.listDirectories, {
            workingPath: action.path,
            data: false
          }),
          listFiles: Object.assign({}, state.listFiles, {
            data: false
          })
        })
    case FILE_UPLOAD_FETCH:
      return Object.assign({}, state, {
        upload: Object.assign({}, state.upload, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case FILE_UPLOAD_DONE:
      return Object.assign({}, state, {
        upload: Object.assign({}, state.upload, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case FILE_UPLOAD_FAIL:
      return Object.assign({}, state, {
        upload: Object.assign({}, state.upload, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case FILES_UPLOAD_FETCH:
      return Object.assign({}, state, {
        uploadMultiple: Object.assign({}, state.uploadMultiple, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case FILES_UPLOAD_DONE:
      return Object.assign({}, state, {
        uploadMultiple: Object.assign({}, state.uploadMultiple, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case FILES_UPLOAD_FAIL:
      return Object.assign({}, state, {
        uploadMultiple: Object.assign({}, state.uploadMultiple, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case TEXT_READ_FETCH:
      return Object.assign({}, state, {
        readText: Object.assign({}, state.readText, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case TEXT_READ_DONE:
      return Object.assign({}, state, {
        readText: Object.assign({}, state.readText, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case TEXT_READ_FAIL:
      return Object.assign({}, state, {
        readText: Object.assign({}, state.readText, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case TEXT_WRITE_FETCH:
      return Object.assign({}, state, {
        writeText: Object.assign({}, state.writeText, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case TEXT_WRITE_DONE:
      return Object.assign({}, state, {
        writeText: Object.assign({}, state.writeText, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case TEXT_WRITE_FAIL:
      return Object.assign({}, state, {
        writeText: Object.assign({}, state.writeText, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case SHARE_GET_FETCH:
      return Object.assign({}, state, {
        getShare: Object.assign({}, state.getShare, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case SHARE_GET_DONE:
      return Object.assign({}, state, {
        getShare: Object.assign({}, state.getShare, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case SHARE_GET_FAIL:
      return Object.assign({}, state, {
        getShare: Object.assign({}, state.getShare, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case SHARES_LIST_FETCH:
      return Object.assign({}, state, {
        listShares: Object.assign({}, state.listShares, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case SHARES_LIST_DONE:
      return Object.assign({}, state, {
        listShares: Object.assign({}, state.listShares, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case SHARES_LIST_FAIL:
      return Object.assign({}, state, {
        listShares: Object.assign({}, state.listShares, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case SHARE_CREATE_FETCH:
      return Object.assign({}, state, {
        createShare: Object.assign({}, state.createShare, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case SHARE_CREATE_DONE:
      return Object.assign({}, state, {
        createShare: Object.assign({}, state.createShare, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case SHARE_CREATE_FAIL:
      return Object.assign({}, state, {
        createShare: Object.assign({}, state.createShare, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case SHARE_DELETE_FETCH:
      return Object.assign({}, state, {
        deleteShare: Object.assign({}, state.deleteShare, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case SHARE_DELETE_DONE:
      return Object.assign({}, state, {
        deleteShare: Object.assign({}, state.deleteShare, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case SHARE_DELETE_FAIL:
      return Object.assign({}, state, {
        deleteShare: Object.assign({}, state.deleteShare, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    case SHARE_UPDATE_FETCH:
      return Object.assign({}, state, {
        updateShare: Object.assign({}, state.updateShare, {
          fetching: true,
          data: false,
          error: false
        })
      })
    case SHARE_UPDATE_DONE:
      return Object.assign({}, state, {
        updateShare: Object.assign({}, state.updateShare, {
          fetching: false,
          data: action.data,
          error: false
        })
      })
    case SHARE_UPDATE_FAIL:
      return Object.assign({}, state, {
        updateShare: Object.assign({}, state.updateShare, {
          fetching: false,
          data: false,
          error: action.error
        })
      })
    default:
      return state;
  }
};
