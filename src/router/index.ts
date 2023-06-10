import { useGlobalStore } from "@/store/global";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index/home"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/login/Index.vue")
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/view/index.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/view/home/Index.vue")
      },
      {
        path: "examination",
        name: "examination",
        component: () => import("@/view/examination/Index.vue")
      },
      {
        path: "startTest",
        name: "startTest",
        meta: {
          title: "开始考试"
        },
        component: () => import("@/view/examination/StartTest.vue")
      },
      {
        path: "practice",
        name: "practice",
        meta: {
          title: "练习"
        },
        component: () => import("@/view/examination/practice.vue")
      },
      {
        path: "achievement",
        name: "achievement",
        meta: {
          title: "成绩"
        },
        component: () => import("@/view/examination/achievement.vue")
      },
      {
        path: "SpecialPractice",
        name: "SpecialPractice",
        meta: {
          title: "专项"
        },
        component: () => import("@/view/examination/SpecialPractice.vue")
      },
      {
        path: "Chapter",
        name: "Chapter",
        meta: {
          title: "章节"
        },
        component: () => import("@/view/examination/Chapter.vue")
      },
      {
        path: "SelectiveExcesize",
        name: "SelectiveExcesize",
        meta: {
          title: "精选练习列表"
        },
        component: () => import("@/view/examination/SelectiveExcesize.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
  const globalStore = useGlobalStore();
  globalStore.$patch({
    token: userInfo.token || "",
    userInfo: userInfo
  });
  next();
});

router.beforeEach;

export default router;
