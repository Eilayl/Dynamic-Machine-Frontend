import { useEffect, useState } from 'react'
import './Create.css'
import axios from 'axios'
import type { Propertie } from '../types'
export const Create = () => {
    const URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'    
    const [Properties, setProperties] = useState<Propertie[]>([])
    
      useEffect(() => {
    const Fetch = async () => {
      try{
        const response = await axios.get(`${URL}/machine/schema/create`, {})
        if(response && response.data.properties){
            const propertiesArray = Object.values(response.data.properties) as Propertie[];
            setProperties(propertiesArray)
            console.log("✅ Fetched properties:", propertiesArray);
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
        <div>
        <h1>Create a Machine</h1>
        {Properties.map((property) => (
            <div key={property.title}>
                <label>{property.title}:</label>
                <input type={property.type === 'string' ? 'text' : property.type === 'number' ? 'number' : 'text'} />
        </div>
        ))}
        </div>
        </>
    )
}