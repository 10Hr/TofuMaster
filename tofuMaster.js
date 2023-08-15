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
const maxSpeed = 0.08;
var collectedTofu = 0;
var isDead = false;
var image = "nobckroundtofumaster.png";
var collectioncounter = 0;
var started = false;
var directionRay = new THREE.Raycaster();
var sceneObjs = []; // all scene collidable objects
var objBBs = [];
var enemyVector;
var positionList = [];
const enemySpeed = .007;
const enemyGain = .006;
var distance

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

const jumpscarE = new THREE.Audio( backgroundListener );
const pickupDuring = new THREE.Audio( backgroundListener );
const pickupFinish = new THREE.Audio( backgroundListener );
const winAudio = new THREE.Audio( backgroundListener );
const heartBeat = new THREE.Audio( backgroundListener );

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

// 5 is distance that u cant see him

setInterval(function() {

distance = Math.sqrt(Math.pow((enemy.position.x - cube2.position.x),2) + Math.pow((enemy.position.z - cube2.position.z),2));
var plusX = Boolean(Math.floor(Math.random() * 2)) ? -6 : 6;
var plusZ = Boolean(Math.floor(Math.random() * 2)) ? -6 : 6;

if (distance >= 4.8)
enemy.position.set(
cube2.position.x + plusX, 
0, 
cube2.position.z + plusZ);
}, 15000);


//--------------------------------------------------------SCENE OBJECTS--------------------------------------------------------


//----------------------------TOFU----------------------------

//var spawnRad;
//function spawnTofu(numTofu) {

// for (let i = 0; i < numTofu; i++) {
// let x = (Math.random() * ((Math.random() * 2) >= 1 ? -22 : 22));
// let z = (Math.random() * ((Math.random() * 2) >= 1 ? -22 : 22));;

// for (let obj in positionList) {
// switch (positionList[obj].type) {
// case 'tree':
// spawnRad = positionList[obj].spawnR;
// if (x != positionList[obj].x && z != positionList[obj].z)
// createTofu(x,-.3,z);
// else
// createTofu(positionList[obj].x + (Math.random() * spawnRad),-.3,positionList[obj].z + (Math.random() * spawnRad));
// }

// }
// }
// }




//createTofu( posx, posy, posz)
createTofu(3,-.3,0);
createTofu(-2,-.3,-3);
createTofu(-4,-.3,-3);
createTofu(-10,-.3, 14);
createTofu(10,-.3,-14);
createTofu(-20,-.3, 6);
createTofu(17,-.3, 15);
createTofu(-2,-.3, 19);



//----------------------------ground----------------------------


const plane1 = new THREE.Mesh(
new THREE.PlaneGeometry(50,50),
new THREE.MeshStandardMaterial({color: 0x023020})
);
plane1.position.set(0,-0.5, 0);
plane1.rotateX(-Math.PI / 2);
plane1.recieveShadow = true;

let groundbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
groundbox.setFromObject(plane1);


//----------------------------WALLS----------------------------

// createWall(sizeX, sizeY, sizeZ, posX, posY, posZ) 
createWall(0.5, 3, 50, 25, 0, 0);
createWall(50, 3, .5, 0, 0, -25); 
createWall(0.5, 3, 50, -25, 0, 0); 
createWall(50, 3, .5, 0, 0, 25); 

//----------------------------TREES----------------------------

function range(num, low, high) {
if (num > low && num < high) {
return true;
}
return false;
}

// for (let i = 0; i < 150; i++) {
// let x = (Math.random() * ((Math.random() * 2) >= 1 ? -20 : 20));
// let z = (Math.random() * ((Math.random() * 2) >= 1 ? -20 : 20));
// createTree(x,z);

// }


