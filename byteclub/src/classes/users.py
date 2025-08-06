class users:
    def __init__(self, username, pswd, userID=""):
        self.username = username
        self.pswd = pswd
        self.userID = userID

    def fillID(self, userID):
        self.userID = userID
        return self.userID

    def to_dict(self):
        """Convert the User instance to a dictionary for easy JSON serialization."""
        return {
            "user_id": self.userID,
            "username": self.username,
            "password": self.pswd,
        }

    @classmethod
    def from_dict(cls, data):
        """Create a User instance from a dictionary."""
        return cls(
            username=data.get("username"),
            pswd=data.get("password"),
            userID=data.get("user_id", "")
        )

    def check_outlier(self, char_code):
        return char_code < 34 or char_code > 126  # limit to printable ASCII

    def encrypt_text(self, text, shift):
        new_txt = []
        for ch in text:
            new_ch = ord(ch) + shift
            if not self.check_outlier(new_ch):
                new_txt.append(chr(new_ch))
            else:
                new_txt.append(ch)
        return ''.join(new_txt)

    def decrypt_text(self, text, shift):
        return self.encrypt_text(text, -shift)

    def encrypt_user(self, shift):
        self.username = self.encrypt_text(self.username, shift)
        self.pswd = self.encrypt_text(self.pswd, shift)

    def decrypt_user(self, shift):
        self.username = self.decrypt_text(self.username, shift)
        self.pswd = self.decrypt_text(self.pswd, shift)