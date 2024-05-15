import requestStream from '@/utils/requestStream'
import request from '@/utils/request'

export function fetchRecords(){
    return requestStream({
        url: '/terraform/v1/hooks/record/files',
        method: 'post'
    })
}

export function fetchExamRecord(examId, userId){
    return request({
        url: '/record',
        method: 'get',
        params: {examId, userId}
    })
}

export function updateExamRecord(data){
    return request({
        url: '/record/update',
        method: 'post',
        data
    })
}

export function fetchCheatList(examId){
    return request({
        url: '/record/cheat/list',
        method: 'get',
        params: {examId}
    })
}

export function DeleteCheat(userId, examId, timestamp){
    return request({
        url: '/record/cheat/delete',
        method: 'delete',
        params: {userId, examId, timestamp}
    })
}

export function confirmCheat(userId, examId){
    return request({
        url: '/record/cheat/confirm',
        method: 'get',
        params: {userId, examId}
    })
}