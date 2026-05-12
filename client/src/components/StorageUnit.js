import React, { Component } from 'react';
import {
  Box,
  ChevronDown,
  ChevronRight,
  Layers,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';

class StorageUnit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: Boolean(props.defaultExpanded),
    };
  }

  toggleExpanded = () => {
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
  };

  getChildren = () => {
    return Array.isArray(this.props.storageUnit.children) ? this.props.storageUnit.children : [];
  };

  getInventories = () => {
    return Array.isArray(this.props.storageUnit.inventories) ? this.props.storageUnit.inventories : [];
  };

  getNestedUnitCount = (unit) => {
    const children = Array.isArray(unit.children) ? unit.children : [];

    return children.reduce((total, child) => total + 1 + this.getNestedUnitCount(child), 0);
  };

  getNestedInventoryCount = (unit) => {
    const inventories = Array.isArray(unit.inventories) ? unit.inventories.length : 0;
    const children = Array.isArray(unit.children) ? unit.children : [];

    return children.reduce((total, child) => total + this.getNestedInventoryCount(child), inventories);
  };

  getUtilizationPercent = () => {
    const { capacity, current_utilization } = this.props.storageUnit;
    const capacityValue = Number(capacity);
    const utilizationValue = Number(current_utilization);

    if (!capacityValue || Number.isNaN(capacityValue) || Number.isNaN(utilizationValue)) {
      return null;
    }

    return Math.min(Math.round((utilizationValue / capacityValue) * 100), 100);
  };

  formatValue = (value, suffix = '') => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    return `${value}${suffix}`;
  };

  formatDate = (value) => {
    return value ? new Date(value).toLocaleDateString() : 'N/A';
  };

  renderMetaItem = (label, value) => (
    <div className="storage-unit-card__meta-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );

  renderInventoryPreview = () => {
    const inventories = this.getInventories();

    if (!inventories.length) {
      return (
        <p className="storage-unit-card__empty">
          No inventory linked directly to this unit.
        </p>
      );
    }

    return (
      <div className="storage-unit-card__inventory-list">
        {inventories.slice(0, 4).map((item) => (
          <div className="storage-unit-card__inventory-item" key={item.id}>
            <Package size={16} />
            <span>{item.item_name || 'Unnamed item'}</span>
            <strong>
              {this.formatValue(item.quantity ?? item.total_quantity)}
              {item.unit_measure ? ` ${item.unit_measure}` : ''}
            </strong>
          </div>
        ))}
        {inventories.length > 4 && (
          <div className="storage-unit-card__inventory-more">
            +{inventories.length - 4} more inventory records
          </div>
        )}
      </div>
    );
  };

  renderDetails = () => {
    const { storageUnit } = this.props;

    return (
      <div className="storage-unit-card__details">
        <div className="storage-unit-card__detail-grid">
          {this.renderMetaItem('Capacity', this.formatValue(storageUnit.capacity))}
          {this.renderMetaItem('Utilization', this.formatValue(storageUnit.current_utilization))}
          {this.renderMetaItem('Temperature', this.formatValue(storageUnit.temperature, ' C'))}
          {this.renderMetaItem('Humidity', this.formatValue(storageUnit.humidity, '%'))}
          {this.renderMetaItem('Pressure', this.formatValue(storageUnit.pressure))}
          {this.renderMetaItem('Material', this.formatValue(storageUnit.material))}
          {this.renderMetaItem('Safety rating', this.formatValue(storageUnit.safety_rating))}
          {this.renderMetaItem('Last maintenance', this.formatDate(storageUnit.last_maintenance_date))}
          {this.renderMetaItem('Next maintenance', this.formatDate(storageUnit.next_maintenance_date))}
        </div>

        {(storageUnit.location_description || storageUnit.description) && (
          <div className="storage-unit-card__notes">
            {storageUnit.location_description && (
              <p>
                <MapPin size={16} />
                <span>{storageUnit.location_description}</span>
              </p>
            )}
            {storageUnit.description && <p>{storageUnit.description}</p>}
          </div>
        )}

        <div className="storage-unit-card__inventory">
          <div className="storage-unit-card__subhead">
            <Package size={16} />
            <span>Direct inventory</span>
          </div>
          {this.renderInventoryPreview()}
        </div>
      </div>
    );
  };

  render() {
    const { storageUnit, depth } = this.props;
    const { isExpanded } = this.state;
    const children = this.getChildren();
    const directChildrenCount = children.length;
    const nestedUnitCount = this.getNestedUnitCount(storageUnit);
    const directInventoryCount = this.getInventories().length;
    const nestedInventoryCount = this.getNestedInventoryCount(storageUnit);
    const utilizationPercent = this.getUtilizationPercent();
    const hasChildren = directChildrenCount > 0;

    return (
      <article
        className={`storage-unit-card${depth > 0 ? ' storage-unit-card--nested' : ''}`}
        style={{ '--storage-unit-depth': depth }}
      >
        <button className="storage-unit-card__summary" onClick={this.toggleExpanded} type="button">
          <span className="storage-unit-card__expand">
            {hasChildren ? (
              isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
            ) : (
              <Box size={18} />
            )}
          </span>

          <span className="storage-unit-card__icon">
            <Layers size={22} />
          </span>

          <span className="storage-unit-card__main">
            <span className="storage-unit-card__title-row">
              <span className="storage-unit-card__title">{storageUnit.unit_name || 'Unnamed storage unit'}</span>
              <span className="storage-unit-card__type">{storageUnit.unit_type || 'unknown'}</span>
              {storageUnit.is_locked && (
                <span className="storage-unit-card__lock">
                  <Lock size={14} />
                  Locked
                </span>
              )}
            </span>
            <span className="storage-unit-card__subtitle">
              ID #{storageUnit.id} · {this.formatValue(storageUnit.location_description)}
            </span>
          </span>

          <span className="storage-unit-card__stats">
            <span>
              <strong>{directChildrenCount}</strong>
              child
            </span>
            <span>
              <strong>{nestedUnitCount}</strong>
              nested
            </span>
            <span>
              <strong>{directInventoryCount}</strong>
              items
            </span>
          </span>
        </button>

        {utilizationPercent !== null && (
          <div className="storage-unit-card__utilization" aria-label={`Utilization ${utilizationPercent}%`}>
            <span style={{ width: `${utilizationPercent}%` }} />
          </div>
        )}

        <div className="storage-unit-card__badges">
          <span>
            <ShieldCheck size={15} />
            {this.formatValue(storageUnit.safety_rating, ' safety')}
          </span>
          <span>
            <Thermometer size={15} />
            {this.formatValue(storageUnit.temperature, ' C')}
          </span>
          <span>
            <Package size={15} />
            {nestedInventoryCount} total items in branch
          </span>
        </div>

        {isExpanded && (
          <>
            {this.renderDetails()}

            {hasChildren && (
              <div className="storage-unit-card__children">
                {children.map((child) => (
                  <StorageUnit
                    defaultExpanded={false}
                    depth={depth + 1}
                    key={child.id}
                    storageUnit={child}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </article>
    );
  }
}

StorageUnit.defaultProps = {
  defaultExpanded: false,
  depth: 0,
};

export default StorageUnit;