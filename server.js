const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10; 

let numberWindow = [];

app.use(cors());

const fetchNumbers = async (type) => {
    const response = await axios.get(`http://20.244.56.144/test/numbers/${type}`, { timeout: 500 });
    return response.data.numbers || [];
};

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    try {
        const numbers = await fetchNumbers(numberid);
        
        const uniqueNumbers = [...new Set(numbers)];
        const windowPrevState = [...numberWindow];

        uniqueNumbers.forEach(num => {
            if (!numberWindow.includes(num)) {
                if (numberWindow.length >= WINDOW_SIZE) {
                    numberWindow.shift();
                }
                numberWindow.push(num);
            }
        });

        const average = numberWindow.length > 0 ? (numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2) : 0;

        res.json({
            windowPrevState,
            windowCurrState: [...numberWindow],
            numbers: uniqueNumbers,
            avg: parseFloat(average),
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch numbers from the third-party server' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
