/*
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// loading 3D models loader
const loader = new GLTFLoader();
const carPlayerPath = '../car-old-school.glb';
const raceTrackPath = '../race-track-new.glb';

// render
const renderer = new THREE.WebGLRenderer(); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xeeeeee );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// birds eye view
const birdsRenderer = new THREE.WebGLRenderer(); 
birdsRenderer.setSize( window.innerWidth/5, window.innerHeight/5 );
birdsRenderer.setClearColor( 0xeeeeee );
document.body.appendChild( birdsRenderer.domElement );
birdsRenderer.shadowMap.enabled = true;
birdsRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

// camera
const camera = new THREE.PerspectiveCamera( 45, 
	window.innerWidth / window.innerHeight, 
	0.1, 1000 ); 
camera.position.set( 10, 10, 10 );
const cameraDistance = 20; // for third person view
const firstPersonDistance = 0.3;

// scene
const scene = new THREE.Scene();

// orbit controller
var controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );

// axes helper
scene.add(new THREE.AxesHelper(500));

// ambient lighting
const ambientLight = new THREE.AmbientLight( 0xeeeeee, 0.1 ); // soft white light
scene.add( ambientLight );

// hemisphere lighting
var hemiLight = new THREE.HemisphereLight( 0x87CEEB, 0x080820, 0.8 );
scene.add( hemiLight );

// sunlight
var sunLight = new THREE.SpotLight(0xffa95c,1.5);
sunLight.position.set(500,500,500);
sunLight.castShadow = true;
sunLight.shadow.bias = -0.0001;
sunLight.shadow.mapSize.width = 1024*4;
sunLight.shadow.mapSize.height = 1024*4;
scene.add( sunLight );

// loading racetrack pack
var raceTrackModel = new THREE.Object3D();;
loader.load(raceTrackPath, function ( gltf ) {
	raceTrackModel = gltf.scene;
	
	const scaleFactor = 3;
	raceTrackModel.position.set(0.0, 0.0, 0.0);
	raceTrackModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

	scene.add(raceTrackModel);
}, undefined, function ( error ) {
	console.error( error );
});

const raceTrackStartx = 0.0, 
	raceTrackStarty = 0.0,
	raceTrackStartz = 0.0;

// loading oldcar pack
var carPlayerModel = new THREE.Object3D();;
loader.load(carPlayerPath, function ( gltf ) {
	carPlayerModel = gltf.scene;

	carPlayerModel.position.set(raceTrackStartx, raceTrackStarty, raceTrackStartz);
	carPlayerModel.scale.set(0.01, 0.01, 0.01);
	carPlayerModel.traverse(n => { if ( n.isMesh ) {
		n.castShadow = true; 
		n.receiveShadow = true;
		if(n.material.map) n.material.map.anisotropy = 16; 
	  }});

	scene.add(carPlayerModel);
}, undefined, function ( error ) {
	console.error( error );
});

// setting up car controls
const carPlayerControls = {
	carAngle: 0.0,
	rotationQuantum: 0.0035,
	carSpeed: 0.0,
	carAcceleration: 0.0,
	forwardAcceleration: 0.00004,
	maxSpeed : 0.04,
	minSpeed : 0.00,
	turnLeft: false,
	turnRight: false,
	isAcce: false,
	isBraking: false,
	frictionAcce: 0.000003,
}

// initially start off in third person view
let isThirdPersonView = true;

// setting up initial camera position
controls.target = new THREE.Vector3(carPlayerModel.position.x, carPlayerModel.position.y, carPlayerModel.position.z);

// updating camera position
const updateCamera = (timeInterval) => {
	if (isThirdPersonView){
		camera.position.set( carPlayerModel.position.x + timeInterval*carPlayerControls.carSpeed*Math.sin(carPlayerControls.carAngle) - cameraDistance*Math.sin(carPlayerControls.carAngle),
				carPlayerModel.position.y + 6,
				carPlayerModel.position.z + timeInterval*carPlayerControls.carSpeed*Math.cos(carPlayerControls.carAngle) - cameraDistance*Math.cos(carPlayerControls.carAngle));
		controls.target = new THREE.Vector3(carPlayerModel.position.x, 
				carPlayerModel.position.y,
				carPlayerModel.position.z);
	} else {
		camera.position.set( carPlayerModel.position.x + timeInterval*carPlayerControls.carSpeed*Math.sin(carPlayerControls.carAngle) + firstPersonDistance*Math.sin(carPlayerControls.carAngle),
				carPlayerModel.position.y + 1.5,
				carPlayerModel.position.z + timeInterval*carPlayerControls.carSpeed*Math.cos(carPlayerControls.carAngle) + firstPersonDistance*Math.cos(carPlayerControls.carAngle));
		controls.target = new THREE.Vector3(carPlayerModel.position.x + cameraDistance*Math.sin(carPlayerControls.carAngle), 
				carPlayerModel.position.y + 1,
				carPlayerModel.position.z + cameraDistance*Math.cos(carPlayerControls.carAngle));
	}
}

// car movement
const carPlayerTurn = (timeInterval) => {
	if (carPlayerControls.turnLeft){
		carPlayerModel.rotateY(timeInterval*carPlayerControls.rotationQuantum);
			carPlayerControls.carAngle += timeInterval*carPlayerControls.rotationQuantum;
			carPlayerControls.turnLeft = false;
	}

	if (carPlayerControls.turnRight){
		carPlayerModel.rotateY(-timeInterval*carPlayerControls.rotationQuantum);
		carPlayerControls.carAngle += -timeInterval*carPlayerControls.rotationQuantum;
		carPlayerControls.turnRight = false;
	}
}

const carPlayerMove = (timeInterval) => {
	carPlayerModel.position.set(carPlayerModel.position.x + timeInterval*carPlayerControls.carSpeed*Math.sin(carPlayerControls.carAngle),
	carPlayerModel.position.y,
	carPlayerModel.position.z + timeInterval*carPlayerControls.carSpeed*Math.cos(carPlayerControls.carAngle));

	if (carPlayerControls.carSpeed > 0){
		carPlayerControls.carSpeed -= timeInterval*carPlayerControls.frictionAcce;

		if (carPlayerControls.carSpeed < 0){
			carPlayerControls.carSpeed = 0.0;
		}
	}

	// resetting camera
	updateCamera(timeInterval);
}

const carPlayerAcce = (timeInterval) => {
	if (carPlayerControls.isAcce){
		carPlayerControls.carSpeed += timeInterval*carPlayerControls.forwardAcceleration;
		carPlayerControls.isAcce = false;

		if (carPlayerControls.carSpeed > carPlayerControls.maxSpeed){
			carPlayerControls.carSpeed = carPlayerControls.maxSpeed;
		}
	}

	if (carPlayerControls.isBraking){
		carPlayerControls.carSpeed -= timeInterval*carPlayerControls.forwardAcceleration;
		carPlayerControls.isBraking = false;

		if (carPlayerControls.carSpeed < carPlayerControls.minSpeed){
			carPlayerControls.carSpeed = carPlayerControls.minSpeed;
		}
	}
}

// somethings for game
const gameConfig = {
	isPaused: true,
}

// event listeners
// rightclick
document.addEventListener("contextmenu", (event) => {
	console.log(camera.position);
});

// showing game controls
const renderControls = () => {
	var text2 = document.createElement('div');
	text2.style.position = 'absolute';
	text2.style.zIndex = 1;
	text2.style.width = 100;
	text2.style.height = 100;
	text2.innerHTML = `Controls`;
	text2.style.top = 10 + 'px';
	text2.style.right = 10 + 'px';
	document.body.appendChild(text2);
}

// key pressed
let keysPressed = {};
document.addEventListener("keydown", (event) => {
	// console.log(`Key down: ${event.key}`);

	keysPressed[event.key] = true;

	// pausing game
	if (keysPressed[' ']){
		gameConfig.isPaused = !gameConfig.isPaused;
	}

	// forward acceleration
	if (keysPressed['w']){
		carPlayerControls.isAcce = true;
	}

	// reverse acceleration (brakes)
	if (keysPressed['s']|| keysPressed['l']){
		carPlayerControls.isBraking = true;
	}

	// left turn
	if (keysPressed['a']){
		carPlayerControls.turnLeft = true;
	}

	// right turn
	if (keysPressed['d']){
		carPlayerControls.turnRight = true;
	}

	// // bird's eye view
	if (event.key === 't'){
		console.log("Toggling view");
		isThirdPersonView = !isThirdPersonView;

	}
});

document.addEventListener("keyup", (event) => {
	// console.log(`Key up: ${event.key}`);
	delete keysPressed[event.key];
});

var lastTime = new Date().getTime();

// rendering
requestAnimationFrame(render);
function render() {
    // Update camera position based on the controls
    controls.update();

    // Re-render the scene
    renderer.render(scene, camera);

	// displaying controls
	renderControls();

	// chrono
	const newTime = new Date().getTime();
	const timeInterval = newTime - lastTime;
	lastTime = newTime;

	if (!gameConfig.isPaused){
		// moving car
		carPlayerTurn(timeInterval);
		carPlayerAcce(timeInterval)
		carPlayerMove(timeInterval);
	}

	// birds eye view
	birdsRenderer.render(scene, camera);

    // Loop
    requestAnimationFrame(render);
}
*/