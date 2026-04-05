const signatureItemsByCuisine = {
  'North Indian': [
    ['Amritsari Kulcha Platter', 'Tandoor-baked kulcha served with chole and mint curd dip.', 280],
    ['Dal Makhani Reserve', 'Slow-cooked black lentils finished with smoked butter.', 320],
    ['Royal Butter Chicken', 'Classic tomato-cashew gravy with charred chicken tikka.', 390],
    ['Lucknowi Paneer Korma', 'Paneer cubes in saffron-cardamom cream gravy.', 340],
    ['Lachha Paratha Basket', 'Layered wheat parathas with house chutneys.', 180],
    ['Kesar Phirni Glass', 'Chilled rice cream dessert with pistachio and saffron.', 150]
  ],
  Mughlai: [
    ['Nawabi Murgh Tikka', 'Creamy charred chicken skewers with pepper and mace.', 420],
    ['Subz-E-Dum Biryani', 'Fragrant rice layered with seasonal vegetables and browned onions.', 360],
    ['Shahi Nalli Nihari', 'Slow braised shank in aromatic bone broth reduction.', 460],
    ['Badami Paneer Tikka', 'Paneer marinated with almond, yogurt and kasoori methi.', 340],
    ['Warqi Roomali Roti', 'Thin folded flatbread with ghee brushed layers.', 110],
    ['Sheer Khurma Royale', 'Vermicelli milk pudding with dates and nuts.', 170]
  ],
  Chinese: [
    ['Sichuan Pepper Chicken', 'Wok tossed chicken with toasted peppercorn and dry chili.', 360],
    ['Burnt Garlic Noodles', 'Hand-pulled noodles with garlic oil and spring onion.', 260],
    ['Crispy Lotus Stem Honey Chili', 'Crisped lotus stem glazed in chili-honey reduction.', 310],
    ['Yunnan Tofu Stir Fry', 'Tofu and bok choy in fermented bean sauce.', 290],
    ['Prawn Dim Sum Basket', 'Steamed dim sum with sesame and soy glaze.', 340],
    ['Caramel Sesame Custard', 'Silky custard topped with warm sesame brittle.', 190]
  ],
  Italian: [
    ['Truffle Mushroom Risotto', 'Arborio rice simmered in mushroom stock and truffle oil.', 420],
    ['Penne Arrabbiata Piccante', 'Penne with fiery San Marzano tomato basil sauce.', 310],
    ['Quattro Formaggi Pizza', 'Stone-baked pizza with four-cheese blend and basil.', 480],
    ['Herb Grilled Chicken Steak', 'Chicken steak with rosemary jus and buttered greens.', 460],
    ['Fresh Burrata Caprese', 'Tomato medley, basil oil and creamy burrata.', 390],
    ['Tiramisu Classico', 'Coffee-soaked sponge layered with mascarpone cream.', 250]
  ],
  Japanese: [
    ['Salmon Aburi Nigiri', 'Flame-seared salmon nigiri with yuzu soy.', 460],
    ['Miso Butter Ramen', 'Rich broth ramen with corn, bamboo and nori.', 410],
    ['Chicken Katsu Curry Bowl', 'Panko cutlet with house Japanese curry and rice.', 380],
    ['Vegetable Tempura Mori', 'Seasonal vegetables in light crisp batter.', 290],
    ['Dragon Roll Signature', 'Avocado and tempura shrimp uramaki.', 450],
    ['Matcha Cheesecake Slice', 'Creamy baked cheesecake with matcha glaze.', 240]
  ],
  Korean: [
    ['Gochujang Chicken Wings', 'Double-fried wings with sweet spicy glaze.', 340],
    ['Bibimbap Stone Pot', 'Rice, vegetables and egg in sizzling stone bowl.', 330],
    ['Kimchi Jjigae Stew', 'Fermented kimchi stew with tofu and mushrooms.', 310],
    ['Bulgogi Lettuce Wraps', 'Marinated sliced meat with ssamjang and greens.', 390],
    ['Seafood Scallion Pancake', 'Crisp jeon with chili-soy dipping sauce.', 280],
    ['Honey Yakgwa Bites', 'Traditional cookie bites with honey syrup.', 160]
  ],
  default: [
    ['Chef Special Platter', 'Curated tasting platter featuring house signatures.', 420],
    ['Seasonal Grill Bowl', 'Roasted vegetables and protein with herb butter.', 360],
    ['Smoked Cottage Cheese Skewers', 'Charred paneer skewers with pepper marinade.', 320],
    ['House Broth Noodle Bowl', 'Comfort broth with noodles and greens.', 280],
    ['Garlic Butter Flatbread', 'Fresh flatbread with roasted garlic butter.', 170],
    ['Chef Dessert Duo', 'Two rotating desserts from the pastry counter.', 210]
  ]
}

