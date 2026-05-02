import { useState } from "react";
import "../style.css";

export default function OptionGroup({ title, items, onSelect }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (item) => {
    let newSelected;
    
    // Toggle - agar already selected hai to remove, nahi to add
    if (selectedItems.includes(item.name)) {
      newSelected = selectedItems.filter(name => name !== item.name);
    } else {
      newSelected = [...selectedItems, item.name];
    }
    
    setSelectedItems(newSelected);
    
    // Sab selected items parent ko bhejo (comma separated string)
    if (onSelect) {
      onSelect({ 
        name: newSelected.join(", "), 
        items: newSelected 
      });
    }
  };

  return (
    <div className="group">
      <h2 className="group-title">{title}</h2>
      <div className="options">
        {items.map((item, i) => (
          <div
            className={`option-card ${selectedItems.includes(item.name) ? 'selected' : ''}`}
            key={i}
            onClick={() => handleSelect(item)}
          >
            <div className="option-img-circle">
              <img src={item.img} alt={item.name} />
            </div>
            <p>{item.name}</p>
            {selectedItems.includes(item.name) && (
              <span className="option-check">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}