// src/pages/QuickPicks.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Base URL for your quick pick backend APIs
const API_URL = 'http://localhost:8000/api/quick-pick';

// Component to handle adding/editing a Quick Pick
const QuickPickForm = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image_url', image);
    }
    
    if (initialData) {
      // Update existing quick pick
      onSave(initialData.id, formData);
    } else {
      // Add new quick pick
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Quick Pick' : 'Add Quick Pick'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Quick Pick Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Quick Pick Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Choose File
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {initialData && initialData.image_url && !image && (
              <p className="text-sm text-gray-500 mt-2">Current image selected.</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Quick Picks page component
const QuickPicksPage = () => {
  const [quickPicks, setQuickPicks] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingQuickPick, setEditingQuickPick] = useState(null);
  const navigate = useNavigate();

  const fetchQuickPicks = async () => {
    try {
      const response = await axios.get(`${API_URL}/list`);
      setQuickPicks(response.data.quickPicks);
    } catch (error) {
      console.error('Error fetching quick picks:', error);
    }
  };

  useEffect(() => {
    fetchQuickPicks();
  }, []);

  const handleAdd = async (formData) => {
    try {
      await axios.post(`${API_URL}/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsFormVisible(false);
      fetchQuickPicks(); // Refresh the list
    } catch (error) {
      console.error('Error adding quick pick:', error);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await axios.put(`${API_URL}/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsFormVisible(false);
      setEditingQuickPick(null);
      fetchQuickPicks(); // Refresh the list
    } catch (error) {
      console.error('Error updating quick pick:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quick pick?')) {
      try {
        await axios.delete(`${API_URL}/delete/${id}`);
        fetchQuickPicks(); // Refresh the list
      } catch (error) {
        console.error('Error deleting quick pick:', error);
      }
    }
  };

  const handleEditClick = (quickPick) => {
    setEditingQuickPick(quickPick);
    setIsFormVisible(true);
  };

  const handleAddClick = () => {
    setEditingQuickPick(null);
    setIsFormVisible(true);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quick Picks</h1>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 flex items-center"
        onClick={handleAddClick}
      >
        <FaPlus className="mr-2" /> Add Quick Pick
      </button>

      {isFormVisible && (
        <QuickPickForm
          initialData={editingQuickPick}
          onSave={editingQuickPick ? handleUpdate : handleAdd}
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {quickPicks.length > 0 ? (
              quickPicks.map((quickPick) => (
                <tr key={quickPick.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{quickPick.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{quickPick.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <img src={quickPick.image_url} alt={quickPick.name} className="h-12 w-12 object-cover rounded-full" />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex space-x-2">
                      <button 
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded text-sm"
                        onClick={() => handleEditClick(quickPick)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                        onClick={() => handleDelete(quickPick.id)}
                      >
                        <FaTrash />
                      </button>
                      <button 
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm"
                        onClick={() => navigate(`/quick-pick-groups?quickPickId=${quickPick.id}`)}
                      >
                        Groups
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No quick picks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuickPicksPage;