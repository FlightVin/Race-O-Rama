import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// loading 3D models loader
const loader = new GLTFLoader();
const audiencePath = '../audience.glb';
const raceTrackPath = '../race-track-new.glb';
const fuelTankPath = '../fuel-drum.glb';
const opponentCarPath = '../opponent-car.glb';
const stadiumPath = '../stadium.glb';

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
	isOutOfFuel: false,
	roadWidth: 30.0,
	lapOverPoint: new THREE.Vector3(15, 0, 0),
	lapPivotPoint: new THREE.Vector3(-120, 0, -120),
	lapsBool: false,
	offTrackHealthPenalty: 30,
	collisonHealthDecrease: 15,
	trackDist: 23,
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
	stadiumPos: [
		new THREE.Vector3(40, 0, 0),
		new THREE.Vector3(40, 0, 10),
		new THREE.Vector3(40, 0, -10),
		new THREE.Vector3(40, 0, -20),
		new THREE.Vector3(40, 0, -30),
		new THREE.Vector3(40, 0, -40),
		new THREE.Vector3(40, 0, -50),
		new THREE.Vector3(40, 0, -60),
		new THREE.Vector3(40, 0, -70),
		new THREE.Vector3(40, 0, -80),
		new THREE.Vector3(40, 0, -80),
		new THREE.Vector3(40, 0, -100),
		new THREE.Vector3(40, 0, -110),
		new THREE.Vector3(40, 0, -120),
		new THREE.Vector3(40, 0, -130),
		new THREE.Vector3(40, 0, -10),


		new THREE.Vector3(40, 0, 25),
		new THREE.Vector3(35, 0, 35),
		new THREE.Vector3(30, 0, 45),
		new THREE.Vector3(30, 0, 50),
		new THREE.Vector3(20, 0, 55),
		new THREE.Vector3(10, 0, 60),
		new THREE.Vector3(-70, 0, 20),
		new THREE.Vector3(-70, 0, 35),
		new THREE.Vector3(-70, 0, 50),
		new THREE.Vector3(-120, 0, -210),
		new THREE.Vector3(-100, 0, -210),
		new THREE.Vector3(-80, 0, -210),

		new THREE.Vector3(105, 0, -265),
		new THREE.Vector3(90, 0, -265),
		new THREE.Vector3(75, 0, -265),
		new THREE.Vector3(60, 0, -265),
		new THREE.Vector3(45, 0, -265),
		new THREE.Vector3(30, 0, -265),
		new THREE.Vector3(15, 0, -265),
		new THREE.Vector3(0, 0, -265),
		new THREE.Vector3(-15, 0, -265),
		new THREE.Vector3(-30, 0, -265),
		new THREE.Vector3(-45, 0, -265),

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
	lapsOver: 0,
	isBraking: false,
	frictionAcce: 0.00001,
	turningAcce: 0.000002,
	carHealth: 100,
	carFuel: 30,
	fuelUseRate: 0.001,
	fuelUsed: 0,
	distanceCovered: 0,
	nextFuelDistance: 0,
	crossedPoints: [],
}

gameParams.trackPoints.forEach(ele => {
	carPlayerControls.crossedPoints.push(false);
});

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

