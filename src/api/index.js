import ajax from "../until/axios";
export function register(params) {
    return ajax.post('/api/user/register', params)
}
export function login(params) {
    return ajax.post('/api/user/login', params)
}
export function getList(params) {
    return ajax.post('/api/user/list', params)
}
export function addVideo(params) {
    return ajax.post('/api/user/tentVideo', params)
}
export function deleteList(params) {
    return ajax.post('/api/user/deleteList', params)
}
export function addPan(params) {
    return ajax.post('/api/user/pan', params)
}
export function selectData(params) {
    return ajax.post('/api/select', params)
}
export function updataPan(params) {
    return ajax.post('/api/updata/pan', params)
}
export function updataVideo(params) {
    return ajax.post('/api/updata/video', params)
}
