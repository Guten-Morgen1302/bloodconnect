import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark-100 border-t border-dark-300 py-12" data-testid="main-footer">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <i className="fas fa-heart text-white"></i>
              </div>
              <span className="font-heading font-bold text-lg text-white">BloodConnect</span>
            </div>
            <p className="text-gray-400 mb-4">Connecting donors with those in need, saving lives through technology.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="link-facebook">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="link-twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="link-instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="link-linkedin">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-home">Home</Link></li>
              <li><Link href="/find-donors" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-find-donors">Find Donors</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-register">Register</Link></li>
              <li><Link href="/emergency" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-emergency">Emergency</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-about">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-help">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-faq">FAQs</a></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-contact">Contact Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent-green transition-colors" data-testid="footer-link-terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Emergency Contact</h4>
            <div className="space-y-2">
              <p className="text-gray-400" data-testid="text-emergency-phone">
                <i className="fas fa-phone mr-2"></i>
                +91-911-BLOOD-1
              </p>
              <p className="text-gray-400" data-testid="text-emergency-email">
                <i className="fas fa-envelope mr-2"></i>
                emergency@bloodconnect.in
              </p>
              <p className="text-gray-400" data-testid="text-emergency-hours">
                <i className="fas fa-clock mr-2"></i>
                24/7 Emergency Response
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-300 pt-8 text-center">
          <p className="text-gray-400" data-testid="text-copyright">&copy; 2024 BloodConnect. All rights reserved. Made with ❤️ for saving lives.</p>
        </div>
      </div>
    </footer>
  );
}
