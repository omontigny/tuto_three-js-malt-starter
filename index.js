/**
 * Our canvas html element
 */
const canvas = document.querySelector('#canvas')

/**
 * Our Webgl renderer, an object that will draw everything in our canvas
 * https://threejs.org/docs/?q=rend#api/en/renderers/WebGLRenderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 * This is our scene, we'll add any object
 * https://threejs.org/docs/?q=scene#api/en/scenes/Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xD7F9F1)

/**
 * Axes Helper
 * https://threejs.org/docs/?q=Axesh#api/en/helpers/AxesHelper
 */
 const axesHelper = new THREE.AxesHelper(3)
 scene.add(axesHelper)

/**
 * Our Perspective camera, this is the point of view that we'll have
 * of our scene.
 * A perscpective camera is mimicing the human eyes so something far we'll
 * look smaller than something close
 * https://threejs.org/docs/?q=pers#api/en/cameras/PerspectiveCamera
 */
const FOV = 60
// new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, nearPlane, farPlane)
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 5
camera.position.y = 3
camera.position.z = 5
camera.lookAt(0,0,0)
scene.add(camera)


const textureLoader = new THREE.TextureLoader()
const boxTexture = textureLoader.load('./texture.png')
const matcapTexture = textureLoader.load('./matcap.png')


/**
 * Create a BoxGeometry
 # geometry = shape (array of numbers)
 # material = color of the shape
 # mesh is a combinaison of geometrie and materials
 * https://threejs.org/docs/?q=box#api/en/geometries/BoxGeometry
 * with a Basic material
 * https://threejs.org/docs/?q=mesh#api/en/materials/MeshBasicMaterial
 */
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x92140C, map: boxTexture })
// const box = new THREE.Mesh(boxGeometry, boxMaterial)
// box.position.x = -2;
// box.rotation.y = THREE.MathUtils.degToRad(45);

// scene.add(box);


// const conegeometry = new THREE.ConeGeometry( 1, 3, 32 );
// const conematerial = new THREE.MeshMatcapMaterial( {color: 0xE29578, matcap: matcapTexture} );
// const cone = new THREE.Mesh( conegeometry, conematerial );
// cone.position.x = 2;
// scene.add( cone );

// const light = new THREE.PointLight( 0xffffff, 1.5, 100 )
// light.position.set(0, 5, 5)
// scene.add(light)

const numberOfLines = 10
const numberOfColumns = 10

const spheregeometry = new THREE.SphereGeometry( 0.5, 32, 32 );

const spheres = []

for (let i = 0 ; i < numberOfLines; i++) {
  for (let y = 0 ; y < numberOfColumns; y++) {
  const spherematerial = new THREE.MeshMatcapMaterial( {color: 0x006D77, matcap: matcapTexture, transparent: true} );

  const sphere = new THREE.Mesh( spheregeometry, spherematerial );

  sphere.position.x = i - numberOfLines / 2 + 0.5
  sphere.position.z = y - numberOfColumns / 2 + 0.5
  scene.add(sphere)
  spheres.push(sphere)
  }
}

const controls = new THREE.OrbitControls( camera, canvas );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(10,10);

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


window.addEventListener('mousemove', onMouseMove, false)


const draw = function(now) { //current time
  // box.rotation.y += THREE.MathUtils.degToRad(1);
  // box.rotation.x += THREE.MathUtils.degToRad(1);

  // box.position.y = Math.sin(now / 1000);

  // light.position.x = 4 + Math.sin(now / 1000);
  // light.intensity = 0.5 + Math.sin(now / 1000);
 for (let i =0 ; i < spheres.length; i++) {
  const sphere = spheres[i]
  const waveXPosition = Math.sin(now / 1000 + sphere.position.x * 100)
  const waveZPosition = Math.sin(now / 1000 + sphere.position.z * 50)

  sphere.position.y = waveXPosition * waveZPosition
    //spheres[i].position.y = Math.sin(now / 1000)
 }

  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( scene.children );

  for ( let i = 0; i < intersects.length; i ++ ) {

   // intersects[ i ].object.material.color.set( 0xff0000 );
    intersects[ i ].object.material.opacity = 0;

  }

  renderer.render(scene, camera)
  window.requestAnimationFrame(draw);
}

draw()
