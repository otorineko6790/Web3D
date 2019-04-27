var scene, renderer, camera;
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var pickables = [];

var useCamera1 = false;
var lightsOff = false;
var camera1, mainView;
var lights = [],  paints = [],  cams = [],  walls = [];
var keys = [[0, 0], [0.4, 0.6], [0.5, 0.6], [0.9, 0], [1, 0]];
var T = 2;
var clock = new THREE.Clock();
var ts = clock.getElapsedTime();

class Light {
  constructor(target) {
    this.lamp = new THREE.Object3D();
    this.loader = new THREE.TextureLoader();
    this.loader.crossOrigin = ''
    this.texture = this.loader.load("https://i.imgur.com/qwHC0qr.png");

    this.lampbody = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 30), new THREE.MeshPhongMaterial({
      map: this.texture
    }));
    this.lamp.add(this.lampbody);
    //this.lamp.rotation.y = Math.PI/2;
    this.lampbody.rotation.x = Math.PI / 2;

    this.spotLight = new THREE.SpotLight(0xffffff, 1, 500);
    this.lamp.add(this.spotLight);
    this.spotLight.position.copy(this.lamp.position);
    this.spotLight.angle = 0.5;
    this.spotLight.penumbra = 0.3;
    //this.spotLight.target = target;

    scene.add(this.lamp);
  }

}

class Paint {
  constructor(name, h, w, url) {
    this.loader = new THREE.TextureLoader();
    this.loader.crossOrigin = ''
    this.texture = this.loader.load(url);
    this.paint = new THREE.Mesh(new THREE.PlaneGeometry(h, w), new THREE.MeshPhongMaterial({
      map: this.texture
    }));
    scene.add(this.paint);
	this.paint.name = name;
	pickables.push(this.paint);
  }

}

class Camera {
  constructor(point, x, y, z) {
    this.cameraObj = new THREE.Object3D();
    //this.cameraObj.add(new THREE.AxisHelper(40));
    this.cameraBody = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 5), new THREE.MeshNormalMaterial());
    this.lens = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10), new THREE.MeshNormalMaterial());
    this.lens.position.z = 5;
    this.lens.rotation.x = Math.PI / 2;
    this.cameraObj.add(this.cameraBody, this.lens);
	
	scene.add(this.cameraObj);
	this.cameraObj.position.set(x, y, z);
	this.cameraObj.lookAt(point);

	this.view = new THREE.PerspectiveCamera(60, 1, 1, 1000);
	this.view.position.set(x, y, z);
	this.view.lookAt(point);
  }
}


$('#intensity').change(function() {
  console.log($(this).val());
  for (let i = 0; i < lights.length; i++)
    lights[i].spotLight.intensity = $(this).val();
})

$('#tView').click(function() {
  //  toggleCamera();
  lightsOff = !lightsOff;

  if (lightsOff) {
    for (let i = 0; i < lights.length; i++)
      lights[i].spotLight.intensity = 0;
  } else {
    for (let i = 0; i < lights.length; i++)
      lights[i].spotLight.intensity = 0.5;
  }

});

function paintView(){
	mainCam = camera;
	let chosen = document.getElementById('paintView');
	switch(chosen.value){
    	case 'p1':
		  camera.position.set(-200, 80, 0);
		  camera.lookAt(new THREE.Vector3(-492, 80, 0));
    	  break;
    	case 'p2':
		  camera.position.set(-400, 80, 0);
		  camera.lookAt(new THREE.Vector3(-211, 80, 0));
    	  break;
    	case 'p3':
		  camera.position.set(0, 80, 0);
		  camera.lookAt(new THREE.Vector3(-189, 80, 0));
    	  break;
    	case 'p4':
		  camera.position.set(0, 80, 0);
		  camera.lookAt(new THREE.Vector3(189, 80, 0));
    	  break;
    	case 'p5':
		  camera.position.set(400, 80, 0);
		  camera.lookAt(new THREE.Vector3(211, 80, 0));
    	  break;
    	case 'p6':
		  camera.position.set(200, 80, 0);
		  camera.lookAt(new THREE.Vector3(492, 75, 0));
    	  break;
    	default:
		  camera.position.set(0, 700, 700);
		  camera.lookAt(new THREE.Vector3(0, 0, 0));
	}
}

function chanCam(id){
	switch(id){
		case 'cam1':
		mainCam = cams[0].view;
		break;
		case 'cam2':
		mainCam = cams[1].view;
		break;
		case 'cam3':
		mainCam = cams[2].view;
		break;
		default:
		mainCam = camera;
	}
}

function toggleCamera() {
  useCamera1 = !useCamera1;
}

