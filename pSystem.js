// you can copy and paste this code directly to Adobe Animate frame. IT'S NECESSARY TO PAST THIS CODE INTO EMPTY MOVIECLIP !!!

var an_particles_root = this; // Adobe Animate Canvas scene variable

var pSystem ={
	
	Engine:{
		fps:                             60,                          // int. If 
		timescale:                       1,                           // positive float. timescale(global speed)
		width:                           canvas.width || 500,         // positive float. rendering area
		height:                          canvas.height || 500,        // positive float. rendering area
		prerun:                          0,                           // positive int. 100 means run particles simulation from frame 100, CPU intensive (runs simulation steps in for loop)
		_renderer:                       "Canvas",                    // 'Adobe Animate Canvas', 'DOM', 'Canvas'
		_tmp_timescale:                  1,                           // positive float. remember timescale(speed) before pSystem.Engine.pause
		_active:                         false,                       // bool
		_paused:                         false,                       // bool
		_ticker:                         "setInterval",               // PRIVATE. if renderer is Adobe Animate Canvas use createjs.Ticker
		_an_scene:                       "an_particles_root",         // PRIVATE. adobe animate canvas scene name (by default declared in header of this script)
		_dom_scene:                      "div-particles-root",        // PRIVATE. name of parent <div> for DOM particles
		_canvas_scene:                   "canvas-particles-root",     // PRIVATE. name of parent <canvas> for pure canvas particles
		
	},
	
	// Emitter (particle source)
	Emitter:{
		active:                          true,                       // boolean
		follow_mouse:                    true,                       // boolean (overrides emitter x,y props)
		x:                               250,                        // float
		y:                               400,                        // float
		sizeX:                           20,                         // positive float 0 - Infinity
		sizeY:                           0,                          // positive float 0 - Infinity
		rotation:                        270,                        // in degrees
		spread:                          10,                         // positive float 0 - 360
		spread_type:                     'direct',                   // 'uniform', 'direct', 'bi-direct'
		power:                           150,                        // positive float 0 - Infinity
		
		birthrate:                       100,                        // positive float 0 - Infinity. Particles per second
		
		Randomize:{
			x:                           0,                          // float
			y:                           0,                          // float
			sizeX:                       0,                          // positive float
			sizeY:                       0,                          // positive float
			rotation:                    0,                          // in degrees
			power:                       50                          // positive float 0 - Infinity
		}
	},          
	          
	Particle:{
		
		Initial:{                                                    // Initial properties that doesn't changes over time
			
			shapetype:                   "square",                   // 'circle', 'square', 'an_movieclip'
			mc_lib_name:				 "p",                        // an_movieclip "Linkage" name. Use the Adobe Animate "Library" window to define "Linkage" property for the MovieClip, by default this property is empty
			size:                        10,                         // positive float 0 - Infinity
			lifetime:                    1,                          // positive float 0 - Infinity
			rotation:                    0,                          // in degrees
			rotation_spd:                3,                          // float -Infinity - Infinity
			radial_gradient:             false,                      // enables transparent radial gradient for 'circle', 'square'
			overlay_switch_treshold:     0.5,                        // positive float 0 - 1. 0 - particle just born. 1 - particle dead. 0.5 - midlife. Switch overlay mode
			
			Randomize:{
				lifetime:                1,
				rotation:                0,
				rotation_spd:            0,
				overlay_switch_treshold: 0
			}
		},
		
		From:{                                       // Properties that changes over time
			
			alpha:                       1,			  // positive float 0 - 1. Particle opacity. TO DO: not from/to but via linear gradient (colorStops[colorStop{position, value}])
			color:                       "#d2ff00",   // hex color string. Particle color. TO DO: not from/to but via linear gradient (colorStops[colorStop{position, value}])
			scale:                       1,           // positive float 0 - Infinity
			scaleX:                      1,			  // positive float 0 - Infinity
			scaleY:                      1,           // positive float 0 - Infinity
			mass:                        3,           // positive float 0 - Infinity
			overlay:                     "normal",    // 'normal', 'screen', 'add', 'multiply', 'divide', 'xor'. TO DO: more options
			
			Randomize:{          
				
				alpha:                   0,           
				color:                   false,
				scale:                   0,
				scaleX:                  1,
				scaleY:                  1,
				mass:                    2
			}
		},
		
		To:{
			alpha:                       0,           
			color:                       "#9d9d9d",   
			scale:                       3,
			scaleX:                      1,
			scaleY:                      1,
			mass:                        3,
			overlay:                     "normal",
			
			Randomize:{          
				
				alpha:                   0,
				color:                   true,
				scale:                   5,
				scaleX:                  0,
				scaleY:                  0,
				mass:                    0
			}
		},
	},          
	          
	Forces:{
		Drag:{                                                        // constant drag force (linear movement without acceleration)
			angle:                       180,                         // in degrees
			power:                       100                          // positive float 0 - Infinity
		},
		Wind:{                                                        // drag force with acceleration. depends on particle mass
			angle:                       0,                           // in degrees
			power:                       300                          // positive float 0 - Infinity
		},
		Gravity:{                                                     // drag force with acceleration. depends on particle mass
			angle:                       90,                          // in degrees
			power:                       5                            // positive float 0 - Infinity
		},
		
		air_resistance:                  20                           // positive float. (aka environment viscocity)
	}
}

