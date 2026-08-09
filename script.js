// ===== FADE IN ON PAGE LOAD =====
document.body.style.opacity = 0;
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = 1;
  });
});


// ===== STATE =====
let currentCoffee = {
  type: null,
  size: null,
  milk: null,
  sugar: null,
  syrup: [],
  toppings: [],
  ice: null,
  whippedCream: false,
  quantity: 1
};

let order = [];

// ===== PRICE MAPS =====
const typePriceMap = {
  Espresso: 200,
  Latte: 350,
  Cappuccino: 320
};

const milkPriceMap = {
  "Full Cream": 50,
  "Oat": 50,
  "None": 0
};

const sugarPriceMap = {
  "Low": 5,
  "Medium": 8,
  "High": 10,
  "None": 0
};

// ===== DOM ELEMENTS =====
const optionButtons = document.querySelectorAll('.option');
const livePriceDisplay = document.getElementById('livePrice');
const resetBtn = document.getElementById('resetBtn');
const addBtn = document.getElementById('addBtn');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const confirmationMsg = document.getElementById('confirmationMsg');

// ===== PRICE CALCULATION (single source of truth) =====
function calculatePrice(coffee) {
  const typePrice = typePriceMap[coffee.type] || 0;
  const milkPrice = milkPriceMap[coffee.milk] || 0;
  const sugarPrice = sugarPriceMap[coffee.sugar] || 0;
  return typePrice + milkPrice + sugarPrice;
}

function updateLivePrice() {
  if (!livePriceDisplay) return;
  const price = calculatePrice(currentCoffee);
  livePriceDisplay.textContent = `Rs. ${price}`;
}

// ===== OPTION SELECTION (with "selected" highlight) =====
optionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    const value = button.dataset.value;
    currentCoffee[category] = value;
    updateLivePrice();

    document.querySelectorAll(`.option[data-category="${category}"]`)
      .forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

// ===== ADD TO ORDER =====
if (addBtn) {
  addBtn.addEventListener('click', () => {
    if (!currentCoffee.type || !currentCoffee.milk || !currentCoffee.sugar) {
      return;
    }

    order.push({ ...currentCoffee });

    currentCoffee = {
      type: null,
      size: null,
      milk: null,
      sugar: null,
      syrup: [],
      toppings: [],
      ice: null,
      whippedCream: false,
      quantity: 1
    };

    if (livePriceDisplay) livePriceDisplay.textContent = `Rs. 0`;
    renderOrder();
  });
}

// ===== RENDER ORDER (empty state + click-to-remove) =====
function renderOrder() {
  const orderList = document.getElementById('orderList');
  if (!orderList) return;

  orderList.innerHTML = '';

  if (order.length === 0) {
    orderList.innerHTML = `<li class="empty-state">No items yet — build your coffee above ☕</li>`;
  } else {
    order.forEach((coffee, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${coffee.type} | Milk: ${coffee.milk} | Sugar: ${coffee.sugar} | Rs. ${calculatePrice(coffee)}`;
      li.classList.add('order-item');

      li.addEventListener('click', () => {
        order = order.filter((item, i) => i !== index);
        renderOrder();
      });

      orderList.appendChild(li);
    });
  }

  updateTotal();
  updateResetButtonState();
  updatePlaceOrderButtonState();
}

// ===== TOTAL =====
function updateTotal() {
  const totalPriceEl = document.getElementById('totalPrice');
  if (!totalPriceEl) return;
  const total = order.reduce((sum, coffee) => sum + calculatePrice(coffee), 0);
  totalPriceEl.textContent = total;
}

// ===== RESET =====
function updateResetButtonState() {
  if (!resetBtn) return;
  resetBtn.disabled = order.length === 0;
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    order = [];
    renderOrder();
  });
}

// ===== PLACE ORDER BUTTON STATE =====
function updatePlaceOrderButtonState() {
  if (!placeOrderBtn) return;
  placeOrderBtn.disabled = order.length === 0;
}

// ===== PLACE ORDER LOGIC =====
if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', (e) => {
    if (confirmationMsg) {
      confirmationMsg.textContent = "✅ Order placed! Thank you for your order.";
    }

    createSparkles(e.clientX, e.clientY);

    order = [];
    renderOrder();

    setTimeout(() => {
      if (confirmationMsg) confirmationMsg.textContent = '';
    }, 3000);
  });
}

// ===== SPARKLE EFFECT =====
function createSparkles(x, y) {
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement('div');
    spark.classList.add('sparkle');

    const angle = Math.random() * 360;
    const distance = 40 + Math.random() * 40;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 700);
  }
}

// ===== PAGE TRANSITION (works on all pages) =====
const internalLinks = document.querySelectorAll('a[href$=".html"]');

internalLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const destination = link.getAttribute('href');

    document.body.classList.add('fade-out');

    setTimeout(() => {
      window.location.href = destination;
    }, 500);
  });
});