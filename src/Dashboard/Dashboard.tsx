import { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const [schema, setSchema] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [machines, setMachines] = useState<Array<Record<string, any>>>([])
    const URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    useEffect(() => {
        const FetchSchema = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${URL}/machine/schema/read`, {})
                if (response && response.data.properties) {
                    setSchema(response.data.properties)
                }
            }
            catch (error) {
                console.log("Error:", error);
            }
            setLoading(false);
        }

        FetchSchema();
        FetchItems();
    }, [])

    const FetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/machine/get`, {})
            if (response && response.data) {
                setMachines(response.data)
            }
        }
        catch (error) {
            console.log("Error:", error);
        }
        setLoading(false);
    }


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📊 Machines Dashboard</h1>
                <p>View all your machines and their configurations</p>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="machines-table">
                        <thead>
                            <tr>
                                {Object.entries(schema).map(([field]) => (
                                    <th key={field}>{field}</th>
                                ))}
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {machines.map((machine, index) => (
                                <tr key={index}>
                                    {Object.entries(schema).map(([field]) => (
                                        <td key={field}>
                                            {machine[field] !== undefined ? String(machine[field]) : '-'}
                                        </td>
                                    ))}
                                    <td>
                                        <button onClick={() => { navigate(`/update/${machine.id}`) }} className="edit-button">Update Item</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="action-container">
                    <a href="/create" className="create-button">
                        ✨ Create New Machine
                    </a>
                </div>
            </div>
        </div>
    )
}