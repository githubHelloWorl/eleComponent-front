import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export const getAdminAssetUnitOne = (params) => {
    return getRequest('/adminAssetUnit/getOne', params)
}
export const getAdminAssetUnitList = (params) => {
    return getRequest('/adminAssetUnit/getByPage', params)
}
export const getAdminAssetUnitCount = (params) => {
    return getRequest('/adminAssetUnit/count', params)
}
export const addAdminAssetUnit = (params) => {
    return postRequest('/adminAssetUnit/insert', params)
}
export const editAdminAssetUnit = (params) => {
    return postRequest('/adminAssetUnit/update', params)
}
export const addOrEditAdminAssetUnit = (params) => {
    return postRequest('/adminAssetUnit/insertOrUpdate', params)
}
export const deleteAdminAssetUnit = (params) => {
    return postRequest('/adminAssetUnit/delByIds', params)
}