import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { PlusCircle, Trash2 } from 'lucide-react';

const ManageCategories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', daily_limit: '' });
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch(err) {
      console.error(err);
    }
  };

  const addField = () => {
    setFields([...fields, { name: '', type: 'string', required: false }]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
         name: formData.name,
         daily_limit: formData.daily_limit ? Number(formData.daily_limit) : null,
         fields: fields
      };
      await api.post('/categories', payload);
      setFormData({ name: '', daily_limit: '' });
      setFields([]);
      fetchCategories();
    } catch(err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch(err) {
      if (err.response?.status === 409) {
         if (window.confirm("Warning: This category is currently in use in expense reports. Would you like to force delete it? Expenses using this category will display a warning flag.\n\nClick OK to Force Delete, or Cancel to Keep the category.")) {
             try {
                 await api.delete(`/categories/${id}?force=true`);
                 fetchCategories();
             } catch (forceErr) {
                 setError(forceErr.response?.data?.message || forceErr.message);
             }
         }
      } else {
         setError(err.response?.data?.message || err.message);
      }
    }
  };

  if (user?.role === 'employee') return <p>Unauthorized</p>

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Manage Expense Categories</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Create New Category</h3>
        {error && <div style={{ color: 'darkred', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ flex: 2 }}>
                 <label>Category Name</label>
                 <input type="text" className="form-control" required placeholder="e.g. Travel, Hotel, Meals"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                 <label>Daily Limit ($) (Optional)</label>
                 <input type="number" className="form-control" placeholder="0 = infinite"
                        value={formData.daily_limit} onChange={e => setFormData({...formData, daily_limit: e.target.value})} />
              </div>
           </div>
           
           <div style={{ padding: '1rem', background: 'var(--bg-main)', border: '1px dashed var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <h4>Dynamic Fields Required From Employee</h4>
                 <button type="button" className="btn" style={{ background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.85rem' }} onClick={addField}>
                   + Add Custom Field
                 </button>
              </div>

              {fields.map((f, i) => (
                 <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <input type="text" className="form-control" required placeholder="Field Name (e.g. GST No)"
                           value={f.name} onChange={e => updateField(i, 'name', e.target.value)} style={{ flex: 2 }} />
                    <select className="form-control" value={f.type} onChange={e => updateField(i, 'type', e.target.value)} style={{ flex: 1 }}>
                       <option value="string">Text</option>
                       <option value="number">Number</option>
                       <option value="date">Date</option>
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
                       <input type="checkbox" checked={f.required} onChange={e => updateField(i, 'required', e.target.checked)} />
                       Required?
                    </label>
                    <button type="button" onClick={() => removeField(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'darkred' }}>
                       <Trash2 size={20} />
                    </button>
                 </div>
              ))}
              {fields.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No custom fields added. Employees will only provide Amount, Date, and Receipt Document.</p>}
           </div>

           <button className="btn btn-primary" type="submit">Save Category</button>
        </form>
      </div>

      <div className="card">
        <h3>Existing Categories</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
           {categories.map(c => (
              <div key={c._id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', minWidth: '300px', flex: 1, position: 'relative' }}>
                 <button onClick={() => handleDeleteCategory(c._id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'darkred' }}>
                    <Trash2 size={20} />
                 </button>
                 <h4 style={{ color: 'var(--color-primary-dark)' }}>{c.name}</h4>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>Daily Limit: {c.daily_limit ? `$${c.daily_limit}` : 'None'}</p>
                 <strong style={{ fontSize: '0.85rem' }}>Fields:</strong>
                 <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '20px' }}>
                   {c.fields.map(f => (
                      <li key={f._id}>{f.name} ({f.type}) {f.required && '- Required'}</li>
                   ))}
                   {c.fields.length === 0 && <li>No additional fields</li>}
                 </ul>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
