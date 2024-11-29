document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      errorMessage.style.display = "none";
  
      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {"Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Identifiants incorrects");
        }
  
        const data = await response.json();
        const token = data.token;
  
        localStorage.setItem("authToken", token);
  
        window.location.href = "index.html";
      } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";
      }
    });
  });
  