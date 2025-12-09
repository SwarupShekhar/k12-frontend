'use client';

import React from 'react';
import styled from 'styled-components';

interface InteractiveCardProps {
    children: React.ReactNode;
    variant?: 'purple' | 'green' | 'blue' | 'orange';
}

const InteractiveCard = ({ children, variant = 'purple' }: InteractiveCardProps) => {
    return (
        <StyledWrapper $variant={variant}>
            <div className="card">
                <div className="blobs">
                    <div className="two" />
                    <div className="three" />
                </div>
                <div className="one">
                    {children}
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div<{ $variant: string }>`
  height: 100%;
  width: 100%;

  .card {
    width: 100%;
    height: 100%;
    min-height: 500px;
    background: transparent;
    position: relative;
    border-radius: 24px; /* rounded-3xl */
  }

  /* Content Container (Glass) */
  .card .one {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
    background: rgba(255, 255, 255, 0.55);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: hidden; /* Ensure content respects border radius */
    padding: 2rem; /* p-8 equivalent */
    display: flex;
    flex-direction: column;
  }
  
  /* Dark mode adjustments via global classes if needed, or stick to this style */
  @media (prefers-color-scheme: dark) {
      .card .one {
           background: rgba(255, 255, 255, 0.1);
           border: 1px solid rgba(255, 255, 255, 0.1);
      }
  }

  /* Blobs Container to keep them behind content */
  .card .blobs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 24px;
      z-index: 0;
      pointer-events: none;
  }

  .card .two {
    width: 150px;
    height: 150px;
    background-color: ${props => props.$variant === 'orange' ? 'rgb(255, 165, 0)' : 'rgb(131, 25, 163)'};
    filter: drop-shadow(0 0 20px ${props => props.$variant === 'orange' ? 'rgb(255, 165, 0)' : 'rgb(131, 25, 163)'});
    border-radius: 50%;
    position: absolute;
    top: 30px;
    left: 20px;
    animation: one 15s infinite;
    opacity: 0.6;
  }

  .card .three {
    width: 150px;
    height: 150px;
    background-color: ${props => props.$variant === 'orange' ? 'rgb(255, 215, 0)' : 'rgb(29, 209, 149)'};
    filter: drop-shadow(0 0 20px ${props => props.$variant === 'orange' ? 'rgb(255, 215, 0)' : 'rgb(29, 209, 149)'});
    border-radius: 50%;
    position: absolute;
    top: 50%;
    right: 20px;
    animation: two 15s infinite;
    opacity: 0.6;
  }

  @keyframes one {
    0% { top: 10%; left: 10%; }
    25% { top: 30%; left: 40%; }
    50% { top: 10%; left: 70%; }
    75% { top: 40%; left: 40%; }
    100% { top: 10%; left: 10%; }
  }

  @keyframes two {
    0% { top: 70%; right: 10%; }
    25% { top: 50%; right: 40%; }
    50% { top: 70%; right: 70%; }
    75% { top: 50%; right: 40%; }
    100% { top: 70%; right: 10%; }
  }
`;

export default InteractiveCard;
