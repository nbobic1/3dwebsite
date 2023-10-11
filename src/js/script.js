import * as THREE from 'three';
import { AxesHelper, Box2, TorusGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import LocomotiveScroll from 'locomotive-scroll';
//importing 3D object
const monkeyUrl = new URL('../assets/aurora.glb', import.meta.url);
const renderer = new THREE.WebGLRenderer({ antialias: true });
	//shadows
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	 renderer.setSize(window.innerWidth, window.innerHeight);
	 document.body.appendChild(renderer.domElement);
	// renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();

//const camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000);
//camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 60;
	camera.position.y = 	20;
	camera.position.x=-10;
//var controls;

// const controls = new THREE.OrbitControls(camera);
// controls.target.set(0, 5, 0);
// controls.update();
let animationLength,prevScrollValue=0;
//const hemiLight = new THREE.HemisphereLight( 0xFFFFFF, 0xffffff, 1);
var roti = true;
var rot_val = 0;
const hemiLight = new THREE.DirectionalLight(0xffffff, 1.2);
	hemiLight.position.x = 20;
	hemiLight.position.y = 20;
	hemiLight.position.z = 120;
	hemiLight.castShadow = true;
	hemiLight.shadow.mapSize.width = 512; // default
	hemiLight.shadow.mapSize.height = 512; // default
	hemiLight.shadow.camera.left = -100;
	hemiLight.shadow.camera.right = 100;
	hemiLight.shadow.camera.top = 100;
	hemiLight.shadow.camera.bottom = -100;
	hemiLight.target.position.set(-10, 0, -4);
//	const hemiLight =new THREE.HemisphereLight( 0xffffdf, 0xf8f8ff, 2 );
	scene.add(hemiLight);

var loader = new THREE.TextureLoader();
var materialert = new THREE.MeshLambertMaterial({
	map: loader.load(new URL('../assets/Untitled.png', import.meta.url)),
	transparent: true,
	opacity: 0,
	reflectivity: 0,
});

var geometryert = new THREE.PlaneGeometry(150, 80);
var meshert = new THREE.Mesh(geometryert, materialert);
	scene.add(meshert);
	meshert.position.set(0, 0, 5);

var geometry1 = new THREE.PlaneGeometry(300, 200);
const material4 = new THREE.MeshPhongMaterial({ color: 0xffffff });
var mesh3 = new THREE.Mesh(geometry1, material4);
mesh3.receiveShadow = true;
scene.add(mesh3);
mesh3.position.set(0, 0, -10);
/*
        const geometry6 = new THREE.BoxGeometry( 10, 32,5 );
        const material6 = new THREE.MeshPhongMaterial( { color: 0xffffff,
            shading: THREE.FlatShading} );
        const circle = new THREE.Mesh( geometry6, material6 );
       // circle.castShadow=true;
        circle.receiveShadow=true;
        scene.add( circle );
        circle.position.set(0,5,30);
        const material61 = new THREE.MeshPhongMaterial( { color: 0x00ff00,
            shading: THREE.FlatShading} );
        const circle2 = new THREE.Mesh( geometry6, material61 );
        circle2.castShadow=true;
       // circle2.receiveShadow=true;
        scene.add( circle2 );
        circle2.position.set(8,7,40); */
/*const helper = new THREE.DirectionalLightHelper( hemiLight );
scene.add( helper );*/
let mixer,aniLen=[] //need this for animatons
//importing/loading 3d object to scene, and setting it up
const assetLoader = new GLTFLoader();
			assetLoader.load(
				monkeyUrl.href,
				function (gltf) {
					gltf.scene.traverse(function (node) {
						if (node.isMesh || node.isLight) node.castShadow = true;
					});
					gltf.castShadow = true;
					const model = gltf.scene;
					//animation setup
					mixer=new THREE.AnimationMixer(model)
					console.log('ni',model)
					const clips=gltf.animations
					clips.forEach( function ( clip,index ) {
						var animation=mixer.clipAction( clip )
					 	animation.setLoop(THREE.LoopOnce)
						console.log('animation name',animation._clip.name,animation)
						animation.clampWhenFinished = true;
						aniLen.push(animation._clip.duration)
						console.log('adfa',animation._clip.duration)
						animation.play();
					} );
					//model.rotation.z=Math.PI/3;
					// model.rotation.y=Math.PI/2;
					//setup initial position of object and add i to scene
					model.castShadow = true;
					model.position.x = 0;
					model.position.z = 0;
					model.position.y = 0;
					//model.rotateY(3.14/2)
					//model.rotateZ(3.14)
					//model.rotateX(Math.PI*4/7)
					scene.add(model);

					console.log('radi');
				},
				undefined,
				function (err) {
					console.error(err);
				}
			);
const clock=new THREE.Clock()
function animate() {
	// if(mixer)
	// {
		
	// console.log('scrol',scrollPercent/100*aniLen[1])
	// 	mixer.forEach((mixer1,index)=>{
	// 			mixer1.update((scalePercent-prevScrollValue)/100*aniLen[index])
	// 	})
	// 	prevScrollValue=scalePercent
	// }
	if(mixer)
	mixer.update(clock.getDelta())
	//playScrollAnimations();
	//helper.update();
	renderer.render(scene, camera);
}

k = 0;
window.scrollTo({ top: 0, behavior: 'smooth' });
/*document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100;  
}*/

renderer.setAnimationLoop(animate);
window.addEventListener('resize', function () {
	camera.aspect = this.window.innerWidth / this.window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});

function lerp(x, y, a) {
	return (1 - a) * x + a * y;
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
	return (scrollPercent - start) / (end - start);
}
const pos = 3;
const animationScripts = [
	{
		start: 1,
		end: 13,
		func: () => {
			roti = false;
			if (scene.children.length == pos + 1) {
				scene.children[pos].position.x = lerp(0, 30, scalePercent(animationScripts[0].start, animationScripts[0].end));
				scene.children[pos].rotation.y = lerp(
					rot_val,
					1.5 * Math.PI,
					scalePercent(animationScripts[0].start, animationScripts[0].end)
				);
				scene.children[pos].scale.y = lerp(1, 0.5, scalePercent(animationScripts[0].start, animationScripts[0].end));
				scene.children[pos].scale.x = lerp(1, 0.5, scalePercent(animationScripts[0].start, animationScripts[0].end));
				scene.children[pos].scale.z = lerp(1, 0.5, scalePercent(animationScripts[0].start, animationScripts[0].end));
			}
		},
	},
	{
		start: 20,
		end: 30,
		func: () => {
			if (scene.children.length == pos + 1) {
				scene.children[pos].position.x = lerp(
					30,
					-20,
					scalePercent(animationScripts[1].start, animationScripts[1].end)
				);
				scene.children[pos].rotation.y = lerp(
					1.5 * Math.PI,
					-Math.PI / 2,
					scalePercent(animationScripts[1].start, animationScripts[1].end)
				);
				scene.children[pos].scale.y = lerp(
					0.5,
					0,
					(3 * scalePercent(animationScripts[1].start, animationScripts[1].end)) / 4
				);
				scene.children[pos].scale.x = lerp(
					0.5,
					0,
					(3 * scalePercent(animationScripts[1].start, animationScripts[1].end)) / 4
				);
				scene.children[pos].scale.z = lerp(
					0.5,
					0,
					(3 * scalePercent(animationScripts[1].start, animationScripts[1].end)) / 4
				);
			}
		},
	},
	{
		start: 30,
		end: 50,
		func: () => {
			meshert.material.opacity = (scrollPercent - 30) / 20;
		},
	},
	{
		start: 50,
		end: 70,
		func: () => {
			meshert.material.opacity = (70 - scrollPercent) / 20;
			scene.children[pos].scale.y = lerp(0.125, 1, scalePercent(animationScripts[3].start, animationScripts[3].end));
			scene.children[pos].scale.x = lerp(0.125, 1, scalePercent(animationScripts[3].start, animationScripts[3].end));
			scene.children[pos].scale.z = lerp(0.125, 1, scalePercent(animationScripts[3].start, animationScripts[3].end));
		},
	},
	{
		start: 80,
		end: 100,
		func: () => {
			hemiLight.intensity = (100 - scrollPercent) / 20;
		},
	},
	{
		start: 0,
		end: 1,
		func: () => {
			roti = true;
		},
	},
];

function playScrollAnimations() {
	animationScripts.forEach(a => {
		if (scrollPercent >= a.start && scrollPercent < a.end) {
			a.func();
		}
	});
}

let scrollPercent = 0;

const observer = new IntersectionObserver(entries => {
	// Loop over the entries
	entries.forEach(entry => {
		// If the element is visible
		if (entry.isIntersecting) {
			// Add the animation class
			entry.target.classList.add('square-animation');
		}
	});
});
observer.observe(document.querySelector('.square'));
observer.observe(document.querySelector('.square1'));
function getMouseDegrees(x, y, degreeLimit) {
	let dx = 0,
		dy = 0,
		xdiff,
		xPercentage,
		ydiff,
		yPercentage;

	let w = { x: window.innerWidth, y: window.innerHeight };

	// Left (Rotates neck left between 0 and -degreeLimit)

	// 1. If cursor is in the left half of screen
	if (x <= w.x / 2) {
		// 2. Get the difference between middle of screen and cursor position
		xdiff = w.x / 2 - x;
		// 3. Find the percentage of that difference (percentage toward edge of screen)
		xPercentage = (xdiff / (w.x / 2)) * 100;
		// 4. Convert that to a percentage of the maximum rotation we allow for the neck
		dx = ((degreeLimit * xPercentage) / 100) * -1;
	}
	// Right (Rotates neck right between 0 and degreeLimit)
	if (x >= w.x / 2) {
		xdiff = x - w.x / 2;
		xPercentage = (xdiff / (w.x / 2)) * 100;
		dx = (degreeLimit * xPercentage) / 100;
	}
	// Up (Rotates neck up between 0 and -degreeLimit)
	if (y <= w.y / 2) {
		ydiff = w.y / 2 - y;
		yPercentage = (ydiff / (w.y / 2)) * 100;
		// Note that I cut degreeLimit in half when she looks up
		dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
	}

	// Down (Rotates neck down between 0 and degreeLimit)
	if (y >= w.y / 2) {
		ydiff = y - w.y / 2;
		yPercentage = (ydiff / (w.y / 2)) * 100;
		dy = (degreeLimit * yPercentage) / 100;
	}
	return { x: dx, y: dy };
}

document.addEventListener('mousemove', function (e) {
	var mousecoords = getMousePos(e);
//mouse move, rotate 3d boject
	//if (scrollPercent == 0) moveJoint(mousecoords, 50);
});
function getMousePos(e) {
	return { x: e.clientX, y: e.clientY };
}
function moveJoint(mouse, degreeLimit) {
	console.log('bruhh');
	let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
	if (roti) {
		scene.children[pos].rotation.z = THREE.MathUtils.degToRad(degrees.x) * 4;
		scene.children[pos].rotation.x = THREE.MathUtils.degToRad(degrees.y) * 4;
		rot_val = THREE.MathUtils.degToRad(degrees.x) * 2;
	}
}
import LocomotiveScroll from 'locomotive-scroll';

const scroll = new LocomotiveScroll({
	el: document.querySelector('[data-scroll-container]'),
	smooth: true,
});
scroll.on('scroll', ({ limit, scroll }) => {
	scrollPercent = (scroll.y / limit.y) * 100;

});
