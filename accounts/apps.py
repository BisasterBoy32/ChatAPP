from django.apps import AppConfig
# from django.utils.translation import ugettext_lazy as _

class AccountsConfig(AppConfig):
    name = 'accounts'
    verbose_name = 'accounts'

    def ready(self):
        import accounts.signals  # noqa

