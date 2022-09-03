const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const backProjectButtons = document.querySelectorAll(".back-project-button");
const projectModal = document.querySelector("#project-modal");
const closeModalButton = document.querySelector(".close-modal");
const backdrop = document.querySelector(".backdrop");
const selectButtons = document.querySelectorAll(".select-button");
const radioButtons = document.querySelectorAll(".radio-button");
const continueButtons = document.querySelectorAll(".continue");
const thankYouModal = document.querySelector("#thank-wrapper");
const closeThankYouCard = document.querySelector(".close-card");
const statistics = document.querySelector(".statistics");
const modalsSecondary = document.querySelectorAll(".secondary");
const bookmarkButtons = document.querySelectorAll(".bookmark");

const backdropHandler = () => {
  backdrop.classList.toggle("visible");
};

const backdropClickHandler = () => {
  closeModalHandler();
  menuHandler();
  backdropHandler();
};

const menuHandler = () => {
  menu.classList.toggle("active");
  hamburger.classList.toggle("transform");
  backdropHandler();
  backdrop.style.top = 70 + "px";
};

const openProjectModalHandler = () => {
  projectModal.style.top = window.pageYOffset + 120 + "px";
  projectModal.classList.add("visible");
  backdropHandler();
  backdrop.style.top = 0 + "px";
};

const closeModalHandler = () => {
  projectModal.classList.remove("visible");
  backdropHandler();
};

const openFormHandler = (e) => {
  const modalChildren = e.target.parentElement.parentElement.children;
  const modal = e.target.parentElement.parentElement;
  const form = modalChildren[modalChildren.length - 1];
  form.classList.toggle("visible");
  modal.classList.toggle("active");
};

const formValidation = (e) => {
  const userInput = parseInt(e.target.previousElementSibling.value);
  const minValue = parseInt(e.target.previousElementSibling.dataset.minValue);
  const modal = e.target.parentElement.parentElement;
  if (userInput >= minValue) {
    e.preventDefault();
    thankYouCardHandler();
    updateStatistics(userInput);
    updateItemsLeft(modal);
  } else {
    e.preventDefault();
    const pledgeChildren = e.target.parentElement.parentElement.children;
    const error = pledgeChildren[pledgeChildren.length - 1];
    error.classList.add("visible");
    error.textContent = `You have to pledge at least ${e.target.previousElementSibling.dataset.minValue}`;
  }
};

const thankYouCardHandler = () => {
  closeModalHandler();
  thankYouModal.classList.add("visible");
  thankYouModal.style.top = window.pageYOffset + 120 + "px";
  backdropHandler();
};

const closeThankYouCardHandler = () => {
  thankYouModal.classList.remove("visible");
  backdropHandler();
};

const updateItemsLeft = (modal) => {
  sessionStorage.getItem("items", currentItems);
  const items = modal.parentElement.children[2].children[0];
  const currentItems = parseInt(items.dataset.items) - 1;
  const [...itemsPrimary] = document.querySelectorAll(".primary");
  for (const itemPrimary of itemsPrimary) {
    if (
      itemPrimary.children[2].children[0].dataset.items === items.dataset.items
    ) {
      itemPrimary.children[2].children[0].innerHTML = `${currentItems} <span>left</span>`;
      itemPrimary.children[2].children[0].dataset.items--;
      if (currentItems <= 0) {
        itemPrimary.classList.add('stock-wrapper');
        itemPrimary.children[2].children[1].innerText = 'Out Of Stock';
      }
    } else {
      itemPrimary.children[2].children[0].innerHTML = `${itemPrimary.children[2].children[0].dataset.items} <span>left</span>`;
    }
  }
  items.dataset.items--;
  items.innerHTML = `${currentItems} <span>left</span>`;
  if (currentItems <= 0) {
    modal.parentElement.classList.add('stock-wrapper');
  }
  sessionStorage.setItem("items", currentItems);
};

const updateProgresBar = (currentAmount) => {
  const maxBackedAmount = 100000;
  const progresBar = document.querySelector(".progres-bar");
  const maxProgres = document.querySelector(".progres-bar-container");
  if (currentAmount >= maxBackedAmount) {
    progresBar.style.width = maxProgres.offsetWidth + "px";
  } else {
    progresBar.style.width =
      (currentAmount / 100000) * maxProgres.offsetWidth + "px";
  }
};

const updateStatistics = (userInput = 0) => {
  let previousAmount = parseInt(statistics.children[0].dataset.amount);
  let previousBackers = parseInt(statistics.children[1].dataset.backers);
  if (sessionStorage === null || sessionStorage.length === 0) {
    previousAmount = previousAmount;
    previousBackers = previousBackers;
  } else {
    previousAmount = parseInt(sessionStorage.getItem("amount"));
    previousBackers = parseInt(sessionStorage.getItem("backers"));
  }
  const currentAmount = parseInt(previousAmount + userInput);
  sessionStorage.setItem("amount", currentAmount);
  const currentBackers = previousBackers + 1;
  sessionStorage.setItem("backers", currentBackers);
  updateUI(currentAmount, currentBackers);
  updateProgresBar(currentAmount);
};

const updateUI = (currentAmount, currentBackers) => {
  removeStatistics(statistics);
  statistics.insertAdjacentHTML(
    "afterbegin",
    `<li class="statistics-item" > $ ${currentAmount.toLocaleString(
      "en-US"
    )} <span class="statistics-span">of $100,000 backed</span></li>
    <li class="statistics-item" > ${currentBackers.toLocaleString(
      "en-US"
    )}<span class="statistics-span">total backers</span> </li>
    <li class="statistics-item"> 56 <span class="statistics-span">days left</span></li>`
  );
};

const removeStatistics = (statistics) => {
  while (statistics.firstChild) {
    statistics.removeChild(statistics.firstChild);
  }
};

const bookmarkButtonHandler = () => {
  const bookmarkButtonSecondary = document.querySelector(
    "#bookmark-button-secondary"
  );

  bookmarkButtons.forEach((bookmarkButton) =>
    bookmarkButton.classList.toggle("active")
  );
  bookmarkButtonSecondary.classList.contains("active")
    ? (bookmarkButtonSecondary.innerHTML = `<div class="filter"></div>Bookmarked`)
    : (bookmarkButtonSecondary.innerHTML = `<div class="filter"></div>Bookmark`);
};

updateStatistics();
updateItemsLeft();

hamburger.addEventListener("click", menuHandler);
bookmarkButtons.forEach((bookmarkButton) =>
  bookmarkButton.addEventListener("click", bookmarkButtonHandler)
);
backProjectButtons.forEach((backProjectButton) =>
  backProjectButton.addEventListener("click", openProjectModalHandler)
);
closeModalButton.addEventListener("click", closeModalHandler);
backdrop.addEventListener("click", backdropClickHandler);
selectButtons.forEach((selectButton) =>
  selectButton.addEventListener("click", openFormHandler)
);
radioButtons.forEach((radioButton) =>
  radioButton.addEventListener("click", openFormHandler)
);

continueButtons.forEach((button) =>
  button.addEventListener("click", formValidation)
);

closeThankYouCard.addEventListener("click", closeThankYouCardHandler);
