// category section
// fetch categories
const loadCategories = async () => {
  try {
    const url = "https://openapi.programming-hero.com/api/categories";
    const res = await fetch(url);
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.log(error);
  }
};
// display category names
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categoriesContainer");
  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline w-full";
    btn.textContent = category.category_name;
    btn.onclick = () => selectCategory(category.id, btn);
    categoriesContainer.append(btn);
  });
};

const selectCategory = async (id, btn) => {
  showLoading();
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesBtn",
  );
  allButtons.forEach((button) => {
    button.classList.remove("btn-success");
    button.classList.add("btn-outline");
  });
  btn.classList.add("btn-success");
  btn.classList.remove("btn-outline");

  const res = await fetch(
    `https://openapi.programming-hero.com/api/category/${id}`,
  );
  const data = await res.json();
  displayTrees(data.plants);
  hideLoading();
};

loadCategories();

// all trees button
const allTreesBtn = document.getElementById("allTreesBtn");
allTreesBtn.addEventListener("click", async () => {
  showLoading();
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesBtn",
  );
  allButtons.forEach((button) => {
    button.classList.remove("btn-success");
    button.classList.add("btn-outline");
  });
  allTreesBtn.classList.add("btn-success");
  allTreesBtn.classList.remove("btn-outline");

  loadTrees();
  hideLoading();
});

// trees section
// loading spinner
const showLoading = () => {
  document.getElementById("loadingSpinner").classList.remove("hidden");
  document.getElementById("treesContainer").innerHTML = "";
};
const hideLoading = () => {
  document.getElementById("loadingSpinner").classList.add("hidden");
};

// fetch trees
const loadTrees = async () => {
  try {
    showLoading();
    const url = "https://openapi.programming-hero.com/api/plants";
    const res = await fetch(url);
    const data = await res.json();
    hideLoading();
    displayTrees(data.plants);
  } catch (error) {
    console.log(error);
  }
};
// display trees
const displayTrees = (trees) => {
  const treesContainer = document.getElementById("treesContainer");
  treesContainer.innerHTML = "";

  trees.forEach((tree) => {
    const treeCard = document.createElement("div");
    treeCard.innerHTML = `
                <div class="card bg-base-100 shadow-xl border-b-4 ${tree.price > 500 ? "border-red-700" : "border-[#15803D]"}">
                <figure>
                  <img onclick="openTreeModal(${tree.id})" class="h-48 w-full object-cover cursor-pointer"
                    src=${tree.image}
                    alt=${tree.name}
                    title=${tree.name}
                  />
                </figure>
                <div class="card-body text-left space-y-4">
                  <h2 onclick="openTreeModal(${tree.id})" class="card-title cursor-pointer hover:text-success">${tree.name}</h2>
                  <p class=" line-clamp-2">
                    ${tree.description}
                  </p>
                  <div class="flex justify-between items-center">
                    <div class="badge badge-success bg-[#DCFCE7] rounded-3xl font-semibold text-success">${tree.category}</div>
                    <h2 class="font-medium text-lg ${tree.price > 500 ? "text-red-700" : "text-black"} ">$${tree.price}</h2>
                  </div>
                  <div class="card-actions">
                    
                    <button onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})" class="btn btn-success bg-[#15803D] text-white shadow-none font-bold w-full rounded-3xl hover:bg-[#15803cc9]">Add to Cart</button>
                  </div>
                </div>
              </div>
        `;
    treesContainer.appendChild(treeCard);
  });
};
loadTrees();

// tree modal
const treeDetailsModal = document.getElementById("treeDetailsModal");
const openTreeModal = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`,
  );
  const data = await res.json();
  const plantDetails = data.plants;

  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalCategory = document.getElementById("modalCategory");
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");

  modalTitle.textContent = plantDetails.name;
  modalImage.src = plantDetails.image;
  modalCategory.textContent = plantDetails.category;
  modalDescription.textContent = plantDetails.description;
  modalPrice.textContent = plantDetails.price;
  treeDetailsModal.showModal();
};

// add to cart
let cart = [];
const addToCart = (id, name, price) => {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1,
    });
  }

  updateCart();
};

const updateCart = () => {
  const cartContainer = document.getElementById("cartContainer");
  const totalPrice = document.getElementById("totalPrice");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden");
    totalPrice.textContent = `$${0}`;
    return;
  }

  emptyCartMessage.classList.add("hidden");
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.innerHTML = `
                <div class="card card-body shadow-sm bg-green-50">
                  <div class="flex justify-between items-center">
                    <div class="text-left">
                      <h2>${item.name}</h2>
                      <p>$${item.price} x ${item.quantity}</p>
                    </div>
                  <button class="btn btn-ghost" onclick="removeFromCart(${item.id})">❌</button>
                  </div>
                  <p class="text-right font-semibold text-xl">$${item.price * item.quantity}</p>
                </div>
    `;
    cartContainer.append(cartItem);
  });

  totalPrice.innerText = `$${total}`;
};

const removeFromCart = (id) => {
  const updateCartElement = cart.filter((item) => item.id != id);
  cart = updateCartElement;
  updateCart();
};

// empty cart message
const emptyCartMessage = document.getElementById("emptyCartMessage");
