const db = supabase.createClient("https://wvppmpddpefcseoibeim.supabase.co", "sb_publishable_j2qetT0o4lhXcnghMdSn5w_wHoGog8M");

async function loadEvents() {
    const list = document.getElementById("events-list");
    if (!list) return;

    const { data, error } = await db.from("events").select("*").order("event_date");
    if (error) {
        list.textContent = "Could not load events.";
        return;
    }

    data.forEach(function (item) {
        list.innerHTML += `
      <div class="event-card">
        <h3>${item.name}</h3>
        <p>${new Date(item.event_date).toDateString()} · ${item.place}</p>
        <a href="event.html?id=${item.id}">Register</a>
      </div>
    `;
    });
}

async function loadEventPage() {
    const form = document.getElementById("register-form");
    if (!form) return;

    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const { data: chosen, error } = await db.from("events").select("*").eq("id", id).single();
    if (error) {
        document.getElementById("event-title").textContent = "Event not found";
        return;
    }

    document.getElementById("event-title").textContent = chosen.name;
    document.getElementById("event-details").textContent =
        new Date(chosen.event_date).toDateString() + " · " + chosen.place;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;

        const { error } = await db.from("registrations").insert({
            event_id: id,
            name: name,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        });

        if (error) {
            document.getElementById("message").textContent = "Something went wrong. Please try again.";
            return;
        }
        document.getElementById("message").textContent =
            "You're registered, " + name + "! See you at " + chosen.name + ".";
        form.reset();
    });
}

loadEvents();
loadEventPage();