import csv
import json
import datetime
from pprint import pprint

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view

from gfy.utils import req_1, HENGWEI_SERVICE, network_device_list_1, alert_cookies_count_1, network_device_object_1, \
    monitor_detail_1, alert_1, alert_cookies_1, network_device_count_1


@api_view(['GET'])
def network_device_count(request):
    by_level = request.query_params.get('by_level')
    by_type = request.query_params.get('by_type')
    monitor_type = request.query_params.get('monitor_type')
    url = 'ds/{0}/@count?'.format(monitor_type)
    res = req_1(url=HENGWEI_SERVICE + url, method='get')
    res = json.loads(res)
    return JsonResponse(res, safe=False)


@api_view(['GET'])
def network_device_list(request):
    monitor_type = request.query_params.get('monitor_type')
    by_level = request.query_params.get('by_level')
    by_type = request.query_params.get('by_type')
    offset = request.query_params.get('offset', 1)
    limit = request.query_params.get('limit', 10)
    if monitor_type:
        if by_level:
            url = 'ds/{0}?limit={1}&offset={2}&by_level={3}'.format(monitor_type, limit, offset, by_level)
        elif by_type:
            url = 'ds/{0}?limit={1}&offset={2}&by_type={3}'.format(monitor_type, limit, offset, by_type)
        else:
            # url = 'ds/{0}?limit={1}&offset={2}'.format(monitor_type,limit, offset)
            url = 'ds/{0}?'.format(monitor_type)
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
        return JsonResponse(res_1, safe=False)
    else:
        return HttpResponse('参数不足')


@api_view(['GET'])
def network_device_object(request):
    id = request.query_params.get('id')
    monitor_type = request.query_params.get('monitor_type')
    if id and monitor_type:
        url = 'ds/{0}/{1}?'.format(monitor_type, id)
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})
    else:
        return JsonResponse({'code': 0,
                             'msg': '参数不足',
                             'data': ''})


@api_view(['GET'])
def monitor_detail(request):
    id = request.query_params.get('id')
    metric = request.query_params.get('metric')
    if id and metric:
        url = 'internal/s/managed_objects/{0}/{1}?'.format(id, metric)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
            return JsonResponse({'code': 0,
                                 'msg': '',
                                 'data': res_1})
        except:
            return JsonResponse({'code': 1,
                                 'msg': '服务器错误',
                                 'data': ''})

    else:
        return JsonResponse({'code': 1,
                             'msg': '参数不足',
                             'data': ''})


@api_view(['GET'])
def get_network_device_port_count(request):
    device_id = request.query_params.get('device_id')
    if device_id:
        url = 'ds/network_device_port/@count?@device_id={}'.format(device_id)
    else:
        url = 'ds/network_device_port/@count?'
    try:
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
    except:
        res_1 = '服务器错误'
    return JsonResponse({'code': 0,
                         'msg': '',
                         'data': res_1})


@api_view(['GET'])
def get_network_device_port(request):
    device_id = request.query_params.get('device_id')
    offset = request.query_params.get('offset', 1)
    limit = request.query_params.get('limit', 10)
    if device_id:
        url = 'ds/network_device_port?@device_id={0}&limit={1}&offset={2}'.format(device_id, limit, offset)
    else:
        # url = '/ds/network_device_port?limit={0}&offset={1}'.format(limit, offset)
        url = 'ds/network_device_port?'
    try:
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
    except:
        res_1 = '服务器错误'
    return JsonResponse({'code': 0,
                         'msg': '',
                         'data': res_1})


@api_view(['GET'])
def net_detail(request):
    id = request.query_params.get('id')
    name = request.query_params.get('name')
    if id and name:
        url = 'internal/s/managed_objects/{0}/{1}?'.format(id, name)
        res = req_1(url=HENGWEI_SERVICE + url, method='get')
        res_1 = json.loads(res)
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})
    else:
        return HttpResponse('参数缺失')


@api_view(['GET'])
def alert_cookies_count(request):
    monitor_id = request.query_params.get('monitor_id')
    if monitor_id:
        url = 'ts/alert_cookies/count?@managed_id={0}'.format(monitor_id)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})
    else:
        url = 'ts/alert_cookies/count?'
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})


@api_view(['GET'])
def alert_cookies(request):
    monitor_id = request.query_params.get('monitor_id')
    if monitor_id:
        url = 'ts/alert_cookies?@managed_id={0}'.format(monitor_id)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})
    else:
        url = 'ts/alert_cookies?'
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})


