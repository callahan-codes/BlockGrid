// IMPORTS
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js';  // Import OrbitControls

// INITIALIZE VARIABLES
let renderer, scene, camera, controls, mouse = { x: 0, y: 0 };

// RENDERER
renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#scene"), antialias: true, alpha: true}); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// CAMERA
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(-0.5, 0, 8);

// SCENE
scene = new THREE.Scene();

// SPOTLIGHT
const spotlight = new THREE.SpotLight(0xb4fffd, 10, 20, Math.PI / 4, 0.5, 2);
spotlight.position.set(4, 0, 20);
spotlight.target.position.set(0, 0, 0); 
scene.add(spotlight);
scene.add(spotlight.target);

// CUBE
const cubeSize = 1;
const gridSize = 15;
const cubes = [];
const moveSpeeds = []; 

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, 5);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = i * cubeSize - (gridSize * cubeSize) / 2;
        cube.position.y = j * cubeSize - (gridSize * cubeSize) / 2; 

        scene.add(cube);
        cubes.push(cube);

        moveSpeeds.push(Math.random() * 0.0002 + 0.0001);
    }
}

// Initialize OrbitControls
controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); 
controls.enabled = false;
controls.update(); 

// CAMERA MOVEMENT BASED ON MOUSE
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // Normalized -1 to 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalized -1 to 1
}

document.addEventListener('mousemove', onMouseMove, false);

// REZISE
function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// ANIMATION
function animate() {
    requestAnimationFrame(animate);
    resizeCanvasToDisplaySize();

    // Update camera position based on mouse movement
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;  
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;

    // Update OrbitControls to always target the origin
    controls.target.set(0, 0, 0);
    controls.update(); // Important to call update() for controls to take effect

    cubes.forEach((cube, index) => {
        const speed = moveSpeeds[index];
        cube.position.z = Math.sin(Date.now() * speed) * 1.2; 
    });

    renderer.render(scene, camera);
}

requestAnimationFrame(animate);
