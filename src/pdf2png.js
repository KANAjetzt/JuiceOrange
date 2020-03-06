/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Canvas from "canvas";
import fs from "fs";
import pdf from "pdfjs-dist";

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    var canvas = Canvas.createCanvas(width, height);
    var context = canvas.getContext("2d");
    return {
      canvas: canvas,
      context: context
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
};

export const pdf2png = (pdfURL, page) => {
  // Load the PDF file.
  var loadingTask = pdf.getDocument({
    url: pdfURL,
    disableFontFace: false
  });
  loadingTask.promise
    .then(function(pdfDocument) {
      console.log("# PDF document loaded.");

      // Get the first page.
      pdfDocument.getPage(page).then(function(page) {
        // Render the page on a Node canvas with 100% scale.
        var viewport = page.getViewport({ scale: 1.0 });
        var canvasFactory = new NodeCanvasFactory();
        var canvasAndContext = canvasFactory.create(
          viewport.width,
          viewport.height
        );
        var renderContext = {
          canvasContext: canvasAndContext.context,
          viewport: viewport,
          canvasFactory: canvasFactory
        };

        var renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
          // Convert the canvas to an image buffer.
          var image = canvasAndContext.canvas.toBuffer();
          fs.writeFile(
            `${__dirname}/public/img/norma-${Date.now()}.png`,
            image,
            function(error) {
              if (error) {
                console.error("Error: " + error);
              }
            }
          );
        });
      });
    })
    .catch(function(err) {
      console.log(err);
    });
};
