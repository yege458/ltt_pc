<template>
  <div class="routeTitle w1200">
    <n-breadcrumb>
      <n-breadcrumb-item> {{ routeParams.label }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.subject }}</n-breadcrumb-item>
      <n-breadcrumb-item> {{ routeParams.btnTitle }}</n-breadcrumb-item>
    </n-breadcrumb>
  </div>
  <div class="startTest flex-btw w1200">
    <div class="leftPanel flex">
      <div class="resultNum flex">
        <div class="ls">
          <span class="val">{{ rightNum }}</span>
          <span class="label">答对</span>
        </div>
        <div class="ls">
          <span class="val" style="color: red">{{ wrongNum }}</span>
          <span class="label">答错</span>
        </div>
      </div>

      <!-- <div class="resultPanel" @scroll="load">
        <template v-for="(item, index) in datalist" :key="index">
          <div
            class="ls"
            :class="{
              errorChoose: !item.isRight && item.chooseResult,
              right: item.isRight,
              active: targetIdx == index
            }"
            @click="clickBlock(index)"
          >
            <div class="index">{{ index + 1 }}</div>
          </div>
        </template>
      </div> -->
      <div class="resultPanel" @scroll="load">
        <template v-for="(item, index) in datalist" :key="index">
          <div class="ls" :class="{
            errorChoose: !item.isRight && item.chooseResult,
            right: item.isRight,
            active: targetIdx == index
          }" @click="clickBlock(index)">
            <div class="index">{{ index + 1 }}</div>
          </div>
        </template>
      </div>
    </div>

    <div class="choosePanel">
      <div class="textContent">
        <div>
          <div class="type flex-btw">
            <div>{{ targetIdx + 1 }}/{{ datalist.length }} {{ cartype[nowTopic.type] }}</div>
            <div style="color: #AEAEAE">LID:{{ nowTopic.lid }}</div>
          </div>
          <div class="title" v-html="nowTopic.title"> </div>
          <div class="flex-btw">
            <div class="answerlist">
              <span :class="{ active: chooseAnswer.includes('A'), noclick: nowTopic.chooseResult }" @click="answerChoose('A', 0)">{{
                nowTopic.answer1
              }}</span>
              <span :class="{ active: chooseAnswer.includes('B'), noclick: nowTopic.chooseResult }" @click="answerChoose('B', 1)">{{
                nowTopic.answer2
              }}</span>
              <span :class="{ active: chooseAnswer.includes('C'), noclick: nowTopic.chooseResult }" @click="answerChoose('C', 2)">{{
                nowTopic.answer3
              }}</span>
              <span :class="{ active: chooseAnswer.includes('D'), noclick: nowTopic.chooseResult }" @click="answerChoose('D', 3)">{{
                nowTopic.answer4
              }}</span>
            </div>
            <div v-if="nowTopic.imgUrl" class="img">
              <img :src="nowTopic.imgUrl" alt="" style="width: 250px; height: 200px" />
            </div>
          </div>
        </div>

        <div>
          <div v-if="!nowTopic.isRight && analysis[nowTopic.id]" class="analysis">
            <div class="line1 flex">
              <h2 style="color: red">回答错误</h2>
            </div>
            <div class="flex-center"><div class="mg_right_10">正确答案</div>
              <h2>{{ analysis[nowTopic.id] ? analysis[nowTopic.id].rightreslut : "" }}</h2>
            </div>
            <div class="line2">
              <h1>试题解析</h1>
              <p>{{ analysis[nowTopic.id] ? analysis[nowTopic.id].wronginfo : "" }}</p>
            </div>
          </div>

          <div v-if="nowTopic.isRight && analysis[nowTopic.id]" class="analysis">
            <h2 style="color: green">回答正确</h2>
          </div>
        </div>

        <div class="bottom flex-btw">
          <div class="left flex">
            <span>请选择：</span>
            <n-space>
              <n-button v-if="nowTopic.answer1" :disabled="nowTopic.chooseResult"
                :type="chooseAnswer.includes('A') ? 'info' : 'tertiary'" @click="answerChoose('A', 0)">A</n-button>
              <n-button v-if="nowTopic.answer2" :disabled="nowTopic.chooseResult"
                :type="chooseAnswer.includes('B') ? 'info' : 'tertiary'" @click="answerChoose('B', 1)">B</n-button>
              <n-button v-if="nowTopic.answer3" :disabled="nowTopic.chooseResult"
                :type="chooseAnswer.includes('C') ? 'info' : 'tertiary'" @click="answerChoose('C', 2)">C</n-button>
              <n-button v-if="nowTopic.answer4" :disabled="nowTopic.chooseResult"
                :type="chooseAnswer.includes('D') ? 'info' : 'tertiary'" @click="answerChoose('D', 3)">D</n-button>
            </n-space>
          </div>

          <div class="right">
            <n-space>
              <n-button v-if="targetIdx > 0" type="tertiary" @click="go('last')">上一题</n-button>
              <n-button v-if="targetIdx < datalist.length - 1" @click="go('next')">下一题</n-button>
              <n-button v-if="targetIdx === datalist.length - 1" @click="go('wrong')">交卷</n-button>
            </n-space>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getImgUrl } from "@/service/api/public";
