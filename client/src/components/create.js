import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "Intern", // Default value for level
  });
  const navigate = useNavigate();

  // This function updates the form state when input fields change.
  function updateForm(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // This function handles form submission.
  async function onSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/records/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        // If the request was successful, clear the form and navigate to the home page.
        setForm({ name: "", position: "", level: "Intern" });
        navigate("/");
      } else {
        // Handle server error responses with more details.
        const data = await response.json(); // Parse the response body as JSON
        if (data && data.error) {
          window.alert(data.error); // Display the error message from the server
        } else {
          window.alert("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      // Handle any network or request errors by displaying an alert.
      window.alert(`Network Error: ${error.message}`);
    }
  }


  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={form.name}
            onChange={updateForm}
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            className="form-control"
            id="position"
            name="position"
            value={form.position}
            onChange={updateForm}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            {["Intern", "Junior", "Senior"].map((position) => (
              <div key={position}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="level"
                  id={`position${position}`}
                  value={position}
                  checked={form.level === position}
                  onChange={updateForm}
                />
                <label htmlFor={`position${position}`} className="form-check-label">
                  {position}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create Person"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
