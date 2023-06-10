<template>
  <div class="homePage">
    <div class="bannel">
      <div class="mid w1200">
        <img src="@/assets/img/homeBanner.jpg" alt="" />
      </div>
    </div>
    <!-- <div class="blockls w1200">
      <div class="ls">
        <div class="title">
          <p class="main">2023驾照理论考试</p>
          <span>聚焦全新考点题库</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts"></script>
<style scoped lang="less">
.bannel {
  background-color: #489bff;

  .mid {
    height: 590px;

    img {
      // width: 100%;
      // height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      -webkit-background-size: cover;
      -o-background-size: cover;
      background-position: center 0;

    }
  }
}

.blockls {
  .main {
    font-size: 36px;
    font-weight: 600;
    color: #101d37;
    line-height: 50px;
  }

  .ls {
    margin-top: 20px;
  }
}
</style>
