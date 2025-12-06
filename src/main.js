import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

/**
 * Debug UI
 */
const gui = new GUI()
const debugObject = {}

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xaad3ff) // Cielo
scene.fog = new THREE.Fog(0xaad3ff, 10, 40) // Niebla lejana

/**
 * Lights
 */
// Luz ambiente tipo cielo/suelo
const hemiLight = new THREE.HemisphereLight(0xaad3ff, 0x225522, 0.6)
scene.add(hemiLight)

// Luz direccional tipo sol
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
directionalLight.position.set(8, 15, 5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 50
scene.add(directionalLight)

// GUI para luces
const lightFolder = gui.addFolder('Luces')
lightFolder.add(hemiLight, 'intensity').min(0).max(2).step(0.01).name('Hemi')
lightFolder.add(directionalLight, 'intensity').min(0).max(3).step(0.01).name('Sol')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    60,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.set(8, 6, 10) // un poco más lejos para ver todo
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.SRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(0, 1.5, 0) // apunta al centro aproximado de la casa

// Auto-rotación opcional
controls.autoRotate = true
controls.autoRotateSpeed = 0.08

const controlsFolder = gui.addFolder('Controls')
controlsFolder.add(controls, 'autoRotate').name('Auto rotar')
controlsFolder.add(controls, 'autoRotateSpeed').min(0).max(5).step(0.1).name('Velocidad')

/**
 * Resize
 */
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
 * Loaders
 */
const gltfLoader = new GLTFLoader()

/**
 * Cargar modelo GLB
 */
gltfLoader.load(
    '/models/paisajesemestral.glb', // recuerda que está en public/models
    (gltf) =>
    {
        const model = gltf.scene

        model.position.set(0, 0, 0)

        // Activar sombras en todos los meshes del glb
        model.traverse((child) =>
        {
            if (child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
                // Por si acaso, usamos solo la cara frontal
                if (child.material) child.material.side = THREE.FrontSide
            }
        })

        scene.add(model)
        console.log('Modelo cargado correctamente')

        // GUI para mover el modelo (debug)
        const modelFolder = gui.addFolder('Modelo')
        modelFolder.add(model.position, 'x').min(-5).max(5).step(0.01)
        modelFolder.add(model.position, 'y').min(-5).max(5).step(0.01)
        modelFolder.add(model.position, 'z').min(-5).max(5).step(0.01)
    },
    undefined,
    (error) =>
    {
        console.error('Error al cargar el GLB:', error)
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Actualizar controles (incluye autoRotate)
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Siguiente frame
    window.requestAnimationFrame(tick)
}

tick()