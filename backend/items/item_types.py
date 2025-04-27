class Types:
    """
    Returns list of valid types for ItemTemplate
    """

    def __init__(self):
        self.types = ['short_text', 'long_text', 'number', 'decimal', 'boolean', 'date',
                      'time', 'datetime', 'email', 'url', 'phone', 'password', 'multiple']

    def get_types(self):
        return self.types

    SHORT_TEXT = 'short_text'
    LONG_TEXT = 'long_text'
    NUMBER = 'number'
    DECIMAL = 'decimal'
    BOOLEAN = 'boolean'
    DATE = 'date'
    TIME = 'time'
    DATETIME = 'datetime'
    EMAIL = 'email'
    URL = 'url'
    PHONE = 'phone'
    PASSWORD = 'password'
    MULTIPLE = 'multiple'
