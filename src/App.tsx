import React, { useState } from "react";
import axios from "axios";
import Select from "react-select"; // Import react-select
import "./App.css"; // Import the CSS file

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
  const [jsonData, setJsonData] = useState<string>("");
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const handleSelectChange = (selected: any) => {
    const selectedValues = selected
      ? selected.map((item: any) => item.value)
      : [];
    setSelectedOptions(selectedValues);
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked"); // Log to check if function is called
    try {
      const parsedData = JSON.parse(jsonData);
      console.log("Parsed Data:", parsedData); // Log the parsed data

      // Send the request to the backend
      const response = await axios.post<ApiResponse>(
        "https://bhfl-challenge-backend.onrender.com/bfhl",
        parsedData
      );

      console.log("Response Data:", response.data); // Log the response data
      setResponseData(response.data); // Update state with response data
    } catch (error) {
      console.error("Error:", error); // Log any errors
      alert("Invalid JSON format or server error");
    }
  };

  const renderFilteredResponse = () => {
    if (!responseData) return null;

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {selectedOptions.includes("Alphabets") && (
          <div>
            <strong>Alphabets:</strong> {responseData.alphabets.join(", ")}
          </div>
        )}
        {selectedOptions.includes("Numbers") && (
          <div>
            <strong>Numbers:</strong> {responseData.numbers.join(", ")}
          </div>
        )}
        {selectedOptions.includes("HighestLowercaseAlphabet") && (
          <div>
            <strong>Highest Lowercase Alphabet:</strong>{" "}
            {responseData.highest_lowercase_alphabet.join(", ")}
          </div>
        )}
      </div>
    );
  };

  const options = [
    { value: "Alphabets", label: "Alphabets" },
    { value: "Numbers", label: "Numbers" },
    { value: "HighestLowercaseAlphabet", label: "Highest Lowercase Alphabet" },
  ];

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
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>

          {/* Conditionally render the dropdowns only after receiving a successful response */}
          {responseData && (
            <>
              <h3 className="label">Filter Options</h3>
              <Select
                isMulti
                options={options}
                onChange={handleSelectChange}
                className="multi-select-dropdown"
                styles={{
                  container: (provided) => ({ ...provided, width: "100%" }),
                }}
              />
            </>
          )}

          {renderFilteredResponse()}
        </div>
        <div className="response-section">
          <h3>Full Response</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      </div>
      <footer className="footer">Bhavesh Saluru | 21BCE9264</footer>
    </div>
  );
};

export default App;
