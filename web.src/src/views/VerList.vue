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
            <a-radio-group v-model:value="search.nts">
              <a-radio value="1">NT</a-radio>
              <a-radio value="2">NTS</a-radio>
              <a-radio value="3">ALL</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <div style="height: calc(100% - 82px); overflow-y: auto">
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
import { reactive, ref, computed, defineProps, defineExpose, watch } from "vue";
import { PlusSquareOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  keys: [],
});

let search = reactive({ key: "", nts: "2" });
let loaded = ref(false);

const labelCol = { style: { width: "40px" } };
const wrapperCol = { style: { width: "250px" } };

let onLineVers = reactive({});

async function getVerLists() {
  console.log(props.keys);
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
  for (const mapKey in onLineVers.vaule) {
    let k1 = true;
    let k2 = true;
    if (search.key) {
      k1 = mapKey.indexOf(search.key) > -1;
    }
    if (search.nts == 1) {
      k2 = mapKey.indexOf("-nts") == -1;
    } else if (search.nts == 2) {
      k2 = mapKey.indexOf("-nts") > 0;
    }
    if (k1 && k2) {
      map[mapKey] = {
        code: mapKey,
        url: onLineVers.vaule[mapKey],
        added: props.keys.indexOf(mapKey) > -1,
      };
    }
  }
  return map;
});

defineExpose({ getVerLists });

//getVerLists();
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
