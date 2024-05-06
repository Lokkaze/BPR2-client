<template>
  <div v-loading="loading">
    <el-form ref="dataform" label-position="left" label-width="70px">
        <el-row v-for="question in questions" :key="question.questionId" style="margin-bottom:50px;margin-top:10px;">
            <el-col class="text-center">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ question.questionId }}. {{ question.title }}</span>
                    </div>
                    <div v-if="question.type === 'SingleChoice'">
                        <el-radio-group>
                            <div v-for="answer in question.examQuestionAnswers" :key="answer.examQuestionAnswersId" style="margin-bottom:5px;">
                                <el-radio :label="answer.answerId" border>
                                {{ answer.content }}
                            </el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                    <div v-if="question.type === 'MultipleChoice'">
                        <el-checkbox-group v-model="answerList[question.questionId-1].answer">
                            <div v-for="answer in question.examQuestionAnswers" :key="answer.examQuestionAnswersId" style="margin-bottom:5px;">
                                <el-checkbox :label="answer.answerId">
                                    {{ answer.content }}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                        <el-checkbox v-model="answerList[question.questionId-1].selectAll" @change="selectAllAnswers(question.questionId-1, $event)">
                            All
                        </el-checkbox>
                    </div>
                    <div v-if="question.type === 'Quiz'">
                        <el-input class="edit-input" placeholder="Enter your answer here"></el-input>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-form>

  </div>
</template>

<script>
import { fetchQuestions } from '../../api/exam'
export default {
    data(){
        return{
            examId: 0,
            loading: true,
            questions: null,
            answerList: []
        }
    },
    created(){
        this.examId = this.$route.params.id
        this.fetchData(this.examId)
    },
    methods: {
        fetchData(examId){
            this.loading = true
            fetchQuestions(examId).then(response => {
                this.questions = response.data.questions
                for(let question of this.questions){
                    let answer
                    switch(question.type){
                        case 'SingleChoice':
                            answer = {
                                type: 'SingleChoice',
                                answer: 0
                            };
                            this.answerList.push(answer)
                            break
                        case 'MultipleChoice':
                            answer = {
                                type: 'MultipleChoice',
                                answer: [],
                                selectAll: false
                            };
                            this.answerList.push(answer)
                            break
                        case 'Quiz':
                            answer = {
                                type: 'Quiz',
                                answer: ''
                            };
                            this.answerList.push(answer)
                            break
                    }
                }
                console.log(this.answerList)
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        },
        selectAllAnswers(id, event){
            if(event) {
                this.answerList[id].answer = this.questions[id].examQuestionAnswers.map(answer => answer.answerId);
                this.answerList[id].selectAll = true
            }
            else {
                this.answerList[id].answer = []
                this.answerList[id].selectAll = false

            }
        }
    }
}
</script>