function genTrees() {
createTree(-5.626847673019975, -17.177510846231087);
createTree(-3.4136329310716107, -10.848849096176876);
createTree(2.2675186066736863, -4.7630622812401135);
createTree(2.122801848253464, -11.438588307118579);
createTree(-10.888504877343333, 16.007484278422886);
createTree(14.086715767424964, 4.916757369456848);
createTree(-19.195517056631033, 8.947227698087165);
createTree(2.8960233989122397, 3.755561093414377);
createTree(-10.9162757703315, 9.66977620049651);
createTree(16.370186244668503, 19.282415088126434);
createTree(9.981020537240074, -3.671839755675572);
createTree(14.135984995198978, -9.05490344448686);
createTree(-5.9096127129885945, -7.278403903057424);
createTree(0.5043538604092257, 12.3308222575782);
createTree(1.933310248010227, 19.707495915661035);
createTree(-10.273595842296768, 2.5218184491946793);
createTree(7.10769251771211, -11.472033798215136);
createTree(19.515825937718386, 3.250269366936789);
createTree(-12.98768137784358, -16.7283144695841);
createTree(4.097015477771557, -7.12418139996581);
createTree(17.3411979851601, -7.57846070868704);
createTree(1.7797260691286931, 1.6882882816618894);
createTree(11.449324714409087, 7.389046110695769);
createTree(2.0441519697711863, -18.905364396213727);
createTree(13.729704270517363, 11.8040239715917);
createTree(-15.352084712106207, -4.529300140749846);
createTree(17.553494149923225, 14.63441475283731);
createTree(3.5353518430732267, -2.3680711144006894);
createTree(-15.77173103010351, -19.080498038010525);
createTree(-16.14547982058735, 18.681135144482237);
createTree(3.2735438521565197, 11.366309159038384);
createTree(4.414326539083211, -13.504079755499255);
createTree(-7.227643890202513, 19.296375097715128);
createTree(11.865216845693816, 14.246550557707893);
createTree(-1.8822569014018153, 1.9536987646581672);
createTree(-9.921934735819175, -11.80662962228829);
createTree(-2.7396598184934895, 19.109521649761646);
createTree(0.10289511002749219, -4.554985098966697);
createTree(10.617915951493323, 0.9166759078833753);
createTree(11.815897819400188, -6.964900237777232);
createTree(18.630046099955173, -3.9919654296016516);
createTree(-16.027501975416683, -15.218755580637055);
createTree(-19.061175767986693, 11.525740350220538);
createTree(7.748242989763212, 4.062694154903186);
createTree(6.870085062064941, 10.046334101326151);
createTree(8.541173893899895, -16.097502646268737);
createTree(-5.723757833783187, -11.73390458236117);
createTree(15.003564220497152, 14.28194799095344);
createTree(19.767994568432705, -1.2966294805405854);
createTree(-16.682686390627165, 10.956482647315045);
createTree(-12.529351640047125, 6.194485087105632);
createTree(17.143120020384668, -12.09155382404525);
createTree(5.02447738784058, 15.52375522322218);
createTree(18.88150423158676, 12.048189937919474);
createTree(2.5264142070572726, 16.757001091253663);
createTree(17.5264142070572726, -15.757001091253663);
createTree(16.5264142070572726, -18.757001091253663);
createTree(13.5264142070572726, -22.757001091253663);
createTree(17.5264142070572726, -20.757001091253663);
createTree(20.5264142070572726, -21.757001091253663);
createTree(16.5264142070572726, 6.757001091253663);
createTree(13.5264142070572726, 2.757001091253663);
createTree(-6.391383499403404, 0.08677861833347271)
createTree(-5.366946526935938, -1.5959683954832458)
createTree(-6.64603041324, -2.814960356081431)
createTree(-8.860263109594293, -3.354173869748373)
createTree(-9.285535995266459, -5.3209897113899) 
createTree(-10.198409409037376, -9.158591749068735)
createTree(-12.459997201694952, -10.324819368275756)
createTree(-12.20254507465323, -12.579938173660942)
createTree(-13.266492926059119, -13.127885183188756)
createTree(-15.969247201152987, -11.079116966780948)
createTree(-18.500989197432958, -9.744748991868319)
createTree(-20.75922840399402, -9.39796974414444)
createTree(-22.564178933343175, -11.602673195398928)
createTree(-21.511985286568596, -13.285500244866334)
createTree(-20.903752089368144, -16.05303794484962)
createTree(-19.394332890739392, -17.478549965502893)
createTree(-21.363305576684102, -20.462794836247685)
createTree(-22.891230618084943, -23.437800207659794)
createTree(-8.642113603637014, -5.870677489728487)
createTree(-8.382530045072743, -7.30025685293416)
createTree(-10.234803128654962, -7.703967076888157)
createTree(-12.392615805714813, -6.982976255915381)
createTree(-14.182891892673089, -7.523385294848326)
createTree(-16.254014778083615, -6.6666844940300845)
createTree(-18.366577828857388, -7.1708455362933226)
createTree(-20.15617930554425, -6.348578547323014)
createTree(-22.145878840957828, -5.658642983339684)
createTree(-21.951648177768185, -3.702861366210833)
createTree(-22.981082361877046, -2.1149394012031606)
createTree(-21.225798745338974, -1.5771061926097727)
createTree(-20.10443798696526, -2.632847222429223)
createTree(-18.591940298899146, -2.4428110883695573)
createTree(-18.441282308634413, -0.6941632315884668)
createTree(-19.611788951726044, 0.5140696835943763)
createTree(-18.734252551890137, 1.837286773773348)
createTree(-18.63568867201941, 3.525302583234201)
createTree(-20.17606349150579, 4.002089382852626)
createTree(-21.72483080431499, 5.668485661812289)
createTree(-20.618089517158214, 6.570253033198218)
createTree(-19.947212829193553, 4.9472396797762705)
createTree(-18.36194872503616, 5.4039173459065735)
createTree(-17.02245169879624, 4.209197676679391)
createTree(-16.542764349966898, 6.18248264316772)
createTree(-17.830691381804204, 7.786425540030138)
createTree(-14.331849573868356, 9.900127908840002)
createTree(-14.901396017652573, 11.983310362581951)
createTree(-13.845543416687809, 12.811881390980124)
createTree(-9.928253798506203, -0.13005932785752947)
createTree(-8.32439671552802, -1.5567006100672605)
createTree(-10.29484026287274, -2.941052730024099)
createTree(-11.571081888002734, -1.5067881847781657)
createTree(-13.544705530268903, -2.5530188230799618)
createTree(-13.548689334597432, -2.5526592357164573)
createTree(-13.552673138925961, -2.5522996483529528)
createTree(-13.55665694325449, -2.5519400609894483)
createTree(-13.560640747583019, -2.5515804736259438)
createTree(-13.564624551911548, -2.5512208862624393)
createTree(-16.01652913999538, -2.1339336335550403)
createTree(-16.424016768848013, -0.7524397738945899)
createTree(-15.1112311174576, 1.1330984496341643)
createTree(-14.981423121486117, 2.724739662844855)
createTree(-16.021871680974666, 3.8885712389320264)
createTree(-14.844822741595204, 6.456545429099479)
createTree(-16.287632933245654, 8.000460298790019)
createTree(-20.671051237572865, 7.955023712745527)
createTree(-20.63123865108105, 10.505064433845732)
createTree(-22.323009472029472, 12.006909414913897)
createTree(-23.353734990203204, 9.87756900592377)
createTree(-23.68181485901699, 13.304111696044247)
createTree(-22.926968097728647, 14.065573423634127)
createTree(-21.49694798160837, 15.423310502211065)
createTree(-21.47643357559406, 17.007931435172285)
createTree(-20.857793097927747, 18.50089604729898)
createTree(-18.24013704892589, 19.472024431732635)
createTree(-17.301285603821356, 21.41572258810638)
createTree(-11.292022680085752, -3.136910620121354)
createTree(-11.020439458810399, -1.0626203368812797)
createTree(-10.593522772703677, 0.5359190834439695)
createTree(-12.894969371099117, 0.3208778551179554)
createTree(-12.239826183158225, 1.6839855896817155)
createTree(-15.330617115658166, 7.322408891089222)
createTree(-16.76053055750813, 8.407780896952458)
createTree(-18.43395792457027, 6.727453282761533)
createTree(-20.501855606931723, 7.8024424029848705)
createTree(-20.180851814017, 2.7041040653377757)
createTree(-21.735385590735046, 2.3681360603323287)
createTree(-23.77191112627049, 3.711550630164606)
createTree(-24.11506386846355, 0.8289062200729305)
createTree(-18.46420481594013, -2.397848168117578)
createTree(-18.724643748705514, -5.632297061110377)
createTree(-12.642849823360507, 1.7631840728410644)
createTree(-11.237566603017513, 4.0282781064081865)
createTree(-10.21892621505243, 6.6871519561746675)
createTree(-4.654203252934188, 8.782808156311711)
createTree(-5.850415935261393, 10.149980946953455)
createTree(-5.167706750194325, 11.47861344324338)
createTree(-3.5310918681312002, 11.616411877007073)
createTree(-2.0015304463508614, 11.298864801061889)
createTree(-1.3139176135286494, 10.407188585893653)
createTree(-0.35774423944653233, 10.181121297100807)
createTree(0.5771512041019201, 8.830409071110136)
createTree(0.5904607246736872, 7.638919566111188)
createTree(0.1852100842260849, 6.314459573662811)
createTree(-0.12793549158128784, 5.263561359425192)
createTree(-0.12885906959525362, 5.257228350373239)
createTree(-0.1297826476092194, 5.250895341321287)
createTree(-0.13070622562318518, 5.244562332269334)
createTree(-0.13162980363715096, 5.238229323217381)
createTree(-0.13255338165111674, 5.231896314165429)
createTree(-0.28349525698691824, 4.100365807157872)
createTree(0.3173512675556632, 3.548443950573631)
createTree(1.4209569850165364, 3.9147009957287318)
createTree(3.2877711694735625, 5.337945943651018)
createTree(4.562891119583031, 4.567098609728001)
createTree(5.823765436534903, 4.547020259621854)
createTree(6.524417505714367, 5.483465747013127)
createTree(7.148892740417328, 5.8662499216622335)
createTree(8.326724597866784, 5.861567315148445)
createTree(8.912813026102471, 6.9243698072680395)
createTree(9.114470705886253, 8.003576855563308)
createTree(9.977894630496492, 8.494955064340086)
createTree(9.72070555969715, 10.050636824722732)
createTree(8.79852904706534, 11.015330478340601)
createTree(8.417020363767731, 12.371193905969653)
createTree(9.185782272355999, 13.019703036799573)
createTree(9.191729542694235, 13.022067349706937)
createTree(9.197676813032471, 13.024431662614301)
createTree(9.203624083370707, 13.026795975521665)
createTree(9.209571353708943, 13.02916028842903)
createTree(10.234252039552468, 13.829166783037001)
createTree(4.089828690269684, 23.085270480300803)
createTree(2.700026771979645, 22.341218826167967)
createTree(1.0740222381024482, 22.714200261321224)
createTree(0.16813610391735903, 21.12129084878851)
createTree(-0.8978706179978323, 20.85347288242228)
createTree(-1.8583955917326864, 21.85470412803638)
createTree(-3.7318777972411596, 22.898575739499602)
createTree(-8.415164506583391, 22.070407463286987)
createTree(-9.28269479320202, 21.151139171467552)
createTree(-10.30935277456902, 21.399523266829245)
createTree(-11.140448384181024, 22.12259049266739)
createTree(-12.144621349641916, 22.606274974500835)
createTree(-13.37903683525249, 22.334047276859057)
createTree(-13.878203836429938, 21.484818824979623)
createTree(-13.834528972546329, 20.430697558901702)
createTree(-14.251387411489732, 18.195032914999267)
createTree(-15.344658084445046, 17.894971326960125)
createTree(-16.538023254825706, 16.712799569296514)
createTree(-17.637923793728014, 16.855888459573187)
createTree(-18.682255073143097, 17.209494893822896)
createTree(-20.793233288435584, 15.449749179718738)
createTree(-20.702913080368514, 13.87151708972237)
createTree(-21.073989683900482, 11.438452289403948)
createTree(-21.5301422922411, 8.583741524330812)
createTree(-1.9073215559957741, 13.051251046471302)
createTree(-3.207532704801374, 13.065219858539983)
createTree(-4.457918941457019, 13.602253740217598)
createTree(-4.464862903915973, 14.79137887033757)
createTree(-4.463825482943024, 16.020685756832112)
createTree(-5.025742122930749, 17.26776797650628)
createTree(-6.7177169653835485, 17.437685842353375)
createTree(-8.520271193384751, 17.566637789427276)
createTree(-9.266990156991323, 19.41872283050162)
createTree(-11.340677307154689, 19.546243441821776)
createTree(-12.842831040665267, 19.200925205625452)
createTree(-13.296665826165327, 20.626048186243054)
createTree(-15.338383738873057, 21.190931828591253)
createTree(-16.463611232504547, 23.094102443733416)
createTree(-18.179913167893094, 20.966254946208547)
createTree(-19.10257389719045, 21.86454881890115)
createTree(-20.084242645876056, 22.89202324877725)
createTree(-20.956688899660694, 23.489481164526918)
createTree(-21.918352998717577, 22.832954367502587)
createTree(-23.35461227407374, 21.98070561558478)
createTree(-22.792327554090928, 20.316657535880108)
createTree(-22.60779993130657, 18.205670772893814)
createTree(-23.67206599540746, 15.885245070797625)
createTree(-19.77227528925989, 24.25728731241607)
createTree(-19.06687659234948, 22.956644006953315)
createTree(-17.13128452875833, 23.756283815733035)
createTree(-15.331016546620043, 22.76877651836614)
createTree(-14.072723135246003, 23.95984864418576)
createTree(-12.633722617813689, 23.880383933077027)
createTree(-9.711588098287919, 23.374167752134607)
createTree(-5.406004190022995, 16.879468119033216)
createTree(-4.700331521218328, 18.58463607122186)
createTree(-6.0243319572022624, 20.37438414220805)
createTree(-4.617672121736076, 21.95952279617181)
createTree(-2.1567655350250425, 23.24164748067732)
createTree(0.24501445044919878, 20.731750068094392)
createTree(6.705597634329896, 20.936145478345622)
createTree(7.871963281779215, 21.74957504837007)
createTree(8.773714578936048, 18.597392561162565)
createTree(10.708733745704524, 19.088765448960068)
createTree(8.045505242973954, 16.62636967956745)
createTree(9.297850576807141, 15.365314708210116)
createTree(11.331638182524369, 15.438550620056652)
createTree(13.191618191207713, 15.206478265122927)
createTree(14.95622893848563, 16.75559729548986)
createTree(14.748747541168859, 18.99759148390588)
createTree(15.488712659675688, 20.66942313273937)
createTree(18.4758888510034, 20.752345946901492)
createTree(18.662665384015312, 22.654563843245242)
createTree(20.206025912495708, 23.08135045008649)
createTree(21.65578581946035, 21.85354611354464)
createTree(22.83133533911713, 22.54828673243512)
createTree(23.972071726157317, 23.13100005173275)
createTree(23.987917337389234, 20.77017583233713)
createTree(22.890650800162348, 19.36098624960525)
createTree(23.66743971080544, 16.185842302337484)
createTree(22.161973185924268, 15.2395465225653)
createTree(20.004253396667465, 14.952661576820129)
createTree(18.61961311402432, 13.87341501244198)
createTree(16.644833609884987, 12.930780835126555)
createTree(15.07328530295051, 12.9270270835339)
createTree(12.523392413214351, 12.539246957087592)
createTree(10.528137835620727, 13.561777233610593)
createTree(8.497312679609996, 14.021417952047988)
createTree(-14.23934540103996, -7.870644365862475)
createTree(-14.235394757316893, -8.593716820788448)
createTree(-15.248244501307065, -8.988584606485638)
createTree(-17.28653311052886, -8.631707739114306)
createTree(-19.473286888616492, -7.426356432473142)
createTree(-20.190807628047853, -10.293426395826943)
createTree(-22.335088068057196, -8.956566573923894)
createTree(-21.206042238566916, -7.205979314734663)
createTree(-23.938679067409243, -10.231952379977931)
createTree(-22.967026727682462, -13.044672473962542)
createTree(-24.332613674279173, -14.37228497623116)
createTree(-23.802306778940103, -15.61546562344679)
createTree(-22.694750703292925, -16.226680206458767)
createTree(-23.193090664071008, -17.894528111254747)
createTree(-21.099886774958296, -18.59949915071002)
createTree(-19.721435518616968, -20.100617247760898)
createTree(-19.56930104853793, -21.649308571886735)
createTree(-20.746447791695726, -22.2093723368145)
createTree(-22.597075899909793, -21.271209518295656)
createTree(-23.649188852748555, -22.24239924907742)
createTree(-20.839040251635726, -24.202260800203877)
createTree(-19.567888327367143, -23.51255913812531)
createTree(-17.265142284253262, -24.18267289008261)
createTree(-15.909041314509157, -23.092409679287478)
createTree(-15.72979825200489, -22.082821981534)
createTree(-14.74941110420986, -21.412412922631834)
createTree(-15.416061414572312, -19.776566547297456)
createTree(-13.975202244702999, -19.346728377048628)
createTree(-15.100846169951666, -17.0367469263992)
createTree(-13.524843643496048, -15.567825666896377)
createTree(-12.00658894056638, -14.470891400271057)
createTree(-13.351383975948506, -13.066349971207842)
createTree(-13.70830284512095, -12.059432966026355)
createTree(-11.726494354911368, -11.414270890915567)
createTree(-11.222615796013256, -8.914348502784277)
createTree(-12.569899963026302, -8.321203682171447)
createTree(-14.151342629906024, -9.029950155727226)
createTree(-14.594824373833909, -7.180033706087398)
createTree(-16.608507480575902, -8.496068954356211)
createTree(-17.89396839641703, -5.997822101925159)
createTree(-12.629830472208264, -1.0066492764909305)
createTree(-14.163330627083653, -1.4645413260662474)
createTree(-14.926862386613198, -2.6705542194004948)
createTree(-13.506471650116117, -3.72601010777159)
createTree(-13.516168114743657, -5.127241922119462)
createTree(-14.369450818942846, -6.159502050826039)
createTree(-3.400864095359719, -4.7384228022868085)
createTree(-5.253405557622143, -4.562243483138702)
createTree(-5.075278894616137, -2.0381345636757313)
createTree(-1.2497208795150616, 9.486464608874622)
createTree(-0.5675045261320164, 10.833801346103616)
createTree(-1.495330193289247, 12.327920580616999)
createTree(-0.14770933589921126, 13.32693476839277)
createTree(-1.3141623336109411, 14.640816629831003)
createTree(-2.002822239786035, 15.503966447945766)
createTree(-0.7175952895252047, 15.375866424105352)
createTree(0.9290990910013248, 15.303744186602858)
createTree(1.36498793796016, 16.54672421111765)
createTree(-0.003288702924170746, 17.523465244426355)
createTree(0.6012727417999412, 18.814303442169724)
createTree(1.3131103616701394, 20.556740586785864)
createTree(0.035539504636337114, 20.953284283010795)
createTree(-1.220687655545914, 22.892000893616117)
createTree(-2.5412185805637684, 23.400650194294982)
createTree(-3.3178429929769733, 21.61648721173113)
createTree(-4.430848222451291, 20.431396934817656)
createTree(-6.347601812076515, 21.259301396913923)
createTree(-7.585175742161749, 20.63693229678818)
createTree(-9.429405746518192, 21.234434790964933)
createTree(-10.087139965961326, 19.973501967116622)
createTree(-8.403715800589625, 20.704438906714746)
createTree(-7.437241395848956, 8.111792578650387)
createTree(-6.8322109682973995, 9.416629493125264)
createTree(-6.348539804203162, 10.885003829871485)
createTree(-7.464175589140193, 11.658918044494806)
createTree(-6.110614090840541, 13.008020026830325)
createTree(-5.95574308871882, 13.999939492164515)
createTree(-7.181830127209655, 14.434948139766552)
createTree(-7.094498944938366, 15.48245613156908)
createTree(-7.581786954584771, 16.714454480134528)
createTree(-8.70743127928134, 16.342264100673333)
createTree(-9.177250075886569, 17.352304913100202)
createTree(-9.544589239426246, 18.228182977598454)
createTree(-10.558170914430224, 17.167190274720422)
createTree(-11.567812481938134, 16.439791772623987)
createTree(-11.57461247311383, 16.439780817695343)
createTree(-11.581412464289524, 16.4397698627667)
createTree(-11.58821245546522, 16.439758907838055)
createTree(-11.595012446640915, 16.43974795290941)
createTree(-11.602212437297533, 16.4397363535732)
createTree(-11.609412427954151, 16.439724754236988)
createTree(-11.616612418610769, 16.439713154900776)
createTree(-11.623812409267387, 16.439701555564564)
createTree(-11.631012399924005, 16.439689956228353)
createTree(-12.717679074046064, 16.74988908611271)
createTree(-13.037865465767242, 15.583604494087664)
createTree(-13.630412336748076, 14.312556085503887)
createTree(-14.537228073469574, 15.082748483247233)
createTree(-16.696962615701615, 15.457864037097584)
createTree(-17.614188104786205, 13.02849778601625)
createTree(-19.515829535185837, 14.397468521818551)
createTree(-20.2013851613744, 15.977317134270173)
createTree(-19.664551468207176, 18.845701647362368)
}
genTrees();

