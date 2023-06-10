<template>
  <div class="routeTitle w1200">
    <n-breadcrumb>
      <n-breadcrumb-item> {{ routeParams.label }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.subject }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.btnTitle }}</n-breadcrumb-item>
    </n-breadcrumb>
  </div>
  <div class="startTest w1200">
    <div class="SpecialPractice">{{ Route.title }}</div>
    <div class="specialTitle">
      <template v-if="Route.btnIndex == 9 && Route.type == 1">
        <div class="titleList" v-for="(item, index) in chapterCarList" :key="index">
          <div class="item" @click="changeType(item)">{{ item.label }}</div>
        </div>
      </template>
      <template v-if="Route.btnIndex == 9 && Route.type == 2">
        <div class="titleList" v-for="(item, index) in chapterKecheList" :key="index">
          <div class="item" @click="changeType(item)">{{ item.label }}</div>
        </div>
      </template>
      <template v-if="Route.btnIndex == 9 && Route.type == 3">
        <div class="titleList" v-for="(item, index) in chapterHuocheList" :key="index">
          <div class="item" @click="changeType(item)">{{ item.label }}</div>
        </div>
      </template>
      <template v-if="Route.btnIndex == 8">
        <div class="titleList" v-for="(item, index) in classificationList" :key="index">
          <div class="item" @click="changeType(item)">{{ item.label }}</div>
        </div>
      </template>
      <template v-if="Route.btnIndex == 1">
        <div class="titleList" v-for="(item, index) in selectList" :key="index">
          <div class="item" @click="changeType(item)">{{ item.label }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  classificationList,
  chapterCarList,
  chapterKecheList,
  chapterHuocheList,
  selectList
} from "@/view/examination/config";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "@/store/global";
const routeParams: any = ref({});
const Route: any = ref({});
const router = useRouter();
const route = useRoute();

const globalStore = useGlobalStore();
const changeType = (item: { value: any }) => {
  router.push({
    name: "practice",
    query: {
      param: route?.query.param,
      type: item.value
    }
  });
};
onMounted(() => {
  routeParams.value = globalStore.nowTestData;
  Route.value = route.query;
});
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
}
</style>
