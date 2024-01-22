import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import {HomePage} from './HomePage';

describe('HomePage', () => {
  it('renders welcome message when at home page', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome to Home Page!')).toBeInTheDocument();
  });
  
  // it('should not render welcome message when leave home page', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/people']}>
  //       <HomePage />
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.queryByText('Welcome to Home Page!')).not.toBeInTheDocument();
  //   });
  // });
});