const categoryBlueprint = [
  {
    title: 'Starters',
    itemSeeds: [
      ['Tandoori Broccoli Char', 'Smoked broccoli florets with hung-curd glaze.', 240],
      ['Pepper Corn Paneer Cubes', 'Pan-seared paneer with black pepper reduction.', 260],
      ['Smoked Corn Soup Shot', 'Sweet corn veloute with chili oil finish.', 180],
      ['Crisp Chili Potato', 'Hand-cut potatoes tossed in chili-garlic glaze.', 210],
      ['Masala Peanut Crunch', 'Roasted peanuts with onion, tomato and spice dust.', 160],
      ['Lemon Herb Fish Fingers', 'Crumb-fried fish fingers with tartar dip.', 300]
    ]
  },
  {
    title: 'Main Course',
    itemSeeds: [
      ['House Curry Pot', 'Rich gravy made fresh each service.', 340],
      ['Smoked Kofta Lababdar', 'Soft kofta in tomato-cashew veloute.', 360],
      ['Clay Oven Chicken Supreme', 'Slow-fired chicken with spice butter baste.', 420],
      ['Garden Herb Rice Bowl', 'Steamed rice tossed with herbs and seasonal greens.', 250],
      ['Signature Grilled Catch', 'Daily fish catch with lemon caper dressing.', 440],
      ['Roasted Vegetable Medley', 'Wood roasted vegetables with garlic jus.', 300]
    ]
  },
  {
    title: 'Breads and Sides',
    itemSeeds: [
      ['Butter Naan', 'Classic tandoor naan with cultured butter.', 80],
      ['Garlic Naan', 'Leavened naan topped with garlic and coriander.', 95],
      ['Jeera Rice', 'Long-grain rice perfumed with toasted cumin.', 160],
      ['Dal Tadka Side', 'Yellow dal tempered with garlic and chili.', 180],
      ['Sauteed Seasonal Greens', 'Lightly sauteed greens with sesame.', 190],
      ['Creamed Mashed Potatoes', 'Silky mash finished with browned butter.', 175]
    ]
  },
  {
    title: 'Beverages',
    itemSeeds: [
      ['House Mint Cooler', 'Mint, lime and sparkling water refresher.', 140],
      ['Saffron Lassi', 'Creamy yogurt drink with saffron threads.', 170],
      ['Cold Brew Tonic', 'Coffee concentrate, tonic and citrus peel.', 190],
      ['Seasonal Fruit Sparkler', 'Fresh fruit blend with soda and basil.', 180],
      ['Masala Chai Pot', 'Slow-brewed tea with cardamom and ginger.', 130],
      ['Classic Lemon Iced Tea', 'Brewed tea with lemon and cane syrup.', 150]
    ]
  },
  {
    title: 'Desserts',
    itemSeeds: [
      ['Baked Gulab Jamun Cheesecake', 'Fusion cheesecake with warm syrup drizzle.', 230],
      ['Chocolate Hazelnut Mousse', 'Silky mousse with roasted hazelnut crumb.', 240],
      ['Saffron Kulfi Slice', 'Dense kulfi slice with pistachio dust.', 200],
      ['Seasonal Fruit Trifle', 'Layered fruit compote, cream and sponge.', 210],
      ['Date and Walnut Pudding', 'Steamed pudding with toffee sauce.', 250],
      ['Coconut Jaggery Creme', 'Set coconut custard with palm jaggery.', 220]
    ]
  }
]

