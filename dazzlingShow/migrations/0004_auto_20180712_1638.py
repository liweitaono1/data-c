# Generated by Django 2.0.4 on 2018-07-12 08:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dazzlingShow', '0003_echartproperty_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='echartproperty',
            name='parent',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='dazzlingShow.EChartProperty', verbose_name='父节点'),
        ),
    ]
