import { useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"

import vertexShader from './shaders/ketchup/vertexShader.js'
import fragmentShader from './shaders/ketchup/fragmentShader.js'

export default function Trails() {

    const ketchup = useRef()
    const mustard = useRef()

    const uniformsMustard = useMemo(
        () => ({
        iTime: {
            value: 0.0,
        },
        iResolution: {
            value: [7000, 4000],
        },
        trailType: {
            value: 1.0
        },
        }), []
    );

    const uniformsKetchup = useMemo(
        () => ({
        iTime: {
            value: 0.0,
        },
        iResolution: {
            value: [7000, 4000],
        },
        trailType: {
            value: 0.0
        },
        }), []
    );

    useFrame((state, delta)=> { // two args which is the state and the change in time
        ketchup.current.material.uniforms.iTime.value += delta
        mustard.current.material.uniforms.iTime.value += delta
    })

    return <>
        <mesh ref={ketchup} position={[-0.6, 0.5, -3.5]} scale={0.2} rotation-x={Math.PI * 0.5} rotation-y={Math.PI * 0.5}>
            <cylinderGeometry args={[0.5, 0.5, 8, 64, 64, false]} />
            {/* <meshStandardMaterial color='blue' /> */}
                <shaderMaterial
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniformsKetchup}
                    transparent
                />
        </mesh>
        <mesh ref={mustard} position={[0.5, 0.5, -3.5]} scale={0.2} rotation-x={Math.PI * 0.5} rotation-y={Math.PI * 0.5}>
            <cylinderGeometry args={[0.5, 0.5, 8, 64, 64, false]} />
            {/* <meshStandardMaterial color='blue' /> */}
                <shaderMaterial
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniformsMustard}
                    transparent
                />
        </mesh>
    </>

}