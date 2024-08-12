<template>
  <div>
    <el-popover v-model:visible="popoverVisible" trigger="focus" placement="bottom" width="300">
      <template #reference>
        <el-input class="reference" v-model="selectedIcon" readonly @click="togglePopover">
          <template #prepend>
            <el-icon>
              <component :is="selectedIcon" v-if="selectedIcon" />
            </el-icon>
          </template>
        </el-input>
      </template>
      <el-scrollbar height="300px">
        <div class="icon-container">
          <div
            class="icon-item"
            v-for="item in iconList"
            :key="item.name"
            :data-clipboard-text="item.name"
            @click="selectIcon(item.name)"
          >
            <el-icon>
              <component :is="item.name" />
            </el-icon>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, toRef } from 'vue'

// Props
interface Props {
  iconsNameList: string[]
  modelValue: string
}
const props = defineProps<Props>()
// Emits
// const emit = defineEmits<{
//   (event: 'icon-selected', iconName: string): void
// }>()
const emit = defineEmits(['update:modelValue'])
const popoverVisible = ref(false)
const selectedIcon = toRef(props, 'modelValue')

// 切换弹出框的显示状态
const togglePopover = () => {
  popoverVisible.value = !popoverVisible.value
}

// 选择图标并向父组件传递图标名称
const selectIcon = (iconName: string) => {
  selectedIcon.value = iconName // 设置按钮的图标
  emit('update:modelValue', iconName) // 向父组件传递图标名称
  closePopover() // 关闭弹出框
}

// 关闭弹出框
const closePopover = () => {
  popoverVisible.value = false
}
interface iconItem {
  name: string
}
const iconList = ref<iconItem[]>([])

function filterIcon() {
  iconList.value = props.iconsNameList.map((item) => {
    return { name: item }
  })
}
onMounted(() => {
  filterIcon()
})
</script>

<style scoped>
.icon-container {
  display: flex;
  flex-wrap: wrap;
}

.icon-item {
  cursor: pointer;
  margin: 10px;
  text-align: center;
}

.icon-item:hover {
  background-color: #f5f5f5;
}
</style>
