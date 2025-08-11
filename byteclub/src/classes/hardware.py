#nb28574

class hardwareSet: #class to manage hardware set
    def __init__(self): #constructor to initialize the hardware set
        self.__capacity = 0 #setting initial capacity to 0, private variable
        self.__availability = 0 #setting initial availability to 0, private variable
        self.__checkedOut = [] # list to keep track of checked out units for each projectID

    def initialize_capacity(self, qty): # method to initialize the capacity of the hardware set
        self.__capacity = qty # set capacity to qty
        self.__availability = qty   # set availability to qty
        self.__checkedOut=[]    # set checked out list
        

    def get_availability(self): # method to get the number of available units
        return self.__availability  #returning the number of available units
    
    def get_capacity(self): # method to get the total capacity of the hardware set
        # This method returns the total capacity of the hardware set
        return self.__capacity #returning the total capacity of the hardware set
    

    def check_out(self, qty, projectID): # method that checks out number of units specified by qty for a specific projectID
    # Ensure the checkedOut list is long enough
        if projectID >= len(self.__checkedOut): #if the projectID is greater than the length of the checkedOut list
            self.__checkedOut.extend([0] * (projectID - len(self.__checkedOut) + 1)) # extend the list with zeros

        if qty <= self.__availability: # if the requested quantity is less than or equal to the available units
            self.__availability -= qty #subtract the requested quantity from the available units
            self.__checkedOut[projectID] += qty # add the requested quantity to the checked out list for the specific projectID
            return 0  # Success
        elif self.__availability > 0: #if the avail is less checkout as much as possible
            # Not enough units available, allow partial checkout
            checked_out_qty = self.__availability # Check how many can be checked out
            self.__checkedOut[projectID] += checked_out_qty # Add to the checked out list for the specific projectID
            self.__availability = 0 # Set availability to 0 since all available units are checked out
            return -2
        else:
            return -1  # Error: not enough units

 
    def check_in(self, qty, projectID): # method that checks in number of units specified by qty for a specific projectID
    # Check if projectID is valid
        if projectID >= len(self.__checkedOut): # if the projectID is greater than the length of the checkedOut list
            return -1  # Project never checked out anything

        #check if check in what is checkedOut
        if qty <= self.__checkedOut[projectID]: 
            # Proceed with check-in
            self.__checkedOut[projectID] -= qty # Subtract the checked in quantity from the checked out list for the specific projectID
            self.__availability += qty # Add the checked in quantity to the available units
            return 0
        elif self.__availability < self.__capacity: #checkIn what you can and return error
            maxCheckIn = self.__capacity - self.__availability
            self.__availability += maxCheckIn
            self.__checkedOut[projectID] -= maxCheckIn
            return -2 
        else: # can't checkIn more just error
            return -1

