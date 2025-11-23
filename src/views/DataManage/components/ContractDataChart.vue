<template>
  <div id="tradePie" style="height: 400px; width: 100%"></div>
</template>

<script lang="ts" name="ContractPieChart" setup>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { TradeArray } from '@/api/interface/index'
import { PropType } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<TradeArray>,
    required: true,
    default: () => ({ timeList: [], countList: [] })
  }
})

const myChart = ref<echarts.ECharts | null>(null)
let resizeHandler: () => void

const initChart = () => {
  // 1. 数据校验（严格处理空数据）
  const timeList = Array.isArray(props.data.timeList) ? props.data.timeList : []
  const countList = Array.isArray(props.data.countList) ? props.data.countList : []

  // 2. 生成饼图数据（确保 value 为有效数字）
  const pieData = timeList
    .map((time, index) => ({
      name: time || `未知时间${index}`, // 避免 name 为 undefined
      value: Number(countList[index]) || 0 // 强制转为数字，避免非数值类型
    }))
    .filter((item) => item.value > 0) // 过滤无效数据

  // 3. 处理无数据场景（显示空图表提示）
  if (pieData.length === 0) {
    if (myChart.value) {
      myChart.value.clear() // 清空图表
      myChart.value.setOption({
        title: { text: '暂无数据', left: 'center', top: 'middle' },
        series: [] // 空 series 避免解析错误
      })
    }
    return
  }

  // 4. 初始化图表实例（确保 DOM 存在）
  const chartDom = document.getElementById('tradePie')
  if (!chartDom) return
  if (myChart.value) myChart.value.dispose()
  myChart.value = echarts.init(chartDom)

  // 5. 正确的饼图配置（确保 series 是数组且包含 type）
  const option = {
    title: {
      text: '合同数量分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      // 过滤无数据的图例
      data: pieData.map((item) => item.name)
    },
    // 关键：series 必须是数组，且每个元素必须有 type
    series: [
      {
        name: '合同数量',
        type: 'pie', // 必选字段，解决 type 未定义问题
        radius: '50%',
        data: pieData, // 确保 data 是正确的数组格式
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  myChart.value.setOption(option)

  // 6. 窗口 resize 事件（避免重复绑定）
  resizeHandler = () => myChart.value?.resize()
  window.removeEventListener('resize', resizeHandler) // 先移除再添加，避免重复
  window.addEventListener('resize', resizeHandler)
}

// 监听数据变化，立即更新图表
watch(
  () => [props.data.timeList, props.data.countList],
  () => initChart(),
  { immediate: true, deep: true }
)

// 组件生命周期管理
onMounted(initChart)
onUnmounted(() => {
  if (myChart.value) {
    myChart.value.dispose()
    myChart.value = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>
