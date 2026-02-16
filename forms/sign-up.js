const form = document.getElementById("signupForm");


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;


  try {
    const response = await fetch("http://localhost:5000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    // ✅ Save user details locally
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Redirect to dashboard
    window.location.href = "/BIKADE-BUY&RENT.html";

  } catch (error) {
    console.error("Error:", error);
    alert("Server error, try again later");
  }
});