function architecture() {
  let len = [400, 400, 1000, 1000, 250];
  for (let i = 0; i < len.length - 1; i++) {
    walls[i] = new THREE.Mesh(new THREE.PlaneGeometry(len[i], 150), new THREE.MeshPhongMaterial());
    scene.add(walls[i]);
  }

  walls[0].position.set(-500, 75, 0);
  walls[0].rotation.y = Math.PI / 2;
  walls[1].position.set(500, 75, 0);
  walls[1].rotation.y = -Math.PI / 2;
  walls[2].position.set(0, 75, 200);
  walls[2].rotation.y = Math.PI;
  walls[3].position.set(0, 75, -200);

  walls[4] = new THREE.Mesh(new THREE.BoxGeometry(10, 150, len[4]), new THREE.MeshPhongMaterial());
  scene.add(walls[4]);
  walls[4].position.set(200, 75, 0);
  walls[5] = new THREE.Mesh(new THREE.BoxGeometry(10, 150, len[4]), new THREE.MeshPhongMaterial());
  scene.add(walls[5]);
  walls[5].position.set(-200, 75, 0);
  ////////////////////floor//////////////////////////
  let loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  texture = loader.load('https://i.imgur.com/Ya2J3UQ.jpg');
  texture.repeat.set(20, 8);
  texture.wrapS = texture.wrapT = true;

  let floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 400), new THREE.MeshPhongMaterial({
    //side: THREE.DoubleSide,
    map: texture
  }))
  scene.add(floor)
  floor.rotation.x = -Math.PI / 2
}

function setPaint(){
  paints[0] = new Paint('p1', 198.4, 107.6, "https://i.imgur.com/nUfPBUK.jpg");
  paints[1] = new Paint('p2', 192.0, 71.1, "https://i.imgur.com/n3YJLDu.jpg");
  paints[2] = new Paint('p3', 150, 100.0, "https://i.imgur.com/jKCcK9t.jpg");
  paints[3] = new Paint('p4', 150, 80, "https://i.imgur.com/S3QpQYw.jpg");
  paints[4] = new Paint('p5', 128.8, 78.5, "https://i.imgur.com/vJcDgzM.jpg");
  paints[5] = new Paint('p6', 150.0, 100.0, "https://i.imgur.com/U2xBIm5.jpg");

  paints[0].paint.position.set(-492, 80, 0);
  paints[0].paint.rotation.y = Math.PI / 2;
  paints[1].paint.position.set(-211, 80, 0);
  paints[1].paint.rotation.y = -Math.PI / 2;
  paints[2].paint.position.set(-189, 80, 0);
  paints[2].paint.rotation.y = Math.PI / 2;
  paints[3].paint.position.set(189, 80, 0);
  paints[3].paint.rotation.y = -Math.PI / 2;
  paints[4].paint.position.set(211, 80, 0);
  paints[4].paint.rotation.y = Math.PI / 2;
  paints[5].paint.position.set(492, 75, 0);
  paints[5].paint.rotation.y = -Math.PI / 2;

}

function setLight(){
  var dL = new THREE.DirectionalLight(0x333333, 1);
  //scene.add(dL);
  dL.position.y = 20
  var ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  lights[0] = new Light();
  lights[0].lamp.position.set(480, 200, 100);
  lights[0].lamp.lookAt(new THREE.Vector3(0, 0, 0));
  lights[1] = new Light();
  lights[1].lamp.position.set(480, 200, -100);
  lights[1].lamp.lookAt(new THREE.Vector3(0, 0, 0));
  lights[2] = new Light();
  lights[2].lamp.position.set(-400, 200, 100);
  lights[2].lamp.lookAt(paints[0].paint.position);
  lights[2].spotLight.target = paints[0].paint;
}


init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  var ww = $('#container').innerWidth();
  var hh = $('#container').innerHeight();
  renderer.setSize(ww, hh);
  renderer.setClearColor(0x888888);
  $('#container').append(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, ww / hh, 1, 10000);
  camera.position.set(0, 700, 700);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
  //scene.add(gridXZ);
  mainCam = camera;
  //$('#container').on ("mousemove", onDocumentMouseMove);
  window.addEventListener('mousedown', onDocumentMouseDown, false);
  raycaster = new THREE.Raycaster();
  document.addEventListener('mousedown', onDocumentMouseDown, false);  
  //////////////////////////////////////////////////////////////////////////
  architecture();
  setPaint();
  setLight();
  ///////set Camera
  cams[0] = new Camera(new THREE.Vector3(400, 50, 0), 300, 150, 200);
  cams[1] = new Camera(new THREE.Vector3(200, 50, 0), 0, 150, -200);
  cams[2] = new Camera(new THREE.Vector3(-400, 50, 0), -300, 150, 200);

}