pSystem.start = function (renderer) {
	var rndr = renderer || pSystem.Engine._renderer;

	if (rndr !== "Canvas" && rndr !== "DOM" && rndr !== "Adobe Animate Canvas") {
		throw 'Wrong argument. available args: "Canvas", "DOM", "Adobe Animate Canvas"';
	}
	
	if(!pSystem.Engine._active) {
		if(pSystem.Engine._renderer == "Adobe Animate Canvas") {
			pSystem.Engine.fps = Math.round(createjs.Ticker.framerate);
			pSystem.Engine._ticker = "anTicker";
		}
		pSystem.Engine._renderer = rndr;
		createParticlesScene();
		particlesEngineTimer(this.Engine._ticker, "start");
		pSystem.setFPS(pSystem.Engine.fps);
		pSystem.Engine._active = true;
	}
}

pSystem.stop = function () {
	if(pSystem.Engine._active) {
		removeParticlesScene();
		particlesEngineTimer(this.Engine._ticker, "stop");
		pSystem.Engine._active = false;
	}
}

pSystem.restart = function (renderer) {
	pSystem.stop();
	pSystem.start(renderer);
}

pSystem.pause = function () {
	if(!pSystem.Engine._paused) {
		pSystem.Engine._tmp_timescale = pSystem.Engine.timescale;
		pSystem.Engine.timescale = 0;
		pSystem.Engine._paused = true;
	}
	
}

pSystem.resume = function () {
	if(pSystem.Engine._paused) {
		pSystem.Engine.timescale = pSystem.Engine._tmp_timescale;
		pSystem.Engine._paused = false;
	}
	
}


pSystem.setFPS = function (fps) {

	if(pSystem.Engine._active) {
		if(pSystem.Engine._renderer != "Adobe Animate Canvas") {
			var MIN_FPS = 2;
			var MAX_FPS = 60;
			fps = Math.round(fps);
			fps = clamp(fps, MIN_FPS, MAX_FPS);
		
			particlesEngineTimer(this.Engine._ticker, "stop");
			pSystem.Engine.fps = fps;
			particlesEngineTimer(this.Engine._ticker, "start");
		} else {
			console.warn ("use the createjs.Ticker.framerate to set fps for anTicker")
		}
	}
	
}

// ------ MATH ------ //

var Ease = {
	linear:           function (t) { return t                                               },
	inQuad:           function (t) { return t*t                                             },
	outQuad:          function (t) { return t*(2-t)                                         },
	inOutQuad:        function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t                     },
	inCubic:          function (t) { return t*t*t                                           },
	outCubic:         function (t) { return (--t)*t*t+1                                     },
	inOutCubic:       function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1        },
	inQuart:          function (t) { return t*t*t*t                                         },
	outQuart:         function (t) { return 1-(--t)*t*t*t                                   },
	inOutQuart:       function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t              },
	inQuint:          function (t) { return t*t*t*t*t                                       },
	outQuint:         function (t) { return 1+(--t)*t*t*t*t                                 },
	inOutQuint:       function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t        },
	inSine:           function (t) { return 1 + Math.sin(Math.PI/2 * t - Math.PI/2)         },
	outSin:           function (t) { return Math.sin(Math.PI/2 * t)                         },
	inOutSin:         function (t) { return (1 + Math.sin(Math.PI * t - Math.PI/2))/2       }
}



function randomMinMax(min, max) {
  return Math.random() * (max - min) + min;
}


function normalize (val, min, max) { 
	return (val - min) / (max - min)
}


function clamp (val, min, max) {
	if(val < min) {
		return min;
	} else if(val > max) {
		return max;
	} else {
		return val;
	}
}


function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}


function radToDeg (rad) {
	return rad * (180/Math.PI);
}


function degToRad (deg) {
	return deg * (Math.PI/180);
}


