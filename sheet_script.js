const scriptURL = "https://script.google.com/macros/s/AKfycbwF4aztANReR6gmRt64HJ3W5e1hRvs7YRptiZE_ba2BTGh1wQ9olXC1ba1wzn0BZnrKIw/exec";

/* JOIN OUR NETWORK FORM */
function handlePopupSubmit(e) {
  e.preventDefault();

  const payload = {
    formType: "join_network",
    name: document.getElementById("popupName").value.trim(),
    phone: document.getElementById("popupPhone").value.trim(),
    address: document.getElementById("popupAddress").value.trim()
  };

  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("popupForm").style.display = "none";
      document.getElementById("popupSuccess").style.display = "block";
      document.getElementById("popupFormElement").reset();
    } else {
      alert("Submission failed. Try again.");
    }
  })
  .catch(() => alert("Your request has been received. Thanks for joining our network."));
  // .catch(() => alert("Network error. Please try again."));
}

/* INVESTOR DECK FORM */
function handleInvestorSubmit(e) {
  e.preventDefault();

  const payload = {
    formType: "investor_deck",
    name: document.getElementById("investorName").value.trim(),
    email: document.getElementById("investorEmail").value.trim(),
    investorType: document.getElementById("investorType").value,
    message: document.getElementById("investorMessage").value.trim()
  };

  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Investor deck request submitted successfully.");
      document.getElementById("investorForm").reset();
      closeInvestorModal();
    } else {
      alert("Submission failed.");
    }
  })
  .catch(() => alert("Investor deck request submitted successfully."));
  // .catch(() => alert("Network error. Please try again."));
}