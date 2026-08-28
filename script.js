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

// ===== OPTION SELECTION  =====
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
  if (confirmationMsg) {
    confirmationMsg.textContent =
      "Please select your coffee type, milk, and sugar first.";
  }

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

    document.querySelectorAll('.option.selected').forEach(btn => {
      btn.classList.remove('selected');
    });

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

// ======= about section =========

// ===== SCROLL HINT FADE OUT =====
const scrollHint = document.querySelector(".scroll-hint");

window.addEventListener("scroll", () => {

    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 50) {
        scrollHint.classList.add("hidden");
    } else {
        scrollHint.classList.remove("hidden");
    }

});



const teamItems = document.querySelectorAll('.team-item');
const cursorPreview = document.getElementById('cursorPreview');
const previewImg = document.getElementById('previewImg');

// ===== CURSOR-FOLLOW EFFECT =====
teamItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const imgSrc = item.dataset.image;
    previewImg.src = imgSrc;
    cursorPreview.classList.add('active');
  });

  item.addEventListener('mouseleave', () => {
    cursorPreview.classList.remove('active');
  });

  item.addEventListener('mousemove', (e) => {
   
    cursorPreview.style.left = `${e.clientX + 20}px`; 
    cursorPreview.style.top = `${e.clientY - 100}px`;
  });

  // ===== CLICK - DETAIL MODAL  =====
item.addEventListener('click', () => {
  document.getElementById('modalImg').src = item.dataset.image;
  document.getElementById('modalName').textContent = item.textContent.trim();
  document.getElementById('modalRole').textContent = item.dataset.role;
  document.getElementById('modalBio').textContent = item.dataset.bio; 
  document.getElementById('detailModal').classList.add('open');
 });
});

// ===== CLOSE MODAL =====
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    document.getElementById('detailModal').classList.remove('open');
  });
}

// ===== CARD ENTRANCE ANIMATIONS =====
const allCards = document.querySelectorAll('.note-card');

if (allCards[0]) {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      allCards[0].classList.add('placed');
    }, 500); // 0.5 second delay
  });
}


const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('placed');
    }
  });
}, { threshold: 0.2 }); 


allCards.forEach((card, index) => {
  if (index !== 0) {
    cardObserver.observe(card);
  }
});

// ===== URGENT ORDER PAGE =====
const menuGrid = document.getElementById('menuGrid');

