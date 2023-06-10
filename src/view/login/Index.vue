<template>
  <div class="view-account">
    <div class="view-account-container flex-btw">
      <div class="effect"></div>
      <div class="form-content">
        <n-tabs
          v-model:value="tabName"
          default-value="signin"
          size="large"
          justify-content="space-evenly"
          class="card-tabs"
          animated
          style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" tab="登录">
            <n-form ref="formRef" :model="formInline" :rules="rules">
              <n-form-item label="" path="accountnumber">
                <n-input
                  v-model:value="formInline.accountnumber"
                  class="ipt_h"
                  placeholder="账号"
                />
              </n-form-item>
              <n-form-item label="" path="password">
                <n-input
                  v-model:value="formInline.password"
                  class="ipt_h"
                  placeholder="密码"
                  type="password"
                />
              </n-form-item>

              <n-form-item label="">
                <n-button
                  type="primary"
                  block
                  color="#0f6aef"
                  class="btnStyle"
                  @click="handleSubmit"
                >
                  登录
                </n-button>
              </n-form-item>
            </n-form>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form
              ref="formRef"
              :model="formInline"
              :rules="rules2"
              label-placement="left"
              label-width="100"
            >
              <!-- <n-form-item label="账号" path="accountnumber">
                <n-input
                  v-model:value="formInline.accountnumber"
                  class="ipt_h"
                  placeholder="账号"
                />
              </n-form-item> -->
              <n-form-item label="姓名" path="username">
                <n-input v-model:value="formInline.username" class="ipt_h" placeholder="姓名" />
              </n-form-item>

              <n-form-item label="密码" path="password">
                <n-input
                  v-model:value="formInline.password"
                  class="ipt_h"
                  placeholder="密码"
                  type="password"
                />
              </n-form-item>

              <!-- <n-form-item label="角色" path="role">
                <n-select
                  v-model:value="formInline.role"
                  class="ipt_h"
                  :options="rolArr"
                  placeholder="角色"
                />
              </n-form-item> -->

              <n-form-item label="手机号" path="phone">
                <n-input v-model:value="formInline.phone" class="ipt_h" placeholder="手机号" />
              </n-form-item>
              <n-form-item label=" " path="checkCode">
                <n-input-group>
                  <n-input v-model:value="formInline.checkCode" class="ipt_h" />

                  <n-button class="ipt_h" type="primary" ghost @click="getCodeFN">
                    <div v-show="!codeOff"
                      ><n-countdown :duration="60000" :active="!codeOff" @finish="timefinish"
                    /></div>
                    <span v-show="codeOff">获取验证码</span>
                  </n-button>
                </n-input-group>
              </n-form-item>
              <n-form-item label="">
                <n-button
                  type="primary"
                  block
                  color="#0f6aef"
                  class="btnStyle"
                  @click="handleSubmit"
                >
                  注册
                </n-button>
              </n-form-item>
            </n-form>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from "vue";
  import { FormItemRule, FormRules, useMessage } from "naive-ui";
  import http from "@/service/http";
  import { useGlobalStore } from "@/store/global";
  import { useRouter, useRoute } from "vue-router";
  import { encrypt } from "@/utils/public";

  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);
  const globalStore = useGlobalStore();
  const router = useRouter();

  const formInline = reactive({
    accountnumber: "",
    password: "",
    username: "",
    phone: "",
    checkCode: "",
    role: "5"
  });
  const rolArr = ref([
    {
      label: "用户",
      value: "5"
    },
    {
      label: "驾校",
      value: "2"
    },
    {
      label: "教练",
      value: "3"
    }
  ]);
  const rules = ref({
    accountnumber: { required: true, message: "请输入用户名", trigger: "blur" },
    password: { required: true, message: "请输入密码", trigger: "blur" }
  });

  const rules2 = ref({
    // accountnumber: { required: true, message: "请输入用户名", trigger: "blur" },
    password: { required: true, message: "请输入密码", trigger: "blur" },
    username: { required: true, message: "请输入姓名", trigger: "blur" },
    phone: {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
      validator: (rule: FormItemRule, value: string) => {
        const phoneReg = /^1[34578]\d{9}$$/;
        if (!phoneReg.test(value)) {
          return new Error("电话号码格式错误");
        }
        return true;
      }
    }
  });

  const disabledSubmit = ref(true);
  const codeOff = ref(true);
  const tabName = ref("signin");

  const timefinish = () => {
    codeOff.value = true;
  };

  let route: any;

  onMounted(() => {
    route = useRoute();
  });

  const getCodeFN = () => {
    if (!formInline.phone) {
      message.error("请输入手机号");
      return;
    }
    if (formInline.phone) {
      const phoneReg = /^1[34578]\d{9}$$/;
      if (!phoneReg.test(formInline.phone)) {
        return;
      }
    }

    if (!codeOff.value) return;
    codeOff.value = false;
    http.get("/sms/send?phoneNum=" + formInline.phone);
  };

  //短信登录
  const checkoutCode = () => {
    http.post("/user/login/sms/", {
      phone: formInline.phone,
      checkCode: formInline.checkCode
    });
  };

  //账号登录
  const login = () => {
    message.loading("正在登录....");

    http
      .post("/user/login", {
        accountnumber: formInline.accountnumber,
        password: encrypt(formInline.password)
      })
      .then(({ data }) => {
        globalStore.$patch({
          userInfo: data || {},
          token: data["token"] || ""
        });

        sessionStorage.setItem("token", data?.token);
        sessionStorage.setItem("userInfo", JSON.stringify(data));
        message.destroyAll();

        router.push("/index/home");
      });
  };

  const register = () => {
    const targetRol = rolArr.value.find(item => item.value == formInline.role);
    http
      .post("/user/register", {
        ...formInline,
        accountnumber: formInline.phone,
        rolename: targetRol?.label
      })
      .then(res => {
        tabName.value = "signup";
        window["$message"].success("注册成功！");
      });
  };

  const handleSubmit = () => {
    formRef.value.validate(async (errors: any) => {
      if (!errors) {
        if (tabName.value == "signin") login();
        if (tabName.value == "signup") register();
      } else {
        message.error("请填写完整信息");
      }
    });
  };
</script>

<style lang="less" scoped>
  .card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
  }

  :deep(.n-form-item) {
    margin-bottom: 20px;
  }
  :deep(.n-tabs-tab__label) {
    text-align: center;
    cursor: pointer;
  }

  :deep(.n-tabs-tab--active) {
    .n-tabs-tab__label {
      font-size: 20px !important;
      font-weight: 700;
      color: #0f6aef;
    }
  }

  :deep(.n-tabs .n-tabs-bar) {
    background-color: #0f6aef;
    height: 4px;
  }

  :deep(.n-input .n-input__input-el) {
    height: 100% !important;
  }

  .effect {
    width: 50%;
    height: 100%;
    scale: 1.05;
    background: url(@/assets/img/login/left.png);
    background-size: 100% 100%;
  }
  .form-content {
    padding: 50px 80px;
    box-sizing: border-box;
    flex: 1;
  }

  .ipt_h {
    height: 40px;
  }

  .btnStyle {
    height: 50px;
    font-size: 20px;
  }

  .view-account {
    background: url("../../assets/img/login/login-bg.webp");
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      width: 1000px;
      height: 580px;
      background: #fff;
      box-shadow: 0 8px 32px 0 #b8d1f2;
      border-radius: 12px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -500px;
      margin-top: -290px;
      z-index: 999;
      flex: 1;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      // background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }

  :deep(.n-form-item-feedback-wrapper) {
    display: none;
  }
</style>
