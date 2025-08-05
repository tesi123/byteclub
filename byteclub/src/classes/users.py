class users:
    def __init__(self, username, pswd):
        self.username = username
        self.pswd = pswd
        self.userID = 4

    def to_dict(self):
        """Convert the Project instance to a dictionary for easy JSON serialization."""
        return {
            "user_id": self.userID,
            "username": self.username,
            "password": self.pswd,
        }
    
    def from_dict(cls, data):
        """Create a Project instance from a dictionary."""
        return cls(
            userID= data.get("user_id"),
            username= data.get("username"),
            pswd= data.get("password"),
        )
    #function for decrypting
    def decrypt():
        return 1
    
    #function for encrypting
    def encrypt():
        return 1


