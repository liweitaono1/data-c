import json
import logging
import os
import re
import time, datetime
import urllib3, traceback

import bson
import gridfs
import pymongo
from datasource.exceptions import ImportException
from datasource.utils import load_backend, conn_pool, PyCrypt, CRYPTOR
from datasource.resulthandler.common.common import CommonHandler
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http.response import JsonResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, render, HttpResponse, reverse

from dazzlingShow.settings import MONGODB, MONGOPORT

# 钱钱钱
MONEY = 100


def fbuffer(f, chunk_size=10000):
    while True:
        chunk = f.read(chunk_size)
        if not chunk:
            break
        yield chunk


def home(request):
    if request.method == 'GET':
        action = 'home'
        return render(request, 'home.html', locals())
    elif request.method == 'POST':

        showtemplate = int(request.POST.get('showtemplate', 10))
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        if showtemplate == 1:
            redata = db.show.find({"$or": [{"template": {"$exists": False}}, {"template": 0}]},
                                  projection={'_id': False, 'name': True, 'bg_img': True, 'template': True},
                                  sort=[('_id', pymongo.DESCENDING)])

        elif showtemplate == 9:
            redata = db.show.find({"template": 9},
                                  projection={'_id': False, 'name': True, 'bg_img': True, 'template': True},
                                  sort=[('_id', pymongo.DESCENDING)])

        else:
            redata = db.show.find({"$or": [{"template": {"$exists": False}}, {"template": 0}, {"template": 9}]},
                                  projection={'_id': False, 'name': True, 'bg_img': True, 'template': True},
                                  sort=[('_id', pymongo.DESCENDING)])
        data = []
        for v in redata:
            data.append(v)

        return JsonResponse(data, safe=False)


def show_templates(request):
    if request.method == 'GET':
        action = 'template'
        return render(request, 'show_templates.html', locals())
    elif request.method == 'POST':

        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow

        redata = db.show.find({"template": 1}, projection={'_id': False, 'name': True, 'bg_img': True},
                              sort=[('_id', pymongo.DESCENDING)])
        data = []
        for v in redata:
            data.append(v)

        return JsonResponse(data, safe=False)


def show_layers(request):
    if request.method == 'GET':
        return render(request, 'show_layers.html', locals())
    elif request.method == 'POST':

        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow

        redata = db.show.find({"template": 2}, projection={'_id': False, 'name': True, 'bg_img': True},
                              sort=[('_id', pymongo.DESCENDING)])
        data = []
        for v in redata:
            data.append(v)

        return JsonResponse(data, safe=False)


# def edit_chart(request):
#     if request.method == 'GET':
#         return render_to_response('edit_chart.html', locals())
#     elif request.method == 'POST':
#         chart_id = request.POST.get('chart_id', '')
#         if chart_id:
#             chart_obj = EChart.objects.get(id=chart_id)
#             chart = model_to_dict(chart_obj)
#             chart.setdefault('property_values', chart_obj.property_values)
#             return JsonResponse(chart)
#         return JsonResponse({})


def get_show_view(request):
    showname = request.GET.get('name', '')

    # 已经发布的， 不需要验证密码
    if showname:
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow

        redata = db.show.find_one({"name": showname},
                                  projection={'_id': False, 'name': True, 'bg_img': True, 'template': True},
                                  sort=[('_id', pymongo.DESCENDING)])

        if 'template' in redata:
            if redata['template']:
                if int(redata['template']) == 9:
                    return render(request, 'show_view.html', locals())

        return render(request, 'show_view.html', locals())