import http from "@/service/http";
import { useGlobalStore } from "@/store/global";
import { debounce, decrypt, heightLine } from "@/utils/public";
import { onMounted, reactive, ref, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
const globalStore = useGlobalStore();
const targetIdx = ref(0);
const routeQuery = useRoute()
const cartype: any = ref({
  "1": "选择题",
  "2": "多选题",
  "3": "判断题"
});
const datalist: any = ref([]);
const userInfo: any = ref({});
const nowTopic: any = ref({}); //当前题目
const chooseAnswer = ref("");
const analysis: any = ref({}); //请求答案解析
const rightNum = ref(0);
const wrongNum = ref(0);
/***
 * @parsms questiontype:1精选 2定向 3货车专项题
 * @parsms  @parsms:1-科目1  4-科目
 * @parsms cartype:1小车 2客车 3货车 4摩托车
 * @parsms type:目类型 1选择题 2多选题 3判断题
 *
 * ***/
//获取精选题目
const pageNum = ref(1);
// const getData = () => {
//   let params = {
//     cartype: routeParams.value.type,
//     questiontype: routeParams.value.btnIndx,
//     subject: routeParams.value.subjextIndx,
//     pageNum: pageNum.value,
//     pageSize: 100
//   };
//   http.post("/question/list/choose", params).then(async ({ data }) => {
//     data.map((item: any) => {
//       item.title = heightLine(item.title, item["highlight"]);
//       return item;
//     });

//     if (!datalist.value.length) {
//       data[0]["imgUrl"] = await getImgUrl(data[0]["lid"]);
//       nowTopic.value = (data as any)[targetIdx.value] || {};
//     }

//     datalist.value = datalist.value.concat(data); // data;
//   });
// };
const getData = () => {
  if (routeQuery?.query?.type == 'wrongBook') {
    let params = {
      lid: '',
      pageNum: 1,
      pageSize: 100
    }
    http.post("/wrong/questions", params).then(async ({ data }: any) => {
      data?.records?.map((item: any) => {
        item.title = heightLine(item.title, JSON.parse(item["highlight"]));
        return item;
      });
      if (!datalist.value.length) {
        data.records[0]["imgUrl"] = await getImgUrl(data.records[0]["lid"]);
        nowTopic.value = (data.records as any)[targetIdx.value] || {};
      }
      datalist.value = [...datalist.value, ...data.records];

    })
  } else {
    let params = {
      type: routeQuery?.query?.type ? routeQuery.query?.type + "" : "",
      param: routeQuery?.query?.param + "",
      city: globalStore.city,
      pageNum: pageNum.value,
      pageSize: 100
    };
    http.post("/select/lid/list", params).then(async ({ data }: any) => {
      data?.records?.map((item: any) => {
        const arr = item["highlight"] ? JSON.parse(item["highlight"]) : []
        item.title = heightLine(item.title, arr);
        return item;
      });

      if (!datalist.value.length) {
        data.records[0]["imgUrl"] = await getImgUrl(data.records[0]["lid"]);
        nowTopic.value = (data.records as any)[targetIdx.value] || {};
      }

      datalist.value = [...datalist.value, ...data.records];
    });
  }
};

//获取答案
let resultLen = 0;
const router = useRouter();

const getAnswer = () => {
  let params = {
    ...nowTopic.value,
    choosed: chooseAnswer.value
  };

  http.post("/question/reslve", params).then(async ({ data }) => {
    resultLen += 1;
    const rightreslut = decrypt((data as any).rightreslut);
    let right = rightreslut == chooseAnswer.value;
    datalist.value[targetIdx.value] = {
      ...nowTopic.value,
      rightreslut: rightreslut,
      chooseResult: chooseAnswer.value, //选择结果
      isRight: right
    };

    //多选题
    if (nowTopic.value.type == 2 && chooseAnswer.value.length != rightreslut.length) {
      nowTopic.value = datalist.value[targetIdx.value];
      return;
    }

    right ? (rightNum.value += 1) : (wrongNum.value += 1);
    //答案分析
    analysis.value[nowTopic.value.id] = {
      ...(data as any),
      choosed: chooseAnswer.value,
      rightreslut: decrypt((data as any).rightreslut),
      isRight: right
    };

    nowTopic.value = datalist.value[targetIdx.value];
    if (resultLen == datalist.value.length) {
      //已经答题过的==实际题目,联系完成
      router.push({
        path: "/index/achievement",
        query: {
          from: "practice"
        }
      });
      return;
    }

    if (targetIdx.value == datalist.value.length - 1) return;

    if (!right) return; //答错了 不切换

    targetIdx.value += 1;
    chooseAnswer.value = "";

    //答案正确 延时跳转
    let timer = setTimeout(() => {
      clearTimeout(timer);
      getIndxData();
    }, 500);
  });
};

//上一题下一题
const go = (type: string) => {
  // if (!nowTopic.value.chooseResult) return;
  if(type === 'wrong') {
    router.push({
      path: "/index/achievement",
      query: {
        from: "practice"
      }
    });
  }
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
  let nowItem = datalist.value[index];
  // if (!nowItem.chooseResult) return;
  targetIdx.value = index;
  getIndxData();
};

//获取当前块的数据
const getIndxData = async () => {
  nowTopic.value = datalist.value[targetIdx.value];
  chooseAnswer.value = nowTopic.value.chooseResult || "";
  if (!nowTopic.value["imgUrl"]) nowTopic.value["imgUrl"] = await getImgUrl(nowTopic.value.lid);
};

const load = debounce((e: { srcElement: { scrollTop: number; }; }) => {
  if (e.srcElement.scrollTop > 500) {
    pageNum.value += 1;
    getData();
  }
}, 500);

const routeParams: any = ref({});
onMounted(() => {
  const route = useRoute();
  routeParams.value = globalStore.nowTestData;
  userInfo.value = globalStore.userInfo;

  //没有值 就是刷新了
  // if (!globalStore.token) {
  //   const router = useRouter();
  //   router.push({
  //     name: "login"
  //   });
  // }
  getData();
});
</script>
<style lang="less" scoped>
.routeTitle {
  padding: 0 20px;
  box-sizing: border-box;
}

.startTest {
  padding: 20px;
  box-sizing: border-box;
  // height: 600px;

  .leftPanel {
    min-height: 500px;
    max-height: 566px;
    justify-content: space-between;
    flex-direction: column;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 20px;
    background-color: #fff;
    margin-right: 10px;
    width: 300px;

    .resultNum {
      overflow: hidden;
      justify-content: space-around;
      text-align: center;
      height: 120px;
      padding: 20px 0;
      box-sizing: border-box;
      background: url(@/assets/img/detail-top-bg.png) no-repeat;
      background-size: contain;

      .ls {
        display: flex;
        flex-direction: column;
      }

      .label {
        font-size: 16px;
      }

      .val {
        font-size: 24px;
        font-weight: bold;
      }
    }

    .active {
      background-color: #e6e6e6;
    }
  }

  .choosePanel {
    background-color: #fff;
    border-radius: 20px;
    flex: 1;
    min-height: 480px;
    display: inline-block;
    margin: 0 10px;
    // height: 100%;
    // display: flex;
    // justify-content: space-between;
    // flex-direction: column;
    padding: 10px;
    box-sizing: border-box;

    .title,
    .answerlist {
      // font-size: 22px;
      letter-spacing: 2px;

      .active {
        color: #00c356;
      }

      .noclick {
        pointer-events:none;
      }
    }

    .textContent {
      min-height: 480px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .type {
        font-size: 16px;
        letter-spacing: 0px;
      }

      .bottom {
        margin-top: 100px;
      }
    }
  }

  .resultPanel {
    margin-top: 20px;
    width: 260px;
    flex: 1;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: start;

    .ls {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 40px;
      height: 40px;
      margin: 0 5px 10px 0;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 40px;
      border: 1px solid #e3e7e9;
      text-align: center;
      color: #0a2433;
      cursor: pointer;
      font-size: 12px;
      border: 1px solid #eee;
      text-align: center;
      padding: 2px;
      box-sizing: border-box;
      cursor: pointer;
    }

    .errorChoose {
      border-color: #ffe3e2 !important;
      background: #ffe3e2;
      color: #ff2b3c;
    }

    .right {
      border-color: #eafcf2 !important;
      background: #eafcf2;
      color: #00c356;
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
}

.analysis {
  background-color: #fff;
  margin-top: 30px;

  .line1 {
    .right {
      line-height: 30px;
      margin-left: 20px;

      >span {
        margin: 0 10px;
      }
    }
  }

  .line2 {
    margin-top: 20px;
  }
}
</style>
