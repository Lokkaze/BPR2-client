<template>
  <div>
    <videoPlayer v-for="item in userList" :key="item" :userId="item"></videoPlayer>
  </div>
</template>

<script>
import { fetchStreamList } from '@/api/exam';
import videoPlayer from '../videoPlayer'
export default {
    components: {
        videoPlayer
    },
    data() {
        return {
            examId: 0,
            userList: null
        }
    },
    created() {
        this.examId = this.$route.params.id
        this.getStreamList()
    },
    methods: {
        getStreamList(){
            fetchStreamList(this.examId).then(response => {
                this.userList = response.data.list.map(item => String(item.userId))
                console.log(this.userList)
            })
        }
    }
}
</script>