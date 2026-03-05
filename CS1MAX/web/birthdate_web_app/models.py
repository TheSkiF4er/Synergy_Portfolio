from django.db import models

class HistoryEntry(models.Model):
    user = models.CharField(max_length=128, default='anonymous')
    birth_date = models.DateField()
    weekday_ru = models.CharField(max_length=32)
    is_leap_year = models.BooleanField()
    age_years = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']
