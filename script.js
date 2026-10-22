// WasteXchange - Frontend-only (HTML/CSS/JS) using localStorage

const STORAGE_KEY = "wastexchange_listings";

// Sample initial data (if nothing in localStorage)
const sampleListings = [
  {
    id: "1",
    title: "50 kg HDPE Plastic Waste",
    category: "Plastic",
    type: "Sell",
    quantity: "50 kg",
    city: "Kolhapur",
    price: "₹22/kg",
    description:
      "Clean HDPE plastic waste, sorted by color. Available for immediate pickup.",
    contactName: "Rajesh Patil",
    contactPhone: "9876543210",
    contactEmail: "rajesh@example.com",
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Used Office Paper for Recycling",
    category: "Paper",
    type: "Sell",
    quantity: "200 kg",
    city: "Pune",
    price: "₹8/kg",
    description:
      "Mixed office paper, no plastic coating. Can load from our warehouse.",
    contactName: "Sneha Deshmukh",
    contactPhone: "9123456789",
    contactEmail: "sneha@example.com",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "3",
    title: "Need 100 kg Copper Scrap",
    category: "Metal",
    type: "Buy",
    quantity: "100 kg",
    city: "Mumbai",
    price: "Market rate",
    description:
      "Looking to buy copper scrap (wires, pipes). Ready to pick up in bulk.",
    contactName: "Amit Sharma",
    contactPhone: "9988776655",
    contactEmail: "amit@example.com",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "4",
    title: "E-Waste: Old Laptops & CPUs",
    category: "E-Waste",
    type: "Exchange",
    quantity: "15 units",
    city: "Kolhapur",
    price: "Exchange for cash or other e-waste",
    description:
      "Old laptops and CPUs, some working, some not. Open to exchange deals.",
    contactName: "Tech Solutions",
    contactPhone: "9011223344",
    contactEmail: "tech@example.com",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
  },
];

// Utility: load listings from localStorage or use sample
function loadListings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return sampleListings;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleListings));
  return sampleListings;
}

// Utility: save listings to localStorage
function saveListings(listings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

// Render listings
function renderListings(listings) {
  const grid = document.getElementById("listingsGrid");
  const noMsg = document.getElementById("noListingsMsg");
  grid.innerHTML = "";

  if (!listings || listings.length === 0) {
    noMsg.style.display = "block";
    return;
  }

  noMsg.style.display = "none";

  listings.forEach((item) => {
    const card = document.createElement("div");
    card.className = "listing-card";

    const badgeText = `${item.type} • ${item.category}`;
    const contactWhatsApp = `https://wa.me/91${item.contactPhone.replace(/\D/g, "")}`;
    const contactTel = `tel:+91${item.contactPhone.replace(/\D/g, "")}`;
    const mailHref = item.contactEmail
      ? `mailto:${item.contactEmail}`
      : "#";

    card.innerHTML = `
      <div class="listing-header">
        <div class="listing-title">${escapeHtml(item.title)}</div>
        <div class="listing-badge">${escapeHtml(badgeText)}</div>
      </div>
      <div class="listing-meta">
        <div>📍 ${escapeHtml(item.city)} ${item.quantity ? "• " + escapeHtml(item.quantity) : ""}</div>
        <div>💰 ${item.price ? escapeHtml(item.price) : "Negotiable"}</div>
        <div>🕒 ${timeAgo(item.createdAt)}</div>
      </div>
      <div class="listing-desc">${escapeHtml(item.description)}</div>
      <div class="listing-contact">
        <a href="${contactWhatsApp}" target="_blank" class="contact-btn">WhatsApp</a>
        <a href="${contactTel}" class="contact-btn">Call</a>
        ${item.contactEmail ? `<a href="${mailHref}" class="contact-btn">Email</a>` : ""}
      </div>
    `;

    grid.appendChild(card);
  });
}

// Escape HTML to avoid XSS
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Time ago helper
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

// Filter listings
function applyFilters() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const type = document.getElementById("typeFilter").value;

  let listings = loadListings();

  if (search) {
    listings = listings.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.city && item.city.toLowerCase().includes(search)) ||
        (item.description && item.description.toLowerCase().includes(search))
    );
  }

  if (category) {
    listings = listings.filter((item) => item.category === category);
  }

  if (type) {
    listings = listings.filter((item) => item.type === type);
  }

  // Sort newest first
  listings.sort((a, b) => b.createdAt - a.createdAt);

  renderListings(listings);
}

// Add new listing
function handleAddListing(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const listingType = document.getElementById("listingType").value;
  const quantity = document.getElementById("quantity").value.trim();
  const city = document.getElementById("city").value.trim();
  const price = document.getElementById("price").value.trim();
  const description = document.getElementById("description").value.trim();
  const contactName = document.getElementById("contactName").value.trim();
  const contactPhone = document.getElementById("contactPhone").value.trim();
  const contactEmail = document.getElementById("contactEmail").value.trim();

  if (
    !title ||
    !category ||
    !listingType ||
    !city ||
    !description ||
    !contactName ||
    !contactPhone
  ) {
    alert("Please fill all required fields.");
    return;
  }

  const listings = loadListings();

  const newListing = {
    id: Date.now().toString(),
    title,
    category,
    type: listingType,
    quantity,
    city,
    price,
    description,
    contactName,
    contactPhone,
    contactEmail,
    createdAt: Date.now(),
  };

  listings.unshift(newListing); // add to top
  saveListings(listings);

  // Reset form
  document.getElementById("addListingForm").reset();

  // Refresh listings view
  applyFilters();

  alert("Your listing has been posted successfully!");
  window.location.hash = "#listings";
}

// Clear filters
function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("typeFilter").value = "";
  applyFilters();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Render initial listings
  applyFilters();

  // Filter events
  document.getElementById("applyFilters").addEventListener("click", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", clearFilters);

  // Also filter on Enter in search box
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  });

  // Add listing form
  document
    .getElementById("addListingForm")
    .addEventListener("submit", handleAddListing);
});