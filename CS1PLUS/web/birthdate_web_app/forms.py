from django import forms

class BirthdateForm(forms.Form):
    user = forms.CharField(required=False, max_length=128, initial='anonymous', label='Пользователь')
    day = forms.IntegerField(min_value=1, max_value=31, label='День')
    month = forms.IntegerField(min_value=1, max_value=12, label='Месяц')
    year = forms.IntegerField(min_value=1900, label='Год')
