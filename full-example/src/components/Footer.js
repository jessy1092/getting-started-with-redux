
import React from 'react';

import FilterLink from '../containers/FilterLink';

// Presentational Component
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>All</FilterLink>
    {', '}
    <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
    {', '}
    <FilterLink filter='SHOW_COMPLETED'>completed</FilterLink>
  </p>
);

export default Footer;
