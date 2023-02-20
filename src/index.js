import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// loading 3D models loader
const loader = new GLTFLoader();
const carPlayerPath = '../car-old-school.glb';
const raceTrackPath = '../race-track-new.glb';
const fuelTankPath = '../fuel-drum.glb';

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
birdsRenderer.domElement.style.bottom = 0;
birdsRenderer.domElement.style.position = 'absolute';
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

// birds eye view camera
const birdsCamera = new THREE.PerspectiveCamera( 45, 
	window.innerWidth / window.innerHeight, 
	0.1, 1000 ); 
birdsCamera.position.set( 10, 10, 10 );

// scene
const scene = new THREE.Scene();

// orbit controller
var controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', function() { renderer.render(scene, camera); } );

var birdsControls = new OrbitControls( birdsCamera, renderer.domElement );
birdsControls.addEventListener( 'change', function() { renderer.render(scene, birdsCamera); } );

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


// setting up game
const gameParams = {
	score: 0,
	timeElapsed: 0,
	isPaused: true,
	isOver: false,
	isDead: false,
	roadWidth: 30.0,
	lapOverPoint: new THREE.Vector3(15, 0, 0),
	lapPivotPoint: new THREE.Vector3(-120, 0, -120),
	lapsOver: 0,
	lapsBool: false,
	offTrackHealthPenalty: 30,
	trackPoints: [
		new THREE.Vector3(15, 0, 20),
		new THREE.Vector3(13, 0, 22),
		new THREE.Vector3(10, 0, 30),
		new THREE.Vector3(7, 0, 35),
		new THREE.Vector3(2, 0, 39),
		new THREE.Vector3(-5, 0, 42),
		new THREE.Vector3(-11, 0, 43),
		new THREE.Vector3(-21, 0, 43),
		new THREE.Vector3(-26, 0, 41),
		new THREE.Vector3(-35, 0, 35),
		new THREE.Vector3(-41, 0, 26),
		new THREE.Vector3(-45, 0, 20),
		new THREE.Vector3(-45, 0, -8),
		new THREE.Vector3(-45, 0, 10),
		new THREE.Vector3(-45, 0, -10),
		new THREE.Vector3(-43, 0, -17),
		new THREE.Vector3(-50, 0, -30),
		new THREE.Vector3(-57, 0, -38),
		new THREE.Vector3(-64, 0, -42),
		new THREE.Vector3(-77, 0, -46),
		new THREE.Vector3(-82, 0, -46),
		new THREE.Vector3(-88, 0, -46),
		new THREE.Vector3(-100, 0, -47),
		new THREE.Vector3(-107, 0, -52),
		new THREE.Vector3(-115, 0, -59),
		new THREE.Vector3(-116, 0, -163),
		new THREE.Vector3(-110, 0, -170),
		new THREE.Vector3(-105, 0, -175),
		new THREE.Vector3(-98, 0, -180),
		new THREE.Vector3(-90, 0, -180),
		new THREE.Vector3(-75, 0, -185),
		new THREE.Vector3(-70, 0, -190),
		new THREE.Vector3(-65, 0, -200),
		new THREE.Vector3(-60, 0, -205),
		new THREE.Vector3(-61, 0, -195),
		new THREE.Vector3(-58, 0, -215),
		new THREE.Vector3(-58, 0, -220),
		new THREE.Vector3(-55, 0, -225),
		new THREE.Vector3(-50, 0, -230),
		new THREE.Vector3(-40, 0, -235),
		new THREE.Vector3(110, 0, -230),
		new THREE.Vector3(115, 0, -225),
		new THREE.Vector3(117, 0, -217),
		new THREE.Vector3(119, 0, -211),
		new THREE.Vector3(118, 0, -204),
		new THREE.Vector3(114, 0, -196),
		new THREE.Vector3(110, 0, -190),
		new THREE.Vector3(105, 0, -185),
		new THREE.Vector3(30, 0, -175),
		new THREE.Vector3(25, 0, -174),
		new THREE.Vector3(20, 0, -170),
		new THREE.Vector3(20, 0, -165),
		new THREE.Vector3(18, 0, -163),
		new THREE.Vector3(16, 0, -157),
	],
}

// generating traight race tracks
for (let i = -155; i<=15; i+=5){
	gameParams.trackPoints.push(new THREE.Vector3(15, 0, i));
}
for (let i = -155; i<=-70; i+=5){
	gameParams.trackPoints.push(new THREE.Vector3(-120, 0, i));
}
for (let i = -30; i<=105; i+=5){
	gameParams.trackPoints.push(new THREE.Vector3(i, 0, -240));
}
for (let i = 35; i<=105; i+=5){
	gameParams.trackPoints.push(new THREE.Vector3(i, 0, -180));
}
// done generating race tracks

