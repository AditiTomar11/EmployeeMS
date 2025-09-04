import React from "react";

const Profile = ({ employee }) => {
  // Example employee data if not passed as props
  const dummyEmployee = {
    name: "John Doe",
    email: "john@example.com",
    salary: "50000",
    address: "123 Main St, New York",
    category: "Engineering",
  };

  const data = employee || dummyEmployee;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        color: "#333",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2575fc" }}>
          👤 Employee Profile
        </h2>
        <p style={{ margin: "10px 0" }}>
          <strong>Name:</strong> {data.name}
        </p>
        <p style={{ margin: "10px 0" }}>
          <strong>Email:</strong> {data.email}
        </p>
        <p style={{ margin: "10px 0" }}>
          <strong>Salary:</strong> ${data.salary}
        </p>
        <p style={{ margin: "10px 0" }}>
          <strong>Address:</strong> {data.address}
        </p>
        <p style={{ margin: "10px 0" }}>
          <strong>Category:</strong> {data.category}
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#2575fc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#6a11cb")}
          onMouseOut={(e) => (e.target.style.background = "#2575fc")}
        >
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
