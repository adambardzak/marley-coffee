import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh
    Object_3: THREE.Mesh
    Object_4: THREE.Mesh
    Object_5: THREE.Mesh
  }
  materials: {
    Coffee_DM_01_01: THREE.MeshStandardMaterial
  }
}

export default function CoffeeBeanModel(props: React.JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/coffee_bean/scene.gltf') as unknown as GLTFResult
  
  // Create coffee-colored material
  const coffeeMaterial = new THREE.MeshStandardMaterial({
    color: '#6B4423', // Rich coffee brown
    roughness: 0.8,
    metalness: 0.1,
    // Add some variation for realism
    map: materials?.Coffee_DM_01_01?.map || null,
    normalMap: materials?.Coffee_DM_01_01?.normalMap || null,
  })
  
  return (
    <group {...props} dispose={null} scale={[2, 2, 2]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh 
          geometry={nodes?.Object_2?.geometry} 
          material={coffeeMaterial}
          castShadow
          receiveShadow
        />
        <mesh 
          geometry={nodes?.Object_3?.geometry} 
          material={coffeeMaterial}
          castShadow
          receiveShadow
        />
        <mesh 
          geometry={nodes?.Object_4?.geometry} 
          material={coffeeMaterial}
          castShadow
          receiveShadow
        />
        <mesh 
          geometry={nodes?.Object_5?.geometry} 
          material={coffeeMaterial}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}

useGLTF.preload('/coffee_bean/scene.gltf')