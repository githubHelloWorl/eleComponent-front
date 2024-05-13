import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

// 分页获取数据
export const getAdminAssetsList = (params) => {
    return getRequest('/adminAssets/getByPage', params)
}
export const getMyAdminAssetsList = (params) => {
    return getRequest('/adminAssets/getByMyApplyPage', params)
}
export const getByNotAuditPage = (params) => {
    return getRequest('/adminAssets/getByNotAuditPage', params)
}
// 添加
export const addAdminAssets = (params) => {
    return postRequest('/adminAssets/insertOrUpdate', params)
}
// 编辑
export const editAdminAssets = (params) => {
    return postRequest('/adminAssets/insertOrUpdate', params)
}
// 删除
export const deleteAdminAssets = (params) => {
    return postRequest('/adminAssets/delByIds', params)
}
export const getRosterUserByPage = (params) => {
    return getRequest('/user/getByPage', params)
}
export const outWage = (params) => {
    return postRequest('/adminAssets/outWage', params)
}
// TODO 修改请求方式 GET => POST
export const getAutoCompleteNames = (params) => {
    return postRequest('/user/getAutoCompleteNames', params)
}
export const getAllWareList = (params) => {
    return getRequest('/adminAssetWare/getAll', params)
}
export const applyAssets = (params) => {
    return postRequest('/adminAssets/apply', params)
}
export const disApplyAssets = (params) => {
    return postRequest('/adminAssets/disApply', params)
}
export const applySuccessAssets = (params) => {
    return postRequest('/adminAssets/applySuccess', params)
}
export const applyFailAssets = (params) => {
    return postRequest('/adminAssets/applyFail', params)
}