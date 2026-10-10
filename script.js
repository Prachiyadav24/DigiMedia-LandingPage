const contactAddress = "prazeycom@gmail.com";

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  const formMessage = document.getElementById("formMessage");
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    openEmailDraft(signupForm, "DigiMedia project consultation", formMessage);
  });
}