if (menuGrid) {
  const menuItems = [
    { name: "Espresso", price: 200, icon: "ri-cup-line" },
    { name: "Latte", price: 350, icon: "ri-cup-line" },
    { name: "Cappuccino", price: 320, icon: "ri-cup-line" },
    { name: "Americano", price: 250, icon: "ri-cup-line" },
    { name: "Mocha", price: 380, icon: "ri-cup-line" },
    { name: "Hot Chocolate", price: 300, icon: "ri-cup-line" },
    { name: "Cardamom Croissant", price: 180, icon: "ri-cake-3-line" },
    { name: "Chocolate Muffin", price: 150, icon: "ri-cake-3-line" },
    { name: "Cinnamon Roll", price: 200, icon: "ri-cake-3-line" },
    { name: "Butter Cookie (3pc)", price: 120, icon: "ri-cake-3-line" },
    { name: "Cheesecake Slice", price: 280, icon: "ri-cake-3-line" },
    { name: "Almond Biscotti", price: 100, icon: "ri-cake-3-line" }
  ];

  let urgentOrder = []; // { name, price, quantity }

  // ===== RENDER MENU GRID =====
  function renderMenu() {
    menuGrid.innerHTML = '';
    menuItems.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('menu-card');
      card.innerHTML = `
        <i class="${item.icon}"></i>
        <h3>${item.name}</h3>
        <p>Rs. ${item.price}</p>
        <button class="add-item-btn">+ Add</button>
      `;

      card.querySelector('.add-item-btn').addEventListener('click', () => {
        addToUrgentOrder(item);
      });

      menuGrid.appendChild(card);
    });
  }

  // ===== ADD ITEM (quantity-aware) =====
  function addToUrgentOrder(item) {
    const existing = urgentOrder.find(o => o.name === item.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      urgentOrder.push({ ...item, quantity: 1 });
    }
    renderUrgentOrder();
  }

  // ===== RENDER ORDER LIST =====
  function renderUrgentOrder() {
    const list = document.getElementById('urgentOrderList');
    list.innerHTML = '';

    if (urgentOrder.length === 0) {
      list.innerHTML = `<li class="empty-state">No items yet — pick something quick above ☕</li>`;
    } else {
      urgentOrder.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${item.name} x${item.quantity} — Rs. ${item.price * item.quantity}
          <button class="remove-item-btn" data-index="${index}">✕</button>
        `;
        li.querySelector('.remove-item-btn').addEventListener('click', () => {
          urgentOrder = urgentOrder.filter((_, i) => i !== index);
          renderUrgentOrder();
        });
        list.appendChild(li);
      });
    }

    const total = urgentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('urgentTotal').textContent = total;

    const placeBtn = document.getElementById('urgentPlaceOrderBtn');
    if (placeBtn) placeBtn.disabled = urgentOrder.length === 0;
  }

  // ===== PLACE ORDER =====
  const urgentPlaceBtn = document.getElementById('urgentPlaceOrderBtn');
  if (urgentPlaceBtn) {
    urgentPlaceBtn.addEventListener('click', (e) => {
      document.getElementById('urgentConfirmationMsg').textContent = "✅ Order placed! We're on it.";
      createSparkles(e.clientX, e.clientY);
      urgentOrder = [];
      renderUrgentOrder();
      setTimeout(() => {
        document.getElementById('urgentConfirmationMsg').textContent = '';
      }, 3000);
    });
  }

  renderMenu();
  renderUrgentOrder();
}



// ===== PASTRY COUNTER PAGE =====
const pastryGrid = document.getElementById('pastryGrid');

if (pastryGrid) {

  const pastryItems = [
    {
      name: "Cardamom Croissant",
      price: 180,
      image: "assets/croissant.png"
    },
    {
      name: "Chocolate Muffin",
      price: 150,
      image: "assets/muffin.png"
    },
    {
      name: "Cinnamon Roll",
      price: 200,
      image: "assets/cinnamon-roll.png"
    },
    {
      name: "Butter Cookie (3pc)",
      price: 120,
      image: "assets/butter-cookie.png"
    },
    {
      name: "Cheesecake Slice",
      price: 280,
      image: "assets/cheesecake.png"
    },
    {
      name: "Almond Biscotti",
      price: 100,
      image: "assets/biscotti.png"
    }
  ];

  let pastryOrder = [];


  // =========================
  // RENDER PASTRY CARDS
  // =========================

  function renderPastryGrid() {

    pastryGrid.innerHTML = '';

    pastryItems.forEach(item => {

      const card = document.createElement('div');

      card.classList.add('menu-card');

      card.innerHTML = `
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="pastry-image"
        >

        <h3>${item.name}</h3>

        <p>Rs. ${item.price}</p>

        <button class="add-item-btn">
          + Add
        </button>
      `;

      card
        .querySelector('.add-item-btn')
        .addEventListener('click', () => {
          addToPastryOrder(item);
        });

      pastryGrid.appendChild(card);
    });
  }


  // =========================
  // ADD TO ORDER
  // =========================

  function addToPastryOrder(item) {

    const existing = pastryOrder.find(
      o => o.name === item.name
    );

    if (existing) {

      existing.quantity += 1;

    } else {

      pastryOrder.push({
        ...item,
        quantity: 1
      });

    }

    renderPastryOrder();
  }


  // =========================
  // RENDER ORDER
  // =========================

  function renderPastryOrder() {

    const list = document.getElementById(
      'pastryOrderList'
    );

    list.innerHTML = '';


    // Empty order
    if (pastryOrder.length === 0) {

      list.innerHTML = `
        <li class="empty-state">
          No pastries yet — pick something sweet above 🍰
        </li>
      `;

    } else {

      // Items in order
      pastryOrder.forEach((item, index) => {

        const li = document.createElement('li');

        li.innerHTML = `
          <span>
            ${item.name} x${item.quantity}
            — Rs. ${item.price * item.quantity}
          </span>

          <button 
            class="remove-item-btn" 
            data-index="${index}"
          >
            ✕
          </button>
        `;

        li
          .querySelector('.remove-item-btn')
          .addEventListener('click', () => {

            pastryOrder = pastryOrder.filter(
              (_, i) => i !== index
            );

            renderPastryOrder();
          });

        list.appendChild(li);
      });
    }


    // =========================
    // CALCULATE TOTAL
    // =========================

    const total = pastryOrder.reduce(
      (sum, item) =>
        sum + (item.price * item.quantity),
      0
    );

    document.getElementById(
      'pastryTotal'
    ).textContent = total;


    // =========================
    // PLACE ORDER BUTTON
    // =========================

    const placeBtn =
      document.getElementById(
        'pastryPlaceOrderBtn'
      );

    if (placeBtn) {

      placeBtn.disabled =
        pastryOrder.length === 0;
    }
  }


  // =========================
  // PLACE ORDER
  // =========================

  const pastryPlaceBtn =
    document.getElementById(
      'pastryPlaceOrderBtn'
    );

  if (pastryPlaceBtn) {

    pastryPlaceBtn.addEventListener(
      'click',
      (e) => {

        document.getElementById(
          'pastryConfirmationMsg'
        ).textContent =
          "✅ Order placed! Fresh from the oven.";

        createSparkles(
          e.clientX,
          e.clientY
        );

        pastryOrder = [];

        renderPastryOrder();


        setTimeout(() => {

          document.getElementById(
            'pastryConfirmationMsg'
          ).textContent = '';

        }, 3000);
      }
    );
  }


  // =========================
  // INITIAL RENDER
  // =========================

  renderPastryGrid();

  renderPastryOrder();
}



/* =====================================================
   MENU CATEGORY TABS
===================================================== */

const tabButtons = document.querySelectorAll(".tab-btn");


tabButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.tab;

        const targetSection = document.getElementById(targetId);


        /* Remove active from all tabs */

        tabButtons.forEach((btn) => {
            btn.classList.remove("active");
        });


        /* Activate clicked tab */

        button.classList.add("active");


        /* Scroll to section */

        if (targetSection) {

            const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight -
                35;


            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        }

    });

});



/* =====================================================
   CART
===================================================== */

let cart = JSON.parse(localStorage.getItem("coffeeHouseCart")) || [];




// =========================================================
// CONTACT FORM
// =========================================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();


        // Clear previous message
        formMessage.textContent = "";
        formMessage.className = "form-message";


        // Basic validation
        if (!name || !email || !subject || !message) {

            formMessage.textContent =
                "Please fill in all the fields.";

            formMessage.classList.add("error");

            return;
        }


        // Simple email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            formMessage.textContent =
                "Please enter a valid email address.";

            formMessage.classList.add("error");

            return;
        }


        // Success
        formMessage.textContent =
            "✓ Message received! We'll get back to you soon.";

        formMessage.classList.add("success");


        // Clear form
        contactForm.reset();

    });
}


// =========================================================
// MY ORDER COUNT
// =========================================================

const orderCount = document.getElementById("orderCount");

function updateOrderCount() {

    if (!orderCount) return;

    let order = [];

    try {

        order =
            JSON.parse(
                localStorage.getItem("coffeeHouseOrder")
            ) || [];

    } catch (error) {

        order = [];

    }


    // Count total quantity
    const totalItems = order.reduce(
        (total, item) => {

            return total + (Number(item.quantity) || 1);

        },
        0
    );


    orderCount.textContent = totalItems;
}


// Run when page loads
updateOrderCount();



