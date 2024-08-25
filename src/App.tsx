import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

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
  const [selectedOptions, setSelectedOptions] = useState<{
    Alphabets: boolean;
    Numbers: boolean;
    HighestLowercaseAlphabet: boolean;
  }>({
    Alphabets: false,
    Numbers: false,
    HighestLowercaseAlphabet: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSelectedOptions(prevState => ({
      ...prevState,
      [name]: checked,
    }));
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

  const renderFilteredResponse = () => {
    if (!responseData) return null;

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {selectedOptions.Alphabets && (
          <div><strong>Alphabets:</strong> {responseData.alphabets.join(', ')}</div>
        )}
        {selectedOptions.Numbers && (
          <div><strong>Numbers:</strong> {responseData.numbers.join(', ')}</div>
        )}
        {selectedOptions.HighestLowercaseAlphabet && (
          <div><strong>Highest Lowercase Alphabet:</strong> {responseData.highest_lowercase_alphabet.join(', ')}</div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="container">
        <div className="input-section">
          <h2 className="title">Data Processor</h2>
          <h3 className="label">API Input</h3>
          <textarea
            rows={3}
            cols={50}
            placeholder='{"data":["M","1","334","4","B"]}'
            value={jsonData}
            onChange={handleInputChange}
            className="input-textarea"
          />
          <button onClick={handleSubmit} className="submit-button">Submit</button>
          <h3 className="label">Filter Options</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="Alphabets"
                checked={selectedOptions.Alphabets}
                onChange={handleCheckboxChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                name="Numbers"
                checked={selectedOptions.Numbers}
                onChange={handleCheckboxChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                name="HighestLowercaseAlphabet"
                checked={selectedOptions.HighestLowercaseAlphabet}
                onChange={handleCheckboxChange}
              />
              Highest Lowercase Alphabet
            </label>
          </div>
          {renderFilteredResponse()}
        </div>
        <div className="response-section">
          <h3>Full Response</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      </div>
      <footer className="footer">
        Bhavesh Saluru | 21BCE9264
      </footer>
    </div>
  );
};

export default App;