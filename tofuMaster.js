import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';

//----------------------------VARIABLES----------------------------
var playerDirection = new THREE.Vector3();
var STEPS_PER_FRAME = 5;
const clock = new THREE.Clock();
var playerOnFloor = false;
const GRAVITY = 30;
const keyStates = {};
let controls;
var headBobActive = false;
var deltaTime;
var tofulist = [];
var timeElapsed = 0;
const maxSpeed = 0;
var collectedTofu = 0;
var isDead = false;
var image = "nobckroundtofumaster.png";
var physics = new THREE.Vector3();
var collectioncounter = 0;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
60, //fov
window.innerWidth / window.innerHeight, // aspect ratio
0.1, // near
20000 // far
);

const renderer = new THREE.WebGLRenderer({ antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);


//----------------------------AUDIO----------------------------
// create an AudioListener and add it to the camera
const backgroundListener = new THREE.AudioListener();
camera.add( backgroundListener );

// create a global audio source
const backgroundsound = new THREE.Audio( backgroundListener );
// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'eerie-ambience-6836.mp3', function( buffer ) {
backgroundsound.setBuffer( buffer );
backgroundsound.setLoop( true );
backgroundsound.setVolume( .5 );
backgroundsound.play();
});

const jumpScareListener = new THREE.AudioListener();
camera.add( jumpScareListener );
const jumpscarE = new THREE.Audio( backgroundListener );



//----------------------------player cube----------------------------
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

//----------------------------jonathan----------------------------

var loader = new THREE.TextureLoader();

// Load an image file into a custom material
var enemyimage = new THREE.MeshLambertMaterial({
map: loader.load(image)
});

const enemy = new THREE.Mesh(
new THREE.BoxGeometry(.5,.7,.1),
enemyimage
);
enemy.position.set(0,-.5,10);
enemy.castShadow = true;
enemy.recieveShadow = true;

let enemyBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
enemyBB.setFromObject(enemy);

// 4 is distance that u cant see him

console.log(Math.abs(cube2.position.x - enemy.position.x));
console.log(Math.abs(cube2.position.z - enemy.position.z));
setInterval(function() {
if (Math.abs(cube2.position.x - enemy.position.x) && Math.abs(cube2.position.z - enemy.position.z) >= 4.2)
enemy.position.set(
cube2.position.x + Boolean(Math.floor(Math.random() * 2)) ? -Math.round(2 + Math.random() * 10) : Math.round(2 + Math.random() * 10), 
0, 
cube2.position.z + Boolean(Math.floor(Math.random() * 2)) ? -Math.round(2 + Math.random() * 10) : Math.round(2 + Math.random() * 10));
console.log(Math.abs(cube2.position.x - enemy.position.x));
console.log(Math.abs(cube2.position.z - enemy.position.z));
}, 15000);

//----------------------------TOFU----------------------------

// createTofu( posx, posy, posz)
var cube1 = createTofu(3,-.3,0);
var cube3 = createTofu(-2,-.3,-3);
var cube4 = createTofu(-4,-.3,-3);
var cube5 = createTofu(-10,-.3, 14);
var cube6 = createTofu(10,-.3,-14);
var cube7 = createTofu(-20,-.3, 6);
var cube8 = createTofu(17,-.3, 15);
var cube8 = createTofu(-2,-.3, 19);
//----------------------------ground----------------------------

const plane1 = new THREE.Mesh(
new THREE.PlaneGeometry(50,50),
new THREE.MeshStandardMaterial({color: 0x000000})
);
plane1.position.set(0,-0.5, 0);
plane1.rotateX(-Math.PI / 2);
plane1.recieveShadow = true;

let groundbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
groundbox.setFromObject(plane1);


//----------------------------LIGHTS & FLASHLIGHT STUFF----------------------------
const sp = createSpotlight(0xffffff);

scene.add(cube2, plane1,sp, enemy);

controls = new PointerLockControls( camera, document.body );

scene.add( controls.getObject() );

camera.add( sp.target );
sp.target.position.set( 0, 0, -1 );

// const light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 1 );
// scene.add( light );

initEventListeners();
await initPhysics();
animate();


async function initPhysics() {
physics = await RapierPhysics();
}

// camera stuf

function updateHeadBob(timeElapsedS) {
if (headBobActive) 
headBobActive = false;
}
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

//tofu animation

new TWEEN.Tween(newTofu.position).to({y: newTofu.position.y - .1}, 1500)
.yoyo(true)
.repeat(Infinity)
.easing(TWEEN.Easing.Cubic.InOut).start();
new TWEEN.Tween(newTofu.rotation).to({y: "-" + (Math.PI/2) * 2}, 5000)
.repeat(Infinity)
.start();

