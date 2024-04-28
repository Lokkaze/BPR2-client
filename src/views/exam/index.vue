<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 改成日期排序 -->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <!-- 筛选 -->
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="Status" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
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
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="StartDate" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.startTimestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="EndDate" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.endTimestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Assessor" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.assessor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- 切换至详情页 -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Details
          </el-button>
          <!-- 加提醒 -->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
    <el-dialog title="Create" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="StartTime" prop="startTimestamp">
          <el-date-picker v-model="temp.startTimestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="EndTime" prop="endTimestamp">
          <el-date-picker v-model="temp.endTimestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Are you sure about delete this exam?" :visible.sync="dialogCheckVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="deleteData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { CreateExam, DeleteExam, fetchExam } from '@/api/exam'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'


export default{
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        status: undefined,
        sort: '+id'
      },
      sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}, {label: 'Date Ascending', key: '+date'}, {label: 'Date Descending', key: '-date'}],
      statusOptions: ['Pending', 'Opening', 'Completed'],
      temp: {
        title: '',
        startTimestamp: new Date(),
        endTimestamp: new Date(),
        assessor: this.name,
        status: 'Pending'
      },
      tempId: 0,
      dialogFormVisible: false,
      dialogCheckVisible: false
    }
  },
  created(){
    this.getList()
  },
  methods: {
    getList(){
      this.listLoading = true
      fetchExam(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        title: '',
        startTimestamp: new Date(),
        endTimestamp: new Date(),
        assessor: this.name,
        status: 'Pending'
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
          CreateExam(this.temp).then(() => {
            this.getList()
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
    handleDelete(id) {
      this.tempId = id
      this.dialogCheckVisible = true
    },
    deleteData(){
      DeleteExam(this.tempId).then(response => {
        this.getList()
        this.dialogCheckVisible = false
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
