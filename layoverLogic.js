import {Deck, DestinationDecks} from './deck0-0-0.js'

export class LayoverGame {
    constructor() {
        // create an array of 52 numbers
        this.deck = Array.from({length: Deck.length}, (v, k) => k);
        this.destinationDecks = []
        this.shuffle(this.deck)
        this.numberOfPlayers = 4
        this.startingHandSize = 4
        this.sharedCardSize = 3
        this.hands = []
        this.destinationHands = []
        this.playedCardHands = []
        this.sharedCards = []
    }

    start() {
        for (const player of Array.from({length: this.numberOfPlayers}, (v, k) => k)) {
            const hand = []
            for (let i = 0; i < this.startingHandSize; i++) {
                hand.push(this.deck.pop())
            }
            this.hands.push(hand)

            const destinationDeck = Array.from({length: DestinationDecks[player].length}, (v, k) => k)
            this.shuffle(destinationDeck)

            const destinationHand = []
            destinationHand.push(destinationDeck.pop())
            destinationHand.push(destinationDeck.pop())
            console.log(destinationHand, destinationDeck)

            this.destinationDecks.push(destinationDeck)
            this.destinationHands.push(destinationHand)
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

    shuffle(deck) {
        // Fisher-Yates shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    end() {
        this.game.end();
    }
}
