import { DepthOfField, EffectComposer, SSR } from "@react-three/postprocessing"

// import Motion from './Motion.js'

export default function Effects()
{


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
        {/* <MotionBlur 
            ref={ motionRef }
            { ...motionProps }
            blendFunction={ BlendFunction.DARKEN }
        /> */}
    </EffectComposer>
}