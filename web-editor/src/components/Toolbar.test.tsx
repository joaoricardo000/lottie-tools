import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('should render the application title', () => {
    render(<Toolbar />);
    expect(screen.getByText('Lottie Open Studio')).toBeInTheDocument();
  });

  it('should render Import SVG button', () => {
    render(<Toolbar />);
    expect(screen.getByText('Import SVG')).toBeInTheDocument();
  });

  it('should render Import Lottie button', () => {
    render(<Toolbar />);
    expect(screen.getByText('Import Lottie')).toBeInTheDocument();
  });

  it('should render Export button', () => {
    render(<Toolbar />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('should have correct CSS class', () => {
    const { container } = render(<Toolbar />);
    expect(container.querySelector('.toolbar')).toBeInTheDocument();
  });
});
