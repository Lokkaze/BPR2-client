import request from '@/utils/request'

export function fetchExam(query){
    return request({
        url: '/exam/list',
        method: 'get',
        params: query
    })
}

export function fetchExamDetail(id){
    return request({
        url: '/exam/detail',
        method: 'get',
        params: {id}
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

export function DeleteExam(id){
    return request({
        url: '/exam/delete',
        method: 'delete',
        params: {id}
    })
}