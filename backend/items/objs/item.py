import json
import locale
import uuid
from .item_template import ItemTemplate
from decimal import Decimal


def validate_with_template(item_type: ItemTemplate, value: any):
    """
    Checks if template top level rules are satisfied. E.g. required, max length, etc.
    """
    if item_type.is_required and value is None:
        raise ValueError(f'{item_type.name} is required')
    # Type the value
    try:
        value = item_type.type_value(value)
    except ValueError:
        raise ValueError(f'{item_type.name} is invalid')
    # Check max length
    if item_type.max_length is not None and len(value) > item_type.max_length:
        raise ValueError(f'{item_type.name} is too long')
    return value


class ItemValue:
    """
    This class process template values when saving and fetching from the database and apply formatting.
    """

    def __init__(self, value: any, template: ItemTemplate):
        self.value = value
        self.template = template

    def typed_value(self):
        return self.template.type_value(self.value)

    def format_value(self):
        # Check if the template has a format
        # If not, return the value as is
        if self.template.format is None or len(self.template.format) == 0:
            return self.value
        return apply_formatting(self.typed_value(), self.template.format)

    def serialize(self, formatting: bool = False):
        result = {
            'template': str(self.template.uuid),
            'value': self.typed_value(),
        }
        if formatting:
            result['formatted_value'] = self.format_value()
        return result

    def deserialize(self, data):
        """
        Deserialize the data from the database to the object.
        """
        self.value = data['value']
        self.template = ItemTemplate(**data['template'])
        return self


def apply_formatting(value: any, obj_format: str) -> str:
    """
    Multiple formatting can be applied to the value.

    Guide:

    Only apply if value is an integer or decimal.
    Currency        -   CURRENCY{en-US}
    Decimal         -   DECIMAL{2}                              [IGNORED if CURRENCY or PERCENTAGE is present]
    Number Locale   -   NUM_LOCALE{en-US}                       [Ignored if CURRENCY is present]
    Percentage      -   PERCENTAGE{2}                           [IGNORED if CURRENCY is present]

    More than one formatting options can be applied to the value separated by a comma.
    For example: "DECIMAL{2},NUMBER_LOCALE{en-US}"
    """

    def extract_formatting(formatting: str):
        """
        Extract all the formatting options from the string and return a list of dictionaries.
        """
        format_list = []
        for fmt in formatting.split(','):
            name, val = fmt.split('{')
            val = val.rstrip('}')
            format_list.append({'name': name.strip(), 'value': val.strip()})
        # Apply our ignore rules
        if any(fmt['name'] == 'CURRENCY' for fmt in format_list):
            # If CURRENCY is present, ignore DECIMAL and NUM_LOCALE
            format_list = [fmt for fmt in format_list if fmt['name'] not in ['DECIMAL', 'NUM_LOCALE', 'PERCENTAGE']]
        elif any(fmt['name'] == 'PERCENTAGE' for fmt in format_list):
            # If PERCENTAGE is present, ignore DECIMAL
            format_list = [fmt for fmt in format_list if fmt['name'] not in ['DECIMAL']]
        # Order to apply formatting
        order = ['CURRENCY', 'DECIMAL', 'PERCENTAGE', 'NUM_LOCALE']
        return sorted(format_list, key=lambda x: order.index(x['name']) if x['name'] in order else len(order))

    if obj_format is None:
        return value

    format_list = extract_formatting(obj_format)
    if isinstance(value, (int, Decimal)):
        for fmt in format_list:
            if fmt['name'] == 'CURRENCY':
                locale.setlocale(locale.LC_ALL, fmt['value'])
                value = locale.currency(value, grouping=True)
                # Reset locale to default
                locale.setlocale(locale.LC_ALL, '')
            elif fmt['name'] == 'DECIMAL':
                decimal_places = int(fmt['value'])
                value = f"{value:.{decimal_places}f}"
            elif fmt['name'] == 'NUM_LOCALE':
                locale.setlocale(locale.LC_ALL, fmt['value'])
                value = f"{value:n}"
                # Reset locale to default
                locale.setlocale(locale.LC_ALL, '')
            elif fmt['name'] == 'PERCENTAGE':
                decimal_places = int(fmt['value'])
                value = f"{value:.{decimal_places}f}%"

    return value
