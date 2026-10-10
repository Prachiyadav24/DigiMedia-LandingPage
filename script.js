const contactAddress = "prazeycom@gmail.com";
const profileStorageKey = "digimedia.profile.v1";

const accountLink = document.querySelector(".navbar-cta");
if (accountLink) {
  try {
    if (localStorage.getItem(profileStorageKey)) {
      accountLink.href = "profile.html";
      accountLink.textContent = "My Dashboard";
      accountLink.setAttribute("aria-label", "Open your project dashboard");
    }
  } catch (error) {
    // Keep the regular sign-up link if browser storage is unavailable.
  }
}

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
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    fullNameInput.value = fullNameInput.value.trim();
    emailInput.value = emailInput.value.trim();
    if (!signupForm.reportValidity()) return;

    const name = fullNameInput.value;
    const email = emailInput.value;

    try {
      let existingProfile = null;
      try {
        existingProfile = JSON.parse(localStorage.getItem(profileStorageKey));
      } catch (error) {
        existingProfile = null;
      }

      const profile = existingProfile && existingProfile.email?.toLowerCase() === email.toLowerCase()
        ? { ...existingProfile, name, email }
        : { name, email, createdAt: new Date().toISOString(), projects: [] };
      if (!Array.isArray(profile.projects)) profile.projects = [];

      localStorage.setItem(profileStorageKey, JSON.stringify(profile));
      formMessage.textContent = "Your demo profile is ready. Opening your dashboard…";
      window.location.assign("profile.html");
    } catch (error) {
      formMessage.textContent = "This browser could not save your profile. Enable local storage or try another browser.";
      formMessage.className = "mt-3 text-center fw-semibold text-danger";
    }
  });
}