def get_shows(request):
    showname = request.GET.get('name', '')
    if request.method == 'GET':
        # 已经发布的， 不需要验证密码
        if showname:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow

            redata = db.show.find_one({"name": showname},
                                      projection={'_id': False, 'name': True, 'bg_img': True, 'template': True},
                                      sort=[('_id', pymongo.DESCENDING)])

            if 'template' in redata:
                if redata['template']:
                    if int(redata['template']) == 9:
                        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                        db = mongo.dazzlingshow
                        redata = db.sys_charts.find({'$or': [{'hidden': {'$exists': False}}]}, projection={'_id': False})

                        show = db.show.find_one({'name': showname}, projection={'_id': False})

                        all_charts = []
                        line_charts = []
                        bar_charts = []
                        pie_charts = []
                        scatter_charts = []
                        other_charts = []
                        map_charts = []
                        text_charts = []
                        # 实例
                        obj_charts = []
                        # 路由器
                        switch_charts = []
                        # 网络设备
                        Network_charts = []
                        # 安全设备
                        safety_charts = []
                        # 服务器
                        server_charts = []
                        # 防火墙
                        Firewall_charts = []
                        target_charts = []

                        global_other_charts = []

                        for v in redata:
                            if v['charttype'] == 'line':
                                all_charts.append(v)
                                line_charts.append(v)
                            elif v['charttype'] == 'bar':
                                all_charts.append(v)
                                bar_charts.append(v)
                            elif v['charttype'] == 'pie':
                                all_charts.append(v)
                                pie_charts.append(v)
                            elif v['charttype'] == 'scatter':
                                all_charts.append(v)
                                scatter_charts.append(v)
                            elif v['charttype'] == 'map':
                                map_charts.append(v)
                            elif v['charttype'] in ('funnel', 'gauge', 'radar'):
                                all_charts.append(v)
                                other_charts.append(v)
                            elif v['charttype'] in ('title', 'marquee', 'table', 'countUp', 'listview'):
                                text_charts.append(v)
                            elif v['charttype'] == 'obj':
                                obj_charts.append(v)
                            elif v['charttype'] == 'obj_switch':
                                obj_charts.append(v)
                                switch_charts.append(v)
                            elif v['charttype'] == 'obj_Firewall':
                                obj_charts.append(v)
                                Firewall_charts.append(v)
                            elif v['charttype'] == 'obj_Network':
                                obj_charts.append(v)
                                Network_charts.append(v)
                            elif v['charttype'] == 'obj_safety':
                                obj_charts.append(v)
                                safety_charts.append(v)
                            elif v['charttype'] == 'obj_server':
                                obj_charts.append(v)
                                server_charts.append(v)
                            elif v['charttype'] in ['decorate', 'border']:
                                target_charts.append(v)
                            else:
                                global_other_charts.append(v)

                        # 创建show, 弹出框填写名称

                        return render(request, 'edit_chart.html', locals())
                    else:
                        return render_to_response('login.html', locals(), request)

            if request.user and request.user.is_authenticated:
                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                redata = db.sys_charts.find({'$or': [{'hidden': {'$exists': False}}]},
                                            projection={'_id': False})

                show = db.show.find_one({'name': showname}, projection={'_id': False})

                all_charts = []
                line_charts = []
                bar_charts = []
                pie_charts = []
                scatter_charts = []
                other_charts = []
                map_charts = []
                text_charts = []
                # 实例
                obj_charts = []
                # 路由器
                switch_charts = []
                # 网络设备
                Network_charts = []
                # 安全设备
                safety_charts = []
                # 服务器
                server_charts = []
                # 防火墙
                Firewall_charts = []
                target_charts = []

                global_other_charts = []

                for v in redata:
                    if v['charttype'] == 'line':
                        all_charts.append(v)
                        line_charts.append(v)
                    elif v['charttype'] == 'bar':
                        all_charts.append(v)
                        bar_charts.append(v)
                    elif v['charttype'] == 'pie':
                        all_charts.append(v)
                        pie_charts.append(v)
                    elif v['charttype'] == 'scatter':
                        all_charts.append(v)
                        scatter_charts.append(v)
                    elif v['charttype'] == 'map':
                        map_charts.append(v)
                    elif v['charttype'] in ('funnel', 'gauge', 'radar'):
                        all_charts.append(v)
                        other_charts.append(v)
                    elif v['charttype'] in ('title', 'marquee', 'table', 'countUp', 'listview'):
                        text_charts.append(v)
                    elif v['charttype'] == 'obj':
                        obj_charts.append(v)
                    elif v['charttype'] == 'obj_switch':
                        obj_charts.append(v)
                        switch_charts.append(v)
                    elif v['charttype'] == 'obj_Firewall':
                        obj_charts.append(v)
                        Firewall_charts.append(v)
                    elif v['charttype'] == 'obj_Network':
                        obj_charts.append(v)
                        Network_charts.append(v)
                    elif v['charttype'] == 'obj_safety':
                        obj_charts.append(v)
                        safety_charts.append(v)
                    elif v['charttype'] == 'obj_server':
                        obj_charts.append(v)
                        server_charts.append(v)
                    elif v['charttype'] in ['decorate', 'border']:
                        target_charts.append(v)
                    else:
                        global_other_charts.append(v)

                # 创建show, 弹出框填写名称

                return render(request, 'edit_chart.html', locals())

            else:
                    return render_to_response('login.html', locals(), request)

    elif request.method == 'POST':
        name = request.POST.get('name', '')
        op = request.POST.get('op', '')
        data = {
            'show': [],
            'options': {},
            'status': 1,
            'error': '',
            'show_des': {}
        }

        if name and op:
            if op == 'edit':
                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                redata = db.show.find_one({"name": name}, projection={'_id': False})
                # show_des = db.show.find_one({"name": name}, projection={'_id': False, 'name': True, 'w': True, 'h': True,
                #         'data.bg': True})

            elif op == 'modify':
                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                redata = db.show.find_one({"name": name},
                                          projection={'_id': False, 'name': True, 'w': True, 'h': True, 'data.bg': True,
                                                      'screen': True})

            data['show'] = redata
            # data['show_des']=show_des

        else:
            data['status'] = 2
            data['error'] = '参数不完整'

        return JsonResponse(data)
    pass


def get_sys_charts(request):
    if request.method == 'POST':
        chartid = request.POST.get('chartid', '')
        chartname = request.POST.get('chartname', '')
        showname = request.POST.get('showname', '')
        x = request.POST.get('x', '')
        y = request.POST.get('y', '')
        w = request.POST.get('w', '')
        h = request.POST.get('h', '')
        op = request.POST.get('op', '')
        chart_dom_id = request.POST.get('chartDomId', '')
        drag_dom_id = request.POST.get('dragDomId', '')

        data = {
            'charts': {},
            'options': {},
            'status': 1,
            'error': ''
        }

        if showname and chartname and op:
            if op == 'create':

                if chartid and x and y and w and h:
                    mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                    db = mongo.dazzlingshow

                    cou = db.show.count({"name": showname, 'data.charts': {'$elemMatch': {"name": chartname}}})
                    if cou == 1:
                        data['status'] = 2
                        data['error'] = 'chart name 名称冲突'
                        return data

                    # 获取chart
                    redata = db.sys_charts.find_one({"chartid": int(chartid)}, projection={'_id': False})
                    # 轮播添加随机chartName
                    if redata['charttype'] == 'carousel':
                        if redata['data'] and redata['data']['pages']:
                            for page in redata['data']['pages']:
                                for chart in page['children']:
                                    chart['name'] = chart['charttype'] + '-' + random_string(6)

                    redata['name'] = chartname
                    redata['x'] = x
                    redata['y'] = y
                    redata['w'] = w
                    redata['h'] = h
                    redata['chartDomId'] = chart_dom_id
                    redata['dragDomId'] = drag_dom_id
                    redata['sourcetype'] = 1
                    redata['api'] = {
                        'url': '',
                        'interval': 60000
                    }
                    # 保存CHART
                    showdata = db.show.find_one({"name": showname}, projection={'_id': False})

                    db.show.update_one({"name": showname}, {'$push': {"data.charts": redata}})

                    data['charts'] = redata
                else:
                    data['status'] = 2
                    data['error'] = '参数不完整'

            elif op == 'edit':

                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": chartname}}},
                                          projection={'_id': False, "data.charts.$": True})
                data['charts'] = redata['data']['charts'][0]
                # 获取option
                # op_global=db.sys_options.find_one({"type":"global"},projection={'_id': False})
                # op_data=db.sys_options.find_one({"type":charttype},projection={'_id': False})
                # _option={}
                # _option=op_global['data']
                # _option.update(op_data['data'])
                #
                # data['options']=_option

        else:
            data['status'] = 2
            data['error'] = '参数不完整'

        return JsonResponse(data)
    pass


