import { CuboidCollider, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshStandardMaterial({ color: 'lightgreen', metalness: 0, roughness: 0 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 })

export default function Sandbox()
{
    return <group>
        <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 0, -0.1, 0 ] } 
                scale={ [ 100, 0.2, 100 ] } 
                material={ floor1Material } 
                receiveShadow 
            />
        </RigidBody>
        <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 0, 1.5, -50 ] } 
                material={ wallMaterial }
                scale={ [ 100, 3, 1 ] }
                castShadow
            />
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 0, 1.5, 50 ] } 
                material={ wallMaterial }
                scale={ [ 100, 3, 1 ] }
                castShadow
            />
            <mesh 
                geometry={ boxGeometry } 
                position={ [ -50, 1.5, 0 ] } 
                material={ wallMaterial }
                scale={ [ 1, 3, 100 ] }
                castShadow
            />
            <mesh 
                geometry={ boxGeometry } 
                position={ [ 50, 1.5, 0 ] } 
                material={ wallMaterial }
                scale={ [ 1, 3, 100 ] }
                castShadow
            />
        </RigidBody>
        <CuboidCollider 
            args={ [ 100, 0.2, 100 ] }
            position={ [ 0, -0.1, 0 ] }
            restitution={ 0.2 }
            friction={ 1 }
        />
    </group>
}