// variables for opponent cars
const opponentCarParams = {
	numCars: 3,
	carModels: [
		null,
		null,
		null,
	],
	initPos: [
		new THREE.Vector3(10, 0, -10),
		new THREE.Vector3(18, 0, -10),
		new THREE.Vector3(26, 0, -10),
	],
	pivotPoints:[
		new THREE.Vector3(6, 0, 33),
		new THREE.Vector3(-36, 0, 35),
		new THREE.Vector3(-46, 0, -19),
		new THREE.Vector3(-59, 0, -39),
		new THREE.Vector3(-94, 0, -45),
		new THREE.Vector3(-112, 0, -56),
		new THREE.Vector3(-120, 0, -82),
		new THREE.Vector3(-117, 0, -161),
		new THREE.Vector3(-105, 0, -175),
		new THREE.Vector3(-74, 0, -185),
		new THREE.Vector3(-62, 0, -201),
		new THREE.Vector3(-56, 0, -226),
		new THREE.Vector3(-31, 0, -241),	
		new THREE.Vector3(69, 0, -240),	
		new THREE.Vector3(111, 0, -230),
		new THREE.Vector3(120, 0, -210),
		new THREE.Vector3(110, 0, -189),
		new THREE.Vector3(92, 0, -178),
		new THREE.Vector3(24, 0, -171),
		new THREE.Vector3(15, 0, -155),
		new THREE.Vector3(15, 0, 5),
	],
	opponentPivots:[
		[],
		[],
		[],
	],
	baseSpeed: 0.029,
	curPivot:[
		0,
		0,
		0,
	],
	distanceCovered: [
		0,
		0,
		0,
	],
	carHealth: [
		100,
		100,
		100
	],
	isAlive: [
		true,
		true,
		true,
	],
	score: [
		0,
		0,
		0,
	],
	lapsOver: [
		0,
		0,
		0,
	],
	lapsBool: [
		false,
		false,
		false,
	],
	crossedPoints: [
		[],
		[],
		[],
	]
}

gameParams.trackPoints.forEach(ele => {
	for (let i = 0; i<opponentCarParams.numCars; i++){
		opponentCarParams.crossedPoints[i].push(false);
	}
});

const initOpponentParams = () => {
	for (let i = 0; i<opponentCarParams.numCars; i++){
		opponentCarParams.pivotPoints.forEach(ele => {
			opponentCarParams.opponentPivots[i].push(new THREE.Vector3(ele.x + Math.random()*10, ele.y, ele.z + Math.random()*10));
		})
	}
}
initOpponentParams();

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

const raceTrackStartx = 2.0, 
	raceTrackStarty = 0.0,
	raceTrackStartz = -10.0;

// loading oldcar pack
var carPlayerModel = new THREE.Object3D();;
loader.load(opponentCarPath, function ( gltf ) {
	carPlayerModel = gltf.scene;

	carPlayerModel.position.set(raceTrackStartx, raceTrackStarty, raceTrackStartz);
	carPlayerModel.traverse(n => { if ( n.isMesh ) {
		n.castShadow = true; 
		n.receiveShadow = true;
		if(n.material.map) n.material.map.anisotropy = 16; 
	  }});

	const scaleRatio = 0.015;
	carPlayerModel.scale.set(scaleRatio, scaleRatio, scaleRatio);

	const material = new THREE.MeshPhongMaterial( { color: 0xCCF381} );

	carPlayerModel.traverse( function( child ) {
    	if ( child.isMesh ) child.material = material;
		} );

	scene.add(carPlayerModel);
}, undefined, function ( error ) {
	console.error( error );
});

// loading audience
var audienceModel = new THREE.Object3D();;
loader.load(audiencePath, function ( gltf ) {
	audienceModel = gltf.scene;

	audienceModel.position.set(0, 0, 0);
	audienceModel.traverse(n => { if ( n.isMesh ) {
		n.castShadow = true; 
		n.receiveShadow = true;
		if(n.material.map) n.material.map.anisotropy = 16; 
	  }});

	const scaleRatio = 1;
	audienceModel.scale.set(scaleRatio, scaleRatio, scaleRatio);
	
	const material = new THREE.MeshPhongMaterial( { color: 0x8d5524} );

	audienceModel.traverse( function( child ) {
    	if ( child.isMesh ) child.material = material;
		} );

	for (let i = 0; i<gameParams.stadiumPos.length; i++){
		var curModel = audienceModel.clone();

		curModel.position.set(
			gameParams.stadiumPos[i].x,
			gameParams.stadiumPos[i].y,
			gameParams.stadiumPos[i].z
		);

		curModel.lookAt(new THREE.Vector3(0, 0, 0));

		scene.add(curModel);
	}

}, undefined, function ( error ) {
	console.error( error );
});

