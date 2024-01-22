import { useCallback, useContext, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PeopleContext } from "../../store/PeopleContext";
import { Loader } from "../Loader/Loader";
import "./PeoplePage.scss";

export const PeoplePage = () => {
  const { 
    isLoading, 
    peopleList, 
    isPeopleEmpty, 
    errorMessage, 
    setNewForm 
  } = useContext(PeopleContext);
  const [query, setQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParams = searchParams.get('query')?.toLocaleLowerCase() || '';
  const navigate = useNavigate();

  const timerId = useRef(0);

  //Search value comes from the input and with delay to be added to SearchParams.
  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const val = event.target.value;

    setQuery(val);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      if (params.has('query') && !val) {
        params.delete('query');
        setSearchParams(params);

        return;
      }

      params.set('query', val);
      setSearchParams(params);
    }, 500);
  };

  //Filter people list subject to search value
  const getFilteredPeople = useCallback(() => {
    if (!filterParams) {
      return peopleList;
    }

    const newList = peopleList.filter(person => 
      person.name.toLocaleLowerCase().includes(filterParams) 
    || person.email.toLocaleLowerCase().includes(filterParams) 
    || person.phone.includes(filterParams));

    return newList;
  }, [peopleList, filterParams]);


  const filretedPeople = getFilteredPeople();

  const handleCreateForm = () => {
    setNewForm(true);

    navigate('/people/new');
  };

  return (
    <section className="people">
      <div className="people__container">
        <h1>People page</h1>
        <article className="people__content">
          {isLoading ? (
            <Loader />
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : isPeopleEmpty ? (
            <>
              <p>no people on server</p>
            </>
          ) : (
            <div className="people__content-wrapp">
              <ul className="people__list-top">
                <li className="people__item-top">
                  <p>Photo</p>
                </li>
                <li className="people__item-top">
                  <p>Name</p>
                </li>
                <li className="people__item-top">
                  <p>Email / Contacts</p>
                </li>
                <li className="people__item-top">
                  <div className="people__input-container">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={query} 
                      onChange={e => handleQuery(e)} 
                      className="people__input"
                    />
                    <button 
                      className="btn btn__upload" 
                      onClick={() => handleCreateForm()}
                    >
                      Create
                    </button>
                  </div>
                </li>
              </ul>
              <ul className="people__list-body">
                {filretedPeople.map((person) => (
                  <li className="people__list-row" key={person.id}>
                    <ul className="people__list-col">
                      <li className="people__item-col">
                        <div className="people__item-photo">
                          <img src={person.photo} alt="profile photo" />
                        </div>
                      </li>
                      <li className="people__item-col">
                        <p data-testid="person-name" className="people__name">{person.name}</p>
                      </li>
                      <li className="people__item-col">
                        <ul className="people__contacts-container">
                          <li>
                            <a 
                              href={`mailto:${person.email}`} 
                              className="people__contacts-link people__contacts-email"
                            >
                              {person.email}
                            </a>
                          </li>
                          <li>
                            <a 
                              href={`tel:${person.phone}`} 
                              className="people__contacts-link people__contacts-phone"
                            >
                              {person.phone}
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li className="people__item-col">
                        <div className="btn btn__upload people__item-btn">
                          <Link 
                            className="people__item-link" 
                            to={`/people/:${person.id}`}
                          >
                            Details
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
