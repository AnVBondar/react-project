import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import { getPeople } from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';

type PeopleContextType = {
  peopleList: Person[];
  errorMessage: string;
  isLoading: boolean;
  setPeopleList: React.Dispatch<React.SetStateAction<Person[]>>;
  isPeopleEmpty: boolean;
  deletePerson: (personID: number) => void;
  updatePersonData: (updatedData: Person, actions: string) => void;
  setNewForm: React.Dispatch<React.SetStateAction<boolean>>;
  newForm: boolean;
};

export const PeopleContext = React.createContext<PeopleContextType>({
  peopleList: [] as Person[],
  errorMessage: '',
  isLoading: false,
  setPeopleList: () => {},
  deletePerson: () => {},
  updatePersonData: () => {},
  setNewForm: () => {},
  isPeopleEmpty: false,
  newForm: false,
});

type Props = {
  children: React.ReactNode;
};

export const PeopleProvider: React.FC<Props> = ({ children }) => {
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPeopleEmpty, setIsPeopleEmpty] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/people') {
      (async () => {
        setIsLoading(true);
        try {
          const dataFromAPI = await getPeople();
          const people = dataFromAPI.map(person => {
            return {...person, photo: '/react-project/src/icons/no_img.png'};
          })

          if (!people.length) {
            setIsLoading(false);
            setIsPeopleEmpty(true);

            return;
          }

          //To add additional logic to the data from API, choose option to store 
          //all changes on localStorage to be able realise all functional. 
          const localStorage = JSON.parse(window.localStorage.getItem('people') || '[]');

          if (!localStorage.length) {
            window.localStorage.setItem('people', JSON.stringify(people));
            
            setPeopleList(people);
          } else {
            setPeopleList(localStorage);
          }

        } catch {
          setErrorMessage('Something went wrong');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [pathname]);

  const deletePerson = (personID: number): void => {
    const newPeopleList = peopleList.filter(person => person.id !== +personID);
    
    window.localStorage.setItem('people', JSON.stringify(newPeopleList));
    setPeopleList(newPeopleList);
    navigate("/people");
  }

  //In case with API, this function will send method PATCH to server to update data
  //and in case with error from server, will throw warning message to User that data wasn't save.
  const updatePersonData = (updatedData: Person, action: string): void => {
    let updatedPeopleList = [...peopleList];

    if (action === 'update') {
      updatedPeopleList = peopleList.map(person => {
        if (person.id === updatedData.id) {
          return updatedData;
        }

        return person;
      });
    } else {
      updatedPeopleList.push(updatedData);
      setNewForm(false);
    }

    window.localStorage.setItem('people', JSON.stringify(updatedPeopleList));
    setPeopleList(updatedPeopleList);
    navigate("/people");
  }

  const value = {
    errorMessage,
    isLoading,
    setPeopleList,
    deletePerson,
    updatePersonData,
    setNewForm,
    isPeopleEmpty,
    peopleList,
    newForm,
  };

  return (
    <PeopleContext.Provider value={value}>
      {children}
    </PeopleContext.Provider>
  );
};