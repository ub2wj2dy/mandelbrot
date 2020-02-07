(() => {
	const set_plot_bounds = (mid_z_r, mid_z_i, range) => {
		var z_r = quad.geometry.attributes.vertex_z_r.array;
		var z_i = quad.geometry.attributes.vertex_z_i.array;
		
		// First triangle:
		z_r[0] = mid_z_r - range;
		z_i[0] = mid_z_i - range;
		
		z_r[1] = mid_z_r + range;
		z_i[1] = mid_z_i + range;
		
		z_r[2] = mid_z_r - range;
		z_i[2] = mid_z_i + range;
		
		// Second triangle:
		z_r[3] = mid_z_r - range;
		z_i[3] = mid_z_i - range;
		
		z_r[4] = mid_z_r + range;
		z_i[4] = mid_z_i + range;
		
		z_r[5] = mid_z_r + range;
		z_i[5] = mid_z_i - range;
		
		quad.geometry.attributes.vertex_z_r.needsUpdate = true;
		quad.geometry.attributes.vertex_z_i.needsUpdate = true;
		
		renderer.render(scene, camera);
	}

	const vertexShader = document.getElementById("shader_vertex").textContent;
	const fragmentShader = document.getElementById("shader_fragment").textContent

	const container = document.getElementById("gl-canvas-container");
	const containerRect = container.getBoundingClientRect();

	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({"antialias": true});
	renderer.setSize(containerRect.width, containerRect.height);
	container.appendChild(renderer.domElement);

	let ratio = containerRect.width / (containerRect.height || 1);

	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
	camera.position.z = 1;

	const material = new THREE.ShaderMaterial({
		"uniforms": {"max_iterations": {"type": "i", "value": 100}},
		"vertexShader":   vertexShader,
		"fragmentShader": fragmentShader,
		"side": THREE.DoubleSide
	});

	const geometry = new THREE.BufferGeometry();

	const z_r = new Float32Array(6);
	const z_i = new Float32Array(6);
	const vertices = new Float32Array(18);

	// First triangle:
	vertices[0]  = -1.0;
	vertices[1]  = -ratio;
	vertices[2]  =  0.0;
	
	vertices[3]  =  1.0;
	vertices[4]  =  ratio;
	vertices[5]  =  0.0;
	
	vertices[6]  = -1.0;
	vertices[7]  =  ratio;
	vertices[8]  =  0.0;
	
	// Second triangle.
	vertices[9]  = -1.0;
	vertices[10] = -ratio;
	vertices[11] =  0.0;
	
	vertices[12] =  1.0;
	vertices[13] =  ratio;
	vertices[14] =  0.0;
	
	vertices[15] =  1.0;
	vertices[16] = -ratio;
	vertices[17] =  0.0;

	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	geometry.setAttribute("vertex_z_r", new THREE.BufferAttribute(z_r, 1));
	geometry.setAttribute("vertex_z_i", new THREE.BufferAttribute(z_i, 1));

	const quad = new THREE.Mesh(
		geometry,
		material
	);

	scene.add(quad);

	let init_mid_z_r = -0.5;
	let init_mid_z_i = 0;
	let init_range = 2;
	set_plot_bounds(init_mid_z_r, init_mid_z_i, init_range);

	//renderer.domElement.addEventListener("mousedown", mouse_down_fn);
})()