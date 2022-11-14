import { OrbitControls, useGLTF, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { BallCollider, CuboidCollider, RigidBody, useRapier } from "@react-three/rapier"
import { useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { Group } from "three"
import useGame from "./stores/useGame.js"

export default function Player()
{

    const car = useGLTF('./car.gltf')
    const carbody = useRef()

    const body = useRef()
    const [ subscribeToKeys, getKeys ] = useKeyboardControls()

    // need native rapier to get the raycasting working
    const { rapier, world } = useRapier()
    // this world lets us raycast to any object in world, not just ground
    const rapierWorld = world.raw()

    const [smoothedCameraPosition ] = useState(()=> new THREE.Vector3(12, 12, 12))
    const [ smoothedCameraTarget ] = useState(()=> new THREE.Vector3())
    const [ smoothedCarPosition ] = useState(()=> new THREE.Vector3())
    
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    const jump = () => {
        // origin of body when we make the cast
        const origin = body.current.translation()
        // subtracting half of size of sphere
        origin.y -= 0.31
        const direction = {x: 0, y: -1, z: 0}
        const ray = new rapier.Ray(origin, direction)
        // true here considers everything solid so counts as hit when cast from floor
        const hit = rapierWorld.castRay(ray, 10, true)
        // time of impact

        if(hit.toi < 0.15) {
            body.current.applyImpulse({x: 0, y: 0.5, z: 0})
        }
    }

    const reset = () => {
        // change translation, linear velocity and angular velocity
        body.current.setTranslation({x: 0, y: 1, z: 0})
        body.current.setLinvel({x: 0, y: 0, z: 0})
        body.current.setAngvel({x: 0, y: 0, z: 0})
    }

    useEffect(()=> {

        // subscribe to our store
        // need to provide selector in store and function to call when that selector changes
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (phase) => {
                if(phase == 'ready') {
                    reset()
                }
            }
        )

        const unsubscribeJump = subscribeToKeys(
            (state)=> state.jump,
            (value)=> {
                if(value) {
                    jump()
                }
            }
        )

        const unsubscribeAny = subscribeToKeys(
            ()=> {
                start()
            }
        )

        // need to destroy this when component recreated otherwise we might double click on rerenders
        // returns in useEffect trigger on destroy of component
        return ()=> {
            unsubscribeReset()
            unsubscribeJump()
            unsubscribeAny()
        }

    }, [])

    useFrame((state, delta)=> {

        // handle controls
        const { forward, backward, leftward, rightward, drift } = getKeys()

        const steer = {dir: 0, amt: 0}
        const impulseCartesian = {x: 0, y:0, z:0}

        const impulseStrength = 30 * delta
        const torqueStrength = 30 * delta

        const directionCar = new THREE.Vector3()
        carbody.current.getWorldDirection(directionCar)

        if(forward) {
            impulseCartesian.x += directionCar.x * impulseStrength
            impulseCartesian.z += directionCar.z * impulseStrength
        }
        if(rightward) {
            steer.dir = 1
        }
        if(backward) {
            impulseCartesian.x -= directionCar.x * impulseStrength
            impulseCartesian.z -= directionCar.z * impulseStrength
        }
        if(leftward) {
            steer.dir = -1
        }

        let driftFactor = 1

        if(drift) {
            driftFactor = 2.5
            impulseCartesian.x = impulseCartesian.x * 0.6
            impulseCartesian.z = impulseCartesian.z * 0.6
        }

        
        body.current.applyImpulse(impulseCartesian)
        //body.current.applyTorqueImpulse(impulseCartesian)

        steer.amt = 80 * steer.dir

        const velCurrent = body.current.linvel()

        smoothedCarPosition.lerp(impulseCartesian, 5 * delta)

        // car body
        const bodyPosition = body.current.translation()
        const carPosition = new THREE.Vector3()
        carPosition.copy(bodyPosition)

        carbody.current.position.set(carPosition.x, carPosition.y - 0.7, carPosition.z)
        carbody.current.rotation.set(0, carbody.current.rotation.y - (steer.dir * delta * driftFactor) , 0)

        // camera 

        // const cameraPosition = new THREE.Vector3()
        // const cameraOffset = new THREE.Vector3(-0, 5.0, 5.0)
        // const kartPosition = new THREE.Vector3()
        // carbody.current.getWorldPosition(kartPosition)

        // cameraPosition.copy(bodyPosition).add(cameraOffset)
        // // cameraPosition.z -= 4
        // // cameraPosition.x -= 4
        // // cameraPosition.y = 6
        // // cameraPosition -= directionCar

        // const cameraTarget = new THREE.Vector3()
        // cameraTarget.copy(bodyPosition)
        // cameraTarget.y += 0.25

        // //lerp camera and target so they fall a little behind and have a smooth update
        // smoothedCameraPosition.lerp(cameraPosition, delta)
        // smoothedCameraTarget.lerp(cameraTarget, delta)

        // state.camera.position.copy(smoothedCameraPosition)
        // state.camera.lookAt(cameraTarget)
        // state.camera.position.copy(cameraPosition)

        // phases
        // check if we reached end
        // if(bodyPosition.z < - (blocksCount * 4 + 2)) {
        //     end()
        // }
        // // check if we fell off map
        // if(bodyPosition.y < - 4) {
        //     restart()
        // }

    })

    return <>
        <OrbitControls />d
        <group>
            <RigidBody 
                ref={ body } 
                colliders={false}
                position={ [ 0, 1, 0 ] }
                linearDamping={ 1 }
                angularDamping={ 4 }
            >
                <BallCollider args={[0.6]} position={[0, 0, 0]} restitution={0.2} friction={16} mass={0.5} />
                <mesh castShadow>
                    <boxGeometry args={ [ 0, 0, 0 ] } />
                    <meshStandardMaterial flatShading color="mediumpurple" />
                </mesh>
            </RigidBody>
            <primitive ref={ carbody } object={ car.scene } rotation={[0, 0, 0]} />
        </group>
    </>
}