// loading stadium
var stadiumModel = new THREE.Object3D();;
loader.load(stadiumPath, function ( gltf ) {
	stadiumModel = gltf.scene;

	stadiumModel.position.set(0, 0, 0);
	stadiumModel.traverse(n => { if ( n.isMesh ) {
		n.castShadow = true; 
		n.receiveShadow = true;
		if(n.material.map) n.material.map.anisotropy = 16; 
	  }});

	const scaleRatio = 0.2;
	stadiumModel.scale.set(scaleRatio, scaleRatio, scaleRatio);

	for (let i = 0; i<gameParams.stadiumPos.length; i++){
		var curModel = stadiumModel.clone();

		curModel.position.set(
			gameParams.stadiumPos[i].x,
			gameParams.stadiumPos[i].y,
			gameParams.stadiumPos[i].z
		);

		curModel.lookAt(new THREE.Vector3(0, 0, 0));

		scene.add(curModel);
	}

}, undefined, function ( error ) {
	console.error( error );
});

// loading fuel tank
var fuelTankModel = new THREE.Object3D();;
loader.load(fuelTankPath, function ( gltf ) {
	fuelTankModel = gltf.scene;

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
	
	/*
	for (let i = 0; i<opponentCarParams.opponentPivots[0].length; i++){
		var curFuel = fuelTankModel.clone();

		curFuel.position.set(
			opponentCarParams.opponentPivots[0][i].x,
			opponentCarParams.opponentPivots[0][i].y,
			opponentCarParams.opponentPivots[0][i].z
		);

		scene.add(curFuel);
	}
	*/
	
}, undefined, function ( error ) {
	console.error( error );
});

