import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Navigation } from './Navigation';


describe('Navigation', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
  });

  it('activates "Home" link when on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByTestId('nav-home-link')).toHaveClass('nav__item-active');
    expect(screen.getByTestId('nav-people-link')).not.toHaveClass('nav__item-active');
  });

  it('activates "People" link when on home page', () => {
    render(
      <MemoryRouter initialEntries={['/people']}>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByTestId('nav-home-link')).not.toHaveClass('nav__item-active');
    expect(screen.getByTestId('nav-people-link')).toHaveClass('nav__item-active');
  });
});