def get_carouse_charts(request):
    '''
    获取图表
    :param request:
    :return:
    '''

    if request.method == 'POST':
        carouse_name = request.POST.get('carouse_name', '')
        page_index = request.POST.get('page_index', '')
        showname = request.POST.get('showname', '')
        chartname = request.POST.get('chartname', '')
        update = request.POST.get('update', '')
        x = request.POST.get('x', '')
        y = request.POST.get('y', '')
        w = request.POST.get('w', '')
        h = request.POST.get('h', '')
        chartid = request.POST.get('chartid', '')
        op = request.POST.get('op', '')
        chart_dom_id = request.POST.get('chartDomId', '')
        drag_dom_id = request.POST.get('dragDomId', '')

        data = {
            'charts': {},
            'options': {},
            'status': 1,
            'error': ''
        }

        if showname and chartname and op and carouse_name and page_index:
            if op == 'create':

                if chartid and x and y and w and h:
                    mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                    db = mongo.dazzlingshow

                    redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": carouse_name}}},
                                              projection={'_id': False, "data.charts.$": True})
                    chart_json = redata['data']['charts'][0]

                    for v in redata['data']['charts'][0]['data']['pages']:
                        if 'children' in v:
                            for chr in v['children']:
                                if 'name' in chr:
                                    if chr['name'] == chartname:
                                        data['status'] = 2
                                        data['error'] = 'chart name 名称冲突'
                                        return data

                    # 获取chart
                    redata = db.sys_charts.find_one({"chartid": int(chartid)}, projection={'_id': False})
                    redata['name'] = chartname
                    redata['x'] = x
                    redata['y'] = y
                    redata['w'] = w
                    redata['h'] = h
                    redata['chartDomId'] = chart_dom_id
                    redata['dragDomId'] = drag_dom_id
                    redata['sourcetype'] = 1
                    redata['api'] = {
                        'url': '',
                        'interval': 60000
                    }

                    chart_json['data']['pages'][int(page_index)]['children'].append(redata)
                    # 保存CHART

                    # 删除该chart
                    db.show.update_one({"name": showname}, {'$pull': {"data.charts": {"name": carouse_name}}})
                    # 写入新的chart
                    db.show.update_one({"name": showname}, {'$push': {"data.charts": chart_json}})

                    data['charts'] = redata
                else:
                    data['status'] = 2
                    data['error'] = '参数不完整'

            elif op == 'edit':

                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow

                redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": carouse_name}}},
                                          projection={'_id': False, "data.charts.$": True})

                # data['charts'] = redata['data']['charts'][0]
                chart_json = redata['data']['charts'][0]

                chr_index = None
                for v in redata['data']['charts'][0]['data']['pages']:
                    if 'children' in v:
                        i = 0
                        for chr in v['children']:
                            if 'name' in chr:
                                if chr['name'] == chartname:
                                    data['charts'] = chr
                                    chr_index = i
                                    break
                            i += 1

                if update:
                    update_json = json.loads(update)
                    data['charts'] = update_json

                    chart_json['data']['pages'][int(page_index)]['children'][chr_index] = update_json

                    # 删除该chart
                    db.show.update_one({"name": showname}, {'$pull': {"data.charts": {"name": carouse_name}}})
                    # 写入新的chart
                    db.show.update_one({"name": showname}, {'$push': {"data.charts": chart_json}})
        else:
            data['status'] = 2
            data['error'] = '参数不完整'

        return JsonResponse(data)
    pass


def pos_carouse_charts(request):
    if request.method == 'POST':
        carouse_name = request.POST.get('carouse_name', '')
        page_index = request.POST.get('page_index', '')
        showname = request.POST.get('showname', '')
        chartname = request.POST.get('chartname', '')
        op = request.POST.get('op', '')
        update = request.POST.get('update', '')

        # print('page_index')
        # print(page_index)
        data = {
            'charts': {},
            'options': {},
            'status': 1,
            'error': ''
        }
        #
        if carouse_name and page_index and showname:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": carouse_name}}},
                                      projection={'_id': False, "data.charts.$": True})
            # data['charts'] = redata['data']['charts'][0]
            chart_json = redata['data']['charts'][0]
            # 新增一页
            if op and op == 'add_page':
                chr_json = chart_json['data']['pages']
                chr_json.append({'pageIndex': int(page_index), 'children': []})
            # 修改属性
            if chartname and update:
                update_json = json.loads(update)
                for v in redata['data']['charts'][0]['data']['pages']:
                    if 'children' in v:
                        i = 0
                        for chr in v['children']:
                            if 'name' in chr:
                                if chr['name'] == chartname:
                                    chr_index = i
                                    break
                            i += 1
                chr_json = chart_json['data']['pages'][int(page_index)]['children'][chr_index]
                for k, v in update_json.items():
                    if k in chr_json:
                        chr_json[k] = v

                chart_json['data']['pages'][int(page_index)]['children'][chr_index] = chr_json

            # 删除该chart
            db.show.update_one({"name": showname}, {'$pull': {"data.charts": {"name": carouse_name}}})
            # 写入新的chart
            db.show.update_one({"name": showname}, {'$push': {"data.charts": chart_json}})

            data['charts'] = chr_json

        else:
            data['status'] = 2
            data['error'] = '参数不完整'

        return JsonResponse(data)


