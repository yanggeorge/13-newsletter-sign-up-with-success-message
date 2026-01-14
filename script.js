const signupView = document.querySelector(".signup-view");
const submitSuccess = document.querySelector(".submit-success");
const dismissBtn = document.querySelector(".dismiss");
const formElement = document.querySelector("form");
const emailInput = document.querySelector(".email-input");

const validator = new JustValidate(formElement, {
  validateBeforeSubmitting: true, // 提交时验证
  errorLabelStyle: {},
});

// 1. 定义字段规则
validator.addField(
  ".email-input",
  [
    { rule: "required", errorMessage: "Valid email required" },
    { rule: "email", errorMessage: "Valid email required" },
  ],
  {
    errorsContainer: document.querySelector(".email.input-group .error-info"), // 错误文字放哪里
  }
);

// 2. 【核心修正】使用 v4 的 onValidate 钩子实现 highlight 逻辑
validator.onValidate(({ fields }) => {
  // fields 是一个对象，包含了所有注册字段的状态
  // 结构如: { ".email-input": { isValid: false, ... } }
  console.log(fields);

  // 遍历所有字段
  for (const selector in fields) {
    const fieldState = fields[selector];
    const inputElement = document.querySelector(selector);

    // 找到父级 .input-group
    const group = inputElement.closest(".input-group");

    if (group) {
      if (!fieldState.isValid) {
        // 验证失败：加 error 类
        group.classList.add("error");
      } else {
        // 验证成功：移除 error 类
        group.classList.remove("error");
      }
    }
  }
});

// 3. 成功回调
validator.onSuccess((event) => {
  console.log("Validation passed!");
  const emailValue = emailInput.value;
  document.querySelector(".submit-success .email").textContent = emailValue;
  signupView.classList.add("hidden");
  submitSuccess.classList.remove("hidden");
});

// 4. Dismiss 逻辑
dismissBtn.addEventListener("click", () => {
  signupView.classList.remove("hidden");
  submitSuccess.classList.add("hidden");
  formElement.reset();
  validator.refresh();

  // 额外清理一下父级的 error 类（因为 validator.refresh() 不会触发 onValidate）
  document
    .querySelectorAll(".input-group")
    .forEach((el) => el.classList.remove("error"));
});
