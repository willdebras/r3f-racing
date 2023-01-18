import { DepthOfField, EffectComposer, SSR } from "@react-three/postprocessing"
import { useThree, extend } from '@react-three/fiber'
import * as THREE from 'three'

import { useMemo } from 'react'
// import { RenderPixelatedPass } from 'three-stdlib'
// extend({ RenderPixelatedPass })

// import Motion from './Motion.js'

export default function Effects()
{

    // const { size, scene, camera } = useThree()
    // const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size])

    // const motionRef = useRef()

    // const motionProps = useControls({
    //     frequency: { value: 3, min: 1, max: 20} ,
    //     amplitude: { value: 0.1, min: 0, max: 1 }
    // })

    return <EffectComposer>
        <DepthOfField
            focusDistance={ 0.01}
            focusLength={ 0.2 }
            bokehScale={ 3 }
        />
        {/* <renderPixelatedPass args={[resolution, 10, scene, camera]} /> */}
        {/* <MotionBlur 
            ref={ motionRef }
            { ...motionProps }
            blendFunction={ BlendFunction.DARKEN }
        /> */}
    </EffectComposer>
}