const vegTags = ['Veg', 'Jain Option']
const nonVegTags = ['Contains Meat', 'Contains Seafood']

const hashString = (value) => {
  let hash = 0
  const source = String(value)
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const pickBySeed = (array, seed, count) => {
  if (!Array.isArray(array) || array.length === 0) return []
  const result = []
  for (let index = 0; index < count; index += 1) {
    const item = array[(seed + index) % array.length]
    result.push(item)
  }
  return result
}

const buildMenuItem = ({ seed, cuisineName, name, description, basePrice, isVegOnly }) => {
  const priceBump = (seed % 6) * 10
  const finalPrice = basePrice + priceBump
  const vegOnlyByCuisine = cuisineName === 'Pure Veg' || isVegOnly
  const tags = vegOnlyByCuisine
    ? [vegTags[seed % vegTags.length]]
    : [seed % 2 === 0 ? vegTags[0] : nonVegTags[seed % nonVegTags.length]]

  if (finalPrice >= 400) {
    tags.push('Chef Signature')
  }

  return {
    name,
    description,
    price: finalPrice,
    tags,
    available: seed % 11 !== 0
  }
}

const buildCategoryItems = ({ category, seed, cuisineName, isVegOnly }) => {
  const categorySeed = seed + hashString(category.title)
  return pickBySeed(category.itemSeeds, categorySeed, 6).map((itemSeed, index) => {
    const [name, description, basePrice] = itemSeed
    return buildMenuItem({
      seed: categorySeed + index,
      cuisineName,
      name,
      description,
      basePrice,
      isVegOnly
    })
  })
}

const buildSignatureCategory = ({ seed, cuisineName, isVegOnly }) => {
  const signaturePool = signatureItemsByCuisine[cuisineName] || signatureItemsByCuisine.default
  const signatureSeed = seed + hashString(`${cuisineName}-signature`)

  return {
    title: 'Chef Signatures',
    description: 'Most ordered creations from this kitchen.',
    items: pickBySeed(signaturePool, signatureSeed, 6).map((itemSeed, index) => {
      const [name, description, basePrice] = itemSeed
      return buildMenuItem({
        seed: signatureSeed + index,
        cuisineName,
        name,
        description,
        basePrice,
        isVegOnly
      })
    })
  }
}

export const getDetailedMenuForRestaurant = (restaurant) => {
  if (!restaurant) return []

  const seed = hashString(`${restaurant.id}-${restaurant.name}`)
  const cuisineName = restaurant.cuisine?.name || 'default'

  const generatedCategories = categoryBlueprint.map((category, index) => ({
    title: category.title,
    description: index === 0
      ? 'Start your meal with layered textures and bold flavor notes.'
      : index === 1
        ? 'Balanced mains crafted for table sharing and full portions.'
        : index === 2
          ? 'Smart sides to pair with grills, curries and bowls.'
          : index === 3
            ? 'Classic and seasonal pours for each dining slot.'
            : 'Finishers from the pastry station and house sweets.',
    items: buildCategoryItems({
      category,
      seed: seed + (index * 13),
      cuisineName,
      isVegOnly: restaurant.isVegOnly
    })
  }))

  return [buildSignatureCategory({ seed, cuisineName, isVegOnly: restaurant.isVegOnly }), ...generatedCategories]
}

export const getMenuStats = (menuCategories) => {
  const flatItems = (menuCategories || []).flatMap((category) => category.items || [])
  const availableItems = flatItems.filter((item) => item.available)
  const unavailableItems = flatItems.length - availableItems.length
  const avgPrice = flatItems.length > 0
    ? Math.round(flatItems.reduce((sum, item) => sum + item.price, 0) / flatItems.length)
    : 0

  return {
    totalCategories: menuCategories?.length || 0,
    totalItems: flatItems.length,
    availableItems: availableItems.length,
    unavailableItems,
    avgPrice
  }
}
