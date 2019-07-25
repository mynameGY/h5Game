var VSHADER_SOURCE="" +
        "attribute vec4 a_Position;\n" +
        "attribute vec4 a_Color;\n" +
        "uniform mat4 u_MvpMatrix;\n" +
        "uniform mat4 u_ModelMatrix;\n" +
        "uniform vec4 u_Eye;\n" +//世界坐标下的视点的位置
        "varying vec4 v_Color;\n" +
        "varying float v_Dist;\n" +
        "void main(){\n" +
        "   gl_Position = u_MvpMatrix * a_Position;\n" +
        "   v_Color = a_Color;\n" +
        "   v_Dist = distance(u_ModelMatrix * a_Position, u_Eye);\n" +//计算出来顶点和视点的距离
        "}\n";
	
var FSHADER_SOURCE="" +
        "#ifdef GL_ES\n" +
        "precision mediump float;\n" +
        "#endif\n" +
        "uniform vec3 u_FogColor;\n" + //雾的颜色
        "uniform vec2 u_FogDist;\n" + //雾化的起点和终点(starting point, end point)
        "varying vec4 v_Color;\n" +
        "varying float v_Dist;\n" +
        "void main(){\n" +
        //计算雾化因子（当它远离眼睛位置时，系数变小）
        "   float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);\n" +
        //越远雾化程度越高 u_FogColor * (1 - fogFactor) + v_Color * fogFactor
        "   vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);\n" +
        "   gl_FragColor = vec4(color, v_Color.a);\n" +
        "}\n";

function main(){
	var canvas = document.getElementById('webgl');
	if ( !canvas ) {
		console.error('Failed to retrieve the <canvas> element!');
		return ;
	}

	var gl = canvas.getContext('webgl');
	if ( !initShaders( gl, VSHADER_SOURCE, FSHADER_SOURCE) ) {
		console.error('Failed to initialize shaders!');
	}
	
	//将数据存入缓冲区
	var n = initVertexBuffers(gl);
	if (n < 0) {
		console.log("数据存入缓冲区失败");
		return;
	}
	
	//设置雾的颜色
	var fogColor = new Float32Array([0.15, 0.23, 0.426]);

	//雾化的起点和终点与视点间的距离【起点距离， 终点距离】
	var fogDist = new Float32Array([55, 100]);

	//视点在世界坐标系下的位置
	var eye = new Float32Array([25, 65, 35, 1.0]);
	
	//获取相关uniform变量的存储位置
	var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
	var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	var u_Eye = gl.getUniformLocation(gl.program, "u_Eye");
	var u_FogColor = gl.getUniformLocation(gl.program, "u_FogColor");
	var u_FogDist = gl.getUniformLocation(gl.program, "u_FogDist");
	if (!u_MvpMatrix || !u_ModelMatrix || !u_Eye || !u_FogColor || !u_FogDist) {
		console.log("无法获取uniform变量的相关位置");
		return;
	}
		
	//将雾的颜色，起点与终点，视点坐标传给对应的uniform变量
	gl.uniform3fv(u_FogColor, fogColor); //雾的颜色
	gl.uniform2fv(u_FogDist, fogDist); //起点和终点
	gl.uniform4fv(u_Eye, eye); //视点

	//将雾的颜色设置为背景色
	gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
	gl.enable(gl.DEPTH_TEST);

	//设置模型矩阵并赋值
	var modeMatrix = new Matrix4();
	modeMatrix.setScale(10.0, 10.0, 10.0);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modeMatrix.elements);

	//设置视图投影矩阵
	var mvpMatrix = new Matrix4();
	mvpMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 1000.0);
	mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0.0, 2.0, 0.0, 0.0, 1.0, 0.0);
	mvpMatrix.multiply(modeMatrix);
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	//绑定一个点击事件
	document.onkeydown = function () {
		keydown(event, gl, n, u_FogDist, fogDist);
	};

	//清除背景色及层级关系
	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

	//绘制
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

	var modelViewMatrix = new Matrix4();
	modelViewMatrix.setLookAt(eye[0], eye[1], eye[2], 0.0, 2.0, 0.0, 0.0, 1.0, 0.0);
	modelViewMatrix.multiply(modeMatrix);
	modelViewMatrix.multiplyVector4(new Vector4([1.0, 1.0, 1.0, 1.0]));
	mvpMatrix.multiplyVector4(new Vector4([1.0, 1.0, 1.0, 1.0]));
	modelViewMatrix.multiplyVector4(new Vector4([-1.0, 1.0, 1.0, 1.0]));
	mvpMatrix.multiplyVector4(new Vector4([-1.0, 1.0, 1.0, 1.0]));


		
}

function keydown(event, gl, n, u_FogDist, fogDist) {
	switch (event.keyCode){
		case 38:
			fogDist[1] += 1;
			break;
		case 40:
			if(fogDist[1] > fogDist[0]){
				fogDist[1] -= 1;
			}
			break;
		default:
			return;
	}

	gl.uniform2fv(u_FogDist, fogDist);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.EDPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
	// Create a cube
	//    v6----- v5
	//   /|      /|
	//  v1------v0|
	//  | |     | |
	//  | |v7---|-|v4
	//  |/      |/
	//  v2------v3

	var vertices = new Float32Array([   // Vertex coordinates 顶点的位置
		1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,    // v0-v1-v2-v3 front
		1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,    // v0-v3-v4-v5 right
		1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,    // v0-v5-v6-v1 up
		-1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,    // v1-v6-v7-v2 left
		-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,    // v7-v4-v3-v2 down
		1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1     // v4-v7-v6-v5 back
	]);

	var colors = new Float32Array([     // Colors 顶点的颜色
		0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
		0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
		1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
		1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
		1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
		0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0   // v4-v7-v6-v5 back
	]);

	var indices = new Uint8Array([       // Indices of the vertices 顶点的索引
		0, 1, 2, 0, 2, 3,    // front
		4, 5, 6, 4, 6, 7,    // right
		8, 9, 10, 8, 10, 11,    // up
		12, 13, 14, 12, 14, 15,    // left
		16, 17, 18, 16, 18, 19,    // down
		20, 21, 22, 20, 22, 23     // back
	]);

	//将顶点位置和颜色存入颜色缓冲区
	if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
	if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;

	//创建一个索引的缓冲区对象
	var indexBuffer = gl.createBuffer();
	if(!indexBuffer){
		console.log("无法创建缓冲区对象");
		return -1;
	}

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

	return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
	var buffer = gl.createBuffer();
	if (!buffer) {
		console.log("无法创建缓冲区对象");
		return;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) {
		console.log("无法获取变量的存储位置" + attribute);
		return false;
	}
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);

	return true;
}
main();