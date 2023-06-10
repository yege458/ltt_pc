<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  zhCN,
  dateZhCN,
  NMessageProvider,
  NDialogProvider,
  GlobalThemeOverrides,
  useMessage
} from "naive-ui";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const themeOverrides: GlobalThemeOverrides = ref({
  common: {
    primaryColor: "#0f6aef"
  },
  Button: {
    textColor: "#0f6aef"
  }
});

onMounted(() => {
  let route = useRoute();
  const router = useRouter();
  if (!route.name) {
    router.push({
      name: "home"
    });
  }
});
</script>

<style lang="less">
html,
body {
  height: 100%;
  font-size: 1rem;
}

.n-config-provider {
  height: 100%;
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
