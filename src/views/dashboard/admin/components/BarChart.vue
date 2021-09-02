<template>

  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { device_log_list } from '@/api/device'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      active_count: [],
      online_count: [],
      device_count: [],
      offline_count: [],
      unactive_count: []
    }
  },
  mounted() {
    this.initChart()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      device_log_list().then(response => {
        this.offline_count = response.data.logger_offline_arr
        this.online_count = response.data.logger_online_arr
        this.unactive_count = response.data.logger_unactive_arr
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '设备在线',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.online_count,
          animationDuration
        }, {
          name: '设备离线',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.offline_count,
          animationDuration
        }, {
          name: '未激活设备',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.unactive_count,
          animationDuration
        }]
      })
    }
  }
}
</script>
