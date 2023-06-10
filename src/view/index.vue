<template>
  <div class="appHome">
    <sysHeader @update-font-size="updateFontSize"></sysHeader>
    <div class="tabPanel bg_white" v-if="show">
      <div class="w1200">
        <n-tabs v-model:value="tabName" animated @update:value="changeTab" @click="changeTab(tabName)">
          <n-tab name="home">首页</n-tab>
          <n-tab name="examination">模拟考试</n-tab>
          <!-- <n-tab name="examination">驾校</n-tab>
          <n-tab name="examination">教练</n-tab> -->
        </n-tabs>
      </div>
    </div>

    <div v-if="show" class="sysMainContent" :class="{ test_bg: tabName == 'examination' }">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import sysHeader from "@/components/header.vue";

import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowReactive,
  watch,
  nextTick
} from "vue";

import { useMessage } from "naive-ui";
import { useRoute, useRouter } from "vue-router";

window["$message"] = useMessage();
const show = ref(true);
const tabName = ref("home");
const router = useRouter();

const changeTab = (val: string) => {
  router.push("/index/" + val);
};
const updateFontSize = async () => {
  console.log('222')
  show.value = false;
  await nextTick();
  show.value = true;
};

onMounted(() => { });
</script>

<style lang="less">
.test_bg {
  background: #eff3f5 !important;
}

.appHome {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: #eff3f5 !important;
}

.sysMainContent {
  box-sizing: border-box;
  // flex: 1;
  // overflow: auto;
}

.n-tabs-tab__label {
  font-size: 20px;
  font-weight: bold;
}

.n-tabs-bar {
  height: 4px !important;
}

.tabPanel {
  padding: 10px 0;
}
</style>