def del_carouse_charts(request):
    if request.method == 'POST':
        carouse_name = request.POST.get('carouse_name', '')
        page_index = request.POST.get('page_index', '')
        showname = request.POST.get('showname', '')
        op = request.POST.get('op', '')
        chartname = request.POST.get('chartname', '')
        # print(page_index)
        if carouse_name and page_index and showname:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": carouse_name}}},
                                      projection={'_id': False, "data.charts.$": True})

            # data['charts'] = redata['data']['charts'][0]
            chart_json = redata['data']['charts'][0]
            if op and op == 'delete_page':
                chart_json['data']['pages'].pop(int(page_index))
            if chartname:

                for v in redata['data']['charts'][0]['data']['pages']:
                    if 'children' in v:
                        i = 0
                        for chr in v['children']:
                            if 'name' in chr:
                                if chr['name'] == chartname:
                                    chr_index = i
                                    break
                            i += 1

                chart_json['data']['pages'][int(page_index)]['children'].pop(chr_index)

            # 删除该chart
            db.show.update_one({"name": showname}, {'$pull': {"data.charts": {"name": carouse_name}}})
            # 写入新的chart
            db.show.update_one({"name": showname}, {'$push': {"data.charts": chart_json}})

            return HttpResponse('删除成功')

        else:
            return HttpResponse('参数不完整')


#
# @login_required(login_url='login')
# def update_all_show(request):
#     if request.method == 'POST':
#         name = request.POST.get('name', '')
#         chart = request.POST.get('chartname', '')
#         key = request.POST.get('key', '')
#         update = request.POST.get('update', '')
#
#         if name and update and key:
#             if chart:
#                 # 更新chart
#                 mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
#                 db = mongo.dazzlingshow
#                 # 删除该chart
#                 db.show.update_one({"name": name}, {'$pull': {"data.charts": {"name": chart}}})
#                 # 写入新的chart
#                 db.show.update_one({"name": name}, {'$push': {"data.charts": eval(update)}})
#                 # 查询并返回
#                 redata = db.show.find_one({"name": name, "data.charts": {'$elemMatch': {"name": chart}}},
#                                           projection={'_id': False, "data.charts.$": True})
#                 return JsonResponse(redata['data']['charts'][0])
#             else:
#                 # 更新show
#                 mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
#                 db = mongo.dazzlingshow
#                 db.show.update_one({"name": name}, {'$set': eval(update)})
#                 redata = db.show.find_one({"name": name}, projection={'_id': False, })
#                 return JsonResponse(redata)
#         pass
#     pass


def update_show(request):
    if request.method == 'POST':
        name = request.POST.get('name', '')
        op = request.POST.get('op')
        chartname = request.POST.get('chartname', '')
        update = request.POST.get('update', '')
        file = request.FILES.get('file', '')

        if name and update:
            if chartname:
                # 更新chart
                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                # 删除该chart
                db.show.update_one({"name": name}, {'$pull': {"data.charts": {"name": chartname}}})
                # 写入新的chart
                db.show.update_one({"name": name}, {'$push': {"data.charts": json.loads(update)}})
                # 查询并返回
                redata = db.show.find_one({"name": name, "data.charts": {'$elemMatch': {"name": chartname}}},
                                          projection={'_id': False, "data.charts.$": True})
                if redata is None:
                    return HttpResponse('no data')
                return JsonResponse(redata['data']['charts'][0])
            else:
                # 更新show

                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                update_dict = json.loads(update)

                update_show_name = update_dict.get('name')
                exist_show = db.show.find_one({"name": update_show_name}, projection={'_id': False, 'name': True, })
                if exist_show and (name != update_show_name or op == 'add'):
                    return JsonResponse({'status': 2, 'msg': '图表名称“%s”已存在，请重新命名！' % update_show_name})

                # 控制新增show
                show_money = db.show.count_documents({"$or": [{"template": {"$exists": False}}, {"template": 0}]})
                if show_money >= MONEY:
                    return JsonResponse({'status': 2, 'msg': '尊敬的用户，您的可视化创建达到【%s】上限。谢谢' % (MONEY)})

                if file:
                    fname = os.path.basename(file.name)
                    _now_date = time.strftime("%Y%m%d", time.localtime())

                    dir_path = 'static/images/bg/' + _now_date + '/'
                    if not os.path.exists(dir_path):
                        os.makedirs(dir_path)

                    newfile = os.path.join(dir_path, fname)

                    f = open(newfile, 'wb', 10000)
                    for chunk in fbuffer(file.file):
                        f.write(chunk)
                    f.close()
                    update_dict['bg_img'] = '/' + newfile

                db.show.update_one({"name": name}, {'$set': update_dict}, upsert=True)

                if 'name' in update_dict:
                    name = update_dict['name']

                redata = db.show.find_one({"name": name},
                                          projection={'_id': False, 'name': True, 'w': True, 'h': True, 'data.bg': True,
                                                      'screen': True, 'bg_img': True})
                return JsonResponse(redata)
        else:
            return HttpResponse('参数不完整')
        pass
    pass


def copy_chart(request):
    showname = request.POST.get('showname', '')
    copyname = request.POST.get('copyname', '')
    newname = request.POST.get('newname', '')
    data = {
        'charts': {},
        'options': {},
        'status': 1,
        'error': ''
    }

    if showname and copyname and newname:
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow

        redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": copyname}}},
                                  projection={'_id': False, "data.charts.$": True})
        if redata is None:
            return HttpResponse('no data')

        copydata = redata['data']['charts'][0]
        copydata['name'] = newname

        x = copydata['x']
        y = copydata['y']
        nx = str(float(str(x).replace('px', '')) + float(50)) + 'px'
        ny = str(float(str(y).replace('px', '')) + float(50)) + 'px'
        copydata['x'] = nx
        copydata['y'] = ny
        copydata['dragDomId'] = 'drag-box-' + random_string(10)
        copydata['chartDomId'] = 'echart-' + random_string(10)
        copydata['sourcetype'] = 1
        db.show.update_one({"name": showname}, {'$push': {"data.charts": copydata}})
        data['charts'] = copydata
    else:
        data['status'] = 2
        data['error'] = '参数不完整'

    return JsonResponse(data)

    pass


def del_show(request):
    if request.method == 'POST':
        name = request.POST.get('name', '')
        if name:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            db.show.delete_one({"name": name})
        else:
            return HttpResponse('参数不完整')

        return HttpResponse('删除成功')
    pass


