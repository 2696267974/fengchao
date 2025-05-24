import {request} from '@/utils/request';

export function queryList(query) {
  return request({
    url: '/api/sku-inventory',
    method: 'get',
    params: query
  });
}
// export function contactsList(query) {
//   return request({
//     url: "/api/v1/customerContacts",
//     method: "get",
//     params: query,
//   });
// }