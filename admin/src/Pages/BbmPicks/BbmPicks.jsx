import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BbmPicks = () => {
  const navigate = useNavigate();
  const [editingBbmPick, setEditingBbmPick] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    imageFile: null, // Use imageFile for the file input
  });
  const [preview, setPreview] = useState(null); // For image preview
  const [submitting, setSubmitting] = useState(false);
  const [bbmPicks, setBbmPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBbmPicks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/bbmpicks/list"
      );
      setBbmPicks(res.data.bbmPicks);
    } catch (err) {
      console.error("Failed to fetch BBM Picks:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBbmPick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this BBM Pick?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/bbmpicks/delete/${id}`
      );
      await fetchBbmPicks();
    } catch (err) {
      alert("Failed to delete BBM Pick");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Create FormData object to send file
    const formData = new FormData();
    formData.append("name", form.name);
    if (form.imageFile) {
        formData.append("image_url", form.imageFile); // Use "image" to match your backend's Multer middleware
    }

    try {
      if (editingBbmPick) {
        await axios.put(
          `http://localhost:8000/api/bbmpicks/update/${editingBbmPick.id}`,
          formData
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/bbmpicks/add",
          formData
        );
      }
      await fetchBbmPicks();
      setShowForm(false);
      setForm({ name: "", imageFile: null });
      setPreview(null);
      setEditingBbmPick(null);
    } catch (err) {
      alert("Failed to save BBM Pick");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = (pick) => {
    setEditingBbmPick(pick);
    setForm({
      name: pick.name,
      imageFile: null, // Reset imageFile, user can upload a new one
    });
    setPreview(pick.image_url); // Show the existing image
    setShowForm(true); // Show the form
  };

  useEffect(() => {
    fetchBbmPicks();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">BBM Picks</h1>
      
      {/* Form for Add/Edit */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBbmPick(null);
            setForm({ name: "", imageFile: null });
            setPreview(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancel" : "➕ Add BBM Pick"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-bold mb-4">{editingBbmPick ? "Edit BBM Pick" : "Add BBM Pick"}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="BBM Pick Name"
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                className="w-full border px-3 py-2 rounded text-sm"
              />
              {preview && (
                  <img src={preview} alt="Image Preview" className="w-32 h-32 object-cover rounded" />
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingBbmPick ? "Save Changes" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading BBM Picks...</p>
      ) : bbmPicks && bbmPicks.length === 0 ? (
        <p className="text-gray-500">No BBM Picks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bbmPicks.map((pick) => (
                <tr key={pick.id} className="border-t">
                  <td className="py-2 px-4">{pick.id}</td>
                  <td className="py-2 px-4">{pick.name}</td>
                  <td className="py-2 px-4">
                    <img
                      src={pick.image_url}
                      alt={pick.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(pick)} // Use the new handleEdit function
                    >
                      ✏️
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deleteBbmPick(pick.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/bbmpicksproducts/${pick.id}`)}
                    >
                      📦 Products
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BbmPicks;