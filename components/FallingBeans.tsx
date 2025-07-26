'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CoffeeBean } from './CoffeeBean'

interface CoffeeBeanProps {
  position: [number, number, number]
  finalPosition: [number, number, number]
  scale: number
  rotationSpeed: [number, number, number]
  isTriggered: boolean
  delay: number
}

function AnimatedCoffeeBean({ position, finalPosition, scale, rotationSpeed, isTriggered, delay }: CoffeeBeanProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hasStarted, setHasStarted] = useState(false)
  const [isSettled, setIsSettled] = useState(false)
  const startTime = useRef<number | null>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    // Wait for trigger and delay
    if (isTriggered && !hasStarted && state.clock.elapsedTime > delay) {
      setHasStarted(true)
      startTime.current = state.clock.elapsedTime
    }
    
    if (!hasStarted || isSettled) return
    
    const elapsed = state.clock.elapsedTime - (startTime.current || 0)
    
    // Throw animation with realistic physics (2.5 seconds)
    if (elapsed < 2.5) {
      const progress = elapsed / 2.5
      
      const horizontalProgress = 1 - Math.pow(1 - progress, 2)
      const verticalProgress = progress
      
      // Calculate trajectory
      groupRef.current.position.x = position[0] + (finalPosition[0] - position[0]) * horizontalProgress
      groupRef.current.position.z = position[2] + (finalPosition[2] - position[2]) * horizontalProgress
      
      // Parabolic arc for Y axis (gravity effect)
      const initialVelocityY = 3
      const gravity = 15
      const yTrajectory = position[1] + (initialVelocityY * verticalProgress * 2.5) - (0.5 * gravity * Math.pow(verticalProgress * 2.5, 2))
      groupRef.current.position.y = Math.max(yTrajectory, finalPosition[1])
      
      // Tumbling rotation as beans fly through air
      groupRef.current.rotation.x += rotationSpeed[0] * 4
      groupRef.current.rotation.y += rotationSpeed[1] * 2
      groupRef.current.rotation.z += rotationSpeed[2] * 4
      
      // Settle when close to ground
      if (groupRef.current.position.y <= finalPosition[1] + 0.1) {
        setIsSettled(true)
      }
    } else {
      // Final settled position
      groupRef.current.position.set(...finalPosition)
      setIsSettled(true)
    }
  })
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <CoffeeBean />
    </group>
  )
}

interface BeanData {
  position: [number, number, number]
  finalPosition: [number, number, number]
  scale: number
  rotationSpeed: [number, number, number]
  delay: number
}

function SpilledCoffeeBeans({ isTriggered }: { isTriggered: boolean }) {
  const beans = useMemo((): BeanData[] => {
    const beanData: BeanData[] = []
    
    // Use fewer beans (8-12) since GLTF models are more detailed
    for (let i = 0; i < 20; i++) {
      // Create spill pattern as if thrown from top of screen downward
      const spreadAngle = (Math.random() - 0.5) * Math.PI * 0.6
      const throwDistance = 6 + Math.random() * 25
      const finalX = Math.sin(spreadAngle) * throwDistance
      const finalZ = Math.cos(spreadAngle) * throwDistance * 0.7
      
      beanData.push({
        // Start positions (from top of screen, slightly scattered)
        position: [
          (Math.random() - 0.5) * 4,
          8,
          -15 + Math.random() * 3
        ] as [number, number, number],
        // Final scattered positions (toward bottom/front)
        finalPosition: [
          finalX + (Math.random() - 0.5) * 2,
          0 + Math.random() * 0.2,
          finalZ + (Math.random() - 0.5) * 2
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.2, // Smaller scale for GLTF models
        rotationSpeed: [
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.08
        ] as [number, number, number],
        delay: Math.random() * 0.3
      })
    }
    return beanData
  }, [])
  
  return (
    <>
      {beans.map((bean, index) => (
        <AnimatedCoffeeBean
          key={index}
          position={bean.position}
          finalPosition={bean.finalPosition}
          scale={bean.scale}
          rotationSpeed={bean.rotationSpeed}
          isTriggered={isTriggered}
          delay={bean.delay}
        />
      ))}
    </>
  )
}

export default function FallingBeans() {
  const [isTriggered, setIsTriggered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTriggered) {
            setIsTriggered(true)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [isTriggered])
  
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 20, 8], fov: 50, up: [0, 1, 0] }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[0, 30, 5]} 
          intensity={1.5} 
          color="#FFF8DC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[10, 20, -5]} 
          intensity={0.6} 
          color="#D4A574" 
        />
        <pointLight 
          position={[0, 15, 0]} 
          intensity={0.8} 
          color="#DAA520"
        />
        
        {/* Virtual table surface */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshPhongMaterial color="#8B6F47" transparent opacity={0.1} />
        </mesh>
        
        <SpilledCoffeeBeans isTriggered={isTriggered} />
      </Canvas>
    </div>
  )
}