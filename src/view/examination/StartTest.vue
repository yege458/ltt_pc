<template>
  <div class="routeTitle w1200">
    <n-breadcrumb>
      <n-breadcrumb-item> {{ routeParams.label }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.subject }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.btnTitle }}</n-breadcrumb-item>
    </n-breadcrumb>
  </div>
  <div class="startTest flex-btw w1200 h100">
    <div class="leftPanel">
      <div class="userInfo">
        <div class="ls">
          <span class="label">姓名：</span>
          <span class="val">{{ userInfo.username }}</span>
        </div>
        <div class="ls">
          <span class="label">考试类型：</span>
          <span class="val">{{ routeParams.label }}类</span>
        </div>
        <div class="ls">
          <span class="label">考试科目：</span>
          <span class="val">科目一</span>
        </div>
        <!-- <div class="ls">
          <span class="label">所属驾校：</span>
          <span class="val">永安驾校</span>
        </div> -->
      </div>

      <div class="time">
        <h3>倒计时：</h3>
        <n-countdown :duration="45 * 60 * 1000" :active="true" @finish="timeFinish" />
        <!-- <h2>45:01</h2> -->
      </div>
    </div>

    <div class="choosePanel">
      <div class="textContent">
        <div class="type flex-btw">
          <div>{{ targetIdx + 1 }}/{{ datalist.length }} {{ cartype[nowTopic.type] }}</div>
          <div>LID:{{ nowTopic.lid }}</div>
        </div>
        <div class="title" v-html="nowTopic.title"> </div>
        <div class="flex-btw">
          <div class="answerlist">
            <span :class="{ active: chooseAnswer.includes('A') }" @click="answerChoose('A', 0)">{{
              nowTopic.answer1
            }}</span>
            <span :class="{ active: chooseAnswer.includes('B') }" @click="answerChoose('B', 1)">{{
              nowTopic.answer2
            }}</span>
            <span :class="{ active: chooseAnswer.includes('C') }" @click="answerChoose('C', 2)">{{
              nowTopic.answer3
            }}</span>
            <span :class="{ active: chooseAnswer.includes('D') }" @click="answerChoose('D', 3)">{{
              nowTopic.answer4
            }}</span>
          </div>
          <div v-if="nowTopic.imgUrl" class="img">
            <img :src="nowTopic.imgUrl" alt="" style="width: 250px; height: 200px" />
          </div>
        </div>
      </div>
      <div class="bottom flex-btw">
        <div class="left flex">
          <span>请选择：</span>
          <n-space>
            <n-button v-if="nowTopic.answer1" :disabled="nowTopic.chooseResult"
              :type="chooseAnswer == 'A' ? 'info' : 'tertiary'" @click="answerChoose('A', 0)">A</n-button>
            <n-button v-if="nowTopic.answer2" :disabled="nowTopic.chooseResult"
              :type="chooseAnswer == 'B' ? 'info' : 'tertiary'" @click="answerChoose('B', 1)">B</n-button>
            <n-button v-if="nowTopic.answer3" :disabled="nowTopic.chooseResult"
              :type="chooseAnswer == 'C' ? 'info' : 'tertiary'" @click="answerChoose('C', 2)">C</n-button>
            <n-button v-if="nowTopic.answer4" :disabled="nowTopic.chooseResult"
              :type="chooseAnswer == 'D' ? 'info' : 'tertiary'" @click="answerChoose('D', 3)">D</n-button>
          </n-space>
        </div>
        <div class="right">
          <n-space>
            <n-button v-if="targetIdx > 0" type="tertiary" @click="go('last')">上一题</n-button>
            <n-button v-if="targetIdx < datalist.length - 1" @click="go('next')">下一题</n-button>
            <!-- <n-button v-if="targetIdx === datalist.length - 1" @click="submit">提交</n-button> -->
            <n-popconfirm v-if="userInfo.id" @positive-click="submit">
              <template #trigger>
                <n-button type="primary">交卷</n-button>
              </template>
              是否确认提交？
            </n-popconfirm>
          </n-space>
        </div>
      </div>
    </div>

    <div class="resultPanel">
      <template v-for="(item, index) in datalist" :key="index">
        <div class="ls" :class="{ active: targetIdx == index }" @click="clickBlock(index)">
          <div class="index">{{ index + 1 }}</div>
          <div class="value" :class="{ errorChoose: !item.isRight }">{{ item.chooseResult }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getImgUrl } from "@/service/api/public";
import http from "@/service/http";
import { useGlobalStore } from "@/store/global";
import { decrypt, heightLine } from "@/utils/public";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const globalStore = useGlobalStore();
const targetIdx = ref(0);
const cartype: any = ref({
  "1": "选择题",
  "2": "多选题",
  "3": "判断题"
});
const datalist: any = ref([]);
const userInfo: any = ref({});
const nowTopic: any = ref({}); //当前题目
const chooseAnswer = ref("-1");
const analysis: any = ref({}); //请求答案解析
/***
 * @parsms questiontype:1精选 2定向 3货车专项题
 * @parsms  @parsms:1-科目1  4-科目
 * @parsms cartype:1小车 2客车 3货车 4摩托车
 * @parsms type:目类型 1选择题 2多选题 3判断题
 *
 * ***/
//获取精选题目
// const getData = () => {
//   let params = {
//     cartype: routeParams.value.type,
//     questiontype: routeParams.value.btnIndx == 3 ? 1 : "",
//     subject: routeParams.value.subjextIndx,
//     pageNum: 1,
//     pageSize: 100
//   };
//   http.post("/question/list", params).then(async ({ data }) => {
//     // data.map((item: any) => {
//     //   item.title = heightLine(item.title, item["highlight"]);
//     //   return item;
//     // });
//     data[0]["imgUrl"] = await getImgUrl(data[0]["lid"]);
//     datalist.value = data;
//     nowTopic.value = (data as any)[targetIdx.value] || {};
//   });
// };

