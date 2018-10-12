import THREE from "three";

export let rgb = ( r: number, g: number, b: number ) => { // because I never remeber to quote that rofl..
    return `rgb(${r}, ${g}, ${b})`
}

export let rgba = ( r: number, g: number, b: number, a: number ) => { 
    return `rgba(${r}, ${g}, ${b}, ${a})`
}

export type Flags = { [key: string]: boolean }

export type AnyObject = { [_:string]: any }


export const zeroZeroZero = new THREE.Vector3(0,0,0)