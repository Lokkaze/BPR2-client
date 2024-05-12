<template>
  <div v-loading="loading">
    <el-form v-if="edit" ref="dataform" label-position="left" label-width="70px">
        <el-row v-for="question in temp" :key="question.questionId" style="margin-bottom:20px;margin-top:10px;">
            <el-col class="text-center">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <el-button style="color:#ff4949" @click="deleteQuestion(question.questionId-1)">
                            Delete question
                        </el-button>
                        <span>
                            {{ question.questionId }}. 
                            <el-select v-model="question.type" clearable>
                                <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                            <el-input v-model="question.title"></el-input>
                        </span>
                    </div>
                    <div v-if="question.type === 'SingleChoice' || question.type === 'MultipleChoice'">
                        <div v-for="answer in question.examQuestionAnswers" :key="answer.examQuestionAnswersId" style="margin-bottom:10px;">
                            <el-button @click="deleteAnswer(question.questionId-1, answer.answerId-1)">
                                <i style="color:#ff4949" class="el-icon-delete" />
                            </el-button>
                            <el-input v-model="answer.content"></el-input>
                        </div>
                        <el-button type="primary" @click="addAnswer(question.questionId)">
                            Add
                        </el-button>
                    </div>
                    <div v-if="question.type === 'Quiz'">
                        <el-input class="edit-input" placeholder="Enter your answer here"></el-input>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-button type="primary" @click="addQuestion">
            Add new question
        </el-button>
        <el-button type="primary" @click="confirmEdit">
            Confirm edit
        </el-button>
        <el-button type="primary" @click="cancelEdit">
            Cancel edit
        </el-button>
    </el-form>
    <el-form v-else ref="dataform" label-position="left" label-width="70px">
        <el-row v-for="question in questions" :key="question.questionId" style="margin-bottom:20px;margin-top:10px;">
            <el-col class="text-center">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ question.questionId }}. {{ question.title }}</span>
                    </div>
                    <div v-if="question.type === 'SingleChoice'">
                        <el-radio-group v-model="answerList[question.questionId-1].answer">
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
                        <el-input class="edit-input" placeholder="Enter your answer here" v-model="answerList[question.questionId-1].answer"></el-input>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-button v-if="isTeacher" type="primary" style="margin-right:10px;" @click="startEdit">
            Edit
        </el-button>
        <el-button v-if="!isTeacher" type="primary" style="margin-right:10px;" @click="submitAnswers">
            Submit Answer
        </el-button>
    </el-form>

  </div>
</template>

<script>
import { title } from '@/settings'
import { fetchQuestions, submitAnswersAPI, updateQuestions } from '../../api/exam'
import { mapGetters } from 'vuex'
import { fetchRecords, updateExamRecord } from '@/api/stream';
export default {
    data(){
        return{
            examId: 0,
            loading: true,
            questions: null,
            answerList: [],
            temp: null,
            edit: false,
            tempAnswerList: [],
            typeOptions: ['SingleChoice', 'MultipleChoice', 'Quiz']
        }
    },
    computed: {
        ...mapGetters([
            'isTeacher',
            'userId'
        ])
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
                this.answerList = []
                let answerIndex = 1
                for(let question of this.questions){
                    let answer
                    switch(question.type){
                        case 'SingleChoice':
                            answer = {
                                answerIndex: answerIndex,
                                type: 'SingleChoice',
                                answer: 0
                            };
                            this.answerList.push(answer)
                            break
                        case 'MultipleChoice':
                            answer = {
                                answerIndex: answerIndex,
                                type: 'MultipleChoice',
                                answer: [],
                                selectAll: false
                            };
                            this.answerList.push(answer)
                            break
                        case 'Quiz':
                            answer = {
                                answerIndex: answerIndex,
                                type: 'Quiz',
                                answer: ''
                            };
                            this.answerList.push(answer)
                            break
                    }
                    answerIndex++
                }
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
        },
        startEdit(){
            this.temp = JSON.parse(JSON.stringify(this.questions))
            this.edit = true
        },
        deleteQuestion(questionIndex){
            this.temp.splice(questionIndex, 1)
            for(let i = questionIndex; i < this.temp.length; i++) {
                this.temp[i].questionId--
            }
        },
        addQuestion(){
            let newQuestionId = 1

            if(this.temp.length > 0 && this.temp[this.temp.length-1].questionId){
                newQuestionId = this.temp[this.temp.length-1].questionId+1
            }

            let newQuestion = {
                examId: this.examId,
                questionId: newQuestionId,
                type: 'SingleChoice',
                title: '',
                examQuestionAnswers: []
            }
            this.temp.push(newQuestion)
        },
        deleteAnswer(questionIndex, answerIndex){
            this.temp[questionIndex].examQuestionAnswers.splice(answerIndex, 1)
            for(let i = answerIndex; i < this.temp[questionIndex].examQuestionAnswers.length; i++) {
                this.temp[questionIndex].examQuestionAnswers[i].answerId--
            }
        },
        addAnswer(questionId){
            let newAnswerId = 1
            if(this.temp[questionId-1].examQuestionAnswers[this.temp[questionId-1].examQuestionAnswers.length-1]){
                newAnswerId = this.temp[questionId-1].examQuestionAnswers[this.temp[questionId-1].examQuestionAnswers.length-1].answerId+1
            }
            let newAnswer = {
                examId: this.examId,
                questionId: questionId,
                content: '',
                answerId: newAnswerId
            }
            this.temp[questionId-1].examQuestionAnswers.push(newAnswer)
        },
        confirmEdit(){
            updateQuestions(this.examId, this.temp).then(() => {
                this.fetchData(this.examId)
                this.edit = false
                this.$notify({
                    title: 'Success',
                    message: 'Created Successfully',
                    type: 'success',
                    duration: 2000
                })
            })
        },
        cancelEdit(){
            this.edit = false
        },
        convertToString(data) {
            if (typeof data === 'string' || typeof data === 'number') {
                return data.toString();
            } else if (Array.isArray(data)) {
                return data.join(','); // 将数组转换为以逗号分隔的字符串
            } else {
                return ''; // 如果是其他类型，则返回空字符串或其他默认值
            }
        },
        submitAnswers(){
            let studentAnswerList = []
            for(let answer of this.answerList){
                let studentAnswer = {
                    userId: this.userId,
                    examId: this.examId,
                    questionId: answer.answerIndex,
                    content: this.convertToString(answer.answer),
                    type: answer.type
                }
                studentAnswerList.push(studentAnswer)
            }
            console.log(studentAnswerList)
            submitAnswersAPI(studentAnswerList).then(submitAnswersAPIResponse => {
                fetchRecords().then(fetchRecordsResponse => {
                    console.log(fetchRecordsResponse)
                    console.log('userId:'+this.userId)
                    const processedRecord = fetchRecordsResponse.data.filter(item => item.stream == this.userId && item.progress === true)
                    console.log(processedRecord)
                    const examRecord = {
                        examId: this.examId,
                        userId: this.userId,
                        uuid: processedRecord[0].uuid
                    }
                    updateExamRecord(examRecord).then(updateExamRecordResponse => {
                        this.$router.push(`/exam/examInfo/${this.examId}`)
                    })
                } )
            })
        }
    }
}
</script>
