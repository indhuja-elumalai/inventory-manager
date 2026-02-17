import { useState, useEffect } from 'react';
import { getItems, addItem, deleteItem, updateItem } from './api';
import { ToastContainer, toast } from 'react-toastify';
import { Package, Plus, Trash2, Edit3, Eye, EyeOff, X, Check } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [items, setItems] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (showList) loadItems();
  }, [showList]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (err) {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.warn("Title is required");
    try {
      const res = await addItem(formData);
      setItems([...items, res.data]);
      setFormData({ title: '', description: '' });
      toast.success("Added to inventory");
    } catch (err) {
      toast.error("Error adding item");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await updateItem(id, editData);
      setItems(items.map(item => item._id === id ? res.data : item));
      setEditingId(null);
      toast.success("Updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item permanently?")) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item._id !== id));
        toast.info("Item removed");
      } catch (err) {
        toast.error("Deletion failed");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with High Contrast Logo/Title */}
      <header style={styles.header}>
        <div style={styles.logoIcon}>
          <Package size={28} color="#ffffff" />
        </div>
        <h1 style={styles.title}>Inventory Management System</h1>
      </header>

      {/* Input Section */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Create New Entry</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Resource Title"
            style={styles.input}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            placeholder="Brief Description"
            style={styles.input}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit" style={styles.addButton}>
            <Plus size={18} /> Add Item
          </button>
        </form>
      </section>

      {/* HIGH CONTRAST TOGGLE BUTTON */}
      <div style={styles.toggleContainer}>
        <button onClick={() => setShowList(!showList)} style={styles.displayButton}>
          {showList ? (
            <><EyeOff size={18} color="#ffffff" /> Hide Records</>
          ) : (
            <><Eye size={18} color="#ffffff" /> Display All Records</>
          )}
        </button>
      </div>

      {/* List Section */}
      {showList && (
        <div style={styles.listContainer}>
          {loading ? (
            <p style={styles.emptyMsg}>Connecting to database...</p>
          ) : items.length === 0 ? (
            <p style={styles.emptyMsg}>No items found in your inventory.</p>
          ) : (
            items.map(item => (
              <div key={item._id} style={styles.itemCard}>
                {editingId === item._id ? (
                  <div style={styles.editRow}>
                    <input style={styles.editInput} value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                    <input style={styles.editInput} value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                    <div style={styles.editActions}>
                      <button onClick={() => handleUpdate(item._id)} style={styles.saveBtn}><Check size={16} /> Save</button>
                      <button onClick={() => setEditingId(null)} style={styles.cancelBtn}><X size={16} /> Exit</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemTitle}>{item.title}</h4>
                      <p style={styles.itemDesc}>{item.description}</p>
                    </div>
                    <div style={styles.actions}>
                      <button onClick={() => { setEditingId(item._id); setEditData({ title: item.title, description: item.description }); }} style={styles.editBtn}>
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',              // full viewport width
    height: '100vh',             // full viewport height
    margin: 0,                   // remove auto centering margin
    padding: '20px',             // optional padding
    fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
  }
  ,
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' },
  logoIcon: { backgroundColor: '#1e293b', padding: '10px', borderRadius: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em' },
  card: { background: '#ffffff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '16px' },
  form: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  input: { flex: 2, padding: '14px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', minWidth: '240px', outline: 'none' },
  addButton: { flex: 1, backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' },

  // FIXED TOGGLE BUTTON - High Contrast Slate
  toggleContainer: { textAlign: 'center', marginBottom: '40px' },
  displayButton: {
    background: '#0f172a',
    color: '#ffffff',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '700',
    fontSize: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },

  listContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  itemCard: { background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  itemTitle: { margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' },
  itemDesc: { margin: 0, fontSize: '14px', color: '#4b5563' },
  emptyMsg: { gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', padding: '40px' },

  actions: { display: 'flex', gap: '4px' },
  editBtn: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: '8px', borderRadius: '8px' },
  deleteBtn: { background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '8px', borderRadius: '8px' },

  editRow: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' },
  editInput: { padding: '10px', borderRadius: '8px', border: '2px solid #2563eb', fontSize: '14px' },
  editActions: { display: 'flex', gap: '8px' },
  saveBtn: { flex: 1, background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { flex: 1, background: '#94a3b8', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: '700', cursor: 'pointer' }
};

export default App;