// get vector2 from radians with the 'len' length
function radToVec (rad, len) {
	if(typeof len !== "number" || isNaN(len)) {
		len = 1;
	}
	var vector = {
		x: Math.cos(rad) * len,
		y: Math.sin(rad) * len
	}
	return vector;
}


function vecToRad (vector_from, vector_to) {
	var dX = vector_to.x - vector_from.x;
	var dY = vector_to.y - vector_from.y;
	var rad = Math.atan2(dY, dX);
	return rad;
}


function hexStringColorToInteger (hexstring) {
	
	var R_int = parseInt(hexstring.slice(0, 3).replace("#", ""), 16);
	var G_int = parseInt(hexstring.slice(3, 5), 16);
	var B_int = parseInt(hexstring.slice(5, 7), 16);
	
	var RGB_int = {
		r: R_int,
		g: G_int,
		b: B_int
	}
	
	return RGB_int;
	
}

function integerColorToHexString (R, G, B) {
	var R_strhex = R.toString(16);
	var G_strhex = G.toString(16);
	var B_strhex = B.toString(16);
	
	R_strhex.length < 2 ? R_strhex = "0" + R_strhex : {};
	G_strhex.length < 2 ? G_strhex = "0" + G_strhex : {};
	B_strhex.length < 2 ? B_strhex = "0" + B_strhex : {};

	return "#" + R_strhex + G_strhex + B_strhex;
}



function randomColor () {

	var MAX_RGB = 255;
	
	var R_int    = Math.round(Math.random()*MAX_RGB);
	var G_int    = Math.round(Math.random()*MAX_RGB);
	var B_int    = Math.round(Math.random()*MAX_RGB);
	
	return integerColorToHexString(R_int, G_int, B_int);
}


function lerpColor (hex_color_from, hex_color_to, t) {

	var MAX_RGB = 255;

	var RGB_from  = hexStringColorToInteger(hex_color_from);
	var RGB_to    = hexStringColorToInteger(hex_color_to);
	
	var R_from    = RGB_from.r;
	var G_from    = RGB_from.g;
	var B_from    = RGB_from.b;

	var R_to      = RGB_to.r;
	var G_to      = RGB_to.g;
	var B_to      = RGB_to.b;
	
	var R_lerp_int      = clamp(Math.round(lerp(R_from, R_to, t)), 0, MAX_RGB);
	var G_lerp_int      = clamp(Math.round(lerp(G_from, G_to, t)), 0, MAX_RGB);
	var B_lerp_int      = clamp(Math.round(lerp(B_from, B_to, t)), 0, MAX_RGB);
	
	var R_lerp_hexstring   = R_lerp_int.toString(16);
	var G_lerp_hexstring   = G_lerp_int.toString(16);
	var B_lerp_hexstring   = B_lerp_int.toString(16);
	
	R_lerp_hexstring.length < 2 ? R_lerp_hexstring = "0" + R_lerp_hexstring : {};
	G_lerp_hexstring.length < 2 ? G_lerp_hexstring = "0" + G_lerp_hexstring : {};
	B_lerp_hexstring.length < 2 ? B_lerp_hexstring = "0" + B_lerp_hexstring : {};
	
	return "#" + R_lerp_hexstring + G_lerp_hexstring + B_lerp_hexstring;
	
}



// attach to mouse

var is_mouse_down = false;
var mouse_x, mouse_y, last_x, last_y;
var is_an_mouse_evt_inited = false; // adobe animate canvas (createjs) mouse events flag

function initMouseEvents () {

	if(pSystem.Engine._renderer == "Adobe Animate Canvas") {

		if(!is_an_mouse_evt_inited) {

			stage.addEventListener("stagemousedown", function (){
				is_mouse_down = true;
			})
			stage.addEventListener("stagemouseup", function (){
				is_mouse_down = false;
				last_x = mouse_x;
				last_y = mouse_y;
			})
			stage.addEventListener("stagemousemove", function(evt) {
				mouse_x = evt.stageX / window.devicePixelRatio;
				mouse_y = evt.stageY / window.devicePixelRatio;
			})

		}

		is_an_mouse_evt_inited = true;

	} else {

		var scene = getParticlesScene().canvas || getParticlesScene();
		scene.addEventListener("mousedown", function (){
			is_mouse_down = true;
		})
		scene.addEventListener("mouseup", function (){
			is_mouse_down = false;
			last_x = mouse_x;
			last_y = mouse_y;
		})
		scene.addEventListener("mousemove", function(evt) {
			mouse_x = evt.clientX;
			mouse_y = evt.clientY;
		})
	
	}

}



