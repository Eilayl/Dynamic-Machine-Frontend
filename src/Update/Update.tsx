import { useEffect, useState } from "react";
import type { Property } from "../types";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './Update.css';

export const Update = () => {
    const [Properties, setProperties] = useState<Record<string, Property>>({})
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Record<string, any>>({});
    const [mergedItem, setMergedItem] = useState<{ [x: string]: string; }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    useEffect(() => {
        const runAsync = async () => {
            const Fetch = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${URL}/machine/schema/update`, {})
                    if (response && response.data.properties) {
                        setProperties(response.data.properties)
                        console.log("Fetched schema/update :", response.data.properties);
                    }
                }
                catch (error) {
                    console.log("Error:", error);
                }
                setLoading(false);
            }

            const GetItem = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${URL}/machine/get`, {
                        params: { id }
                    })
                    if (response && response.data) {
                        setItem(response.data[0]);
                        console.log("Fetched machine/get :", response.data[0]);
                    }
                }
                catch (error) {
                    console.log("Error:", error);
                }
                finally {
                    setLoading(false);
                }
            };

            await Fetch();
            await GetItem();
        };
        runAsync();
    }, [id]);

    // Separate useEffect for merging - runs when Properties or item changes
    useEffect(() => {
        if (Object.keys(Properties).length > 0 && Object.keys(item).length > 0) {
            const MergeItem = () => {
                let ezer: { [x: string]: string; }[] = [];
                Object.keys(Properties).forEach((key) => {
                    ezer.push({ [key]: item[key] || "" });
                });
                console.log("Merged item:", ezer);
                setMergedItem(ezer);
            }
            MergeItem();
        }
    }, [Properties, item]);

    const handleChange = (index: number, key: string, value: string) => {
        setMergedItem(prev =>
            prev.map((item, i) =>
                i === index ? { [key]: value } : item
            )
        );
    };

    const SaveChanges = async () => {
        try {
            setLoading(true);
            const transformedData = mergedItem.reduce((acc, item) => {
                const key = Object.keys(item)[0];
                acc[key] = item[key];
                return acc;
            }, {} as Record<string, any>);

            const response = await axios.put(`${URL}/machine/update`, transformedData, {
                params: { machine_id: id }
            })
            if (response && response?.data) {
                navigate('/');
            }
        }
        catch (error) {
            console.log("Error:", error);
            //@ts-ignore
            const errorMessage = error?.response.data.detail[0].msg != undefined ? String(error?.response.data.detail[0].msg) : error.response.data.detail || 'Failed to update machine. Please try again.'
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="update-container">
            <div className="update-header">
                <h1>⚙️ Update Machine</h1>
                <p>Modify your machine configuration below</p>
            </div>

            <div className="form-container">
                {mergedItem.map((prop, index) => {
                    const key = Object.keys(prop)[0];
                    const propertyDef = Properties[key];

                    return (
                        <div key={index} className="form-field">
                            <label className="field-label">{propertyDef?.title || key}:</label>
                            <div className="input-wrapper">
                                {propertyDef?.enum ? (
                                    <select
                                        className="form-select"
                                        value={prop[key] || ""}
                                        onChange={(e) => handleChange(index, key, e.target.value)}
                                    >
                                        {propertyDef.enum.map((option: string) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        className="form-input"
                                        type={
                                            propertyDef?.title === "Password" ? 'password' :
                                                propertyDef?.type === 'string' ? 'text' :
                                                    (propertyDef?.type === 'number' || propertyDef?.type === 'integer') ? 'number' : 'text'
                                        }
                                        value={prop[key] || ""}
                                        onChange={(e) => handleChange(index, key, e.target.value)}
                                        placeholder={`Enter ${propertyDef?.title?.toLowerCase() || key}`}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}

                <div className="button-container">
                    {error && <div className="error-message">{error}</div>}
                    <button className="submit-button" onClick={SaveChanges}>
                        💾 Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}