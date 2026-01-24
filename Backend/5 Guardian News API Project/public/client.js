document.addEventListener("DOMContentLoaded", () => {
  const newsForm = document.querySelector("form");
  const loadingOverlay = document.getElementById("loading-overlay");

  if (newsForm) {
    newsForm.addEventListener("submit", () => {
      loadingOverlay.classList.remove("loading-hidden");
    });
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      loadingOverlay.classList.add("loading-hidden");
    }
  });
});
