

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    let name = formData.get('name');
    let email = formData.get('email');
    let phone = formData.get('phone');
    let user = {
        name: name,
        email: email,
        phone: phone,
    };
    fetch("http:localhost:5001/users", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    ).then(response => {
        if (!response.ok) {
            throw new Error("Failed to create user");
        }
        return response.json();
    }).then(data => {
        console.log("User created successfully:", data);
    }).catch(error => {
        console.error("Error creating user:", error);
    });
});


