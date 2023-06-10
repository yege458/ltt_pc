<template>
  <div class="CarTypePanel w1200 flex-btw">
    <div class="carType">
      <div class="title">车型选择</div>
      <div class="typeList">
        <template v-for="(item, index) in typeList" :key="index">
          <div class="ls flex" :class="{ active: tabIdx == index }" @click="changeType(item, index)">
            <img :src="item.icon" alt="" style="height: 30px" />
            <span class="label">{{ item.label }}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="subject h100">
      <div class="tab flex-btw">
        <div class="item" :class="{ active: modeIdx == 1 }" @click="modeIdx = 1">
          {{ selectMod.label }}科目一(交规)
        </div>
        <div class="item" :class="{ active: modeIdx == 4 }" @click="modeIdx = 4">
          {{ selectMod.label }}科目四(安全文明驾驶)
        </div>
      </div>
      <div class="sort flex-btw">
        <div v-if="modeIdx == 1" class="ls" @click="goTest({ label: '精选练习', value: 1 })">精选练习</div>
        <div v-if="modeIdx == 1" class="ls" @click="goTest({ label: '定向练习', value: 2 })">定向练习</div>
      </div>
      <div class="tabContent flex-btw">
        <template v-if="modeIdx == 1" v-for="item in titleList1" :key="item.value">
          <div class="ls" @click="goTest(item)">{{ item.label }}</div>
        </template>
        <template v-if="modeIdx == 4" v-for="item in titleList4" :key="item.value">
          <div class="ls" @click="goTest(item)">{{ item.label }}</div>
        </template>
        <!-- <div class="ls" @click="goTest(5)">定向测试</div>
        <div class="ls" @click="goTest(6)">顺序练习</div>
        <div class="ls" @click="goTest(7)">模拟考试</div>
        <div class="ls" @click="goTest(8)">分类练习</div>
        <div class="ls" @click="goTest(9)">章节练习</div>
        <div class="ls" @click="goTest(12)">易错题</div>
        <div class="ls" @click="goTest(13)">错题本</div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { titleList1, titleList4 } from "./config";
import car from "@/assets/img/icon/xc.png";
import keche from "@/assets/img/icon/keche-default.png";
import huoche from "@/assets/img/icon/huoche-default.png";
import motuoche from "@/assets/img/icon/motuoche-default.png";

const tabIdx = ref(0);
const modeIdx = ref(1);
const typeList = ref([
  {
    label: "小车",
    icon: car,
    type: 1
  },
  {
    label: "客车",
    icon: keche,
    type: 2
  },
  {
    label: "货车",
    icon: huoche,
    type: 3
  },

  {
    label: "摩托车",
    icon: motuoche,
    type: 4
  },
  {
    label: '错题本',
    type: 5
  }
]);

const btnIndxItem = ["精选题型", "定向题型"];
const emit = defineEmits(["chooseTypeData"]);
const router = useRouter();
const selectMod: any = ref(typeList.value[0]);

const changeType = (item: any, index: number) => {
  if (item.type == 5) {
    emit("chooseTypeData", {
      subject: '错题本',
      btnTitle: '错题本',
      label: '错题本'
    });
    router.push({
      name: 'practice',
      query: {
        type: 'wrongBook',
      }
    })
  } else {
    selectMod.value = item;
    tabIdx.value = index;
  }

};

const goTest = (item: { value: number; label: any }) => {
  emit("chooseTypeData", {
    subjextIndx: modeIdx.value,
    subject: modeIdx.value == 1 ? "科目一" : "科目四",
    ...selectMod.value,
    btnIndx: item.value,
    // btnTitle: btnIndxItem[item.value - 1],
    btnTitle: item.label,
    title: item.label
  });
};
</script>
<style scoped lang="less">
.CarTypePanel {
  // height: 540px;
  background: #eff3f5;
}

.carType {
  width: 200px;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;

  .title {
    font-size: 24px;
    font-weight: 600;
    color: #101d37;
    line-height: 28px;
  }

  .ls {
    margin: 20px auto;
    border-radius: 14px;
    font-size: 20px;
    font-weight: 400;
    color: #101d37;
    padding: 15px 20px;
    box-sizing: border-box;
    cursor: pointer;

    .label {
      margin-left: 10px;
    }
  }

  .ls:hover {
    background: #f4f8fb;
  }

  .active {
    background: #f4f8fb;
  }
}

.subject {
  flex: 1;
  border-radius: 20px;

  background-color: #fff;
  margin-left: 20px;
  overflow: hidden;

  .tab {
    height: 60px;
    width: 100%;

    line-height: 60px;

    .item {
      width: 50%;
      text-align: center;
      font-size: 20px;
      background: #f4f8fb;
      cursor: pointer;
    }

    .active {
      color: #0f6aef;
      font-weight: 600;
      background: #fff;
    }
  }

  .errorBook {}

  .sort {
    padding: 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
    padding-bottom: 0;

    .ls {
      cursor: pointer;
      text-align: center;
      line-height: 100px;
      color: #fff;
      font-size: 30px;
      background-size: 100% 100%;
      height: 100px;
      width: 44%;
      background-color: rgb(16, 117, 212);
      border-radius: 20px;
    }

    // .ls:nth-of-type(1) {
    //   background: url(@/assets/img/jinxuan.png) no-repeat 0 0;
    // }
    // .ls:nth-of-type(2) {
    //   background: url(@/assets/img/dingxiang.png) no-repeat 0 0;
    // }
  }
}

.tabContent {
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;

  .ls {
    cursor: pointer;
    text-align: center;
    line-height: 90px;
    width: 31%;
    height: 90px;
    margin: 20px 0;
    color: #fff;
    font-size: 25px;
    border-radius: 20px;
    transition: all linear 0.3s;
    box-sizing: border-box;
  }

  .ls:nth-of-type(n) {
    // background: url(@/assets/img/jinxuan_test.png) no-repeat 0 0;
    background-color: rgb(174, 228, 49);
  }

  .ls:nth-of-type(2n) {
    // background: url(@/assets/img/moni_test.png) no-repeat 0 0;
    background-color: rgb(218, 100, 21);
  }
}

.tabContent:after {
  content: "";
  width: 31%;
  height: 90px;
}
</style>
