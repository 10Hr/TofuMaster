<html>
<script async src="https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"></script>

<script type="importmap">
{
"type": "module",
"imports": {
"three": "https://unpkg.com/three/build/three.module.js",
"three/addons/": "https://unpkg.com/three/examples/jsm/"
}
}
</script>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>

</html>

<!DOCTYPE html>
<html>
<title>My first three.js app</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
<style>
#blocker {
position: absolute;
width: 100%;
height: 100%;
background-color: "white";
}

body { margin: 0; color: white; }

#instructions {
width: 100%;
height: 100%;

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

text-align: center;
font-size: 14px;
cursor: pointer;
}
#counter {
position: absolute;
width: 100%;
height: 100%;
background-color: "white";
}
</style>
</head>
<body>
<div id = "counter">
<p style = "font-size:40px; position:absolute; left:3%; top:2%;">
Collected: </p>
<p id = "tofuNumber" style = "font-size:40px; position:absolute; left:13%; top:2%;">
0 </p>
</div>

<div id="blocker">

<div id="instructions">
<p style = "
font-size: 100px;
color: #990000;
">
FIND THE 8 TOFUS
</p>

<p style = "
font-size: 20px;
color: #990000;
">
Click to Play<br/>
Move: WASD
</p>
</div>
</div>
<script src="https://cdn.jsdelivr.net/gh/kripken/ammo.js@HEAD/builds/ammo.js"></script>
<script type="module" src="tofuMaster.js"></script>
</body>
</html>

<?php /* 
<style>
#blocker {
position: absolute;
width: 100%;
height: 100%;
background-color: "white";
}

body { margin: 0; color: white; }

#instructions {
width: 100%;
height: 100%;

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

text-align: center;
font-size: 14px;
cursor: pointer;
}
</style>
</head>
<body>
<div id="blocker">
<div id="instructions">
<p style="font-size:36px">
TofuMaster
</p>
<p>
Click to Play<br/>
Move: WASD<br/>
Jump: SPACE<br/>
Look: MOUSE
</p>
</div>
</div>

*/?>