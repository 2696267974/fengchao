import {request} from '@/utils/request';

// 获取列表
export function queryList(query) {
  return request({
    url: '/api/sku-inventory/list',
    method: 'get',
    params: query
  });
}

//新增
export function add() {
  return request({
    url: "/api/sku-inventory/add",
    method: "post",
    data: data,
  });
}
//修改
export function edit(data,id) {
  return request({
    url: "/api/sku-inventory/update"+id,
    method: "put",
    data:data
  });
}


//删除
export function del(data) {
  return request({
    url: "/api/sku-inventory/delete",
    method: "delete",
    data:data
  });
}

