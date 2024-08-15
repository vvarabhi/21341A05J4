import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [numberId, setNumberId] = useState(''); 
    const [data, setData] = useState(null); 
    const [error, setError] = useState(''); 

    const fetchData = async () => {
        setError(''); 
        try {
            const response = await axios.get(`http://localhost:9876/numbers/${numberId}`, { timeout: 500 });
            setData(response.data);
        } catch (err) {
            setError('Error fetching data or request timed out.');
            setData(null);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Average Calculator</h1>
                <input
                    type="text"
                    value={numberId}
                    onChange={(e) => setNumberId(e.target.value)}
                    placeholder="Enter p, f, e, or r"
                />
                <button onClick={fetchData}>Calculate Average</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {data && (
                    <div>
                        <h2>Results:</h2>
                        <p><strong>Previous Window State:</strong> {JSON.stringify(data.windowPrevState)}</p>
                        <p><strong>Current Window State:</strong> {JSON.stringify(data.windowCurrState)}</p>
                        <p><strong>Fetched Numbers:</strong> {JSON.stringify(data.numbers)}</p>
                        <p><strong>Average:</strong> {data.avg}</p>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
