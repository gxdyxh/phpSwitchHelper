<template>
  <div class="card-container">
    <a-tabs v-model:activeKey="activeKey" type="card">
      <template #rightExtra>
        <a-button type="link" @click="selectLocalPhp">
          <template #icon>
            <plus-circle-outlined />
          </template>
          本地
        </a-button>
      </template>
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <setting-outlined />
            设置
          </span>
        </template>
        <div style="height: 100%; overflow-y: auto">
          <ver-setting
            @selectLocal="selectLocalPhp"
            @selectOnline="setOnline"
          />
        </div>
      </a-tab-pane>

      <a-tab-pane key="2" forceRender="true">
        <template #tab>
          <span>
            <UnorderedListOutlined />
            列表
          </span>
        </template>
        <div style="height: 100%; overflow-y: auto">
          <ver-list :keys="confKeys" @addLine="addOnLine" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div
    style="
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #787878;
      display: flex;
      justify-content: space-between;
      padding: 3px 10px 0;
    "
  >
    <div>
      <a href="https://github.com/gxdyxh/phpSwitchHelper" target="_blank"
        >使用说明</a
      >
    </div>
    <div>PHP Switch by gqz</div>
  </div>
  <a-modal v-model:visible="actmodel" centered title="添加PHP" @ok="onCheck">
    <a-form ref="formRef" :model="editPhp">
      <a-form-item
        :rules="[{ required: true, message: '请填写版本描述!' }]"
        name="title"
      >
        <a-input v-model:value="editPhp.title" placeholder="版本描述" />
      </a-form-item>
    </a-form>
    <div
      v-if="editPhp.path"
      style="margin-top: 5px; color: #8a8a8a; font-size: 12px"
    >
      {{ editPhp.path }}
    </div>
  </a-modal>
</template>
<script setup>
import { reactive, ref, computed, provide } from "vue";

import {
  SettingOutlined,
  UnorderedListOutlined,
  FolderAddOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { trim } from "lodash-es";
import VerList from "@/views/VerList";
import VerSetting from "@/views/VerSetting";

const formRef = ref(null);
const activeKey = ref("1");
let actmodel = ref(false);

let editPhp = reactive({});

let confList = reactive({ list: [] });

async function getConfList() {
  const list = await window.aardio.getConfList();
  if (list) {
    confList.list = JSON.parse(list);
  }
}

getConfList();

const confKeys = computed(() => {
  return confList.list.map((v) => {
    return v.code || "";
  });
});

const onCheck = async () => {
  try {
    const values = await formRef.value.validateFields();
    confList.list.push(JSON.parse(JSON.stringify(editPhp)));
    saveConfData(confList.list);
    actmodel.value = false;
    formRef.value.resetFields();
  } catch (errorInfo) {
    console.log("Failed:", errorInfo);
  }
};

function setOnline() {
  activeKey.value = "2";
}

async function selectLocalPhp() {
  let res = await window.aardio.localPhp();
  console.log(res);
  if (res) {
    let path = trim(res[0], "%5C");
    const code = path.split("%5C").pop();
    path = decodeURIComponent(path);
    addOnLine({
      title: "php-" + res[1],
      code,
      path,
      url: "",
    });
  }
}

function addOnLine(item) {
  actmodel.value = true;
  editPhp = {
    title: item.title || item.code,
    code: item.code,
    path: item.path || "",
    current: 0,
    url: item.url,
  };
}

function saveConfData(data) {
  window.aardio.saveData(JSON.stringify(data));
}

provide("saveConfData", saveConfData);
provide("confList", confList);
</script>
<style>
.card-container {
  height: calc(100% - 20px);
}

.card-container > .ant-tabs {
  height: 100%;
}

.card-container p {
  margin: 0;
}

.card-container > .ant-tabs-card .ant-tabs-content {
  height: 100%;
}

.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 12px 5px;
  background: #fff;
  overflow-y: auto;
}

.card-container > .ant-tabs-card > .ant-tabs-nav {
  margin-bottom: 0;
}

.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}

.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme="compact"] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme="compact"] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}

#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}

[data-theme="compact"] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}

[data-theme="dark"] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

[data-theme="dark"] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}

[data-theme="dark"]
  .card-container
  > .ant-tabs-card
  .ant-tabs-content
  > .ant-tabs-tabpane {
  background: #141414;
}

[data-theme="dark"] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}
</style>
