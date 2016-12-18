import {
    TOOL_ADD,
    TOOLS_FETCH,
    TOOLS_FETCH_DONE,
    TOOLS_FETCH_FAILED,
    TOOL_NEXT,
    TOOL_PREVIOUS,
    TOOL_USE,
    TOOL_DELETE
} from '../constants/action-types';

module.exports = function tools (state = {
  currentTools: [0, 0],
  allTools: [
    {name:"Component"},
    {name:"Entity"},
    {name:"Delete"},
    {name:"Voxel"},
    {name:"Projectile"}
    // {name: "Custom Tool"}
  ]
}, action) {
  let n = state.allTools.length,
      newCurrentTools = [0, 0];

  switch (action.type) {
    case TOOL_ADD:

    case TOOL_NEXT:
    newCurrentTools = [state.currentTools[0], state.currentTools[1]];
    newCurrentTools[hand] += 1;
    if (newCurrentTools[hand] >= n) {
      newCurrentTools[hand] = 0;
    }
    return Object.assign({}, state, {
        currentTools: newCurrentTools
    })
    case TOOL_PREVIOUS:
    newCurrentTools = [state.currentTools[0], state.currentTools[1]];
    newCurrentTools[hand] -= 1;
    if (newCurrentTools[hand] < 0) {
      newCurrentTools[hand] = n -1;
    }
    return Object.assign({}, state, {
        currentTools: newCurrentTools
    })
    case TOOL_USE:

    case TOOL_DELETE:

    case TOOLS_FETCH:

    case TOOLS_FETCH_DONE:

    case TOOLS_FETCH_FAILED:

    default:
      return state;
  }
};
