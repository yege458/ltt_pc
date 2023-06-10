import Vue from "vue";
declare module "*vue" {
  import { ComponentOptions } from "vue";
  const ComponentOptions: ComponentOptions;
  export default ComponentOptions;
}

interface window {
  $message: any;
  [key: string]: any;
}