//----------------------------LOCATIONS----------------------------
function genWalls() {
createWall(1,2,1,0,0,0)

// createWall(sizeX, sizeY, sizeZ, posX, posY, posZ) 
createWall(.2,1,4,-12,-.4,13);
createWall(.2,1,4,-9,-.4,13);
createWall(2,1,.2,-11,-.4,13);

createWall(4, 1, .2, 9, -.4, -3);

createWall(1, 5, .2, 9, -.4, -3);

createWall(.2, 5, 1, -4, -.4, -1);
createWall(1, 5, .2, -10, -.4, -20);
createWall(.2, 1, 1, -6, -.4, -12);
createWall(1, 5, .2, -9, -.4, -18);

createWall(1, 1, .2, -1, -.4, -7);
createWall(.2, 5, 1, -3, -.4, -12);

createWall(.2, 5, 1, -21, -.4, -4);
createWall(1, 5, .2, 10, -.4, -20);
createWall(.2, 1, 1, -18, -.4, -12);

//createWallR(.2, .1, 1, 4, -.4, -4, -Math.PI / 8);
createWall(3, 1, .2, 11, -.4, -15)

createWall(.2, 1, 3, 9.5, -.4, -15)

createWall(3, 1, .2, 9.5, -.4, -13.5)

createWall(1, 1, 1, -23.668399252988227, -.4, 23.735024385965843)
createWall(1, 1, 1, -13.806192121604536, -.4, 4.5402183383396775)

createWall(.2, 1, 3, 13.403863925707052, -.4, 18.40870919936019)
createWall(.2, 1, 1, 11.155409596243187, -.4, 22.054285025125726)
createWall(1, 1, .2, 9.539239321087008, -.4, 20.267394197904284)
createWall(1, 1, 3, 7.259668611220043, -.4, 18.274816000867144)
createWall(.2, 1, .2, 5.225019738863866, -.4, 18.90942763247174)
createWall(1, 1, 1, 4.622421166647473, -.4, 20.844677034010807)
createWall(5, 1, .2, 6.293276381173117, -.4, 22.496743417925213)
createWall(.2, 1, 3, -7.326144994113812, -.4, 23.491899953448964)

createWall(.2, 3, .2, -5.119697803966522, -.4, 2.9312017528412038)
createWall(.2, 6, .2, -6.591104286763948, -.4, 4.6402709559340645)
createWall(.2, 1, .2, -8.129192316888663, -.4, 2.6214519991906533)
createWall(.2, 7, .2, -9.643358605599879, -.4, 3.963412956459131)
createWall(.2, 5, .2, -8.619347441009682, -.4, 5.406135402849062)
createWall(.2, 2, .2, -5.495048629122619, -.4, 5.078653209998563)
createWall(.2, 3, .2, -3.8975912919074203, -.4, 3.959720529550446)
createWall(.2, 2, .2, -2.229685276844566, -.4, 5.734258645488502)
createWall(.2, 5, .2, -2.328835434774645, -.4, 8.00120715809443)
createWall(.2, 4, .2, -3.726265800037482, -.4, 5.441653868010487)
createWall(.2, 1, .2, -3.7870511404348624, -.4, 6.895391756288746)
createWall(.2, 2, .2, -5.353365966749354, -.4, 7.043122895663194)
createWall(.2, 8, .2, -5.6069383026033135, -.4, 8.222643590899017)

}

