<template>
  <div class="headerPage bg_white">
    <div class="flex w1200">
      <div class="log">
        <img src="@/assets/img/logo.png" alt="" style="width: 200px; height: 50px" />
      </div>
      <div class="header_line">
        <!-- <n-space vertical>
          <n-select
            style="width: 200px"
            v-model="fontSize"
            :on-change="changeFontSize"
            :options="options"
          />
        </n-space> -->
        <div class="font">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ fontLabel }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">小号</el-dropdown-item>
                <el-dropdown-item command="b">中号</el-dropdown-item>
                <el-dropdown-item command="c">大号</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="font">
          <el-dropdown trigger="click" popper-class="dropDownStyle" ref="dropDownRef">
            <span class="el-dropdown-link">
              {{ cityLabel }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <div class="hot_top">
                <div>
                  <el-row>
                    <el-col :span="4">
                      <div class="row_label">拼音首字母</div>
                    </el-col>
                    <el-col :span="18">
                      <div class="row_word">
                        <div class="word_item" v-for="item in words" :key="item.value" @click="handleClickWord(item)">{{
                          item.label }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <el-row>
                    <el-col :span="4">
                      <div class="row_label">热门城市</div>
                    </el-col>
                    <el-col :span="18">
                      <div class="row_hot_city">
                        <div class="city_item" v-for="item in hotCity" :key="item.value"
                          @click="handleClickHotCity(item)">{{
                            item.label }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div style="overflow: auto;height: 400px">
                <el-row v-for="item in city">
                  <el-col :span="4" style="display: flex;">
                    <div :id="item.word" class="row_label" style="margin-right: 8px ;">{{ item.word }}</div>
                    <div class="row_label">{{ item.label }}</div>
                  </el-col>
                  <el-col :span="18">
                    <div class="row_city">
                      <div class="city_item" v-for="i in item.children" :key="item.value" @click="handleClickCity(i)">{{
                        i.label }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>

            </template>
          </el-dropdown>
        </div>

        <!-- <el-cascader
          size="large"
          :options="regionData"
          v-model="selectedOptions"
          @change="handleChange"
        >
        </el-cascader> -->
      </div>
      <div class="topHand">
        <!-- <span class="adminInto" @click="goLogin('admin')">驾校后台登录</span> -->

        <template v-if="!token">
          <n-divider vertical />
          <span @click="goLogin('user')">登录</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ipdress } from "@/service/http";
import { useGlobalStore } from "@/store/global";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { regionData } from "element-china-area-data";
import { ArrowDown } from '@element-plus/icons-vue'
import { hotCity, city, words } from './config'
const globalStore = useGlobalStore();
const fontLabel = ref("小号");
const cityLabel = ref("全国");
const dropDownRef = ref()
defineProps<{ msg: string }>();
const router = useRouter();

const goLogin = (type: string) => {
  if (type == "admin") {
    window.open(ipdress + "/admin");
    return;
  }
  router.push("/login?type=" + type);
};
const emit = defineEmits(["updateFontSize"]);
const token = ref();
watch(
  () => globalStore.token,
  val => {
    token.value = val;
  },
  { deep: true, immediate: true }
);
const changeFontSize = (val: string) => {
  document.documentElement.style.fontSize = val + "px";
  emit("updateFontSize");
};
// const handleChange = (value: any) => {
//   globalStore.city = value.reduce((prev: any, next: any) => {
//     return prev + next;
//   }, "");
// };
const handleCommand = (command: string | number | object) => {
  const fontSize = command == 'a' ? '22px' : command == 'b' ? '26px' : '30px'
  fontLabel.value = command == 'a' ? '小号' : command == 'b' ? '中号' : '大号'
  document.documentElement.style.fontSize = fontSize;
  emit("updateFontSize");
}
const handleClickHotCity = (i: any) => {
  cityLabel.value = i.label
  globalStore.city = i.value
  emit("updateFontSize");
  dropDownRef.value.handleClose()

}
const handleClickCity = (i: any) => {
  cityLabel.value = i.label
  globalStore.city = i.value
  emit("updateFontSize");
  dropDownRef.value.handleClose()
}
// type item = {
//   label: string,
//   value: string,
//   children: Array<any>,
//   word: string
// }
const handleClickWord = (item: any) => {
  // document.querySelector(`#A`).scrollIntoView(true)
  const element = document.querySelector(`#${item.value}`)
  element?.scrollIntoView(false)
}
</script>

<style scoped lang="less">
:global(.dropDownStyle .el-scrollbar .el-scrollbar__view) {
  width: 540px !important;
  // height: 330px;
  padding: 20px;
}

:global(.el-scrollbar__wrap) {
  overflow: hidden;
}

.el-row {
  width: 100%;
  margin-bottom: 10px;

  .row_label {
    font-size: 12px;
    font-weight: 400;
    color: rgba(152, 157, 163, 0.69);
    line-height: 20px;
  }

  .row_city {
    display: flex;
    flex-wrap: wrap;

    div {
      // width: 30px;
      color: #333;
      font-size: 12px;
      margin-right: 16px;
      cursor: pointer;
    }

    .city_item:hover {
      color: greenyellow;
    }
  }

  .row_hot_city {
    display: flex;

    div {
      width: 35px;
      color: #333;
      font-size: 12px;
      margin-right: 16px;
      cursor: pointer;
    }

    .city_item:hover {
      color: greenyellow;
    }
  }

  .row_word {
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    float: left;
    width: 429px;
    height: 23px;
    padding: 0 10px;
    background: #F6F9FF;
    border-radius: 15px;

    .word_item {
      cursor: pointer;
    }
  }

}

// .hot_top {
//   position: fixed;
//   top: 70px;
//   left: 410px;

// }

.headerPage {
  padding: 20px 0;
  background-color: #fff;
}

.topHand {
  padding: 10px 0;
  box-sizing: border-box;
  font-size: 16px;

  span {
    cursor: pointer;
  }
}

.adminInto {
  display: inline-block;
}

:deep(.n-tab-pane) {
  display: none !important;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.header_line {
  height: 50px;
  display: flex;
  align-items: center;

  .font {
    width: 80px;
    height: 30px;
    background: #F6F9FF;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 400;
    color: #17232F;
    line-height: 30px;
    padding-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
