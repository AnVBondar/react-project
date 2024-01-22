import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, } from 'vitest';
import {PeoplePage} from './PeoplePage';
import { PeopleContext } from '../../store/PeopleContext';
import { act } from 'react-dom/test-utils';


describe('People Page', () => {
  const mockedPeople = [
    {
      id: 1,
      name: 'Jhon Wick',
      email: 'example@gmail.com',
      phone: '+111.222.333',
    },
    {
      id: 2,
      name: 'Jimmy',
      email: 'example2@gmail.com',
      phone: '+999.456.333',
    },
    {
      id: 3,
      name: 'Sara Konnor',
      email: 'example3@gmail.com',
      phone: '+145.2132.888',
    },
  ] 
  const mockContextValue = {
    isLoading: false,
    peopleList: mockedPeople,
  };

  it('renders UserDetails component', () => {
    render(
        <MemoryRouter>
          <PeoplePage />
        </MemoryRouter>
    );
    
      expect(screen.getByText('People page')).toBeInTheDocument();
  });

  it('loader should not render if isLoading false', () => {
    render(
      <PeopleContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <PeoplePage />
        </MemoryRouter>
      </PeopleContext.Provider>
    );

    expect(screen.queryByTestId('loader')).toBeNull();
  })

  it('should render correct number of values from the array', () => {
    render(
      <PeopleContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <PeoplePage />
        </MemoryRouter>
      </PeopleContext.Provider>
    );

    const people = screen.queryAllByTestId('person-name');

    expect(people).toHaveLength(3);
  })

  it('should insert input value to Search correct', () => {
    render(
      <PeopleContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <PeoplePage />
        </MemoryRouter>
      </PeopleContext.Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search...');

    fireEvent.change(searchInput, { target: { value: 'Jimmy' }});

    expect(searchInput.value).toBe('Jimmy');
  })

  it('renders filtered people based on search input', async () => {
    render(
      <PeopleContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <PeoplePage />
        </MemoryRouter>
      </PeopleContext.Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search...');

    fireEvent.change(searchInput, { target: { value: 'Jimmy' }});

    await act(() => new Promise((resolve) => setTimeout(resolve, 600)));

    const people = screen.queryAllByTestId('person-name');
    
    expect(people).toHaveLength(1);
  })
});