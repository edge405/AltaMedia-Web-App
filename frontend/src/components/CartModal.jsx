import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  CreditCard, 
  Building2, 
  DollarSign, 
  CheckCircle,
  Trash2,
  ArrowLeft
} from 'lucide-react';

export default function CartModal({ isOpen, onClose, cartItems, onRemoveItem, onCheckout, isDarkMode = false }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return sum + price;
  }, 0);

  const tax = subtotal * 0.12; // 12% tax
  const total = subtotal + tax;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onCheckout();
      onClose();
    }, 2000);
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB, UnionPay'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: DollarSign,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer to Philippine banks'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className={`max-w-4xl max-h-[98vh] overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Shopping Cart
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(98vh-160px)] pr-3 pb-6 custom-scrollbar">
          {/* Cart Items */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Cart Items ({cartItems.length})
            </h3>
            
            {cartItems.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm mt-1">Add some items to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <Card key={item.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'} hover:shadow-md transition-all duration-200`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.title}
                            </h4>
                            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.price} /{item.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.price}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="w-6 h-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
                             {/* Payment Method Selection */}
               <div className="space-y-4">
                 <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                   Payment Method
                 </h3>
                 
                 <div className="grid grid-cols-1 gap-3">
                   {paymentMethods.map((method) => (
                     <Card 
                       key={method.id}
                       className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                         paymentMethod === method.id 
                           ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                           : isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'
                       }`}
                       onClick={() => setPaymentMethod(method.id)}
                     >
                                               <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              paymentMethod === method.id 
                                ? 'bg-blue-100 dark:bg-blue-500/20' 
                                : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <method.icon className={`w-4 h-4 ${
                                paymentMethod === method.id 
                                  ? 'text-blue-600 dark:text-blue-400' 
                                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </div>
                                                         <div className="flex-1 min-w-0 pr-4">
                               <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                 {method.name}
                               </h4>
                               <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
                                 {method.description}
                               </p>
                             </div>
                            {paymentMethod === method.id && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                     </Card>
                   ))}
                 </div>
               </div>

                             {/* Order Summary */}
               <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'} shadow-lg`}>
                 <CardHeader className="pb-4">
                   <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                     Order Summary
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="flex justify-between items-center">
                     <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subtotal</span>
                     <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₱{subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tax (12%)</span>
                     <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₱{tax.toFixed(2)}</span>
                   </div>
                   <Separator className="my-2" />
                   <div className="flex justify-between items-center pt-1">
                     <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                     <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₱{total.toFixed(2)}</span>
                   </div>
                 </CardContent>
               </Card>

                             {/* Action Buttons */}
               <div className="flex space-x-4 pt-4">
                 <Button 
                   variant="outline" 
                   onClick={onClose}
                   className="flex-1 h-12 text-base font-semibold"
                   disabled={isProcessing}
                 >
                   <ArrowLeft className="w-5 h-5 mr-2" />
                   Continue Shopping
                 </Button>
                 <Button 
                   onClick={handlePayment}
                   className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                   disabled={isProcessing}
                 >
                   {isProcessing ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                       Processing...
                     </>
                   ) : (
                     <>
                       <DollarSign className="w-5 h-5 mr-2" />
                       Pay ₱{total.toFixed(2)}
                     </>
                   )}
                 </Button>
               </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 