
window.road_scene = window.classes.road_scene =
class road_scene extends Scene_Component
  {
     constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 
         context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,30,25 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
         this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

         const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );
         // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        const shapes = { box:   new Cube(),
                         box_2: new Cube(),
                         world:    new Subdivision_Sphere(8),
                         axis:  new Axis_Arrows()
                       }

        this.render = true;
        //  Initialize model transform matrix of all cubes
        let column_list = []
        for (var i = 0; i < 40; i+=2)
        {
            let row_list = []
            for (var j = 0; j < 40; j+=2)
            {
                // push to rowlist    
              let model_transform = Mat4.identity()
              model_transform = model_transform.times(Mat4.translation(([j, 0, i])));
              model_transform = model_transform.times(Mat4.translation(([-8,0,-8])))
              row_list.push(model_transform)
            }
            column_list.push(row_list)

        }

       this.box_grid_map = [
          ["border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border"],
          ["border","grass","sharp_turn_bottom_right","horizontal_road","intersection_down","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","sharp_turn_bottom_left","grass","border"],
          ["border","grass","vertical_road","grass","vertical_road","grass","grass","prop","grass","grass","grass","prop","grass","grass","prop","prop","grass","vertical_road","grass","border"],
          ["border","prop","vertical_road","grass","vertical_road","prop","sharp_turn_bottom_right","horizontal_road","horizontal_road","sharp_turn_bottom_left","grass","grass","grass","grass","grass","grass","grass","vertical_road","prop","border"],
          ["border","prop","vertical_road","grass","vertical_road","grass","vertical_road","phong","phong","vertical_road","grass","prop","sharp_turn_bottom_right","horizontal_road","horizontal_road","sharp_turn_bottom_left","grass","vertical_road","prop","border"],
          ["border","grass","vertical_road","prop","vertical_road","grass","vertical_road","phong","phong","vertical_road","grass","grass","vertical_road","prop","prop","vertical_road","grass","vertical_road","grass","border"],
          ["border","grass","vertical_road","grass","vertical_road","prop","sharp_turn_upper_right","horizontal_road","sharp_turn_bottom_left","vertical_road","prop","grass","vertical_road","grass","grass","vertical_road","grass","vertical_road","grass","border"],
          ["border","grass","vertical_road","grass","vertical_road","grass","prop","grass","vertical_road","vertical_road","prop","grass","vertical_road","grass","grass","vertical_road","prop","vertical_road","prop","border"],
          ["border","grass","vertical_road","prop","sharp_turn_upper_right","horizontal_road","horizontal_road","horizontal_road","intersection_up","sharp_turn_upper_left","grass","prop","vertical_road","grass","prop","vertical_road","grass","vertical_road","grass","border"],
          ["border","grass","vertical_road","grass","grass","grass","grass","prop","grass","grass","grass","grass","vertical_road","grass","grass","vertical_road","grass","vertical_road","grass","border"],
          ["border","prop","vertical_road","grass","grass","grass","grass","grass","grass","prop","grass","grass","vertical_road","grass","grass","vertical_road","prop","vertical_road","grass","border"],
          ["border","grass","vertical_road","grass","grass","sharp_turn_bottom_right","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","horizontal_road","sharp_turn_upper_left","prop","grass","vertical_road","grass","vertical_road","prop","border"],
          ["border","grass","vertical_road","prop","grass","vertical_road","grass","grass","grass","grass","grass","prop","grass","grass","grass","sharp_turn_upper_right","horizontal_road","intersection_left","grass","border"],
          ["border","grass","vertical_road","grass","grass","vertical_road","grass","prop","sharp_turn_bottom_right","horizontal_road","horizontal_road","horizontal_road","horizontal_road","sharp_turn_bottom_left","phong","phong","prop","vertical_road","grass","border"],
          ["border","prop","sharp_turn_upper_right","horizontal_road","horizontal_road","sharp_turn_upper_left","grass","grass","vertical_road","grass","grass","grass","prop","vertical_road","phong","phong","grass","vertical_road","grass","border"],
          ["border","prop","prop","grass","grass","grass","phong","phong","vertical_road","grass","prop","prop","grass","vertical_road","grass","grass","grass","vertical_road","grass","border"],
          ["border","grass","grass","grass","grass","grass","phong","phong","sharp_turn_upper_right","horizontal_road","horizontal_road","horizontal_road","horizontal_road","intersection_up","horizontal_road","horizontal_road","horizontal_road","sharp_turn_upper_left","grass","border"],
          ["border","grass","grass","grass","grass","grass","grass","grass","grass","grass","prop","prop","grass","grass","grass","grass","grass","grass","grass","border"],
          ["border","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","prop","prop","grass","grass","border"],
          ["border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border","border"]
        ]
        
        this.audio = new Audio("happysong.mp3")
        this.audio.loop = true
        this.audio.volume = 0.5
        const playPromise = this.audio.play().then(response => {
    		console.log(response);
		}).catch(e => {
    		console.log(e.message);
		});

		this.boing = new Audio("boing.mp3")
		this.boing.loop = false
		
        this.box_grid = column_list
        this.particles_array = []
        this.step_size = 0
        this.step_size_incrementer = 0.0001
        this.step_size_decrementer = 0.0001
        this.speed_limit = 0.0250
        this.rotation_amount = 1
        this.back_step_size = 0
        this.rotation_angle = Math.PI/60
        this.pause_rotation_left = false
        this.rotation_angle_left = 0
        this.pause_rotation_right = false
        this.rotation_angle_right = 0
        this.in_turn_left = false
        this.in_turn_right = false
        this.button_holding = false
        this.texture_map = this.box_grid_map
        this.target_map = this.texture_map
        this.target_score = 0
        this.target_candidates = this.get_target_candidates()

        this.submit_shapes( context, shapes );
        this.materials =
          { 
            phong: context.get_instance( Bump_Map ).material( Color.of( 0,0,0,1 ), { ambient:0.6, texture: context.get_instance("assets/gravel.jpg", true) } ),
            phong1: context.get_instance( Bump_Map ).material( Color.of( 1,0,0,1 ), { ambient:0.6}),
            phong3: context.get_instance( Bump_Map ).material( Color.of( 1,0,0,1 ), { ambient:0.6, texture: context.get_instance("assets/car.png", true)}),
            particle: context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), { ambient: 1, diffusivity: 0, specularity: 0, texture: context.get_instance("assets/fire_with_smoke.png", false) }),
            
      
    
          }
         this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 1,1,1,1 ), 100000 ) ];
         
         this.state = {
           'accel': false,
           'decel': false,
           'ludicrous': false,
           'collision': {
               'on': false,
             'forward': false,
             'backward': false,
             'forward_slide': false,
             'backward_slide': false
           }
         }

      // =========== ATTACHES SHAPES =================

       }
      
    make_control_panel()
      { 
        
        this.key_triggered_button( "Forward",  [ "w" ], () => { 
          // toggle acceleration on
          this.state.accel = true
          this.state.decel = false

        }, '#'+Math.random().toString(9).slice(-6), () => {
          this.state.accel = false
        });

        this.key_triggered_button( "reverse",  [ "s" ], () => { 
          this.state.accel = false
          this.state.decel = true

        }, '#'+Math.random().toString(9).slice(-6), () => {
          this.state.decel = false
        });

        


        this.key_triggered_button( "turn left",  [ "a" ], () => { 
          let transformation_mtx = Mat4.identity()

          let rot_step = this.rotation_amount * this.step_size
          if (this.step_size > 0) {
            // this.transform_box_grid(transformation_mtx, 'move_forward')
            this.transform_box_grid(transformation_mtx, 'rotate_left', rot_step)  
          } else if (this.back_step_size > 0 && this.step_size <= 0) {
            this.transform_box_grid(transformation_mtx, 'move_backward') // TODO Fix for step size
            this.transform_box_grid(transformation_mtx, 'rotate_right')
          } else {
            // TODO Add logic so that if the speed is zero it won't actively turn
            // move right with no turn
            // this.transform_box_grid(transformation_mtx, 'rotate_right',0)  
          }

          
        });
        this.key_triggered_button( "turn right",  [ "d" ], () => { 
        // Whatever you want to rotate around, make its X, Y, Z coordinates here
        // This will translate around the origin
          let transformation_mtx = Mat4.identity()
          // can use custom step size if you want
          let rot_step = this.rotation_amount * this.step_size
          if (this.step_size > 0) {
            // this.transform_box_grid(transformation_mtx, 'move_forward')
            this.transform_box_grid(transformation_mtx, 'rotate_right', rot_step)  
          } else if (this.back_step_size > 0 && this.step_size <= 0) {
            this.transform_box_grid(transformation_mtx, 'move_backward') // TODO Fix for step size
            this.transform_box_grid(transformation_mtx, 'rotate_left')
          } else {
            // TODO Add logic so that if the speed is zero it won't actively turn
            // move right with no turn
            // this.transform_box_grid(transformation_mtx, 'rotate_right',0)  
          }
        });
        this.key_triggered_button( "ludicrous mode",  [ "m" ], () => { 
          this.state.ludicrous = true
          // TODO: Shoot nitrous or fire out the back
        }, '#'+Math.random().toString(9).slice(-6), () => {
          this.state.ludicrous = false
        });
        this.key_triggered_button( "View world",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.key_triggered_button( "Attach to car", [ "1" ], () => this.attached = () => this.attach_world );
        
//         this.key_triggered_button( "move forward",  [ "c" ], () => { 
//           const transformation_mtx = Mat4.identity()
//           // pass in the current transformation matrix
//           this.transform_box_grid(transformation_mtx, 'move_forward')
          
//         });

//         this.key_triggered_button( "move backward",  [ "v" ], () => { 
//           const transformation_mtx = Mat4.identity()
//           // pass in the current transformation matrix
//           this.transform_box_grid(transformation_mtx, 'move_backward')
//         });
        
      }
      
    render_box_grid(graphics_state, texture_map) {
      
      let remove_particles_indexes = []
      for (var i = 0; i <this.particles_array.length; i++)
      {
          if (this.particles_array[i].lifetime == 30)
          {
              remove_particles_indexes.push(i)
              continue
          }
          let particle_model_transform = this.particles_array[i].matrix
    
          particle_model_transform = particle_model_transform.times(Mat4.translation(this.particles_array[i].trans))
          particle_model_transform = particle_model_transform.times(Mat4.rotation(this.particles_array[i].rot[0], [1,0,0]))
          particle_model_transform = particle_model_transform.times(Mat4.rotation(this.particles_array[i].rot[1], [0,1,0]))
          particle_model_transform = particle_model_transform.times(Mat4.rotation(this.particles_array[i].rot[2], [0,0,1]))
          this.shapes.box.draw(graphics_state, particle_model_transform.times(Mat4.scale([0.04, 0.04, 0.04])), this.materials.particle)
          this.particles_array[i].lifetime = this.particles_array[i].lifetime + 1
      }

      for (var i = 0; i < remove_particles_indexes; i++)
      {
          this.particles_array.splice(remove_particles_indexes[i], 1)
      }
    }
  

    get_collision_candidates() {
      let colls = []
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (this.texture_map[i][j] == 'prop' || this.texture_map[i][j] == 'border') {
            colls.push(this.box_grid[i][j])
          }
        }
      }
      return colls
    }
    

    check_collision_and_get_states(collision_candidates) {
      let threshold = 1
      let states = []

    // loop through collision candidates
      collision_candidates.map((box, idx) => {
        // extract x and z values
        let x = box[0][3]
        let z = box[2][3]
        let state = JSON.parse(JSON.stringify(this.state));
        
        if (Math.abs(x) <= threshold && Math.abs(z) <= threshold) {
  //           console.log('we are inside check_collision and collision happened')
          state.collision.on = true
  //         console.log("setting collision to be true")
          if (state.accel) {
            state.collision.forward = true
            state.collision.backward = false
          } else if (state.decel) {
            state.collision.forward = false
            state.collision.backward = true
          } else { // if we are not in one of those states but we are 
            state.collision.forward = false
            state.collision.backward = false
            // check step size whichever one is bigger
            state.collision.forward_slide = (this.step_size > this.back_step_size ? true: false)
            state.collision.backward_slide = (this.back_step_size > this.step_size ? true: false) 
          }
  //         console.log('inside if clause: ', state.collision)
          states.push(state)
          // this.state.collision
  //         console.log('Box hit was box: ', idx, 'with x: ', x, 'and z: ', z, 'box is: ', box)
        }  else {
          state.collision.on = false
          state.collision.forward = false
          state.collision.backward = false
          state.collision.forward_slide = false
          state.collision.backward_slide = false
          states.push(state)
  //         console.log('inside else clause: ', state.collision)
        }
        
      })
  //     console.log('returning states: ', states)
      return states
    }

    perform_state_action(state) {
      if (state.collision.forward || state.collision.forward_slide) {
        let transformation_mtx = Mat4.identity()
        this.transform_box_grid(transformation_mtx, 'collision_forward')
      } else if (state.collision.backward || state.collision.backward_slide) {
        let transformation_mtx = Mat4.identity()
        this.transform_box_grid(transformation_mtx, 'collision_backward')
      }
    }
    
 
    get_target_candidates() {
      let target_candidates = this.target_map.map((row_list, i) => row_list.map((box, j) => {
        if ((box == 'vertical_road') 
              || (box == 'horizontal_road')
              || (box == 'sharp_turn_upper_left')
              || (box == 'sharp_turn_upper_right')
              || (box == 'sharp_turn_bottom_right')
              || (box == 'sharp_turn_bottom_left')
              || (box == 'intersection_up')) {
          
          if (Math.random() < 0.3) {
            return this.box_grid[i][j]  
          } else {
            return []
          }
          
        } else {
          return []
        }
      }))
      return target_candidates
    }

    update_target_candidates() {
      // look through target candidates and update the ones that exist
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (this.target_candidates[i][j][0] != undefined) { // or []
            //update it
            this.target_candidates[i][j] = this.box_grid[i][j]
          }
        }
      }
    }

    check_target_candidates() {
      // using an updated list of target candidates
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (this.target_candidates[i][j][0] != undefined) {

            let box = this.target_candidates[i][j]
            let x = box[0][3]
            let z = box[2][3]
            let threshold = 2

            if (Math.abs(x) < threshold && Math.abs(z) < threshold) {
              // remove it from the list
              this.target_candidates[i][j] = []
              this.target_score += 1
              // TODO Accumulate score
            }
          }
        }
      }
    }

  render_targets(graphics_state) {
    // after render, 
    // render the targets that are false
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (this.target_candidates[i][j][0] != undefined) {
          // render the target above the box grid
          // grab material to render
          // translate up 2 units in y
          let M = Mat4.translation([0, 2, 0]).times(this.box_grid[i][j])
          // render the object 

          // TODO : Using texture_map here but ultimately we will use the target_map
          // TODO BLACKHAWK
          // CHANGE SHAPES FROM BOX TO TARGET SHAPE
          // RENDER TARGET MATERIAL INSTEAD OF TARGET MAPS MATERIAL
          this.shapes.box.draw(graphics_state, M, this.materials.phong1)
        }
      }
    }

  }

    // ======= HELPER FUNCTION ==============
    render_box_grid_item(graphics_state, row, col) {
    // render first item in the box grid
    this.shapes.axis.draw(graphics_state, this.box_grid[row][col], this.materials.phong)
    }

    // ======== HELPER FUNCTION =================
    transform_box_grid_item(transformation_mtx, row=0, col=0) {
        // save x,z
      const x = this.box_grid[row][col][0][3]
      const z = this.box_grid[row][col][2][3]

      // Apply rotation around origin (using identity) will be replaced with camera x and camera z eventually  
      // apply rotation
      let rotation_mtx = transformation_mtx.times(Mat4.rotation(Math.PI/30, [0, 1, 0]))

      // translate out x,z _ cam_x cam_z
      rotation_mtx = rotation_mtx.times(Mat4.translation([x, 0, z]))
      // set to box grid coord
      this.box_grid[row][col] = rotation_mtx
    }

    transform_box_grid(transformation_mtx, kind='', rotation_step=0) {

      this.box_grid = this.box_grid.map( row_list => row_list.map( (box) => {
      
      if (kind == 'rotate_left') {
       return Mat4.translation([-rotation_step, 0, 0]).times(Mat4.rotation(this.rotation_angle,[0, -1, 0]).times(box))
      } else if (kind == 'rotate_right') {
        return Mat4.translation([-rotation_step, 0, 0]).times(Mat4.rotation(this.rotation_angle,[0, 1, 0]).times(box))
      } else if (kind == 'move_forward') {
        return Mat4.translation([-this.step_size, 0, 0]).times(box)
      } else if (kind == 'move_backward') {
        return Mat4.translation([+this.back_step_size, 0, 0]).times(box)
        // return box.times(Mat4.translation([+this.back_step_size, 0, 0]))
      } else if (kind == 'ludicrous_forward') {
        return Mat4.translation([3 * -this.step_size, 0, 0]).times(box)
      } else if (kind == 'collision_forward') {
          console.log("boing1")
          this.boing.play()
        return Mat4.translation([+1.5, 0, 0]).times(box)
      } else if (kind == 'collision_backward') {
          console.log("boing2")
          this.boing.play()
        return Mat4.translation([-1.5, 0, 0]).times(box)
      }  else {
        // do nothing
        return box
      }
       }));

      this.particles_array = this.particles_array.map( particle => {
      
      if (kind == 'rotate_left') {
       return {matrix: Mat4.translation([-rotation_step, 0, 0]).times(Mat4.rotation(this.rotation_angle,[0, -1, 0]).times(particle.matrix)), lifetime: particle.lifetime,
                    rot: particle.rot, trans: particle.trans}
      } else if (kind == 'rotate_right') {
        return {matrix: Mat4.translation([-rotation_step, 0, 0]).times(Mat4.rotation(this.rotation_angle,[0, 1, 0]).times(particle.matrix)), lifetime: particle.lifetime,
                rot: particle.rot, trans: particle.trans}
      } else if (kind == 'move_forward') {
        return {matrix: Mat4.translation([-this.step_size, 0, 0]).times(particle.matrix), lifetime: particle.lifetime,
                rot: particle.rot, trans: particle.trans}
      } else if (kind == 'move_backward') {
        return {matrix: Mat4.translation([+this.back_step_size, 0, 0]).times(particle.matrix), lifetime:particle.lifetime,
                rot: particle.rot, trans: particle.trans}
        // return particle.matrix.times(Mat4.translation([+this.back_step_size, 0, 0]))
      } else if (kind == 'ludicrous_forward') {
        return {matrix: Mat4.translation([5 * -this.step_size, 0, 0]).times(particle.matrix), lifetime: particle.lifetime,
                rot: particle.rot, trans: particle.trans}
      } else if (kind == 'collision_forward') {
        return {matrix: Mat4.translation([+1.5, 0, 0]).times(particle.matrix), lifetime: particle.lifetime,
                rot: particle.rot, trans: particle.trans}
      } else if (kind == 'collision_backward') {
        return {matrix: Mat4.translation([-1.5, 0, 0]).times(particle.matrix), lifetime: particle.lifetime,
                rot: particle.rot, trans: particle.trans}
      }  else {
        // do nothing
        return {matrix: particle.matrix, lifetime: particle.lifetime, rot: particle.rot, trans: particle.trans}
      }
       });    
    }

    display( graphics_state ) {
        graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000
        this.dt = graphics_state.animation_delta_time / 1000
        const dt = graphics_state.animation_delta_time / 1000;

        // check for collision
        let collision_candidates = this.get_collision_candidates()
        // loop through collision candidates and check x,z values
        // For all collision candidates not equal to an empty list put them into a new list
        let states = this.check_collision_and_get_states(collision_candidates)

        // look through states
        
        for (let i = 0; i < states.length; i++) {
            if (states[i].collision.on == true) {
                
                // analyze state and act
                this.perform_state_action(states[i])
            } 
        }
           
        // targeting
//         console.log(this.target_candidates)
        // this.update_target_candidates()
        // this.check_target_candidates()
        // // // render targets
        // this.render_targets(graphics_state)
        // console.log('collision_candidates: ', collision_candidates)
        
        
        
        // Accelerate/decelerate in forward direction
        if (this.state.accel && this.state.ludicrous) {
          // console.log("Accelerate forward")
          let transformation_mtx = Mat4.identity()
          this.step_size += this.step_size_incrementer
          this.step_size = Math.min(this.step_size, this.speed_limit)
          this.transform_box_grid(transformation_mtx, 'ludicrous_forward')
        }  else if (this.state.accel) {
          // console.log("Accelerate forward")
          let transformation_mtx = Mat4.identity()
          this.step_size += this.step_size_incrementer
          this.step_size = Math.min(this.step_size, this.speed_limit)
          this.transform_box_grid(transformation_mtx, 'move_forward')
        
        }  else if (!this.state.accel && this.step_size > 0 && !this.state.decel) {
          // console.log("Decelerate forward")
          let transformation_mtx = Mat4.identity()
          this.step_size = Math.max(this.step_size-this.step_size_decrementer, 0)
          this.transform_box_grid(transformation_mtx, 'move_forward')
        }
        
        // Accelerate/decelerate in backward direction
        if (this.state.decel) {
          let transformation_mtx = Mat4.identity()

          if ((this.step_size) > 0) {
            // push current step size to 0 to slow down
            //  Decrement at a faster rate 
            this.step_size -= 0.0015
            // prevent step size from going negative in reverse step
            this.step_size = Math.max(0, this.step_size)
            this.transform_box_grid(transformation_mtx, 'move_forward')
          }
          else if (this.step_size <= 0) {
            this.step_size = 0
            this.transform_box_grid(transformation_mtx, 'move_backward')
            this.back_step_size += this.step_size_incrementer
            this.back_step_size = Math.min(this.back_step_size, this.speed_limit)
          }
        }  else if (!this.state.decel && this.back_step_size > 0 && !this.state.accel) {
          // console.log("Decelerate backward")
          let transformation_mtx = Mat4.identity()
          // default is move forward
          this.transform_box_grid(transformation_mtx, 'move_backward')
          this.back_step_size = Math.max(this.back_step_size-this.step_size_decrementer, 0)
        }

        if (this.state.ludicrous)
        {
            //for (var i = 0; i < 3; i++)
            //{
                this.particles_array.push({matrix: Mat4.identity().times(Mat4.translation([-0.7,1.2,0])), 
                lifetime: 0, rot: [Math.random() * 2 *Math.PI, Math.random() * 2 *Math.PI, Math.random() * 2 *Math.PI ], 
                trans: [0, Math.random() * (0.05 - (-0.05)) - 0.05, Math.random() * (0.05 - (-0.05)) - 0.05]})
                

            //}
            

            
        }

      
    
  
        //console.log(this.step_size, this.back_step_size)
//         this.shapes.axis.draw(graphics_state, Mat4.identity(), this.materials.phong.override({color: Color.of(1,1,1,1)}))
        
        

         // TODO:  Draw the required boxes. Also update their stored matrices.
        let axis_transform = Mat4.identity().times(Mat4.translation([2,0,0])).times(Mat4.scale([1/5,1/5,1/5]))

        // this.transform_box_grid(transform_sample)
//       this.get_textures()
		this.render_box_grid(graphics_state, this.texture_map)
      

        // ==========================================================================================================
        // ==========================================================================================================
        // =========== Uncomment below for sample on how to render a shape onto box grid=============================
        // ==========================================================================================================
        // ==========================================================================================================


        
        //  This block of code is how we move the camera to the back of the car
        //  If we have the car start at a point that is other than the origin, will need to change the transformations accordingly
        let camera_mat = Mat4.identity();
        camera_mat = camera_mat.times(Mat4.rotation(Math.PI/2, [0, -1.0, 0]))
        camera_mat = camera_mat.times(Mat4.rotation(Math.PI/15, [-1, 0, 0]))
        camera_mat = camera_mat.times(Mat4.translation([0, 3, 7]))
        this.camera_mat = camera_mat
        this.attach_world = camera_mat

        //  Set camera_mat
        if (this.attached != undefined)
        {
            let matrix = this.attached()
            matrix = Mat4.inverse(matrix).map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, 0.1))
            graphics_state.camera_transform = matrix
        }
      }
  }
  
 class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          vec4 tex_color = texture2D( texture, f_tex_coord );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}