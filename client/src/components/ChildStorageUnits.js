import React, { Component } from 'react';

class ChildStorageUnits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childUnits: [], // Дочерние блоки
      isLoading: false, // Состояние загрузки
    };
  }

  // Загружаем дочерние блоки при монтировании компонента
  componentDidMount() {
    this.loadChildUnits();
  }

  // Загружаем дочерние блоки при изменении родительского блока
  componentDidUpdate(prevProps, prevState) {
    // Если выбран новый родительский блок, загружаем новые дочерние блоки
    if (prevProps.unit.id !== this.props.unit.id) {
      this.loadChildUnits();
    }

    // Если изменился список дочерних блоков, обновляем фильтры
    if (prevState.childUnits !== this.state.childUnits) {
      const uniqueTypes = [...new Set(this.state.childUnits.map((child) => child.unit_type))];
      this.props.setFilterOptions(uniqueTypes); // Обновляем доступные фильтры
    }
  }

  loadChildUnits = async () => {
    const { unit } = this.props;
    this.setState({ isLoading: true });

    try {
      // Загружаем дочерние элементы для текущего блока
      const response = await fetch(`http://localhost:3000/api/storageUnits/${unit.id}`);
      const data = await response.json();
      this.setState({ childUnits: data.children || [] });
    } catch (error) {
      console.error('Ошибка загрузки дочерних единиц:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { childUnits, isLoading } = this.state;
    const { filterType, onUnitClick } = this.props;

    // Применяем фильтрацию
    const filteredChildUnits = filterType
      ? childUnits.filter((child) => child.unit_type === filterType)
      : childUnits;

    return (
      <ul className="nav flex-column navbar-nav">
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredChildUnits.length > 0 ? (
          filteredChildUnits.map((child) => (
            <li className="nav-item inventory-nav-item mb-1" key={child.id}>
              <a
                className="nav-link inventory-link"
                style={{ cursor: 'pointer' }}
                onClick={() => onUnitClick(child)} // Вызываем onUnitClick при клике
              >
                {child.unit_name}
              </a>
            </li>
          ))
        ) : (
          <p>No child units available.</p>
        )}
      </ul>
    );
  }
}

export default ChildStorageUnits;
