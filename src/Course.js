import { useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshStandardMaterial({ color: 'lightgreen', metalness: 0, roughness: 0 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 })

// TODO slow on collision to non road ground

export default function Course() {

    const course = useGLTF('./race1.glb')

    return <>
        <RigidBody type="fixed" colliders="trimesh" restitution={ 0.2 } friction={ 15 } linearDamping={ 1 }>
            <primitive object={course.scene} scale={7} position={[25, 0, 25]}/>
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 0, -1, 0 ] } 
                material={ floor1Material }
                scale={ [ 200, 1, 200 ] }
                castShadow
            />
            <CuboidCollider args={[4.5, 2.7, 11]} position={[17, 1, 38]} restitution={0.2} friction={16} mass={0.5} />
            <CuboidCollider args={[100, 1, 100]} position={[0, -1, 0]} restitution={0} friction={16} mass={50} />
        </RigidBody>
    </>

}