import { JM_KEY } from "@/config/config";
import CryptoJS from "crypto-js";
import { ru } from "element-plus/es/locale";

//加密
export const encrypt = (word: any) => {
  const key = CryptoJS.enc.Utf8.parse(JM_KEY);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

//解密方法
export const decrypt = (word: any) => {
  const key = CryptoJS.enc.Utf8.parse(JM_KEY);
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

//文字高亮
export const heightLine = (str: string, rule?: Array<any>) => {
  if (!str || !rule) return str;
  console.log(rule)
  const newRult = rule;
  const heightArr: any = [];
  rule?.forEach((item: any[]) => {
    if (item.length === 0) return;
    const text = str.slice(item[0], item[1]);
    heightArr.push({
      sIdx: item[0],
      len: item[1],
      text: text,
      newText: `<span style="color:red;font-size:26px;font-weight:bold">${text}</span>`
    });
  });

  heightArr.forEach((item: any) => {
    str = str.replace(item["text"], item["newText"]);
  });

  return str;
};

export const debounce = function (func, wait = 500, immediate = false) {
  let timeout = null;
  return function () {
    const context = this;
    const args = [...arguments];
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
};
