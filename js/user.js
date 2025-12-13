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
        console.error("Error saving user to backend:", error);
        console.error("Error details:", {
            message: error.message,
            type: error.name,
            stack: error.stack
        });
        
        // More specific error messages
        if (error.message.includes("Failed to fetch")) {
            console.warn("API request failed... Please try again later.");
        }
        // Don't show alert to user - fail silently so form still works
    });
}
// Function to check if a user exists by email
// Returns a Promise that resolves to true if user exists, false otherwise
function checkUserExists(email) {
    console.log("checkUserExists called with:", email);
    
    // Add query parameters to the URL
    const url = new URL("http://localhost:5001/users");
    url.searchParams.append("email", email);
    
    return fetch(url.toString(), {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        // If 404, user doesn't exist
        if (response.status === 404) {
            console.log("User not found (404)");
            return false;
        }
        
        // If other error, log and return false
        if (!response.ok) {
            console.warn(`HTTP error! status: ${response.status}`);
            return false;
        }
        
        // Parse response
        const data = await response.json();
        
        // Check if data exists and is not empty
        // Handle different response formats:
        // - Single user object: { Name: "...", Email: "..." }
        // - Array of users: [{ ... }]
        // - Empty/null response
        if (Array.isArray(data)) {
            const exists = data.length > 0 && data[0] !== null;
            console.log("User exists:", exists, data);
            return exists;
        } else if (data && typeof data === 'object') {
            // Check if object has meaningful data (not just empty object)
            const hasData = Object.keys(data).length > 0 && data.Email !== undefined;
            console.log("User exists:", hasData, data);
            return hasData;
        } else {
            console.log("User not found (empty response)");
            return false;
        }
    })
    .catch(error => {
        console.error("Error checking user exists:", error);
        // Return false on error (user doesn't exist or server error)
        return false;
    });
}

// Function to get all users
function getAllUsers() {
    console.log("getAllUsers called");
    
    fetch("http://localhost:5001/users", {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("All users:", data);
        return data;
    })
    .catch(error => {
        console.error("Error getting all users:", error);
        throw error;
    });
}


// Make functions globally available
window.saveUserToBackend = saveUserToBackend;
window.checkUserExists = checkUserExists;
window.getAllUsers = getAllUsers;

