Scarry is a Javascript library for creating interactive, animated storybooks. It uses [pixi.js](http://pixijs.com) for the heavy lifting and rendering, but provides a framework for creating animated stories without writing any code.

# Installation
Pre-built releases are planned for the future. Until then, scarry requires [npm](https://www.npmjs.com/) for installation. 

To build, clone this repository and run `npm install`. This will create `scarry.js` and `scarry.min.js` files in `bin/`, which can be used in your project. To manually rebuild, use `make build`.

# Fundamentals
*Stories* are the highest-level concept that scarry understands. Stories are exactly what they sound like - a collection of scenes that are presented to the user in a certain order.

*Scenes* are made up of a background, text, a camera, and actors. The scene background and text are pretty self-explanatory. The camera allows you to look around the scene and zoom in and out.

*Actors* are pictures within the scene that need to be animated or interacted with. These might be characters, buttons, or any other picture that needs to be handled separately from the static parts of the scene.

# Usage Specifics
To start using scarry, you must specify two things with a call to `scarry.init()`. In the options object, you must pass a `size` object with the appropriate `width` and `height` of your rendering area. In addition, you must pass a `storyFile`, which is a path to the yaml file that describes your entire story.

To see an example story file, take a look at the examples folder.