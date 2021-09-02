<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="" style="margin:0 auto;">
        设备名称
      </div>
      <el-input v-model="listQuery.title" placeholder="设备名称" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-select
        v-model="listQuery.product_key"
        placeholder="请选择"
        clearable
        class="filter-item"
        style="width: 340px"
      >
        <el-option
          v-for="item in productOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
     <el-table-column type="selection" align="center" />
      <el-table-column label="时间" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.push_timestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="220" align="center">
        <template slot-scope="scope">{{ scope.row.deviceName }}</template>
      </el-table-column>
      <el-table-column label="响应时间(毫秒)" width="220" align="center">
        <template slot-scope="scope">{{ scope.row.push_timestamp }}</template>
      </el-table-column>
      <el-table-column label="时间戳" width="220" align="center">
        <template slot-scope="scope">{{ scope.row.generateTimeic }}</template>
      </el-table-column>
       <el-table-column label="订单金额" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.money }}</template>
      </el-table-column>
       <el-table-column label="优惠金额" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.gmtModified||0 }}</template>
      </el-table-column>
       <el-table-column label="实收金额" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.money }}</template>
      </el-table-column>
       <el-table-column label="交易类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.broadcast_type }}</template>
      </el-table-column>
       <el-table-column label="支付类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.biz_type }}</template>
      </el-table-column>
        <el-table-column label="播报结果" width="220" align="center">
        <template slot-scope="scope">收款{{ scope.row.money }}元</template>
      </el-table-column>
       <el-table-column label="超时" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.gmtModified||scope.row.lastOnlineTime }}</template>
      </el-table-column>
       <el-table-column label="流水号" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.asAddress||0 }}</template>
      </el-table-column>
    
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { winter_list, fetch_product_List } from '@/api/device'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '0', display_name: '设备' },
  { key: '1', display_name: '网关' }
]
const productOptions = []
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
productOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      calendarTypeOptions,
      productOptions,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: '',
        type: undefined,
        sort: '+id',
        status: 'online',
        product_key: '加瓦添翼(a1kQ9pRqIqG)',
        count: ''
      },
      textMap: {
        update: '批量添加设备',
        create: '导入设备(不支持中文)'
      },
      temp: {
        devicename: '',
        devicesecret: '',
        iccid: '',
        imei1: '',
        iotsource: '',
        itemid: '',
        modelname: '',
        productkey: '',
        sn: '',
        orderno: '',
        count: ''
      },
      tableData: '',
      dialogStatus: '',
      dialogFormVisible: false,
      editFormVisible: false,
      fixFormVisible: false,
      viewFormVisible: false,
      listLoading: true,
      rules: {
        node_type: [{ required: true, message: '产品类型是必填', trigger: 'change' }],
        link_type: [{ required: true, message: '请选择联网方式', trigger: 'change' }],
        product_name: [{ required: true, message: '产品名称必填且唯一', trigger: 'blur' }],
        customer_name: [{ required: true, message: '客户名称是必填,没有请填FISE', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.get_product_list()
  },
  methods: {
    resetTemp() {
      this.temp = {
        devicename: '',
        devicesecret: '',
        iccid: '',
        imei1: '',
        iotsource: '',
        itemid: '',
        modelname: '',
        productkey: '',
        sn: '',
        orderno: ''
      }
    },
    fetchData() {
      this.listLoading = true
      winter_list(this.listQuery).then(response => {
        this.list = response.data.result
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      winter_list(this.listQuery).then(response => {
        this.list = response.data.result
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    get_product_list() {
      fetch_product_List(this.listQuery).then(response => {
        this.productOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>
