export const Deck = []
export const DestinationDecks = [] // 2d array of destinations

const continents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']

//
const connectionCounts = [1, 1, 2, 2, 3, 3, 3, 4, 4]
const destinationCounts = 4

for (let i = 0; i < 52; i++) {
    const card = {}
    const numberOfConnections = connectionCounts[i % connectionCounts.length]
    card.id = i
    card.continent = continents[Math.floor(i / (52/continents.length))]
    card.connections = []
    card.type = 'continent'
    for (let j = 0; j < numberOfConnections; j++) {
        if (j === 0) {
            card.connections.push(card.continent)
            continue
        } else {
            let continent = continents[(i + j) % continents.length]
            let index = 1
            while (card.connections.includes(continent)) {
                continent = continents[(i + j + index) % continents.length]
                index++
            }
            card.connections.push(continent)
        }
    }

    Deck.push(card)
}

const layoverCardCount = 4;
const skipCardCount = 4;

for (let i = 0; i < layoverCardCount; i++) {
    const card = {}
    card.id = 52 + i
    card.type = 'layover'
    Deck.push(card)
}

for (let i = 0; i < skipCardCount; i++) {
    const card = {}
    card.id = 52 + layoverCardCount + i
    card.type = 'skip'
    Deck.push(card)
}

for (let i = 0; i < destinationCounts; i++) {
    DestinationDecks.push([])
    for (let j = 0; j < continents.length; j++) {
        const card = {}
        card.id = j
        card.type = 'destination'
        card.continent = continents[j]
        DestinationDecks[i].push(card)
    }
}