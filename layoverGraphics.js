import {Deck, DestinationDecks} from './deck0-0-0.js';

export class LayoverGraphics {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Set colors
        this.colors = {
            // light gray
            backgroundColor: '#D0D0D0',
            layoverColor: '#E261D5',
            skipColor: '#555555',
            destinationColor: '#FFFFFF'
        }
    }

    draw(game) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw a red rectangle
        this.ctx.fillStyle = "#FF0000";
        this.drawBackground()
        this.drawCurrentMove(game)

        let index = 0;
        for (const hand of game.hands) {
            const cardGroups = [
                {
                    cards: hand,
                    deck: Deck
                }, {
                    cards: game.destinationHands[index],
                    deck: DestinationDecks[index]
                }
            ]
            this.drawHand(cardGroups, index)
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

        this.drawPlayedCards(game)
        this.drawDeck(game)
    }

    drawCurrentMove(game) {
        const currentPlayer = game.currentPlayerTurn;

        // Draw the number of the current player in the top left corner
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`Player ${currentPlayer + 1}'s Turn`, 10, 20);
    }

    // Position, int 0 to 4, clockwise from bottom
    drawHand(cardGroups, position) {

        const handLength = cardGroups.reduce((acc, val) => acc + val.cards.length, 0)

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
        const handWidth = isHorizontal ? handLength * cardWidth : cardWidth;
        const handHeight = isVertical ? handLength * cardHeight : cardHeight;

        const xPos = isVertical ?
            isLeft ? marginSize : width - marginSize - handWidth
            : (width - handWidth) / 2;
        const yPos = isHorizontal ?
            isTop ? marginSize : height - marginSize - handHeight
            : (height - handHeight) / 2;

        let index = 0;
        for (const cardGroup of cardGroups) {
            for (const card of cardGroup.cards) {
                const cardXPos = isHorizontal ? xPos + index * cardWidth : xPos;
                const cardYPos = isVertical ? yPos + index * cardHeight : yPos;

                this.drawCard(cardGroup.deck[card], cardXPos, cardYPos);
                index++
            }
        }
    }

    drawDeck(game) {
        // Draw a single black rectangle in the middle, with a number for how many are left
        const xPos = (this.canvas.width - 50) / 2 - 75;
        const yPos = (this.canvas.height - 100) / 2 - 75;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(xPos, yPos, 50, 100);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`${game.deck.length} cards`, xPos + 5, yPos + 15);
    }

    drawPlayedCards(game) {

        for (const position of Array.from({length: game.numberOfPlayers}, (v, k) => k)) {
            const mostRecentCard = game.playedCardHands[position][game.playedCardHands[position].length - 1];

            const isBottom = position === 0;
            const isLeft = position === 1;
            const isTop = position === 2;
            const isRight = position === 3;

            const isVertical = isLeft || isRight;
            const isHorizontal = isTop || isBottom;

            const width = this.canvas.width;
            const height = this.canvas.height;
            const marginSize = 175
            const cardWidth = 50
            const cardHeight = 100

            const xPos = isVertical ?
                isLeft ? marginSize : width - marginSize - cardWidth
                : (width - cardWidth) / 2;
            const yPos = isHorizontal ?
                isTop ? marginSize : height - marginSize - cardHeight
                : (height - cardHeight) / 2;

            if (mostRecentCard !== undefined) {
                this.drawCard(Deck[mostRecentCard], xPos, yPos);
            }
        }
    }

    drawCard(card, xPos, yPos) {
        switch (card.type) {
            case 'continent':
                this.drawContinentCard(card, xPos, yPos);
                break;
            case 'layover':
                this.drawLayoverCard(card, xPos, yPos);
                break;
            case 'skip':
                this.drawSkipCard(card, xPos, yPos);
                break;
            case 'destination':
                this.drawDestinationCard(card, xPos, yPos);
            default:
                break;

        }
    }

    drawContinentCard(card, xPos, yPos) {

        // Draw a white rectangle card with a border
        this.ctx.fillStyle = this.getContinentColor(card.continent);
        this.ctx.fillRect(xPos, yPos, 50, 100);
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(xPos, yPos, 50, 100);

        // Draw connections as colorful rectangles at the bottom of the card
        let connectionIndex = 0;
        for (const connection of card.connections) {
            this.ctx.fillStyle = this.getContinentColor(connection);
            this.ctx.fillRect(xPos + connectionIndex * 10, yPos + 80, 10, 10);
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 1
            this.ctx.strokeRect(xPos + connectionIndex * 10, yPos + 80, 10, 10);
            connectionIndex++;
        }

        // Draw text
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(card.continent, xPos + 5, yPos + 15);
    }

    drawLayoverCard(card, xPos, yPos) {
        // Draw a white rectangle card with a border
        this.ctx.fillStyle = this.colors.layoverColor;
        this.ctx.fillRect(xPos, yPos, 50, 100);
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(xPos, yPos, 50, 100);

        // Draw text
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "12px Arial";
        this.ctx.fillText('Layover', xPos + 5, yPos + 15);
    }

    drawSkipCard(card, xPos, yPos) {
        // Draw a white rectangle card with a border
        this.ctx.fillStyle = this.colors.skipColor;
        this.ctx.fillRect(xPos, yPos, 50, 100);
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(xPos, yPos, 50, 100);

        // Draw text
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "12px Arial";
        this.ctx.fillText('Skip', xPos + 5, yPos + 15);
    }

    drawDestinationCard(card, xPos, yPos) {
        // Draw a white rectangle card with a border
        this.ctx.fillStyle = this.colors.destinationColor;
        this.ctx.fillRect(xPos, yPos, 50, 100);

        this.ctx.strokeStyle = this.getContinentColor(card.continent);
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(xPos, yPos, 50, 100);

        // Draw text
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(card.continent, xPos + 5, yPos + 15);
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