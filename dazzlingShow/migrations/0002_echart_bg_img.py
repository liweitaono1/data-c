# Generated by Django 2.0.4 on 2018-07-12 03:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dazzlingShow', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='echart',
            name='bg_img',
            field=models.CharField(blank=True, default='', max_length=255, verbose_name='背景图片'),
        ),
    ]
