// Function to save user data to backend API
// This is called from email.js after successful email submission
function saveUserToBackend(name, email, phone) {
    console.log("saveUserToBackend called with:", { name, email, phone });
    
    const user = {
        name: name || '',
        email: email || '',
        phone: phone || null,
    };
    
    console.log("Sending user data to backend:", user);
    
    // Only save if backend is available (localhost:5001)
    fetch("http://localhost:5001/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        console.log("Backend response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ User saved to backend successfully:", data);
    })
    .catch(error => {
        // Log the error for debugging
        console.error("❌ Error saving user to backend:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack
        });
        // Don't show alert to user - fail silently so form still works
    });
}

// Make function globally available
window.saveUserToBackend = saveUserToBackend;