// setting up car controls
const carPlayerControls = {
	carAngle: 0.0,
	rotationQuantum: 0.0012,
	carSpeed: 0.0,
	carAcceleration: 0.0,
	forwardAcceleration: 0.00004,
	maxSpeed : 0.04,
	minSpeed : 0.00,
	turnLeft: false,
	turnRight: false,
	isAcce: false,
	isBraking: false,
	frictionAcce: 0.00001,
	turningAcce: 0.000002,
	carHealth: 100,
	carFuel: 30,
	fuelUseRate: 0.001,
	fuelUsed: 0,
	distanceCovered: 0,
	nextFuelDistance: 0,
}

// variables for fuel tanks
const fuelParams = {
	fuelIncrease: 7,
	numFuels: 5,
	fuelPositions: [
		new THREE.Vector3(-5, 0, 40),
		new THREE.Vector3(15, 0, -95),
		new THREE.Vector3(-120, 0, -95),
		new THREE.Vector3(-30, 0, -240),
		new THREE.Vector3(70, 0, -180),
	],
	fuelModels: [
		null,
		null,
		null,
		null,
		null,
	],
	isTaken: [
		false,
		false,
		false,
		false,
		false,
	],
	exitedRange:[
		false,
		false,
		false,
		false,
		false,
	],
	positionBias: 10,
	nextSwitchDist: 25,
}


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

// loading fuel tank
var fuelTankModel = new THREE.Object3D();;
loader.load(fuelTankPath, function ( gltf ) {
	fuelTankModel = gltf.scene;

	fuelTankModel.position.set(0, 0, 10);
	fuelTankModel.scale.set(1.5, 1.5, 1.5);
	fuelTankModel.traverse(n => { if ( n.isMesh ) {
		n.castShadow = true; 
		n.receiveShadow = true;
		if(n.material.map) n.material.map.anisotropy = 16; 
	  }});

	for (let i = 0; i<fuelParams.numFuels; i++){
		var curFuel = fuelTankModel.clone();

		curFuel.position.set(
			fuelParams.fuelPositions[i].x + Math.random()*fuelParams.positionBias,
			fuelParams.fuelPositions[i].y,
			fuelParams.fuelPositions[i].z + Math.random()*fuelParams.positionBias
		);

		scene.add(curFuel);

		fuelParams.fuelModels[i] = curFuel;
	}
}, undefined, function ( error ) {
	console.error( error );
});

// initially start off in third person view
let isThirdPersonView = true;

// setting up initial camera position
controls.target = new THREE.Vector3(carPlayerModel.position.x, carPlayerModel.position.y, carPlayerModel.position.z);

// birds controls
const birdsEyeHeight = 50;
birdsCamera.position.set( carPlayerModel.position.x,
	carPlayerModel.position.y + birdsEyeHeight,
	carPlayerModel.position.z);
birdsControls.target = new THREE.Vector3(carPlayerModel.position.x, 
	carPlayerModel.position.y,
	carPlayerModel.position.z);

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

	// for birds eye view
	birdsCamera.position.set( carPlayerModel.position.x,
		carPlayerModel.position.y + birdsEyeHeight,
		carPlayerModel.position.z);
	birdsControls.target = new THREE.Vector3(carPlayerModel.position.x, 
		carPlayerModel.position.y,
		carPlayerModel.position.z);
}

// car movement
const carPlayerTurn = (timeInterval) => {
	if (carPlayerControls.turnLeft){
		if (carPlayerControls.carSpeed > 0){
			carPlayerControls.carSpeed -= timeInterval*carPlayerControls.turningAcce;
	
			if (carPlayerControls.carSpeed < 0){
				carPlayerControls.carSpeed = 0.0;
			}
		}

		carPlayerModel.rotateY(timeInterval*carPlayerControls.rotationQuantum);
			carPlayerControls.carAngle += timeInterval*carPlayerControls.rotationQuantum;
	}

	if (carPlayerControls.turnRight){
		if (carPlayerControls.carSpeed > 0){
			carPlayerControls.carSpeed -= timeInterval*carPlayerControls.turningAcce;
	
			if (carPlayerControls.carSpeed < 0){
				carPlayerControls.carSpeed = 0.0;
			}
		}

		carPlayerModel.rotateY(-timeInterval*carPlayerControls.rotationQuantum);
		carPlayerControls.carAngle += -timeInterval*carPlayerControls.rotationQuantum;
	}
}

