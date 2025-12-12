// Function to save user data to backend API
// This is called from email.js after successful email submission
function saveUserToBackend(name, email, phone) {
    console.log("saveUserToBackend called with:", { name, email, phone });
    
    const user = {
        Name: name || '',
        Email: email || '',
        PhoneNumber: phone || null,
    };
    
    console.log("Sending user data to backend:", user);
    
    // Only save if backend is available (localhost:5001)
    fetch("http://localhost:5001/users", {
        method: "POST",
        mode: "cors", // Enable CORS
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(async response => {
        console.log("Backend response status:", response.status);
        console.log("Backend response headers:", Object.fromEntries(response.headers.entries()));
        
        // Try to get error message from response
        let errorText = '';
        try {
            errorText = await response.clone().text();
            console.log("Backend response body:", errorText);
        } catch (e) {
            console.log("Could not read response body");
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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
            type: error.name,
            stack: error.stack
        });
        
        // More specific error messages
        if (error.message.includes("Failed to fetch")) {
            console.warn("⚠️ Backend server may not be running on localhost:5001");
            console.warn("⚠️ Or CORS is not enabled on the backend");
            console.warn("⚠️ Make sure your backend API is running and allows requests from localhost:8000");
        }
        // Don't show alert to user - fail silently so form still works
    });
}

// Make function globally available
window.saveUserToBackend = saveUserToBackend;

