<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="" style="margin:0 auto;">
        设备名称
      </div>
      <el-input v-model="listQuery.title" placeholder="设备名称" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-select
        v-model="listQuery.status"
        placeholder="设备状态"
        clearable
        class="filter-item"
        style="width: 340px"
      >
       <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
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
          :value="item.display_name+'('+item.key+')'"
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
    <el-table-column align="center" label="设备ID" width="250">
        <template slot-scope="scope">
          {{ scope.row._id ||scope.row._id }}
        </template>
      </el-table-column>
      <el-table-column label="登录/离线时间" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.deviceName }}</template>
      </el-table-column>
      <el-table-column label="IP地址" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.clientIp ||scope.row.clientIp }}</template>
      </el-table-column>
      <el-table-column label="MAC地址" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.iotId||0 }}</template>
      </el-table-column>
      <el-table-column label="登录结果" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.status==="online"?"在线":"离线" }}</template>
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
import { fetch_device_login_List, fetch_product_List } from '@/api/device'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const statusOptions = [
  { key: 'online', display_name: '上线' },
  { key: 'offline', display_name: '离线' }
]
const statusOptionsKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const productOptions = []
productOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  components: { Pagination },
  filters: {
    handleFilter(type) {
      return statusOptionsKeyValue[type]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      productOptions,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: '',
        type: undefined,
        status: 'online',
        product_key: '加瓦添翼(a1kQ9pRqIqG)',
        count: ''
      },
      statusOptions,
      tableData: '',
      dialogStatus: '',
      dialogFormVisible: false,
      editFormVisible: false,
      fixFormVisible: false,
      viewFormVisible: false,
      listLoading: true,
      rules: {
      }
    }
  },
  created() {
    this.getList()
    this.get_product_list()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetch_device_login_List(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      fetch_device_login_List(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

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
