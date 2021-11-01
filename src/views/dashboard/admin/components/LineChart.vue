<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '350px'
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
      chartData1: {
        type: Object,
        required: true
      },
      xData: [],
      entrancecount: [],
      exitcount: [],
      farecount: []
    }
  },
  watch: {
    chartData1: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    var _this = this
    this.$nextTick(() => {
      this.initChart()
    })
    this.timer = setInterval(function() {
      _this.initChart()
    }, 180000)
  },
  created() {

  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      var _this = this
      this.$axios.get('http://localhost:8080/echarts/recordfarecount').then(function(resp) {
        _this.farecount = resp.data
      })
      this.$axios.get('http://localhost:8080/echarts/recordentrancecount').then(function(resp) {
        _this.entrancecount = resp.data
      })
      this.$axios.get('http://localhost:8080/echarts/recordexitcount').then(function(resp) {
        _this.exitcount = resp.data
      })
      this.$axios.get('http://localhost:8080/echarts/getSixMonths').then(function(resp) {
        _this.xData = resp.data
        _this.chartData1 = { entrancecount: _this.entrancecount, exitcount: _this.exitcount, farecount: _this.farecount }
      })
      this.setOptions(this.chartData1)
    },
    setOptions({ entrancecount, exitcount, farecount } = {}) {
      this.chart.setOption({
        // backgroundColor: '#ffffdc',
        xAxis: {
          data: this.xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        toolbox: { // 可视化的工具箱
          x: '4%',
          top: '-2%',
          show: true,
          feature: {
            dataView: { // 数据视图
              show: true
            },
            restore: { // 重置
              show: true
            },
            // dataZoom: { //数据缩放视图
            //   show: true
            // },
            saveAsImage: { // 保存图片
              show: true
            },
            magicType: { // 动态类型切换
              type: ['bar', 'line']
            }
          }
        },
        yAxis: [
          {
            name: 'count',
            type: 'value'
          },
          {
            name: '￥',
            type: 'value'
          }
        ],
        legend: {
          x: '65%',
          top: '0%',
          textStyle: {
            color: '#90979c'
          },
          data: ['entrancecount', 'exitcount', 'farecount']
        },
        calculable: true,

        series: [{
          name: 'entrancecount',
          barBorderRadius: 3,
          barMaxWidth: 30,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(219, 50, 51, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(219, 50, 51, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          smooth: true,
          type: 'line',
          data: entrancecount,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'exitcount',
          smooth: true,
          type: 'line',
          barBorderRadius: 3,
          barMaxWidth: 30,
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          data: exitcount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: 'farecount',
          yAxisIndex: 1,
          type: 'bar',
          smooth: true,
          barBorderRadius: 3,
          barMaxWidth: 30,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#def8f8'
              }, {
                offset: 0.8,
                color: '#def8f8'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: '#11bcae',
              label: {
                show: true,
                textStyle: {
                  color: '#3888fa'
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: farecount,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        ],
        dataZoom: [{
          show: true,
          height: 20,
          xAxisIndex: [0],
          fillerColor: '#d8f0f8',
          bottom: 0,
          start: 30,
          end: 100,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d8f0f8'
          },
          textStyle: {
            color: '#039fa0'
          },
          borderColor: '#d8f0f8'
        },
        {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }]
      })
    }
  }
}
</script>
