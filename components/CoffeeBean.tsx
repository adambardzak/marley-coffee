'use client'

import * as THREE from 'three'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const CoffeeBeanModel = dynamic(
  () => import('./CoffeeBeanModel'),
  { 
    ssr: false,
    loading: () => null
  }
)

export function CoffeeBean(props: React.JSX.IntrinsicElements['group']) {
  return (
    <Suspense fallback={null}>
      <CoffeeBeanModel {...props} />
    </Suspense>
  )
}