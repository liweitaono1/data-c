import re
import pymongo
from datasource.mongo.connection import Connection as mongoConnection
from dazzlingShow.settings import MONGODB, MONGOPORT


class CommonHandler(object):
    """
    可视化图形结果解析器
    """

    def __init__(self, conn, handle_type, data, *args, **kwargs):
        self.conn = conn
        self.handle_type = handle_type
        self.data = data
        self.data_type = kwargs['data_type'] if 'data_type' in kwargs else None

    # def handle_result(self):
    #     handler = self.get_handler()
    #     if not handler:
    #         raise ImportError('不支持的解析类型 %s。' % self.handle_type)
    #     return handler()
    #
    # def get_handler(self):
    #     return getattr(self, 'handler_for_' + str(self.handle_type), False)
    #
    # def handler_for_1(self):
    #
    #     if isinstance(self.data, dict):
    #         result = {}
    #         for field, sql_l in self.data.items():
    #             res = []
    #             for sql_d in sql_l:
    #                 res.append([data.get(list(data.keys())[0]) for data in self.conn.execute(sql_d).values()])
    #             result.setdefault(field, res)
    #     elif isinstance(self.data, list):
    #         result = []
    #         for d in self.data:
    #             index = 0
    #             for key, val in d.items():
    #                 for i, data in enumerate(self.conn.execute(val).values()):
    #                     if index == 0:
    #                         result.append({key: data.get(list(data.keys())[0])})
    #                     else:
    #                         result[i].update({key: data.get(list(data.keys())[0])})
    #                 index += 1
    #     return result

    def handler_for_datatype(self):
        if self.data_type == None:
            result = {'error': 'miss data_type'}

        elif self.data_type == '1' or self.data_type == '5':
            if isinstance(self.conn, mongoConnection):
                result = {}
                result['x'] = []
                result['y'] = []
                if 'x' in self.data and 'y' in self.data:
                    x_dict = self.conn.execute(self.data['x'][0]).values()
                    for x in x_dict:
                        if '_id' in x:
                            x.pop('_id')
                    y_dict = self.conn.execute(self.data['y'][0]).values()
                    for y in y_dict:
                        if '_id' in y:
                            y.pop('_id')
                    result['x'] = x_dict
                    result['y'] = y_dict
                elif 'x' in self.data:
                    x_dict = self.conn.execute(self.data['x'][0]).values()
                    for x in x_dict:
                        if '_id' in x:
                            x.pop('_id')
                    self.data.pop('x')
                    for y in self.data:
                        y_dict = []
                        y_dict = self.conn.execute(self.data[y][0]).values()
                        for y in y_dict:
                            if '_id' in y:
                                y.pop('_id')
                        result['y'].append([list(y.values())[0] for y in y_dict])
                    result['x'] = [list(x.values())[0] for x in x_dict]
                elif 'y' in self.data:
                    y_dict = self.conn.execute(self.data['y'][0]).values()
                    for y in y_dict:
                        if '_id' in y:
                            y.pop("_id")
                    self.data.pop('y')
                    for x in self.data:
                        x_dict = []
                        x_dict = self.conn.execute(self.data[x][0]).values()
                        for x in x_dict:
                            if '_id' in x:
                                x.pop("_id")
                        result['x'].append([list(x.values())[0] for x in x_dict])
                    result['y'] = [list(y.values())[0] for y in y_dict]
            else:
                result = {}
                result['x'] = []
                result['y'] = []
                if 'x' in self.data and 'y' in self.data:
                    x_dict = self.conn.execute(self.data['x'][0]).values()
                    y_dict = self.conn.execute(self.data['y'][0]).values()
                    result['x'] = x_dict
                    result['y'] = y_dict
                elif 'x' in self.data:
                    x_dict = self.conn.execute(self.data['x'][0]).values()
                    self.data.pop('x')
                    for y in self.data:
                        y_dict = []
                        y_dict = self.conn.execute(self.data[y][0]).values()
                        result['y'].append([list(y.values())[0] for y in y_dict])
                    result['x'] = [list(x.values())[0] for x in x_dict]
                elif 'y' in self.data:
                    y_dict = self.conn.execute(self.data['y'][0]).values()
                    self.data.pop('y')
                    for x in self.data:
                        x_dict = []
                        x_dict = self.conn.execute(self.data[x][0]).values()
                        result['x'].append([list(x.values())[0] for x in x_dict])
                    result['y'] = [list(y.values())[0] for y in y_dict]

        elif self.data_type == '2' or self.data_type == '11':
            result = []
            for d in self.data:
                index = 0
                for key, val in d.items():
                    query_dict = self.conn.execute(val).values()
                    for x in query_dict:
                        if '_id' in x:
                            x.pop('_id')
                    for i, data in enumerate(query_dict):
                        if index == 0:
                            result.append({key: data.get(list(data.keys())[0])})
                        else:
                            result[i].update({key: data.get(list(data.keys())[0])})
                    index += 1

        elif self.data_type == '3':
            result = []
            if 'name' in self.data[0]:
                name_dict = self.conn.execute(self.data[0]['name']).values()
                x_dict = self.conn.execute(self.data[0]['x']).values()
                y_dict = self.conn.execute(self.data[0]['y']).values()
                for x in name_dict:
                    if '_id' in x:
                        x.pop('_id')
                for x in x_dict:
                    if '_id' in x:
                        x.pop('_id')
                for x in y_dict:
                    if '_id' in x:
                        x.pop('_id')
                for x in name_dict:
                    result.append({'name': list(x.values())[0], 'value': []})
                    result[name_dict.index(x)]['value'].append(list(x_dict[name_dict.index(x)].values())[0])
                    result[name_dict.index(x)]['value'].append(list(y_dict[name_dict.index(x)].values())[0])
            else:
                for value in self.data[0].values():
                    query_dict = self.conn.execute(value).values()
                    for x in query_dict:
                        if '_id' in x:
                            x.pop('_id')
                    length = len(query_dict)
                    if len(result) < length:
                        for temp in range(length - len(result)):
                            result.append([])
                    for x in range(length):
                        for y in query_dict[x].values():
                            result[x].append(y)

        elif self.data_type == '4':
            # 返回纯文本内容,equary为查询到内容的索引
            content = ''
            textedit = self.data[0].get('textedit') if 'textedit' in self.data[0] else None
            equary = self.data[0].get('equary') if 'equary' in self.data[0] else None
            if not all([textedit, equary]):
                raise BaseException
            query_dict = self.conn.execute(textedit).values()
            if int(equary) - 1 > len(query_dict):
                content = '索引超过查询到的数据'
            else:
                query_dict = query_dict[int(equary) - 1]
                for value in query_dict.values():
                    content += str(value)
            return content


        elif self.data_type == '6' or self.data_type == '9' or self.data_type == '10':
            result = []
            for key, value in self.data[0].items():
                query_dict = self.conn.execute(value).values()
                length = len(query_dict)
                if len(result) < length:
                    for temp in range(length - len(result)):
                        result.append({})
                for x in query_dict:
                    for y in x.values():
                        result[query_dict.index(x)][key] = y

        elif self.data_type == '7':
            result = []
            textedit = self.data[0].get('textedit') if 'textedit' in self.data[0] else None
            if textedit is None:
                raise BaseException
            query_dict = self.conn.execute(textedit).values()
            for x in query_dict:
                if '_id' in x:
                    x.pop('_id')
                for temp in x.values():
                    result.append(str(temp))

        elif self.data_type == '8':
            result = {}
            for key, value in self.data.items():
                query_dict = self.conn.execute(value).values()[0]
                if '_id' in query_dict:
                    query_dict.pop('_id')
                for x in query_dict.values():
                    result[key] = x

        elif self.data_type == '13':
            mongo = pymongo.MongoClient(MONGODB, MONGOPORT)
            db = mongo.dazzlingshow
            result = []
            for temp in self.data:
                query_str = self.conn.execute(temp['name']).values()
                for x in query_str:
                    if '_id' in x:
                        query_str_1 = self.conn.execute(temp['value']).values()[0]
                        query_str_1.pop('_id')
                        redata = db.area.find_one({'name': x['region_name']}, {'longitude': 1, 'latitude': 1, '_id': 0})
                        if redata:
                            result.append({'name': x['region_name'], 'value': [redata['longitude'], redata['latitude'],
                                                                               list(query_str_1.values())[0]]})
                    else:
                        redata = db.area.find_one({'name': x['region_name']}, {'longitude': 1, 'latitude': 1, '_id': 0})
                        if redata:
                            result.append({'name': x['region_name'], 'value': [redata['longitude'], redata['latitude'],
                                                                               list(self.conn.execute(
                                                                                   temp['value']).values()[0].values())[
                                                                                   0]]})

        elif self.data_type == '12':
            if 'year1' not in self.data[0]:
                result = []
                count = []

                # 从前端接收到数据重新组织数据结构
                for x in self.data[0]:
                    val = re.search(r'^name(\d{1})$', x)
                    if val:
                        count.append(int(val.group(1)))
                    else:
                        continue
                max_count = max(count)
                data = []
                for x in range(max_count):
                    data.append(
                        {'name': self.data[0]['name' + str(x + 1)], 'value': self.data[0]['value' + str(x + 1)]})
                self.data = data
                for x in self.data:
                    result.append([])
                index = 0
                for x in self.data:
                    index_1 = 0
                    name_list = self.conn.execute(x['name']).values()
                    value_list = self.conn.execute(x['value']).values()
                    for y in name_list:
                        if "_id" in y:
                            y.pop('_id')
                    for y in value_list:
                        if "_id" in y:
                            y.pop('_id')
                    for y in name_list:
                        if index_1 >= 2 or index_1 >= len(value_list):
                            break
                        else:
                            result[index].append(
                                {"name": list(y.values())[0],
                                 'value': list(value_list[name_list.index(y)].values())[0]})
                        index_1 += 1
                    index += 1
            else:
                result = []
                count = []
                # 从前端接收数据重新组织数据结构
                for x in self.data[0]:
                    val = re.search(r'^name(\d{1})$', x)
                    if val:
                        count.append(int(val.group(1)))
                    else:
                        continue
                max_count = max(count)
                data = []
                for x in range(max_count):
                    data.append(
                        {'name': self.data[0]['name' + str(x + 1)], 'value': self.data[0]['value' + str(x + 1)],
                         'year': self.data[0]['year' + str(x + 1)]})
                self.data = data
                for x in self.data:
                    result.append([])
                index = 0
                for x in self.data:
                    index_1 = 0
                    name_list = self.conn.execute(x['name']).values()
                    value_list = self.conn.execute(x['value']).values()
                    for y in name_list:
                        if "_id" in y:
                            y.pop('_id')
                    for y in value_list:
                        if "_id" in y:
                            y.pop('_id')
                    for y in name_list:
                        if index_1 >= 4 or index_1 >= len(value_list):
                            break
                        else:
                            result[index].append(
                                {"name": list(y.values())[0], 'value': list(value_list[name_list.index(y)].values())[0],
                                 "year": x['year']})
                        index_1 += 1
                    index += 1
        else:
            result = {'error': 'unknow error'}

        return result