return newTofu;
}

function initEventListeners() {
window.addEventListener( 'resize', onWindowResize );
const blocker = document.getElementById( 'blocker' );
const instructions = document.getElementById( 'instructions' );

instructions.addEventListener( 'click', function () {
controls.lock();
} );

controls.addEventListener( 'lock', function () {

instructions.style.display = 'none';
blocker.style.display = 'none';
$("#tofuNumber").show();
$("#counter").show();

} );

controls.addEventListener( 'unlock', function () {

blocker.style.display = 'block';
instructions.style.display = '';
$("#tofuNumber").hide();
$("#counter").hide();

} );
document.addEventListener( 'keydown', ( event ) => {

keyStates[ event.code ] = true;
} );
document.addEventListener( 'keyup', ( event ) => {
keyStates[ event.code ] = false;
} );
document.body.addEventListener( 'mousedown', () => {
//document.body.lock();
});
document.addEventListener( 'mouseup', () => {
});
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
$("#PickingUp").show();
if ( keyStates[ 'KeyE' ] ) {
console.log(collectioncounter++);

if (collectioncounter == 750) {
tofulist[tofu].collected = true; 
collectedTofu++;
document.getElementById("tofuNumber").innerHTML = collectedTofu;
scene.remove(tofulist[tofu].BB, tofulist[tofu].mesh);
tofulist.splice(tofu,1);
collectioncounter = 0;
$("#PickingUp").hide();
} 

} else {
collectioncounter = 0;
$("#PickingUp").hide();
}


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
$("#PickingUp").hide();
}

if ( keyStates[ 'KeyS' ] ) {
cube2.position.set(
cube2.position.x + getForwardVector().multiplyScalar( -speedDelta ).x, 
cube2.position.y, 
cube2.position.z + getForwardVector().multiplyScalar( -speedDelta ).z);
headBobActive = true; 
//playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );
$("#PickingUp").hide();
}

if ( keyStates[ 'KeyA' ] ) {
cube2.position.set(
cube2.position.x + getSideVector().multiplyScalar( -speedDelta ).x, 
cube2.position.y, 
cube2.position.z + getSideVector().multiplyScalar( -speedDelta ).z);
//playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
headBobActive = true;
$("#PickingUp").hide();
}

if ( keyStates[ 'KeyD' ] ) {
cube2.position.set(
cube2.position.x + getSideVector().multiplyScalar( speedDelta ).x, 
cube2.position.y, 
cube2.position.z + getSideVector().multiplyScalar( speedDelta ).z);
//playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
headBobActive = true;
$("#PickingUp").hide();
}
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

enemyVector = new THREE.Vector3(cube2.position.x - enemy.position.x, 0, cube2.position.z - enemy.position.z).normalize();
enemy.lookAt(enemy.position.x + enemyVector.x * .01, 0, enemy.position.z + enemyVector.z * .01);
enemy.position.set(enemy.position.x + enemyVector.x * .015, 0, enemy.position.z + enemyVector.z * .015);

enemyBB.copy(enemy.geometry.boundingBox).applyMatrix4(enemy.matrixWorld);
if (cube2BB.intersectsBox(enemyBB)) {
isDead = true;
}
}

function jumpscare() {
$("#jumpscareImage").show();
audioLoader.load( 'jjumpscare.mp3', function( buffer ) {
jumpscarE.setBuffer( buffer );
jumpscarE.setLoop( false );
jumpscarE.setVolume( 1 );
jumpscarE.play();
});

}

function onWindowResize() {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {


deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;
timeElapsed = clock.getDelta();
// we look for collisions in substeps to mitigate the risk of
// an object traversing another too quickly for detection.
if (isDead) {
jumpscare();
setTimeout(function() {
window.location.reload();
}, 2000);
}

updatePlayer( deltaTime );
updateTofu(deltaTime);
updateEnemy(deltaTime);
updateHeadBob(timeElapsed);


sp.position.copy( camera.position ); // and reset spotlight position if camera moves
for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
keyInputs( deltaTime );

if (headBobActive)
camera.position.set(cube2.position.x, cube2.position.y + Math.sin(performance.now() / 100) / 20, cube2.position.z);
else
camera.position.set(cube2.position.x, cube2.position.y + Math.sin(performance.now() / 220) / 60, cube2.position.z)

checkCollisions();
TWEEN.update();
}



//spHelper.update();
renderer.render( scene, camera );
requestAnimationFrame( animate );
}