def del_chart(request):
    if request.method == 'POST':

        showname = request.POST.get('showname', '')
        chartname = request.POST.get('chartname', '')

        if showname and chartname:

            # 更新chart
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            # 删除该chart
            redata = db.show.update_one({"name": showname}, {'$pull': {"data.charts": {"name": chartname}}})

            if redata.modified_count != 1:
                return HttpResponse('删除失败')

        else:
            return HttpResponse('参数不完整')

        return HttpResponse('删除成功')


def update_chart(request):
    if request.method == 'POST':

        showname = request.POST.get('showname', '')
        chartname = request.POST.get('chartname', '')
        chartkey = request.POST.get('chartkey', '')
        if showname and chartname and chartkey:

            chartlist = json.loads(chartkey)
            if len(chartlist) == 0:
                return HttpResponse('修改内容为空')

            # 更新chart
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            cou = db.show.count({"name": showname, 'data.charts': {'$elemMatch': {"name": chartname}}})
            if cou != 1:
                return HttpResponse('数据不唯一')

            for v in chartlist:
                ee = db.show.update_one({"name": showname, 'data.charts': {'$elemMatch': {"name": chartname}}},
                                        {'$set': {"data.charts.$." + v[0]: v[1]}}, upsert=True)
            redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": chartname}}},
                                      projection={'_id': False, "data.charts.$": True})

            return JsonResponse(redata['data']['charts'][0])

        else:
            return HttpResponse('参数不完整')

        return HttpResponse('修改成功')


def update_series(request):
    if request.method == 'POST':
        showname = request.POST.get('showname', '')
        chartname = request.POST.get('chartname', '')
        op = request.POST.get('op', '')
        seriesname = request.POST.get('seriesname', '')
        update = request.POST.get('update', '')
        serieskey = request.POST.get('serieskey', '')

        if showname and chartname and seriesname and op and update:

            if op == 'add':
                # 更新chart
                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                # 删除该chart
                db.show.update_one({"name": showname, "data.charts": {'$elemMatch': {"name": chartname}}},
                                   {'$pull': {"data.charts.$.series": {"name": seriesname}}})
                # 写入新的chart
                db.show.update_one({"name": showname, "data.charts": {'$elemMatch': {"name": chartname}}},
                                   {'$push': {"data.charts.$.series": eval(update)}})


            elif op == 'del':
                # 更新chart
                mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
                db = mongo.dazzlingshow
                # 删除该chart
                db.show.update_one({"name": showname, "data.charts": {'$elemMatch': {"name": chartname}}},
                                   {'$pull': {"data.charts.$.series": {"name": seriesname}}})
                # 写入新的chart

            # 查询并返回
            redata = db.show.find_one({"name": showname, "data.charts": {'$elemMatch': {"name": chartname}}},
                                      projection={'_id': False, "data.charts.$": True})
            return JsonResponse(redata['data']['charts'][0])

        else:
            return HttpResponse('参数不完整')


# @login_required(login_url='login')
def get_post_by_url(request):
    url = request.POST.get('url')
    params = request.POST.get('params')
    method = request.POST.get('method')
    try:
        params = json.loads(params)
    except Exception:
        pass
    if method:
        return HttpResponse(req(url, method, params))
    else:
        return HttpResponse(req(url, data=params))


http_success_status = [200, 201]


# @login_required(login_url='login')
def req(url, method='get', data=None, files=None, headers=None):
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
    res = http.request(method, url, fields=fields, headers=headers)
    return handle_response(res)


# @login_required(login_url='login')
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


def get_svg(request):
    if request.method == 'POST':
        name = request.POST.get('name', '')

        if name:

            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            redata = db.svgs.find_one({"name": name}, projection={'_id': False, })
            return JsonResponse(redata)
        else:
            return HttpResponse('参数不完整')


def upload_bg(request):
    if request.method == 'POST':
        file = request.FILES.get('file', '')

        if file:
            fname = os.path.basename(file.name)
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            fs = gridfs.GridFS(db)

            redata = fs.find({"filename": fname})
            if redata.count() == 0:
                fs.put(file, filename=fname)
            else:
                return HttpResponse('文件名已经存在')
        else:
            return HttpResponse('参数不完整')


def broadcast(request):
    name = request.GET.get('name', '')
    update = request.POST.get('update', '')
    if request.method == 'GET':
        if name:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            redata = db.broadcast.find_one({"name": name}, projection={'_id': False, })
            return JsonResponse(redata)
        else:
            return HttpResponse('参数不完整')
    else:
        if name and update:
            update_dict = json.loads(update)
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            db.broadcast.update_one({"name": name},
                                    {'$set': update_dict}, upsert=True)

            if 'name' in update_dict:
                name = update_dict['name']

            redata = db.broadcast.find_one({"name": name}, projection={'_id': False, })
            return JsonResponse(redata)
        else:
            return HttpResponse('参数不完整')
    pass


def broadcast_list(request):
    if request.method == 'GET':
        action = 'broadcast'
        return render(request, 'broadcast_list.html', locals())
    elif request.method == 'POST':
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        redata = db.broadcast.find({}, projection={'_id': False}, sort=[('_id', pymongo.DESCENDING)])
        data = []
        for v in redata:
            data.append(v)

        return JsonResponse(data, safe=False)


def broadcast_edit(request):
    name = request.GET.get('name')
    action = 'broadcast'
    return render(request, 'broadcast_edit.html', locals())


def broadcast_show(request):
    broadcast_name = request.GET.get('name')
    return render(request, 'broadcast_show.html', locals())


def del_broadcast(request):
    if request.method == 'POST':
        name = request.POST.get('name', '')

        # print(name)
        if name:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            db.broadcast.delete_one({"name": name})
        else:
            return HttpResponse('参数不完整')

        return HttpResponse('删除成功')
    pass


