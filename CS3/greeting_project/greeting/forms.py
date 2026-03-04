from django import forms

class GreetingForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={'class': 'input-field', 'placeholder': 'Enter your name'})
    )