const getData = () => {
  const route = useRoute();
  let params = {
    type: route.query?.type ? route.query?.type + "" : "",
    param: route.query?.param + "",
    city: globalStore.city,
    pageNum: 1,
    pageSize: 100
  };
  http.post("/select/lid/list", params).then(async ({ data }: any) => {
      // data.map((item: any) => {
      //   item.title = heightLine(item.title, item["highlight"]);
      //   return item;
      // });
    // data.map((item: any) => {
    //   item.title = heightLine(item.title, item["highlight"]);
    //   return item;
    // });
    if (!datalist.value.length) {
      data[0]["imgUrl"] = await getImgUrl(data[0]["lid"]);
      nowTopic.value = (data as any)[targetIdx.value] || {};
    }

    datalist.value = data; // data;
  });
};

//获取答案
const getAnswer = () => {
  let params = {
    ...nowTopic.value,
    choosed: chooseAnswer.value
  };

  http.post("/question/reslve", params).then(({ data }) => {
    datalist.value[targetIdx.value] = {
      ...nowTopic.value,
      chooseResult: chooseAnswer.value, //选择结果
      isRight: decrypt((data as any).rightreslut) == chooseAnswer.value //正确结果
    };
    analysis.value[nowTopic.value.id] = { ...(data as any), choosed: chooseAnswer.value };
    nowTopic.value = datalist.value[targetIdx.value];

    if (targetIdx.value == datalist.value.length - 1) return;
    targetIdx.value += 1;
    chooseAnswer.value = "";
    getIndxData();
  });
};

const timeFinish = () => {
  submit();
};

//交卷
const router = useRouter();

const submit = () => {
  let params: any = [];
  const data = analysis.value;
  Object.keys(data).forEach(key => {
    params.push(data[key]);
  });
  http.post("/question/submit", params).then(({ data }) => {
    globalStore.testResult = data as any;
    router.push({
      name: "achievement"
    });
  });
};

//上一题下一题
const go = (type: string) => {
  if (type == "last") {
    targetIdx.value -= 1;
  } else {
    if (targetIdx.value == datalist.value.length) return;
    targetIdx.value += 1;
  }

  getIndxData();
};

//选择答案后请求结果
let moreChooseArr: any = [];
const answerChoose = (val: string, idx: number) => {
  if (nowTopic.value.type == 2) {
    moreChooseArr[idx] = val;
    let rightreslut = decrypt(nowTopic.value.rightreslut); //多选已经拿到答案了
    chooseAnswer.value += val;
    //没有答案，或者选择长度相同的时候再去请求
    if (!rightreslut || chooseAnswer.value.length == rightreslut.length) {
      chooseAnswer.value = moreChooseArr.join("");
      getAnswer();
      moreChooseArr = [];
    }
  } else {
    chooseAnswer.value = val;
    getAnswer();
  }
};

const clickBlock = (index: number) => {
  // let nowItem = datalist.value[index];
  // if (!nowItem.chooseResult) return;
  targetIdx.value = index;
  getIndxData();
};

//获取当前块的数据
const getIndxData = async () => {
  nowTopic.value = datalist.value[targetIdx.value];
  chooseAnswer.value = nowTopic.value.chooseResult || "";

  //获取图片
  if (!nowTopic.value["imgUrl"]) nowTopic.value["imgUrl"] = await getImgUrl(nowTopic.value.lid);
};

const routeParams: any = ref({});

onMounted(() => {
  userInfo.value = globalStore.userInfo;
  console.log(globalStore);
  routeParams.value = globalStore.nowTestData;

  const router = useRouter();
  getData();
  // //没有值 就是刷新了
  if (!globalStore.token) {
    router.push({
      name: "login"
    });
  }
});
</script>
<style lang="less" scoped>
.routeTitle {
  margin-bottom: 10px;
}

.startTest {
  min-height: 500px;
  max-height: 566px;
  padding: 10px;
  box-sizing: border-box;
  // height: 600px;
  background-color: #fff;
  border-radius: 20px;

  // height: calc(100% - 40px);
  .leftPanel {
    padding: 0 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .userInfo {
      flex: 1;
      border: 1px solid #eee;

      .label {
        display: inline-block;
        // width: 100px;
      }

      .ls {
        font-size: 16px;
        margin: 10px;
      }
    }

    .time {
      margin-top: 20px;
      text-align: center;
      border: 1px solid #eee;
    }
  }

  .choosePanel {
    flex: 1;
    display: inline-block;

    border: 1px solid #eee;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    font-size: 22px;
    letter-spacing: 2px;

    .textContent {
      .type {
        font-size: 14px;
        letter-spacing: 0px;
      }
    }
  }

  .resultPanel {
    width: 400px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: start;

    .ls {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 40px;
      height: 45px;
      color: #4a4a4a;
      font-size: 12px;
      border: 1px solid #eee;
      text-align: center;
      padding: 2px;
      box-sizing: border-box;
      cursor: pointer;
    }

    .value {
      font-size: 14px;
    }

    .active {
      background-color: #e6e6e6;
    }
  }
}

.answerlist {
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  span {
    display: inline-block;
    cursor: pointer;
  }

  span:hover {
    background-color: #f5f5f5;
  }

  .active {
    color: #00c356;
  }
}

.errorChoose {
  color: red;
}

.time {
  font-size: 20px;
}
</style>
