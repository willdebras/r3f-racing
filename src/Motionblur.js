import { BlendFunction, Effect } from 'postprocessing'
import { Uniform, Vector3, Matrix4 } from 'three'

const motionBlurVertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vUv = uv;
  }`

const motionBlurFragmentShader = /* glsl */`
  varying vec2 vUv;
  uniform sampler2D tDepth;
  uniform sampler2D tColor;
  uniform mat4 clipToWorldMatrix;
  uniform mat4 worldToClipMatrix;
  uniform mat4 previousWorldToClipMatrix;
  uniform vec3 cameraMove;
  uniform float velocityFactor;
  uniform float delta;
  void main() {
    float zOverW = texture2D(tDepth, vUv).x;
    // clipPosition is the viewport position at this pixel in the range -1 to 1.
    vec4 clipPosition = vec4(vUv.x * 2. - 1., vUv.y * 2. - 1., zOverW * 2. - 1., 1.);
    vec4 worldPosition = clipToWorldMatrix * clipPosition;
    worldPosition /= worldPosition.w;
    vec4 previousWorldPosition = worldPosition;
    previousWorldPosition.xyz -= cameraMove;
    vec4 previousClipPosition = previousWorldToClipMatrix * worldPosition;
    previousClipPosition /= previousClipPosition.w;
    vec4 translatedClipPosition = worldToClipMatrix * previousWorldPosition;
    translatedClipPosition /= translatedClipPosition.w;
    vec2 velocity = velocityFactor * (clipPosition - previousClipPosition).xy / delta * 16.67;
    velocity *= clamp(length(worldPosition.xyz - cameraPosition) / 1000., 0., 1.);
    velocity += velocityFactor * (clipPosition - translatedClipPosition).xy / delta * 16.67;
    vec4 finalColor = vec4(0.);
    vec2 offset = vec2(0.);
    float weight = 0.;
    const int samples = 20;
    for(int i = 0; i < samples; i++) {
      offset = velocity * (float(i) / (float(samples) - 1.) - .5);
      finalColor += texture2D(tColor, vUv + offset);
    }
    finalColor /= float(samples);
    gl_FragColor = vec4(finalColor.rgb, 1.);
    // debug: view velocity values
    // gl_FragColor = vec4(abs(velocity), 0., 1.);
    // debug: view depth buffer
    // gl_FragColor = vec4(vec3(clamp(length(worldPosition.xyz - cameraPosition) / 1000., 0., 1.)), 1.);
  }`

export default class motionBlurEffect extends Effect 
{

  constructor({ tDepth, tColor, velocityFactor, blendFunction = BlendFunction.DARKEN }) {
    super(
        'motionBlurEffect', 
        motionBlurFragmentShader, 
        {
            blendFunction: blendFunction,
            uniforms: new Map([
                [ 'tDepth', new Uniform(tDepth) ],
                [ 'tColor', new Uniform(tColor) ],
                [ 'velocityFactor', new Uniform(velocityFactor) ],
                [ 'velocityFactor', new Uniform(camera.position) ],
            ])
        }
    )
}

update(renderer, inputBuffer, deltaTime)
{
    this.uniforms.get('delta').value += deltaTime
}

  // uniforms: {
  //   tDepth: { value: null },
  //   tColor: { value: null },

  //   velocityFactor: { value: 1 },
  //   delta: { value: 16.67 },

  //   clipToWorldMatrix: { value: new Matrix4() },
  //   worldToClipMatrix: { value: new Matrix4() },
  //   previousWorldToClipMatrix: { value: new Matrix4() },

  //   cameraMove: { value: new Vector3() },
  //   cameraPosition: { value: new Vector3() }
  // },

  // vertexShader: motionBlurVertexShader,
  // fragmentShader: motionBlurFragmentShader
}