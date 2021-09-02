<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="项目名称" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.type" placeholder="项目类型" clearable class="filter-item" style="width: 250px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        创建批次
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="100px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
  
      <el-table-column label="项目名称" width="150px" >
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
         <el-table-column label="批次(版本)名称" width="150px" >
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批次(版本)号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
       <el-table-column label="备注" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
       <el-table-column label="创建日期" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
     
          <el-table-column label="分包版本号" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.downloadStatus }}</span>
        </template>
      </el-table-column>
       <el-table-column label="策略" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
          <el-table-column label="最新策略下载数" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.otanum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="策略状态" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comfirmStatus }}</span>
        </template>
      </el-table-column>
     
      <el-table-column label="操作" align="center" width="500px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="inhandleCreate(row.id)">
             升级策略
          </el-button>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="cinhandleCreate(row.id)">
             分包选择
          </el-button>
          <el-button v-if="row.comfirm!=2" size="mini" type="success" @click="handleUpdateComfirm(row,$index)">
                 确认策略、分包
          </el-button>
          <el-button v-if="row.status==1" size="mini" type="danger" @click="handleUpdateStatus1(row,$index)">
                暂停下载
          </el-button>
           <el-button v-else size="mini" type="danger" @click="handleUpdateStatus2(row,$index)">
                恢复下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="项目类型" prop="type" label-width="150px">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="批次(版本)号" prop="title" label-width="150px">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="批次(版本)名称" prop="modelid" label-width="150px">
          <el-input v-model="temp.modelid" />
        </el-form-item>
        <el-form-item label="说明" label-width="150px" prop="remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          创建批次
        </el-button>
      </div>
    </el-dialog>
        <el-dialog :title="更新分包" :visible.sync="cindialogFormVisible">
      <el-form ref="dataForm" :rules="inrules" :model="cintemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分包选择" prop="type" label-width="150px">
          <el-select v-model="cintemp.cintype" class="filter-item" placeholder="Please select">
            <el-option v-for="item in cincalendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="cindialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?cincreateData(temp.id):cincreateData(temp.id)">
          更新分包
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="更新策略" :visible.sync="indialogFormVisible">
      <el-form ref="dataForm" :rules="inrules" :model="intemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="策略" prop="type" label-width="150px">
          <el-select v-model="intemp.intype" class="filter-item" placeholder="Please select">
            <el-option v-for="item in incalendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量总数" v-if="intemp.intype=='numupdate'" type="number"  prop="numupdate" placeholder="请填写数量" label-width="150px">
          <el-input v-model="intemp.numupdate" />
        </el-form-item>
       <el-form-item label="IMEI号"  v-if="intemp.intype=='deviceupdate'" prop="deviceupdate" label-width="150px">
          <el-input v-model="intemp.deviceupdate" label-width="200px"  :autosize="{ minRows: 10, maxRows: 20}" type="textarea" placeholder="用英文分号;隔离。例如：123123;123111;123;" />
        </el-form-item>
       <el-dialog >
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="indialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?increateData():updateData()">
          更新策略
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,fetchProject,fetchOta,fetchPv, createProject,updateStatus,updateComfirm, updateArticle,updateProject,updateOta } from '@/api/ota-project'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const incalendarTypeOptions = [
  { key: 'numupdate', display_name: '按数量升级' },
  { key: 'deviceupdate', display_name: '按设备升级' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const incalendarTypeKeyValue = incalendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const cincalendarTypeOptions = [
]

// arr to obj, such as { CN : "China", US : "USA" }
const cincalendarTypeKeyValue = cincalendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    typeFilter(type) {
      return incalendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
      },
      intype:undefined,
      cintype:undefined,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      incalendarTypeOptions,
      cincalendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        modelid: undefined,
        title: undefined,
        remark: undefined,
        type:''
      },
      intemp: {
        id: undefined,
        intype: undefined,
        numupdate: undefined,
        deviceupdate: undefined
      },
      cintemp: {
        id: undefined,
        cintype: undefined,
      },
      dialogFormVisible: false,
      indialogFormVisible: false,
      cindialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建批次'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        modelid: [{ required: true, message: 'modelid is required', trigger: 'blur' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        remark: [{  required: true, message: 'remark is required', trigger: 'blur' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        zip: [{ required: true, message: '选择上传imei号', trigger: 'change' }],
      },
      inrules: {
        intype: [{ required: true, message: 'intype is required', trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getProject()
    this.getOta()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await fetchList(this.listQuery)
      if (result) {
        this.list = result.data
        this.total = result.total
        this.listLoading = false
      }
    },
    async getProject() {
      const result = await fetchProject()
      if (result) {
        this.calendarTypeOptions = result.data
      }
    },
    async getOta() {
      const result = await fetchOta()
      if (result) {
        this.cincalendarTypeOptions = result.data
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        remark: '',
        title: '',
        modelid: '',
        type:''
      }
      this.intemp = {
        id: undefined,
        intype: undefined,
        numupdate: undefined,
        deviceupdate: undefined
      }
      this.cintemp = {
        id: undefined,
        cintype: undefined,
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.getProject()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    inhandleCreate(id) {
      this.resetTemp()
      this.intemp.id=id
      this.dialogStatus = 'create'
      this.getProject()
      this.indialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    cinhandleCreate(id) {
      this.resetTemp()
      this.cintemp.id=id
      this.getProject()
      this.cindialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleComfirm(id) {
      this.resetTemp()
      this.cintemp.id=id
      this.getProject()
      this.cindialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateStatus1(obj) {
      updateStatus({id:obj.id,status:2}).then(() => {
             this.getList()
      })
    },
    handleUpdateStatus2(obj) {
      updateStatus({id:obj.id,status:1}).then(() => {
             this.getList()
      })
    },
    handleUpdateComfirm(obj) {
      updateComfirm({id:obj.id}).then(() => {
             this.getList()
      })
    },
    createData() {
      createProject(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
             this.getList()
      })
    },
    increateData() {
      updateProject(this.intemp).then(() => {
            this.indialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
             this.getList()
      })
    },
    cincreateData() {
      updateOta(this.cintemp).then(() => {
            this.cindialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
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
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
