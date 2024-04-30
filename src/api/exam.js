import request from '@/utils/request'

export function fetchExam(query){
    return request({
        url: '/exam/list',
        method: 'get',
        params: query
    })
}

export function fetchExamDetail(examId){
    return request({
        url: '/exam/detail',
        method: 'get',
        params: {examId}
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