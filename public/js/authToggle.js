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
// real code starts(dynamic header for login)

/*
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/session')
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          // Update header login status if it exists
          const headerStatus = document.getElementById('login-status');
          if (headerStatus) {
            headerStatus.innerHTML = `
              Logged in as ${data.user.username}
              <button id="logout-btn" style="margin-left: 10px;">Logout</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
              fetch('/logout', { method: 'POST' })
                .then(() => location.reload())
                .catch(error => console.error('Error logging out:', error));
            });
          }

          // Update footer login status if it exists
          const footerStatus = document.getElementById('login-status-footer');
          if (footerStatus) {
            footerStatus.innerHTML = `
              Logged in as ${data.user.username}
              <button id="logout-btn-footer" style="margin-left: 10px;">Logout</button>
            `;
            document.getElementById('logout-btn-footer').addEventListener('click', () => {
              fetch('/logout', { method: 'POST' })
                .then(() => location.reload())
                .catch(error => console.error('Error logging out:', error));
            });
          }
        }
      })
      .catch(error => {
        console.error('Error checking login status:', error);
      });
});
*/