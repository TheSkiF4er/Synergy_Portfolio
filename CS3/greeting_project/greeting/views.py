from django.shortcuts import render
from .forms import GreetingForm
from .models import Greeting

def index(request):
    greeting_message = None
    error = None

    if request.method == 'POST':
        form = GreetingForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            Greeting.objects.create(name=name)
            greeting_message = f"Hello, {name}! Welcome to our site."
        else:
            error = "Name field cannot be empty."
    else:
        form = GreetingForm()

    return render(request, 'greeting/index.html', {
        'form': form,
        'greeting_message': greeting_message,
        'error': error
    })
