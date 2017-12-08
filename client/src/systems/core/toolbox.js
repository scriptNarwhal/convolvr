/* toolbox */
import {send} from '../../network/socket'
import ComponentTool from '../../assets/entities/tools/core/component-tool'
import EntityTool from '../../assets/entities/tools/core/entity-tool'
import DeleteTool from '../../assets/entities/tools/core/delete-tool'
import MaterialTool from '../../assets/entities/tools/core/material-tool'
import AssetTool from '../../assets/entities/tools/core/asset-tool'
import GeometryTool from '../../assets/entities/tools/core/geometry-tool'
import SystemTool from '../../assets/entities/tools/core/system-tool'
import PlaceTool from '../../assets/entities/tools/core/place-tool'
import WorldTool from '../../assets/entities/tools/core/world-tool'
import FileTool from '../../assets/entities/tools/core/file-tool'
import SocialTool from '../../assets/entities/tools/core/social-tool'
import DebugTool from '../../assets/entities/tools/core/debug-tool.js'
import CustomTool from '../../assets/entities/tools/core/custom-tool'
import { GRID_SIZE } from '../../config'


export default class ToolboxSystem {
    
    constructor ( world ) {
        this.world = world
    }

    init ( component ) {

    
        return {
           
        }
    }
}