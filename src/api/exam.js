import request from '@/utils/request'

export function fetchExam(query){
    return request({
        url: '/exam/list',
        method: 'get',
        params: query
    })
}

export function CreateExam(data){
    return request({
        url: '/exam/create',
        method: 'post',
        data
    })
}

export function UpdateExam(data){
    return request({
        url: '/exam/update',
        method: 'post',
        data
    })
}

export function DeleteExam(examId){
    return request({
        url: '/exam/delete',
        method: 'delete',
        params: {examId}
    })
}

export function fetchExamDetail(examId){
    return request({
        url: '/exam/detail',
        method: 'get',
        params: {examId}
    })
}

export function updateExamDetail(data){
    return request({
        url: '/exam/detail/edit',
        method: 'post',
        data
    })
}

export function fetchStudentList(query){
    return request({
        url: '/exam/detail/studentList',
        method: 'get',
        params: query
    })
}

export function fetchQuestions(examId){
    return request({
        url: '/exam/detail/questions',
        method: 'get',
        params: {examId}
    })
}

export function updateQuestions(examId, data){
    return request({
        url: '/exam/detail/questions/edit',
        method: 'post',
        params: {examId},
        data
    })
}