@api_view(['GET'])
def alert(request):
    monitor_id = request.query_params.get('monitor_id')
    if monitor_id:
        url = 'ts/alerts?@managed_id={0}'.format(monitor_id)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})
    else:
        url = 'ts/alerts?'
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})


@api_view(['GET'])
def alert_count(request):
    monitor_id = request.query_params.get('monitor_id')
    if monitor_id:
        url = 'ts/alerts/count?@managed_id={0}'.format(monitor_id)
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})
    else:
        url = 'ts/alerts/count?'
        try:
            res = req_1(url=HENGWEI_SERVICE + url, method='get')
            res_1 = json.loads(res)
        except:
            res_1 = '服务器错误'
        return JsonResponse({'code': 0,
                             'msg': '',
                             'data': res_1})


@api_view(['GET'])
def service_alert(request):
    monitor_type = request.query_params.get('monitor_type')
    monitor_id = ''
    params = {'monitor_type': monitor_type}
    res = network_device_list_1(params)
    for x in res['value']:
        monitor_id += str(x['id']) + ','
    params_1 = {'monitor_id': monitor_id[:-2]}
    try:
        res_1 = alert_cookies_count_1(params_1)
    except:
        res_1 = {'value': '服务器异常'}
    return HttpResponse(str(res_1['value']))


@api_view(['GET'])
def cpu_top(request):
    res_2 = []
    params = {'monitor_type': 'network_host'}
    res = network_device_list_1(params)
    for x in res['value']:
        params = {'id': x['id'], 'metric': 'cpu2'}
        res_3 = network_device_object_1(params)
        res_1 = monitor_detail_1(params)
        if 'error' in res_1['data'] or res_1['code'] != 0:
            pass
        else:
            sum = 0
            avg = 0
            if len(res_1['data']['value']) > 0:
                for y in res_1['data']['value']:
                    sum += y['cpu_percent']
                avg = sum / len(res_1['data']['value'])

            res_2.append({"domain": 'IP:' + res_3['value']['address'], 'type': avg})
    return JsonResponse(res_2, safe=False)


@api_view(['GET'])
def get_other_device(request):
    list_1 = []
    list_2 = []
    list_3 = []
    url = 'ds/{0}?'.format('network_device')
    url_1 = 'ds/{0}?'.format('network_host')
    url_2 = 'ds/{0}?'.format('network_node')
    res = req_1(url=HENGWEI_SERVICE + url, method='get')
    res_1 = req_1(url=HENGWEI_SERVICE + url_1, method='get')
    res_2 = req_1(url=HENGWEI_SERVICE + url_2, method='get')
    res = json.loads(res)['value']
    res_1 = json.loads(res_1)['value']
    res_2 = json.loads(res_2)['value']
    for x in res_2:
        list_3.append(x['id'])
    for x in res:
        list_1.append(x['id'])
    for x in res_1:
        list_2.append(x['id'])
    y = list(set(list_1).difference(set(list_2)))
    z = list(set(y).difference(set(list_3)))
    return JsonResponse(z, safe=False)


@api_view(['GET'])
def get_current_alert_percent(request):
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    device_count = network_device_count_1()['value']
    d = datetime.datetime.now()
    # average = []
    sum = 0
    for i in range(7):
        manage = []
        s = datetime.timedelta(days=1)
        d = d - s
        d2 = d + s
        year = d.year
        month = d.month
        day = d.day
        day2 = d2.day
        year2 = d2.year
        month2 = d2.month
        time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
        time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
        params = {'from_date': time_1, 'to_date': time_2}
        res = alert_1(params)['value']
        for x in res:
            if x['managed_id'] in device_id:
                manage.append(x['managed_id'])
        manage = set(manage)
        sum += len(manage) / int(device_count)
        # average.append({time_2: len(manage) / int(device_count)})
    percent = str(round((sum / 7) * 100, 2)) + '%'

    # average.append(percent)
    return HttpResponse(percent)


@api_view(['GET'])
def get_current_alert_count(request):
    manage = []
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    d = datetime.datetime.now()
    s = datetime.timedelta(days=7)
    d2 = d - s
    year = d.year
    month = d.month
    day = d.day
    year2 = d2.year
    month2 = d2.month
    day2 = d2.day
    time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
    time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
    params = {'from_date': time_2, 'to_date': time_1}
    res = alert_1(params)['value']
    for x in res:
        if x['managed_id'] in device_id:
            manage.append(x['managed_id'])
    return HttpResponse(len(manage))


