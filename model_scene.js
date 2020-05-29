class Model extends Shape {
    constructor(name, size=1) {
        super("positions", "normals", "texture_coords");
        var request = new XMLHttpRequest();
        request.open("GET", name, false);
        request.send();
        var mesh = JSON.parse(request.responseText);
		var vertex = mesh.data.attributes.position.array;
		for (var i=0; i<vertex.length; i++) {
			vertex[i] *= size;
		}

		
		this.positions.push(vertex);
		this.normals.push(mesh.data.attributes.normal.array);
		this.texture_coords.push(mesh.data.attributes.uv.array);
		this.indices = mesh.data.index.array;
    }
	show(x,y,text,mode) {
		var vertex = [];
		var normal = [];
		var texmap = [];
		var index  = [];
		var start = x;
		var k = 0;
		for (var i=0; i<text.length; i++) {
			var ch = text.charCodeAt(i);
			if (ch===10) { 
				x = start;
				y = y - 2;
				continue;
			}
			var ss = 1 / 16;
			var u0 = (ch & 15) * ss;
			var v0 = (15 - (ch >> 4)) * ss;
			if (mode>0) ch -= 64;
			if (mode>0) ss = 1 / 4;
			if (mode>0) u0 = (ch & 3) * ss;
			if (mode>0) v0 = (3 - (ch >> 2)) * ss;
			var u1 = u0 + ss;
			var v1 = v0 + ss;
			vertex = vertex.concat( [ x-1,y-1,0, x+1,y-1,0, x-1,y+1,0, x+1,y+1,0 ] );
			normal = normal.concat( [ 0,0,1, 0,0,1, 0,0,1, 0,0,1 ] );
			texmap = texmap.concat( [ u0,v0, u1,v0, u0,v1, u1,v1 ] );
			index  = index. concat( [ k+0, k+1, k+2, k+3, k+2, k+1 ] );
			k = k + 4;
			x = x + 1;
			if (mode>0) x = x + 1;
		}
		this.positions.length = 0;
		this.normals.length = 0;
		this.texture_coords.length = 0;
		this.indices = 0;
		this.positions.push(vertex);
		this.normals.push(normal);
		this.texture_coords.push(texmap);
		this.indices = index;
	}
};
window.model_scene =
class model_scene extends Scene_Component {
	mapping(key) {
		var props = {
			"phong" : 8,
			"phong1" : 0,
			"phong3" : 1,
			"forward" : 0,
			"prop" : 2,
			"border" : 3,
			"grass" : 4,
			"vertical_road" : 12,
			"horizontal_road" : 10,
			"sharp_turn_upper_left" : 7,
			"sharp_turn_upper_right" : 5,
			"sharp_turn_bottom_left" : 15,
			"sharp_turn_bottom_right" : 13,
			"smooth_turn_bottom_left_1" : 13,
			"smooth_turn_bottom_left_2" : 13,
			"smooth_turn_bottom_left_3" : 13,
			"smooth_turn_upper_left_1" : 5,
			"smooth_turn_upper_left_2" : 5,
			"smooth_turn_upper_left_3" : 5,
			"smooth_turn_upper_right_1" : 7,
			"smooth_turn_upper_right_2" : 7,
			"smooth_turn_upper_right_3" : 7,
			"smooth_turn_bottom_right_1" : 15,
			"smooth_turn_bottom_right_2" : 15,
			"smooth_turn_bottom_right_3" : 15,
			"intersection_down" : 14,
			"intersection_right" : 11,
			"intersection_up" : 6,
			"intersection_left" : 9
 		};
		return props[key];
	}
	panel(x,y,text,mode=0) {
		var context = this.context;
		var gl = this.context.gl;
		var state = context.globals.graphics_state;
		var camera  = state.camera_transform;
		var frustum = state.projection_transform;
		gl.disable(gl.DEPTH_TEST);
		state.camera_transform 
			= Mat4.look_at(Vec.of(0,0,30),Vec.of(0,0,0),Vec.of(0,1,0));
		state.projection_transform
			= Mat4.perspective(Math.PI/4, this.aspect, 1, 1000);
		var font = this.shapes.font;
		if (mode>0) font = this.shapes.terrain;
		font.show(x-20,10-y,text,mode);
		var shape = { "font": font };
		if (mode>0) shape = { "terrain": font };
        this.submit_shapes(this.context, shape);
		this.tran0 = this.transform([0,0,0],[0,1,0,0],[1,1,1]);
		var material = this.materials.font;
		if (mode>0) material = this.materials.terrain;
		if (mode<=0) font.draw(state, this.tran0, material);
		gl.enable(gl.DEPTH_TEST);
		state.camera_transform = camera;
		state.projection_transform = frustum;		
	}
    transform(t,r,s,m=Mat4.identity()){
        var matrix = m;
        matrix = matrix.times(Mat4.translation(t));
        matrix = matrix.times(Mat4.rotation(r[3],[r[0],r[1],r[2]]));
        matrix = matrix.times(Mat4.scale(s));
        return matrix;
    }
	model(name, size=1) {
		var context = this.context;
		var key = name.slice(0,-4);
		this.shapes[key] = new Model("models/"+key+".json", size);
		this.materials[key] = context.get_instance(Phong_Shader)
			.material(Color.of(0,0,0,1),
			{ambient: 1.0, diffusivity: 0.0, specularity: 0.0 })
			.override({texture:context.get_instance("models/"+name, true)});
	}
    constructor(context, control_box){
        super(context, control_box);
		this.context = context;
		this.aspect = context.width/context.height;
		this.shapes = {};
		this.materials = {};
		this.model("font.png");
		this.model("terrain.jpg");
		this.model("sky.jpg",100);
		this.model("car.png",1);
		this.model("road.jpg",1);
		this.model("lollipop.png",2);
		this.model("twist.jpg",1);
		this.model("swirl.jpg",1);
		this.model("icebar.jpg",1);
		this.model("cookie.jpg",1);
		this.model("cone1.jpg",0.5);
		this.model("donut.jpg",1);
		this.model("cake.jpg",1);
		this.model("lime.jpg",1);
		this.model("cow.jpg",1);
		this.model("ice.jpg",0.3);
		this.model("gingerbreadman.png",0.2);
		// this.model("pocky.png",1);
		// this.model("ice1.png",0.5);
        this.submit_shapes(context, this.shapes);
		this.materials["shadow"] = context.get_instance(Shadow_Shader)
			.material(Color.of(0,0,0,1),
			{ambient: 1.0, diffusivity: 0.0, specularity: 0.0 })
			.override({texture:context.get_instance("models/"+name, true)});
		this.shape = [];
		this.material = [];
		for (var key in this.shapes) {
			this.shape.push(this.shapes[key]);
			this.material.push(this.materials[key]);
		}
		var road_scene = this.context.scene_components[0];
		var zdim = road_scene.box_grid.length;
		var xdim = road_scene.box_grid[0].length;
		var grid_map = road_scene.box_grid_map;
		this.props = new Array(zdim);
		this.grid = new Array(zdim);
		this.stage = "";
		for (var y=0; y<zdim; y++) {
			var z = zdim-1-y;
			this.props[z] = new Array(xdim);
			this.grid[z] = new Array(xdim);
			for (var x=0; x<xdim; x++) {
				var range = this.shape.length-5;
				var props = Math.floor(Math.random()*range)+5;
				this.props[z][x] = grid_map[z][x]=="prop" ? props : 0;
				this.grid[z][x] = Mat4.identity();
				var value = this.mapping(grid_map[z][x]);
				this.stage += String.fromCharCode(value+64);
			}
			this.stage += "\n";
		}
		this.render = [ 0,1,2,3,4,5,6,7,0,0 ];
		this.panel(0,0,this.stage,1);
    }
	make_control_panel() {
		this.key_triggered_button( "start game     ",["1"],() => { this.render[1] ^= 1; });
		this.key_triggered_button( "render scene   ",["2"],() => { this.render[2] ^= 2; });
		this.key_triggered_button( "render panel   ",["3"],() => { this.render[3] ^= 3; });
		this.key_triggered_button( "render car     ",["4"],() => { this.render[4] ^= 4; });
		this.key_triggered_button( "render props   ",["5"],() => { this.render[5] ^= 5; });
		this.key_triggered_button( "render shadow  ",["6"],() => { this.render[6] ^= 6; });
		this.key_triggered_button( "render terrain ",["7"],() => { this.render[7] ^= 7; });
		this.key_triggered_button( "render box grid",["8"],() => { this.render[8] ^= 8; });
		this.key_triggered_button( "debug mode     ",["9"],() => { this.render[9] ^= 9; 
			if (this.render[9]>0) {
				for (var i=5; i<8; i++) this.render[i] = 0;
				this.render[8] = 8;
			} else {
				for (var i=2; i<8; i++) this.render[i] = i;
				this.render[8] = 0;
			}
		});
	}
    display(state){
        var time = state.animation_time / 1000;
        var hertz = time>0.001 ? 1000/state.animation_delta_time : 30;
		this.rate = time>0.05 ? this.rate * 0.9 + hertz * 0.1 : hertz;
		var road_scene = this.context.scene_components[2];
		road_scene.render = this.render[8]>0;
		if (this.render[2]<=0) return;
        var freq = 0.1;
        var angle = 2 * Math.PI * freq * time;
		var drive = 0.01 * Math.sin(angle*3);
		if (this.render[1]>0) {
			this.menu(state);
			return;
		}
		this.context.gl.clearColor(50/255, 75/255, 125/255, 1.0);
		this.grid = road_scene.box_grid;
		var xx = this.grid[0][0][0][3];
		var yy = this.grid[0][0][1][3];
		var zz = this.grid[0][0][2][3];
		var cc = this.grid[0][0][0][0];
		var ss = this.grid[0][0][2][0];
		var rr = Math.atan2(ss, cc)
		var ww = rr * 180 / Math.PI;
		var x1 = 20 * Math.cos(rr+Math.PI/4) + xx;
		var z1 = 20 * Math.sin(rr+Math.PI/4) + zz;
		this.lights = [ new Light( Vec.of(x1,yy+10,z1,1), Color.of(0,0.4,0,1),100000) ];
		if (false) {
			state.camera_transform 
				= Mat4.look_at(Vec.of(20,5,20),Vec.of(9,0,9),Vec.of(0,1,0));
			state.projection_transform
				= Mat4.perspective(Math.PI/4, this.aspect, 1, 1000);
		}
		this.tran = [
			this.transform([0,0,0],[0,1,0,0],[1,1,1]),
			this.transform([20,1.01,28],[1,0,0,Math.PI/2],[1,1,1],this.grid[0][0]),
			this.transform([0,-50,0],[0,1,0,0],[1,1,1]),
			this.transform([0,1.0,drive],[0,1,0,+Math.PI/2],[0.5,0.5,0.5])
		];
		state.lights = this.lights;
		for (var i=1; i<4; i++) {
			if (i===1 && this.render[7]<=0) continue;
			if (i===3 && this.render[4]<=0) continue;
			this.shape[i].draw(state, this.tran[i], this.material[i]);
		}
		for (var z=0; z<this.props.length; z++) {
			for (var x=0; x<this.props[0].length; x++) {
				var c = this.props[z][x];
				if (c<=0) continue;
				var tran = this.transform([0,1,0],[0,1,0,angle],[1,1,1],this.grid[z][x]);
				if (this.render[5]>0)
				this.shape[c].draw(state, tran, this.material[c]);
				var trans = this.transform([0,1,0],[0,1,0,angle],[1,1,1],this.grid[z][x]);
				if (this.render[6]>0)
				this.shape[c].draw(state, trans, this.materials["shadow"]);
			}
		}
		if (this.render[6]>0) {
			this.shape[3].draw(state, this.tran[3], this.materials["shadow"]);
		}
		var text = "";
		text += ("00000"+this.rate.toFixed(2)).slice(-5);
		text += "     Sugarland Adventure     ";
		text += ("00000"+parseInt(time)).slice(-5);
		text += "\n\n\n\n\n\n\n\n\n\n";
		if (this.render[3]>0) this.panel(0,drive,text);
    }
    transforms(t,r,s,t1=[0,0,0],r1=[0,1,0,0],s1=[1,1,1],t2=[0,0,0],r2=[0,1,0,0],s2=[1,1,1]){
        var matrix = Mat4.identity();
        matrix = matrix.times(Mat4.translation(t));
        matrix = matrix.times(Mat4.rotation(r[3],[r[0],r[1],r[2]]));
        matrix = matrix.times(Mat4.scale(s));
        matrix = matrix.times(Mat4.translation(t1));
        matrix = matrix.times(Mat4.rotation(r1[3],[r1[0],r1[1],r1[2]]));
        matrix = matrix.times(Mat4.scale(s1));
        matrix = matrix.times(Mat4.translation(t2));
        matrix = matrix.times(Mat4.rotation(r2[3],[r2[0],r2[1],r2[2]]));
        matrix = matrix.times(Mat4.scale(s2));
        return matrix;
    }
    menu(state){
        var time = state.animation_time / 1000;
        var hertz = time!=0 ? 1000/state.animation_delta_time : 30;
		this.fps = this.fps * 0.9 + hertz * 0.1;
        var freq = 0.1;
        var angle = 2 * Math.PI * freq * time;
		var drive = 0.25 * Math.sin(angle*3);
		var context = this.context;
		var gl = this.context.gl;
		gl.clearColor(0.0, 0.5, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		var state = context.globals.graphics_state;
		var camera  = state.camera_transform;
		var frustum = state.projection_transform;
			state.camera_transform 
				= Mat4.look_at(Vec.of(5,1,drive+1),Vec.of(0,1,0),Vec.of(0,1,0));
			state.projection_transform
				= Mat4.perspective(Math.PI/4, this.aspect, 1, 1000);
		this.tran = [
			this.transforms([0,0,0],[0,1,0,0],[1,1,1]),
			this.transforms([0,0,0],[0,1,0,0],[1,1,1]),
			this.transforms([0,-100,0],[0,1,0,0],[1,1,1]),
			this.transforms([2.5,0.2,drive-0.3],[0,1,0,-Math.PI/2],[0.7,0.7,0.7]),
			this.transforms([0,0,0],[0,0,1,0],[3,0.2,3],[0,0,0],[0,0,-1,angle],[1,1,2]),
			this.transforms([1,0,2.5],[0,1,0,angle],[1,1,1]),
			this.transforms([-1,0,2.5],[0,1,0,angle],[0.9,0.9,0.9]),
			this.transforms([-3,0,2],[0,1,0,angle],[0.7,0.7,0.7]),
			this.transforms([1,0,-2],[0,1,0,angle],[1,1,1]),
			this.transforms([-1,0,-3],[0,1,0,0],[0.9,0.9,0.9]),
			this.transforms([-3,0,-2],[0,1,0,0],[0.7,0.7,0.7]),
			this.transforms([-4,0,0],[0,0,1,-0.3],[1,1,1]),
		];
		for (var i=2; i<12; i++) {
			if (i===3) continue;
			var transform = this.tran[i];
			this.shape[i].draw(state, transform, this.material[i]);
		}
		this.shape[3].draw(state, this.tran[3], this.material[3]);
		state.camera_transform = camera;
		state.projection_transform = frustum;
		this.context.gl.clearColor(0,0,0,1);
		var text = "";
		text += "\n";
		text += "          Sugarland Adventure\n";
		text += "\n\n";
		text += "          Press 1 to continue\n";
		text += "\n";
		text += "             Calvin Pham     \n";
		text += "              Faith Yu       \n";
		text += "           Jonathan Mitchell \n";
		text += "             Minnie Tu       \n";
		text += "\n\n\n\n\n\n\n\n";
		this.panel(0,drive*10,text);	
	}
};
