import http from "../http";

//获取图片接口
export const getImgUrl = (id: string) => {
  return new Promise((resolve, reject) => {
    http.get("/look?lid=LID" + id).then(({ data }) => {
      resolve(data);
    });
  });
};

//题库列表
export const getLibList = (params: any) => {
  return new Promise((resolve, reject) => {
    http.post("/select/lid/list", params).then(({ data }) => {
      resolve(data);
    });
  });
};