@api_view(['GET'])
def get_current_status(request):
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    device_count = network_device_count_1()['value']
    d = datetime.datetime.now()
    sum = 0
    for i in range(7):
        manage = []
        s = datetime.timedelta(days=1)
        d = d - s
        d2 = d + s
        year = d.year
        month = d.month
        day = d.day
        day2 = d2.day
        year2 = d2.year
        month2 = d2.month
        time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
        time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
        params = {'from_date': time_1, 'to_date': time_2}
        res = alert_1(params)['value']
        for x in res:
            if x['managed_id'] in device_id:
                manage.append(x['managed_id'])
        manage = set(manage)
        sum += len(manage) / int(device_count)
    if sum / 7 <= 0.01:
        str = '本周系统稳定性：优秀'
    elif 0.01 <= sum / 7 <= 0.05:
        str = '本周系统稳定性：良好'
    else:
        str = '本周系统稳定性：差'

    return HttpResponse(str)


@api_view(['GET'])
def get_histogram(request):
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    device_count = network_device_count_1()['value']
    d = datetime.datetime.now()
    manage = []
    for i in range(7):
        s = datetime.timedelta(days=1)
        d = d - s
        d2 = d + s
        year = d.year
        month = d.month
        day = d.day
        day2 = d2.day
        year2 = d2.year
        month2 = d2.month
        time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
        time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
        params = {'from_date': time_1, 'to_date': time_2}
        res = alert_1(params)['value']
        for x in res:
            if x['managed_id'] in device_id:
                manage.append(x['managed_id'])
    manage = set(manage)
    res_1 = {"x": ["监控数量", "发生故障数量"], "y": [[device_count, 0], [0, len(manage)]]}
    return JsonResponse(res_1, safe=False)


@api_view(['GET'])
def get_histogram_1(request):
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    device_count = network_device_count_1()['value']
    d = datetime.datetime.now()
    manage = []
    for i in range(7):
        s = datetime.timedelta(days=1)
        d = d - s
        d2 = d + s
        year = d.year
        month = d.month
        day = d.day
        day2 = d2.day
        year2 = d2.year
        month2 = d2.month
        time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
        time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
        params = {'from_date': time_1, 'to_date': time_2}
        res = alert_1(params)['value']
        for x in res:
            if x['managed_id'] in device_id:
                manage.append(x['managed_id'])
    manage = set(manage)
    res_1 = [{"value": len(manage), "name": "报警数"}, {"value": device_count, "name": "总数"}]
    return JsonResponse(res_1, safe=False)


@api_view(['GET'])
def get_line_chart(request):
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    d = datetime.datetime.now()
    time_list = []
    alert_count = []
    for i in range(7):
        manage = []
        s = datetime.timedelta(days=1)
        d = d - s
        d2 = d + s
        year = d.year
        month = d.month
        day = d.day
        day2 = d2.day
        year2 = d2.year
        month2 = d2.month
        time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
        time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
        params = {'from_date': time_1, 'to_date': time_2}
        res = alert_1(params)['value']
        time_list.append('%d-%02d-%02d' % (year2, month2, day2 - 1))
        for x in res:
            if x['managed_id'] in device_id:
                manage.append(x['managed_id'])
        manage = set(manage)
        alert_count.append(len(manage))
    res_1 = {"x": time_list, "y": [alert_count]}
    return JsonResponse(res_1, safe=False)


@api_view(['GET'])
def get_temperature(request):
    # humiture,AnalogValue,DrylnValue,OutletValue
    params = request.query_params.get('params')
    url = 'internal/s/managed_objects/3129/AnalogValue?'
    res = req_1(HENGWEI_SERVICE + url)['value']
    temper_list = []
    humi_list = []
    sum_temper = 0
    sum_humi = 0
    for x in res:
        if x['key'] in ['1', '3', '5']:
            temper_list.append(x['value'])
        elif x['key'] in ['2', '4', '6']:
            humi_list.append(x['value'])
    for x in temper_list:
        sum_temper += int(x)
    for x in humi_list:
        sum_humi += int(x)
    if params == 'temperature':
        return JsonResponse([{'value': sum_temper / 3, 'name': ''}])
    else:
        return JsonResponse([{'value': sum_humi / 3, 'name': ''}])


