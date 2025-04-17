// src/components/EntityList.js
import React from 'react';
import { Link } from 'react-router-dom';

const EntityList = () => {
  return (
    <div>
      <h1>Entities</h1>
      <ul>
        {/* Example of a list of entities */}
        <li>
          <Link to="/entity/1">Entity 1</Link> {/* Link to specific entity */}
        </li>
        <li>
          <Link to="/entity/2">Entity 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default EntityList;