def clone_show(request):
    copy_name = request.POST.get('copy_name', '')
    new_name = request.POST.get('new_name', '')
    if request.method == 'POST':
        if copy_name and new_name:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            redata = db.show.find_one({"name": copy_name}, projection={'_id': False, })

            if redata is None:
                return HttpResponse('no data')
            redata['template'] = 0
            redata['name'] = new_name
            # if redata['data'] and redata['data']['charts']:
            #     for chart in redata['data']['charts']:
            #         chart['dragDomId'] = 'drag-box-' + random_string(10)
            #         chart['chartDomId'] = 'echart-' + random_string(10)
            db.show.insert(redata, check_keys=False)

        else:
            return HttpResponse('参数不完整')

        return HttpResponse('复制成功')


def random_string(string_length=10):
    """Returns a random string of length string_length."""
    import uuid
    random = str(uuid.uuid4())  # Convert UUID format to a Python string.
    random = random.upper()  # Make all characters uppercase.
    random = random.replace("-", "")  # Remove the UUID '-'.
    return random[0:string_length]  # Return the random string.


def operate_line(request):
    if request.method == 'POST':
        show_name = request.POST.get('show_name', '')
        op = request.POST.get('op', '')
        if show_name and op:
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            redata = db.show.find_one({"name": show_name}, projection={'_id': False, })
            lines = redata.get('lines', [])
            # 新增操作
            if op == 'add':
                b_line = db.sys_charts.find_one({"chartid": 160}, projection={'_id': False, })
                line = json.loads(request.POST.get('update', '{}'))
                if line.get('data', ''):
                    data = line.pop('data')
                    b_line['data']['lineOption'] = data.get('lineOption', {})
                b_line.update(line)
                lines.append(b_line)
            # 删除操作
            elif op == 'remove' or op == 'get' or op == 'modify':
                line_id = request.POST.get('line_id', '')
                # 根据id查找索引
                c_line = {}
                i = 0
                for l in lines:
                    if line_id == l['id']:
                        c_line = l
                        break
                    i = i + 1
                if op == 'get':
                    return JsonResponse(c_line, safe=False)

                if op == 'remove':
                    lines.pop(i)
                elif op == 'modify':
                    lines[i] = json.loads(request.POST.get('update', '{}'))
            elif op == 'set':
                lines = json.loads(request.POST.get('lines', '[]'))
            # 写入新的 lines
            db.show.update_one({"name": show_name}, {'$set': {"lines": lines}})
            redata['lines'] = lines
            return JsonResponse(redata)
        else:
            return HttpResponse('参数不完整')


def get_page(request):
    """
    获取所有的属性
    :param request:
    :return:
    """
    mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
    db = mongo.dazzlingshow
    # db = mongo.get_database('dazzlingshow')
    # print(db)
    # 转化 Cursor
    data = db.sys_pagesetting.find({'name': 'page'}, projection={'_id': False})
    datas = []
    for i in data:
        datas.append(i)
    # print(datas)
    return JsonResponse(datas, safe=False)

def get_property(request):
    """
    获取所有的属性
    :param request:
    :return:
    """
    chart_type = request.POST.get('type', '')
    mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
    db = mongo.dazzlingshow
    if chart_type:
        properties = db.sys_property.find({'type': chart_type}, projection={'_id': False})
    else:
        properties = db.sys_property.find({}, projection={'_id': False})
    # 转化 Cursor
    data = []
    for p in properties:
        data.append(p)
    return JsonResponse(data, safe=False)


def modify_pwd(request):
    if request.method == 'GET':
        return render(request, 'modify_pwd.html', locals())
    elif request.method == 'POST':
        res = {'status': 1}
        old_pwd = request.POST.get('oldPassword', '')
        pwd = request.POST.get('password', '')
        c_pwd = request.POST.get('confirmPassword', '')
        if not old_pwd:
            res['msg'] = '原始密码不能为空。'
            return JsonResponse(res)
        old_user = authenticate(username=request.user.username, password=old_pwd)
        if not old_user or not old_user.is_authenticated:
            res['msg'] = '原始密码不正确。'
            return JsonResponse(res)
        if not pwd:
            res['msg'] = '新密码不能为空。'
            return JsonResponse(res)
        if not c_pwd:
            res['msg'] = '确认密码不能为空。'
            return JsonResponse(res)
        if pwd != c_pwd:
            res['msg'] = '新密码与确认密码不一致。'
            return JsonResponse(res)
        try:
            user = User.objects.get(username=request.user.username)
            user.set_password(pwd)
            user.save()
        except Exception as e:
            res['msg'] = str(e)
            return JsonResponse(res)
        res['status'] = 0
        return JsonResponse(res)


# 请求次数限制
def login(request):
    """登录界面"""
    error = ''
    user = request.user
    if user and user.is_authenticated:
        return HttpResponseRedirect(reverse('home'))
    if request.method == 'GET':
        re_html = request.GET.get('next', '/')
        return render_to_response('login.html', locals(), request)
        # return render_to_response('login.html',{re_html:re_html})
    else:
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me')
        if username and password:
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    # all_project_perms  = get_objects_for_user(user,'cmdb.list_project').order_by('id')
                    pro_id = []
                    # for _id in all_project_perms:
                    #   pro_id.append(_id.id)
                    # request.session['all_project_perm_list'] = pro_id
                    # logger.debug(user.username + u' 项目权限列表ID : ')
                    # logger.debug(request.session['all_project_perm_list'])
                    next_page = request.GET.get('next', '/')
                    response = JsonResponse({'status': 0, 'msg': '登录成功', 'next': next_page})
                    if remember_me:
                        response.set_cookie("username", username)
                    else:
                        response.delete_cookie("username")
                    return response
                else:
                    error = '用户未激活'
            else:
                error = '用户名或密码错误'
        else:
            error = '用户名或密码错误'
        response = JsonResponse({'status': 1, 'error': error})
        if remember_me:
            response.set_cookie("username", username)
        else:
            response.delete_cookie("username")
    return response


def logout(request):
    auth_logout(request)
    return HttpResponseRedirect(reverse('home'))


