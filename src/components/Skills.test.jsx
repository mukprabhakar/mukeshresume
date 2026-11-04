import React from 'react';
import { render, screen } from '@testing-library/react';
import Skills from './Skills';
import '@testing-library/jest-dom';

// Mock chart libraries for jsdom
jest.mock('react-chartjs-2', () => ({
  Radar: () => <div data-testid="radar-chart">Radar Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  RadialLinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Filler: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  ArcElement: jest.fn()
}));

describe('Skills Component', () => {
  it('renders skills section with heading', () => {
    render(<Skills />);
    
    expect(screen.getByText(/Arsenal/i)).toBeInTheDocument();
  });

  it('displays search input and skill categories', () => {
    render(<Skills />);
    
    expect(screen.getByPlaceholderText(/search skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Programming Languages/i)).toBeInTheDocument();
  });

  it('displays programming languages and React', () => {
    render(<Skills />);
    
    expect(document.body.textContent).toMatch(/React/i);
    expect(document.body.textContent).toMatch(/Java/i);
    expect(document.body.textContent).toMatch(/JavaScript/i);
  });

  it('has proper semantic HTML structure', () => {
    const { container } = render(<Skills />);
    
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);
  });
});
