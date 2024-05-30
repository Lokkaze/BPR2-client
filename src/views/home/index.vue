<template>
  <div class="home-container">
    <div class="home-text">name: {{ name }}</div>
    <div class="home-text">userId: {{ userId }}</div>
    <div class="home-text">You are {{ isTeacherMethod() }}</div>
    <div v-if="!isTeacher" class="home-text">{{ avatarCheck }}</div>
  </div>
</template>

<script>
import { getInfo } from '@/api/user';
import { getToken } from '@/utils/auth';
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name',
      'isTeacher',
      'userId'
    ])
  },
  data() {
    return {
      avatarCheck: ""
    }
  },
  created() {
    this.checkAvatar()
  },
  methods: {
    isTeacherMethod() {
      if(this.isTeacher){
        return 'Teacher'
      }
      else return 'Student'
    },
    checkAvatar() {
      getInfo(getToken()).then(response => {
        if(response.data.avatar === "" || response.data.avatar === null) {
          this.avatarCheck = "Remember to upload your avatar before attempt!"
          console.log("avatar")
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
