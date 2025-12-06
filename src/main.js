import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

/**
 * Debug UI
 */
const gui = new GUI()

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xaad3ff) // cielo claro estilo cartoon

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 5)
scene.add(directionalLight)

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()

/**
 * Load GLB Model
 */
gltfLoader.load(
    'models/paisajesemestral.glb',
    (gltf) =>
    {
        const model = gltf.scene

        model.position.set(0, 0, 0)
        // Si tu modelo sale muy grande o pequeño, ajusta este valor:
        // model.scale.set(0.5, 0.5, 0.5)

        scene.add(model)

        console.log('Modelo cargado correctamente')

        // Debug: panel para mover el modelo
        const folder = gui.addFolder('Modelo')
        folder.add(model.position, 'x').min(-5).max(5).step(0.01)
        folder.add(model.position, 'y').min(-5).max(5).step(0.01)
        folder.add(model.position, 'z').min(-5).max(5).step(0.01)
    },
    undefined,
    (error) =>
    {
        console.error('Error al cargar el GLB:', error)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)

camera.position.set(4, 3, 5) // vista perfecta del paisaje
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Actualizar controles
    controls.update()

    // Renderizar
    renderer.render(scene, camera)

    // Llamar al siguiente frame
    window.requestAnimationFrame(tick)
}

tick()