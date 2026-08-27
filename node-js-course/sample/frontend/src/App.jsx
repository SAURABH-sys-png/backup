import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/api';

// Component: Store Header
const Header = ({ storeInfo }) => (
  <header className="bg-emerald-700 text-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <Link to="/" className="text-3xl font-bold tracking-tight hover:text-emerald-100 transition-colors">
          {storeInfo?.name || 'Fresh Harvest Market'}
        </Link>
        <p className="text-emerald-100 text-sm mt-1">📍 {storeInfo?.location}</p>
      </div>
      <div className="bg-emerald-800 px-4 py-2 rounded-lg text-sm text-emerald-100">
        📞 Contact: <span className="font-semibold text-white">{storeInfo?.contact}</span>
      </div>
    </div>
  </header>
);

// Component: Inventory Catalog (Home Page)
const InventoryList = ({ inventory }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(inventory.map((item) => item.category))];

  const filteredInventory = filter === 'All'
    ? inventory
    : inventory.filter((item) => item.category === filter);

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-slate-600 mr-2">Filter Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                {item.is_organic && (
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Organic
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Origin: {item.origin}</p>
              
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">${item.price_per_kg.toFixed(2)}</span>
                  <span className="text-xs text-slate-500"> / kg</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  item.stock_kg < 100 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.stock_kg} kg left
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
              <Link
                to={`/inventory/${item.id}`}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors block w-full"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component: Item Details View
const ItemDetail = ({ inventory }) => {
  const { id } = useParams();
  const item = inventory.find((prod) => prod.id === id);

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-700">Product Not Found</h2>
        <Link to="/" className="text-emerald-600 hover:underline mt-4 inline-block">← Back to Market</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
      <Link to="/" className="text-sm text-emerald-600 hover:underline font-medium">← Back to Catalog</Link>
      
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{item.category}</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{item.name}</h1>
          <p className="text-sm text-slate-500">ID: {item.id}</p>
        </div>
        {item.is_organic && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
            Organic Certified
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs text-slate-500 uppercase font-semibold">Price</p>
          <p className="text-2xl font-bold text-slate-900">${item.price_per_kg.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ kg</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs text-slate-500 uppercase font-semibold">Current Stock</p>
          <p className="text-2xl font-bold text-slate-900">{item.stock_kg} <span className="text-sm font-normal text-slate-500">kg</span></p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Country of Origin: <strong className="text-slate-900">{item.origin}</strong></span>
        <span>Availability: <strong className="text-emerald-600">In Stock</strong></span>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message === 'Failed to fetch' 
          ? 'Unable to connect to backend server. Ensure http://127.0.0.1:8000 is running and CORS is enabled.' 
          : err.message
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <p className="text-sm text-slate-500">Connecting to 127.0.0.1:8000...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center max-w-md">
          <p className="font-bold mb-1">Backend Connection Error</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header storeInfo={data?.store_info} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<InventoryList inventory={data?.inventory || []} />} />
          <Route path="/inventory/:id" element={<ItemDetail inventory={data?.inventory || []} />} />
        </Routes>
      </main>
    </div>
  );
}