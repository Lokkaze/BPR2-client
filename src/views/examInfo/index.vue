<template>
    <div v-loading="loading">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px">
            
            <el-row style="margin-bottom:50px;margin-top:10px;">
                <el-col :span="8" class="text-center">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <el-input v-if="edit" v-model="temp.exam.title" class="edit-input" size="small"></el-input>
                            <span v-else>{{ info.exam.title }}</span>
                        </div>
                        <div>
                            <el-col :span="12" class="text-center">
                                <el-form-item label="Assessor:" >
                                    <span>{{ info.exam.username }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="text-center">
                                <el-select v-if="edit" v-model="temp.exam.status" clearable>
                                    <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
                                </el-select>
                                <el-form-item v-else label="Status:" >
                                    <span> {{ info.exam.status }}</span>
                                </el-form-item>
                            </el-col>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:50px;">
                <el-col :span="8" class="text-center">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>Opening time:</span>
                        </div>
                        <div>
                            <el-col :span="12" class="text-center">
                                <el-form-item v-if="edit" label="StartTime">
                                    <el-date-picker v-model="tempStartTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Please pick a date" />
                                </el-form-item>
                                <el-form-item v-else label="StartTime:" >
                                    <span>{{ formatTimestamp(info.exam.startTimestamp) }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="text-center">
                                <el-form-item v-if="edit" label="EndTime">
                                    <el-date-picker v-model="tempEndTime" type="datetime" placeholder="Please pick a date" />
                                </el-form-item>
                                <el-form-item v-else label="EndTime:" >
                                    <span>{{ formatTimestamp(info.exam.endTimestamp) }}</span>
                                </el-form-item>
                            </el-col>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row v-if="isTeacher" style="margin-bottom:50px;">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>Student list:</span>
                        <el-button v-if="edit" type="primary" @click="startAddingStudent()">
                            Add
                        </el-button>
                    </div>
                    <div>
                        <el-table
                        v-if="edit"
                        :data="temp.users"
                        border
                        fit
                        highlight-current-row
                        >
                        <el-table-column label="StudentId" align="center" width="100">
                            <template slot-scope="{row}">
                                <span>{{ row.userId }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="StudentName" align="center" width="200">
                            <template slot-scope="{row}">
                                <span>{{ row.username }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Delete" align="center" width="230" class-name="small-padding fixed-width">
                            <template slot-scope="{row}">
                                <el-button @click="deleteStudent(row.userId)">
                                    <i style="color:#ff4949" class="el-icon-delete" />
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                        <el-table
                        v-else
                        :data="info.users"
                        border
                        fit
                        highlight-current-row
                        >
                        <el-table-column label="StudentId" align="center" width="100">
                            <template slot-scope="{row}">
                                <span>{{ row.userId }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="StudentName" align="center" width="200">
                            <template slot-scope="{row}">
                                <span>{{ row.username }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Status" align="center" width="200">
                            <template slot-scope="{row}">
                                <span>{{ getUserExamByUserId(row.userId).userExamStatus }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="info.exam.status === 'Completed'" label="Delete" align="center" width="230" class-name="small-padding fixed-width">
                            <template slot-scope="{row}">
                                <el-button @click="fetchExamRecord(examId, row.userId)" type="primary">
                                    CheckRecord
                                </el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-row>
            <el-row>
                <div v-if="edit">
                    <el-button type="primary" @click="confirmEdit()">
                        Complete
                    </el-button>
                    <el-button type="primary" @click="cancelEdit()">
                        Cancel
                    </el-button>
                </div>
                <div v-else>
                    <el-button v-if="isTeacher" type="primary" style="margin-right:10px;" @click="startEdit()">
                        Edit
                    </el-button>
                    <router-link :to="'/exam/examQuestion/' + info.examId">
                        <el-button style="margin-right:10px;" v-if="isTeacher" type="primary">
                            Check exam questions
                        </el-button>
                    </router-link>
                    <router-link :to="'/exam/invigilate/' + info.examId">
                        <el-button v-if="isTeacher && info.exam.status==='Opening'" type="primary">
                            Invigilate
                        </el-button>
                    </router-link>
                    <el-button v-if="!isTeacher && info.exam.status==='Opening'" type="primary" @click="startExam()">
                        Start exam
                    </el-button>
                </div>
                
            </el-row>
        </el-form>

        <el-dialog title="Student List" :visible.sync="dialogStudentListVisible">
            <el-input v-model="studentListQuery.username" placeholder="Name" style="width: 200px;" class="filter-item" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleStudentFilter">
                Search
            </el-button>
            <el-table
            v-loading="loading"
            :data="studentList"
            border
            fit
            highlight-current-row
            >
                <el-table-column label="StudentId" align="center" width="100">
                    <template slot-scope="{row}">
                        <span>{{ row.userId }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="StudentName" align="center" width="200">
                    <template slot-scope="{row}">
                        <span>{{ row.username }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Add" align="center" width="230" class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                        <el-button @click="addStudent(row)">
                            <i style="color:#000000" class="el-icon-plus" />
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="Important: Share your camera before start exam" :visible.sync="dialogCheckCameraVisible">
            <el-button type="primary" style="margin-right:20px;" >
                Start sharing camera
            </el-button>
            <router-link :to="'/exam/examQuestion/' + info.examId">
                        <el-button type="primary">
                            Start exam
                        </el-button>
                    </router-link>
        </el-dialog>
        
    </div>
</template>
<script>
import { fetchExamDetail, fetchStudentList, updateExamDetail } from '@/api/exam';
import { fetchExamRecord } from '@/api/stream';
import { valid } from 'mockjs';
import { mapGetters } from 'vuex';

const defaultFoam = {
    examId: 0,
            exam: {
                examId: 0,
                title: "",
                startTimestamp: new Date(),
                endTimestamp: new Date(),
                username: "",
                status: ""
            },
            users: []
}

export default {
    data(){
        return{
            examId: 0,
            loading: true,
            info: Object.assign({}, defaultFoam),
            temp: null,
            edit: false,
            statusOptions: ['Pending', 'Opening', 'Completed'],
            rules: {
                type: [{ required: true, message: 'type is required', trigger: 'change' }],
                startTimestamp: [{ type: 'date', required: true, message: 'startTimestamp is required', trigger: 'change' }],
                endTimestamp: [{ type: 'date', required: true, message: 'endTimestamp is required', trigger: 'change' }],
                title: [{ required: true, message: 'title is required', trigger: 'blur' }]
            },
            dialogStudentListVisible: false,
            studentListQuery: {
                username: '',
                page: 1,
                limit: 10
            },
            studentList: null,
            studentTotal: 0,
            userExamList: null,
            dialogCheckCameraVisible: false
        }
    },
    computed: {
        ...mapGetters([
            'isTeacher',
            'userId'
        ]),
        tempStartTime: {
        // set and get is useful when the data
        // returned by the back end api is different from the front end
        // back end return => "2013-06-25 06:59:25"
        // front end need timestamp => 1372114765000
        get() {
            return this.formatTimestamp(this.temp.exam.startTimestamp)
        },
        set(val) {
            this.temp.exam.startTimestamp = +new Date(val)
        }
        },
        tempEndTime: {
        // set and get is useful when the data
        // returned by the back end api is different from the front end
        // back end return => "2013-06-25 06:59:25"
        // front end need timestamp => 1372114765000
        get() {
            return this.formatTimestamp(this.temp.exam.endTimestamp)
        },
        set(val) {
            this.temp.exam.endTimestamp = +new Date(val)
        }
        }
    },
    created(){
        this.examId = this.$route.params.id
        this.fetchData(this.examId)
    },
    methods: {
        fetchData(examId){
            this.loading = true
            fetchExamDetail(examId).then(response => {
                this.info = response.data.info
                this.userExamList = response.data.userExam
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        },
        formatTimestamp(timestampString) {
            const timestamp = parseInt(timestampString, 10);
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day} ${hour}:${minute}`;
        },
        startEdit(){
            this.temp = JSON.parse(JSON.stringify(this.info))
            this.edit = true
        },
        confirmEdit(){
            this.$refs['dataForm'].validate((valid) => {
                if(valid){
                    updateExamDetail(this.temp).then(() => {
                        this.fetchData(this.examId)
                        this.edit = false
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
        cancelEdit(){
            this.edit = false
        },
        deleteStudent(userId){
            const deleteIndex = this.temp.users.findIndex(user => user.userId === userId)
            if (deleteIndex !== -1) {
                this.temp.users.splice(deleteIndex, 1)
            }
        },
        getStudentList(){
            this.loading = true
            fetchStudentList(this.studentListQuery).then(response => {
                this.studentList = response.data.list.records
                this.studentTotal = response.data.list.total
                this.loading = false
            })
        },
        handleStudentFilter(){
            this.studentListQuery.page = 1
            this.getStudentList()
        },
        startAddingStudent(){
            this.dialogStudentListVisible = true
            this.getStudentList()
        },
        addStudent(user){
            if(!this.temp.users.some(u => u.userId === user.userId)){
                this.temp.users.push(user)
                this.dialogStudentListVisible = false
            }
        },
        getUserExamByUserId(userId){
            let userExam = this.userExamList.filter(item => item.userId === userId)[0]
            return userExam
        },
        startExam(){
            this.dialogCheckCameraVisible = true
        },
        fetchExamRecord(userId, examId){
            fetchExamRecord(userId, examId).then(response => {
                this.$router.push(`/videoPlayer/${response.data.record.uuid}`)
            })
        }
    }
}
</script>