def per(request):
    type = request.GET.get('type', '')
    t = request.GET.get('time', 5)
    if type == 'sleep':
        time.sleep(int(t))
        return HttpResponse('延迟了' + str(t) + '秒')
    if type == 'error':
        raise Exception('抛出了一个异常')


def show_cate(request):
    """
    查询类别
    :param request:
    :return:
    """
    if request.method == 'GET':
        return render(request, 'show_cate.html', locals())
    elif request.method == 'POST':
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        cate = db.sys_cate.find_one({'name': 'uploadCate'})
        roots = cate.get('roots', [])
        if request.POST.get('path'):
            root = get_path_roots(roots, request.POST.get('path'))
            roots = root and [root] or []
        return JsonResponse(roots, safe=False, encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def edit_data(request):
    """
    查询类别
    :param request:
    :return:
    """
    if request.method == 'GET':
        return render(request, 'edit_data.html', locals())
    elif request.method == 'POST':
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        cate = db.sys_cate.find_one({'name': 'uploadCate'})
        roots = cate.get('roots', [])
        if request.POST.get('path'):
            root = get_path_roots(roots, request.POST.get('path'))
            roots = root and [root] or []
        return JsonResponse(roots, safe=False, encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def show_data(request):
    """
    查询类别
    :param request:
    :return:
    """
    if request.method == 'GET':
        return render(request, 'show_data.html', locals())
    elif request.method == 'POST':
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        cate = db.sys_cate.find_one({'name': 'uploadCate'})
        roots = cate.get('roots', [])
        if request.POST.get('path'):
            root = get_path_roots(roots, request.POST.get('path'))
            roots = root and [root] or []
        return JsonResponse(roots, safe=False, encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def carousel_setting(request):
    """
    查询类别
    :param request:
    :return:
    """
    if request.method == 'GET':
        return render(request, 'carousel_setting.html', locals())
    elif request.method == 'POST':
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        cate = db.sys_cate.find_one({'name': 'uploadCate'})
        roots = cate.get('roots', [])
        if request.POST.get('path'):
            root = get_path_roots(roots, request.POST.get('path'))
            roots = root and [root] or []
        return JsonResponse(roots, safe=False, encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def show_package(request):
    """
    查询类别
    :param request:
    :return:
    """
    if request.method == 'GET':
        return render(request, 'show_package.html', locals())
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def right_click(request):
    """
    查询类别
    :param request:
    :return:
    """
    if request.method == 'GET':
        return render(request, 'right_click.html', locals())
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def get_path_roots(roots, path):
    for r in roots:
        if r.get('path') != path and r.get('children'):
            n = get_path_roots(r.get('children'), path)
            if n:
                return n
        if r.get('path') == path:
            return r


def update_cate(request):
    """
    添加或者删除类别
    :param request:
    :return:
    """
    if request.method == 'POST':
        path = request.POST.get('path')
        op = request.POST.get('op', 'add')
        name = request.POST.get('name')
        if (op == 'add' and not (path and name)) or (op == 'remove' and not path):
            return JsonResponse({'status': 1, 'error': '参数不完整'})
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        cate = db.sys_cate.find_one({'name': 'uploadCate'}, projection={'_id': False})
        roots = cate.get('roots', [])
        if op == 'add' and exists_path(roots, path + '/' + name):
            return JsonResponse({'status': 1, 'error': '"%s" 在此节点下已存在！' % name})
        update_roots(roots, path, name, op)
        db.sys_cate.update_one({'name': 'uploadCate'}, {'$set': {'roots': roots}})
        return JsonResponse(roots, safe=False)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def update_roots(roots, parent_path, name, op):
    """
    递归找出父节点并在父节点添加子节点
    :param roots:
    :param parent_path:
    :param name:
    :param op:
    :return:
    """
    for r in roots:
        if parent_path == r.get('path'):
            if op == 'add':
                create_node(r, parent_path, name)
            elif op == 'remove':
                roots.remove(r)
            break
        elif r.get('children'):
            update_roots(r.get('children'), parent_path, name, op)


def exists_path(roots, path):
    """
    是否已经存在同样的path
    :param roots:
    :param path:
    :return:
    """
    for r in roots:
        if r.get('path') != path and r.get('children'):
            res = exists_path(r.get('children'), path)
            if res:
                return True
        if r.get('path') == path:
            return True
    return False


def create_node(r, parent_path, name):
    """
    创建节点
    :param r:
    :param parent_path:
    :param name:
    :return:
    """

    node = {}
    node.setdefault('name', name)
    node.setdefault('pathname', r.get('pathname') + '/' + name)
    node.setdefault('path', parent_path + '/' + name)
    children = r.get('children', [])
    children.append(node)
    r.update({'children': children})


def find_images(request):
    """
    查询素材
    :param request:
    :return:
    """
    if request.method == 'POST':
        path = request.POST.get('path')
        pathname = request.POST.get('pathname')
        limit = request.POST.get('limit', 10)
        page = request.POST.get('page', 1)

        page = isinstance(page, int) and page or int(page)
        limit = isinstance(limit, int) and limit or int(limit)

        offset = (page - 1) * limit
        end = page * limit
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        if path:
            cate = db.sys_cate.find_one({'name': 'uploadCate'})
            roots = cate.get('roots', [])
            paths = find_children(roots, path)
            cursor = db.sys_image.find({'path': {"$in": paths}}, projection={'content': False}).sort(
                [("time", pymongo.DESCENDING)])
        else:
            cursor = db.sys_image.find({}, projection={'content': False}).sort([("time", pymongo.DESCENDING)])

        return JsonResponse({'total': cursor.count(), 'pathname': pathname, 'rows': [c for c in cursor[offset: end]]},
                            encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def find_children(roots, path):
    for r in roots:
        if path != r.get('path') and r.get('children'):
            paths = find_children(r.get('children'), path)
            if paths:
                return paths
        if path == r.get('path'):
            paths = list()
            paths.append(path)
            r.get('children') and append_children(r.get('children'), paths)
            return paths
    return []


def append_children(nodes, paths):
    for n in nodes:
        paths.append(n.get('path'))
        if n.get('children'):
            append_children(n.get('children'), paths)


def upload_images(request):
    """
    上传素材
    :param request:
    :return:
    """
    if request.method == 'POST':
        path = request.POST.get('path')
        name = request.POST.get('name')
        if not (path and name):
            return JsonResponse({'status': 1, 'msg': '参数不完整'})
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        images = []
        for key, file in request.FILES.items():
            data = dict()
            b = file.file.read()
            data['content'] = bson.Binary(b)
            data['path'] = path
            data['name'] = name
            data['time'] = datetime.datetime.utcnow(),
            data['file_name'] = file.name
            images.append(data)
        db.sys_image.insert_many(images)
        return JsonResponse({'status': 0, 'msg': '上传成功'})
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def show_image(request):
    """
    显示素材
    :param request:
    :return:
    """
    if request.method == 'GET':
        obj_id = request.GET.get('id')
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        image = db.sys_image.find_one({'_id': bson.ObjectId(obj_id)})
        path = image.get('file_name').split('.')
        image_type = path[len(path) - 1]
        return HttpResponse(image.get('content'), content_type='image/' + image_type)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def remove_image(request):
    """
    删除素材
    :param request:
    :return:
    """
    if request.method == 'POST':
        obj_id = request.POST.get('id')
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        db.sys_image.delete_one({'_id': bson.ObjectId(obj_id)})
        return JsonResponse({'status': 0, 'msg': '删除成功'})
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def add_material(request):
    """
    添加素材
    :param request:
    :return:
    """
    return render(request, 'add_material.html', locals())


# def test(request):
#     return render(request, 'test.html', locals())


class JSONEncoder(json.JSONEncoder):
    """处理ObjectId & datetime类型无法转为json"""

    def default(self, o):
        if isinstance(o, bson.ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return datetime.datetime.strftime(o, '%Y-%m-%d %H:%M:%S')
        return json.JSONEncoder.default(self, o)


def datasource_list(request):
    """
        查询素材
        :param request:
        :return:
        """
    if request.method == 'POST':
        limit = request.POST.get('limit', 10)
        page = request.POST.get('page', 1)

        page = isinstance(page, int) and page or int(page)
        limit = isinstance(limit, int) and limit or int(limit)

        offset = (page - 1) * limit
        end = page * limit
        mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
        db = mongo.dazzlingshow
        cursor = db.sys_datasource.find({}, projection={'content': False}).sort([("time", pymongo.DESCENDING)])
        return JsonResponse({'count': cursor.count(), 'data': [c for c in cursor[offset: end]], 'code': 0},
                            encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'msg': '请求方式不允许'})


def datasource_operate(request):
    mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
    db = mongo.dazzlingshow
    if request.method == 'POST':
        data = request.POST.dict()
        op = data.get('op') and data.pop('op')
        obj_id = data.get('id') and data.pop('id')
        result = {}
        if op == 'remove' and obj_id:
            db.sys_datasource.delete_one({'_id': bson.ObjectId(obj_id)})
            result = {'status': 0, 'msg': '删除成功'}
            return JsonResponse(result)
        if obj_id:
            data['password'] = CRYPTOR.encrypt(data['password'])
            db.sys_datasource.update({'_id': bson.ObjectId(obj_id)}, {'$set': data})
            result = {'status': 0, 'msg': '编辑成功'}
        elif not op:
            if data['type'] == 'mongo':
                data['time'] = datetime.datetime.now()
                db.sys_datasource.insert_one(data)
            else:
                data['time'] = datetime.datetime.now()
                data['password'] = CRYPTOR.encrypt(data['password'])
                db.sys_datasource.insert_one(data)
            result = {'status': 0, 'msg': '添加成功'}
        return JsonResponse(result)

    elif request.method == 'GET':
        obj_id = request.GET.get('id')
        data = db.sys_datasource.find_one({'_id': bson.ObjectId(obj_id)})
        return JsonResponse(data, encoder=JSONEncoder)
    else:
        return JsonResponse({'status': 1, 'error': '请求方式不允许'})


def datasource_testing(request):
    if request.method == 'POST':
        data = request.POST.dict()
        data.get('name') and data.pop('name')
        name = data.get('type') and data.pop('type')
        if not name:
            return JsonResponse({'status': 1, 'error': '参数不完整！'})
        try:
            conn = load_backend(name)
        except ModuleNotFoundError:
            return JsonResponse({'status': 1, 'error': '数据源暂不支持 "%s" 类型！' % type})
        except ImportException:
            return JsonResponse({'status': 1, 'error': '数据源暂不支持 "%s" 类型(导入)！' % type})
        result, error = conn(data).testing()
        print(error)
        if not result:
            return JsonResponse({'status': 1, 'error': repr(error)})
        return JsonResponse({'status': 0, 'msg': '连接成功！'})
    else:
        return JsonResponse({'status': 1, 'error': '请求方式不允许'})


def datasource_execute(request):
    obj_id = request.POST.get('id')
    data_type = request.POST.get('datatype', '')
    sql = request.POST.get('sql')
    try:
        sql_dict = json.loads(sql)
    except ValueError:
        return JsonResponse({'status': 1, 'error': 'sql字段解析错误'})
    mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
    db = mongo.dazzlingshow
    data = db.sys_datasource.find_one({'_id': bson.ObjectId(obj_id)}, projection={'_id': False, 'time': False})
    name = data.get('name') and data.pop('name')
    try:
        conn = conn_pool.get_connection(name, data)
    except Exception as e:
        return JsonResponse({'status': 1, "error": '数据库连接失败', 'msg': repr(e)})
    try:
        result = CommonHandler(conn, 1, sql_dict, data_type=data_type).handler_for_datatype()
    except Exception as e:
        return JsonResponse({'status': 1, "error": '数据库操作失败', 'msg': repr(e)})
    if isinstance(result, str):
        return HttpResponse(result, content_type='text/html')
    conn.connection.close()
    # connection对象不支持dispose(),无法释放内存,可能存在建立不了数据库连接的可能
    return JsonResponse(result, safe=False)
