import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export const getAdminAssetWareOne = (params) => {
    return getRequest('/adminAssetWare/getOne', params)
}
export const getAdminAssetWareList = (params) => {
    return getRequest('/adminAssetWare/getByPage', params)
}
export const getAdminAssetWareCount = (params) => {
    return getRequest('/adminAssetWare/count', params)
}
export const addAdminAssetWare = (params) => {
    return postRequest('/adminAssetWare/insert', params)
}
export const editAdminAssetWare = (params) => {
    return postRequest('/adminAssetWare/update', params)
}
export const addOrEditAdminAssetWare = (params) => {
    return postRequest('/adminAssetWare/insertOrUpdate', params)
}
export const deleteAdminAssetWare = (params) => {
    return postRequest('/adminAssetWare/delByIds', params)
}
export const getAutoCompleteNames = (params) => {
    return getRequest('/user/getAutoCompleteNames', params)
}