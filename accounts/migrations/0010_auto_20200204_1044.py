# Generated by Django 2.2 on 2020-02-04 09:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='associated',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='nots', to='accounts.Profile'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='friendship',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='accounts.FriendShip'),
        ),
    ]