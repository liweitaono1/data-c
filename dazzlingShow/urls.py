"""dazzlingV URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import include, url
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', login),
    path('login', login, name='login'),
    path('logout', logout, name='logout'),
    path('modifyPwd', modify_pwd, name='modifyPwd'),
    path('home', home, name='home'),
    # path('edit_chart', edit_chart, name='edit_chart'),
    path('get_show_view', get_show_view, name='get_show_view'),
    path('get_sys_charts', get_sys_charts, name='get_sys_charts'),
    path('get_shows', get_shows, name='get_shows'),
    path('show_layers', show_layers, name='show_layers'),
    path('update_show', update_show, name='update_show'),
    path('del_show', del_show, name='del_show'),
    path('del_chart', del_chart, name='del_show'),
    path('update_chart', update_chart, name='update_chart'),
    path('update_series', update_series, name='update_series'),
    path('getPostByUrl', get_post_by_url, name='getPostByUrl'),
    path('get_svg', get_svg, name='get_svg'),
    path('broadcast', broadcast, name='broadcast'),
    path('broadcast_list', broadcast_list, name='broadcast_list'),
    path('broadcast_edit', broadcast_edit, name='broadcast_edit'),
    path('broadcast_show', broadcast_show, name='broadcast_show'),
    path('clone_show', clone_show, name='clone_show'),
    path('del_broadcast', del_broadcast, name='del_broadcast'),
    path('copy_chart', copy_chart, name='copy_chart'),
    path('operate_line', operate_line, name='operate_line'),
    path('show_templates', show_templates, name='show_templates'),
    path('get_carouse_charts', get_carouse_charts, name='get_carouse_charts'),
    path('pos_carouse_charts', pos_carouse_charts, name='pos_carouse_charts'),
    path('del_carouse_charts', del_carouse_charts, name='del_carouse_charts'),
    path('get_property', get_property, name='get_property'),
    path('get_page', get_page, name='get_page'),
    path('show_cate', show_cate, name='show_cate'),
    path('edit_data', edit_data, name='edit_data'),
    path('show_data', show_data, name='show_data'),
    path('show_package', show_package, name='show_package'),
    path('right_click', right_click, name='right_click'),
    path('update_cate', update_cate, name='update_cate'),
    path('upload_images', upload_images, name='upload_images'),
    path('find_images', find_images, name='find_images'),
    path('show_image', show_image, name='show_image'),
    path('remove_image', remove_image, name='remove_image'),
    path('add_material', add_material, name='add_material'),
    path('datasource_list', datasource_list, name='datasource_list'),
    path('datasource_operate', datasource_operate, name='datasource_operate'),
    path('datasource_testing', datasource_testing, name='datasource_testing'),
    path('datasource_execute', datasource_execute, name='datasource_execute'),
    path('carousel_setting', carousel_setting, name='carousel_setting'),
    path('per', per, name='per'),
    # path('test', test, name='test'),
    path('gfy/', include('gfy.urls')),
    
]
