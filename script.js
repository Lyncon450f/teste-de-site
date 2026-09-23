let bets = [];

let notifications = JSON.parse(localStorage.getItem("betzone_notifications") || "null") || [
  { id: 1, title: "Bem-vindo ao BetZone", message: "Explore os jogos e monte seu cupom demonstrativo.", time: "Agora", read: false, icon: "👋" },
  { id: 2, title: "Interface atualizada", message: "A central de notificações já está disponível.", time: "Agora", read: false, icon: "✨" },
  { id: 3, title: "Modo demonstração", message: "Nenhuma aposta ou transação financeira é realizada.", time: "Hoje", read: true, icon: "🛡️" }
];

document.addEventListener("DOMContentLoaded", () => {
  updateSlip();
  calculate();
  setupSports();
  setupAmount();
  setupNotifications();
  setupBetButtons();
  setupActions();
  renderNotifications();
});

function setupBetButtons() {
  document.querySelectorAll(".odd").forEach(button => {
    button.addEventListener("click", () => {
      addBet(button.dataset.game, button.dataset.option, Number(button.dataset.odd));
    });
  });
}

function setupActions() {
  document.getElementById("loginButton")?.addEventListener("click", login);
  document.getElementById("placeBetButton")?.addEventListener("click", placeBet);
  document.getElementById("markAllButton")?.addEventListener("click", markAllNotificationsRead);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function setupNotifications() {
  const button = document.getElementById("notificationButton");
  const panel = document.getElementById("notificationPanel");
  if (!button || !panel) return;

  button.addEventListener("click", event => {
    event.stopPropagation();
    const open = panel.classList.toggle("open");
    panel.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", event => {
    if (!panel.contains(event.target) && !button.contains(event.target)) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function saveNotifications() {
  localStorage.setItem("betzone_notifications", JSON.stringify(notifications));
}

function renderNotifications() {
  const list = document.getElementById("notificationsList");
  const count = document.getElementById("notificationCount");
  if (!list || !count) return;

  const unread = notifications.filter(notification => !notification.read).length;
  count.textContent = unread;
  count.classList.toggle("visible", unread > 0);

  if (!notifications.length) {
    list.innerHTML = '<div class="notification-empty">Tudo certo por aqui. Nenhuma notificação.</div>';
    return;
  }

  list.innerHTML = notifications.map(notification => `
    <button class="notification-item ${notification.read ? "" : "unread"}" type="button" data-id="${notification.id}">
      <span class="notification-icon">${notification.icon || "🔔"}</span>
      <span class="notification-content">
        <strong>${escapeHtml(notification.title)}</strong>
        <p>${escapeHtml(notification.message)}</p>
        <span class="notification-time">${escapeHtml(notification.time || "Agora")}</span>
      </span>
    </button>
  `).join("");

  list.querySelectorAll(".notification-item").forEach(item => {
    item.addEventListener("click", () => markNotificationRead(Number(item.dataset.id)));
  });
}

function addNotification(title, message, icon = "🔔") {
  notifications.unshift({
    id: Date.now(),
    title,
    message,
    time: "Agora",
    read: false,
    icon
  });

  notifications = notifications.slice(0, 12);
  saveNotifications();
  renderNotifications();
  showToast(title, message);
}

function markNotificationRead(id) {
  const notification = notifications.find(item => item.id === id);
  if (!notification) return;

  notification.read = true;
  saveNotifications();
  renderNotifications();
}

function markAllNotificationsRead() {
  notifications.forEach(notification => {
    notification.read = true;
  });

  saveNotifications();
  renderNotifications();
  showToast("Notificações atualizadas", "Tudo foi marcado como lido.", "✓");
}

function showToast(title, message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

function addBet(game, option, odd) {
  const index = bets.findIndex(bet => bet.game === game);
  const selection = { game, option, odd: Number(odd) };

  if (index !== -1) {
    bets[index] = selection;
  } else {
    bets.push(selection);
  }

  document.querySelectorAll(".odd").forEach(button => {
    button.classList.remove("selected");
  });

  restoreSelections();
  updateSlip();
  calculate();
  addNotification("Seleção adicionada", `${game} • ${option} • cotação ${Number(odd).toFixed(2)}`, "🎯");
}

function updateSlip() {
  const container = document.getElementById("bets");
  const count = document.getElementById("betCount");
  if (!container) return;

  if (count) count.textContent = bets.length;

  if (!bets.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🎟️</div>
        <p>Nenhuma seleção ainda</p>
        <small>Escolha uma cotação para adicioná-la ao cupom.</small>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  bets.forEach((bet, index) => {
    const item = document.createElement("div");
    item.className = "bet";
    item.innerHTML = `
      <button class="remove" type="button" aria-label="Remover seleção">×</button>
      <div class="bet-title">${escapeHtml(bet.game)}</div>
      <div class="bet-info">${escapeHtml(bet.option)} • Cotação ${bet.odd.toFixed(2)}</div>
    `;

    item.querySelector(".remove").addEventListener("click", () => removeBet(index));
    container.appendChild(item);
  });
}

function removeBet(index) {
  if (index < 0 || index >= bets.length) return;

  const removed = bets[index];
  bets.splice(index, 1);

  restoreSelections();
  updateSlip();
  calculate();
  addNotification("Seleção removida", `${removed.game} foi removido do cupom.`, "🗑️");
}

function restoreSelections() {
  document.querySelectorAll(".odd").forEach(button => {
    button.classList.remove("selected");

    bets.forEach(bet => {
      if (button.dataset.game === bet.game && button.dataset.option === bet.option) {
        button.classList.add("selected");
      }
    });
  });
}

function calculate() {
  const total = bets.length
    ? bets.reduce((sum, bet) => sum * bet.odd, 1)
    : 0;

  const totalOdd = document.getElementById("totalOdd");
  if (totalOdd) totalOdd.textContent = total.toFixed(2);

  calculateReturn(total);
}

function calculateReturn(total) {
  const amount = document.getElementById("amount");
  const returnValue = document.getElementById("returnValue");
  if (!amount || !returnValue) return;

  const value = Number(amount.value);

  returnValue.textContent =
    !value || value <= 0 || !bets.length
      ? "R$ 0,00"
      : (value * total).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        });
}

function setupAmount() {
  const amount = document.getElementById("amount");
  if (amount) amount.addEventListener("input", calculate);
}

function setupSports() {
  const sports = document.querySelectorAll(".sport");

  sports.forEach(button => {
    button.addEventListener("click", () => {
      sports.forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      addNotification(
        "Esporte selecionado",
        `${button.textContent.trim()} está em destaque.`,
        "🏆"
      );
    });
  });
}

function login() {
  addNotification(
    "Login demonstrativo",
    "A área de login é apenas uma demonstração visual.",
    "👤"
  );
}

function placeBet() {
  if (!bets.length) {
    addNotification(
      "Cupom vazio",
      "Selecione pelo menos uma cotação para simular.",
      "⚠️"
    );
    return;
  }

  const amount = Number(document.getElementById("amount").value);

  if (!amount || amount <= 0) {
    addNotification(
      "Valor inválido",
      "Digite um valor demonstrativo maior que zero.",
      "⚠️"
    );
    return;
  }

  const total = bets.reduce((sum, bet) => sum * bet.odd, 1);
  const result = amount * total;

  addNotification(
    "Simulação concluída",
    `Retorno estimado de ${result.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })}. Nenhuma transação real foi realizada.`,
    "✅"
  );
}
