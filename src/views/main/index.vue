<template>
  <div class="main-container">
    <div class="main-text">name: {{ name }}</div>
    <div class="main-text">isTeacher: {{ isTeacherMethod() }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Main',
  computed: {
    ...mapGetters([
      'name',
      'isTeacher'
    ])
  },
  methods: {
    isTeacherMethod() {
      if(this.isTeacher){
        return 'Teacher'
      }
      else return 'Student'
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
