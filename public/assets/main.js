const $btnsLogout = document.querySelectorAll(".logout");
const $logoutDialog = document.getElementById("logout-dialog");

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

if ($logoutDialog) {
  for (const $button of $btnsLogout) {
    $button.addEventListener("click", function () {
      $logoutDialog.showModal();
    });
  }

  document.getElementById("confirm-logout").addEventListener("click", function () {
    $logoutDialog.close();
    logoutUser();
  });

  document.getElementById("cancel-logout").addEventListener("click", function () {
    $logoutDialog.close();
  });
} else {
  // Fallback for pages without the logout dialog (e.g. login page)
  for (const $button of $btnsLogout) {
    $button.addEventListener("click", logoutUser);
  }
}
