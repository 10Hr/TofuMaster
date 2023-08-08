import * as THREE from 'three';
import { MathUtils, Euler } from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';



var playerDirection = new THREE.Vector3();
var STEPS_PER_FRAME = 5;
const clock = new THREE.Clock();
var playerOnFloor = false;
const GRAVITY = 30;
const keyStates = {};
const raycaster = new THREE.Raycaster();
const mouseCursor = new THREE.Vector2();
let controls;
var headBobActive = false;
var headBobTimer = 0;
var deltaTime;
var tofulist = [];
var timeElapsed = 0;
const timer = new THREE.Clock();
const maxSpeed = 0;
var collectedTofu = 0;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
60, //fov
window.innerWidth / window.innerHeight, // aspect ratio
0.1, // near
20000 // far
);
camera.position.set(3,5,3);
//camera.rotateX(Math.PI / 2);

//scene.fog = new THREE.Fog( 0x000000, 1, 2);
//scene.fog = new THREE.FogExp2( 0x000000, 1 );


const renderer = new THREE.WebGLRenderer({ antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// player cube
const cube2 = new THREE.Mesh(
new THREE.BoxGeometry(1,1,1),
new THREE.MeshPhongMaterial({color: 0xFFFFFF})
);
cube2.position.set(-3,0,0);
cube2.castShadow = true;
cube2.recieveShadow = true;

let cube2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube2BB.setFromObject(cube2);
console.log(cube2BB);

//const light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 1 );
//scene.add( light );


// jonathan

var loader = new THREE.TextureLoader();

// Load an image file into a custom material
var enemyimage = new THREE.MeshLambertMaterial({
map: loader.load('https://t3.ftcdn.net/jpg/05/61/34/68/360_F_561346848_rjYLmoLNU1BfnJZn2BhAzfzVHcURhmKg.jpg')
});

const enemy = new THREE.Mesh(
new THREE.BoxGeometry(.5,.7,.1),
enemyimage
);
enemy.position.set(0,-.5,40);
enemy.castShadow = false;
enemy.recieveShadow = false;

let enemyBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
enemyBB.setFromObject(enemy);
console.log(enemyBB);


//TOFU

// createTofu( posx, posy, posz)
var cube1 = createTofu(3,0,0);
var cube3 = createTofu(-2,-.3,-3);
var cube4 = createTofu(-4,-.3,-3);
var cube5 = createTofu(-10,-.3, 14);
var cube6 = createTofu(10,-.3,-14);
var cube7 = createTofu(-20,-.3, 6);
var cube8 = createTofu(17,-.3, 15);


console.log(tofulist);

//ground

const plane1 = new THREE.Mesh(
new THREE.PlaneGeometry(100,100),
new THREE.MeshStandardMaterial({color: 0x000000})
);
plane1.position.set(0,-0.5, 0);
plane1.rotateX(-Math.PI / 2);
plane1.recieveShadow = true;

let groundbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
groundbox.setFromObject(plane1);




//FLASHLIGHT STUFF
const sp = createSpotlight(0xffffff);

scene.add(cube2, plane1,sp, enemy);

controls = new PointerLockControls( camera, document.body );

scene.add( controls.getObject() );

camera.add( sp.target );
sp.target.position.set( 0, 0, -1 );

initEventListeners();

animate();

// camera stuf

function updateHeadBob(timeElapsedS) {
if (headBobActive) {
//const nextStep = 1 + Math.floor(((headBobTimer + 0.000001) * 10) / wavelength);\
//cube4.position.y += Math.sin(performance.now() / 120) / 20;
headBobActive = false;
// const wavelength = Math.PI;
// const nextStep = 1 + Math.floor(((headBobTimer + 0.000001) * 10) / wavelength);
// const nextStepTime = nextStep * wavelength / 10;

// headBobTimer = Math.min(headBobTimer + timeElapsedS * .00001, nextStepTime);
//console.log(headBobTimer);
// if (headBobTimer == nextStepTime) {
// headBobActive = false;
// }
}
}

//tofu animation

new TWEEN.Tween(cube3.position).to({y: cube3.position.y - .1}, 1500)
.yoyo(true)
.repeat(Infinity)
.easing(TWEEN.Easing.Cubic.InOut).start();
new TWEEN.Tween(cube3.rotation).to({y: "-" + (Math.PI/2) * 2}, 5000)
.repeat(Infinity)
.start();



//----------------------------------METHODS----------------------------------

function createTofu(x, y, z) {
let newTofu = new THREE.Mesh(
new THREE.BoxGeometry(0.2, 0.2, 0.2),
new THREE.MeshPhongMaterial({color: 0xe8e3d9})
);
newTofu.position.set(x,y,z);
newTofu.castShadow = true;
newTofu.recieveShadow = false;
newTofu.shininess = 20;
let newTofuBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
newTofuBB.setFromObject(newTofu);
scene.add(newTofu);
var tofuObj = {mesh: newTofu, BB: newTofuBB, collected: false};

tofulist.push(tofuObj);

return newTofu;
}

function initEventListeners() {
const blocker = document.getElementById( 'blocker' );
const instructions = document.getElementById( 'instructions' );

instructions.addEventListener( 'click', function () {

controls.lock();

} );

controls.addEventListener( 'lock', function () {

instructions.style.display = 'none';
blocker.style.display = 'none';

} );

controls.addEventListener( 'unlock', function () {

blocker.style.display = 'block';
instructions.style.display = '';

} );
document.addEventListener( 'keydown', ( event ) => {

keyStates[ event.code ] = true;
} );
document.addEventListener( 'keyup', ( event ) => {
keyStates[ event.code ] = false;
} );
document.body.addEventListener( 'mousedown', () => {
//document.body.lock();
} );
document.addEventListener( 'mouseup', () => {
} );

document.addEventListener("mousemove", onMouseMove, false);

}

function onMouseMove(event){

// camera.rotation.y = (event.clientX / window.innerWidth) * 5;
// camera.rotation.x = (event.clientY / window.innerHeight) - 0.5 ;


//sp.rotation.y = (event.clientX / window.innerWidth) - 0.5;
//sp.rotation.x = (event.clientY / window.innerHeight) - 0.5;
//sp.position.x = ((event.clientX / window.innerWidth) - 0.5) * 15;
//sp.position.y = ((event.clientY / window.innerHeight) - 0.5) * -15;
}

function createSpotlight( color ) {
const newObj = new THREE.SpotLight( color, 10 );

newObj.castShadow = true;
newObj.angle = .5;
newObj.penumbra = 0.4;
newObj.decay = 1;
newObj.distance = 5;
return newObj;
}

function getForwardVector() {

camera.getWorldDirection( playerDirection );
playerDirection.y = 0;
playerDirection.normalize();

return playerDirection;

}

function getSideVector() {

camera.getWorldDirection( playerDirection );
playerDirection.y = 0;
playerDirection.normalize();
playerDirection.cross( camera.up );

return playerDirection;

}

function checkCollisions() {

// tofu collection
for (let tofu in tofulist) {
if (cube2BB.intersectsBox(tofulist[tofu].BB)) {
tofulist[tofu].collected = true; 
collectedTofu++;
document.getElementById("tofuNumber").innerHTML = collectedTofu;
scene.remove(tofulist[tofu].BB, tofulist[tofu].mesh);
tofulist.splice(tofu,1);
}
}
}

function keyInputs( deltaTime ) {

// gives a bit of air control
const speedDelta = deltaTime * ( playerOnFloor ? 3 : 2 );
var velX;
var velZ;
if ( keyStates[ 'KeyW' ] ) {
velX = getForwardVector().multiplyScalar( speedDelta ).x;
velZ = getForwardVector().multiplyScalar( speedDelta ).z;
//playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
cube2.position.set(
cube2.position.x + velX, 
cube2.position.y, 
cube2.position.z + velZ);
headBobActive = true;
}

if ( keyStates[ 'KeyS' ] ) {
cube2.position.set(
cube2.position.x + getForwardVector().multiplyScalar( -speedDelta ).x, 
cube2.position.y, 
cube2.position.z + getForwardVector().multiplyScalar( -speedDelta ).z);
headBobActive = true; 
//playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );

}

if ( keyStates[ 'KeyA' ] ) {
cube2.position.set(
cube2.position.x + getSideVector().multiplyScalar( -speedDelta ).x, 
cube2.position.y, 
cube2.position.z + getSideVector().multiplyScalar( -speedDelta ).z);
//playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
headBobActive = true;
}

if ( keyStates[ 'KeyD' ] ) {
cube2.position.set(
cube2.position.x + getSideVector().multiplyScalar( speedDelta ).x, 
cube2.position.y, 
cube2.position.z + getSideVector().multiplyScalar( speedDelta ).z);
//playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
headBobActive = true;
}

if ( playerOnFloor ) {

if ( keyStates[ 'Space' ] ) {

//playerVelocity.y = 15;

}

}

/*
document.onkeydown = function(e) {
if (e.key == "w") {
console.log(getForwardVector().multiplyScalar( speedDelta ));
console.log(cube2.position);
//cube2.position.set(cube2.position.x + getForwardVector().multiplyScalar( speedDelta ).x, cube2.position.y, cube2.position.z + getForwardVector().multiplyScalar( speedDelta ).z);
//cube2.position.z += getForwardVector().multiplyScalar( speedDelta ).z ;
} 
if (e.key == "s") {
//playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
// cube2.position.z -= getForwardVector().multiplyScalar( speedDelta ).z;
} if (e.key == "a") {

//playerVelocity.add( getSideVector().multiplyScalar( -speedDelta ) );
// cube2.position.x -= getSideVector().multiplyScalar( speedDelta ).x;
} if (e.key == "d") {
// playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
//cube2.position.x += getSideVector().multiplyScalar( speedDelta ).x;
}
// if ( playerOnFloor ) {

if ( e.key == "Space") {

cube2.position.y += 15;

}

//}
}
*/
}


function updatePlayer( deltaTime ) {

cube2BB.copy(cube2.geometry.boundingBox).applyMatrix4(cube2.matrixWorld);

if (!cube2BB.intersectsBox(groundbox)) {
playerOnFloor = true;
cube2.position.y -= GRAVITY * deltaTime;
} else
playerOnFloor = false;

}

function updateTofu(deltaTime) {

for (let tofu in tofulist) 
tofulist[tofu].BB.copy(tofulist[tofu].mesh.geometry.boundingBox).applyMatrix4(tofulist[tofu].mesh.matrixWorld);

}

var enemyVector;
function updateEnemy(deltaTime) {

/*

A basic solution to this problem, given the two positions of the objects (A and B):

Compute the normalized direction vector from A to B: v = normalize(B - A).
Every game logic update, add that vector v (scaled by the desired object speed) to the position of A: A += v * speed.
Stop doing this when A is within some desired tolerance of B.
A simple implementation of this might involve storing "movement destination" point with each object, representing where it is trying to get each frame. Apply the above logic every frame in the object's update method (pseudocode):

if (target is assigned && !position.isWithinToleranceOf(target)) {
v = normalize(target - position)
position += speed * elapsedTime * v;
}
*/ 
enemyVector = new THREE.Vector3(cube2.position.x - enemy.position.x, 0, cube2.position.z - enemy.position.z).normalize();
//console.log(enemyVector);
enemy.lookAt(enemy.position.x + enemyVector.x * .01, 0, enemy.position.z + enemyVector.z * .01);
enemy.position.set(enemy.position.x + enemyVector.x * .01, 0, enemy.position.z + enemyVector.z * .01);
//enemy.position.set()
//console.log(enemy.position + " " + cube2.position);
enemyBB.copy(enemy.geometry.boundingBox).applyMatrix4(enemy.matrixWorld);
if (cube2BB.intersectsBox(enemyBB)) {

window.location.reload();
}
}

function animate() {


deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;
timeElapsed = clock.getDelta();
// we look for collisions in substeps to mitigate the risk of
// an object traversing another too quickly for detection.
updatePlayer( deltaTime );
updateTofu(deltaTime);
updateEnemy(deltaTime);
updateHeadBob(timeElapsed);

//cube4.position.set(cube4.x, cube4.y + Math.sin(performance.now() / 100), cube4.z);

sp.position.copy( camera.position ); // and reset spotlight position if camera moves
for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
keyInputs( deltaTime );

//camera.position.set(cube2.position.x, cube2.position.y, cube2.position.z);

//console.log(Math.sin(headBobTimer * 15) * .25);
if (headBobActive)
camera.position.set(cube2.position.x, cube2.position.y + Math.sin(performance.now() / 100) / 20, cube2.position.z);
else
camera.position.set(cube2.position.x, cube2.position.y + Math.sin(performance.now() / 220) / 60, cube2.position.z)
//console.log(Math.sin(headBobTimer * 15) * .25);

checkCollisions();
TWEEN.update();
}



//spHelper.update();
renderer.render( scene, camera );
requestAnimationFrame( animate );
}