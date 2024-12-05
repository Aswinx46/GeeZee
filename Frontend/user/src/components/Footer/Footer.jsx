import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="bg-black py-12">
<div className="container mx-auto px-4">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    <div>
        <img className='' src="../../assets/GeeZee.png" alt="" />
      <h3 className="font-bold mb-4">ABOUT</h3>
      <ul className="space-y-2 text-gray-400">
        <li><button className="hover:text-white">About Us</button></li>
        <li><button className="hover:text-white">Careers</button></li>
        <li><button className="hover:text-white">Privacy Policy</button></li>
        <li><button className="hover:text-white">Terms of Use</button></li>
      </ul>
    </div>
    <div>
      <h3 className="font-bold mb-4">SUPPORT</h3>
      <ul className="space-y-2 text-gray-400">
        <li><button className="hover:text-white">Product Support</button></li>
        <li><button className="hover:text-white">Community</button></li>
        <li><button className="hover:text-white">Contact Us</button></li>
        <li><button className="hover:text-white">Warranty</button></li>
      </ul>
    </div>
    <div>
      <h3 className="font-bold mb-4">SOCIAL</h3>
      <ul className="space-y-2 text-gray-400">
        <li><button className="hover:text-white">Twitter</button></li>
        <li><button className="hover:text-white">Instagram</button></li>
        <li><button className="hover:text-white">Facebook</button></li>
        <li><button className="hover:text-white">YouTube</button></li>
      </ul>
    </div>
    <div>
      <h3 className="font-bold mb-4">NEWSLETTER</h3>
      <p className="text-gray-400 mb-4">Subscribe to get special offers, free giveaways, and updates.</p>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Subscribe
        </button>
      </div>
    </div>
  </div>
  <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
    <p>© 2024 GeeZee. All rights reserved.</p>
  </div>
</div>
</footer>
    </div>
  )
}

export default Footer
