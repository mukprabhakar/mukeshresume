import React, { useRef, useState } from 'react'

const TiltCard = ({ children, className = '' }) => {
    const cardRef = useRef(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e) => {
        if (!cardRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * 10 // Max rotation deg
        const rotateY = ((centerX - x) / centerX) * 10

        setRotation({ x: rotateX, y: rotateY })
        setOpacity(1)
    }

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 })
        setOpacity(0)
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transform-gpu transition-transform duration-200 ease-out ${className}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
        >
            <div
                className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
                style={{
                    opacity,
                    background: `radial-gradient(circle at ${50 - rotation.y * 5}% ${50 - rotation.x * 5}%, rgba(255,255,255,0.1), transparent 40%)`
                }}
            />
            {children}
        </div>
    )
}

export default TiltCard
