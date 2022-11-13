import { Float, Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0, roughness: 0 })
const floor2Material = new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0, roughness: 0 })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: '#ff0000', metalness: 0, roughness: 1 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 })

export function BlockStart({ position=[ 0, 0, 0 ] })
{
    return <group position={ position }>

        <Float floatIntensity={ 0.25 } rotationIntensity={ 0.25 } >
                    <Text 
                        scale={ 4 }
                        font="./bebas-neue-v9-latin-regular.woff"
                        maxWidth={ 0.25 }
                        textAlign="right"
                        position={ [ 0.75, 0.65, -1 ] }
                        rotation-y={ -0.35 }
                    >
                        Marble Race
                        <meshBasicMaterial toneMapped={ false } />
                    </Text>
        </Float>

        <mesh geometry={ boxGeometry } position={ [ 0, -0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } material={ floor1Material } receiveShadow />
    </group>
}

export function BlockSpinner({ position=[ 0, 0, 0 ] })
{

    const obstacle = useRef()
    const [ speed, setSpeed ] = useState(() => (Math.random() + 0.6) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => {

        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)

    })

    return <group position={ position }>
        <mesh geometry={ boxGeometry } position={ [ 0, -0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } material={ floor2Material } receiveShadow />
        <RigidBody ref={ obstacle } type="kinematicPosition" position={ [ 0, 0.3, 0 ] } restitution={ 0.2 } friction={ 0 } >
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 3.5, 0.3, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

export function BlockLimbo({ position=[ 0, 0, 0 ] })
{

    const obstacle = useRef()
    const [ timeOffset, setTimeOffset ] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {

        const time = state.clock.getElapsedTime()
        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({x: position[0], y: y, z: position[2]})

        // console.log(obstacle.current.linvel())

    })

    return <group position={ position }>
        <mesh geometry={ boxGeometry } position={ [ 0, -0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } material={ floor2Material } receiveShadow />
        <RigidBody ref={ obstacle } type="kinematicPosition" position={ [ 0, 0.3, 0 ] } restitution={ 0.2 } friction={ 0 } >
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 3.5, 0.3, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

export function BlockAxe({ position=[ 0, 0, 0 ] })
{

    const obstacle = useRef()
    const [ timeOffset, setTimeOffset ] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {

        const time = state.clock.getElapsedTime() * 2
        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({x: position[0] + x, y: position[1] + 0.75, z: position[2]})

    })

    return <group position={ position }>
        <mesh geometry={ boxGeometry } position={ [ 0, -0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } material={ floor2Material } receiveShadow />
        <RigidBody ref={ obstacle } type="kinematicPosition" position={ [ 0, 0.3, 0 ] } restitution={ 0.2 } friction={ 0 } >
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 1.5, 1.5, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

export function BlockEnd({ position=[ 0, 0, 0 ] })
{

    const borger = useGLTF('./hamburger.glb')
    borger.scene.children.forEach((mesh) => mesh.castShadow = true)

    return <group position={ position }>
        <Text 
            scale={ 4 }
            font="./bebas-neue-v9-latin-regular.woff"
            maxWidth={ 0.25 }
            textAlign="right"
            position={ [ 0, 2.25, 2 ] }
        >
            FINISH
            <meshBasicMaterial toneMapped={ false } />
        </Text>

        <mesh geometry={ boxGeometry } position={ [ 0, 0 , 0 ] } scale={ [ 4, 0.2, 4 ] } material={ floor1Material } receiveShadow />
        <RigidBody type="fixed" colliders="hull" restitution={ 0.2 } friction={ 0 }>
            <primitive object={ borger.scene } scale={0.2} />
        </RigidBody>
    </group>
}

export function Bounds({ length=1 })
{
    return <>
        <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 2.15, 0.75, -(length * 2) + 2 ] } 
                material={ wallMaterial }
                scale={ [ 0.3, 1.5, 4 * length ] }
                castShadow
            />
            <mesh 
                geometry={ boxGeometry } 
                position={ [ -2.15, 0.75, -(length * 2) + 2 ] } 
                material={ wallMaterial }
                scale={ [ 0.3, 1.5, 4 * length ] }
                receiveShadow
            />
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 0, 0.75, -(length * 4) + 2 ] } 
                material={ wallMaterial }
                scale={ [ 4, 1.5, 0.3 ] }
                receiveShadow
            />
        </RigidBody>
    </>
}

export function Level({ count = 5, seed = 0, types = [ BlockSpinner, BlockAxe, BlockLimbo ] }) 
{

    const blocks = useMemo(()=> {
        const blocks = []
        for(let i = 0; i < count; i++) {
            const type = types[ Math.floor(Math.random() * types.length) ]
            blocks.push(type)
        }
        return blocks
    }, [ count, types, seed ])

    return <>

        <BlockStart position={ [ 0, 0, 0 ] } />
        { blocks.map((Block, index) => <Block key={ index } position={ [ 0, 0, - (index + 1) * 4 ] } />) }
        <BlockEnd position={ [ 0, 0, - (count + 1) * 4 ] } />

        <Bounds length={ count + 2 } />
    </>

}