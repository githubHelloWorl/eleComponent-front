import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export const getAdminAssetTypeOne = (params) => {
    return getRequest('/adminAssetType/getOne', params)
}
export const getAdminAssetTypeList = (params) => {
    return getRequest('/adminAssetType/getByPage', params)
}
export const getAdminAssetTypeCount = (params) => {
    return getRequest('/adminAssetType/count', params)
}
export const addAdminAssetType = (params) => {
    return postRequest('/adminAssetType/insert', params)
}
export const editAdminAssetType = (params) => {
    return postRequest('/adminAssetType/update', params)
}
export const addOrEditAdminAssetType = (params) => {
    return postRequest('/adminAssetType/insertOrUpdate', params)
}
export const deleteAdminAssetType = (params) => {
    return postRequest('/adminAssetType/delByIds', params)
}