genWalls();
//spawnTofu(8);
//-----------------------------------------------------------------------------------------------------------------------------


//----------------------------LIGHTS & FLASHLIGHT STUFF----------------------------


const sp = createSpotlight(0xffffff);

scene.add(cube2, plane1,sp, enemy);

controls = new PointerLockControls( camera, document.body );

scene.add( controls.getObject() );

camera.add( sp.target );
sp.target.position.set( 0, 0, -1 );

//const light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 1 );
//scene.add( light );

initEventListeners();
animate();


// camera stuf

function updateHeadBob() {
if (headBobActive) 
headBobActive = false;
}


//----------------------------------METHODS----------------------------------

function createTree(posX, posZ) {
// used for procedurally generating new tree map
for (let tofu in tofulist) {
if (posX == tofulist[tofu].mesh.position.x && posZ == tofulist[tofu].mesh.position.z) {
return;
} 
}

for (let wall in objBBs) {
if (range(posX, objBBs[wall].position.x - 2, objBBs[wall].position.x + 2) && range(posZ, objBBs[wall].position.z - 2, objBBs[wall].position.z + 2)) {
return;
} 
}

var sphere = new THREE.Mesh( 
new THREE.SphereGeometry( .6, 32, 16 ),
new THREE.MeshPhongMaterial({color: 0x4b5d16})
);


var cylinder = new THREE.Mesh( 
new THREE.CylinderGeometry( .1, .1, 2, 32 ),
new THREE.MeshPhongMaterial({color: 0x8c6258})
);
cylinder.castShadow = true;

cylinder.position.set(posX, 0, posZ);
sphere.position.set(cylinder.position.x ,cylinder.position.y + 1, cylinder.position.z);
scene.add( sphere );
scene.add( cylinder );
objBBs.push(cylinder);

let objPosition = {type: "tree", x: posX, z: posZ};
//console.log("createTree(" + posX + ", " + posZ + ");");
positionList.push(objPosition);

}

