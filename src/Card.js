import './Card.css';

const Card = ({ card }) => {
    return (
        <div className="Card">
            <img
                src={card.image}
                alt={card.code}
                style={{
                    transform: `rotate(${card.rotation}deg) translate(${card.translation.x}px, ${card.translation.y}px)`
                }}
            />
        </div>
    )
}

export default Card;