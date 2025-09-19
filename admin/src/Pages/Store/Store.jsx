import React, { useEffect, useState } from "react";
import axios from "axios";

// This component is an adaptation of your notification example,
// configured to manage 'Store' data using your specific APIs.

export default function StoreAdmin() {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({
    name: "",
    link: "",
    imageFile: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // The base URL for your API endpoints.
  const API_BASE_URL = "https://ecommerceclone1.onrender.com/api/stores";

  // --- API Handlers ---
  
  /** Fetches all stores from the API and updates the state. */
  const fetchStores = async () => {
    try {
      // The backend route for getting all stores is just "/", so use the base URL.
      const res = await axios.get(`${API_BASE_URL}/fetch`); 
      setStores(res.data.stores);
    } catch (err) {
      console.error("Fetch stores error:", err);
    }
  };

  /** Handles form submission for adding or updating a store. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use FormData to send both text fields and the image file.
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("link", form.link);
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (editingId) {
        // Update an existing store entry.
        // Backend route: PUT /api/stores/:id
        await axios.put(`${API_BASE_URL}/update/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Add a new store entry.
        // Backend route: POST /api/stores/
        await axios.post(`${API_BASE_URL}/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Reset the form and editing state.
      setForm({ name: "", link: "", imageFile: null });
      setPreview(null);
      setEditingId(null);
      // Refresh the list of stores to show the new or updated entry.
      fetchStores();
    } catch (err) {
      console.error("Submit error:", err.response.data);
    }
  };

  /** Deletes a store by its ID. */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      // Backend route: DELETE /api/stores/:id
      await axios.delete(`${API_BASE_URL}/delete/${id}`);
      fetchStores();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /** Populates the form with store data for editing. */
  const handleEdit = (store) => {
    setForm({
      name: store.name,
      link: store.link,
      imageFile: null,
    });
    setPreview(store.image || null);
    setEditingId(store.id);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Section</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3 bg-gray-100 p-4 rounded">
        <input
          type="text"
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="url"
          placeholder="Store Link (e.g., https://example.com)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setForm({ ...form, imageFile: file });
            setPreview(URL.createObjectURL(file));
          }}
          className="w-full border rounded p-2"
        />
        {preview && (
          <img
            src={preview}
            alt="Image Preview"
            className="w-32 h-32 object-contain rounded mb-2"
          />
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Store" : "Add Store"}
        </button>
      </form>
      
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Link</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="border px-4 py-2">
                {store.image ? (
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td className="border px-4 py-2">{store.name}</td>
              <td className="border px-4 py-2">
                <a href={store.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {store.link}
                </a>
              </td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(store)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}