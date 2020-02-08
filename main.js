(() => {
	let current_range = 2;
	let center_x = 0;
	let center_y = 0;
	(() => {
		const zoom = (delta, x, y) => {
			const factor = 1/(1 - (delta > 0 ? 0.1 : -0.1));
			const new_range = current_range * factor;
			center_x = center_x + (current_range - new_range)*2*x;
			center_y = center_y + (current_range - new_range)*2*y;
			current_range = new_range;
			set_plot_bounds(center_x, center_y, current_range);
		}
	
		const set_plot_bounds = (mid_z_r, mid_z_i, range) => {
			const z_r = quad.geometry.attributes.vertex_z_r.array;
			const z_i = quad.geometry.attributes.vertex_z_i.array;
			
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
	
		const container = document.getElementById("gl-view");
		let containerRect = container.getBoundingClientRect();
	
		const scene = new THREE.Scene();
		const renderer = new THREE.WebGLRenderer({"antialias": true});
		renderer.setSize(containerRect.width, containerRect.height);
		container.appendChild(renderer.domElement);
	
		let ratio = containerRect.width / (containerRect.height || 1);
	
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 100);
		camera.position.z = 1;
	
		const material = new THREE.ShaderMaterial({
			"uniforms": {"max_iterations": {"type": "i", "value": 200}},
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

		set_plot_bounds(center_x, center_y, current_range);
	
		const canvas = renderer.domElement;
		canvas.addEventListener("wheel", (event) => {
			zoom(event.deltaY, event.offsetX/containerRect.width - 1/2, - event.offsetY/containerRect.height + 1/2)
			event.preventDefault();
		});

		(()=>{
			let x_pos = null;
			let y_pos = null;
			canvas.addEventListener("mousedown", (event) => {
				x_pos = event.offsetX;
				y_pos = event.offsetY;
			});
			canvas.addEventListener("mousemove", (event) => {
				if(x_pos !== null){
					center_x = center_x + (x_pos - event.offsetX)/containerRect.width * 2 * current_range;
					center_y = center_y - (y_pos - event.offsetY)/containerRect.height * 2 * current_range;
					set_plot_bounds(center_x, center_y, current_range);
					x_pos = event.offsetX;
					y_pos = event.offsetY;
				}
			});
			canvas.addEventListener("mouseup", () => {
				x_pos = null;
				y_pos = null;
			});
		})();
	})();
})()