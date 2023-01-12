const vertexShader = /* glsl */`

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColour;

uniform float iTime;
uniform float waveCount;
uniform float ketchupLength;

uniform float trailType;


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}


void main() {	
  vec3 localSpacePosition = position;

  // take total time and and get a clamp between 0 and 5 to get the number of ketchup waves
  float waveCount = clamp((iTime / 1.5), 0.0, 3.0);

  float t = sin((localSpacePosition.y) * waveCount + iTime * 10.0);
  t = remap(t, -1.0, 1.0, 0.0, 0.3);
  localSpacePosition += t;
  
  // can consider trying to play with the sin based on the normals of the localspace
  // localSpacePosition += abs(normal) * t;

  // make the ketchup grow in length from start and clamp at normal mesh length
  float ketchupLength = clamp((iTime / 1.5), 0.0, 1.0);
  localSpacePosition.y *= ketchupLength;
  localSpacePosition.y += 5.0;
  localSpacePosition.y -= ketchupLength * 5.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.0);
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(localSpacePosition, 1.0)).xyz;

  // could toy with colors based on t (the weird sine position)
  // vColour = mix(
  //     vec3(1.0, 0.55, 0.0),
  //     vec3(0.9, 0.0, 0.0),
  //     smoothstep(0.0, 0.3, t));

  // default ketchup, if specified use mustard rgb
  if(trailType == 1.0) {
    vColour=vec3(1.0,0.859,0.345);
  } else {
    vColour=vec3(0.8, 0.1, 0.1);
  }
}
`

export default vertexShader
