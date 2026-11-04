import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from './Contact';
import '@testing-library/jest-dom';

// Mock analytics
jest.mock('../utils/analytics', () => ({
  trackEvent: jest.fn(),
  trackSocial: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockReset();
  });

  it('renders contact form correctly', () => {
    render(<Contact />);
    
    expect(screen.getByText(/build something/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your project/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('displays validation error when submitting empty fields', async () => {
    render(<Contact />);
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully when fields are filled', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<Contact />);
    
    fireEvent.change(screen.getByPlaceholderText(/enter your full name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your email address/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/describe your project/i), {
      target: { value: 'This is a valid test message with more than 10 characters.' }
    });
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
