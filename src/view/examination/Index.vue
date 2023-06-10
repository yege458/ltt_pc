<template>
  <div class="examination h100">
    <div class="w1200 flex-btw">
      <CarTypePanel @choose-type-data="chooseTypeData"></CarTypePanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import CarTypePanel from "./CarTypePanel.vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/store/global";
import { ca } from "date-fns/locale";
const globalStore = useGlobalStore();

const router = useRouter();
const chooseTypeData = (data: any) => {
  console.log(data);
  let name = "";
  let param = "";
  // if (data.btnIndx == 2 || (data.btnIndx == 1 && data.type == 4)) {
  //   name = "practice";
  // } else if (data.btnIndx == 3 || data.btnIndx == 4 || data.btnIndx == 6) {
  //   name = "startTest";
  // } else if (data.btnIndx == 5) {
  //   name = "practice";
  // } else if (data.btnIndx == 7 || data.btnIndx == 8 || data.btnIndx == 1) {
  //   name = "SpecialPractice";
  // }
  // } else if (data.btnIndx == 8) {
  //   name = "SpecialPractice";
  // } else if (data.btnIndx == 1) {
  //   // name = "SelectiveExcesize";
  //   name = "SpecialPractice";
  // }
  // if (data.btnIndx == 1 || data.btnIndx == 2) {
  //   name = "practice";
  // } else if (data.btnIndx >= 3) {
  //   name = "startTest";
  // }
  switch (data.btnIndx) {
    case 1:
      name = "SpecialPractice";
      param = data.type == 1 ? "1" : data.type == 2 ? "2" : data.type == 3 ? "3" : "";
      break;
    case 2:
      name = "practice";
      param = "4";
      break;
    case 3:
      name = "startTest";
      param = data.type == 1 ? "t1" : data.type == 2 ? "t2" : data.type == 3 ? "t3" : "";
      break;
    case 4:
      name = "startTest";
      param = "t4";
      break;
    case 5:
      name = "practice";
      param = "5";
      break;
    case 6:
      name = "startTest";
      param = "0000";
      break;
    case 7:
      name = "startTest";
      param = "1111";
      break;
    case 8:
      name = "SpecialPractice";
      param = "6";
      break;
    case 9:
      name = "SpecialPractice";
      param = data.type == 1 ? "7" : data.type == 2 ? "8" : data.type == 3 ? "9" : "";
      break;
    case 10:
      name = "practice";
      param = "10";
      break;
    case 11:
      name = "practice";
      param = "11";
      break;
  }
  globalStore.nowTestData = data;
  console.log(data.btnIndx)
  router.push({
    name: name,
    query: {
      param,
      title: data.title,
      btnIndex: data.btnIndx,
      type: data.type
    }
  });
};
</script>
<style scoped lang="less">
.examination {
  padding: 10px;
  box-sizing: border-box;
  background: #eff3f5;
}

.startTest {
  padding: 50px 0;
  padding-top: 20px;
  box-sizing: border-box;
  height: 100%;
  background-color: #fff;
}
</style>
