'use client';
import React from 'react';
import styled from 'styled-components';

const ScheduleCard = () => {
    return (
        <StyledWrapper>
            <div className="card">
                <div className="card__border" />
                <div className="card_title__container">
                    <span className="card_title">Schedule a free demo</span>
                    <p className="card_paragraph">Try a 30-min demo with one of our tutors and see the learning plan.</p>
                </div>
                <hr className="line" />
                <ul className="card__list">
                    <li className="card__list_item">
                        <span className="check">
                            <svg className="check_svg" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                            </svg>
                        </span>
                        <span className="list_text">Live Google Meet</span>
                    </li>
                    <li className="card__list_item">
                        <span className="check">
                            <svg className="check_svg" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                            </svg>
                        </span>
                        <span className="list_text">Curriculum aligned</span>
                    </li>
                    <li className="card__list_item">
                        <span className="check">
                            <svg className="check_svg" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" fillRule="evenodd" />
                            </svg>
                        </span>
                        <span className="list_text">In-house tutors</span>
                    </li>
                </ul>
                <button className="button">Book demo</button>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card {
    /* Use Global Theme Variables */
    --white: var(--color-surface); 
    --black: var(--color-background); /* Dark background in dark mode, light in light mode? No, this needs to invert correctly. */
    --text-main: var(--color-text-primary);
    --text-muted: var(--color-text-secondary);
    --border-line: var(--color-border);
    --primary-color: var(--color-primary);
    --secondary-color: var(--color-secondary);

    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    width: 22rem; /* Slightly wider for our content */
    
    /* Dynamic Background based on Theme */
    background-color: var(--color-surface); 
    
    /* Retaining the gradient feel but adapting to theme colors via RGBA/Vars if possible. 
       For simplicity and theme consistency, I'll use a cleaner gradient that matches the global theme. */
     background-image: 
        radial-gradient(at 0% 0%, rgba(var(--color-primary-rgb), 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(var(--color-secondary-rgb), 0.1) 0px, transparent 50%);
    
    /* In dark mode, we might want the original heavy dark gradients. 
       But for "Light Mode compatibility", the heavy black gradients won't work.
       I will use the .bg-glass properties instead effectively. */
    
    border-radius: 1rem;
    /* Glass border effect */
    border: 1px solid var(--color-border);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
    
    /* Ensure text colors are correct */
    color: var(--color-text-primary);
  }

  /* Specific Dark Mode overrides if we want the "Cyber" look only in Dark Mode */
  [data-theme='dark'] .card {
     box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.05) inset;
     background-color: #0D1117; /* Hardcoded dark surface */
     /* Re-introduce the provided heavy radients only for Dark Mode if desired, 
        but matching the global "Smokey" theme is safer. */
  }

  .card .card__border {
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: -10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    
    /* Animated Border Gradient */
    background-image: linear-gradient(
      0deg,
      transparent -50%,
      var(--color-border) 100%
    );
    
    border-radius: 1rem;
  }

  .card .card__border::before {
    content: "";
    pointer-events: none;
    position: fixed;
    z-index: 200;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%), rotate(0deg);
    transform-origin: left;
    width: 200%;
    height: 10rem;
    
    /* The rotating sheen */
    background-image: linear-gradient(
      0deg,
      transparent 0%,
      var(--color-primary) 40%,
      var(--color-primary) 60%,
      transparent 100%
    );

    animation: rotate 8s linear infinite;
    opacity: 0.5;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }

  .card .card_title__container .card_title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .card .card_title__container .card_paragraph {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }

  .card .line {
    width: 100%;
    height: 1px;
    background-color: var(--color-border);
    border: none;
    margin: 0.5rem 0;
  }

  .card .card__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .card .card__list .card__list_item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .card .card__list .card__list_item .check {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.25rem;
    height: 1.25rem;
    background-color: var(--color-primary); /* Blue check bg */
    border-radius: 50%;
  }

  .card .card__list .card__list_item .check .check_svg {
    width: 0.85rem;
    height: 0.85rem;
    fill: white; 
  }

  .card .card__list .card__list_item .list_text {
    font-size: 0.9rem;
    color: var(--color-text-primary);
    font-weight: 500;
  }

  .card .button {
    cursor: pointer;
    margin-top: 1rem;
    padding: 0.75rem;
    width: 100%;
    
    background-image: linear-gradient(
      to right,
      var(--color-primary),
      var(--color-secondary)
    );

    font-size: 0.95rem;
    font-weight: 600;
    color: white; /* Always white text on the gradient button */

    border: 0;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }
  
  .card .button:hover {
      transform: scale(1.02);
  }
`;

export default ScheduleCard;