function Particle (id) {
	
	var e                                   = pSystem.Emitter;
	var p                                   = pSystem.Particle;
	var n                                   = pSystem.Engine;

	var emitter_random_x                    = randomMinMax(-e.sizeX, e.sizeX) + randomMinMax(-pSystem.Emitter.Randomize.x, pSystem.Emitter.Randomize.x) + randomMinMax(-pSystem.Emitter.Randomize.sizeX, pSystem.Emitter.Randomize.sizeX);
	var emitter_random_y                    = randomMinMax(-e.sizeY, e.sizeY) + randomMinMax(-pSystem.Emitter.Randomize.y, pSystem.Emitter.Randomize.y) + randomMinMax(-pSystem.Emitter.Randomize.sizeY, pSystem.Emitter.Randomize.sizeY);
	
	this.id                                 = id;
	
	this.enginetype                         = n._renderer;
	this.graphicstype                       = p.Initial.shapetype;
	this.graphicInstance                    = "";
	
	this.size                               = p.Initial.size;

	this.x                                  = e.x + emitter_random_x; 
	this.y                                  = e.y + emitter_random_y;

	if(e.follow_mouse) {

		if(is_mouse_down) {
			this.x = mouse_x + emitter_random_x;
			this.y = mouse_y + emitter_random_y;
		} else {
			this.x = last_x + emitter_random_x || pSystem.Engine.width/2;
			this.y = last_y + emitter_random_y || pSystem.Engine.height;
		}
		
	}

	this.age                                = 0;
	
	if(e.spread_type == 'direct') {
		this.forceX                         = radToVec(degToRad(e.rotation+randomMinMax(-e.spread, e.spread) + Math.random()*e.Randomize.rotation), e.power + Math.random()*pSystem.Emitter.Randomize.power).x;
		this.forceY                         = radToVec(degToRad(e.rotation+randomMinMax(-e.spread, e.spread) + Math.random()*e.Randomize.rotation), e.power + Math.random()*pSystem.Emitter.Randomize.power).y;
		
	} else if (e.spread_type == 'bi-direct') {
		if(this.id % 2 != 0) {
			this.forceX                     =  radToVec(degToRad(e.rotation+randomMinMax(-e.spread, e.spread) + Math.random()*e.Randomize.rotation), e.power + Math.random()*pSystem.Emitter.Randomize.power).x;
			this.forceY                     =  radToVec(degToRad(e.rotation+randomMinMax(-e.spread, e.spread) + Math.random()*e.Randomize.rotation), e.power + Math.random()*pSystem.Emitter.Randomize.power).y;

		} else {
			this.forceX                     = -radToVec(degToRad(e.rotation+randomMinMax(-e.spread, e.spread) + Math.random()*e.Randomize.rotation), e.power + Math.random()*pSystem.Emitter.Randomize.power).x;
			this.forceY                     = -radToVec(degToRad(e.rotation+randomMinMax(-e.spread, e.spread) + Math.random()*e.Randomize.rotation), e.power + Math.random()*pSystem.Emitter.Randomize.power).y;

		}
		
	} else if (e.spread_type == 'uniform') {
		this.forceX                         = randomMinMax(-e.power, e.power) + randomMinMax(-pSystem.Emitter.Randomize.power, pSystem.Emitter.Randomize.power);
		this.forceY                         = randomMinMax(-e.power, e.power) + randomMinMax(-pSystem.Emitter.Randomize.power, pSystem.Emitter.Randomize.power);
		
	}
	
	this.lifetime                           = (p.Initial.lifetime + Math.random()*p.Initial.Randomize.lifetime)// / n.timescale;
	
	this.rotation                           = p.Initial.rotation + Math.random()*p.Initial.Randomize.rotation;
	this.rotationSpd                        = randomMinMax(-p.Initial.rotation_spd, p.Initial.rotation_spd);
	
    this.alpha_a                            = p.From.alpha + clamp(Math.random()*p.From.Randomize.alpha, 0, 1);
    this.alpha_b                            = p.To.alpha   + clamp(Math.random()*p.To.Randomize.alpha,   0, 1);
	this.alpha                              = this.alpha_a;

    p.From.Randomize.color ? this.color_a  = randomColor() : this.color_a = p.From.color;
    p.To.Randomize.color   ? this.color_b  = randomColor() : this.color_b = p.To.color;
	this.color                              = this.color_a;

	var uniformscale_a                      = Math.random()*p.From.Randomize.scale;
	var uniformscale_b                      = Math.random()*p.To.Randomize.scale;
    this.scaleX_a                           = (p.From.scaleX + Math.random()*p.From.Randomize.scaleX) * (p.From.scale  + uniformscale_a);
	this.scaleY_a                           = (p.From.scaleY + Math.random()*p.From.Randomize.scaleY) * (p.From.scale  + uniformscale_a);
	this.scaleX_b                           = (p.To.scaleX   + Math.random()*p.To.Randomize.scaleX)   * (p.To.scale    + uniformscale_b);
	this.scaleY_b                           = (p.To.scaleY   + Math.random()*p.To.Randomize.scaleY)   * (p.To.scale    + uniformscale_b);
	this.scaleX                             = this.scaleX_a;
	this.scaleY                             = this.scaleY_a;

    this.mass_a                             = p.From.mass + Math.random()*p.From.Randomize.mass;
	this.mass_b                             = p.To.mass   + Math.random()*p.To.Randomize.mass;
	this.mass                               = this.mass_a;
	
	this.overlay_a                          = p.From.overlay;
	this.overlay_b                          = p.To.overlay;
	this.compositeOperation                 = this.overlay_a;
	this.overlay_switch_treshold            = p.Initial.overlay_switch_treshold + Math.random() * p.Initial.Randomize.overlay_switch_treshold

    this.initForceX                         = this.forceX;
    this.initForceY                         = this.forceY;
	
	this.radial_gradient                    = p.Initial.radial_gradient;

}

