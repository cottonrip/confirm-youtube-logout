function showLogoutMessage() {
    browser.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "logout attempted",
        message: "you almost got logged out lol",
        priority: 2
    });
}

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        browser.tabs.sendMessage(details.tabId, { action: "confirmLogout", logoutUrl: details.url });
        return { cancel: true };
    },
    {
        urls: [
            "*://accounts.google.com/Logout*",
            "*://mail.google.com/mail/u/0/?logout*",
            "*://www.youtube.com/logout*",
            "*://drive.google.com/logout*",
            "*://photos.google.com/logout*"
        ]
    },
    ["blocking"]
);
