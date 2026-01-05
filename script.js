// ===== CONFIG =====
const SERVER_IP = "play.spikemc.qzz.io";
const CLIENT_ID = "1457777669038018622";
const REDIRECT = "https://majhidipson575.github.io/spikemc.github.io";

// ===== PLAYER COUNT =====
async function serverStatus() {
  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
    const data = await res.json();

    document.getElementById("status").innerText =
      data.online
        ? `🟢 ${data.players.online} Players Online`
        : "🔴 Server Offline";
  } catch {
    document.getElementById("status").innerText = "⚠ Status unavailable";
  }
}
serverStatus();
setInterval(serverStatus, 10000);

// ===== COPY IP =====
function copyIP() {
  navigator.clipboard.writeText(SERVER_IP);
  const msg = document.getElementById("copyMsg");
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 2000);
}

// ===== DISCORD LOGIN =====
const loginBtn = document.getElementById("loginBtn");
const avatar = document.getElementById("avatar");
const popup = document.getElementById("profilePopup");

loginBtn.onclick = () => {
  window.location.href =
    `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT}&response_type=token&scope=identify`;
};

function getToken() {
  if (location.hash) {
    const token = new URLSearchParams(location.hash.substring(1)).get("access_token");
    if (token) {
      localStorage.setItem("discord_token", token);
      location.hash = "";
    }
  }
}

async function loadUser() {
  const token = localStorage.getItem("discord_token");
  if (!token) return;

  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await res.json();

  avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  avatar.classList.remove("hidden");
  loginBtn.style.display = "none";

  document.getElementById("popupAvatar").src = avatar.src;
  document.getElementById("popupName").innerText = user.username;
}

avatar.onclick = () => popup.classList.toggle("hidden");

function logout() {
  localStorage.removeItem("discord_token");
  location.reload();
}

getToken();
loadUser();
