(function(){
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth/2, window.innerHeight/2 );
	// renderer.setViewport( 300,300,window.innerWidth/2, window.innerHeight/2 );
	document.body.appendChild( renderer.domElement );
	
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x115511 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	
	camera.position.z = 5;
	
	var animate = function () {
		requestAnimationFrame( animate );
	
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
	
		renderer.render(scene, camera);
	};
	
	
	//animate();
	function initLine(){
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial( { vertexColors: true } ); 
		var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );
		// 线的材质可以由2点的颜色决定
	    var p1 = new THREE.Vector3( -100, 0, 100 );
	    var p2 = new THREE.Vector3(  100, 0, -100 );
		geometry.vertices.push(p1);
		geometry.vertices.push(p2);
		geometry.colors.push(color1,color2);
		var line = new THREE.Line(geometry,material,THREE.LinePieces);
		scene.add(line);
		renderer.render(scene, camera);
	}
	initLine();
})();
