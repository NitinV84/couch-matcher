from django.apps import AppConfig


class CouchManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'couch_management'

    def ready(self):
        import couch_management.signals