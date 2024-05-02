<template>
    <div v-loading="loading">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
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
            <el-row style="margin-bottom:50px;">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>Student list:</span>
                        <el-button v-if="edit">
                            Add
                        </el-button>
                    </div>
                    <div>
                        <el-button type="primary" v-for="item in info.users" :key="item.userId">
                            <div>
                                {{ item.username }}
                            </div>
                            <div v-if="edit" style="position:absolute;right:0px;">
                                <span style="float: right ;margin-top: -20px;margin-right:5px;" @click="deleteEle(element)">
                                    <i style="color:#ff4949" class="el-icon-delete" />
                                </span>
                            </div>
                        </el-button>
                    </div>
                </el-card>
            </el-row>
            <el-row>
                <div v-if="edit">
                    <el-button @click="confirmEdit()">
                        Complete
                    </el-button>
                    <el-button @click="cancelEdit()">
                        Cancel
                    </el-button>
                </div>
                <div v-else>
                    <el-button @click="startEdit()">
                        Edit
                    </el-button>
                    <el-button>
                        Edit exam content
                    </el-button>
                </div>
                
            </el-row>
        </el-form>
        
    </div>
</template>
<script>
import { fetchExamDetail } from '@/api/exam';

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
            loading: true,
            info: Object.assign({}, defaultFoam),
            temp: Object.assign({}, defaultFoam),
            edit: false,
            statusOptions: ['Pending', 'Opening', 'Completed'],
            rules: {
                type: [{ required: true, message: 'type is required', trigger: 'change' }],
                startTimestamp: [{ type: 'date', required: true, message: 'startTimestamp is required', trigger: 'change' }],
                endTimestamp: [{ type: 'date', required: true, message: 'endTimestamp is required', trigger: 'change' }],
                title: [{ required: true, message: 'title is required', trigger: 'blur' }]
            }
        }
    },
    computed: {
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
        const id = this.$route.params.id
        this.fetchData(id)
    },
    methods: {
        fetchData(examId){
            this.loading = true
            fetchExamDetail(examId).then(response => {
                this.info = response.data.info
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
            this.temp = this.info
            this.edit = true
        },
        confirmEdit(){
            this.edit = false
        },
        cancelEdit(){
            this.edit = false
        }
    }
}
</script>