### 1. Description
Sugarland Adventure is a driving simulator with a candyland-like theme. Take the car for a spin around a small track we have designed and enjoy the cute, delicious props we made to accompany the track! 

Basic car movements are as follows: Forward - W, Reverse - S, Left - A, Right - D, Ludicrous mode - L

### 2. Contributions
Jonathan Mitchell
Contributions:
* Car movement mechanics (accelerate, decelerate, turn right, left, reverse, ludicrous mode)
* Data structure design
* Collision detection

Car movement mechanics: 
I designed the car mechanics by creating a grid of road blocks, and allowing the car to move forward, backward, turn left and turn right. I did this by placing the camera at the origin and manipulating a 2D array of transformation matrices. Moreover, I implemented the translation and rotational matrix operations to move the road in various orientations, and the triggers and states to do so, using a `step_size` as a translational coefficient that is analogous to my speed. I decided early on that I would move the road instead of the camera.

I did this early on because I didn't want to have to compute an inverse (because of the computational load). So when the car moves forward, the world is actually moving backwards. There were challenges in providing acceleration and deceleration mechanics. The car begins to accelerate if you press the acceleration button, but if you let go, it will continue to move forward until it stops. Features like this made the whole game more realistic, and they were the most challenging part of the whole project for me. When determining the right values / constants for acceleration, deceleration and rotation I coordinated with Calvin, because he was in the process of making the track. Together, we found the optimal acceleration and turning values so that our mechanics would meet the game's design requirements. Furthermore, he also provided great insight into managing the display() function by helping me organize the state variable's flags.

Data structures:
The road is comprised of 2x2 blocks. When we drive the car we are simply driving on top of those blocks. I organized the road using a 2D array known as `this.box_grid`(inside road_scene.js). Each cell contains a transformation matrix for each block in the road, and it updates as we drive the car. This data struture proved to be very useful in various stages throughout this project. Its simplicity and availability allowed us to pass it between our scenes so that my team members were able to render props (shapes) and textures on top of them. We were able to maintain correspondence with each block in the road simply by passing in an index into the 2D array, which I did when performing collision detection.

Collision Detection:
Because of the decisions made earlier to keep the camera at the origin, and to keep track of all the blocks using `this.box_grid`, I was able to implement collision detection. On each frame we simply check the `x` and `z` coordinates of each box to see if they are within a certain distance from the origin. If so, we assume they have collided and we trigger our collision action. In practice, the hardest part was managing the display() function, and using flags with a global state member variable conditioned on the road class in order to keep track of our current state.

Calvin Pham
Contributions:
* Car movement mechanics (accelerate, decelerate, turn right, left, reverse, ludicrous mode)
* Texture mapping the world
* Particle effects

Car movement mechanics:
I worked with Jonathon to help build the basic movements for the car. Like Jonathon mentioned above, we decided to move the world instead of the camera to give the illusion that the car was moving across the map. Together, we designed a state machine for the car to implement the basic movements (accelerate, turn right, turn left, and reverse) based on keyboard keys that were being pressed. We also incorporated deceleration states that would kick in after the user either drives forward or backwards so that the car would not come to a complete stop once the accelerate/reverse keys were no longer pressed. We spent a fair amount debugging and trying different acceleration, turning, and deceleration values to make the game look as smooth as possible.

Texture mapping the world:
When the high-level design of the track was complete, I proceeded to texture the world with textures I found online and some road textures provided by Faith. In `road_scene.js` I included an array called `box_grid_map` which has the same dimensions as `box_grid` - another array that holds the transformation matrices for all boxes comprising our world. There is a direct one-to-one correspondence between the elements in `box_grid_map` and `box_grid`, i.e to determine what type of box whose indices are i,j should be in the world, one can use the same indices to access `box_grid_map` and find out. The specified type for each box/element within `box_grid_map` were used when developing collision detection and to find out where to render props. Each box in the world can take on one of four general forms: border, grass, prop, or road, and this sort of organization allowed us reuse textures in the world instead of having 20 * 20 = 400 textures in our `assets` folder. The car/camera can drive over grass or road blocks, but will collide with border or prop blocks. 

Particle effects:
To make ludicrous mode a little more interesting and not just a mere speed-up of the car, we decided to add particle effects that would be visible whenever the player enters into this mode. Specifically, blue particles to signify nitrous and smoke will come out from behind the car. These particles are given a random translation of a short distance from the car's "exhaust" and also a random rotation to improve the effect visually. These particles also move with the world when turning left and right to mimic actual flames or smoke that come from an actual car. 


Minnie Tu Contributions:

shadow_shader.js (93 lines)
* shadow shader for car and all props

model_scene.js (340 lines)

Title scene:
* rendering of animated car, road, props, titles
 
 Game scene:
* font and terrain rendering optimization by calculating vertex, UV, normal in two draw calls
* car, props and shadows rendering with projection using shadow_shader.js
* 2nd camera overlay display for font rendering including frame rate (fps) and time counter 
* read box_grid transformation from road_scene.js and render props to its location
* read terrain definition array from road_scene.js and construct to one single model from 2D array[20][20]
* keyboard enable/disable controls: scene, panel, car, props, shadow, terrain

Models and Textures
* font, sky dome, car, road, cookie, ice bar, lollipop, swirl candy, twist candy

**Faith Yu**<br />
Contributions: <br />
*Engineering* <br />
* created props through calculation of indexes, uv, vertices, and texture mapping
* integrated and displayed them through model_scene.js
* implemented shader used for props and car
* prototyped features to illustrate to other team members <br />

*Design* <br />
* designed the game play, model and features to implement
* prototyped features for others
* designed and created the world including the track, props, and shadows
* designed props and prototyped them for other team members

To better fit the team's task allocation and benefit all team members, I was in charge of both design and engineering of this project because of my skills in arts and design in addition to software engineering skills. I designed the game play, models and features to implement after arranging meetings with all members. I designed the world layout including the track and props. I designed and created 12 props integrated into the game for players and also contributed to the shadow all props and car have. I wrote shader for rendering props and the car. I prototyped features that other engineers can develope. I did both high level and ground level contribution to this project, and it was rewarding!

### 3. Details on how to run
If you are a mac user, double click on `host.command` to start the server
If you are a windows user, double click on `host.bat` to start the server

After the server is started, in your web browser (preferably Chrome) go to `localhost:8000`

### 4. Extra:



