import { render, screen } from '@testing-library/react';
import App from './App';

test('renders homepage hero content', () => {
  render(<App />);
  expect(screen.getByText(/join our community of volunteers/i)).toBeInTheDocument();
  expect(screen.getByText(/place image: home-hero-illustration\.png/i)).toBeInTheDocument();
});
