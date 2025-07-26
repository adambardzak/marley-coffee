'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CoffeeBean } from './CoffeeBean'

interface CoffeeBeanProps {
  position: [number, number, number]
  scale: number
  rotationSpeed: [number, number, number]
  isTriggered: boolean
  delay: number
  fallSpeed: number
}

function AnimatedCoffeeBean({ position, scale, rotationSpeed, isTriggered, delay, fallSpeed }: CoffeeBeanProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const [hasStarted, setHasStarted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const startTime = useRef<number | null>(null)
  
  useFrame((state) => {
    if (!groupRef.current || !isVisible) return
    
    // Wait for trigger and delay
    if (isTriggered && !hasStarted && state.clock.elapsedTime > delay) {
      setHasStarted(true)
      startTime.current = state.clock.elapsedTime
    }
    
    if (!hasStarted) return
    
    const elapsed = state.clock.elapsedTime - (startTime.current || 0)
    
    // Simple linear falling (no gravity physics)
    const fallDistance = elapsed * fallSpeed * 3
    
    // Update position - fall down vertically only
    groupRef.current.position.y = position[1] - fallDistance
    
    // Keep horizontal position stable with minimal drift
    groupRef.current.position.x = position[0] + Math.sin(elapsed * 0.3) * 0.1
    groupRef.current.position.z = position[2] // Keep Z position fixed
    
    // Gentle rotation for tumbling effect
    groupRef.current.rotation.x += rotationSpeed[0]
    groupRef.current.rotation.y += rotationSpeed[1]
    groupRef.current.rotation.z += rotationSpeed[2]
    
    // Hide bean when it falls too far down
    if (groupRef.current.position.y < -20) {
      setIsVisible(false)
    }
  })
  
  if (!isVisible) return null
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <CoffeeBean />
    </group>
  )
}

interface BeanData {
  position: [number, number, number]
  scale: number
  rotationSpeed: [number, number, number]
  delay: number
  fallSpeed: number
}

function SpilledCoffeeBeans({ isTriggered }: { isTriggered: boolean }) {
  const beans = useMemo((): BeanData[] => {
    const beanData: BeanData[] = []
    
    // Více zrn ale menších, rozložených ve 2D prostoru
    for (let i = 0; i < 60; i++) {
      beanData.push({
        // Start positions - spread across screen width, minimal depth variation
        position: [
          (Math.random() - 0.5) * 25, // Horizontální rozptyl
          15 + Math.random() * 5,     // Různé výšky startu
          -5 + Math.random() * 2      // Minimální rozptyl v hloubce
        ] as [number, number, number],
        scale: 0.2 + Math.random() * 0.08, // Ještě menší zrna (0.1-0.18)
        rotationSpeed: [
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.08
        ] as [number, number, number],
        delay: Math.random() * 2, // Větší rozptyl v časování
        fallSpeed: 2.5 + Math.random() * 2 // Rychlejší pád
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
          scale={bean.scale}
          rotationSpeed={bean.rotationSpeed}
          isTriggered={isTriggered}
          delay={bean.delay}
          fallSpeed={bean.fallSpeed}
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
        threshold: 0.1, // Spustí se když je viditelných 10% sekce
        rootMargin: '0px 0px -20% 0px' // Spustí se až když sekce vejde více do viewportu
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
        camera={{ position: [0, 0, 15], fov: 60, up: [0, 1, 0] }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.8} color="#FFFFFF" />
        <directionalLight 
          position={[0, 30, 10]} 
          intensity={2.2} 
          color="#FFFACD"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={1.2} 
          color="#F5DEB3" 
        />
        <directionalLight 
          position={[-10, 15, 5]} 
          intensity={0.8} 
          color="#FFE4B5" 
        />
        <pointLight 
          position={[0, 10, 8]} 
          intensity={1.5} 
          color="#FFEFD5"
        />
        
        <SpilledCoffeeBeans isTriggered={isTriggered} />
      </Canvas>
    </div>
  )
}