<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="listQuery.type"
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
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
     <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" width="220" align="center">
        <template slot-scope="scope">{{ scope.row.customer_name }}</template>
      </el-table-column>
      <el-table-column label="产品Key" width="330" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.product_type||"云音箱" }}</template>
      </el-table-column>
      <el-table-column label="在线设备数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.online||0 }}</template>
      </el-table-column>
      <el-table-column label="设备总数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.device_counts||0 }}</template>
      </el-table-column>
      <el-table-column label="license数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.pageviews||0 }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="340" class-name="small-padding fixed-width">
        <template slot-scope="scope,$index">
          <el-button size="mini" type="success" @click="handleSelect(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
         <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="temp.product_name" />
          <!-- <el-card v-model="temp.product_name"/> -->
        </el-form-item>
        <el-form-item label="产品类型" prop="product_type">
          <el-select v-model="temp.product_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in productType" :key="item.key" :label="item.display_name" :value="item.display_name" />
          </el-select>
        </el-form-item>
         <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="temp.customer_name" />
        </el-form-item>
        <el-form-item label="节点类型" prop="node_type">
          <el-select v-model="temp.node_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.display_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="连网方式" prop="link_type">
          <el-select v-model="temp.link_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.display_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input v-model="temp.description" :autosize="{ minRows: 0, maxRows: 4}" type="textarea" placeholder="请描述该产品的用途" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="editFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
         <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="temp.product_name" />
        </el-form-item>
         <el-form-item label="产品名称" prop="product_type">
          <el-input v-model="temp.product_type" />
        </el-form-item>
         <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="temp.customer_name" />
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input v-model="temp.description" :autosize="{ minRows: 0, maxRows: 4}" type="textarea" placeholder="请描述该产品的用途" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible= false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="viewFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
         <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="temp.product_name" />
        </el-form-item>
        <el-form-item label="产品key" prop="link_type">
          <el-input v-model="temp.product_key" />
        </el-form-item>
        <el-form-item label="产品密钥" prop="link_type">
          <el-input v-model="temp.product_secret" />
        </el-form-item>
         <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="temp.customer_name" />
        </el-form-item>
        <el-form-item label="节点类型" prop="node_type">
           <el-input v-model="temp.node_type" />
        </el-form-item>
        <el-form-item label="连网方式" prop="link_type">
          <el-input v-model="temp.link_type" />
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input v-model="temp.description" :autosize="{ minRows: 0, maxRows: 4}" type="textarea" placeholder="请描述该产品的用途" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewFormVisible= false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/table"
import { fetchList, deleteArticle, createArticle, updateArticle, fetch_product_type_List } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const calendarTypeOptions = [
  { key: '0', display_name: '设备' },
  { key: '1', display_name: '网关' }
]
const productOptions = [
  // { key: 'All', display_name: '全部' },
  { key: 'FISE', display_name: '沸石' },
  { key: 'ALiYun', display_name: '阿里云' }
]
// CELLULAR：蜂窝网。WIFI： Wi-Fi。
// ETHERNET：以太网。
// LORA：LoRaWAN。
// OTHER：其他。
const statusOptions = [
  { key: '1', display_name: 'wifi' },
  { key: '2', display_name: '蜂窝网' },
  { key: '3', display_name: '以太网' },
  { key: '4', display_name: 'LoRaWAN' },
  { key: '5', display_name: '其他' }
]
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const productTypeKeyValue = productOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const statusOptionsKeyValue = statusOptions.reduce((acc, cur) => {
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
      productType: [],
      statusOptions,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: '',
        type: undefined,
        sort: '+id'
      },
      textMap: {
        update: '编辑产品',
        create: '创建产品'
      },
      temp: {
        description: '',
        product_name: '',
        node_type: '',
        link_type: '',
        customer_name: '',
        product_key: '',
        product_secret: '',
        product_type: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      editFormVisible: false,
      viewFormVisible: false,
      listLoading: true,
      rules: {
        node_type: [{ required: true, message: '节点类型是必填', trigger: 'change' }],
        link_type: [{ required: true, message: '请选择联网方式', trigger: 'change' }],
        product_name: [{ required: true, message: '产品名称必填且唯一', trigger: 'blur' }],
        customer_name: [{ required: true, message: '客户名称是必填,没有请填FISE', trigger: 'blur' }],
        product_type: [{ required: true, message: '产品类型是必填', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
    this.get_product_type_list()
  },
  methods: {
    resetTemp() {
      this.temp = {
        description: '',
        product_name: '',
        node_type: '',
        link_type: '',
        customer_name: '',
        product_key: '',
        product_secret: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then((result) => {
            this.temp.product_key = result.data.product_key
            this.temp.id = result.data.id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id, index) {
      deleteArticle(id).then(response => {
      })
      this.list.splice(index, 1)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.editFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSelect(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.viewFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.editFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    get_product_type_list() {
      fetch_product_type_List(this.listQuery).then(response => {
        this.productType = response.data
        this.productType.reduce((acc, cur) => {
          acc[cur.key] = cur.display_name
          return acc
        }, {})
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>