const carPlayerMove = (timeInterval) => {
	// updating score
	gameParams.score += timeInterval*carPlayerControls.carSpeed/10;

	// updating distance covered
	carPlayerControls.distanceCovered +=  timeInterval*carPlayerControls.carSpeed;

	// moving car
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

	// updating fuel tank distance
	carPlayerControls.nextFuelDistance = Infinity;
	for (let i = 0; i<fuelParams.numFuels; i++){
		const curDist = fuelParams.fuelModels[i].position.distanceTo(carPlayerModel.position);

		if (curDist < fuelParams.nextSwitchDist){
			fuelParams.exitedRange[i] = true;
		}

		if (!fuelParams.exitedRange[i] && curDist < carPlayerControls.nextFuelDistance){
			carPlayerControls.nextFuelDistance = curDist;
		}
	}
}

const carPlayerAcce = (timeInterval) => {
	if (carPlayerControls.isAcce){

		// checking fuel
		if (carPlayerControls.carFuel < 0.2){
			return;
		}

		// decreasing car fuel
		carPlayerControls.carFuel -= timeInterval*carPlayerControls.fuelUseRate;
		carPlayerControls.fuelUsed += timeInterval*carPlayerControls.fuelUseRate;

		if (carPlayerControls.carFuel <= 0){
			carPlayerControls.carFuel = 0;
		}

		// accelerating
		carPlayerControls.carSpeed += timeInterval*carPlayerControls.forwardAcceleration;

		if (carPlayerControls.carSpeed > carPlayerControls.maxSpeed){
			carPlayerControls.carSpeed = carPlayerControls.maxSpeed;
		}
	}

	if (carPlayerControls.isBraking){
		carPlayerControls.carSpeed -= timeInterval*carPlayerControls.forwardAcceleration;

		if (carPlayerControls.carSpeed < carPlayerControls.minSpeed){
			carPlayerControls.carSpeed = carPlayerControls.minSpeed;
		}
	}
}

const renderFuels = () => {
	for (let i = 0; i<fuelParams.numFuels; i++){
		fuelParams.exitedRange[i] = false;
		
		if (fuelParams.isTaken[i]){
			fuelParams.fuelModels[i].position.set(
				fuelParams.fuelPositions[i].x + Math.random()*fuelParams.positionBias,
				fuelParams.fuelPositions[i].y,
				fuelParams.fuelPositions[i].z + Math.random()*fuelParams.positionBias
			);
	
			scene.add(fuelParams.fuelModels[i]);

			fuelParams.isTaken[i] = false;
			console.log(`Recreated fuel ${i}`);
		}
	}
}

const lapChangeCallback = () => {
	renderFuels();
	if (gameParams.lapsOver === 5){
		gameParams.isOver = true;
	}
}

const checkLaps = () => {
	if (carPlayerModel.position.distanceTo(gameParams.lapOverPoint) < 20 && gameParams.lapsBool){
		gameParams.lapsOver++;
		gameParams.lapsBool = false;
		lapChangeCallback();
	}

	if (carPlayerModel.position.distanceTo(gameParams.lapPivotPoint) < 20){
		gameParams.lapsBool = true;
	}
}

const checkFuelCollision = () => {
	const playerBoundingBox = new THREE.Box3().setFromObject(carPlayerModel);
	for (let i = 0; i<fuelParams.numFuels; i++){
		const fuelBoundingBox = new THREE.Box3().setFromObject(fuelParams.fuelModels[i]);

		if (fuelBoundingBox.intersectsBox(playerBoundingBox) && !fuelParams.isTaken[i]){
			console.log(`Fuel ${i} picked up.`);
			fuelParams.isTaken[i] = true;
			scene.remove(fuelParams.fuelModels[i]);
			carPlayerControls.carFuel += fuelParams.fuelIncrease;
		}
	}
}

const checkTrackExit = (timeInterval) => {
	let minDist = Infinity;
	gameParams.trackPoints.forEach( (ele) => {
		if (carPlayerModel.position.distanceTo(ele) < minDist){
			minDist = carPlayerModel.position.distanceTo(ele);
		}
	});

	if (minDist > 17){
		console.log("Outside Track");
		carPlayerControls.carSpeed = 0;
		// carPlayerControls.carHealth -= timeInterval/1000*gameParams.offTrackHealthPenalty;
	}
}

var dashboardText = document.createElement('div');
dashboardText.style.position = 'absolute';
dashboardText.style.zIndex = 1;
dashboardText.style.width = '250px';
dashboardText.style.backgroundColor = '#F0F8FF';
dashboardText.style.top = 10 + 'px';
dashboardText.style.left = 10 + 'px';
document.body.appendChild(dashboardText);