function createWall(sizeX, sizeY, sizeZ, posX, posY, posZ) {

let wall = new THREE.Mesh(
new THREE.BoxGeometry(sizeX,sizeY,sizeZ),
new THREE.MeshPhongMaterial({color: 0x848482})
);
wall.position.set(posX, posY, posZ);
wall.castShadow = true;
wall.recieveShadow = false;
wall.shininess = 20;
scene.add(wall);

objBBs.push(wall);
}

function createTofu(x, y, z) {
let newTofu = new THREE.Mesh(
new THREE.BoxGeometry(0.2, 0.2, 0.2),
new THREE.MeshLambertMaterial({
map: loader.load('tofuTexture.png') 
}));
newTofu.position.set(x,y,z);
newTofu.castShadow = true;
newTofu.recieveShadow = false;
newTofu.shininess = 20;
let newTofuBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
newTofuBB.setFromObject(newTofu);
scene.add(newTofu);
var tofuObj = {mesh: newTofu, BB: newTofuBB, collected: false};

tofulist.push(tofuObj);

let objPosition = {type: "tofu", spawnR: 2, x: x, z: z};
positionList.push(objPosition);

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
if (collectedTofu != 8) {
controls.lock();
if (!heartBeat.isPlaying) {
audioLoader.load( 'heartbeat.mp3', function( buffer ) {
heartBeat.setBuffer( buffer );
heartBeat.setLoop( true );
heartBeat.setVolume(0);
heartBeat.play();
});
}
if (backgroundsound.isPlaying == false) {
audioLoader.load( 'eerie-ambience-6836.mp3', function( buffer ) {
backgroundsound.setBuffer( buffer );
backgroundsound.setLoop( true );
backgroundsound.setVolume( .5 );
backgroundsound.play();
});
}
}
} );

