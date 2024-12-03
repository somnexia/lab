// src/components/StorageUnitList.js
import React, { Component } from 'react';
import axios from 'axios';
import StorageUnit from './StorageUnit';

class StorageUnitС extends Component {
  state = {
    storageUnits: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchStorageUnits();
  }

  fetchStorageUnits = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/storageUnits');
      this.setState({ storageUnits: response.data, loading: false });
    } catch (error) {
      this.setState({ error: 'Ошибка при загрузке данных.', loading: false });
    }
  };

  render() {
    const { storageUnits, loading, error } = this.state;

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div>
        <h2>Список блоков хранения</h2>
        {storageUnits.map(unit => (
          <StorageUnit key={unit.id} storageUnit={unit} />
        ))}
      </div>
    );
  }
}

export default StorageUnitС;
