import { useState, useEffect } from 'react';
import api from '../api/axios';

const AddExpenseForm = ({ reportId, onExpenseAdded, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [billImage, setBillImage] = useState(null);
  const [detailsData, setDetailsData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
      if(data.length > 0) handleCategoryChange(data[0]._id, data);
    } catch(err) {
      console.error(err);
    }
  }

  const handleCategoryChange = (catId, cats = categories) => {
    const cat = cats.find(c => c._id === catId);
    setSelectedCategory(cat);
    
    // reset dynamic details
    const initDetails = {};
    if (cat?.fields) {
      cat.fields.forEach(f => {
        initDetails[f.name] = '';
      });
    }
    setDetailsData(initDetails);
  };

  const handleDetailChange = (name, value) => {
    setDetailsData({ ...detailsData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('reportId', reportId);
      formData.append('categoryId', selectedCategory._id);
      formData.append('amount', amount);
      formData.append('date', date);
      formData.append('details', JSON.stringify(detailsData));
      if (billImage) {
        formData.append('bill_image', billImage);
      }

      await api.post('/expenses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onExpenseAdded();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (categories.length === 0) return <p>No categories available. Please ask admin to create categories first.</p>

  return (
    <div className="card" style={{ marginTop: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <h3 style={{ marginBottom: '1rem' }}>Add New Expense</h3>
      {error && <div style={{ color: 'darkred', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Category</label>
            <select className="form-control" onChange={e => handleCategoryChange(e.target.value)} required>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Amount (limit: {selectedCategory?.daily_limit || 'None'})</label>
            <input type="number" className="form-control" required 
                   value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Date</label>
            <input type="date" className="form-control" required
                   value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {/* Dynamic Fields */}
        {selectedCategory?.fields?.length > 0 && (
          <div style={{ padding: '1rem', background: 'var(--bg-main)', border: '1px dashed var(--border-color)', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Additional {selectedCategory.name} Details</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedCategory.fields.map(f => (
                <div key={f.name} className="form-group" style={{ flex: '1 1 200px' }}>
                   <label>{f.name}</label>
                   <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} 
                          className="form-control" required={f.required}
                          value={detailsData[f.name] || ''} onChange={(e) => handleDetailChange(f.name, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
           <label>Bill Image (Receipt)</label>
           <input type="file" className="form-control" accept="image/*,application/pdf"
                  onChange={e => setBillImage(e.target.files[0])} />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">Save Expense</button>
          <button type="button" className="btn" onClick={onCancel} style={{ border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;
