import json

import requests
import urllib3

from dazzlingShow.views import http_success_status

HENGWEI_SERVICE = 'http://122.112.197.225:8000/hengwei/'


def req_1(url, method='get', data=None, files=None, headers=None, file_name='token.txt', timeout=None):
    """
    http请求
    :param url:
    :param method:
    :param data:
    :param files:
    :param headers:
    :return:
    """
    # 参数处理
    method, fields = method.upper(), None
    # if method == 'POST' or method == 'PUT':
    #     headers = headers or {'Content-Type': 'application/json'}
    fields = data
    if files:
        for key, file in files.items():
            fields.update({key: (file.name, file.read())})
    # 请求
    http = urllib3.PoolManager(num_pools=40)
    token = get_token('hq', 'abcd12345678abcd', 'token.txt')
    if timeout is None:
        res = http.request(method, url=url + '&token=' + token, fields=fields, headers=headers)
        if res.status == 401:
            token = get_token('hq', 'abcd12345678abcd', file_name, flags=0)
            res = http.request(method, url=url + '&token=' + token, fields=fields, headers=headers)
    else:
        res = http.request(method, url=url + '&token=' + token, fields=fields, headers=headers,
                           timeout=timeout, retries=False)
        if res.status == 401:
            token = get_token('hq', 'abcd12345678abcd', file_name, flags=0)
            res = http.request(method, url=url + '&token=' + token, fields=fields, headers=headers,
                               timeout=timeout, retries=False)

    print(url + '&token=' + token)
    return handle_response(res)


def handle_response(res):
    """
    全局处理响应
    :param res:
    :return:
    """
    if res.status in http_success_status:
        try:
            return res.data.decode()
        except Exception as e:
            return res.data
    else:
        return '{"status": 600, "statusCode": %s , "msg": "接口异常"}' % str(res.status, )


def get_token(user, password, file_name, flags=1):
    with open(file_name, 'w+') as f:
        if flags == 1:
            content = f.read()
            try:
                token = json.loads(content)
                return token['token']
            except:
                token = None
                if token is None:
                    res = requests.get(
                        url=HENGWEI_SERVICE + 'api/token?_method=POST&username={}&password={}'.format('hq',
                                                                                                      'abcd12345678abcd'))
                    if res.status_code == 200:
                        f.write(res.text)
                        return json.loads(res.text)['token']
        else:
            res = requests.get(
                url=HENGWEI_SERVICE + 'api/token?_method=POST&username={}&password={}'.format(user, password))
            if res.status_code == 200:
                f.write(res.text)
                return json.loads(res.text)['token']



def alert_cookies_1(params):
    monitor_id = params.get('monitor_id')
    if monitor_id:
        url = 'ts/alert_cookies?@managed_id=[in]{0}'.format(monitor_id)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return res_1
    else:
        url = 'ts/alert_cookies?order_by=triggered_at%20DESC'
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return res_1


def network_device_list_1(params):
    monitor_type = params.get('monitor_type')
    by_level = params.get('by_level')
    by_type = params.get('by_type')
    offset = params.get('offset', 1)
    limit = params.get('limit', 10)
    if monitor_type:
        if by_level:
            url = 'ds/{0}?limit={1}&offset={2}&by_level={3}'.format(monitor_type, limit, offset, by_level)
        elif by_type:
            url = 'ds/{0}?limit={1}&offset={2}&by_type={3}'.format(monitor_type, limit, offset, by_type)
        else:
            url = 'ds/{0}?'.format(monitor_type)
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
        return res_1
    else:
        return '参数不足'


def alert_cookies_count_1(params):
    monitor_id = params.get('monitor_id')
    if monitor_id:
        url = 'ts/alert_cookies/count?@managed_id=[in]{0}'.format(monitor_id)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return res_1
    else:
        return '参数不足'

def monitor_detail_1(params):
    id = params.get('id')
    metric = params.get('metric')
    if id and metric:
        url = 'internal/s/managed_objects/{0}/{1}?'.format(id, metric)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get', timeout=0.5)
            res_1 = json.loads(res)
            return {'code': 0,
                    'msg': '',
                    'data': res_1}
        except:
            return {'code': 1,
                    'msg': '服务器错误',
                    'data': ''}


def network_device_object_1(params):
    id = params.get('id')
    if id:
        url = 'ds/{0}/{1}?'.format('network_host', id)
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
        return res_1

def alert_1(params):
    list_1 = []
    from_date = params.get('from_date')
    to_date = params.get('to_date')
    if from_date and to_date:
        url = 'ts/alerts?@triggered_at=[>]{0}&@triggered_at=[<]{1}'.format(from_date, to_date)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
            for x in res_1['value']:
                if x['status'] == 1:
                    list_1.append(x)
        except:
            return '服务器错误'
        return list_1

def network_device_count_1():
    url = 'ds/{0}/@count?'.format('network_device')
    res = req_1(url=HENGWEI_SERVICE + url, method='get')
    res = json.loads(res)
    return res
# cookie_str = '''tpt_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTMyNDE0MTIsImlhdCI6MTU1MzIzNzgxMiwiaXNzIjoiaGVuZ3dlaV9pdCIsInN1YiI6InRwdCJ9.u09VUZ7jsGLr5lZTLfg91VXx82UP6aD45o1yKwZtcMg; PLAY_SESSION=69311dc2aa54c6d5de0ba52941da7a4c9d71de14-_expire=1553246681&session_id=2c21dd23-23c5-4ecd-94e6-9c99eeefa093&_valid=true&_TS=1553246681&user=demo; PLAY_FLASH='''
#
#
# def req_1(url, cookie_str, method='get', data=None):
#     cookies2 = dict(map(lambda x: x.split('=', 1), cookie_str.split(";")))
#
#     header = {
#         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
#         'Host': '122.112.197.225:8000',
#         'Cookie': cookie_str
#     }
#
#     if method == "get":
#         res = requests.get(url, headers=header)
#         return res
#     else:
#         res = requests.post(url, headers=header, cookies=cookies2, data=data)
#         return res