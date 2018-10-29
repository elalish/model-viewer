# XRModelElement

[![Build Status](http://img.shields.io/travis/google/xr-model-element.svg?style=flat-square)](https://travis-ci.org/google/xr-model-element)
[![Build Status](http://img.shields.io/npm/v/xr-model-element.svg?style=flat-square)](https://www.npmjs.org/package/xr-model-element)
[![Build Status](http://img.shields.io/npm/dt/xr-model-element.svg?style=flat-square)](https://www.npmjs.org/package/xr-model-element)
[![Build Status](http://img.shields.io/npm/l/xr-model-element.svg?style=flat-square)](https://www.npmjs.org/package/xr-model-element)


`<xr-model>` is a web component for rendering interactive 3D models, optionally in AR,
supporting multiple formats.

## Demo

## Install

Install the component using [npm](https://www.npmjs.com/), and build using your tool of choice:

```
$ npm install xr-model-element --save
```

Or include the [dist/xr-model-element.js](dist/xr-model-element.js) script directly in your markup:

```html
  <script src="xr-model-element.js"></script>
```

## Usage

Once the component has been included on your page, you can start using the
`<xr-model>` tag.

```html
<xr-model controls ar style="height: 500px" src="assets/Astronaut.glb" ios-src="assets/Astronaut.usdz">
</xr-model>
```

### Browser Support

The following emerging web platform APIs are used by this library:

 - [Web XR Device API](https://immersive-web.github.io/webxr/) ([CanIUse](https://caniuse.com/#feat=webvr), [Platform Status](https://www.chromestatus.com/features/5680169905815552))
 - [Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements) ([CanIUse](https://caniuse.com/#feat=custom-elementsv1), [Platform Status](https://www.chromestatus.com/features/4696261944934400))
 - [Shadow DOM](https://dom.spec.whatwg.org/#shadow-trees) ([CanIUse](https://caniuse.com/#feat=shadowdomv1), [Platform Status](https://www.chromestatus.com/features/4667415417847808))
 - [Resize Observer](https://wicg.github.io/ResizeObserver/) ([CanIUse](https://caniuse.com/#feat=resizeobserver), [Platform Status](https://www.chromestatus.com/features/5705346022637568))

Some browser support for these features can be enabled with polyfills. Any
polyfills that faithfully implement the required platform features should be
fine. The following is a selection of recommended polyfill implementations:

 - [Web XR Device API Polyfill](https://github.com/immersive-web/webxr-polyfill)
 - [Web Components Polyfill](https://github.com/webcomponents/webcomponentsjs) (includes Custom Elements and Shadow DOM)
 - [Resize Observer Polyfill](https://github.com/que-etc/resize-observer-polyfill)

Please keep in mind that your mileage may vary depending on the browsers you
need to support and the fidelity of the polyfills used.

## API

### `<xr-model>`

The base element for rendering 3D models.

#### Attributes

* *`src`*: The URL to the 3D model.
* *`ios-src`*: The url to a USDZ model will be used in iOS Safari to launch Quick Look for AR.
* *`preload`*: Whether or not the user must select the element first before the model begins to download. Keep in mind models can be heavy on bandwidth and use preloading with caution.
* *`poster`*: Displays an image instead of the model until the model is loaded or a user action.
* *`controls`*: Enables controls via mouse/touch when in flat view.
* *`ar`*: Enables the option to enter AR and place the 3D model in the real world if the platform supports it.
* *`background-color`*: Sets the background color of the flat view. Takes any valid CSS color string.
* *`auto-rotate`*: Enables the auto rotation of the model.
* *`vignette`*: Enables vignette rendering when not on mobile.

#### Events

* *`'load'`*: Fired when a model is loaded. Can fire multiple times per XRModelElement if changing the `src` attribute.

## Supported Formats

An `<xr-model>`'s attributes allows developers to specify multiple file types to work
across different platforms. For WebGL and Web XR purposes, both GLTF and GLB are
supported out of the box. Additionally, developers can specify a USDZ file (using
the `ios-src` attribute) that will be used to launch Quick Look on iOS Safari.

Note: iOS Quick Look only supports model files that use the USDZ format. This means
that iOS users who see a live-rendered model in the browser (loaded as GLTF / GLB) will
have to download the same model a _second time_ in USDZ format when they launch Quick Look.

## Development

* `npm run build` - Builds the distributable from the `src/` directory.
* `npm run watch` - Watches the `src/` directory, rebuilding when a file changes.
* `npm run serve` - Serves a static server on port `8000` from the project root.
* `npm run dev` - Combination of `npm run watch` and `npm run serve` -- watches the `src/` directory, rebuilding when a file changes and opens a static server on port `8000`.
* `npm test` - Runs tests. As of now, only a linter.

## TODOs/Questions

* The DOM view is using post processing, but due to [WebGLRenderTargets not supporting antialiasing](https://github.com/mrdoob/three.js/issues/568), we get aliasing. Perhaps there are other solutions. Currently using a FXAA pass if post processing is used.
* three.js 94dev includes the `WebGLRenderer.prototype.setFramebuffer` function which we need in order to bind WebXR's framebuffer easily. This version is not yet in npm, so a local version is committed in third_party/three, and some extra rollup work to work around this. Upgrade to r94 once its on npm.
* There is currently no way to tell whether an iOS device has AR Quick Look support. Possibly check for other features added in Safari iOS 12 (like CSS font-display): https://css-tricks.com/font-display-masses/
* Since there are no USDZ three.js loaders (and seems that it'd be difficult to do), Safari iOS users would either need to load a poster image, or if they load the 3D model content before entering AR, they'd download both glTF and USDZ formats, which are already generally rather large.
* With native AR Quick Look, the entire image triggers an intent to the AR Quick Look. Currently in this component implementation, the user must click the AR button. Unclear if we want to change this, as interacting and moving the model could cause an AR Quick Look trigger.
* The size of the AR Quick Look native button scales to some extent based off of the wrapper. We could attempt to mimic this, or leverage the native rendering possibly with a transparent base64 image.
* I'm sure there's some race conditions if quickly toggling states between DOM and AR views.

## License

Apache License Version 2.0, Copyright © 2018 Google

[USDZ]: https://graphics.pixar.com/usd/docs/Usdz-File-Format-Specification.html
[glTF]: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0
[glb]: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#glb-file-format-specification
