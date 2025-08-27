const $btnsLogout = document.querySelectorAll(".logout");

async function logoutUser() {
  try {
    const response = await fetch("/logout", { method: "POST", credentials: "include" });

    if (response.ok) {
      window.location.href = "/login";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

for (const $button of $btnsLogout) {
  $button.addEventListener("click", function (event) {
    logoutUser();
  });
}
