import json
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from couch_management.models import Sofa


class Command(BaseCommand):
    help = 'Imports sofas data from a JSON file and creates entries in the database'

    def handle(self, *args, **kwargs):
        try:
            with open('sofa_data.json', 'r', encoding='utf-8') as file:
                json_data = json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('File not found. Please check the path to your JSON file.'))
            return
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR('Error decoding the JSON file. Please check its format.'))
            return

        for sofa_data in json_data:
            name = sofa_data.get('name', '').strip()
            price = sofa_data.get('price', '').replace(',', '')
            discount = sofa_data.get('discount', '0')
            image_name = sofa_data.get('image_name', '').strip()
            description = sofa_data.get('description', '')


            image_path = Path('sofa_images') / image_name

            if image_path.is_file():
                with open(image_path, 'rb') as img:
                    image_file = File(img, name=image_name)

                    Sofa.objects.create(
                        name=name,
                        price=float(price),
                        discount=float(discount),
                        image=image_file,
                        description=description
                    )

        self.stdout.write(self.style.SUCCESS(f'Successfully imported {len(json_data)} sofas'))
