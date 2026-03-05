from __future__ import annotations

from django.contrib import messages
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods

from .forms import GreetingForm
from .models import Greeting


@require_http_methods(["GET", "POST"])
def index(request: HttpRequest) -> HttpResponse:
    """Home page: shows the form and greets the user.

    Uses the PRG pattern (Post/Redirect/Get) to prevent accidental resubmits
    on page refresh and to show feedback via Django messages.
    """
    if request.method == "POST":
        form = GreetingForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            Greeting.objects.create(name=name)
            messages.success(request, f"Hello, {name}! Welcome to our site.")
            return redirect("index")
        messages.error(request, "Please fix the errors below.")
    else:
        form = GreetingForm()

    last_greetings = Greeting.objects.all()[:5]
    return render(
        request,
        "greeting/index.html",
        {
            "form": form,
            "last_greetings": last_greetings,
        },
    )


@require_http_methods(["GET"])
def history(request: HttpRequest) -> HttpResponse:
    """Shows the latest greetings saved in the database."""
    greetings = Greeting.objects.all()[:50]
    return render(request, "greeting/history.html", {"greetings": greetings})


@require_http_methods(["GET"])
def api_greetings(request: HttpRequest) -> JsonResponse:
    """A tiny JSON API endpoint.

    Intended as a starting point for future extension (auth, pagination, etc.).
    """
    limit = min(int(request.GET.get("limit", "20")), 100)
    items = [
        {"name": g.name, "created_at": g.created_at.isoformat()}
        for g in Greeting.objects.all()[:limit]
    ]
    return JsonResponse({"count": len(items), "items": items})
