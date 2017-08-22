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

    float depth = (1.0 - (abs(0.5 - vUv.y) * 2.5));
    float intense = vUv.y*2.0*abs(0.25 - (vUv.x / 2.0));
    float radial = abs(0.25 - (vUv.x / 2.0));
    float glow = 0.0;
    float luminance = 0.0;
    float PI = 3.141592654;
    float mixedTerrainRed = red / 2.0 + terrainRed* 0.75;
    float mixedTerrainGreen = green / 2.0 + terrainGreen* 0.75;
    float mixedTerrainBlue = blue / 2.0 + terrainBlue* 0.75;
    vec3 newColor = vec3(0,0,0);

    if ( vUv.y >= 0.5 ) {

        luminance += 0.5 + depth * 1.7;
        glow =+ sin(0.5 * depth * depth);
        newColor = vec3( luminance * red, luminance * green, luminance * blue );

        if ( luminance * green > 1.0 ) {
             newColor.x += ((luminance * green) -1.0) / 1.85;
        } 
        if ( luminance * blue > 1.0 ) {
             newColor.x += ((luminance * blue) -1.0) / 1.75;
        } 
        if ( luminance * red > 1.0 ) {
             newColor.y += ((luminance * red) -1.0) / 1.75;
        } 
        if ( luminance * blue > 1.0 ) {
             newColor.y += ((luminance * blue) -1.0) / 1.75;
        } 
        if ( luminance * green > 1.0 ) {
             newColor.z += ((luminance * green) -1.0) / 1.85;
        } 
        if ( luminance * red > 1.0 ) {
             newColor.z += ((luminance * red) -1.0) / 1.75;
        } 

        color = vec4( newColor, 1.0 );
        glow += sin( abs( ((vUv.x * PI) -lightYaw/2.0) ) )/ 2.0;

    } else if ( vUv.y < 0.5 && vUv.y > 0.49 ) {

        luminance += depth * 1.7;
        glow += 0.3 * depth * depth;
        glow += sin( abs( ((vUv.x * PI) -lightYaw/2.0) ) );
        float p = 1.0 - (vUv.y-0.49)*100.0;
        glow = mix( glow, 0.2, p );
        //color = vec4(terrainRed, terrainGreen, terrainBlue, 1.0);
        color = vec4( luminance*mix( luminance*red, mixedTerrainRed, p), luminance*mix( luminance*green, mixedTerrainGreen, p), luminance*mix(luminance*blue, mixedTerrainBlue, p), 1.0 );

    } else {    

        glow = 0.55;
        color = vec4(red / 2.0 + terrainRed * 0.5, green / 2.0 + terrainGreen* 0.5, blue / 2.0 + terrainBlue* 0.5, 1.0);

    }
    
   gl_FragColor = (color * vec4(0.1+1.0*glow, 0.1+1.0*glow, 0.1+1.0*glow, 1.0));

}