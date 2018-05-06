import { BufferSubdivisionModifier } from './threejs/plugins/BufferSubdivisionModifier';
import { CSG } from './threejs/plugins/csg';
import { FBXLoader } from './threejs/plugins/FBXLoader';
import { GPUParticleSystem } from './threejs/plugins/GPUParticleSystem';
import { ThreeBSB } from './threejs/plugins/ThreeCSG';
import { BloomPass } from './threejs/postprocessing/BloomPass';
import { EffectComposer } from './threejs/postprocessing/EffectComposer';
import { MaskPass } from './threejs/postprocessing/MaskPass';
import { RenderPass } from './threejs/postprocessing/RenderPass';
import { VREffectComposer } from './threejs/postprocessing/VREffect-Composer';
import { ConvolutionShader } from './threejs/shaders/ConvolutionShader';
import { CopyShader } from './threejs/shaders/CopyShader';
import { FXAAShader } from './threejs/shaders/FXAAShader';
import { ThreeOctree } from './threejs/threeoctree';
import { VRControls } from 'three';



export default class THREEJSPluginLoader {
    constructor (THREE: any) {
        (BufferSubdivisionModifier as any)(THREE);
        (CSG as any)(THREE);
        (FBXLoader as any)(THREE);
        (GPUParticleSystem as any)(THREE);
        (ThreeBSB as any)(THREE);
        (BloomPass as any)(THREE);
        (EffectComposer as any)(THREE);
        (MaskPass as any)(THREE);
        (RenderPass as any)(THREE);
        (VREffectComposer as any)(THREE);

        (ConvolutionShader as any)(THREE);
        (CopyShader as any)(THREE);
        (FXAAShader as any)(THREE);
        (ThreeOctree as any)(THREE);
    }
}