function keyframe(t) {
  var s = ((t - ts) % T) / T;
  for (var i = 1; i < keys.length; i++) {
    if (keys[i][0] > s) break;
  }
  var ii = i - 1;
  var a = (s - keys[ii][0]) / (keys[ii + 1][0] - keys[ii][0]);
  intKey = keys[ii][1] * (1 - a) + keys[ii + 1][1] * a;
	return intKey;
}

function render(mainCam){
  var ww = $('#container').innerWidth();
  var hh = $('#container').innerHeight();
  
  renderer.setSize(ww, hh);
  renderer.setScissorTest(true);

  renderer.setViewport(0, 0, ww, hh);
  camera.aspect = ww / hh;
  camera.updateProjectionMatrix();

  renderer.setScissor(0, 0, ww, hh);
  renderer.clear();
  renderer.render(scene, mainCam);

  renderer.setViewport(0, 0, ww / 3, hh / 4);
  renderer.setScissor(0, 0, ww / 3, hh / 4);
  // no need to set aspect (since it is still ONE)
  renderer.clear();  // important!
  renderer.render(scene, cams[0].view);     // cam1

  renderer.setViewport(ww / 3, 0, ww / 3, hh / 4);
  renderer.setScissor(ww / 3, 0, ww / 3, hh / 4);
  // no need to set aspect (since it is still ONE)
  renderer.clear();  // important!
  renderer.render(scene, cams[1].view);     // cam2

  renderer.setViewport(ww / 3 * 2-1, 0, ww / 3, hh / 4);
  renderer.setScissor(ww / 3 * 2-1, 0, ww / 3, hh / 4);
  // no need to set aspect (since it is still ONE)
  renderer.clear();  // important!
  renderer.render(scene, cams[2].view);     // cam3
  renderer.setScissorTest(false);

}

function onDocumentMouseDown(event) {
  var viewportPos = $('#container').get(0).getBoundingClientRect();
  mouse.x = ((event.clientX - viewportPos.left) / $('#container').innerWidth()) * 2 - 1;
  mouse.y = -((event.clientY - viewportPos.top) / $('#container').innerHeight()) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(pickables);
  var p = document.getElementsByTagName('p')[0];

  if (intersects.length > 0) {
	p.innerHTML = intersects[0].object.name;	
	if(intersects[0].object.name=="p1")
		p.innerHTML = "庫德矮人的面具。<br>德庫果族(Deku Scrub)，或簡稱為德庫族(Dekus)，頭上以及身軀長有許多花草，外型像是木偶般的森林種族；作為遊戲中森林地區的常客，德庫果族也發展出屬於他們獨特的文化。";	
	if(intersects[0].object.name == "p2")
		p.innerHTML = "《穆修拉的假面》是薩爾達傳說系列的第六部遊戲，為《時之笛》的後傳。<br>在本作品中，就利用時之笛，在月球落下的三天期限內，蒐集到所需物品。&nbsp<a href='https://www.youtube.com/watch?v=vbMQfaG6lo8'>開頭動畫</a>";
	if(intersects[0].object.name == "p3")
		p.innerHTML = "快樂的面具商人。<br>被骷髏小子奪走了繆修拉的面具，請求林克幫忙奪回，並教林克更多不同的曲子來吹奏時之笛。";
	if(intersects[0].object.name == "p4")
		p.innerHTML = "帶上索拉族面具，變形中的畫面。<br>索拉族(Zora)，在遊戲中常見的水生種族，他們是種具有諸多魚類特徵的亞人種，例如身上覆有鱗片、四肢處長有魚鰭、腳上有蹼以及使用鰓呼吸等的特徵，這些特殊的構造都讓卓拉族得以優游於水中，並常為不同時代中守護水源的種族，因此與其他種族或民族時常保持著友好關係。";
	if(intersects[0].object.name == "p5")
		p.innerHTML = "塔米尼亞世界的月亮。<br>在三天之後即將掉落了月亮，同時，三天之後也是村子嘉年華的慶典";
	if(intersects[0].object.name == "p6")
		p.innerHTML = "繆修拉面具。<br>在遊戲中，面具商人告訴林克，穆修拉面具會實現其配戴者的願望，不過代價是以一種邪惡、毀滅性的力量佔有佩戴者的身體。";
	
  }
}

function animate() {
	
  let intkey = keyframe(clock.getElapsedTime());
  /**/
  cams[0].cameraObj.rotation.y = intkey - 0.3;
  cams[0].view.matrixWorld.copy (cams[0].cameraObj.matrixWorld);
  //cams[0].view.matrixAutoUpdate = false;
  
  requestAnimationFrame(animate);
  let nowCamera = useCamera1 ? cams[1].view : camera;
  render(mainCam);
}