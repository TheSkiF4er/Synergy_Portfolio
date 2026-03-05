from datetime import date
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

from birthdate_app.core import analyze_birthdate
from birthdate_app.validation import validate_birthdate, ValidationPolicy, BirthdateValidationError

from .forms import BirthdateForm
from .models import HistoryEntry


def index(request: HttpRequest) -> HttpResponse:
    result = None
    error = None
    policy = ValidationPolicy()

    if request.method == 'POST':
        form = BirthdateForm(request.POST)
        if form.is_valid():
            try:
                user = (form.cleaned_data.get('user') or 'anonymous').strip() or 'anonymous'
                birth_date = validate_birthdate(
                    form.cleaned_data['day'],
                    form.cleaned_data['month'],
                    form.cleaned_data['year'],
                    policy=policy,
                )
                res = analyze_birthdate(birth_date)
                result = res

                HistoryEntry.objects.create(
                    user=user,
                    birth_date=birth_date,
                    weekday_ru=res.weekday_ru,
                    is_leap_year=res.is_leap_year,
                    age_years=res.age_years,
                )
            except BirthdateValidationError as e:
                error = str(e)
        else:
            error = "Проверьте поля формы."
    else:
        form = BirthdateForm()

    history = HistoryEntry.objects.all()[:20]
    return render(request, 'birthdate_web_app/index.html', {'form': form, 'result': result, 'error': error, 'history': history})