var particles_arr = [];



var pure_canvas, pure_canvas_ctx;
function getParticlesScene () {

	if(pSystem.Engine._renderer == "Adobe Animate Canvas") {
		return eval(pSystem.Engine._an_scene).children[0];
		
	} else if(pSystem.Engine._renderer == "DOM") {
		return document.getElementById(pSystem.Engine._dom_scene);
		
	} else if(pSystem.Engine._renderer == "Canvas") {
		pure_canvas = document.getElementById(pSystem.Engine._canvas_scene);
		pure_canvas_ctx = pure_canvas.getContext('2d');
		
		return pure_canvas_ctx;
	}

}

function createParticlesScene() {

	if(pSystem.Engine._renderer == 'Adobe Animate Canvas') {

		var particles_root = eval(pSystem.Engine._an_scene);
		var an_particles_parent_scene = new createjs.MovieClip();

		an_particles_parent_scene.x = 0;
		an_particles_parent_scene.y = 0;
		an_particles_parent_scene.regX = 0;
		an_particles_parent_scene.regY = 0;
		an_particles_parent_scene.name = pSystem.Engine._an_scene;

		particles_root.addChild(an_particles_parent_scene);

		
	} else if(pSystem.Engine._renderer == 'DOM') {
		
		if(!document.getElementById(pSystem.Engine._dom_scene)) {
			var div        = document.createElement("div");
		}

		//var div        = document.createElement("div");

		
		div.id             = pSystem.Engine._dom_scene;
		div.style.width    = pSystem.Engine.width  + "px";
		div.style.height   = pSystem.Engine.height + "px";
		div.style.overflow = "hidden";
		div.style.position = "absolute";
		div.style.left     = 0;
		div.style.top      = 0;

		document.body.appendChild(div);
		
		
	} else if(pSystem.Engine._renderer == "Canvas"){
		
		if(!document.getElementById(pSystem.Engine._canvas_scene)) {
			pure_canvas               = document.createElement("canvas");
			pure_canvas_ctx           = pure_canvas.getContext('2d');
		}
		
		pure_canvas.id                = pSystem.Engine._canvas_scene;
		pure_canvas.width             = pSystem.Engine.width;
		pure_canvas.height            = pSystem.Engine.height;
		pure_canvas.style.width       = pure_canvas.width  + "px";
		pure_canvas.style.height      = pure_canvas.height + "px";
		pure_canvas.style.position    = "absolute";
		pure_canvas.style.left        = 0;
		pure_canvas.style.top         = 0;
		
		document.body.appendChild(pure_canvas);
		
	}

	initMouseEvents();

}

function removeParticlesScene () {
	//if pure canvas
	if(getParticlesScene().canvas) {
		document.body.removeChild(getParticlesScene().canvas);
	//if DOM renderer
	} else if(getParticlesScene().tagName == "DIV") {
		document.body.removeChild(getParticlesScene());
	// if adobe animate canvas renderer
	} else if(getParticlesScene().name == pSystem.Engine._an_scene) {
		getParticlesScene().parent.removeAllChildren();
	}
	particles_arr = [];
}



