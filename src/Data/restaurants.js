const seedRestaurants = [
  {
    id: "R1",
    name: "Spice Garden",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751024", specialIdentification: "Near KIIT Square" },
    cuisine: { name: "North Indian", description: "Authentic North Indian Flavours", cuisinePicture: "/images/cuisine/northindian.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.3,
    images: ["/images/restaurants/r1-1.jpg", "/images/restaurants/r1-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Outdoor Lawn"], seatsPerTable: [4, 2, 6] },
    menu: ["/images/menu/r1-menu1.jpg", "/images/menu/r1-menu2.jpg"],
    openingTime: "10:00 AM",
    closingTime: "11:00 PM",
    offDays: ["Monday"],
    specialMessages: "Enjoy live music on weekends"
  },
  {
    id: "R2",
    name: "Urban Tandoor",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751013", specialIdentification: "Patia Main Road" },
    cuisine: { name: "Mughlai", description: "Rich Mughlai and Tandoori Dishes", cuisinePicture: "/images/cuisine/mughlai.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r2-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Private Dining"], seatsPerTable: [4, 8] },
    menu: ["/images/menu/r2-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "10:30 PM",
    offDays: ["Tuesday"],
    specialMessages: "Flat 10% discount on pre-booking"
  },
  {
    id: "R3",
    name: "Green Leaf Veg",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751021", specialIdentification: "Saheed Nagar" },
    cuisine: { name: "Pure Veg", description: "Healthy Vegetarian Cuisine", cuisinePicture: "/images/cuisine/veg.jpg" },
    isVegOnly: true,
    hasAC: false,
    rating: 4.1,
    images: ["/images/restaurants/r3-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Outdoor Lawn"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r3-menu1.jpg"],
    openingTime: "8:00 AM",
    closingTime: "9:00 PM",
    offDays: [],
    specialMessages: "Organic ingredients used"
  },
  {
    id: "R4",
    name: "Dragon Wok",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751015", specialIdentification: "Nayapalli Square" },
    cuisine: { name: "Chinese", description: "Authentic Chinese & Pan Asian", cuisinePicture: "/images/cuisine/chinese.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r4-1.jpg", "/images/restaurants/r4-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Rooftop"], seatsPerTable: [4, 2, 6] },
    menu: ["/images/menu/r4-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "11:30 PM",
    offDays: [],
    specialMessages: "Happy hours 4-7 PM"
  },
  {
    id: "R5",
    name: "La Bella Italia",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751012", specialIdentification: "BMC Bhawani Mall" },
    cuisine: { name: "Italian", description: "Classic Italian Pizzas & Pastas", cuisinePicture: "/images/cuisine/italian.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.6,
    images: ["/images/restaurants/r5-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Private Dining"], seatsPerTable: [4, 2, 10] },
    menu: ["/images/menu/r5-menu1.jpg", "/images/menu/r5-menu2.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: ["Wednesday"],
    specialMessages: "Wood-fired pizza oven"
  },
  {
    id: "R6",
    name: "Coastal Catch",
    location: { country: "India", state: "Odisha", district: "Puri", city: "Puri", pin: "752001", specialIdentification: "Near Sea Beach" },
    cuisine: { name: "Seafood", description: "Fresh Coastal Seafood Delights", cuisinePicture: "/images/cuisine/seafood.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.7,
    images: ["/images/restaurants/r6-1.jpg", "/images/restaurants/r6-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Outdoor Beach", "Standard Table", "Cabana"], seatsPerTable: [6, 4, 8] },
    menu: ["/images/menu/r6-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Fresh catch daily"
  },
  {
    id: "R7",
    name: "Taco Fiesta",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751010", specialIdentification: "Janpath Road" },
    cuisine: { name: "Mexican", description: "Authentic Mexican Street Food", cuisinePicture: "/images/cuisine/mexican.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.2,
    images: ["/images/restaurants/r7-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Bar Counter"], seatsPerTable: [4, 2] },
    menu: ["/images/menu/r7-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: ["Monday"],
    specialMessages: "Taco Tuesdays - Buy 1 Get 1"
  },
  {
    id: "R8",
    name: "Sushi Zen",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751014", specialIdentification: "Infocity Area" },
    cuisine: { name: "Japanese", description: "Traditional Japanese Sushi & Ramen", cuisinePicture: "/images/cuisine/japanese.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.8,
    images: ["/images/restaurants/r8-1.jpg", "/images/restaurants/r8-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Tatami Room", "Bar Counter"], seatsPerTable: [4, 6, 2] },
    menu: ["/images/menu/r8-menu1.jpg"],
    openingTime: "1:00 PM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Authentic Japanese chef"
  },
  {
    id: "R9",
    name: "BBQ Nation",
    location: { country: "India", state: "Odisha", district: "Cuttack", city: "Cuttack", pin: "753001", specialIdentification: "Badambadi" },
    cuisine: { name: "BBQ & Grills", description: "Live Grill Experience", cuisinePicture: "/images/cuisine/bbq.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r9-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table"], seatsPerTable: [6, 4] },
    menu: ["/images/menu/r9-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Unlimited buffet available"
  },
  {
    id: "R10",
    name: "Chai Sutta Bar",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751006", specialIdentification: "Kharvel Nagar" },
    cuisine: { name: "Cafe", description: "Chai, Snacks & Beverages", cuisinePicture: "/images/cuisine/cafe.jpg" },
    isVegOnly: true,
    hasAC: false,
    rating: 4.0,
    images: ["/images/restaurants/r10-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Outdoor Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r10-menu1.jpg"],
    openingTime: "7:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Best chai in town"
  },
  {
    id: "R11",
    name: "Royal Rajasthani",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751018", specialIdentification: "Master Canteen Square" },
    cuisine: { name: "Rajasthani", description: "Traditional Rajasthani Thali", cuisinePicture: "/images/cuisine/rajasthani.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r11-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Floor Seating"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r11-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: ["Thursday"],
    specialMessages: "Royal Thali Experience"
  },
  {
    id: "R12",
    name: "Thai Orchid",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751022", specialIdentification: "Chandrasekharpur" },
    cuisine: { name: "Thai", description: "Authentic Thai Curries & Soups", cuisinePicture: "/images/cuisine/thai.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.3,
    images: ["/images/restaurants/r12-1.jpg", "/images/restaurants/r12-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Private Dining"], seatsPerTable: [4, 2, 8] },
    menu: ["/images/menu/r12-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "10:30 PM",
    offDays: ["Monday"],
    specialMessages: "Imported Thai ingredients"
  },
  {
    id: "R13",
    name: "Biryani House",
    location: { country: "India", state: "Odisha", district: "Cuttack", city: "Cuttack", pin: "753003", specialIdentification: "Buxi Bazaar" },
    cuisine: { name: "Biryani & Kebabs", description: "Hyderabadi & Lucknowi Biryani", cuisinePicture: "/images/cuisine/biryani.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.6,
    images: ["/images/restaurants/r13-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r13-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Dum cooked biryani"
  },
  {
    id: "R14",
    name: "The Breakfast Club",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751009", specialIdentification: "Jaydev Vihar" },
    cuisine: { name: "Continental", description: "All Day Breakfast & Brunch", cuisinePicture: "/images/cuisine/continental.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.2,
    images: ["/images/restaurants/r14-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Outdoor Patio"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r14-menu1.jpg"],
    openingTime: "7:00 AM",
    closingTime: "4:00 PM",
    offDays: [],
    specialMessages: "Sunday Brunch Special"
  },
  {
    id: "R15",
    name: "South Spice",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751016", specialIdentification: "Vani Vihar" },
    cuisine: { name: "South Indian", description: "Authentic South Indian Delicacies", cuisinePicture: "/images/cuisine/southindian.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r15-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Booth"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r15-menu1.jpg"],
    openingTime: "6:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Filter coffee available"
  },
  {
    id: "R16",
    name: "Punjabi Dhaba",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751020", specialIdentification: "Rasulgarh" },
    cuisine: { name: "Punjabi", description: "Dhaba Style Punjabi Food", cuisinePicture: "/images/cuisine/punjabi.jpg" },
    isVegOnly: false,
    hasAC: false,
    rating: 4.1,
    images: ["/images/restaurants/r16-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Floor Seating"], seatsPerTable: [4, 8] },
    menu: ["/images/menu/r16-menu1.jpg"],
    openingTime: "10:00 AM",
    closingTime: "11:30 PM",
    offDays: [],
    specialMessages: "Highway style dhaba"
  },
  {
    id: "R17",
    name: "The Burger Joint",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751023", specialIdentification: "Sundarpada" },
    cuisine: { name: "American", description: "Gourmet Burgers & Shakes", cuisinePicture: "/images/cuisine/american.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.3,
    images: ["/images/restaurants/r17-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Bar Counter"], seatsPerTable: [4, 2] },
    menu: ["/images/menu/r17-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Craft burgers"
  },
  {
    id: "R18",
    name: "Udupi Café",
    location: { country: "India", state: "Odisha", district: "Puri", city: "Puri", pin: "752002", specialIdentification: "Grand Road" },
    cuisine: { name: "Udupi", description: "Traditional Udupi Cuisine", cuisinePicture: "/images/cuisine/udupi.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r18-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table"], seatsPerTable: [4] },
    menu: ["/images/menu/r18-menu1.jpg"],
    openingTime: "7:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Pure vegetarian"
  },
  {
    id: "R19",
    name: "Flame Grill",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751011", specialIdentification: "Damana Square" },
    cuisine: { name: "Multi-Cuisine", description: "Grills & Global Cuisine", cuisinePicture: "/images/cuisine/multicuisine.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r19-1.jpg", "/images/restaurants/r19-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Rooftop"], seatsPerTable: [4, 6, 8] },
    menu: ["/images/menu/r19-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "12:00 AM",
    offDays: [],
    specialMessages: "Rooftop dining available"
  },
  {
    id: "R20",
    name: "Kolkata Rolls",
    location: { country: "India", state: "Odisha", district: "Cuttack", city: "Cuttack", pin: "753012", specialIdentification: "Mahanadi Vihar" },
    cuisine: { name: "Street Food", description: "Famous Kolkata Kathi Rolls", cuisinePicture: "/images/cuisine/streetfood.jpg" },
    isVegOnly: false,
    hasAC: false,
    rating: 4.0,
    images: ["/images/restaurants/r20-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Counter Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r20-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Authentic Kolkata taste"
  },
  {
    id: "R21",
    name: "Kerala Kitchen",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751007", specialIdentification: "Old Town" },
    cuisine: { name: "Kerala", description: "Traditional Kerala Sadya", cuisinePicture: "/images/cuisine/kerala.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.6,
    images: ["/images/restaurants/r21-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Banana Leaf Dining"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r21-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: ["Wednesday"],
    specialMessages: "Traditional Sadya on Sundays"
  },
  {
    id: "R22",
    name: "The Pizza Hub",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751025", specialIdentification: "Kalinga Nagar" },
    cuisine: { name: "Italian Pizza", description: "Thin Crust & Deep Dish Pizzas", cuisinePicture: "/images/cuisine/pizza.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.2,
    images: ["/images/restaurants/r22-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table"], seatsPerTable: [4, 2] },
    menu: ["/images/menu/r22-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Delivery available"
  },
  {
    id: "R23",
    name: "Bihari Litti Chokha",
    location: { country: "India", state: "Odisha", district: "Sambalpur", city: "Sambalpur", pin: "768001", specialIdentification: "Ainthapali" },
    cuisine: { name: "Bihari", description: "Authentic Bihari Litti Chokha", cuisinePicture: "/images/cuisine/bihari.jpg" },
    isVegOnly: true,
    hasAC: false,
    rating: 3.9,
    images: ["/images/restaurants/r23-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table"], seatsPerTable: [4] },
    menu: ["/images/menu/r23-menu1.jpg"],
    openingTime: "9:00 AM",
    closingTime: "9:00 PM",
    offDays: [],
    specialMessages: "Coal roasted litti"
  },
  {
    id: "R24",
    name: "The Salad Bar",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751017", specialIdentification: "Palladium Mall" },
    cuisine: { name: "Health Food", description: "Fresh Salads & Smoothie Bowls", cuisinePicture: "/images/cuisine/healthfood.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.1,
    images: ["/images/restaurants/r24-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "High Counter"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r24-menu1.jpg"],
    openingTime: "8:00 AM",
    closingTime: "9:00 PM",
    offDays: [],
    specialMessages: "Keto & Vegan options"
  },
  {
    id: "R25",
    name: "Tandoori Nights",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751008", specialIdentification: "Forest Park" },
    cuisine: { name: "Tandoori", description: "Clay Oven Tandoori Specialties", cuisinePicture: "/images/cuisine/tandoori.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r25-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Outdoor Garden"], seatsPerTable: [4, 6, 8] },
    menu: ["/images/menu/r25-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: ["Monday"],
    specialMessages: "Live tandoor counter"
  },
  {
    id: "R26",
    name: "Bengali Bites",
    location: { country: "India", state: "Odisha", district: "Balasore", city: "Balasore", pin: "756001", specialIdentification: "Station Road" },
    cuisine: { name: "Bengali", description: "Traditional Bengali Fish Curry", cuisinePicture: "/images/cuisine/bengali.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r26-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Booth"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r26-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: ["Tuesday"],
    specialMessages: "Fresh river fish daily"
  },
  {
    id: "R27",
    name: "Momos Corner",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751019", specialIdentification: "Baramunda" },
    cuisine: { name: "Tibetan", description: "Steamed & Fried Momos", cuisinePicture: "/images/cuisine/tibetan.jpg" },
    isVegOnly: false,
    hasAC: false,
    rating: 4.0,
    images: ["/images/restaurants/r27-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Counter Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r27-menu1.jpg"],
    openingTime: "10:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Homemade momos"
  },
  {
    id: "R28",
    name: "The Waffle House",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751030", specialIdentification: "Patrapada" },
    cuisine: { name: "Desserts", description: "Waffles, Pancakes & Desserts", cuisinePicture: "/images/cuisine/desserts.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.3,
    images: ["/images/restaurants/r28-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table"], seatsPerTable: [4, 2] },
    menu: ["/images/menu/r28-menu1.jpg"],
    openingTime: "9:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Instagram worthy desserts"
  },
  {
    id: "R29",
    name: "Chettinad Spice",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751031", specialIdentification: "Tamando" },
    cuisine: { name: "Chettinad", description: "Spicy Chettinad Cuisine", cuisinePicture: "/images/cuisine/chettinad.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r29-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Floor Seating"], seatsPerTable: [4, 8] },
    menu: ["/images/menu/r29-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "10:00 PM",
    offDays: ["Wednesday"],
    specialMessages: "Spicy food warning"
  },
  {
    id: "R30",
    name: "Dim Sum Palace",
    location: { country: "India", state: "Odisha", district: "Rourkela", city: "Rourkela", pin: "769001", specialIdentification: "Udit Nagar" },
    cuisine: { name: "Dim Sum", description: "Authentic Chinese Dim Sum", cuisinePicture: "/images/cuisine/dimsum.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.6,
    images: ["/images/restaurants/r30-1.jpg", "/images/restaurants/r30-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Private Dining"], seatsPerTable: [4, 2, 10] },
    menu: ["/images/menu/r30-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:30 PM",
    offDays: [],
    specialMessages: "Dim sum cart service"
  },
  {
    id: "R31",
    name: "Paratha King",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751026", specialIdentification: "Pahala" },
    cuisine: { name: "North Indian", description: "100+ Varieties of Parathas", cuisinePicture: "/images/cuisine/parathas.jpg" },
    isVegOnly: true,
    hasAC: false,
    rating: 4.1,
    images: ["/images/restaurants/r31-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table"], seatsPerTable: [4] },
    menu: ["/images/menu/r31-menu1.jpg"],
    openingTime: "7:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Famous stuffed parathas"
  },
  {
    id: "R32",
    name: "Mediterranean Grill",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751027", specialIdentification: "Aerodrome Area" },
    cuisine: { name: "Mediterranean", description: "Greek & Turkish Delights", cuisinePicture: "/images/cuisine/mediterranean.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r32-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Rooftop"], seatsPerTable: [4, 6, 8] },
    menu: ["/images/menu/r32-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: ["Monday"],
    specialMessages: "Imported ingredients"
  },
  {
    id: "R33",
    name: "Chai Point Express",
    location: { country: "India", state: "Odisha", district: "Cuttack", city: "Cuttack", pin: "753004", specialIdentification: "College Square" },
    cuisine: { name: "Beverages", description: "Quick Chai & Snacks", cuisinePicture: "/images/cuisine/beverages.jpg" },
    isVegOnly: true,
    hasAC: false,
    rating: 3.9,
    images: ["/images/restaurants/r33-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Counter Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r33-menu1.jpg"],
    openingTime: "6:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Quick service"
  },
  {
    id: "R34",
    name: "Hyderabadi Paradise",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751028", specialIdentification: "Govind Nagar" },
    cuisine: { name: "Hyderabadi", description: "Authentic Hyderabadi Cuisine", cuisinePicture: "/images/cuisine/hyderabadi.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.7,
    images: ["/images/restaurants/r34-1.jpg", "/images/restaurants/r34-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table"], seatsPerTable: [6, 4] },
    menu: ["/images/menu/r34-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Haleem on weekends"
  },
  {
    id: "R35",
    name: "Pasta Paradise",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751029", specialIdentification: "Patia Square" },
    cuisine: { name: "Italian Pasta", description: "Fresh Handmade Pasta", cuisinePicture: "/images/cuisine/pasta.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.2,
    images: ["/images/restaurants/r35-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table"], seatsPerTable: [4, 2] },
    menu: ["/images/menu/r35-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: ["Tuesday"],
    specialMessages: "Make your own pasta"
  },
  {
    id: "R36",
    name: "Andhra Mess",
    location: { country: "India", state: "Odisha", district: "Berhampur", city: "Berhampur", pin: "760001", specialIdentification: "Bada Bazaar" },
    cuisine: { name: "Andhra", description: "Spicy Andhra Meals", cuisinePicture: "/images/cuisine/andhra.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.3,
    images: ["/images/restaurants/r36-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Banana Leaf Dining"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r36-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Unlimited rice meals"
  },
  {
    id: "R37",
    name: "Boba Tea Lounge",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751032", specialIdentification: "DN Regalia Mall" },
    cuisine: { name: "Bubble Tea", description: "Boba Tea & Asian Snacks", cuisinePicture: "/images/cuisine/bobatea.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.0,
    images: ["/images/restaurants/r37-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Lounge Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r37-menu1.jpg"],
    openingTime: "10:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "50+ flavors available"
  },
  {
    id: "R38",
    name: "Korean BBQ House",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751033", specialIdentification: "Mancheswar" },
    cuisine: { name: "Korean", description: "Korean BBQ & Kimchi", cuisinePicture: "/images/cuisine/korean.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.6,
    images: ["/images/restaurants/r38-1.jpg", "/images/restaurants/r38-2.jpg"],
    tabledescription: { tableTypesAvailable: ["BBQ Table", "Standard Table"], seatsPerTable: [6, 4] },
    menu: ["/images/menu/r38-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: ["Wednesday"],
    specialMessages: "Tabletop grilling"
  },
  {
    id: "R39",
    name: "Goan Shack",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751034", specialIdentification: "IRC Village" },
    cuisine: { name: "Goan", description: "Coastal Goan Seafood", cuisinePicture: "/images/cuisine/goan.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r39-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Beach Style Seating"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r39-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: ["Monday"],
    specialMessages: "Feni cocktails available"
  },
  {
    id: "R40",
    name: "Noodle Bar",
    location: { country: "India", state: "Odisha", district: "Sambalpur", city: "Sambalpur", pin: "768002", specialIdentification: "Modipara" },
    cuisine: { name: "Asian Noodles", description: "Pan Asian Noodle Bowls", cuisinePicture: "/images/cuisine/noodles.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.2,
    images: ["/images/restaurants/r40-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Bar Counter", "Standard Table"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r40-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Customize your noodles"
  },
  {
    id: "R41",
    name: "Maharaja Thali",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751035", specialIdentification: "Laxmi Sagar" },
    cuisine: { name: "Thali", description: "Royal Rajasthani & Gujarati Thali", cuisinePicture: "/images/cuisine/thali.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r41-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Floor Seating"], seatsPerTable: [4, 6] },
    menu: ["/images/menu/r41-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "10:00 PM",
    offDays: ["Thursday"],
    specialMessages: "Unlimited thali service"
  },
  {
    id: "R42",
    name: "Steak House Premium",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751036", specialIdentification: "Esplanade One Mall" },
    cuisine: { name: "Steakhouse", description: "Premium Grilled Steaks", cuisinePicture: "/images/cuisine/steakhouse.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.8,
    images: ["/images/restaurants/r42-1.jpg", "/images/restaurants/r42-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Private Dining", "Chef's Table"], seatsPerTable: [4, 8, 6] },
    menu: ["/images/menu/r42-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "12:00 AM",
    offDays: [],
    specialMessages: "Wine pairing available"
  },
  {
    id: "R43",
    name: "Dosa Plaza",
    location: { country: "India", state: "Odisha", district: "Rourkela", city: "Rourkela", pin: "769002", specialIdentification: "Civil Township" },
    cuisine: { name: "Dosa Varieties", description: "50+ Types of Dosas", cuisinePicture: "/images/cuisine/dosa.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.1,
    images: ["/images/restaurants/r43-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table"], seatsPerTable: [4] },
    menu: ["/images/menu/r43-menu1.jpg"],
    openingTime: "7:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Famous paper dosa"
  },
  {
    id: "R44",
    name: "Lebanese Delight",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751037", specialIdentification: "Kalinga Hospital Road" },
    cuisine: { name: "Lebanese", description: "Authentic Lebanese Mezze", cuisinePicture: "/images/cuisine/lebanese.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.3,
    images: ["/images/restaurants/r44-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Outdoor Seating"], seatsPerTable: [4, 2, 6] },
    menu: ["/images/menu/r44-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "10:30 PM",
    offDays: ["Tuesday"],
    specialMessages: "Hookah lounge available"
  },
  {
    id: "R45",
    name: "Ice Cream Factory",
    location: { country: "India", state: "Odisha", district: "Cuttack", city: "Cuttack", pin: "753005", specialIdentification: "CDA Sector 9" },
    cuisine: { name: "Ice Cream", description: "Handcrafted Ice Creams", cuisinePicture: "/images/cuisine/icecream.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.4,
    images: ["/images/restaurants/r45-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Counter Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r45-menu1.jpg"],
    openingTime: "10:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Sugar-free options available"
  },
  {
    id: "R46",
    name: "Mughal Darbar",
    location: { country: "India", state: "Odisha", district: "Balasore", city: "Balasore", pin: "756002", specialIdentification: "Fakir Mohan College Road" },
    cuisine: { name: "Mughlai", description: "Rich Mughlai Curries & Kebabs", cuisinePicture: "/images/cuisine/mughlai2.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.6,
    images: ["/images/restaurants/r46-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Booth", "Standard Table", "Private Dining"], seatsPerTable: [4, 6, 10] },
    menu: ["/images/menu/r46-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Royal dining experience"
  },
  {
    id: "R47",
    name: "Smoothie Bowl Cafe",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751038", specialIdentification: "Biju Patnaik Airport Road" },
    cuisine: { name: "Health Bowls", description: "Smoothie & Acai Bowls", cuisinePicture: "/images/cuisine/smoothiebowl.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.2,
    images: ["/images/restaurants/r47-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "High Counter"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r47-menu1.jpg"],
    openingTime: "7:00 AM",
    closingTime: "8:00 PM",
    offDays: [],
    specialMessages: "Organic & Gluten-free"
  },
  {
    id: "R48",
    name: "Kashmiri Wazwan",
    location: { country: "India", state: "Odisha", district: "Berhampur", city: "Berhampur", pin: "760002", specialIdentification: "Silk City Square" },
    cuisine: { name: "Kashmiri", description: "Traditional Kashmiri Wazwan", cuisinePicture: "/images/cuisine/kashmiri.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.5,
    images: ["/images/restaurants/r48-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Floor Seating"], seatsPerTable: [6, 8] },
    menu: ["/images/menu/r48-menu1.jpg"],
    openingTime: "12:00 PM",
    closingTime: "10:00 PM",
    offDays: ["Wednesday"],
    specialMessages: "Rista & Gushtaba specialty"
  },
  {
    id: "R49",
    name: "Bakery Bliss",
    location: { country: "India", state: "Odisha", district: "Khordha", city: "Bhubaneswar", pin: "751039", specialIdentification: "Jharapada" },
    cuisine: { name: "Bakery", description: "Fresh Breads & Pastries", cuisinePicture: "/images/cuisine/bakery.jpg" },
    isVegOnly: true,
    hasAC: true,
    rating: 4.0,
    images: ["/images/restaurants/r49-1.jpg"],
    tabledescription: { tableTypesAvailable: ["Standard Table", "Counter Seating"], seatsPerTable: [2, 4] },
    menu: ["/images/menu/r49-menu1.jpg"],
    openingTime: "6:00 AM",
    closingTime: "10:00 PM",
    offDays: [],
    specialMessages: "Fresh baked daily"
  },
  {
    id: "R50",
    name: "Seafood Galley",
    location: { country: "India", state: "Odisha", district: "Puri", city: "Puri", pin: "752003", specialIdentification: "Chakratirtha Road" },
    cuisine: { name: "Coastal Seafood", description: "Fresh Catch from Bay of Bengal", cuisinePicture: "/images/cuisine/seafood2.jpg" },
    isVegOnly: false,
    hasAC: true,
    rating: 4.7,
    images: ["/images/restaurants/r50-1.jpg", "/images/restaurants/r50-2.jpg"],
    tabledescription: { tableTypesAvailable: ["Outdoor Beach", "Standard Table", "Private Cabana"], seatsPerTable: [6, 4, 10] },
    menu: ["/images/menu/r50-menu1.jpg"],
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
    offDays: [],
    specialMessages: "Sunset dining experience"
  }
];

// Base calendar labels used to compute availability and off-day logic.
// These names are reused when we derive service days from the seeded data
// and when we generate realistic booking windows for the synthetic restaurants.
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Each cuisine entry defines the display name, the short explanation shown in UI,
// and whether the restaurant is mostly vegetarian-friendly.
// The generator uses this catalog so the synthetic restaurants still feel grounded
// in real restaurant types rather than random names.
const cuisineCatalog = [
  { name: 'North Indian', description: 'Authentic North Indian Flavours', cuisinePicture: '/images/cuisine/northindian.jpg', vegFriendly: false },
  { name: 'Mughlai', description: 'Rich Mughlai and Tandoori Dishes', cuisinePicture: '/images/cuisine/mughlai.jpg', vegFriendly: false },
  { name: 'Pure Veg', description: 'Healthy Vegetarian Cuisine', cuisinePicture: '/images/cuisine/veg.jpg', vegFriendly: true },
  { name: 'Chinese', description: 'Authentic Chinese & Pan Asian', cuisinePicture: '/images/cuisine/chinese.jpg', vegFriendly: false },
  { name: 'Italian', description: 'Classic Italian Pizzas & Pastas', cuisinePicture: '/images/cuisine/italian.jpg', vegFriendly: false },
  { name: 'Seafood', description: 'Fresh Coastal Seafood Delights', cuisinePicture: '/images/cuisine/seafood.jpg', vegFriendly: false },
  { name: 'Cafe', description: 'Brewed coffee, snacks and desserts', cuisinePicture: '/images/cuisine/cafe.jpg', vegFriendly: true },
  { name: 'Biryani & Kebabs', description: 'Aromatic biryani and charcoal kebabs', cuisinePicture: '/images/cuisine/biryani.jpg', vegFriendly: false },
  { name: 'South Indian', description: 'Authentic dosa, idli and filter coffee', cuisinePicture: '/images/cuisine/southindian.jpg', vegFriendly: true },
  { name: 'Continental', description: 'Global comfort food and grills', cuisinePicture: '/images/cuisine/continental.jpg', vegFriendly: false }
]

// City and district metadata drive the location objects for generated restaurants.
// This keeps the 100 generated records distributed across multiple cities and
// makes the location filter meaningful in the UI and tests.
const cityCatalog = [
  { district: 'Khordha', city: 'Bhubaneswar', pinPrefix: '751', areas: ['Patia', 'Jaydev Vihar', 'Saheed Nagar', 'Nayapalli', 'Khandagiri', 'Old Town'] },
  { district: 'Cuttack', city: 'Cuttack', pinPrefix: '753', areas: ['Badambadi', 'Buxi Bazaar', 'Mahanadi Vihar', 'CDA Sector 9', 'Dolamundai', 'Tulsipur'] },
  { district: 'Puri', city: 'Puri', pinPrefix: '752', areas: ['Sea Beach', 'Grand Road', 'Baliapanda', 'Chakratirtha', 'Lighthouse Road', 'Swargadwar'] },
  { district: 'Sambalpur', city: 'Sambalpur', pinPrefix: '768', areas: ['Ainthapali', 'Budharaja', 'Dhanupali', 'Farm Road', 'Baraipali', 'Sakhipara'] },
  { district: 'Sundargarh', city: 'Rourkela', pinPrefix: '769', areas: ['Civil Township', 'Panposh', 'Chhend', 'Udit Nagar', 'Basanti Colony', 'Koel Nagar'] },
  { district: 'Balasore', city: 'Balasore', pinPrefix: '756', areas: ['OT Road', 'Soro', 'Remuna', 'Sahadevkhunta', 'FM Circle', 'Bampada'] },
  { district: 'Ganjam', city: 'Berhampur', pinPrefix: '760', areas: ['Ankuli', 'Gosaninuagaon', 'Courtpeta', 'Engineering School Rd', 'Aska Road', 'Prem Nagar'] }
]

// Opening and closing slot pools create realistic schedule variation.
// We use these arrays to generate combinations that can be tested against
// the time filter, including early breakfast spots and late-night restaurants.
const openingSlots = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM']
const closingSlots = ['09:00 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM']
// Table style pools make the detailed pages feel richer and also provide
// more realistic variation in the restaurant object shape.
const tableTypePool = ['Booth', 'Standard Table', 'Outdoor Seating', 'Rooftop', 'Private Dining', 'Family Table', 'Bar Counter', 'Window Table']
const seatPool = [2, 4, 6, 8, 10]
// Off-day patterns are intentionally varied so date filtering can verify both
// available and unavailable dates instead of every restaurant behaving the same.
const offDayPatterns = [[], ['Monday'], ['Tuesday'], ['Wednesday'], ['Thursday'], ['Friday'], ['Sunday'], ['Monday', 'Thursday']]
// Marketing copy for the generated restaurants. Keeping this as a pool avoids
// repetitive descriptions and gives the cards and detail screens some personality.
const messagePool = [
  'Chef special tasting menu every Friday',
  'Flat 15% off on advance reservations',
  'Live acoustic sessions on weekends',
  'Seasonal menu curated every month',
  'Family combo offers available',
  'Complimentary dessert on dinner bookings',
  'Signature house platter available all day'
]

// The name pools are used to create restaurant names that look intentional,
// varied, and easy to scan in the UI.
const generatedNamePrefixes = [
  'Spice', 'Urban', 'Royal', 'Coastal', 'Golden', 'Velvet', 'Classic', 'Saffron', 'Emerald', 'Silver',
  'Pepper', 'Maple', 'Bamboo', 'Cedar', 'Amber', 'Olive', 'Crimson', 'Bluefin', 'Sunset', 'Moonlit'
]

const generatedNameSuffixes = [
  'Kitchen', 'Bistro', 'Diner', 'Table', 'Fork', 'Platter', 'Courtyard', 'Haven', 'Terrace', 'Grill',
  'House', 'Studio', 'Cafe', 'Lounge', 'Point', 'Deck', 'Garden', 'Hub', 'Bay', 'Room'
]

// Convert a 12-hour formatted time string into minutes so time comparisons
// are reliable and easy to test. This is used by the meal inference logic.
const parseTimeToMinutes = (time) => {
  if (!time) return 0
  const [clock, period] = time.split(' ')
  let [hours, minutes] = clock.split(':').map(Number)
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return (hours * 60) + minutes
}

// Infer which meals a restaurant supports from its operating hours.
// This lets the meal-type filter be meaningful without storing a huge manual
// mealTypes list for every generated record.
const inferMealTypes = (openingTime, closingTime) => {
  const open = parseTimeToMinutes(openingTime)
  const close = parseTimeToMinutes(closingTime)
  const normalizedClose = close < open ? close + 1440 : close

  const mealTypes = []
  if (open <= 8 * 60 && normalizedClose >= 11 * 60) mealTypes.push('breakfast')
  if (open <= 13 * 60 && normalizedClose >= 15 * 60) mealTypes.push('lunch')
  if (normalizedClose >= 20 * 60) mealTypes.push('dinner')

  return mealTypes.length > 0 ? mealTypes : ['lunch']
}

// Local photo assets added under src/Data/Images are loaded with Vite's
// import.meta.glob so they become proper bundled image URLs at runtime.
// We sort by numeric filename (1.jpg ... 100.jpg, including decimal names
// like 18.1.jpg) and then rotate through the full list for restaurant cards.
const localImageModules = typeof import.meta.glob === 'function'
  ? import.meta.glob('./Images/*.{jpg,jpeg,png,webp}', {
      eager: true,
      import: 'default'
    })
  : null

const imageSortKey = (filePath) => {
  const fileName = filePath.split('/').pop() || ''
  const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const numericValue = Number.parseFloat(baseName)
  return Number.isNaN(numericValue) ? Number.MAX_SAFE_INTEGER : numericValue
}

const localImagePaths = localImageModules
  ? Object.entries(localImageModules)
      .sort((a, b) => imageSortKey(a[0]) - imageSortKey(b[0]))
      .map(([, imageUrl]) => imageUrl)
  : Array.from({ length: 100 }, (_, index) => `/src/Data/Images/${index + 1}.jpg`)

// We intentionally cap local images to 100 primary files and then add 10
// curated fallback restaurant photos. This gives 110 unique first-image slots
// across 150 restaurants, which means exactly 40 controlled repeats.
const primaryLocalImagePaths = localImagePaths.slice(0, 100)

const curatedFallbackImagePaths = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80'
]

const imagePoolPaths = primaryLocalImagePaths.length > 0
  ? [...primaryLocalImagePaths, ...curatedFallbackImagePaths]
  : curatedFallbackImagePaths

// Build a three-image array per restaurant. Each image is a restaurant-themed
// photo URL, and the seed ensures the URL set is unique for every restaurant.
// The first image is used on cards and popups, while the other images are ready
// for gallery-style views later if needed.
const createImageSet = (restaurantName, cuisineName, seed) => {
  if (imagePoolPaths.length === 0) return []

  // Rotate through the 110-image pool (100 local + 10 fallback).
  // For 150 restaurants this creates controlled reuse instead of complete
  // uniqueness, matching the requirement that repetition is acceptable.
  const baseIndex = (seed - 1) % imagePoolPaths.length
  return [0, 1, 2].map((offset) => {
    const imageIndex = (baseIndex + offset) % imagePoolPaths.length
    return imagePoolPaths[imageIndex]
  })
}

// Generate a couple of blocked dates per restaurant so the booking and date
// filter logic can test both available and unavailable cases.
const createUnavailableDates = (seed) => {
  const year = 2026
  const month = ((seed % 12) + 1).toString().padStart(2, '0')
  const firstDay = ((seed % 18) + 10).toString().padStart(2, '0')
  const secondDay = (((seed + 6) % 18) + 10).toString().padStart(2, '0')
  return [`${year}-${month}-${firstDay}`, `${year}-${month}-${secondDay}`]
}

// Normalize the original 50 seed restaurants so they match the generated ones.
// This makes the UI and tests work against one consistent schema rather than
// needing special cases for older records.
const normalizeRestaurant = (restaurant, index) => {
  const seed = index + 1
  const offDays = Array.isArray(restaurant.offDays) ? restaurant.offDays : []
  const mealTypes = Array.isArray(restaurant.mealTypes) && restaurant.mealTypes.length > 0
    ? restaurant.mealTypes
    : inferMealTypes(restaurant.openingTime, restaurant.closingTime)

  return {
    ...restaurant,
    images: createImageSet(restaurant.name, restaurant.cuisine.name, seed),
    mealTypes,
    serviceDays: dayNames.filter((day) => !offDays.includes(day)),
    unavailableDates: Array.isArray(restaurant.unavailableDates) ? restaurant.unavailableDates : createUnavailableDates(seed)
  }
}

// Generate the additional 100 restaurants. The goal is not only to inflate the
// dataset size, but to make sure every filter has meaningful combinations to
// exercise: location, time, rating, AC, vegetarian status, and off-days.
const buildGeneratedRestaurant = (idNumber) => {
  const seed = idNumber
  const cityMeta = cityCatalog[(seed - 1) % cityCatalog.length]
  const cuisineMeta = cuisineCatalog[(seed - 1) % cuisineCatalog.length]
  const area = cityMeta.areas[(seed + 2) % cityMeta.areas.length]
  const openingTime = openingSlots[(seed + 1) % openingSlots.length]
  const closingTime = closingSlots[(seed + 3) % closingSlots.length]
  const offDays = offDayPatterns[seed % offDayPatterns.length]
  const mealTypes = inferMealTypes(openingTime, closingTime)
  const tableTypes = [
    tableTypePool[seed % tableTypePool.length],
    tableTypePool[(seed + 3) % tableTypePool.length],
    tableTypePool[(seed + 6) % tableTypePool.length]
  ]
  const uniqueTableTypes = [...new Set(tableTypes)]
  const seatsPerTable = [
    seatPool[seed % seatPool.length],
    seatPool[(seed + 2) % seatPool.length],
    seatPool[(seed + 4) % seatPool.length]
  ]

  const name = `${generatedNamePrefixes[(seed - 1) % generatedNamePrefixes.length]} ${generatedNameSuffixes[(seed + 5) % generatedNameSuffixes.length]}`
  const pinSuffix = (100 + (seed % 800)).toString().padStart(3, '0')
  const vegBias = cuisineMeta.vegFriendly ? (seed % 4 !== 0) : (seed % 7 === 0)
  const hasAC = seed % 5 !== 0
  const rating = Number((3.8 + ((seed * 17) % 12) / 10).toFixed(1))

  return {
    id: `R${idNumber}`,
    name,
    location: {
      country: 'India',
      state: 'Odisha',
      district: cityMeta.district,
      city: cityMeta.city,
      pin: `${cityMeta.pinPrefix}${pinSuffix}`,
      specialIdentification: `${area} Food District`
    },
    cuisine: {
      name: cuisineMeta.name,
      description: cuisineMeta.description,
      cuisinePicture: cuisineMeta.cuisinePicture
    },
    isVegOnly: vegBias,
    hasAC,
    rating,
    images: createImageSet(name, cuisineMeta.name, seed),
    tabledescription: {
      tableTypesAvailable: uniqueTableTypes,
      seatsPerTable
    },
    menu: [
      `/images/menu/r${idNumber}-menu1.jpg`,
      `/images/menu/r${idNumber}-menu2.jpg`
    ],
    openingTime,
    closingTime,
    offDays,
    mealTypes,
    serviceDays: dayNames.filter((day) => !offDays.includes(day)),
    unavailableDates: createUnavailableDates(seed),
    specialMessages: messagePool[seed % messagePool.length]
  }
}

// Create restaurants R51 through R150 so the app has enough variety to test
// complex filter combinations and image rendering at scale.
const generatedRestaurants = Array.from({ length: 100 }, (_, index) => buildGeneratedRestaurant(index + 51))

export const restaurants = [
  ...seedRestaurants.map(normalizeRestaurant),
  ...generatedRestaurants
]