// loading opponent car model
var opponentCarModel = new THREE.Object3D();;
loader.load(opponentCarPath, function ( gltf ) {
	opponentCarModel = gltf.scene;

	opponentCarModel.position.set(0, 0, 10);
	opponentCarModel.traverse(n => { if ( n.isMesh ) {
		n.castShadow = true; 
		n.receiveShadow = true;
		if(n.material.map) n.material.map.anisotropy = 16; 
	  }});

	const material = new THREE.MeshPhongMaterial( { color: 0xe0e0e0} );

	opponentCarModel.traverse( function( child ) {
    	if ( child.isMesh ) child.material = material;
		} );

	const scaleRatio = 0.015;
	opponentCarModel.scale.set(scaleRatio, scaleRatio, scaleRatio);

	for (let i = 0; i<opponentCarParams.numCars; i++){
		var curCar = opponentCarModel.clone();

		curCar.position.set(opponentCarParams.initPos[i].x, opponentCarParams.initPos[i].y, opponentCarParams.initPos[i].z);
		
		scene.add(curCar);
		opponentCarParams.carModels[i] = curCar;
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
	let curCrossed = 0;
	for (let i = 0; i<carPlayerControls.crossedPoints.length; i++){

		if (carPlayerModel.position.distanceTo(gameParams.trackPoints[i]) < gameParams.trackDist){
			carPlayerControls.crossedPoints[i] = true;
		}

		if (carPlayerControls.crossedPoints[i]){
			curCrossed++;
		}
	}
	carPlayerControls.score = curCrossed + carPlayerControls.lapsOver*gameParams.trackPoints.length;

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
			if (carPlayerControls.carSpeed < 0.05){
				gameParams.isOutOfFuel = true;
				gameParams.isOver = true;
			}
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
	for (let i = 0; i<carPlayerControls.crossedPoints.length; i++){
		carPlayerControls.crossedPoints[i] = false;
	}

	renderFuels();
	if (carPlayerControls.lapsOver === 3){
		gameParams.isOver = true;
	}
	initOpponentParams();
}

const checkLaps = () => {
	if (carPlayerModel.position.x >= -5 && carPlayerModel.position.x <= 35 
			&& carPlayerModel.position.z <= 3 && carPlayerModel.position.z >= -3 && gameParams.lapsBool){
		carPlayerControls.lapsOver++;
		gameParams.lapsBool = false;
		lapChangeCallback();
	}

	if (carPlayerModel.position.distanceTo(gameParams.lapPivotPoint) < 20){
		gameParams.lapsBool = true;
	}

	for (let i = 0; i < opponentCarParams.numCars; i++){
		if (opponentCarParams.carModels[i].position.x >= -5 && opponentCarParams.carModels[i].position.x <= 35 
				&& opponentCarParams.carModels[i].position.z <= 3 && opponentCarParams.carModels[i].position.z >= -3
				&& opponentCarParams.lapsBool[i]){
			opponentCarParams.lapsOver[i]++;
			opponentCarParams.lapsBool[i] = false;

			for (let j = 0; j<opponentCarParams.crossedPoints[i].length; j++){
				opponentCarParams.crossedPoints[i][j] = false;
			}
		}

		if (opponentCarParams.carModels[i].position.distanceTo(gameParams.lapPivotPoint) < 20){
			opponentCarParams.lapsBool[i] = true;
		}
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


// showing game controls
const renderDashboard = () => {

	var leaderBoardParams = [
		{
			dist:carPlayerControls.score,
			name:'P1'
		},
		{
			dist:opponentCarParams.score[0],
			name:'O1'
		},
		{
			dist:opponentCarParams.score[1],
			name:'O2'
		},
		{
			dist:opponentCarParams.score[2],
			name:'O3'
		},
	]

	leaderBoardParams = leaderBoardParams.sort( (ele1, ele2) => (ele1.dist < ele2.dist ? 1 : (ele1.dist > ele2.dist) ? -1 : 0));

	let leaderBoard = '';
	for (let i = 0; i<leaderBoardParams.length; i++){
		leaderBoard += '<div>';
		leaderBoard += String(i+1);
		leaderBoard += ". ";
		leaderBoard += leaderBoardParams[i].name;
		leaderBoard += " ";
		leaderBoard += leaderBoardParams[i].dist;
		leaderBoard += '</div>';
	}

	dashboardText.innerHTML = 
	`<div>
		<p>Health: ${Math.round(carPlayerControls.carHealth)}</p>
		<p>Score: ${Math.round(carPlayerControls.score)}</p>
		<p>Fuel: ${Math.round(carPlayerControls.carFuel)}</p>
		<p>Time Elapsed: ${Math.round(gameParams.timeElapsed/1000)}</p>
		<p>Mileage: ${carPlayerControls.fuelUsed > 0 ? (Math.round(carPlayerControls.distanceCovered/carPlayerControls.fuelUsed)) : 0}</p>
		<p>Laps Covered: ${carPlayerControls.lapsOver}</p>
		<p>Next Fuel Tank Distance : ${Math.round(carPlayerControls.nextFuelDistance) === Infinity ? "Wait for next lap" : Math.round(carPlayerControls.nextFuelDistance)}</p>
		<p> ${leaderBoard}</p>
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

	for (let i = 0; i<opponentCarParams.numCars; i++){
		const curModel = opponentCarParams.carModels[i];

		if (opponentCarParams.carHealth[i] <= 0){
			opponentCarParams.carHealth[i] = 0;
			// curModel.position.set(0, -20 - Math.random(1000), 0);
			// scene.remove(curModel);
			opponentCarParams.isAlive[i] = false;
		}
	}

}

const moveOpponents = (timeInterval) => {
	for (let i = 0; i<opponentCarParams.numCars; i++){
		if (!opponentCarParams.isAlive[i]){
			continue;
		}

		let curCrossed = 0;
		for (let j = 0; j<opponentCarParams.crossedPoints[i].length; j++){
	
			if (opponentCarParams.carModels[i].position.distanceTo(gameParams.trackPoints[j]) < gameParams.trackDist){
				opponentCarParams.crossedPoints[i][j] = true;
			}
	
			if (opponentCarParams.crossedPoints[i][j]){
				curCrossed++;
			}
		}
		opponentCarParams.score[i] = curCrossed + opponentCarParams.lapsOver[i]*gameParams.trackPoints.length;

		const curSpeed = opponentCarParams.baseSpeed + Math.random()*0.01;
		let nextPivot = opponentCarParams.curPivot[i];

		for (; nextPivot < opponentCarParams.opponentPivots[i].length; nextPivot++){
			const nextPivotVector = opponentCarParams.opponentPivots[i][nextPivot];

			if (nextPivotVector.distanceTo(opponentCarParams.carModels[i].position) > 20){
				break;
			}
		}

		if (nextPivot === opponentCarParams.opponentPivots[i].length){
			nextPivot = 0;
		}
		opponentCarParams.curPivot[i] = nextPivot;
		// console.log(opponentCarParams.curPivot[i]);

		const targetPoint = opponentCarParams.opponentPivots[i][nextPivot];


		var direction = new THREE.Vector3();
		direction.subVectors(targetPoint, opponentCarParams.carModels[i].position);
		direction.normalize();

		var velocity = direction.multiplyScalar(curSpeed);

		opponentCarParams.carModels[i].position.add(velocity.clone().multiplyScalar(timeInterval));
		opponentCarParams.carModels[i].lookAt(targetPoint);

		opponentCarParams.distanceCovered[i] += timeInterval*curSpeed;
	}
}

const checkCarCollision = (timeInterval) => {
	const playerBoundingBox = new THREE.Box3().setFromObject(carPlayerModel);
	for (let i = 0; i<opponentCarParams.numCars; i++){

		const opponentBoundingBox = new THREE.Box3().setFromObject(opponentCarParams.carModels[i]);

		if (opponentBoundingBox.intersectsBox(playerBoundingBox)){
			console.log(`Collision between player and ${i}`);
			carPlayerControls.carSpeed = 0;
			carPlayerControls.carHealth -= gameParams.collisonHealthDecrease;
			opponentCarParams.carHealth[i] -= gameParams.collisonHealthDecrease;
		}

		// checking for collisions with other cars
		for (let j = i+1; j<opponentCarParams.numCars; j++){

			const otherBoundingBox = new THREE.Box3().setFromObject(opponentCarParams.carModels[j]);

			if (opponentBoundingBox.intersectsBox(otherBoundingBox) && (opponentCarParams.isAlive[i] || opponentCarParams.isAlive[j])){
				console.log(`Collision between ${j} and ${i}`);

				// moving j back
				if(opponentCarParams.isAlive[j]){
					let nextPivot = opponentCarParams.curPivot[j];
					const targetPoint = opponentCarParams.opponentPivots[j][nextPivot];
					var direction = new THREE.Vector3();
					direction.subVectors(targetPoint, opponentCarParams.carModels[j].position);
					direction.normalize();
					var disp = direction.multiplyScalar(-8);
					opponentCarParams.carModels[j].position.add(disp.clone());
				}

				// reducing health
				opponentCarParams.carHealth[i] -= gameParams.collisonHealthDecrease;
				opponentCarParams.carHealth[j] -= gameParams.collisonHealthDecrease;
			}
		}
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

		moveOpponents(timeInterval);

		checkHealth();
		checkCarCollision(timeInterval);

		// updating elapsed time
		gameParams.timeElapsed += timeInterval;
	}

	if (gameParams.isOver && !renderedGameOverScreen){
		console.log("Game Over");

		var leaderBoardParams = [
			{
				dist:carPlayerControls.score,
				name:'Player'
			},
			{
				dist:opponentCarParams.score[0],
				name:'Opponent 1'
			},
			{
				dist:opponentCarParams.score[1],
				name:'Opponent 2'
			},
			{
				dist:opponentCarParams.score[2],
				name:'Opponent 3'
			},
		]
	
		leaderBoardParams = leaderBoardParams.sort( (ele1, ele2) => (ele1.dist < ele2.dist ? 1 : (ele1.dist > ele2.dist) ? -1 : 0));
		
		let leaderBoard = '';
		for (let i = 0; i<leaderBoardParams.length; i++){
			leaderBoard += '<div><h3>';
			leaderBoard += String(i+1);
			leaderBoard += ". ";
			leaderBoard += leaderBoardParams[i].name;
			leaderBoard += ": ";
			leaderBoard += leaderBoardParams[i].dist;
			leaderBoard += '</h3></div>';
		}
		
		gameOverScreen.innerHTML = `
			<div>
				<div><h1>Game Over</h1></div>
				<div><h2>
					${gameParams.isDead ? "You Collided" : (gameParams.isOutOfFuel) ? "You ran out of fuel :(" : "Race Finished" }
				</h2></div>

				<div><h2>Ranks</h2></div>

					${leaderBoard}
			</div>
		`

		document.body.appendChild(gameOverScreen);
		renderedGameOverScreen = true;
	}

	// birds eye view
	birdsRenderer.render(scene, birdsCamera);


    // Loop
    requestAnimationFrame(render);
}
