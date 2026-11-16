const loginForm = document.getElementById("login-form");
const adminArea = document.getElementById("admin-area");
const adminMessage = document.getElementById("admin-message");

function showAdmin(loggedIn) {
    loginForm.hidden = loggedIn;
    adminArea.hidden = !loggedIn;
}


async function loadRegistrations() {
    const { data, error } = await db
        .from("registrations")
        .select("*, events(name)")
        .order("created_at", { ascending: false });

    if (error) {
        adminMessage.textContent = "Could not load registrations.";
        return;
    }

    const body = document.getElementById("registrations-body");
    body.innerHTML = "";

    data.forEach(function (row) {
        const tr = document.createElement("tr");
        const cells = [
            row.events ? row.events.name : "-",
            row.name,
            row.email,
            row.phone,
            new Date(row.created_at).toLocaleString()
        ];
        cells.forEach(function (text) {
            const td = document.createElement("td");
            td.textContent = text;
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
}


loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const { error } = await db.auth.signInWithPassword({
        email: document.getElementById("admin-email").value,
        password: document.getElementById("admin-password").value
    });

    if (error) {
        adminMessage.textContent = "Login failed. Check your email and password.";
        return;
    }
    adminMessage.textContent = "";
    showAdmin(true);
    loadRegistrations();
});


document.getElementById("logout-button").addEventListener("click", async function () {
    await db.auth.signOut();
    showAdmin(false);
});


async function checkSession() {
    const { data } = await db.auth.getSession();
    if (data.session) {
        showAdmin(true);
        loadRegistrations();
    }
}
checkSession();