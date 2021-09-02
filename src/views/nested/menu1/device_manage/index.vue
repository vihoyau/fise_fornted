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
        导入
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary"   icon="exit-fullscreen" @click="handleUpdate">
        批量添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"   icon="exit-fullscreen" @click="handleFixUpdate">
        批量随机添加
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
     <el-table-column align="center" label="设备ID" width="300">
        <template slot-scope="scope">
          {{ scope.row.iotId ||scope.row.deviceId }}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="220" align="center">
        <template slot-scope="scope">{{ scope.row.deviceName }}</template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="330" align="center">
        <template slot-scope="scope">{{ scope.row.GmtCreate ||scope.row.gmtCreate }}</template>
      </el-table-column>
      <el-table-column label="ip地址" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.asAddress||0 }}</template>
      </el-table-column>
      <el-table-column label="最近登录时间" width="330" align="center">
        <template slot-scope="scope">{{ scope.row.gmtModified||scope.row.lastOnlineTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110" class-name="small-padding fixed-width">
        <template slot-scope="scope,$index">
          <el-button size="mini" type="success" @click="handleSelect(scope.row)">属性</el-button>
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id,$index)">删除</el-button> -->
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
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="editFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="添加设备">
          <el-input v-model="temp.count" :autosize="{ minRows: 10, maxRows: 24}" type="textarea" placeholder="请描述该产品的用途" />
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
   <el-dialog :title="textMap[dialogStatus]" :visible.sync="fixFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="listQuery" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item label="随机添加设备">
          <el-input v-model="listQuery.count" :autosize="{ minRows: 0, maxRows: 2}" type="number" placeholder="请填写数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fixFormVisible= false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?create_Fix_Data():create_Fix_Data()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="viewFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
         <el-form-item label="设备名称">
          <el-input v-model="temp.devicename" />
        </el-form-item>
         <el-form-item label="工单号">
          <el-input v-model="temp.orderno" />
        </el-form-item>
        <el-form-item label="设备密钥">
          <el-input v-model="temp.devicesecret" />
        </el-form-item>
        <el-form-item label="卡商ID">
          <el-input v-model="temp.iccid" />
        </el-form-item>
         <el-form-item label="IMEI号码">
          <el-input v-model="temp.imei1" />
        </el-form-item>
        <el-form-item label="三元组来源">
           <el-input v-model="temp.iotsource" />
        </el-form-item>
        <el-form-item label="SN号">
          <el-input v-model="temp.sn" />
        </el-form-item>
         <el-form-item label="设备型号">
          <el-input v-model="temp.modelname" />
        </el-form-item>
         <el-form-item label="SIM卡供应商">
          <el-input v-model="temp.simcardsupplier" />
        </el-form-item>
         <el-form-item label="客户名称">
          <el-input v-model="temp.customername" />
        </el-form-item>
         <el-form-item label="配置描述">
          <el-input v-model="temp.configdiscriptors" />
        </el-form-item>
        <el-form-item label="出厂时间">
          <el-input v-model="temp.verifytime" />
        </el-form-item>
         <el-form-item label="生产工厂">
          <el-input v-model="temp.factoryname" />
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
import { fetchList, fetch_product_List, selectDeviceInfo, deleteArticle, createDevice,create_Fix_Device,updateArticle } from '@/api/device'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

const calendarTypeOptions = [
  { key: '0', display_name: '设备' },
  { key: '1', display_name: '网关' }
]
const productOptions = []

// CELLULAR：蜂窝网。WIFI： Wi-Fi。
// ETHERNET：以太网。
// LORA：LoRaWAN。
// OTHER：其他。
const statusOptions = [
  { key: 'online', display_name: '上线' },
  { key: 'offline', display_name: '离线' },
  { key: 'inactivated', display_name: '未激活' }
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
  components: { Pagination, UploadExcelComponent },
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
      statusOptions,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: '',
        type: undefined,
        sort: '+id',
        status: 'online',
        product_key: 'a1kQ9pRqIqG',
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传超过1M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      console.log(this.tableData)
      createDevice({ excel: this.tableData, product_key: this.listQuery.product_key }).then((result) => {
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
    create_Fix_Data() {
      create_Fix_Device({ count: parseInt(this.listQuery.count), product_key: this.listQuery.product_key }).then(response => {
      })
      // this.list.splice(index, 1)
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
    handleFixUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.fixFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSelect(row) {
      const deviceName = row.deviceName
      selectDeviceInfo(deviceName).then(response => {
        this.temp = response.data
      })
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
      fetchList(this.listQuery).then(response => {
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
