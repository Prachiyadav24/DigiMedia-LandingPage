const contactAddress = "prazeycom@gmail.com";

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const contactFeedback = document.getElementById("contactFeedback");
  const submitButton = contactForm.querySelector("[type='submit']");
  const homeUrl = "https://prachiyadav24.github.io/DigiMedia-LandingPage/";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    submitButton.disabled = true;
    contactFeedback.textContent = "Sending your message…";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });
      const result = await response.json();

      if (!response.ok || !(result.success === true || result.success === "true")) {
        throw new Error(result.message || result.error || "The email service did not accept the submission.");
      }

      contactFeedback.textContent = "Your message was accepted. Returning to the homepage…";
      window.setTimeout(() => window.location.assign(homeUrl), 900);
    } catch (error) {
      contactFeedback.textContent = `${error.message} Please try again, check that the recipient email has been verified with FormSubmit, or email ${contactAddress} directly.`;
      submitButton.disabled = false;
    }
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  const formMessage = document.getElementById("formMessage");
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    openEmailDraft(signupForm, "DigiMedia project consultation", formMessage);
  });
}