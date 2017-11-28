import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE",'PilotProject.settings')

import django
django.setup()


def populate():
    pass

if __name__== '__main__':
    print('started')
    populate()
    print('ended')
