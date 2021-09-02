<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
       <div class="card-panel-description">
          <div class="card-panel-text">
            总设备数
          </div>
          <count-to :start-val="0" :end-val="res_cloud.deviceCount" :duration="2600" class="card-panel-num1" />台
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            在线设备
          </div>
          <count-to :start-val="0" :end-val="res_cloud.onlineCount" :duration="3000" class="card-panel-num2" />台
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            离线设备
          </div>
          <count-to :start-val="0" :end-val="res_cloud.offlineCount" :duration="3200" class="card-panel-num3" />台
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-description">
          <div class="card-panel-text">
            未激活设备
          </div>
          <count-to :start-val="0" :end-val="res_cloud.unactiveCount" :duration="3600" class="card-panel-num4" />台
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { static_windy } from '@/api/device'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      res_cloud: {}
    }
  },
  created() {
    this.getSocial()
    this.get_product_list()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getSocial() {
      static_windy().then(response => {
        this.res_cloud = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      // float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 100px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
        color: darkgreen ;
      }
      .card-panel-num1 {
        font-size: 40px;
        color: black;
      }
      .card-panel-num2 {
        font-size: 40px;
        color: darkgreen
      }
      .card-panel-num3 {
        font-size: 40px;
        color:darkorange
      }
      .card-panel-num4 {
        font-size: 40px;
        color: grey;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
