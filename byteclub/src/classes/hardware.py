class hardware:
    def __init__(self, availability, capacity):
        self.avail = availability
        self.cap = capacity

    #function to check for outliers so that it can return error
    #if you checkIn more than cap, or checkOut more than cap
    def outliers (self, num, ischeckOut):
        if ischeckOut and (self.avail - num < 0):
            print ("can't checkout this amount. Max amount to request is " + str(self.avail))
            return True
        elif not ischeckOut and (self.avail + num > self.cap):
            print ("can't checkIn this amount. Max amount to checkIn is " + str(self.cap - self.avail))
            return True
        return False
    

    #function to checkin hardware , add num to available quantities
    def checkin (self, num):
        if not self.outliers (num, False):
            self.avail = self.avail + num
            return True
        return False
    
    #function to checkout hardware,  reduce num to available quantities
    def checkout (self, num):
        if self.outliers (num, True):
            self.avail = self.avail - num
            return True
        return False 
    