<template>
    <div>
        <div class="LegnedBar">
            <!-- v-for 可接受数字：会渲染 1..count 的元素 -->
            <div v-for="i in limitCount" :key="i" class="LegendBarItem"></div>
        </div>
        <br>
        <div class="NumberLine">
            <div v-for="i in numberCount" :key="i" class="NumberLineItem">{{ NumberLineItems[i - 1] }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// 定义组件名称
defineOptions({
  name: 'LegendBar',
})

const props = defineProps({
    count: {
        type: Number,
        default: 3
    }
})

const limitCount = computed(() => {
    if (props.count < 1) return 1
    if (props.count > 10) return 10
    return props.count
})

const numberCount = computed(() => {
    return limitCount.value
})

const NumberLineItems = ref([0, 0.1, 10, 25, 50, 100, 250, 500, 750, 1000])
</script>

<style scoped>
.NumberLine {
    display: flex;
    width: 259;
}

.NumberLine .NumberLineItem {
    flex: 1;
    text-align: center;
    font-size: 13px;
}

.LegnedBar {
    display: flex;
    width: 259px;
    border: 1px solid #000;
}

.LegnedBar .LegendBarItem {
    flex: 1;
    height: 9px;
}

.LegnedBar .LegendBarItem:nth-child(1) {
    background-color: white;
}

.LegnedBar .LegendBarItem:nth-child(2) {
    background-color: rgb(253, 255, 31);
}

.LegnedBar .LegendBarItem:nth-child(3) {
    background-color: rgb(0, 254, 17);
}

.LegnedBar .LegendBarItem:nth-child(4) {
    background-color: rgb(33, 254, 254);
}

.LegnedBar .LegendBarItem:nth-child(5) {
    background-color: rgb(44, 0, 254);
}

.LegnedBar .LegendBarItem:nth-child(6) {
    background-color: rgb(255, 32, 255);
}

.LegnedBar .LegendBarItem:nth-child(7) {
    background-color: rgb(126, 13, 38);
}

.LegnedBar .LegendBarItem:nth-child(8) {
    background-color: rgb(255, 165, 0);
}

.LegnedBar .LegendBarItem:nth-child(9) {
    background-color: rgb(128, 0, 128);
}

.LegnedBar .LegendBarItem:nth-child(10) {
    background-color: rgb(0, 0, 0);
}
</style>