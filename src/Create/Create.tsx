import { useEffect, useState } from 'react'
import './Create.css'
import axios from 'axios'
import type { Property } from '../types'
import { useNavigate } from 'react-router-dom'
export const Create = () => {
  const URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [Properties, setProperties] = useState<Record<string, Property>>({})
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [field, setFields] = useState<Record<string, string | number>>({})
  const navigate = useNavigate();
  const CreateMachine = async () => {
    try {
      const response = await axios.post(`${URL}/machine/create`, field)
      navigate('/');
    }
    catch (err: any) {
      console.log("Error:", err);
      const errorMessage = err?.response.data.detail[0].msg != undefined ? String(err?.response.data.detail[0].msg) : err.response.data.detail || 'Failed to create machine. Please try again.'
      setError(errorMessage)
    }
  }
  useEffect(() => {
    const Fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL}/machine/schema/create`, {})
        if (response && response.data.properties) {
          setProperties(response.data.properties)
          console.log("Fetched properties:", response.data.properties);
        }
      }
      catch (error) {
        console.log("Error:", error);
      }
      setLoading(false);
    }
    Fetch();
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="create-container">
      <div className="create-header">
        <h1>🔧 Create a Machine</h1>
        <p>Configure your machine by filling out the form below</p>
      </div>

      <div className="form-container">
        {Object.entries(Properties).map(([fieldKey, property]) => (
          <div key={fieldKey} className="form-field">
            <label className="field-label">{property.title}:</label>
            <div className="input-wrapper">
              {!property.enum && (
                <input
                  className="form-input"
                  type={property.type === 'string' ? 'text' : (property.type === 'number' || property.type === 'integer') ? 'number' : 'text'}
                  placeholder={`Enter ${property.title.toLowerCase()}${property.type === 'number' ? ' (decimal allowed)' : property.type === 'integer' ? ' (whole numbers only)' : ''}`}
                  value={field[fieldKey] || ''}
                  onChange={(e) => setFields({ ...field, [fieldKey]: e.target.value })}
                />
              )}
              {property.enum && (
                <select
                  className="form-select"
                  value={field[fieldKey] || ''}
                  onChange={(e) => setFields({ ...field, [fieldKey]: e.target.value })}
                >
                  <option value="">Select {property.title.toLowerCase()}</option>
                  {property.enum.map((enumValue) => (
                    <option key={enumValue} value={enumValue}>
                      {enumValue}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}

        <div className="button-container">
          {error && <div className="error-message">{error}</div>}
          <button className="submit-button" onClick={CreateMachine}>
            ✨ Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}