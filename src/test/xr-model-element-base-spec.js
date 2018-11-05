/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import XRModelElementBase, {$renderer, $scene} from '../xr-model-element-base.js';

import {until, waitForEvent} from './helpers.js';

const expect = chai.expect;

suite('XRModelElementBase', () => {
  test('is not registered as a custom element by default', () => {
    expect(customElements.get('xr-model-element-base')).to.be.equal(undefined);
  });

  suite('when registered', () => {
    let nextId = 0;
    let tagName;
    let XRModelElement;

    setup(() => {
      tagName = `xr-model-${nextId++}`;
      XRModelElement = class extends XRModelElementBase {};
      customElements.define(tagName, XRModelElement);
    });

    test('can be directly instantiated', () => {
      const element = new XRModelElement();
      expect(element).to.be.ok;
    });

    test('can be instantiated with document.createElement', () => {
      const element = document.createElement(tagName);
      expect(element).to.be.ok;
    });

    suite('with a valid src', () => {
      let element;
      setup(() => {
        element = new XRModelElement();
        document.body.appendChild(element);
      });

      teardown(() => {
        element.remove();
      });

      test('eventually dispatches a load event', (done) => {
        const onLoad = () => {
          element.removeEventListener('load', onLoad);
          done();
        };

        element.addEventListener('load', onLoad);
        element.src = './examples/assets/Astronaut.glb';
      });
    });

    suite('orchestrates rendering', () => {
      let elements = [];

      setup(async () => {
        elements.push(new XRModelElement());
        elements.push(new XRModelElement());
        elements.push(new XRModelElement());

        const loaded = elements.map(e => waitForEvent(e, 'load'));

        for (let element of elements) {
          element.style.height = '100vh';
          element.style.width = '100vw';
          element.autoRotate = true;
          element.src = './examples/assets/cube.gltf';
          document.body.appendChild(element);
        }

        await Promise.all(loaded);
      });

      teardown(() => {
        elements.forEach(e => e.remove());
      });

      test('only models visible in the viewport', async () => {
        const renderer = elements[0][$renderer];

        // IntersectionObserver needs to set appropriate
        // visibility on the scene, lots of timing issues when
        // running -- wait for the visibility flags to be flipped
        await until(
            () => elements.map((e, i) => (i === 0) === e[$scene].isVisible));

        expect(elements[0][$scene].isVisible).to.be.ok;
        expect(elements[1][$scene].isVisible).to.not.be.ok;
        expect(elements[2][$scene].isVisible).to.not.be.ok;
      });
    });
  });
});
