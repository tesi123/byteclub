class project:
    def __init__(self, project_id, project_name, project_desc, members_list=None, num_of_hardware_sets=0, hardware_set_id=None):
        self.project_id = project_id
        self.project_name = project_name
        self.project_desc = project_desc
        self.members_list = members_list if members_list else []
        self.num_of_hardware_sets = num_of_hardware_sets
        self.hardware_set_id = hardware_set_id if hardware_set_id else []


    def add_member(self, member_id):
        if member_id not in self.members:
            self.members_list.append(member_id)
            return True
        return False

    def remove_member(self, member_id):
        if member_id in self.members:
            self.members_list.remove(member_id)
            return True
        return False

    def to_dict(self):
        """Convert the Project instance to a dictionary for easy JSON serialization."""
        return {
            "project_id": self.project_id,
            "project_name": self.project_name,
            "project_desc": self.project_desc,
            "members_list": self.members_list,
            "num_of_hardware_sets": self.num_of_hardware_sets,
            "hardware_set_id": self.hardware_set_id,
        }


    @classmethod
    def from_dict(cls, data):
        """Create a Project instance from a dictionary."""
        return cls(
            project_id=data.get("project_id"),
            project_name=data.get("project_name"),
            project_desc=data.get("project_desc"),
            members_list=data.get("members_list", []),
            num_of_hardware_sets=data.get("num_of_hardware_sets", 0),
            hardware_set_id=data.get("hardware_set_id", []),
        )