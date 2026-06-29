import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_URL = '/models/new-artist-model-balanced.glb'

type LoadState = {
  status: 'loading' | 'ready' | 'error'
  progress: number
  message: string
}

export default function ModelPreviewPage() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [loadState, setLoadState] = useState<LoadState>({
    status: 'loading',
    progress: 0,
    message: 'Preparing renderer',
  })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b0d10)

    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.01, 10000)
    camera.position.set(4, 3, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    host.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.target.set(0, 0, 0)

    scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x23201c, 2.2))

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4)
    keyLight.position.set(4, 7, 5)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x8cc8ff, 1.2)
    fillLight.position.set(-5, 3, 2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffd3a3, 1.5)
    rimLight.position.set(-3, 5, -5)
    scene.add(rimLight)

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4, 96),
      new THREE.MeshStandardMaterial({
        color: 0x15181c,
        roughness: 0.72,
        metalness: 0.08,
      }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const grid = new THREE.GridHelper(8, 24, 0x5f6b78, 0x26303a)
    grid.position.y = 0.003
    scene.add(grid)

    let disposed = false
    let frameId = 0
    let model: THREE.Object3D | null = null

    const loader = new GLTFLoader()
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return

        model = gltf.scene
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            materials.forEach((material) => {
              if ('envMapIntensity' in material) {
                material.envMapIntensity = 0.85
              }
            })
          }
        })

        scene.add(model)

        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxSize = Math.max(size.x, size.y, size.z)
        const scale = maxSize > 0 ? 3.2 / maxSize : 1

        model.position.sub(center)
        model.scale.setScalar(scale)

        const scaledBox = new THREE.Box3().setFromObject(model)
        const scaledSize = scaledBox.getSize(new THREE.Vector3())
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3())
        model.position.sub(scaledCenter)
        model.position.y += scaledSize.y / 2

        ground.scale.setScalar(Math.max(1.1, Math.max(scaledSize.x, scaledSize.z) * 0.52))

        const radius = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) * 0.75
        camera.near = Math.max(0.01, radius / 100)
        camera.far = Math.max(100, radius * 100)
        camera.position.set(radius * 1.6, radius * 1.05, radius * 1.9)
        camera.updateProjectionMatrix()

        controls.target.set(0, scaledSize.y * 0.48, 0)
        controls.maxDistance = radius * 8
        controls.minDistance = radius * 0.28
        controls.update()

        setLoadState({
          status: 'ready',
          progress: 100,
          message: `Model ready: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`,
        })
      },
      (event) => {
        const progress = event.total ? Math.round((event.loaded / event.total) * 100) : 0
        setLoadState({
          status: 'loading',
          progress,
          message: event.total ? `Loading model ${progress}%` : 'Loading model',
        })
      },
      (error) => {
        console.error('[ModelPreviewPage]', error)
        setLoadState({
          status: 'error',
          progress: 0,
          message: 'Model failed to load',
        })
      },
    )

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    animate()

    return () => {
      disposed = true
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(frameId)
      controls.dispose()
      renderer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      host.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0b0d10] text-mist">
      <div className="flex min-h-screen flex-col">
        <header className="flex min-h-16 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-mist/45">GLB Preview</p>
            <h1 className="text-lg font-semibold text-mist sm:text-xl">new-artist-model-balanced.glb</h1>
          </div>
          <a
            href="/"
            className="rounded border border-white/15 px-3 py-2 text-sm text-mist/70 transition hover:border-white/30 hover:text-mist"
          >
            Back
          </a>
        </header>

        <section className="relative min-h-0 flex-1">
          <div ref={hostRef} className="h-[calc(100vh-4rem)] w-full" />

          {loadState.status !== 'ready' ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0b0d10]/78 px-6 text-center">
              <div className="w-full max-w-sm">
                <p className="text-sm text-mist/70">{loadState.message}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#8cc8ff] transition-all duration-300"
                    style={{ width: `${loadState.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="pointer-events-none absolute bottom-4 left-4 rounded border border-white/10 bg-[#0b0d10]/80 px-3 py-2 text-xs text-mist/55 backdrop-blur">
            {loadState.message}
          </div>
        </section>
      </div>
    </main>
  )
}
