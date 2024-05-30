<template>
  <div>
    <el-form label-position="left" label-width="70px">
        <el-row style="margin-bottom:50px;margin-top:10px;">
                <el-col :span="12" class="text-center">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <el-form-item label="UserId:" >
                                <span>{{ user.userId }}</span>
                            </el-form-item>                        
                        </div>
                        <div>
                            <el-col :span="12" class="text-center">
                                <el-form-item label="Name:" >
                                    <span>{{ user.name }}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="text-center">
                                <el-form-item label="Identification:">
                                    <span style="margin-left: 30px;">{{ isTeacherMethod() }}</span>
                                </el-form-item>
                            </el-col>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-button type="primary" @click="changePassword()">
                Change password
            </el-button>
            <el-button type="primary" @click="changeAvatar()">
                Change avatar
            </el-button>
    </el-form>

    <el-dialog title="Input your new password" :visible.sync="dialogChangePasswordVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp">
            <el-form-item prop="password">
                <el-input v-model="temp.password"></el-input>
            </el-form-item>

        </el-form>
        <el-button type="primary" @click="confirmPasswordChange()">
            Confirm change
        </el-button>
    </el-dialog>

    <el-dialog title="Change avatar" :visible.sync="dialogChangeAvatarVisible">
        <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        :data="uploadData">
        <el-button slot="trigger" size="small" type="primary">Choose file</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">Upload</el-button>
        </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getInfo, changePassword } from '@/api/user';
import { getToken } from '@/utils/auth';
import { mapGetters } from 'vuex';

const defaultFoam = {
    userId: 0,
    name: '',
    isTeacher: false,
    avatar: '',
    password: ''
}

export default {
    data(){
        return{
            user: Object.assign({}, defaultFoam),
            temp: {
                userId: 0,
                avatar: '',
                password: ''
            },
            dialogChangePasswordVisible: false,
            rules: {
                password: [{ required: true, message: 'password cannot be empty', trigger: 'change' },
                    {min: 6, message: 'The password can not be less than 6 digits', trigger: 'change'}
                ]
            },
            dialogChangeAvatarVisible: false,
            fileList: [],
            uploadUrl: '',
            uploadData: null
        }
    },
    computed: {
        ...mapGetters([
            'userId'
        ])
    },
    created(){
        this.fetchUser()
    },
    methods: {
        fetchUser(){
            getInfo(getToken()).then(response => {
                this.user = response.data
            })
        },
        isTeacherMethod() {
        if(this.user.isTeacher){
            return 'Teacher'
        }
        else return 'Student'
        },
        changePassword(){
            this.temp = {
                userId: this.user.userId,
                avatar: '',
                password: ''
            }
            this.dialogChangePasswordVisible = true
            this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
        })
        },
        confirmPasswordChange(){
            this.$refs['dataForm'].validate((valid) => {
                if(valid) {
                    changePassword(this.temp).then(response => {
                        console.log(response)
                        this.dialogChangePasswordVisible = false
                        this.logout()
                    })
                }
            })
        },
        changeAvatar(){
            this.dialogChangeAvatarVisible = true
            this.uploadUrl = `${process.env.VUE_APP_BASE_API}/record/upload/photo`
            this.uploadData = {
                userId: this.user.userId
            }
            // const windowFeatures = 'width=500,height=500,top=100,left=100,location=no,menubar=no,toolbar=no,resizable=no,scrollbars=no'
            // const shareCameraUrl = `${process.env.VUE_APP_LIVE_STREAM_URL}${this.userId}&statusMode=changeAvatar`
            // const newWindow = window.open(shareCameraUrl, '_blank', windowFeatures);
        },
        submitUpload() {
        this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        avatarUpload() {
            console.log("upload success")
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
    }
}
</script>
