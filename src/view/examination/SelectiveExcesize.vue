<template>
  <div class="routeTitle w1200">
    <n-breadcrumb>
      <n-breadcrumb-item> {{ routeParams.label }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.subject }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.btnTitle }}</n-breadcrumb-item>
    </n-breadcrumb>
  </div>
  <div class="startTest w1200">
    <div class="SpecialPractice"> 精选练习列表</div>
    <div class="specialTitle">
      <div class="titleList" v-for="(item, index) in selectList" :key="index">
        <div class="item" @click="() => changeType(item)">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//   import { ref } from "vue";
import { selectList } from "@/view/examination/config";
import { onMounted, ref } from "vue";
import { useGlobalStore } from "@/store/global";
import { useRouter } from "vue-router";
const routeParams: any = ref({});
const router = useRouter();
const globalStore = useGlobalStore();

onMounted(() => {
  routeParams.value = globalStore.nowTestData;
});
const changeType = (item: any) => {
  router.push({
    name: "practice",
    query: {
      type: item.value,
      param: routeParams.value.type
    }
  });
};
</script>
<style lang="less" scoped>
.routeTitle {
  padding: 0 20px;
  box-sizing: border-box;
}

.SpecialPractice {
  font-size: 30px;
  font-weight: 700;
  margin: 20px 0;
}

.specialTitle {
  display: flex;
  flex-wrap: wrap;

  .titleList {
    width: 23%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 18px;
    background-color: #fff;
    margin-bottom: 30px;
    border-radius: 20px;
    margin-right: 20px;
  }
}</style>