var startImage = document.createElement('div');
startImage.style.position = 'absolute';
startImage.style.zIndex = 10;
startImage.style.top = 0 + 'px';
startImage.style.left = 0 + 'px';
startImage.style.height = '100%';
startImage.style.width = '100%';
startImage.style.backgroundColor = '#F0FFFF';
startImage.style.display = 'flex';
startImage.style.alignItems = 'center';
startImage.style.justifyContent = 'center';
startImage.style.flexDirection = 'column';
startImage.innerHTML = `
	<div style="padding:0;">
	<h1>Controls</h1>
	</div>
	<div>
	<h2>Movement</h2>
	</div>
	<div>
	<h3>w: Accelerate Forward</h3>
	<h3>s/l: Brake</h3>
	<h3>a: Turn Left</h3>
	<h3>d: Turn Right</h3>
	</div>

	<div>
	<h2>Other Controls</h2>
	</div>
	<div>
	<h3>Space Bar: Start Game, Pause Game</h3>
	<h3>t: Toggle View</h3>
	</div>
`
document.body.appendChild(startImage);

var gameOverScreen = document.createElement('div');
gameOverScreen.style.position = 'absolute';
gameOverScreen.style.zIndex = 100;
gameOverScreen.style.top = 0 + 'px';
gameOverScreen.style.left = 0 + 'px';
gameOverScreen.style.height = '100%';
gameOverScreen.style.width = '100%';
gameOverScreen.style.backgroundColor = '#F0FFFF';
gameOverScreen.style.display = 'flex';
gameOverScreen.style.alignItems = 'center';
gameOverScreen.style.justifyContent = 'center';
startImage.style.flexDirection = 'column';
gameOverScreen.innerHTML = `
	<div>
		Game Over
	</div>
`

// showing game controls
const renderDashboard = () => {
	dashboardText.innerHTML = 
	`<div>
		<p>Health: ${Math.round(carPlayerControls.carHealth)}</p>
		<p>Score: ${Math.round(gameParams.score)}</p>
		<p>Fuel: ${Math.round(carPlayerControls.carFuel)}</p>
		<p>Time Elapsed: ${Math.round(gameParams.timeElapsed/1000)}</p>
		<p>Mileage: ${carPlayerControls.fuelUsed > 0 ? (Math.round(carPlayerControls.distanceCovered/carPlayerControls.fuelUsed)) : 0}</p>
		<p>Laps Covered: ${gameParams.lapsOver}</p>
		<p>Next Fuel Tank Distance : ${Math.round(carPlayerControls.nextFuelDistance) === Infinity ? "Wait for next lap" : Math.round(carPlayerControls.nextFuelDistance)}</p>
	</div>`;
}

const checkHealth = () => {
	if (carPlayerControls.carHealth <= 0){
		carPlayerControls.carHealth = 0;
		gameParams.isDead = true;
		gameParams.isOver = true;
		carPlayerModel.position.set(-20, 10, -110);
		scene.remove(carPlayerModel);
	}
}

// event listeners
// rightclick
document.addEventListener("contextmenu", (event) => {
	console.log(carPlayerModel.position);
});

// key pressed
let keysPressed = {};
document.addEventListener("keydown", (event) => {

	keysPressed[event.key] = true;

	// pausing game
	if (keysPressed[' ']){
		if (gameParams.isPaused){
			document.body.removeChild(startImage);
		} else {
			document.body.appendChild(startImage);
		}
		gameParams.isPaused = !gameParams.isPaused;
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

	if (event.key === 'w'){
		carPlayerControls.isAcce = false;
	}

	if (event.key === 's'){
		carPlayerControls.isBraking = false;
	}

	if (event.key === 'a'){
		carPlayerControls.turnLeft = false;
	}

	if (event.key === 'd'){
		carPlayerControls.turnRight = false;
	}
});

var lastTime = new Date().getTime();
var renderedGameOverScreen =  false;

// rendering
requestAnimationFrame(render);
function render() {
    // Update camera position based on the controls
    controls.update();
	birdsControls.update()

    // Re-render the scene
    renderer.render(scene, camera);

	// displaying dashboard
	renderDashboard();

	// chrono
	const newTime = new Date().getTime();
	const timeInterval = newTime - lastTime;
	lastTime = newTime;

	if (!gameParams.isPaused && !gameParams.isOver){
		// moving car
		carPlayerTurn(timeInterval);
		carPlayerAcce(timeInterval)
		carPlayerMove(timeInterval);
		checkLaps();
		checkFuelCollision();
		checkTrackExit(timeInterval);
		checkHealth();

		// updating elapsed time
		gameParams.timeElapsed += timeInterval;
	}

	if (gameParams.isOver && !renderedGameOverScreen){
		console.log("Game Over");
		document.body.appendChild(gameOverScreen);
		renderedGameOverScreen = true;
	}

	// birds eye view
	birdsRenderer.render(scene, birdsCamera);


    // Loop
    requestAnimationFrame(render);
}

