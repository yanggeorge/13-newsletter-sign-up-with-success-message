// script.js
const signupView = document.querySelector(".signup-view");
const submitSuccess = document.querySelector(".submit-success");
const submitBtn = document.querySelector(".submit");
const dismissBtn = document.querySelector(".dismiss");

submitBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  // 以防form表单触发自动刷新页面。
  e.preventDefault();
  console.log("submit click");
  signupView.classList.toggle("hidden");
  submitSuccess.classList.toggle("hidden");
});

dismissBtn.addEventListener("click", (e) => {
  console.log("dismiss click");
  e.stopPropagation();
  signupView.classList.toggle("hidden");
  submitSuccess.classList.toggle("hidden");
});
