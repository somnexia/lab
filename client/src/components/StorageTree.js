import React, { Component } from 'react';
import { GitBranch, Layers, Package, Search } from 'lucide-react';
import StorageUnit from './StorageUnit';
import { API } from '../config/api';
import { http } from '../config/http';

/**
 * StorageTree — дерево единиц хранения (пункт 7).
 * Было: axios.get('http://localhost:3000/api/storageUnits')
 * Стало: http.get(API.storageUnits)
 * Проверить: GET /api/storageUnits
 */
class StorageTree extends Component {
  state = {
    error: null,
    loading: true,
    searchTerm: '',
    storageUnits: [],
    typeFilter: '',
  };

  componentDidMount() {
    this.fetchStorageUnits();
  }

  fetchStorageUnits = async () => {
    try {
      this.setState({ loading: true, error: null });
      const response = await http.get(API.storageUnits);
      this.setState({ storageUnits: response.data, loading: false });
    } catch (error) {
      console.error('Ошибка при загрузке дерева хранения:', error);
      this.setState({ error: 'Ошибка при загрузке дерева хранения.', loading: false });
    }
  };

  buildStorageTree = () => {
    const { storageUnits } = this.state;
    const unitMap = new Map();

    storageUnits.forEach((unit) => {
      unitMap.set(unit.id, {
        ...unit,
        children: [],
      });
    });

    storageUnits.forEach((unit) => {
      const normalizedUnit = unitMap.get(unit.id);
      const nestedChildren = Array.isArray(unit.children) ? unit.children : [];

      nestedChildren.forEach((child) => {
        if (!unitMap.has(child.id)) {
          unitMap.set(child.id, {
            ...child,
            children: Array.isArray(child.children) ? child.children : [],
          });
        }

        const childNode = unitMap.get(child.id);
        if (!normalizedUnit.children.some((existingChild) => existingChild.id === childNode.id)) {
          normalizedUnit.children.push(childNode);
        }
      });

      if (unit.parent_id && unitMap.has(unit.parent_id)) {
        const parent = unitMap.get(unit.parent_id);
        if (!parent.children.some((child) => child.id === normalizedUnit.id)) {
          parent.children.push(normalizedUnit);
        }
      }
    });

    return Array.from(unitMap.values()).filter((unit) => !unit.parent_id);
  };

  getNestedUnitCount = (unit) => {
    const children = Array.isArray(unit.children) ? unit.children : [];

    return children.reduce((total, child) => total + 1 + this.getNestedUnitCount(child), 0);
  };

  getInventoryCount = (unit) => {
    const inventories = Array.isArray(unit.inventories) ? unit.inventories.length : 0;
    const children = Array.isArray(unit.children) ? unit.children : [];

    return children.reduce((total, child) => total + this.getInventoryCount(child), inventories);
  };

  getTypeOptions = () => {
    return [...new Set(this.state.storageUnits.map((unit) => unit.unit_type).filter(Boolean))].sort();
  };

  matchesSearch = (unit) => {
    const { searchTerm, typeFilter } = this.state;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const children = Array.isArray(unit.children) ? unit.children : [];
    const matchesType = !typeFilter || unit.unit_type === typeFilter;
    const matchesText = !normalizedSearch || [
      unit.unit_name,
      unit.unit_type,
      unit.location_description,
      unit.description,
      unit.safety_rating,
    ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));

    return (matchesType && matchesText) || children.some((child) => this.matchesSearch(child));
  };

  getFilteredTree = (tree) => {
    return tree.filter((unit) => this.matchesSearch(unit));
  };

  renderState = () => {
    const { error, loading } = this.state;

    if (loading) {
      return <div className="storage-tree__state">Loading storage tree...</div>;
    }

    if (error) {
      return <div className="storage-tree__state storage-tree__state--error">{error}</div>;
    }

    return null;
  };

  render() {
    const { loading, error, searchTerm, typeFilter, storageUnits } = this.state;
    const tree = this.buildStorageTree();
    const filteredTree = this.getFilteredTree(tree);
    const totalNestedUnits = tree.reduce((total, unit) => total + this.getNestedUnitCount(unit), 0);
    const totalInventory = tree.reduce((total, unit) => total + this.getInventoryCount(unit), 0);
    const typeOptions = this.getTypeOptions();
    const stateMessage = this.renderState();
    const depthLegend = ['Parent', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6+'];

    return (
      <section className="storage-tree">
        <div className="storage-tree__header">
          <div>
            <p className="storage-tree__eyebrow">Hierarchy view</p>
            <h3 className="storage-tree__title">Storage Tree</h3>
            <p className="storage-tree__description">
              Explore parent storage units, expand nested units, and review capacity, safety and inventory counts in one place.
            </p>
          </div>

          <div className="storage-tree__stats">
            <span>
              <Layers size={17} />
              <strong>{tree.length}</strong>
              root units
            </span>
            <span>
              <GitBranch size={17} />
              <strong>{totalNestedUnits}</strong>
              nested units
            </span>
            <span>
              <Package size={17} />
              <strong>{totalInventory}</strong>
              inventory links
            </span>
          </div>
        </div>

        <div className="storage-tree__toolbar">
          <label className="storage-tree__search">
            <Search size={18} />
            <input
              onChange={(event) => this.setState({ searchTerm: event.target.value })}
              placeholder="Search by name, type, location..."
              type="search"
              value={searchTerm}
            />
          </label>

          <select
            className="storage-tree__filter"
            onChange={(event) => this.setState({ typeFilter: event.target.value })}
            value={typeFilter}
          >
            <option value="">All unit types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="storage-tree__legend" aria-label="Storage tree level colors">
          {depthLegend.map((label, index) => (
            <span className={`storage-tree__legend-item storage-tree__legend-item--level-${index}`} key={label}>
              <i />
              {label}
            </span>
          ))}
        </div>

        {stateMessage || (
          <div className="storage-tree__body">
            {!filteredTree.length ? (
              <div className="storage-tree__state">
                {storageUnits.length ? 'No storage units match the current filters.' : 'No storage units found.'}
              </div>
            ) : (
              filteredTree.map((unit, index) => (
                <StorageUnit
                  defaultExpanded={index === 0 && !searchTerm && !typeFilter}
                  depth={0}
                  key={unit.id}
                  storageUnit={unit}
                />
              ))
            )}
          </div>
        )}

        {!loading && !error && (
          <div className="storage-tree__hint">
            Click a storage unit card to expand details and reveal child units.
          </div>
        )}
      </section>
    );
  }
}

export default StorageTree;
