<template>
  <div class="about" style="height: 100%">
    <div
      v-if="!loaded"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      "
    >
      <a-spin tip="列表加载中..." />
    </div>
    <div v-else style="height: 100%">
      <div>
        <a-form :label-col="labelCol" :model="search" :wrapper-col="wrapperCol">
          <a-form-item label="版本:">
            <a-input v-model:value="search.key" />
          </a-form-item>
          <a-form-item label="线程:">
            <a-radio-group v-model:value="search.nts" size="small">
              <a-radio value="2">NTS</a-radio>
              <a-radio value="1">NT</a-radio>
              <a-radio value="3">ALL</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="位数:">
            <a-radio-group v-model:value="search.bit" size="small">
              <a-radio value="64">X64</a-radio>
              <a-radio value="86">X86</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <div style="height: calc(100% - 120px); overflow-y: auto">
        <div v-for="(item, key) in show_list" :key="key" class="ver-item">
          <div>
            {{ key }}
          </div>
          <div>
            <a-button
              :disabled="item.added"
              type="link"
              @click="$emit('addLine', item)"
            >
              <plus-square-outlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script name="VerList" setup>
import { reactive, ref, computed, defineProps } from "vue";
import { PlusSquareOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  keys: [],
});

let search = reactive({ key: "", nts: "2", bit: "64" });
let loaded = ref(false);

const labelCol = { style: { width: "40px" } };
const wrapperCol = { style: { width: "250px" } };

const onLineVers = {};

async function getVerLists() {
  const list = await window.aardio.getVerList();
  onLineVers.vaule = JSON.parse(list);
  loaded.value = true;
}

// async function getVerLists() {
//   const list = await window.aardio.getVerList();
//   const dataMap = JSON.parse(list);
//
//   const keys = confList.map((v) => {
//     return v.code || "";
//   });
//   for (const listKey in JSON.parse(list)) {
//     ver_list[listKey] = {
//       code: listKey,
//       url: dataMap[listKey],
//       added: keys.indexOf(listKey) > -1,
//     };
//   }
//   loaded.value = true;
// }

const show_list = computed(() => {
  let map = {};
  console.log(props.keys);
  for (const mapKey in onLineVers.vaule) {
    let k1 = true;
    let k2 = true;
    let k3 = true;
    if (search.key.trim() != "") {
      k1 = mapKey.indexOf(search.key) > -1;
    }
    if (search.nts == "1") {
      k2 = mapKey.indexOf("-nts") == -1;
    } else if (search.nts == 2) {
      k2 = mapKey.indexOf("-nts") > 0;
    }
    if (search.bit == "64") {
      k3 = mapKey.indexOf("-x64") > -1;
    } else {
      k3 = mapKey.indexOf("-x86") > -1;
    }
    if (k1 && k2 && k3) {
      map[mapKey] = {
        code: mapKey,
        url: onLineVers.vaule[mapKey],
        added: props.keys ? props.keys.indexOf(mapKey) > -1 : true,
      };
    }
  }
  return map;
});

getVerLists();
</script>
<style>
.ver-item {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 0 5px;
  align-items: center;
}

.ver-item:hover {
  background: #eaeaea;
}

.ant-form .ant-form-item {
  margin-bottom: 0;
}

.ant-form .ant-form-item .ant-form-item-label,
.ant-form .ant-form-item .ant-form-item-control {
  flex: unset !important;
  max-width: unset !important;
}
</style>
