import React, { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
}

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<string>('');
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked"); // Log to check if function is called
    try {
      const parsedData = JSON.parse(jsonData);
      console.log("Parsed Data:", parsedData); // Log the parsed data
    
      // Send the request to the backend
      const response = await axios.post<ApiResponse>('https://bhfl-challenge-backend.onrender.com/bfhl', parsedData);

      console.log("Response Data:", response.data); // Log the response data
      setResponseData(response.data); // Update state with response data
    } catch (error) {
      console.error("Error:", error); // Log any errors
      alert('Invalid JSON format or server error');
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let result: Partial<ApiResponse> = {};

    if (selectedOptions.includes('Alphabets')) {
      result['alphabets'] = responseData.alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      result['numbers'] = responseData.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      result['highest_lowercase_alphabet'] = responseData.highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>21BCE9264</h1>
      <textarea
        rows={5}
        cols={50}
        placeholder='Enter JSON here: { "data": ["A","C","z"] }'
        value={jsonData}
        onChange={handleInputChange}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}>Submit</button>
      <br />
      <label htmlFor="options" style={{ marginTop: "20px", display: "block" }}>Select fields to display:</label>
      <select id="options" multiple onChange={handleOptionChange} style={{ padding: "10px", fontSize: "16px" }}>
        <option value="Alphabets">Alphabets</option>
        <option value="Numbers">Numbers</option>
        <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
      </select>
      {renderResponse()}
    </div>
  );
};

export default App;