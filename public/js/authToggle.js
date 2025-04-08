// // public/js/authToggle.js

// document.addEventListener("DOMContentLoaded", () => {
//     // Prevent running this inside headers/footers (when dynamically loaded)
//     const runningInsideComponent = window.location.pathname.includes("header_") || window.location.pathname.includes("footer_");
//     if (runningInsideComponent) return;
  
//     const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  
//     const headerPath = isLoggedIn ? "./components/header_user.html" : "./components/header_guest.html";
//     const footerPath = isLoggedIn ? "./components/footer_user.html" : "./components/footer_guest.html";
  
//     const headerContainer = document.querySelector("header div[data-include]");
//     const footerContainer = document.querySelector("footer div[data-include]");
  
//     if (headerContainer) headerContainer.setAttribute("data-include", headerPath);
//     if (footerContainer) footerContainer.setAttribute("data-include", footerPath);
  
//     if (window.HTMLInclude) window.HTMLInclude();
  
//     console.log(`[authToggle] Loaded as ${isLoggedIn ? "LOGGED IN" : "GUEST"}`);
//   });
  
//   // Manual toggle function triggered by UI
//   function toggleLoginState() {
//     const currentlyLoggedIn = localStorage.getItem("loggedIn") === "true";
//     localStorage.setItem("loggedIn", (!currentlyLoggedIn).toString());
//     console.log(`[authToggle] Toggled login to ${!currentlyLoggedIn}`);
//     location.reload();
//   }
  