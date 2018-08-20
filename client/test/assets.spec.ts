import AssetsSystem from '../src/systems/core/assets'
import avatar from '../src/assets/entities/avatars/avatar'
import column from '../src/assets/components/misc/column-1'
import Convolvr from '../src/world/world';

let system;
let avatarMock;
let worldMock = { systems: {fbx: null, obj: null } }

describe("AssetsSystem", ()=>{
    beforeEach(()=>{
        system = new AssetsSystem(worldMock as Convolvr);
    });

    it('should populate builtin entities', () => {
        expect(system.entitiesByName["default-avatar"]).toBe(avatar)
    });

    it('should populate builtin components', () => {
        expect(system.componentsByName["column"]).toBe(column)
    });

    it('should be able to tell if an entity is loaded', ()=>{
        expect(system.isEntityLoaded("default-avatar")).toBe(true);
        expect(system.isEntityLoaded("panel")).toBe(true);
    })
});