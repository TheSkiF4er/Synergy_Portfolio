from django import forms

class GreetingForm(forms.Form):
    """Simple form used on the home page."""

    name = forms.CharField(
        label="Your name",
        max_length=100,
        required=True,
        help_text="We store only your name to greet you back.",
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter your name",
                "autocomplete": "given-name",
                "maxlength": "100",
            }
        ),
    )

    def clean_name(self) -> str:
        """Normalize and validate the entered name."""
        name = (self.cleaned_data.get("name") or "").strip()
        if not name:
            raise forms.ValidationError("Please enter your name.")
        return name
