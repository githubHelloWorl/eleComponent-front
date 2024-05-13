import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export const getAdminAssetSupplierOne = (params) => {
    return getRequest('/adminAssetSupplier/getOne', params)
}
export const getAdminAssetSupplierList = (params) => {
    return getRequest('/adminAssetSupplier/getByPage', params)
}
export const getAdminAssetSupplierCount = (params) => {
    return getRequest('/adminAssetSupplier/count', params)
}
export const addAdminAssetSupplier = (params) => {
    return postRequest('/adminAssetSupplier/insert', params)
}
export const editAdminAssetSupplier = (params) => {
    return postRequest('/adminAssetSupplier/update', params)
}
export const addOrEditAdminAssetSupplier = (params) => {
    return postRequest('/adminAssetSupplier/insertOrUpdate', params)
}
export const deleteAdminAssetSupplier = (params) => {
    return postRequest('/adminAssetSupplier/delByIds', params)
}