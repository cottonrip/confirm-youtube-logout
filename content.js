let canLogout = 0;

function showLogoutMessage() {
    const message = document.createElement("div");
    message.innerText = "you almost got logged out lol";
    message.style.position = "fixed";
    message.style.top = "20px";
    message.style.left = "50%";
    message.style.transform = "translateX(-50%)";
    message.style.backgroundColor = "#f8d7da";
    message.style.color = "#721c24";
    message.style.padding = "10px 20px";
    message.style.borderRadius = "5px";
    message.style.zIndex = "9999";
    message.style.fontSize = "18px";
    message.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(message);
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
}

function confirmLogout(callback) {
    const confirmation = confirm("Are you sure you want to log out?");
    if (confirmation) {
        canLogout = 1;
    }
    callback(confirmation);
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "confirmLogout") {
        if (canLogout === 1) {
            window.location.href = message.logoutUrl;
            canLogout = 0;
        } else {
            confirmLogout((confirmed) => {
                if (confirmed) {
                    canLogout = 1;
                    window.location.href = message.logoutUrl;
                } else {
                    showLogoutMessage();
                }
            });
        }
    }
});

function addLogoutConfirmation() {
    const logoutButtons = document.querySelectorAll('a[href*="logout"], button[data-action="logout"]');
    logoutButtons.forEach(button => {
        if (!button.dataset.confirmationAdded) {
            button.dataset.confirmationAdded = "true";
            button.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                if (canLogout === 0) {
                    confirmLogout((confirmed) => {
                        if (confirmed) {
                            canLogout = 1;
                            const logoutUrl = button.href || '';
                            window.location.href = logoutUrl;
                        } else {
                            showLogoutMessage();
                        }
                    });
                } else {
                    const logoutUrl = button.href || '';
                    window.location.href = logoutUrl;
                    canLogout = 0;
                }
            });
        }
    });
}

function checkLogoutPage() {
    const logoutUrls = [
        "https://accounts.google.com/Logout",
        "https://mail.google.com/mail/u/0/?logout",
        "https://www.youtube.com/logout",
        "https://drive.google.com/logout",
        "https://photos.google.com/logout"
    ];
    if (logoutUrls.includes(window.location.href)) {
        showLogoutMessage();
    }
}

const intervalId = setInterval(() => {
    addLogoutConfirmation();
    if (document.querySelector('a[href*="logout"][data-confirmation-added="true"]')) {
        clearInterval(intervalId);
    }
}, 500);

checkLogoutPage();
