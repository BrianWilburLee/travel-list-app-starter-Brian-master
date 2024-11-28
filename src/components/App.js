import React, { useState, useEffect } from "react";

function Logo() {
  return <h1>My Travel List</h1>;
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false,
    };
    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">ADD</button>
    </form>
  );
}

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    onSearch(term);
  }

  return (
    <div className="search-bar" style={{ margin: "20px 0", textAlign: "center" }}>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}

function Item({ item, onTogglePacked, onDeleteItem }) {
  return (
    <li
      style={{
        textDecoration: item.packed ? "line-through" : "none",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onTogglePacked(item.id)}
      />
      {item.description} ({item.quantity})
      <button
        onClick={() => onDeleteItem(item.id)}
        style={{
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "5px 10px",
          marginLeft: "10px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        ❌
      </button>
    </li>
  );
}

function PackingList({ items, onTogglePacked, onDeleteItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onTogglePacked={onTogglePacked}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

function Stats({ items }) {
  const packedItems = items.filter((item) => item.packed).length;
  const totalItems = items.length;
  const percentagePacked = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentagePacked === 100 ? (
          "You got everything!"
        ) : (
          `You have ${totalItems} items in the list. You already packed ${packedItems} (${percentagePacked}%).`
        )}
      </em>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState("inputOrder");

  // Add new item
  function handleAddItem(newItem) {
    setItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      setFilteredItems(updatedItems);
      return updatedItems;
    });
  }

  // Toggle packed status
  function handleTogglePacked(id) {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      );
      setFilteredItems(updatedItems);
      return updatedItems;
    });
  }

  // Delete item
  function handleDeleteItem(id) {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      setFilteredItems(updatedItems);
      return updatedItems;
    });
  }

  // Filter items based on search term
  function handleSearch(term) {
    setFilteredItems(
      items.filter((item) => item.description.toLowerCase().includes(term))
    );
  }

  // Clear all items
  function handleClearAll() {
    setItems([]);
    setFilteredItems([]);
  }

  // Sort items
  useEffect(() => {
    let sortedItems = [...items];
    if (sortBy === "description") {
      sortedItems.sort((a, b) => a.description.localeCompare(b.description));
    } else if (sortBy === "packedStatus") {
      sortedItems.sort((a, b) => a.packed - b.packed);
    } else if (sortBy === "alphabetical") {
      sortedItems.sort((a, b) => a.description.localeCompare(b.description));
    }
    setFilteredItems(sortedItems);
  }, [sortBy, items]);

  function handleSortChange(e) {
    setSortBy(e.target.value);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <SearchBar onSearch={handleSearch} />

      <div style={{ margin: "20px 0", display: "flex", justifyContent: "space-between" }}>
        <label>
          Sort by:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="inputOrder">Input Order</option>
            <option value="description">Description</option>
            <option value="packedStatus">Packed Status</option>
            <option value="alphabetical">Alphabetical Order</option>
          </select>
        </label>
        <button
          onClick={handleClearAll}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear All
        </button>
      </div>

      <PackingList
        items={filteredItems}
        onTogglePacked={handleTogglePacked}
        onDeleteItem={handleDeleteItem}
      />
      <Stats items={filteredItems} />
    </div>
  );
}

export default App;
