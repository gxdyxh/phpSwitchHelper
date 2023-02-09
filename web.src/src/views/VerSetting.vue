<template>
  <template v-if="!state.list.length">
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      "
    >
      <a-empty>
        <template #description>
          <p>
            请在添加
            <a-button type="link" @click="$emit('selectOnline')">列表</a-button>
            /
            <a-button type="link" @click="$emit('selectLocal')">本地</a-button>
            的php
          </p>
        </template>
      </a-empty>
    </div>
  </template>
  <template v-else>
    <template v-for="(item, i) in state.list" :key="i">
      <php-ver-list-item
        :current="!!item.current"
        :down="downState[item.code] || false"
        :item="item"
        style="margin-bottom: 5px"
        @changeStatus="setCurrent(item)"
        @delItem="delItem(item)"
        @downVer="downVer(item)"
      />
    </template>
  </template>
  {{ confList }}
</template>
<script setup>
import { reactive, getCurrentInstance, defineExpose, inject } from "vue";
import PhpVerListItem from "@/components/PhpVerListItem";

const saveConfData = inject("saveConfData");
const state = inject("confList");

let downState = reactive({});

window["setDownStart"] = (key, size) => {
  downState[key].size = size;
};
window["setDownPercent"] = (key, downSize, sizePs) => {
  let size = downState[key].size;
  downState[key].percent = parseInt((downSize / size) * 100);
  downState[key].txt = sizePs + "/s";
  //console.log(key, size, downSize, sizePs);
};
window["setDownEnd"] = (key, txt) => {
  downState[key].txt = txt;
};

window["setDownCompeted"] = (key, txt) => {
  downState[key].txt = txt;
  downState[key].percent = 100;
};
window["setDownErr"] = (key, txt) => {
  downState[key].txt = txt;
  downState[key].status = "exception";
};

window["setUzipCompeted"] = (key, path) => {
  downState[key].txt = "解压完成";
  setTimeout(function () {
    let on = state.list.filter((i) => {
      return i.code == key;
    });
    if (on) {
      on[0].path = decodeURIComponent(path);
      //window.aardio.saveData(JSON.stringify(state.list));
      saveConfData(state.list);
    }
    delete downState[key];
  }, 1200);
};

const setCurrent = (item) => {
  if (item.current) {
    return;
  }
  const current = state.list.filter((item) => {
    return !!item.current;
  });
  if (current.length) {
    current[0].current = 0;
  }
  item.current = 1;
  //window.aardio.saveData(JSON.stringify(state.list));
  saveConfData(state.list);
  window.aardio.setPathEnv(item.path);
};

const downVer = (item) => {
  downState[item.code] = {
    percent: 0,
    size: 0,
    status: "active",
    txt: "准备下载",
  };
  window.aardio.startDown(item.code, item.url);
};

function delItem(item) {
  state.list = state.list.filter((v) => v != item);
  saveConfData(state.list);
}

///defineExpose({ getConfList, setConfList });
</script>

<style scoped></style>