function createShape (particle) {
	
	var pShape;
	
	if(particle.enginetype == "Adobe Animate Canvas") {
		if(particle.graphicstype == "an_movieclip") {
			pShape     = new lib[pSystem.Particle.Initial.mc_lib_name]();
			pShape.pid = particle.id;
			
		} else if(particle.graphicstype == "circle" || particle.graphicstype == "square") {
			pShape     = new createjs.Shape();
			pShape.pid = particle.id;
			
		}
		
		getParticlesScene().addChild(pShape);
		
	} else if(particle.enginetype == "DOM") {
		pShape                = document.createElement("div");
		pShape.id             = particle.id;
		pShape.style.position = "absolute";

		getParticlesScene().appendChild(pShape);
		
	} else if(particle.enginetype == "Canvas") {
		// don't create shape, instead have to redraw full canvas 
		pShape = "pure_canvas_particle";
		
	}

	particle.graphicInstance = pShape;
	
}



function drawShape (particle) {

	var pShape             = particle.graphicInstance;
	
	var size               = particle.size;
	var x                  = particle.x;
	var y                  = particle.y;
	var scaleX             = particle.scaleX;
	var scaleY             = particle.scaleY;
	var rotation           = particle.rotation;
	var color              = particle.color;
	var alpha              = particle.alpha;
	var compositeOperation = particle.compositeOperation;
	
	if(particle.enginetype == "Adobe Animate Canvas") {
		// draw adobe animate createjs shape

		if(particle.graphicstype == "circle") {
			pShape.graphics.clear();
			
			if(particle.radial_gradient) {
				// rf is beginRadialGradientFill
				pShape.graphics.rf([color+'00', color], [1, 0], 0, 0, 0, 0, 0, size/2)
			} else {
				pShape.graphics.FromFill(color);
			}
			
			pShape.graphics.dc(0, 0, size/2);
			  
			
		} else if(particle.graphicstype == "square") {
			pShape.graphics.clear();
			pShape.graphics.FromFill(color);
			pShape.graphics.dr(-size/2, -size/2, size, size);
			
		}   

		pShape.x              	  = x;
		pShape.y              	  = y;
		pShape.alpha              = alpha;
		pShape.scaleX             = scaleX;
		pShape.scaleY             = scaleY;
		pShape.rotation           = rotation;
		pShape.compositeOperation = compositeOperation;
		
		
	} else if(particle.enginetype == "DOM") {
		// draw <div>

		var css_translate                     = "translate(" + (x-size/2) + "px, " + (y-size/2) + "px)";
		var css_rotate                        = "rotate(" + rotation + "deg)";
		var css_scale                         = "scale(" + scaleX + ", " + scaleY + ")";

		var css_alltransforms                 = css_translate + css_rotate + css_scale;
		
		if(particle.radial_gradient) {

			var css_grad = "radial-gradient(circle at center, "+color+" 0, "+color+'00'+" 70%)";
			pShape.style.background           = css_grad;
			
		} else {
			pShape.style.backgroundColor      = color;
		}
		
		pShape.style.opacity                  = alpha;
		
		pShape.style["mix-blend-mode"]        = compositeOperation;
		
		pShape.style.width                    = size  + "px";
		pShape.style.height                   = size  + "px";
		
		pShape.style["-webkit-transform"]     = css_alltransforms;
		pShape.style["-moz-transform"]        = css_alltransforms;
		pShape.style["-ms-transform"]         = css_alltransforms;
		pShape.style["-o-transform"]          = css_alltransforms;
		pShape.style["transform"]             = css_alltransforms;
		
		
		if(particle.graphicstype == "circle") {
			
			pShape.style["-webkit-border-radius"]   = "50%";
			pShape.style["-moz-border-radius"]      = "50%";
			pShape.style["-ms-border-radius"]       = "50%";
			pShape.style["-o-border-radius"]        = "50%";
			pShape.style["border-radius"]           = "50%";
			
		}
		
	}	
}

function removeShape (particle) {
	if(particle.enginetype == "DOM") {
		getParticlesScene().removeChild(particle.graphicInstance);
	} else if(particle.enginetype == "Adobe Animate Canvas") {
		getParticlesScene().removeChild(particle.graphicInstance);
	}
	// if pure canvas do nothing, it's redrawing every frame every live particles
}

