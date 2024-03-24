import { Deck } from './deck0-0-0.js';

export class LayoverGraphics {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Set colors
        this.colors = {
            // light gray
            backgroundColor: '#D0D0D0',
        }
    }

    draw(game) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw a red rectangle
        this.ctx.fillStyle = "#FF0000";
        this.drawBackground()

        let index = 0;
        for (const hand of game.hands) {
            this.drawHand(hand, index)
            index++
        }

        index = 0
        for (const card of game.sharedCards) {
            // Draw all 3 shared cards in the center
            const xPos = (this.canvas.width - 50) / 2 + index * 60;
            const yPos = (this.canvas.height - 100) / 2;
            this.drawCard(Deck[card], xPos, yPos);
            index++
        }
    }

    // Position, int 0 to 4, clockwise from bottom
    drawHand(hand, position) {

        const isBottom = position === 0;
        const isLeft = position === 1;
        const isTop = position === 2;
        const isRight = position === 3;

        const isVertical = isLeft || isRight;
        const isHorizontal = isTop || isBottom;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const marginSize = 50
        const cardWidth = 50
        const cardHeight = 100
        const handWidth = isHorizontal ? hand.length * cardWidth : cardWidth;
        const handHeight = isVertical ? hand.length * cardHeight : cardHeight;

        const xPos = isVertical ?
            isLeft ? marginSize : width - marginSize - handWidth
            : (width - handWidth) / 2;
        const yPos = isHorizontal ?
            isTop ? marginSize : height - marginSize - handHeight
            : (height - handHeight) / 2;

        let index = 0;
        for (const card of hand) {
            const cardXPos = isHorizontal ? xPos + index * cardWidth : xPos;
            const cardYPos = isVertical ? yPos + index * cardHeight : yPos;

            this.drawCard(Deck[card], cardXPos, cardYPos);
            index++
        }

    }

    drawCard(card, xPos, yPos) {
        // Draw a white rectangle card with a border
        this.ctx.fillStyle = this.getContinentColor(card.continent);
        this.ctx.fillRect(xPos, yPos, 50, 100);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(xPos, yPos, 50, 100);

        // Draw text
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(card.continent, xPos + 5, yPos + 15);

        // Draw connections as colorful rectangles at the bottom of the card
        let connectionIndex = 0;
        for (const connection of card.connections) {
            this.ctx.fillStyle = this.getContinentColor(connection);
            this.ctx.fillRect(xPos + connectionIndex * 10, yPos + 80, 10, 10);
            this.ctx.strokeStyle = "#000000";
            this.ctx.strokeRect(xPos + connectionIndex * 10, yPos + 80, 10, 10);
            connectionIndex++;
        }
    }

    getContinentColor(continent) {
        switch (continent) {
            case 'Africa':
                return '#F9E977';
            case 'Asia':
                return '#BC77F9';
            case 'Europe':
                return '#BEF977';
            case 'North America':
                return '#F99077';
            case 'Oceania':
                return '#77B5F9';
            case 'South America':
                return '#FD9A37';
            default:
                return '#000000';
        }
    }

    drawBackground() {
        this.ctx.fillStyle = this.colors.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}