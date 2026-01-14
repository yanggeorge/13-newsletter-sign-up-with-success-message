const signupView = document.querySelector(".signup-view");
const submitSuccess = document.querySelector(".submit-success");
const dismissBtn = document.querySelector(".dismiss");
const formElement = document.querySelector("form");
const emailInput = document.querySelector(".email-input");

// 1. 【新增】状态标记：记录用户是否点击过提交按钮
let isSubmitted = false;

const validator = new JustValidate(formElement, {
  validateBeforeSubmitting: true,
  errorLabelStyle: {},
  // 让库始终处于 active 状态，这样 onValidate 才能在输入时持续触发
  validateOnInput: true,
});

// 2. 字段规则配置（不变）
validator.addField(
  ".email-input",
  [
    { rule: "required", errorMessage: "Valid email required" },
    { rule: "email", errorMessage: "Valid email required" },
  ],
  {
    errorsContainer: document.querySelector(".email.input-group .error-info"),
  }
);

// 【封装函数】统一处理 UI 显示逻辑
// 这样 onValidate 和 onFail 可以共用这套逻辑
function updateFieldUI(fields) {
  for (const selector in fields) {
    const fieldState = fields[selector];
    const inputElement = document.querySelector(selector);
    const group = inputElement.closest(".input-group");

    if (!group) continue;

    if (fieldState.isValid) {
      // A. 如果验证通过：永远移除错误样式 (无论是否提交过)
      group.classList.remove("error");
    } else {
      // B. 如果验证失败：只有在 "已提交过" 的情况下，才把错误显示出来
      if (isSubmitted) {
        group.classList.add("error");
      }
    }
  }
}

// 3. 实时验证钩子
validator.onValidate(({ fields }) => {
  // 当用户输入时，JustValidate 会不断触发这里
  // 我们调用通用函数，函数内部会根据 isSubmitted 决定是否显示红框
  updateFieldUI(fields);
});

// 4. 【新增】提交失败钩子
// 当用户点击提交按钮，且验证失败时触发
validator.onFail((fields) => {
  console.log("Submit failed, enabling real-time errors.");

  // 核心：用户点提交了，把开关打开！
  isSubmitted = true;

  // 立即执行一次 UI 更新，把此刻的错误显示出来
  updateFieldUI(fields);
});

// 5. 成功回调
validator.onSuccess((event) => {
  console.log("Validation passed!");
  const emailValue = emailInput.value;
  document.querySelector(".submit-success .email").textContent = emailValue;

  signupView.classList.add("hidden");
  submitSuccess.classList.remove("hidden");
});

// 6. Dismiss 逻辑
dismissBtn.addEventListener("click", () => {
  signupView.classList.remove("hidden");
  submitSuccess.classList.add("hidden");

  formElement.reset();
  validator.refresh();

  // 【核心】重置状态：回到“未提交”的初始状态
  isSubmitted = false;

  // 清理残留的 error class
  document
    .querySelectorAll(".input-group")
    .forEach((el) => el.classList.remove("error"));
});