controls.addEventListener( 'lock', function () {

instructions.style.display = 'none';
blocker.style.display = 'none';
$("#tofuNumber").show();
$("#counter").show();
started = true;

} );

controls.addEventListener( 'unlock', function () {
if (collectedTofu != 8) {
blocker.style.display = 'block';
instructions.style.display = '';
$("#tofuNumber").hide();
$("#counter").hide();
}
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
collectioncounter++;
//console.log(collectioncounter);
if (pickupDuring.isPlaying == false) {
audioLoader.load( 'pickupDuring.mp3', function( buffer ) {
pickupDuring.setBuffer( buffer );
pickupDuring.setLoop( false );
pickupDuring.setPlaybackRate(2);
pickupDuring.setVolume( .5 );
pickupDuring.play();
});
}
if (collectioncounter == 850) {
pickupDuring.stop();
audioLoader.load( 'pickupFinish.mp3', function( buffer ) {
pickupFinish.setBuffer( buffer );
pickupFinish.setLoop( false );
pickupFinish.setVolume( .5 );
pickupFinish.play();
});
tofulist[tofu].collected = true; 
collectedTofu++;
document.getElementById("tofuNumber").innerHTML = collectedTofu;
scene.remove(tofulist[tofu].BB, tofulist[tofu].mesh);
tofulist.splice(tofu,1);
collectioncounter = 0;
$("#PickingUp").hide();
} 
} else {
pickupDuring.stop();
collectioncounter = 0;
$("#PickingUp").hide();
}


}
}
}

