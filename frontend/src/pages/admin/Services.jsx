import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Edit, Trash2, Search, Filter, Clock, Users } from 'lucide-react';
import axios from 'axios';
import './AdminPages.css';
import AdminLayout from './AdminLayout';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    instructor: '',
    maxCapacity: ''
  });
  const [error, setError] = useState('');

  const categories = ['Fitness', 'Wellness', 'Training', 'Classes', 'Consultation'];
  const durations = ['30 minutes', '1 hour', '1.5 hours', '2 hours', 'Custom'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/admin/services');
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Access denied or server error.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axios.put(`/api/admin/services/${editingService._id}`, formData);
      } else {
        await axios.post('/api/admin/services', formData);
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      instructor: service.instructor || '',
      maxCapacity: service.maxCapacity || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`/api/admin/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      instructor: '',
      maxCapacity: ''
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.instructor && service.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout title="Manage Services" description="Add, edit, and manage gym services, classes, and training programs." icon={<Wrench />}>
        <div className="loading">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Manage Services" description="Add, edit, and manage gym services, classes, and training programs." icon={<Wrench />}>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchServices}>Retry</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Manage Services"
      description="Add, edit, and manage gym services, classes, and training programs."
      icon={<Wrench />}
      actions={
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingService(null);
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          Add Service
        </button>
      }
    >
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="services-grid">
        {filteredServices.map(service => (
          <div key={service._id} className="service-card">
            <div className="service-header">
              <div className="service-icon">
                <Wrench size={24} />
              </div>
              <div className="service-actions">
                <button 
                  className="btn-icon"
                  onClick={() => handleEdit(service)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-icon btn-danger"
                  onClick={() => handleDelete(service._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="service-content">
              <h3>{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-details">
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="category">{service.category}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="price">${service.price}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>{service.duration}</span>
                </div>
                {service.instructor && (
                  <div className="detail-item">
                    <span className="label">Instructor:</span>
                    <span>{service.instructor}</span>
                  </div>
                )}
                {service.maxCapacity && (
                  <div className="detail-item">
                    <Users size={16} />
                    <span>Max: {service.maxCapacity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button 
                className="btn-icon"
                onClick={() => {
                  setShowModal(false);
                  setEditingService(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  >
                    <option value="">Select Duration</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Instructor (optional)</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  placeholder="Instructor name"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Services; 