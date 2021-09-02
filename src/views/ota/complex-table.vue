<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="版本名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="项目类型" clearable class="filter-item" style="width: 250px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加版本
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.public | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试日期" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.test | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="获包日期" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
      </el-table-column>
      <el-table-column label="设备类型" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重要性" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="下载数量" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.download" class="link-type" @click="handleFetchPv(row.download)">{{ row.download }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="属性" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.size">
            {{ row.size }}MB
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前使用情况" class-name="status-col" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.use | statusFilter">
            {{ row.use }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.pubstate">
            {{ row.pubstate }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="460" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            查看
          </el-button>
          <el-button v-if="row.pubstate=='未测试'" size="mini" type="success" @click="handleModifyStatus(row,'已测试',1)">
            检测(预发布)
          </el-button>
          <el-button v-if="row.pubstate=='测试中'" size="mini" type="success" @click="handleModifyStatus(row,'已发布',2)">
            正式发布
          </el-button>
          <el-button v-if="row.pubstate =='未测试'|| row.pubstate=='测试中'" size="mini" type="danger" @click="handleDelete(row,$index)">
            作废
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="选择项目 ">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="获包日期" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="版本号(如1.0.2)" prop="title" label-width="130px">
          <el-input v-model="temp.title" class="filter-item"/>
        </el-form-item>
        <el-form-item label="属性" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="选择属性">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="重要等级" prop="importance">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="版本说明" prop="remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="版本相关说明" class="filter-item" />
        </el-form-item>
        <el-form-item label="升级包" prop="zip" label-width="130px">
          (文件同名被覆盖(无效)、文件有误将无法上传))
          <el-upload
            :multiple="false"
            :file-list="fileList"
            :show-file-list="true"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            class="editor-slide-upload"
            action="http://localhost:7001/ota/upload"
          >
        <el-button size="small" type="primary">
          点击升级包
        </el-button>
      </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogStatus==='create'">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          发布版本
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
import { fetchList, deleteAot, publicAot, fetchPv,fetchProject, createAot, updateArticle } from '@/api/ota'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'bluetoothswatch', display_name: '蓝牙手表' }

]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
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
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      size: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['升级版', '补丁版', '内测版'],
      showReviewer: false,
      temp: {
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: '升级版',
        zip: '',
        type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '查看属性',
        create: '创建版本'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: '选择项目类型', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: '填写覆盖时间', trigger: 'change' }],
        title: [{ required: true, message: '填写版本标题', trigger: 'change' }],
        status: [{ required: true, message: '填写版本状态', trigger: 'change' }],
        remark: [{ required: true, message: '填写版本说明', trigger: 'change' }],
        zip: [{ required: true, message: '选择打包版本', trigger: 'change' }],
        importance: [{ required: true, message: '选择版本重要性', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getProject()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await fetchList(this.listQuery)
      if (result) {
        this.list = result.data
        this.total = result.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }
    },
    async getProject() {
      const result = await fetchProject()
      if (result) {
        this.calendarTypeOptions = result.data
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    async handleModifyStatus(row, status, state) {
      row.status = status
      const result = await publicAot({ rowid: row.id, state })
      if (result) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        this.getList()
      }
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: '升级版',
        zip: '',
        size: 0,
        type: ''
      }
    },
    handleSuccess(res) {
      this.temp.zip = res.qrcode_url
      this.temp.size = res.byteLength
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createAot(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
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
    async handleDelete(row, index) {
      await deleteAot(row.id).then(() => {
      })
      this.getList()
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
