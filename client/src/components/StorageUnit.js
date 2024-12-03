import React from 'react';

const StorageUnit = ({ storageUnit }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <h3>{storageUnit.unit_name} ({storageUnit.unit_type})</h3>
      <p>{storageUnit.description}</p>
      <p><strong>Местоположение:</strong> {storageUnit.location_description}</p>
      <p><strong>Вместимость:</strong> {storageUnit.capacity} / {storageUnit.current_utilization}</p>

      {/* Инвентарь */}
      {storageUnit.inventories && storageUnit.inventories.length > 0 && (
        <div>
          <h4>Инвентарь:</h4>
          <ul>
            {storageUnit.inventories.map(item => (
              <li key={item.id}>
                <strong>{item.item_name}</strong> — {item.quantity} {item.unit_measure}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Дочерние StorageUnit */}
      {storageUnit.children && storageUnit.children.length > 0 && (
        <div style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
          <h4>Вложенные блоки хранения:</h4>
          {storageUnit.children.map(child => (
            <StorageUnit key={child.id} storageUnit={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StorageUnit;