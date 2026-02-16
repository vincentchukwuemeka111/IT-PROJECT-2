const form = document.getElementById("signinForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // 1️⃣ Try USER login first
    let response = await fetch("http://localhost:5000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data = await response.json();

    if (response.ok) {
      // ✅ User login success
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", "user");

      window.location.href = "/BIKADE-BUY&RENT.html";
      return;
    }

    // 2️⃣ If user login fails, try ADMIN login
    response = await fetch("http://localhost:5000/admin/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    data = await response.json();

    if (response.ok) {
      // ✅ Admin login success
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("role", "admin");

      window.location.href = "/admindashboard/admin.html";
      return;
    }

    // ❌ If both fail
    alert("Invalid email or password");

  } catch (error) {
    console.error(error);
    alert("Server error. Try again.");
  }
});
