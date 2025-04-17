import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EntityDetail = () => {
  const [selectedId, setSelectedId] = useState('');
  const [entity, setEntity] = useState(null);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);

    try {
      const res = await axios.get(`http://localhost:3000/api/entities/${id}`);
      setEntity(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch entity');
      setEntity(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Select an Entity</h2>
      <select onChange={handleChange} value={selectedId}>
        <option value="">-- Choose an entity --</option>
        <option value="1">Entity 1</option>
        <option value="2">Entity 2</option>
        <option value="3">Entity 3</option>
        {/* Add more IDs as needed */}
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {entity && (
        <div style={{ marginTop: '20px' }}>
          <h3>Entity Details</h3>
          <p><strong>ID:</strong> {entity.id}</p>
          <p><strong>Name:</strong> {entity.name}</p>
          <p><strong>Description:</strong> {entity.description}</p>
          <p><strong>Created By:</strong> {entity.created_by}</p>
        </div>
      )}
    </div>
  );
};

export default EntityDetail;
