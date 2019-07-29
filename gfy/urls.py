from django.conf.urls import url
from django.urls import path

from gfy.views import network_device_list, monitor_detail, net_detail, network_device_count, network_device_object, \
    get_network_device_port_count, get_network_device_port, alert_cookies_count, alert_cookies, alert, alert_count, \
    service_alert, cpu_top, get_other_device, get_current_alert_percent, get_current_alert_count, get_current_status, \
    get_histogram, get_histogram_1, get_line_chart, Fault_overview, get_alert_device_1, get_temperature, \
    get_alert_device_2, get_alert_device_3, get_alert_device_4, get_alert_device_content_1, get_alert_device_content_2, \
    get_alert_device_content_3, get_alert_device_content_4, Ups_Electrical_voltage, Ups, \
    get_health_percent, three_d, demo

urlpatterns = [
    path('network_device_list', network_device_list, name='network_device_list'),
    path('network_device_object', network_device_object),
    path('monitor_detail', monitor_detail),
    path('net_detail', net_detail),
    path('network_device_count', network_device_count),
    path('get_network_device_port_count', get_network_device_port_count),
    path('get_network_device_port', get_network_device_port),
    path('alert_cookies_count', alert_cookies_count),
    path('alert_cookies', alert_cookies),
    path('alert', alert),
    path('alert_count', alert_count),
    path('service_alert', service_alert),
    path('cpu_top', cpu_top),
    path('get_other_device', get_other_device),
    path('get_current_alert_percent', get_current_alert_percent),
    path('get_current_alert_count', get_current_alert_count),
    path('get_current_status', get_current_status),
    path('get_histogram', get_histogram),
    path('get_histogram_1', get_histogram_1),
    path('get_line_chart', get_line_chart),
    path('Fault_overview', Fault_overview),
    path('get_alert_device_1', get_alert_device_1),
    path('get_alert_device_2', get_alert_device_2),
    path('get_alert_device_3', get_alert_device_3),
    path('get_alert_device_4', get_alert_device_4),
    path('get_temperature', get_temperature),
    path('get_alert_device_content_1', get_alert_device_content_1),
    path('get_alert_device_content_2', get_alert_device_content_2),
    path('get_alert_device_content_3', get_alert_device_content_3),
    path('get_alert_device_content_4', get_alert_device_content_4),
    path('Ups_Electrical_voltage', Ups_Electrical_voltage),
    path('Ups', Ups),
    path('get_health_percent', get_health_percent),
    path('three_d', three_d),
    path('demo', demo),
]
