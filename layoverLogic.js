import {Deck} from './deck0-0-0.js'

export class LayoverGame {
    constructor() {
        // create an array of 52 numbers
        this.deck = Array.from({length: 52}, (v, k) => k);
        this.shuffleDeck()
        this.numberOfPlayers = 4
        this.startingHandSize = 4
        this.sharedCardSize = 3
        this.hands = []
        this.sharedCards = []

        console.log(Deck)
    }

    start() {
        for (const player of Array.from({length: this.numberOfPlayers}, (v, k) => k)) {
            const hand = []
            for (let i = 0; i < this.startingHandSize; i++) {
                hand.push(this.deck.pop())
            }
            this.hands.push(hand)
        }

        for (let i = 0; i < this.sharedCardSize; i++) {
            this.sharedCards.push(this.deck.pop())
        }
    }

    printGame() {
        console.log(this.deck)
        console.log(this.hands)
        for (const hand of this.hands) {
            console.log('Hand')
            for (const card of hand) {
                console.log(Deck[card])
            }
        }
    }

    shuffleDeck() {
        // Fisher-Yates shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    end() {
        this.game.end();
    }
}