function drawPureCanvas(particles) {

	var particle_ctx = getParticlesScene();

	var pxr         = window.devicePixelRatio;

	particle_ctx.clearRect(0, 0, pSystem.Engine.width, pSystem.Engine.height)
	
	particles.forEach(function (particle) {

		var size               = particle.size;
		var x                  = particle.x || 0;
		var y                  = particle.y || 0;
		var scaleX             = particle.scaleX;
		var scaleY             = particle.scaleY;
		var rotation           = particle.rotation;
		var color              = particle.color;
		var color_int_r        = hexStringColorToInteger(color).r; 
		var color_int_g        = hexStringColorToInteger(color).g;
		var color_int_b        = hexStringColorToInteger(color).b;
		var alpha              = particle.alpha;
		var compositeOperation = particle.compositeOperation;
		
		particle_ctx.save() 
		
		particle_ctx.translate(x, y);
		particle_ctx.rotate(degToRad(rotation));
		particle_ctx.scale(scaleX, scaleY);
		particle_ctx.translate(-x, -y);
		
		if(pSystem.Particle.Initial.radial_gradient) {
			var gradient = particle_ctx.createRadialGradient(x, y, 0, x, y, size/2)
			gradient.addColorStop(0, "rgba("+color_int_r+", "+color_int_g+", "+color_int_b+", "+alpha+")");
			gradient.addColorStop(1, "rgba("+color_int_r+", "+color_int_g+", "+color_int_b+", "+ 0 +")");
			particle_ctx.fillStyle = gradient;
		} else {
			particle_ctx.fillStyle = "rgba("+color_int_r+", "+color_int_g+", "+color_int_b+", "+alpha+")";
		}
		
		if(pSystem.Particle.Initial.shapetype == "square") {
			// square
			particle_ctx.fillRect(x-(size/2), y-(size/2), size, size);
		} else {
			// circle
			particle_ctx.beginPath();
			particle_ctx.arc(x, y, size/2, 0, Math.PI*2);
			particle_ctx.fill();
		}
		
		particle_ctx.restore();
		particle_ctx.globalCompositeOperation = compositeOperation;
	})
}



function createParticle (id) {
	if(pSystem.Emitter.active) {
		var particle = new Particle(id);
		particles_arr.push(particle);
		createShape(particle);
	}
}



function killParticle(particle) {
	var index = particles_arr.indexOf(particle);
	removeShape(particle);
	particles_arr.splice(index, 1);
}



function applyForces (particle) {

	var fps                     = pSystem.Engine.fps;
	var timescale               = pSystem.Engine.timescale;
	var MAX_FPS                 = 60;
	var FORCE_SCALE             = 100;
	var time_relative_force_scale = (timescale*(MAX_FPS-fps)/fps + 1) * timescale;

	var airdensity              = pSystem.Forces.air_resistance;

	airdensity                  = clamp(airdensity, 1, 1e10);
	
	var windX                   = radToVec(degToRad(pSystem.Forces.Wind.angle), pSystem.Forces.Wind.power).x;
	var windY                   = radToVec(degToRad(pSystem.Forces.Wind.angle), pSystem.Forces.Wind.power).y;
	          
	var gravX                   = radToVec(degToRad(pSystem.Forces.Gravity.angle), pSystem.Forces.Gravity.power).x;
	var gravY                   = radToVec(degToRad(pSystem.Forces.Gravity.angle), pSystem.Forces.Gravity.power).y;
	          
	var dragX                   = radToVec(degToRad(pSystem.Forces.Drag.angle), pSystem.Forces.Drag.power).x;
	var dragY                   = radToVec(degToRad(pSystem.Forces.Drag.angle), pSystem.Forces.Drag.power).y;
	          
	var velInitX                = particle.initForceX;
	var velInitY                = particle.initForceY;
	          
	var velGravX                = lerp(0, gravX, particle.age);
	var velGravY                = lerp(0, gravY, particle.age);
	          
	var velWindX                = lerp(0, windX, particle.age);
	var velWindY                = lerp(0, windY, particle.age);
	          
	var velDragX                = dragX;
	var velDragY                = dragY;
	          
	var velSummaryX             = (velInitX + velGravX + velWindX) * particle.mass/(lerp(1, airdensity, normalize(Ease.inSine(particle.age), 0, particle.lifetime))) + velDragX;
	var velSummaryY             = (velInitY + velGravY + velWindY) * particle.mass/(lerp(1, airdensity, normalize(Ease.inSine(particle.age), 0, particle.lifetime))) + velDragY;
	          
	particle.forceX             = velSummaryX;
	particle.forceY             = velSummaryY;
	          
	particle.x                 += particle.forceX * time_relative_force_scale / FORCE_SCALE;
	particle.y                 += particle.forceY * time_relative_force_scale / FORCE_SCALE;

}


