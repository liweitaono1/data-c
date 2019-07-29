from django.db import models
from django.forms import model_to_dict


class EChartProperty(models.Model):
    chart_type = models.CharField(max_length=255, verbose_name='图表类型')
    title = models.CharField(max_length=255, verbose_name='显示名称')
    axis = models.BooleanField(default=False, verbose_name='是否坐标轴')
    chart_field = models.CharField(max_length=255, verbose_name='图表字段')
    field = models.CharField(max_length=255, verbose_name='字段名称')
    default = models.TextField(default='', verbose_name='默认值')
    options = models.TextField(default='', blank=True, verbose_name='下拉框选项')
    order = models.IntegerField(verbose_name='排序号')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    parent = models.ForeignKey('self', default=None, related_name='children', null=True, verbose_name='父节点',
                               on_delete=models.CASCADE)

    class Meta:
        unique_together = ('chart_type', 'chart_field')


class EChart(models.Model):
    name = models.CharField(max_length=255, verbose_name='图表名称')
    bg_img = models.CharField(default='', blank=True, max_length=255, verbose_name='背景图片')
    chart_option = models.TextField(verbose_name='图表选项')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    @property
    def property_values(self):
        values = EChartPropertyValue.objects.filter(chart_id=self.id).values()
        for value in values:
            values.set('property', model_to_dict(EChartProperty.objects.get(id=value.get('proper_id', ''))))
        return values


class EChartPropertyValue(models.Model):
    chart = models.ForeignKey(EChart, verbose_name='图形', on_delete=models.CASCADE)
    proper = models.ForeignKey(EChartProperty, verbose_name='属性', on_delete=models.CASCADE)
    select_value = models.CharField(max_length=255, verbose_name='选项值')
    value = models.TextField(verbose_name='属性值')


