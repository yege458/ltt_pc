<template>
  <div class="routeTitle w1200">
    <n-breadcrumb>
      <n-breadcrumb-item> {{ routeParams.label }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.subject }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.btnTitle }}</n-breadcrumb-item>
    </n-breadcrumb>
  </div>
  <div class="startTest w1200">
    <div class="Chapter"> 章节列表</div>
    <div class="ChapterTitle">
      <div class="titleList" v-for="(item, index) in chapterCarList" :key="index" v-if="routeParams.type == 1">
        <div class="item" @click="changeType">{{ item.label }}</div>
      </div>
      <div class="titleList" v-for="(item, index) in chapterKecheList" :key="index" v-if="routeParams.type == 2">
        <div class="item" @click="changeType">{{ item.label }}</div>
      </div>
      <div class="titleList" v-for="(item, index) in chapterHuocheList" :key="index" v-if="routeParams.type == 3">
        <div class="item" @click="changeType">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGlobalStore } from "@/store/global";
import { chapterCarList, chapterKecheList, chapterHuocheList } from "@/view/examination/config";
const routeParams: any = ref({});
const globalStore = useGlobalStore();

onMounted(() => {
  routeParams.value = globalStore.nowTestData;
});
const changeType = () => { };
</script>
<style lang="less" scoped>
.routeTitle {
  padding: 0 20px;
  box-sizing: border-box;
}

.Chapter {
  font-size: 30px;
  font-weight: 700;
  margin: 20px 0;
}

.ChapterTitle {
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
}
</style>
