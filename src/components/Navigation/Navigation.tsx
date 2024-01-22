import {NavLink} from 'react-router-dom';
import cn from 'classnames';
import './Navigation.scss';

export const Navigation = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => cn(
    'nav__item', {
      'nav__item-active': isActive,
    },
  );
  return (
    <nav className="nav">
      <div className='nav__list'>
        <NavLink data-testid='nav-home-link' className={getNavLinkClass} to={'/'}>Home</NavLink>
        <NavLink data-testid='nav-people-link' className={getNavLinkClass} to={'/people'}>People</NavLink>
      </div>
    </nav>
  );
}