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

import {PosterMixin} from '../../features/poster.js';
import ModelViewerElementBase, {$canvas} from '../../model-viewer-element-base.js';
import {pickShadowDescendant, timePasses} from '../helpers.js';

const expect = chai.expect;

suite('ModelViewerElementBase with PosterMixin', () => {
  suite('when registered', () => {
    let nextId = 0;
    let tagName;
    let ModelViewerElement;

    setup(() => {
      tagName = `model-viewer-poster-${nextId++}`;
      ModelViewerElement = PosterMixin(ModelViewerElementBase);
      customElements.define(tagName, ModelViewerElement);
    });

    test('can be directly instantiated', () => {
      const element = new ModelViewerElement();
      expect(element).to.be.ok;
    });

    test('can be instantiated with document.createElement', () => {
      const element = document.createElement(tagName);
      expect(element).to.be.ok;
    });

    suite('poster', () => {
      let element;

      setup(async () => {
        element = new ModelViewerElement();
        document.body.appendChild(element);
        element.poster = './smoke/assets/poster.png';

        // Wait at least a microtask for size calculations
        await timePasses();
      });

      teardown(() => {
        element.remove();
      });

      test('creates a poster element that captures interactions', () => {
        const picked = pickShadowDescendant(element);
        // TODO(cdata): Leaky internal details here:
        expect(picked.classList.contains('poster')).to.be.equal(true);
      });

      test('can be hidden imperatively', () => {
        const ostensiblyThePoster = pickShadowDescendant(element);
        element.hidePoster();
        const ostensiblyNotThePoster = pickShadowDescendant(element);

        expect(ostensiblyThePoster).to.not.be.equal(ostensiblyNotThePoster);
      });

      suite('with loaded model src', () => {
        setup((done) => {
          const onLoad = () => {
            element.removeEventListener('load', onLoad);
            done();
          };

          element.addEventListener('load', onLoad);
          element.src = './examples/assets/Astronaut.glb';
        });

        suite('when hidden', () => {
          test('allows the canvas to be interactive', () => {
            const canvas = element[$canvas];

            element.hidePoster();

            const picked = pickShadowDescendant(element);

            expect(picked).to.be.equal(canvas);
          });
        });
      });
    });
  });
});