function wallCollisions(dirX, dirZ) {
directionRay.set(
cube2.position,
new THREE.Vector3(
dirX,
0,
dirZ));
// need to make it so tihs only activates if raycasts hits something then return that obj.
return directionRay.intersectObjects(objBBs);


}

function movePlayer(velX, velZ) {
cube2.position.set(
cube2.position.x + ((Math.abs(velX) >= maxSpeed) * (((velX < 0) * -1) * maxSpeed) + (Math.abs(velX) < maxSpeed) * velX), 
cube2.position.y, 
cube2.position.z + ((Math.abs(velZ) >= maxSpeed) * (((velZ < 0) * -1) * maxSpeed) + (Math.abs(velZ) < maxSpeed) * velZ));
headBobActive = true;
}

function keyInputs( deltaTime ) {

// gives a bit of air control
const speedDelta = deltaTime * ( playerOnFloor ? 3 : 2 );
var velX;
var velZ;
var walldistance = .5;
if (started) {
if ( keyStates[ 'KeyW' ] ) {
velX = getForwardVector().multiplyScalar( speedDelta ).x;
velZ = getForwardVector().multiplyScalar( speedDelta ).z;

const intersects = wallCollisions(velX, velZ);
if (intersects.length)
if (intersects[0].distance < walldistance)
return;

movePlayer(velX,velZ);
$("#PickingUp").hide();
}

if ( keyStates[ 'KeyS' ] ) {

velX = getForwardVector().multiplyScalar( -speedDelta ).x;
velZ = getForwardVector().multiplyScalar( -speedDelta ).z;

const intersects = wallCollisions(velX, velZ);
if (intersects.length)
if (intersects[0].distance < walldistance)
return;

movePlayer(velX,velZ);
$("#PickingUp").hide();
}

if ( keyStates[ 'KeyA' ] ) {

velX = getSideVector().multiplyScalar( -speedDelta ).x;
velZ = getSideVector().multiplyScalar( -speedDelta ).z;

const intersects = wallCollisions(velX, velZ);
if (intersects.length)
if (intersects[0].distance < walldistance)
return;

movePlayer(velX, velZ);

$("#PickingUp").hide();
}

if ( keyStates[ 'KeyD' ] ) {

velX = getSideVector().multiplyScalar( speedDelta ).x;
velZ = getSideVector().multiplyScalar( speedDelta ).z;

const intersects = wallCollisions(velX, velZ);
if (intersects.length)
if (intersects[0].distance < walldistance)
return;

movePlayer(velX,velZ);

$("#PickingUp").hide();
}
}
// if ( keyStates[ 'KeyQ' ] ) {
// console.log("createTree(" + cube2.position.x + ", " + cube2.position.z + ")")
// }
// if ( keyStates[ 'KeyX' ] ) {
// console.log("createWall(1, 1, 1, " + cube2.position.x + ", -.4, " + cube2.position.z + ")")
// }
//if (keyStates['KeyF']) {
// collectedTofu = 8;
// }
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

function updateEnemy(deltaTime) {

var tofuPLUSPLUS = collectedTofu / 304.34;
var dist = Math.sqrt(Math.pow((enemy.position.x - cube2.position.x),2) + Math.pow((enemy.position.z - cube2.position.z),2));

enemyVector = new THREE.Vector3(cube2.position.x - enemy.position.x, 0, cube2.position.z - enemy.position.z).normalize();

enemy.lookAt(enemy.position.x + enemyVector.x * .01, 0, enemy.position.z + enemyVector.z * .01);
enemy.position.set(
enemy.position.x + enemyVector.x * ((.015 > (enemyGain + tofuPLUSPLUS)) * enemySpeed + (.015 <= (enemyGain + tofuPLUSPLUS)) * (enemyGain + tofuPLUSPLUS)), 
0, 
enemy.position.z + enemyVector.z * ((.015 > (enemyGain + tofuPLUSPLUS)) * enemySpeed + (.015 <= (enemyGain + tofuPLUSPLUS)) * (enemyGain + tofuPLUSPLUS)));

//const enemySpeed = .007;
//const enemyGain = .006;

//enemy.position.set(enemy.position.x + enemyVector.x * .007, 0, enemy.position.z + enemyVector.z * .007); // andre settings?

enemyBB.copy(enemy.geometry.boundingBox).applyMatrix4(enemy.matrixWorld);
if (cube2BB.intersectsBox(enemyBB)) {
isDead = true;
}

if (dist <= 7) {
heartBeat.setVolume(inverse_rsqrt(dist) * 1.2);
} else
heartBeat.setVolume(0); 
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

function winGame() {

if (heartBeat.isPlaying) 
heartBeat.stop();
if (winAudio.isPlaying == false) {
backgroundsound.stop();
audioLoader.load( 'winMusic.mp3', function( buffer ) {
winAudio.setBuffer( buffer );
winAudio.setLoop( true );
winAudio.setVolume( .5 );
winAudio.play();
});
$("#winScreen").show();
$("#winStructions").show();
}
}

// didnt think id need this but oh well
function inverse_rsqrt(number) {
const threehalfs = 1.5;
let x2 = number * 0.5;
let y = number;
// evil floating point bit level hacking
let i = new Int32Array(new Float32Array([y]).buffer)[0];
// value is pre-assumed
i = 0x5f3759df - (i >> 1);
y = new Float32Array(new Int32Array([i]).buffer)[0];
// 1st iteration
y = y * (threehalfs - (x2 * y * y));
return y;
}

function animate() {

if (collectedTofu == 8) {
//console.log("game Over!");
winGame();
return;
}

deltaTime = Math.min( 0.05, clock.getDelta() ) / STEPS_PER_FRAME;

if (isDead) {
jumpscare();
setTimeout(function() {
window.location.reload();
}, 2000);
}

updatePlayer( deltaTime );
updateTofu(deltaTime);
if (started) {
updateEnemy(deltaTime);
}
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
renderer.render( scene, camera );
requestAnimationFrame( animate );

}