function animProps(particle, _s_prop) {
	if(_s_prop == "scale") {
		
        particle.scaleX = lerp(particle.scaleX_a, particle.scaleX_b, normalize(particle.age, 0, particle.lifetime));
        particle.scaleY = lerp(particle.scaleY_a, particle.scaleY_b, normalize(particle.age, 0, particle.lifetime));
		
	}
	
	if(_s_prop == "alpha") {

		particle.alpha = lerp(particle.alpha_a, particle.alpha_b, normalize(particle.age, 0, particle.lifetime));

	} 
	
	if(_s_prop == "color") {
		
        particle.color    = lerpColor(particle.color_a, particle.color_b, normalize(particle.age, 0, particle.lifetime));

	}
	
	if(_s_prop == "rotation") {
		var fps = pSystem.Engine.fps;
		var timescale = pSystem.Engine.timescale;
		var MAX_FPS = 60;
		var time_relative_force_scale = (timescale*(MAX_FPS-fps)/fps + 1) * timescale;
		particle.rotation += particle.rotationSpd * time_relative_force_scale;
		
	}
	
	if(_s_prop == "compositeOperation") {
		
		if(particle.age > particle.overlay_switch_treshold * particle.lifetime) {
			particle.compositeOperation = particle.overlay_b;
		}
			
	}
}



function simulateParticles () {
	
	var ex  = pSystem.Emitter.x
	var ey  = pSystem.Emitter.y;
	var nw  = pSystem.Engine.width;
	var nh  = pSystem.Engine.height;

	particles_arr.forEach(function (p){
		
		var timescale                 = pSystem.Engine.timescale;
		var fps                       = pSystem.Engine.fps;
		var MAX_FPS                   = 60;
		var time_relative_force_scale = (timescale*(MAX_FPS-fps)/fps + 1) * timescale;

		p.age += 0.01*time_relative_force_scale;
		
		if(pSystem.Emitter.power>0 || pSystem.Forces.Drag.power>0 || pSystem.Forces.Gravity.power>0 || pSystem.Forces.Turbulence.power>0 || pSystem.Forces.Wind.power>0) {
			applyForces(p);
		}
		
		// if start/end values isn't the same
		if(p.scaleX_a != p.scaleX_b || p.scaleY_a != p.scaleY_b) {
            animProps(p, "scale");
        }
		
		if(p.alpha_a != p.alpha_b) {
			animProps(p, "alpha");
		}
		if(p.color_a != p.color_b) { // TO DO
			animProps(p, "color");
		}
		if(p.rotation_spd != 0) {
			animProps(p, "rotation");
		}
		if(p.overlay_a != p.overlay_b) {
			animProps(p, "compositeOperation");
		}

		if(p.age>p.lifetime) {
			killParticle(p, p.id);
		} else {
			drawShape(p);
		}
		
	})
	
	if(pSystem.Engine._renderer == "Canvas") {
		drawPureCanvas(particles_arr);
	}

}


var counter = 0;
var subcounter = 0;
var anim_counter = 0;
var uniq_id = 0;
function RunParticlesEngine () {
	var MAX_FPS = 60;
	var timescale = pSystem.Engine.timescale;
	var spd = MAX_FPS/timescale;
	var birthrate = (pSystem.Emitter.birthrate)/normalize(pSystem.Engine.fps, 1, 60);
	
	counter++;
	
	if(counter >= spd/birthrate) {
		if(birthrate>spd) {
			subcounter += (birthrate-spd)/spd;
			
			for(var i=0; i<subcounter; i++) {
				uniq_id++;
				createParticle(uniq_id);
			}
			
			subcounter=0;
			
		} else {
			uniq_id++;
			subcounter = 0;
			counter=0;
			createParticle(uniq_id);
		}
		
	}
	
	simulateParticles();
	
}


function preRun() {
	if(pSystem.Engine.prerun>0) {
		for(var i=0; i<pSystem.Engine.prerun; i++) {
			RunParticlesEngine();
		}
	}
}


function particlesEngineTimer (_s_timer, _s_start_stop) {	
	
	if(_s_timer == "anTicker") {
		ticker_CreateJS(_s_start_stop);
		
	} else if(_s_timer == "setInterval") {
		ticker_setInterval(_s_start_stop);
		
	} else if(_s_timer == "RAF") {
		ticker_RAF(_s_start_stop);
	}
	
	preRun();
	
}



function ticker_CreateJS(_s_start_stop) {
	if(_s_start_stop == "start") {
		createjs.Ticker.addEventListener("tick", RunParticlesEngine);
		
	} else if(_s_start_stop == "stop") {
		createjs.Ticker.removeEventListener("tick", RunParticlesEngine);
		
	}
}


var timerid;
function ticker_setInterval(_s_start_stop) {

	if(_s_start_stop == "start") {
		//timerid = setInterval(RunParticlesEngine, 1000/pSystem.Engine.fps);
		timerid = setInterval(function () {
			RunParticlesEngine();
		}, 1000/pSystem.Engine.fps);

	} else if(_s_start_stop == "stop") {
		clearInterval(timerid);

	}
}

function ticker_RAF (_s_start_stop) {
	console.warn("RAF TICKER TO DO");
}