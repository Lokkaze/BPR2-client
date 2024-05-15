<template>
  <div>
    <el-col>
        <el-table
        v-if="cheatList.length > 0"
        :data="cheatList"
        border
        fit
        highlight-current-row>
            <el-table-column label="studentId" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.userId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="studentName" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column label="cheatTime" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ formatTimestamp(row.timestamp) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="DeleteCheat" align="center" width="120">
                <template slot-scope="{row}">
                    <el-button @click="deleteCheat(row)">
                        <i style="color:#ff4949" class="el-icon-delete" />
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-col>
    <el-col>
        <el-table
        :data="userList"
        border
        fit
        highlight-current-row>
            <el-table-column label="studentId" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.userId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="studentName" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.username }}</span>
                </template>
            </el-table-column>
            <el-table-column label="status" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.userExamStatus }}</span>
                </template>
            </el-table-column>
            <el-table-column label="camera" align="center" width="330">
                <template slot-scope="{row}">
                    <videoPlayer :userId="`${row.userId}`"></videoPlayer>
                </template>
            </el-table-column>
            <el-table-column label="confirmCheat" align="center" width="120">
                <template slot-scope="{row}">
                    <el-button @click="confirmCheatVisible(row.userId)">
                        <i style="color:#ff4949" class="el-icon-delete" />
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-col>

    <el-dialog title="Are you sure about this student is cheating?" :visible.sync="dialogConfirmCheatVisible">
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfirmCheatVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="confirmCheat()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchStreamList } from '@/api/exam';
import videoPlayer from '../videoPlayer'
import { DeleteCheat, confirmCheat, fetchCheatList } from '@/api/stream';
import { fetchUsername } from '@/api/user';
export default {
    components: {
        videoPlayer
    },
    data() {
        return {
            examId: 0,
            userList: null,
            cheatList: [],
            dialogConfirmCheatVisible: false,
            tempId: 0
        }
    },
    created() {
        this.examId = this.$route.params.id
        this.getStreamList()
        this.fetchCheatListInit()
    },
    methods: {
        getStreamList(){
            fetchStreamList(this.examId).then(response => {
                this.userList = response.data.list
                console.log(this.userList)
            })
        },
        fetchCheatListInit(){
            fetchCheatList(this.examId).then(response => {
                this.cheatList = response.data.list
                this.fetchCheatListLoop()
            })
        },
        fetchCheatList(){
            fetchCheatList(this.examId).then(response => {
                this.cheatList = response.data.list
            })
        },
        fetchCheatListLoop(){
            fetchCheatList(this.examId).then(response => {
                this.findNewCheat(this.cheatList, response.data.list)
                console.log(this.cheatList)
                setTimeout(this.fetchCheatListLoop, 5000)
            })
        },
        findNewCheat(newList, list){
            const newCheats = list.filter(item => !newList.some(cheat => cheat.examId === item.examId && cheat.userId === item.userId && cheat.timestamp === item.timestamp))
            if(newCheats.length > 0) {
                for(let item of newCheats) {
                    alert(`Cheat detected! Please check student ${item.username}`)
                }
                console.log('cheat detected')
            }
            newList.push(...newCheats)
            return newList
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
        deleteCheat(item) {
            DeleteCheat(item.userId, item.examId, item.timestamp).then(response => {
                console.log(response)
                this.fetchCheatList()
            })
        },
        confirmCheatVisible(userId) {
            this.tempId = userId
            this.dialogConfirmCheatVisible = true
        },
        confirmCheat() {
            confirmCheat(this.tempId, this.examId).then(response => {
                this.getStreamList()
                this.dialogConfirmCheatVisible = false
                console.log(response)
            })
        }
    }
}
</script>