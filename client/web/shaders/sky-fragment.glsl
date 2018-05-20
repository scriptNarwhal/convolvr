#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUv;
uniform float time;
uniform float red;
uniform float green;
uniform float blue;
uniform float terrainRed;
uniform float terrainGreen;
uniform float terrainBlue;
uniform float lightYaw;
uniform float lightPitch;
uniform sampler2D starTexture;
vec4 color;

float hash( float n ) {
    return fract(sin(n)*43758.5453);
}

float noise( vec3 x ) {
    // The noise function returns a value in the range -1.0f -> 1.0f
    vec3 p = floor(x);
    vec3 f = fract(x); 
    f       = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
                   mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

void main( void ) {

    float PI = 3.141592654;
    float depth = (1.0 - (abs(0.5 - vUv.y) ));
    float intense = vUv.y*2.0*abs(0.25 - (sin(vUv.x*PI*2.0) / 2.0));
    float glow = 0.2;
    float luminance = 0.0;
    vec3 newColor = vec3(0,0,0);
    vec3 terrainGradient = vec3(0,0,0);

    luminance += min(0.3, depth * 2.7);
    glow += sin(0.45 * depth * depth);
    glow *= 1.5;
    newColor = vec3( luminance * red, luminance * green, luminance * blue );
    // if ( luminance * green > 1.0 ) {
    //      newColor.x += ((luminance * green) -1.0) / 3.4;
    // } 
    // if ( luminance * blue > 1.0 ) {
    //      newColor.x += ((luminance * blue) -1.0) / 3.4;
    // } 
    // if ( luminance * red > 1.0 ) {
    //      newColor.y += ((luminance * red) -1.0) / 3.4;
    // } 
    // if ( luminance * blue > 1.0 ) {
    //      newColor.y += ((luminance * blue) -1.0) / 3.4;
    // } 
    // if ( luminance * green > 1.0 ) {
    //      newColor.z += ((luminance * green) -1.0) / 3.4;
    // } 
    // if ( luminance * red > 1.0 ) {
    //      newColor.z += ((luminance * red) -1.0) / 3.4;
    // } 
    color = vec4( newColor, 1.0 );
    glow += 0.1+sin( PI/2.0+(vUv.x * PI*2.0) -lightYaw )+vUv.y;
    color *= vec4(0.1+2.4*glow, 0.1+2.4*glow, 0.2+2.4*glow, 1.0);
     if ( vUv.y >= 0.5 ) {
        gl_FragColor = (color) +  texture2D(starTexture, fract(vec2(vUv.x*8.0, vUv.y*4.0)));
     } else {    

        float t = 1.0-((0.5-vUv.y)*2.0);
        glow = t/1.25;
        color = vec4( 
            mix(terrainRed* 0.9, (terrainRed+color.x)*t*0.5, t),
            mix(terrainGreen* 0.9, (terrainGreen+color.y)*t*0.5, t),
            mix(terrainBlue* 0.9, (terrainBlue+color.z)*t*0.5, t), 
            1.0
        );
        gl_FragColor = (color * vec4(glow, glow, glow, 1.0));
    }

}