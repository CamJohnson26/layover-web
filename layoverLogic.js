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
        this.playedDestinationHands = []
        this.sharedCards = []

        // Setup the played cards
        for (const player of Array.from({length: this.numberOfPlayers}, (v, k) => k)) {
            this.playedCardHands.push([])
            this.playedDestinationHands.push([])
        }

        this.currentPlayerTurn = 0
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

            this.destinationDecks.push(destinationDeck)
            this.destinationHands.push(destinationHand)
        }

        for (let i = 0; i < this.sharedCardSize; i++) {
            this.sharedCards.push(this.deck.pop())
        }
    }

    makeMove() {
        let playedDestination = false
        let destinationHandCardIndex = 0
        for (const destinationCardIndex of this.destinationHands[this.currentPlayerTurn]) {
            const destinationCard = DestinationDecks[this.currentPlayerTurn][destinationCardIndex]
            const lastPlayedCardIndex = this.playedCardHands[this.currentPlayerTurn][this.playedCardHands[this.currentPlayerTurn].length - 1]
            const lastPlayedCard = Deck[lastPlayedCardIndex]
            if (destinationCard.continent === lastPlayedCard?.continent) {
                this.playDestination(destinationHandCardIndex, this.currentPlayerTurn)
                playedDestination = true
            }
            destinationHandCardIndex++
        }

        if (!playedDestination) {
            let playCardIndex = -1
            let handCardIndex = 0
            for (const cardIndex of this.hands[this.currentPlayerTurn]) {

                if (this.canPlayCard(this.currentPlayerTurn, Deck[cardIndex])) {

                    // If they have a card that matches a destination, play it, otherwise play a random card
                    const handCard = Deck[cardIndex]
                    for (const destinationCardIndex of this.destinationHands[this.currentPlayerTurn]) {
                        const destinationCard = DestinationDecks[this.currentPlayerTurn][destinationCardIndex]
                        if (handCard.continent === destinationCard.continent) {
                            if (playCardIndex === -1) {
                                playCardIndex = handCardIndex
                            }
                        } else {
                            if (playCardIndex === -1) {
                                playCardIndex = handCardIndex
                            }
                        }
                    }
                }
                handCardIndex++
            }
            if (playCardIndex !== -1) {
                this.playedCardHands[this.currentPlayerTurn].push(this.hands[this.currentPlayerTurn].splice(playCardIndex, 1)[0])
            }

            // Draw a card
            let candidateSharedCard = undefined;
            const currentDestinationCards = this.destinationHands[this.currentPlayerTurn].map((destinationCardIndex) => DestinationDecks[this.currentPlayerTurn][destinationCardIndex])
            for (const sharedCardIndex of this.sharedCards) {
                if (Deck[sharedCardIndex].type !== 'continent') {
                    candidateSharedCard = sharedCardIndex
                }
                if (Deck[sharedCardIndex].type === 'continent' && candidateSharedCard === undefined
                    && currentDestinationCards.some((destinationCard) => destinationCard.continent === Deck[sharedCardIndex].continent)
                    && this.canPlayCard(this.currentPlayerTurn, Deck[sharedCardIndex])
                ) {
                    candidateSharedCard = sharedCardIndex
                }
            }

            const drawnCard = this.deck.pop()
            if (candidateSharedCard !== undefined) {
                this.hands[this.currentPlayerTurn].push(candidateSharedCard)
                this.sharedCards.splice(this.sharedCards.indexOf(candidateSharedCard), 1)
                if (drawnCard) {
                    this.sharedCards.push(drawnCard)
                }
            } else {
                if (drawnCard) {
                    this.hands[this.currentPlayerTurn].push(drawnCard)
                }

            }
        }
        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % this.numberOfPlayers
    }

    canPlayCard(playerIndex, card) {
        const mostRecentCardIndex = this.playedCardHands[playerIndex][this.playedCardHands[playerIndex].length - 1]
        if (mostRecentCardIndex === undefined) {
            return true;
        }
        const lastPlayedCard = Deck[mostRecentCardIndex]

        if (card.type !== 'continent' || lastPlayedCard.type !== 'continent') {
            return true;
        }
        // Check if the most recently played card has a connection to the card being played
        return lastPlayedCard.connections.includes(card.continent)
    }

    playDestination(destinationHandCardIndex, playerIndex) {
        const destinationCard = this.destinationHands[playerIndex].splice(destinationHandCardIndex, 1)[0]
        this.playedDestinationHands[this.currentPlayerTurn].push(destinationCard)

        const newDestinationCard = this.destinationDecks[playerIndex].pop()

        if (newDestinationCard !== undefined) {
            this.destinationHands[playerIndex].push(newDestinationCard)
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
        alert('Game Over')
    }
}
