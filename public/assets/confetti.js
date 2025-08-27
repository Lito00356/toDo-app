// ======================= CONFETTI =======================

const jsConfetti = new JSConfetti();

function shootConfettiOnCheckedStatus(checkbox) {
  const checkboxStatus = checkbox.checked;
  if (checkboxStatus) {
    jsConfetti.addConfetti({
      confettiRadius: 4,
    });
  } else {
    return;
  }
}

// ======================= CONFETTI =======================
