import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import { UserDetails } from './components/UserDetails/UserDetails';
import { PageNotFound } from './components/PageNotFound/PageNotFound';
import { PeopleProvider } from './store/PeopleContext';
import { HomePage } from './components/HomePage/HomePage';
import { PeoplePage } from './components/PeoplePage/PeoplePage';

export const Root = () => {
  return (
    <Router>
      <PeopleProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path='people'>
              <Route index element={<PeoplePage />} />
              <Route path=':id' element={<UserDetails />} />
              <Route path='new' element={<UserDetails />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </PeopleProvider>
    </Router>
  );
};