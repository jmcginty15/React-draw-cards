import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import './Deck.css'
import Card from './Card';

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [remaining, setRemaining] = useState(52);
    const [drawnCards, setDrawnCards] = useState([]);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/')
            .then(res => {
                setDeck(res.data);
                setRemaining(res.data.remaining);
            });
    }, []);

    useEffect(() => {
        if (drawing && remaining) {
            setTimeout(() => {
                drawCard();
            }, 1000);
        }
    }, [remaining]);

    function drawCard() {
        axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`)
            .then(res => {
                const newCard = res.data.cards[0];
                newCard.rotation = Math.floor(Math.random() * 180);
                newCard.translation = { x: Math.floor(Math.random() * 50 - 25), y: Math.floor(Math.random() * 50 - 25) };
                newCard.key = uuid();
                const newDrawnCards = [...drawnCards, res.data.cards[0]];
                setDrawnCards(newDrawnCards);
                setRemaining(res.data.remaining);
                if (res.data.remaining === 0) {
                    setDrawing(false);
                    alert('Out of cards!');
                }
            });
    }

    function shuffleDeck() {
        axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)
            .then(res => {
                setDrawnCards([]);
                setRemaining(res.data.remaining);
            });
    }

    function handleDrawClick() {
        if (!drawing) {
            if (remaining) drawCard();
            else shuffleDeck();
        }
    }

    function handleToggleClick() {
        const newDrawing = !drawing;
        setDrawing(newDrawing);
        if (remaining && newDrawing) drawCard();
    }

    return (
        <div className="Deck">
            {deck ? (
                <div className="Deck-draw-button">
                    <button onClick={handleDrawClick}>{remaining ? 'Draw' : 'Reshuffle'}</button>&nbsp;
                    <button onClick={handleToggleClick}>{drawing ? 'Stop drawing' : 'Start drawing'}</button>
                </div>
            ) : (
                    <div className="Deck-draw-button">Loading Deck</div>
                )
            }
            {drawnCards.map(card => <Card key={card.key} card={card} />)}
        </div>
    )
}

export default Deck;