@api_view(['GET'])
def Fault_overview(request):
    monitor_type = request.query_params.get('monitor_type')
    device_str = ''
    node_str = ''
    host_str = ''
    list_1 = []
    list_2 = []
    list_3 = []
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    node_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_node'})['value']]
    host_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_host'})['value']]
    for x in device_id:
        device_str += str(x) + ','
    for x in node_id:
        node_str += str(x) + ','
    for x in host_id:
        host_str += str(x) + ','
    device_params = device_str[0:-1]
    node_params = node_str[0:-1]
    host_params = host_str[0:-1]
    res_1 = alert_cookies_1({'monitor_id': device_params})['value']
    res_2 = alert_cookies_1({'monitor_id': node_params})['value']
    res_3 = alert_cookies_1({'monitor_id': host_params})['value']
    for x in res_1:
        list_1.append(x['managed_id'])
    len_1 = len(set(list_1))
    for x in res_2:
        list_2.append(x['managed_id'])
    len_2 = len(set(list_2))
    for x in res_3:
        list_3.append(x['managed_id'])
    len_3 = len(set(list_3))
    if monitor_type == 'network_device':
        return HttpResponse(len_1)
    elif monitor_type == 'network_node':
        return HttpResponse(len_2)
    else:
        return HttpResponse(len_3)


@api_view(['GET'])
def get_alert_device_content_1(request):
    res = alert_cookies_1({})
    res = res['value'][0]['content']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_content_2(request):
    res = alert_cookies_1({})
    res = res['value'][1]['content']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_content_3(request):
    res = alert_cookies_1({})
    res = res['value'][2]['content']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_content_4(request):
    res = alert_cookies_1({})
    res = res['value'][3]['content']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_1(request):
    res = alert_cookies_1({})
    res = res['value'][0]['managed_id']
    manage_url = 'ds/network_device/{}?'.format(res)
    res = req_1(HENGWEI_SERVICE + manage_url)
    res = json.loads(res)
    res = res['value']['address']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_2(request):
    res = alert_cookies_1({})
    res = res['value'][1]['managed_id']
    manage_url = 'ds/managed_object/{}?'.format(res)
    res = req_1(HENGWEI_SERVICE + manage_url)
    res = json.loads(res)
    res = res['value']['address']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_3(request):
    res = alert_cookies_1({})
    res = res['value'][2]['managed_id']
    manage_url = 'ds/managed_object/{}?'.format(res)
    res = req_1(HENGWEI_SERVICE + manage_url)
    res = json.loads(res)
    res = res['value']['address']
    return HttpResponse(res)


@api_view(['GET'])
def get_alert_device_4(request):
    res = alert_cookies_1({})
    res = res['value'][3]['managed_id']
    manage_url = 'ds/managed_object/{}?'.format(res)
    res = req_1(HENGWEI_SERVICE + manage_url)
    res = json.loads(res)
    res = res['value']['address']
    return HttpResponse(res)


@api_view(['GET'])
def Ups_Electrical_voltage(request):
    registerid = request.query_params.get('registerid')
    if registerid:
        url = 'internal/s/managed_objects/4487/holdingRegister?registerID={}'.format(registerid)
        res = req_1(HENGWEI_SERVICE + url)['value']

        return JsonResponse({"name": "电量值", "value": res, "unit": "%", "pos": ["50%", "50%"], "range": [0, 100]})


@api_view(['GET'])
def Ups(request):
    registerid = request.query_params.get('registerid')
    if registerid:
        url = 'internal/s/managed_objects/4487/holdingRegister?registerID={}'.format(registerid)
        res = req_1(HENGWEI_SERVICE + url)['value']
        return HttpResponse(res)


@api_view(['GET'])
def get_health_percent(request):
    device_id = [x['id'] for x in network_device_list_1({'monitor_type': 'network_device'})['value']]
    device_count = network_device_count_1()['value']
    d = datetime.datetime.now()
    sum = 0
    for i in range(7):
        manage = []
        s = datetime.timedelta(days=1)
        d = d - s
        d2 = d + s
        year = d.year
        month = d.month
        day = d.day
        day2 = d2.day
        year2 = d2.year
        month2 = d2.month
        time_1 = '%d-%02d-%02dT00:00:00Z' % (year, month, day)
        time_2 = '%d-%02d-%02dT00:00:00Z' % (year2, month2, day2)
        params = {'from_date': time_1, 'to_date': time_2}
        res = alert_1(params)['value']
        for x in res:
            if x['managed_id'] in device_id:
                manage.append(x['managed_id'])
        manage = set(manage)
        sum += len(manage) / int(device_count)
    percent = str(round((sum / 7) * 100, 2))

    return JsonResponse({"name": "健康度", "value": percent, "unit": "%", "pos": ["50%", "50%"], "range": [0, 100]})


