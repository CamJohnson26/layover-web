import {LayoverGame} from './layoverLogic.js';
import {LayoverGraphics} from './layoverGraphics.js';


document.addEventListener("DOMContentLoaded",
    function layoverSetup() {

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var game = new LayoverGame(canvas, ctx);
        const graphics = new LayoverGraphics(canvas, ctx);
        game.start();

        const button = document.getElementById("make-move-button");
        button.addEventListener("click", function() {
            game.makeMove();
            graphics.draw(game);
        })

        graphics.draw(game);
    }
);
