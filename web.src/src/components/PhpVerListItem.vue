<template>
  <a-card :title="item.title" size="small" style="width: 300px">
    <template #extra>
      <a-switch
        :checked="current"
        :disabled="!item.path"
        :title="!item.path ? '需先下载版本才能设置' : ''"
        size="small"
        style="margin-bottom: 5px"
        @click="$emit('changeStatus')"
      />
    </template>
    <p style="color: #787878; font-size: 12px">{{ item.code }}</p>
    <div v-if="down">
      <a-progress :percent="down.percent" :status="down.status" size="small" />
      <div style="color: #787878; font-size: 12px">{{ down.txt }}</div>
    </div>
    <template #actions>
      <a-button :disabled="!item.path" type="link" @click="openDir">
        <folder-open-outlined />
      </a-button>
      <a-button v-if="!item.path" type="link" @click="downVer">
        <cloud-download-outlined />
      </a-button>
      <a-button :disabled="current" type="link" @click="$emit('delItem')">
        <delete-outlined />
      </a-button>
    </template>
  </a-card>
</template>

<script setup>
import { defineProps, defineEmits, getCurrentInstance } from "vue";

let { proxy } = getCurrentInstance();
import {
  DeleteOutlined,
  FolderOpenOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons-vue";

const emit = defineEmits(["downVer"]);
//const props = defineProps(["item"]);
const props = defineProps({
  item: {},
  current: Boolean,
  down: {},
});

function downVer() {
  if (props.down) {
    proxy.$message.warning("已开始下载任务，请等待");
    return;
  }
  emit("downVer");
}

async function openDir() {
  if (props.item.path) {
    const res = await window.aardio.openDir(props.item.path);
    if (!res) {
      proxy.$message.warn("文件夹打开失败，请检查文件夹");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
::v-deep .ant-card-actions > li {
  margin: 5px 0;
}

::v-deep .ant-card-actions {
  background: unset;
}

.ant-card:hover {
  background: #f9f9f9;
}
</style>
