<template>
  <div class="dashboard-editor-container">
    <div class="time">{{ date }}</div>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData2" />
    </el-row>
    <!--<el-row :gutter="8">-->
    <!--<el-col-->
    <!--:xs="{span: 24}"-->
    <!--:sm="{span: 24}"-->
    <!--:md="{span: 24}"-->
    <!--:lg="{span: 12}"-->
    <!--:xl="{span: 12}"-->
    <!--style="padding-right:8px;margin-bottom:30px;">-->
    <!--<transaction-table />-->
    <!--</el-col>-->
    <!--<el-col-->
    <!--:xs="{span: 24}"-->
    <!--:sm="{span: 12}"-->
    <!--:md="{span: 12}"-->
    <!--:lg="{span: 6}"-->
    <!--:xl="{span: 6}"-->
    <!--style="margin-bottom:30px;">-->
    <!--<todo-list />-->
    <!--</el-col>-->
    <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
    <!--<box-card />-->
    <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
  // import GithubCorner from '@/components/GithubCorner'
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  // import RaddarChart from './components/RaddarChart'
  // import PieChart from './components/PieChart'
  // import BarChart from './components/BarChart'
  // import TransactionTable from './components/TransactionTable'
  // import TodoList from './components/TodoList'
  // import BoxCard from './components/BoxCard'

  export default {
    name: 'DashboardAdmin',
    components: {
      // GithubCorner,
      PanelGroup,
      LineChart
      // RaddarChart,
      // PieChart,
      // BarChart,
      // TransactionTable,
      // TodoList,
      // BoxCard
    },
    data() {
      return {
        type: 0,
        months: 0,
        entrancecount: 0,
        lineChartData2: {
          expectedData: [100, 120, 161, 134, 105, 160, 165],
          actualData: [120, 82, 91, 154, 162, 140, 145]
        },
        date: new Date()
      }
    },
    created() {
      var _this = this;
      this.$axios.get('http://localhost:8080/parkrecord/getEntrancrCount').then(function(resp) {
        resp.data.forEach(item => {
          _this.lineChartData2.actualData[item.months - 4] = item.entrancecount * 10
        })
      });
      console.log(this.lineChartData2)
    },
    mounted() {
      const that = this;
      this.timer = setInterval(function() {
        that.date = new Date().toLocaleString()
      })
    },
    beforeDestroy: function() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },

    methods: {
      handleSetLineChartData(type) {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }

    .time {
      text-align: right;
      top: 0px;
      border: 0;
      right: 0;
      color: #45aba2;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
