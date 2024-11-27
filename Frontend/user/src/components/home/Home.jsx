import React from 'react';
// import ProductCard from '../components/ProductCard';
// import Carousel from '../components/Carousel';

export default function HomePage() {
  const categories = [
    'GAMING MONITORS',
    'GRAPHICS CARDS',
    'GAMING MOUSE',
    'GAMING LAPTOPS',
    'OTHER CATEGORIES'
  ];

  const hotDeals = [
    {
      id: 1,
      title: 'Gaming Headset Pro',
      price: 79.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 2,
      title: 'RGB Gaming Mouse',
      price: 49.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 3,
      title: 'Mechanical Keyboard',
      price: 129.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 4,
      title: 'Gaming Chair Deluxe',
      price: 249.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 5,
      title: 'RGB Mousepad XL',
      price: 39.99,
      image: '/placeholder.svg?height=300&width=300'
    }
  ];

  const popularProducts = [
    {
      id: 1,
      title: 'Blue LED Headset',
      price: 89.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 2,
      title: 'Gaming Mouse RGB',
      price: 59.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 3,
      title: 'Gaming Chair',
      price: 299.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 4,
      title: 'RTX Graphics Card',
      price: 699.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 5,
      title: 'Gaming PC Case',
      price: 149.99,
      image: '/placeholder.svg?height=300&width=300'
    },
    {
      id: 6,
      title: 'Gaming Monitor 144Hz',
      price: 349.99,
      image: '/placeholder.svg?height=300&width=300'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-green-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">GeeZee</div>
          <div className="space-x-6">
            <a href="#" className="text-white hover:text-gray-200">HOME</a>
            <a href="#" className="text-white hover:text-gray-200">BEST SELLER</a>
            <a href="#" className="text-white hover:text-gray-200">SHOP</a>
            <a href="#" className="text-white hover:text-gray-200">CONTACT</a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 bg-green-500 text-white p-2 rounded">
              CATEGORIES
            </h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="block p-2 hover:bg-green-500 hover:text-white rounded transition-colors duration-300"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-8">
            <div className="bg-gradient-to-r from-purple-900 to-pink-600 rounded-lg p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">GAMING ACCESSORIES STORE</h1>
              <p className="text-xl mb-6">One stop shop for all gaming accessories needs</p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <span className="bg-white text-black px-3 py-1 rounded">NO COST EMI</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-white text-black px-3 py-1 rounded">EXCHANGE OFFER</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                HOT DEALS
              </h2>
              <Carousel slidesToShow={3}>
                {hotDeals.map((product) => (
                  <div key={product.id}>
                    <ProductCard {...product} />
                  </div>
                ))}
              </Carousel>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Popular Department
              </h2>
              <Carousel slidesToShow={4}>
                {popularProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard {...product} />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

