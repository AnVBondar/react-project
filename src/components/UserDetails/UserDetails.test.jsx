import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it,} from 'vitest';
import {UserDetails} from './UserDetails'

describe('UserDetails', () => {
  it('renders UserDetails component', () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );
    
      expect(screen.getByText('User details')).toBeInTheDocument();
  });

  it('renders loader after component mount', () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  })

  it('loader should not renders after timeout 500ms', async () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeNull();
    })
  })

  it('checking if Name, Email, Street labels are render', async () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeNull();
    })

    const labelNames = screen.queryAllByText('Name');
    expect(screen.queryByText('Street')).toBeInTheDocument();
    expect(screen.queryByText('Email')).toBeInTheDocument();
    expect(labelNames).toHaveLength(2);
  })

  it('checking if entered data to input Name renders', async () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeNull();
    })

     const nameInput = screen.queryAllByLabelText('Name')[0];

     fireEvent.change(nameInput, { target: { value: 'John Doe' } });
 
     expect(nameInput.value).toBe('John Doe');
  })

  it('checking if Name, Email, Street labels are render', async () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeNull();
    })

    const labelNames = screen.queryAllByText('Name');
    expect(screen.queryByText('Street')).toBeInTheDocument();
    expect(screen.queryByText('Email')).toBeInTheDocument();
    expect(labelNames).toHaveLength(2);
  })

  it('checking if entered data to input Name renders correct', async () => {
    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeNull();
    })

     const nameInput = screen.queryAllByLabelText('Name')[0];

     fireEvent.change(nameInput, { target: { value: 'John Doe' } });
 
     expect(nameInput.value).toBe('John Doe');
  });
});
