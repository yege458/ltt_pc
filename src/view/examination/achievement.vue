<template>
  <div class="achievement h100">
    <div class="w1200 bg">
      <div v-if="from == 'practice'" class="practice"> 练习完成 </div>
      <div v-else class="content">
        <div class="resultNum">
          <h1>{{ resultData.score }}分</h1>
          <h2 v-if="resultData.result == 1" class="val">合格</h2>
          <h2 v-if="resultData.result == 2" class="val">不合格</h2>
          <h2 v-if="resultData.result == 3" class="val">未完成</h2>
        </div>

        <div class="allNum flex">
          <div class="ls">
            <span class="val">{{ resultData.dright }}</span>
            <span class="label">答对</span>
          </div>
          <div class="ls">
            <span class="val" style="color: red">{{ resultData.wrong }}</span>
            <span class="label">答错</span>
          </div>

          <div class="ls">
            <span class="val">{{ resultData.dcount }}</span>
            <span class="label">考试次数</span>
          </div>

          <div class="ls">
            <span class="val">{{ resultData.accuracy }}%</span>
            <span class="label">正确率</span>
          </div>
          <div class="ls">
            <span class="val">{{ resultData.recuracy }}%</span>
            <span class="label">合格率</span>
          </div>
        </div>
      </div>
      <div class="errorBook">
        <div class="title">是否进入错题本</div>
        <div class="btn">
          <el-button type="primary" @click="goWrongQuestionBook">是</el-button>
          <el-button @click="goIndex">否</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/store/global";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const resultData: any = ref({});
const globalStore = useGlobalStore();
const router = useRouter()
const from: any = ref("");
onMounted(() => {
  let routerQuery = useRoute().query;
  from.value = routerQuery.from;
  resultData.value = globalStore.testResult;
});
const goWrongQuestionBook = () => {
  router.push({
    name: 'practice',
    query: {
      type: 'wrongBook'
    }
  })
}
const goIndex = () => {
  router.push('/')
}
</script>
<style scoped lang="less">
.practice {
  line-height: 300px;
  text-align: center;
  font-size: 26px;
  font-weight: bold;
}

.achievement {
  background: #eff3f5;
  margin-top: 20px;
  text-align: center;
}

.bg {
  border-radius: 20px;
  overflow: hidden;
  background: url(@/assets/img/bg-result-Nopass.png) no-repeat;
  height: 500px;
  width: 1200px;
  background-size: cover;
  // padding: 100px 20px;
  box-sizing: border-box;

  .allNum {
    text-align: center;
    justify-content: space-around;
    width: 50%;
    margin: 0 auto;
    margin-top: 40px;
    border: 1px solid #d3dfff;
    border-radius: 17px;
    padding: 20px 0;
    box-sizing: border-box;

    .ls {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-weight: 400;
      color: #0a2433;

      .val {
        font-weight: bold;
        font-size: 24px;
      }

      .label {
        font-size: 16px;
      }
    }
  }
}

.btn {}

button {
  height: 50px;
  width: 80px;
  margin: 20px 20px;
  background-color: rgb(38, 125, 196);
  border-radius: 18px;
}

.title {
  font-size: 20px;
}
</style>
