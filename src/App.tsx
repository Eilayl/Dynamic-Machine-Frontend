import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import type { PropertiesResponse, PropertyField } from './types';

function App() {
  const [properties, setProperties] = useState<PropertiesResponse>({});

  useEffect(() => {
    const Fetch = async () => {
      try{
        const response = await axios.get('http://localhost:8000/machine/schema/create', {})
        if(response && response.data.properties){
          console.log("📦 Properties received:", response.data.properties)
          setProperties(response.data.properties); // פשוט שמור את הobject כמו שהוא
        }
      }
      catch(error){
        console.log("❌ Error:", error);
      }
    }
    Fetch();
  }, [])

  return (
    <>
      {Object.keys(properties).length > 0 && 
        Object.entries(properties).map(([fieldName, fieldData]: [string, PropertyField]) => (
          <div key={fieldName} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{fieldName}</h3>
            <p><strong>Title:</strong> {fieldData.title}</p>
            <p><strong>Type:</strong> {fieldData.type}</p>
            {fieldData.format && <p><strong>Format:</strong> {fieldData.format}</p>}
            {fieldData.$ref && <p><strong>Reference:</strong> {fieldData.$ref}</p>}
          </div>
        ))
      }
    </>
  )
}

export default App
