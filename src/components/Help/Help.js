import React from 'react';
import {
  FiHelpCircle,
  FiInfo,
  FiMail,
  FiGlobe,
  FiPhone,
  FiMapPin,
  FiCode,
  FiUsers,
  FiAward,
  FiHeart,
  FiFacebook,
  FiInstagram,
  FiLinkedin
} from 'react-icons/fi';

const Help = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <FiHelpCircle className="text-2xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
            <p className="text-gray-600">Get help and learn about Aurelium Soft</p>
          </div>
        </div>
      </div>

      {/* Aurelium Soft Company Section */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
        <div className="flex items-start mb-6">
          <div className="bg-blue-100 rounded-full p-4 mr-6">
          <img 
            src="./aurelium.png" 
            alt="Aurelium Soft Logo" 
            className="w-12 h-12 object-contain"
          />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">About Aurelium Soft</h2>
            <p className="text-gray-600 mb-4">
              Aurelium Soft is a leading software development company specializing in modern, 
              user-friendly business solutions. We create innovative software that helps businesses 
              streamline their operations and improve efficiency.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <FiCode className="mr-2 text-blue-600" />
                  Our Expertise
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Point of Sale (POS) Systems</li>
                  <li>• Business Management Software</li>
                  <li>• Custom Web Applications</li>
                  <li>• Database Solutions</li>
                  <li>• Mobile App Development</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <FiAward className="mr-2 text-blue-600" />
                  Our Values
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Quality & Reliability</li>
                  <li>• User-Centered Design</li>
                  <li>• Innovation & Technology</li>
                  <li>• Customer Support</li>
                  <li>• Continuous Improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-start mb-4">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <FiMail className="text-2xl text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiMail className="text-gray-500 mr-3" />
                  <a href="aureliumsoft@gmail.com" target="_blank" className="text-gray-700">aureliumsoft@gmail.com</a>
                </div>
                <div className="flex items-center">
                  <FiPhone className="text-gray-500 mr-3" />
                  <a href="tel:+923023552710" target="_blank" className="text-gray-700">+92 302 3552 710</a>
                </div>
                <div className="flex items-center">
                  <FiGlobe className="text-gray-500 mr-3" />
                  <a href="https://aureliumsoft.com" target="_blank" className="text-gray-700">https://aureliumsoft.com</a>
                </div>
                <div className="flex items-start">
                  <FiMapPin className="text-gray-500 mr-3 mt-1" />
                  <span className="text-gray-700">
                    Ittefaq colony, Near Al Fatah Hostel<br />
                    Behind NADRA Mega center, G.T Road,<br />
                    Gujranwala, Pakistan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-start mb-4">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <FiUsers className="text-2xl text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Support Team</h3>
              <p className="text-gray-600 mb-3">
                Our dedicated support team is here to help you with any questions or issues.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">24/7 Technical Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Email Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Documentation & Guides</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Section */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 mb-8">
        <div className="flex items-start mb-4">
          <div className="bg-yellow-100 rounded-full p-3 mr-4">
            <FiInfo className="text-2xl text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Getting Started</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Default login: admin / admin123</li>
                  <li>• Set up your business name in Settings</li>
                  <li>• Add your first products</li>
                  <li>• Configure categories</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Common Tasks</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Process orders in POS</li>
                  <li>• Generate reports</li>
                  <li>• Manage inventory (optional)</li>
                  <li>• Print receipts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200">
        <div className="flex items-start mb-4">
          <div className="bg-gray-100 rounded-full p-3 mr-4">
            <FiInfo className="text-2xl text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Application</h4>
                <p className="text-sm text-gray-600">Cafe POS System v1.0.0</p>
                <p className="text-sm text-gray-600">Built with React & Electron</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Database</h4>
                <p className="text-sm text-gray-600">SQLite</p>
                <p className="text-sm text-gray-600">Local storage</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Publisher</h4>
                <p className="text-sm text-gray-600">Aurelium Soft</p>
                <p className="text-sm text-gray-600">Professional Software</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="./aurelium.png" 
              alt="Aurelium Soft Logo" 
              className="w-8 h-8 object-contain mr-3"
            />
            <h3 className="text-xl font-bold">Aurelium Soft</h3>
          </div>
          <p className="text-blue-100 mb-4">
            Creating innovative software solutions for modern businesses
          </p>
          <div className="flex items-center justify-center text-sm text-blue-200 gap-3">
            <a href="https://www.facebook.com/aureliumsoft" target="_blank" className="text-blue-200"><FiFacebook /></a>
            <a href="https://www.instagram.com/aureliumsoft" target="_blank" className="text-blue-200"><FiInstagram /></a>
            <a href="https://www.linkedin.com/company/aureliumsoft" target="_blank" className="text-blue-200"><FiLinkedin /></a>
          </div>
          <div className="flex items-center justify-center text-sm text-blue-200">d
            <FiHeart className="mr-2" />
            <span>Made with passion for excellence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
