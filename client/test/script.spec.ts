import ScriptSystem from '../src/systems/logic/script'
import Convolvr from '../src/world/world';
import Component from '../src/core/component';

let system;
let worldMock = { systems: {fbx: null, obj: null } } as Convolvr

const mockEntityId = 0,
    mockComponentIndex = 0,
    mockVoxelCoords = [0,0,0],
    mockEnvPath = ["0.0.0", 0, 0];

let entityMock = {
        id: mockEntityId,
        voxel: mockVoxelCoords
    },
    componentMock = {
        entity: entityMock,
        index: mockComponentIndex
    } as Component;
 
let postMessageMock = (message) => {
        
}

let workerMock = {
    postMessage: postMessageMock
} as Worker

describe("ScriptSystem", ()=>{
    beforeEach(()=>{
        system = new ScriptSystem(worldMock, workerMock);
        componentMock.state = { 
            script: system.init(componentMock) 
        };
    });

    it('should create an env for the component', () => {
        expect(system.envComponents[mockEnvPath.join(",")]).not.toBe(null);
    })

    it('should should add 2 + 2', () => {
        let getReturnValue = (value) => {
            console.log("2 + 2 = ", value)
        }

        componentMock.state.script.eval("2 + 2", getReturnValue)

        spyOn(componentMock.state.script, "getReturnValue")
        setTimeout(()=>{
            expect(getReturnValue).toHaveBeenCalledWith(4)
        },500)
    });

});