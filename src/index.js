import * as THREE from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js'

import './style.css'

import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene();

// View Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Camera
const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );

// Controls
const controls = new TrackballControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x001100, 0.5)

const uniforms = {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color(0x000099)},
  uMouse: { value: { x: 0.0, y: 0.0} },
  uResolution: { value: { x: 0.0, y: 0.0 } }
}

const geometry = new THREE.TorusKnotGeometry( 100, 3, 100, 13);
const material = new THREE.ShaderMaterial( {
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: uniforms,
  side: THREE.DoubleSide
} );

const mesh = new THREE.Mesh( geometry, material );

// Environment Lights
// const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10 )
// rectLight.position.set(1,10,0);
// rectLight.lookAt(0,0, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 1)


// Staging objects into scene 
scene.add( mesh );
scene.add( ambientLight );
// scene.add( rectLight );

camera.position.z = 1;

/**
 * Animate
 */
const clock = new THREE.Clock();

const move = (evt) => {
  uniforms.uMouse.value.x = (evt.touches) ?
    evt.touches[0].clientX : evt.clientX
  uniforms.uMouse.value.y = (evt.touches) ?
    evt.touches[0].clientY : evt.clientY
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

if ('ontouchstart' in window) {
  document.addEventListener('touchmove', move)
} else {
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (uniforms.uResolution !== undefined) {
      uniforms.uResolution.value.x = window.innerWidth
      uniforms.uResolution.value.y = window.innerHeight
    }
  });
  document.addEventListener('mousemove', move)
}
