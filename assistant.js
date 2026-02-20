(function () {
  const pageTitle = (document.title || "").toLowerCase();
  const THEME_KEY = "savoreTheme";

  function getPageHints() {
    if (pageTitle.includes("admin panel")) {
      return [
        "Add item details, then click Add Item.",
        "Use Edit on any item to update image/category/description.",
        "Changes here appear for users on the home/menu pages."
      ];
    }
    if (pageTitle.includes("admin login")) {
      return [
        "Use your admin username and password to sign in.",
        "If you do not have an account, click Create Admin Account.",
        "Default admin is admin / admin123."
      ];
    }
    if (pageTitle.includes("create admin account")) {
      return [
        "Fill username, phone, password, and FSIL code.",
        "Use a unique username and phone number.",
        "After success, login from Admin Login page."
      ];
    }
    if (pageTitle.includes("user login")) {
      return [
        "Enter name and phone number to continue.",
        "After login, you will be redirected to home.",
        "Use Admin Login only for admin operations."
      ];
    }
    return [
      "Search food and use category filters on the home page.",
      "Click Set Location to open the map picker.",
      "Add items to cart and choose payment method at checkout."
    ];
  }

  function getReply(text) {
    const t = (text || "").toLowerCase();
    if (!t) return "Type your question and I will help based on this page.";

    if (t.includes("location") || t.includes("map")) {
      return "Click Set Location, search your place in the map modal, then click Use This Location.";
    }
    if (t.includes("cart") || t.includes("checkout") || t.includes("payment")) {
      return "Add items first, open Cart, choose a payment option, then click Pay & Place Order.";
    }
    if (t.includes("admin") && (t.includes("create") || t.includes("register"))) {
      return "Open Create Admin Account, fill username/phone/password and FSIL code, then login.";
    }
    if (t.includes("edit") || t.includes("description") || t.includes("image") || t.includes("category")) {
      return "In Admin Panel, click Edit on an item, update fields, then click Update Item.";
    }
    if (t.includes("tracking")) {
      return "Open Tracking tab to view live rider movement, status, ETA, and speed updates.";
    }
    if (t.includes("login")) {
      return "Use User Login for customers and Admin Login for admins. Credentials are separate.";
    }
    return "I can help with location, login, admin actions, cart, payment, and tracking on this page.";
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      html.theme-dark body{
        background:#121212 !important;
        color:#ededed !important;
      }
      html.theme-dark .card,
      html.theme-dark .panel,
      html.theme-dark .tracking-box,
      html.theme-dark .filter-wrap,
      html.theme-dark .payment-box,
      html.theme-dark .cart-item,
      html.theme-dark .item,
      html.theme-dark .map-modal-card{
        background:#1d1d1d !important;
        color:#ededed !important;
        border-color:#2d2d2d !important;
      }
      html.theme-dark .subtle,
      html.theme-dark .food-desc,
      html.theme-dark .restaurant-meta,
      html.theme-dark .map-location,
      html.theme-dark .map-speed{
        color:#c2c2c2 !important;
      }
      html.theme-dark .card-content h3{
        color:#f5f5f5 !important;
      }
      html.theme-dark .card-content small{
        color:#cfcfcf !important;
      }
      html.theme-dark .card-content p{
        color:#d9d9d9 !important;
      }
      html.theme-dark .tag{
        background:#303030 !important;
        color:#f1f1f1 !important;
      }
      html.theme-dark .tag.veg{
        background:#1f4d2c !important;
        color:#d9ffe5 !important;
      }
      html.theme-dark .tag.non-veg{
        background:#5a2620 !important;
        color:#ffd8d3 !important;
      }
      html.theme-dark .price{
        color:#ffe0ac !important;
      }
      html.theme-dark input,
      html.theme-dark select,
      html.theme-dark textarea{
        background:#111 !important;
        color:#f1f1f1 !important;
        border-color:#343434 !important;
      }
      html.theme-dark .delivery-bar{
        background:#141414 !important;
      }
      html.theme-dark .location-pill{
        background:#202020 !important;
      }
      html.theme-dark .ai-theme-btn{
        background:#2e2e2e !important;
        color:#fff !important;
      }
      html.theme-dark .ai-theme-toggle{
        color:#f4f4f4 !important;
      }
      html.theme-dark .ai-theme-track{
        background:#3a3a3a !important;
      }
      html.theme-dark .ai-theme-thumb{
        background:#f2f2f2 !important;
      }
      .ai-assistant-btn{
        position:fixed; right:18px; bottom:18px; z-index:10000;
        border:none; border-radius:999px; padding:10px 14px;
        background:#fc8019; color:#fff; cursor:pointer; font-weight:600;
        box-shadow:0 8px 20px rgba(0,0,0,0.2);
      }
      .ai-assistant-panel{
        position:fixed; right:18px; bottom:70px; z-index:10000;
        width:min(360px,92vw); background:#fff; border-radius:14px;
        box-shadow:0 16px 35px rgba(0,0,0,0.25); display:none;
        overflow:hidden; border:1px solid #eee;
      }
      .ai-assistant-head{
        background:#111; color:#fff; padding:10px 12px; font-size:14px; font-weight:600;
        display:flex; justify-content:space-between; align-items:center;
      }
      .ai-assistant-close{
        border:none; background:transparent; color:#fff; cursor:pointer; font-size:14px;
      }
      .ai-assistant-body{ padding:12px; max-height:280px; overflow:auto; font-size:13px; color:#333; }
      .ai-assistant-body ul{ margin:6px 0 0 16px; }
      .ai-assistant-chat{ border-top:1px solid #eee; padding:10px; display:grid; grid-template-columns:1fr auto; gap:8px; }
      .ai-assistant-chat input{
        border:1px solid #ddd; border-radius:10px; padding:8px 10px; width:100%;
      }
      .ai-assistant-chat button{
        border:none; border-radius:10px; padding:8px 12px; background:#fc8019; color:#fff; cursor:pointer;
      }
      .ai-assistant-reply{ margin-top:8px; background:#f7f7f7; border-radius:10px; padding:8px; }
      .ai-theme-btn{
        position:fixed; right:18px; bottom:122px; z-index:10000;
        border:none; border-radius:999px; padding:10px 14px;
        background:#fff; color:#222; cursor:pointer; font-weight:600;
        box-shadow:0 8px 20px rgba(0,0,0,0.2);
      }
      .ai-theme-btn.in-header{
        position:static;
        right:auto;
        bottom:auto;
        box-shadow:none;
        padding:8px 12px;
        margin-left:12px;
      }
      .ai-theme-toggle{
        display:inline-flex; align-items:center; gap:8px;
        margin-left:12px; user-select:none;
      }
      .ai-theme-toggle-label{
        font-size:12px; color:#fff;
      }
      .ai-theme-switch{
        border:none; padding:0; background:transparent; cursor:pointer;
      }
      .ai-theme-track{
        width:44px; height:24px; border-radius:999px;
        background:#d8d8d8; position:relative;
        box-shadow:inset 0 0 0 1px rgba(0,0,0,0.12);
      }
      .ai-theme-thumb{
        width:18px; height:18px; border-radius:50%;
        background:#fff; position:absolute; top:3px; left:3px;
        transition:left .22s ease, background .22s ease;
        box-shadow:0 2px 6px rgba(0,0,0,.25);
      }
      .ai-theme-toggle[data-theme="dark"] .ai-theme-thumb{
        left:23px;
      }
    `;
    document.head.appendChild(style);
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");
    localStorage.setItem(THEME_KEY, theme);
  }

  function init() {
    addStyles();
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);

    const hints = getPageHints();
    const themeToggle = document.createElement("div");
    themeToggle.className = "ai-theme-toggle";
    themeToggle.setAttribute("data-theme", savedTheme);
    themeToggle.innerHTML = `
      <span class="ai-theme-toggle-label">${savedTheme === "dark" ? "Dark" : "Light"}</span>
      <button class="ai-theme-switch" type="button" aria-label="Toggle theme">
        <span class="ai-theme-track"><span class="ai-theme-thumb"></span></span>
      </button>
    `;

    const btn = document.createElement("button");
    btn.className = "ai-assistant-btn";
    btn.textContent = "Help Assistant";

    const panel = document.createElement("div");
    panel.className = "ai-assistant-panel";
    panel.innerHTML = `
      <div class="ai-assistant-head">
        <span>AI Page Assistant</span>
        <button class="ai-assistant-close" type="button">Close</button>
      </div>
      <div class="ai-assistant-body">
        <strong>Quick help for this page</strong>
        <ul>${hints.map(h => `<li>${h}</li>`).join("")}</ul>
        <div id="aiAssistantReply" class="ai-assistant-reply">Ask me what you want to do here.</div>
      </div>
      <div class="ai-assistant-chat">
        <input id="aiAssistantInput" type="text" placeholder="Ask: how to set location, add item, edit item...">
        <button id="aiAssistantSend" type="button">Send</button>
      </div>
    `;

    const headerNav = document.querySelector("header nav");
    if (headerNav) {
      headerNav.appendChild(themeToggle);
    } else {
      themeToggle.classList.add("ai-theme-btn");
      document.body.appendChild(themeToggle);
    }
    document.body.appendChild(btn);
    document.body.appendChild(panel);

    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("theme-dark");
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      themeToggle.setAttribute("data-theme", next);
      const label = themeToggle.querySelector(".ai-theme-toggle-label");
      if (label) label.textContent = next === "dark" ? "Dark" : "Light";
    });

    btn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });

    panel.querySelector(".ai-assistant-close").addEventListener("click", () => {
      panel.style.display = "none";
    });

    const input = panel.querySelector("#aiAssistantInput");
    const send = panel.querySelector("#aiAssistantSend");
    const reply = panel.querySelector("#aiAssistantReply");

    function runReply() {
      reply.textContent = getReply(input.value);
      input.value = "";
      input.focus();
    }

    send.addEventListener("click", runReply);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runReply();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
