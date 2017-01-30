import {
    FILES_LIST_FETCH,
    FILES_LIST_FAIL,
    FILES_LIST_DONE,
    FILE_DELETE_FETCH,
    FILE_DELETE_DONE,
    FILE_DELETE_FAIL,
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
    DIRECTORIES_MAKE_FETCH,
    DIRECTORIES_MAKE_FAIL,
    DIRECTORIES_MAKE_DONE
} from '../constants/action-types';

module.exports = function files (state = {
  list: {
    data: false,
    fetching: false,
    error: false
  },
  delete: {
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
  }
}, action) {
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
    default:
      return state;
  }
};
