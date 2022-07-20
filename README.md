# Particle System

crossbrowser vanilla JS (es5) particle system library, compatible with Adobe Animate Canvas (basic createjs shapes, createjs MovieClips)

> [CodePen demo](https://codepen.io/qweranzo/pen/WNMWmXW)

## Import:
- Adobe Animate
    * copy and paste code into the 0th frame of the empty movieclip 

- HTML document
    - `<script src="pSystem.js"></script>`

## Methods:

- `pSystem.start(renderer)` - args: `no args`, `'Canvas'`, `'DOM'`, `'Adobe Animate Canvas'` 
- `pSystem.stop()` - args: `no args`
- `pSystem.restart(renderer)` - args: `no args`, `'Canvas'`, `'DOM'`, `'Adobe Animate Canvas'` the same is stop() start()
- `pSystem.pause()` - args: `no args` 
- `pSystem.resume()` - args: `no args`
- `pSystem.setFPS(fps)` - args: `positive_integer` works when particle system is running


## Parameters:

### Engine:
- `pSystem.Engine`

Property | Value (default value) | Description
:-|:-:|-:
`timescale` | positive float. (default: 1) | global speed
`width` | positive float. (default: canvas.width \|\| 500) | rendering area (width) if renderer is 'Adobe Animate Canvas' - equals \<canvas> width 
`height` | positive float. (default: canvas.height \|\| 500) | rendering area (height) if renderer is 'Adobe Animate Canvas' - equals \<canvas> height 

### Emitter:
- `pSystem.Emitter`

Property | Value (default value) | Description
:-|:-:|-:
`active` | boolean. (default: true) | emit particles?
`follow_mouse` | boolean. (default: true) | if true, you can drag emitter by holding left mouse button <p>(overwrites `pSystem.Emitter.x` and `pSystem.Emitter.y` props)
`x` | float. (default: 250) | emitter position X
`y` | float. (default: 400) | emitter position Y
`sizeX` | positive float. (default: 20) | emitter size X (width)
`sizeY` | positive float. (default: 0) | emitter size Y (height)
`rotation` | float. (default: 270) | emitter rotation (in degrees)
`spread` | positive float 0 - 360. (default: 10) | spread angle (in degrees)
`spread_type` | string. <ul><li>'uniform'</li><li>'direct'</li><li>'bi-direct'</li></ul>(default: 'direct') | spread behaviour. bi-direct - emit particles in 2 opposite directions. direct - one direction. uniform - all directions
`power` | float. (default: 150) | initial particle force (speed)
`birthrate` | positive float. (default: 100) | quantity of particles per second (when `pSystem.Engine.timescale = 1`)

##### Emitter randomize:
- `pSystem.Emitter.Randomize`

Property | Value (default value) | Description
:-|:-:|-:
`rotation` | float (default: 0) | randomize emitter rotation for every new particle
`power` | float (default: 50) | randomize emitter power for every new particle

### Particle:
#### Initial:
- `pSystem.Particle.Initial` initial particles properties (doesn't changes over time)

Property | Value (default value) | Description
:-|:-:|-:
`shapetype` | string. (default: 'square')<ul><li>'circle'</li><li>'square'</li><li>'an_movieclip'</li></ul> | particle shape. if renderer is 'Adobe Animate Canvas' you can use 'an_movieclip' shape to draw particles as MovieClip instances, to do this go to: Window > Library > Linkage, name it <b>'p'</b> without quotes
`mc_lib_name` | string. (default: 'p') | MovieClip Linkage name
`size` | positive float. (default: 10) | particle uniform size (doesn't applies to 'an_movieclip' particle, only 'square' and 'circle')
`lifetime` | positive float. (default: 1) | 1 is one second
`rotation` | float. (default: 0) | particle rotation angle (in degrees)
`rotation_spd` | float. (default: 3) | particle rotation speed
`radial_gradient` | boolean. (default: false) | enables transparent radial gradient for 'circle' and 'square'
`overlay_switch_treshold` | float 0 - 1. (default: 0.5) | 0.5 means switch overlay mode (composite operation mode) after the half of the particle's life (lifetime/age)

##### Randomize:
- `pSystem.Particle.Initial.Randomize` 

Property | Value (default value) | Description
:-|:-:|-:
`lifetime` | positive float. (default: 1) | randomize particle lifetime (add random lifetime to each particle)
`rotation` | float. (default: 0) | randomize particle rotation
`rotation_spd` | float. (default: 0) | randomize particle rotation speed
`overlay_switch_treshold` | positive float 0 - 1. (default: 0) | randomize particle overlay switch treshold

#### From:
- `pSystem.Particle.From` particle properties that changes over time

Property | Value (default value) | Description
:-|:-:|-:
`alpha` | positive float 0 - 1. (default: 1) | transparency
`color` | hex string. (default: '#d2ff00') | color 
`scale` | positive float. (default: 1) | uniform scale
`scaleX` | positive float. (default: 1) | scale width
`scaleY` | positive float. (default: 1) | scale height
`mass` | positive float. (default: 3) | particle mass
`overlay` | string. (default: 'normal') | overlay mode, available modes <ul><li>[HTML](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)</li><li>[Canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)</li></ul>

##### Randomize:
- `pSystem.Particle.From.Randomize` particle properties that changes over time

Property | Value (default value) | Description
:-|:-:|-:
`alpha` | positive float 0 - 1. (default: 1) | add random transparency
`color` | boolean. (default: false) | if true, set random color (overwrites current color)  
`scale` | positive float. (default: 1) | add random uniform scale
`scaleX` | positive float. (default: 1) | add random scale width
`scaleY` | positive float. (default: 1) | add random scale height
`mass` | positive float. (default: 3) | add random particle mass

####  To:
- `pSystem.Particle.To` particle properties that changes over time

Property | Value (default value) | Description
:-|:-:|-:
`alpha` | positive float 0 - 1. (default: 0) | transparency
`color` | hex string. (default: '#9d9d9d') | color 
`scale` | positive float. (default: 3) | uniform scale
`scaleX` | positive float. (default: 1) | scale width
`scaleY` | positive float. (default: 1) | scale height
`mass` | positive float. (default: 3) | particle mass
`overlay` | string. (default: 'normal') | overlay mode, available modes <ul><li>[HTML](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)</li><li>[Canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)</li></ul>

##### Randomize:
- `pSystem.Particle.To.Randomize` particle properties that changes over time

Property | Value (default value) | Description
:-|:-:|-:
`alpha` | positive float 0 - 1. (default: 0) | add random transparency
`color` | boolean. (default: true) | if true, set random color (overwrites current color)  
`scale` | positive float. (default: 5) | add random uniform scale
`scaleX` | positive float. (default: 0) | add random scale width
`scaleY` | positive float. (default: 0) | add random scale height
`mass` | positive float. (default: 0) | add random particle mass

### Forces:
- `pSystem.Forces`

##### Air resistance:
- `pSystem.Forces`

Property | Value (default value) | Description
:-|:-:|-:
`air_resistance` | positive float. (default: 30) | 0 - floating without restance

##### Drag:
- `pSystem.Forces.Drag` linear movement without acceleration

Property | Value (default value) | Description
:-|:-:|-:
`angle` | positive float 0 - 360. (default: 180) | in degrees
`power` | float. (default: 100) | power

##### Wind:
- `pSystem.Forces.Wind` force with acceleration. depends on particle mass

Property | Value (default value) | Description
:-|:-:|-:
`angle` | positive float 0 - 360. (default: 0) | in degrees
`power` | float. (default: 300) | power

##### Gravity:
- `pSystem.Forces.Gravity` force with acceleration. depends on particle mass

Property | Value (default value) | Description
:-|:-:|-:
`angle` | positive float 0 - 360. (default: 90) | in degrees
`power` | float. (default: 50) | power

