import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import '@testing-library/jest-dom';

// Polyfill canvas & matchMedia for jsdom
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Mock analytics
jest.mock('../utils/analytics', () => ({
  trackEvent: jest.fn(),
  trackSocial: jest.fn()
}));

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section with main heading', () => {
    render(<Hero />);
    
    expect(screen.getByRole('heading', { level: 1, name: /Mukesh Pal/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Full-Stack Developer/i).length).toBeGreaterThan(0);
  });

  it('displays role and description text', () => {
    render(<Hero />);
    
    expect(screen.getByText(/React\.js/i)).toBeInTheDocument();
    expect(screen.getByText(/Java Spring Boot/i)).toBeInTheDocument();
  });

  it('has CTA and action links', () => {
    render(<Hero />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    const hasWorkOrResume = links.some(link => {
      const href = link.getAttribute('href') || '';
      return href === '#work' || href.includes('resume') || link.textContent.toLowerCase().includes('explore');
    });
    expect(hasWorkOrResume).toBe(true);
  });

  it('uses proper semantic HTML structure', () => {
    const { container } = render(<Hero />);
    
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
    
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
  });
});