@api_view(['GET'])
def three_d(request):
    map1 = {'first_1': ['192.168.128.250',
                        '192.168.128.20',
                        '192.168.128.247',
                        '100.100.100.10',
                        '100.100.100.11',
                        '100.100.100.12',
                        '172.30.1.110',
                        '172.30.1.120',
                        '10.252.252.1',
                        '互联网主应用集成服务器01',
                        '互联网应用集成服务器02',
                        '172.30.1.10',
                        '虚拟化ESC管理平台内网',
                        '互联网微官网测试服务器'],
            'first_2': ['172.30.1.40',
                        '192.168.128.10',
                        '172.30.1.32',
                        '192.168.128.205',
                        '172.30.1.31',
                        '病案翻拍主存储'],
            'first_3': ['172.16.45.137',
                        '192.168.128.5',
                        '192.168.128.1',
                        '192.168.128.201'],
            'second_1': ['192.168.128.211',
                         '192.168.128.62',
                         'PACS新存储',
                         'PACS光纤交换机DS200A',
                         'PACS光纤交换机DS200B',
                         '影像主服务器'],
            'second_2': ['192.168.128.113',
                         '外网防火墙',
                         'sangforVPN',
                         '172.30.1.1',
                         '192.168.12.200',
                         '192.168.6.200'],
            'second_3': ['915外网接入交换机',
                         '院院通交换机',
                         '915办公室开发接入交换机',
                         '机房服务器接入交换机'],
            'third_1': ['193.168.29.200',
                        '10.101.164.7',
                        '10.101.164.1',
                        '172.30.30.254',
                        '192.168.10.252',
                        '192.168.128.248',
                        '192.168.10.252'],
            'third_2': ['192.168.128.73',
                        '运营数据中心CDC服务器',
                        '运营数据中心ODR服务器',
                        '192.168.128.73',
                        '192.168.128.74',
                        '运营数据中心存储扩展A',
                        '运营数据中心存储控制器',
                        '运营数据中心存储扩展B',
                        '192.168.128.172',
                        '192.168.128.173',
                        '临床数据中心存储控制器',
                        '临床数据中心存储扩展',
                        '192.168.128.178',
                        '192.168.128.179',
                        '科研随访服务器'],
            'third_3': ['192.168.128.91',
                        '192.168.128.92',
                        '医保前置机']}
    url = 'ts/alert_cookies?'
    res = req_1(HENGWEI_SERVICE + url)
    list_1 = []
    list_2 = []
    res = json.loads(res)
    for x in res['value']:
        if x['status'] == 1:
            url_1 = 'ds/managed_objects/{}?'.format(x['managed_id'])
            res_1 = req_1(HENGWEI_SERVICE + url_1)
            res_1 = json.loads(res_1)['value']
            if 'address' not in res_1.keys():
                    list_1.append({'name': res_1['display_name'], 'content': x['content']})
            else:
                list_1.append({'name': res_1['address'], 'content': x['content']})
        else:
            pass

    for x in list_1:
        for key, value in map1.items():
            if x['name'] in value:
                if value == set([x['name'] for x in list_2]):
                    pass
                else:
                    list_2.append({'name': key, 'status': 'alarm', 'message': x['content']})

    return JsonResponse(list_2, safe=False)



@api_view(['GET'])
def demo(request):
    # url = 'ts/alerts?@triggered_at=[>]2019-03-01T00:00:00Z&@triggered_at=[<]2019-04-02T00:00:00Z'
    # res = req_1(url=HENGWEI_SERVICE + url, method='get')
    # res_1 = json.loads(res)
    # result = res_1['value']
    # outf = open("1.csv", "w")
    # writer2 = csv.writer(outf)
    #
    # for key2 in result:
    #     writer2.writerow(['content', key2['content']])
    #
    #
    # outf.close()
    res_1 = req_1('http://122.112.197.225:8000/hengwei/ds/alert?@id=135')
    pprint(json.loads(res_1))
    return JsonResponse(res_1,safe=False)

