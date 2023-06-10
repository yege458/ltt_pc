<template>
  <div class="result h100"> </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const isStart = ref(false);
  const chooseData = ref({});
  const chooseTypeData = (data: any) => {
    console.log(data, 88);
    isStart.value = true;
    chooseData.value = data;
  };
</script>
<style scoped lang="less">
  .result {
    height: 540px;
    padding: 20px;
    box-sizing: border-box;
    background: url(@/assets/img/bg-result-Nopass.png);
  }
</style>
