from django.db import models

class Greeting(models.Model):
    """Stores a single greeting submission.

    Only the visitor name is stored (no emails / identifiers),
    plus a timestamp for simple auditability and ordering.
    """

    name = models.CharField("Name", max_length=100)
    created_at = models.DateTimeField("Created at", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.created_at:%Y-%m-%d %H:%M})"
