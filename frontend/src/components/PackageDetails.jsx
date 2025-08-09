import React, { useState } from 'react';
import { X, Package, DollarSign, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Users, Globe, FileText, Play, Zap, BarChart3, Settings, Download, Share2, Star, MessageSquare, Eye, Trash2, Plus, Phone, FileText as FileTextIcon, Image, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PackageDetails({ isOpen, onClose, isDarkMode = false, onOpenMessages }) {
  const [activeTab, setActiveTab] = useState('overview');

  // No purchase functionality - contact for pricing

  // Mock package data
  const packageData = {
    name: "Core Package",
    description: "Complete multimedia automation solution for your business",
    price: "Contact for Pricing",
    originalPrice: "Custom Quote",
    savings: "Contact Us",
    status: "Active",
    nextBilling: "2024-04-15",
    features: [
      {
        name: "Dashboard",
        icon: <BarChart3 className="w-4 h-4" />,
        cost: "Free",
        status: "Active",
        description: "Analytics and reporting tools",
        usage: 100
      },
      {
        name: "Website",
        icon: <Globe className="w-4 h-4" />,
        cost: "P5,000",
        status: "In Progress",
        description: "Custom website development",
        usage: 75
      },
      {
        name: "Content/Ad Management",
        icon: <FileText className="w-4 h-4" />,
        cost: "P4,000",
        status: "Pending",
        description: "Content creation and ad management",
        usage: 0
      },
      {
        name: "Content Calendar/Creation (30 days)",
        icon: <Calendar className="w-4 h-4" />,
        cost: "P4,000",
        status: "In Progress",
        description: "30 days of content creation",
        usage: 50
      },
      {
        name: "Demo",
        icon: <Play className="w-4 h-4" />,
        cost: "P500",
        status: "Active",
        description: "Product demonstrations",
        usage: 100
      },
      {
        name: "Pin4MS",
        icon: <Zap className="w-4 h-4" />,
        cost: "P1,000",
        status: "Active",
        description: "Social media management",
        usage: 100
      },

    ],
    analytics: {
      totalValue: "P14,500",
      monthlySavings: "P3,501",
      servicesUsed: 4,
      totalServices: 6,
      satisfaction: 4.8
    },
    addons: [
      {
        id: "premium-support",
        name: "Premium Support",
        price: "P2,000",
        description: "24/7 priority support with dedicated account manager",
        status: "Available",
        details: "Get priority support with dedicated account manager, faster response times, and extended support hours."
      },
      {
        id: "advanced-analytics",
        name: "Advanced Analytics",
        price: "P1,500",
        description: "Enhanced reporting and insights",
        status: "Available",
        details: "Advanced analytics dashboard with custom reports, data export, and predictive insights."
      },
      {
        id: "custom-branding",
        name: "Custom Branding",
        price: "P3,000",
        description: "Custom branding and design",
        status: "Available",
        details: "Custom logo design, brand guidelines, and personalized marketing materials."
      },
      {
        id: "content-creation",
        name: "Content Creation",
        price: "P2,500",
        description: "Professional content creation services including blog posts, social media content, and video scripts",
        status: "Available",
        details: "Get professionally written content for your blog, social media, and marketing campaigns."
      },
      {
        id: "seo-optimization",
        name: "SEO Optimization",
        price: "P1,800",
        description: "Search engine optimization services to improve your website's visibility",
        status: "Available",
        details: "Comprehensive SEO services including keyword research, on-page optimization, and performance tracking."
      },
      {
        id: "social-media-management",
        name: "Social Media Management",
        price: "P3,500",
        description: "Complete social media management including content planning, posting, and community engagement",
        status: "Available",
        details: "Full social media management across all platforms with content creation and community management."
      },
      {
        id: "email-marketing",
        name: "Email Marketing",
        price: "P1,200",
        description: "Email marketing campaigns and automation setup",
        status: "Available",
        details: "Professional email marketing campaigns with automation, templates, and analytics tracking."
      },
      {
        id: "video-production",
        name: "Video Production",
        price: "P4,500",
        description: "Professional video production services for marketing and promotional content",
        status: "Available",
        details: "High-quality video production including scripting, filming, editing, and post-production."
      },
      {
        id: "web-design",
        name: "Web Design",
        price: "P5,000",
        description: "Custom website design and development with responsive layouts",
        status: "Available",
        details: "Custom website design with modern layouts, responsive design, and content management system."
      },
      {
        id: "consultation",
        name: "Strategy Consultation",
        price: "P1,500",
        description: "One-on-one consultation sessions for digital marketing strategy and business growth",
        status: "Available",
        details: "Personalized consultation sessions to develop your digital marketing strategy and business growth plan."
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'available':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'removed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'in progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const handleUpgradePackage = () => {
    toast.info("Package upgrade options coming soon!");
  };

  const handleDownloadInvoice = (format = 'html') => {
    // Generate sample receipt with proper PHP currency
    const receiptData = {
      receiptNumber: "PH-001",
      receiptDate: new Date().toLocaleDateString('en-PH'),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PH'),
      company: "Alta Media Inc.",
      address: "123 Business District, Makati, Metro Manila, Philippines",
      customer: "John Smith",
      customerAddress: "456 Customer Street, Quezon City, Metro Manila, Philippines",
      items: [
        { description: "Core Package - Monthly", qty: 1, unitPrice: 10999, amount: 10999 },
        ...purchasedAddons.map(addon => ({
          description: `${addon.title} Addon`,
          qty: 1,
          unitPrice: parseFloat(addon.price.replace(/[^\d.]/g, '')),
          amount: parseFloat(addon.price.replace(/[^\d.]/g, ''))
        }))
      ],
      subtotal: 10999 + totalAddonCost,
      tax: (10999 + totalAddonCost) * 0.12,
      total: (10999 + totalAddonCost) * 1.12
    };

    const downloadFile = (content, filename, mimeType) => {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    const generateReceiptHTML = () => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Alta Media Receipt</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: white;
              color: black;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
            }
            .company-info { 
              margin-bottom: 20px; 
              text-align: center;
            }
            .receipt-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 30px; 
              flex-wrap: wrap;
            }
            .bill-to, .ship-to, .receipt-info { 
              flex: 1; 
              min-width: 200px;
              margin: 10px;
            }
            .receipt-total { 
              text-align: right; 
              font-size: 18px; 
              margin: 20px 0; 
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              border: 1px solid #e2e8f0;
            }
            th, td { 
              padding: 12px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0; 
            }
            th { 
              background-color: #3b82f6; 
              color: white;
              font-weight: bold;
            }
            .summary { 
              text-align: right; 
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .payment-info { 
              margin-top: 30px; 
              background: #fef3c7;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #f59e0b;
            }
            .terms { 
              margin-top: 20px; 
              font-size: 12px; 
              color: #6b7280;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
            .currency { font-weight: bold; color: #059669; }
            .total-amount { font-size: 24px; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #3b82f6; margin: 0;">ALTA MEDIA RECEIPT</h1>
            <p style="margin: 5px 0; color: #6b7280;">Professional Digital Marketing Services</p>
          </div>
          
          <div class="company-info">
            <strong style="font-size: 18px;">${receiptData.company}</strong><br>
            <span style="color: #6b7280;">${receiptData.address}</span>
          </div>
          
          <div class="receipt-details">
            <div class="bill-to">
              <strong style="color: #3b82f6;">BILL TO</strong><br>
              <span style="font-weight: bold;">${receiptData.customer}</span><br>
              <span style="color: #6b7280;">${receiptData.customerAddress}</span>
            </div>
            <div class="ship-to">
              <strong style="color: #3b82f6;">SHIP TO</strong><br>
              <span style="font-weight: bold;">${receiptData.customer}</span><br>
              <span style="color: #6b7280;">${receiptData.customerAddress}</span>
            </div>
            <div class="receipt-info">
              <strong style="color: #3b82f6;">RECEIPT #</strong> ${receiptData.receiptNumber}<br>
              <strong style="color: #3b82f6;">RECEIPT DATE</strong> ${receiptData.receiptDate}<br>
              <strong style="color: #3b82f6;">DUE DATE</strong> ${receiptData.dueDate}
            </div>
          </div>
          
          <div class="receipt-total">
            <strong>Receipt Total</strong> <span class="total-amount">₱${receiptData.total.toFixed(2)}</span>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th>UNIT PRICE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${receiptData.items.map(item => `
                <tr>
                  <td>${item.qty}</td>
                  <td><strong>${item.description}</strong></td>
                  <td class="currency">₱${item.unitPrice.toFixed(2)}</td>
                  <td class="currency">₱${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <p><strong>Subtotal:</strong> <span class="currency">₱${receiptData.subtotal.toFixed(2)}</span></p>
            <p><strong>Sales Tax 12%:</strong> <span class="currency">₱${receiptData.tax.toFixed(2)}</span></p>
            <p><strong>Total:</strong> <span class="total-amount">₱${receiptData.total.toFixed(2)}</span></p>
          </div>
          
          <div class="payment-info">
            <strong style="color: #d97706;">PAYMENT INSTRUCTIONS</strong><br>
            <strong>PayPal:</strong> payment@altamedia.com<br>
            <strong>Bank Transfer:</strong> BDO Account #010730012<br>
            <strong>GCash:</strong> 0917-123-4567
          </div>
          
          <div class="terms">
            <strong>TERMS & CONDITIONS</strong><br>
            Payment is due within 15 days from receipt date.<br>
            Please make checks payable to: Alta Media Inc.<br>
            For questions, contact: support@altamedia.com
          </div>
        </body>
        </html>
      `;
    };

    switch (format) {
      case 'html':
        const receiptHTML = generateReceiptHTML();
        downloadFile(receiptHTML, `receipt-${receiptData.receiptNumber}.html`, 'text/html');
        toast.success("HTML receipt downloaded successfully!");
        break;

      case 'csv':
        // Create CSV content matching the spreadsheet format
        const csvContent = [
          ['Receipt Nu', 'Date', 'Due Date', 'Description', 'Qty', 'Unit Price', 'Amount'],
          [receiptData.receiptNumber, receiptData.receiptDate, receiptData.dueDate, '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ...receiptData.items.map(item => [
            '', '', '', item.description, item.qty, `₱${item.unitPrice.toFixed(2)}`, `₱${item.amount.toFixed(2)}`
          ]),
          ['', '', '', '', '', '', ''],
          ['', '', '', 'Subtotal', '', '', `₱${receiptData.subtotal.toFixed(2)}`],
          ['', '', '', 'Sales Tax 12%', '', '', `₱${receiptData.tax.toFixed(2)}`],
          ['', '', '', 'Total', '', '', `₱${receiptData.total.toFixed(2)}`],
          ['', '', '', '', '', '', ''],
          ['Company', receiptData.company, '', '', '', '', ''],
          ['Address', receiptData.address, '', '', '', '', ''],
          ['Customer', receiptData.customer, '', '', '', '', ''],
          ['Customer Address', receiptData.customerAddress, '', '', '', '', ''],
          ['', '', '', '', '', '', ''],
          ['Payment Instructions', '', '', '', '', '', ''],
          ['PayPal', 'payment@altamedia.com', '', '', '', '', ''],
          ['Bank Transfer', 'Routing (BDO): 010730012', '', '', '', '', '']
        ].map(row => row.join(',')).join('\n');

        downloadFile(csvContent, `receipt-${receiptData.receiptNumber}.csv`, 'text/csv');
        toast.success("CSV receipt downloaded successfully!");
        break;

      case 'pdf':
        toast.info("Generating PDF... This may take a moment.");

        // Create a proper PDF-ready HTML
        const pdfHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Alta Media Receipt</title>
            <meta charset="UTF-8">
            <style>
              @page { margin: 1in; }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                background: white;
                color: black;
                font-size: 12px;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 20px;
              }
              .company-info { 
                margin-bottom: 20px; 
                text-align: center;
              }
              .receipt-details { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 30px; 
              }
              .bill-to, .ship-to, .receipt-info { 
                flex: 1; 
                margin: 0 10px;
              }
              .receipt-total { 
                text-align: right; 
                font-size: 16px; 
                margin: 20px 0; 
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
                border: 1px solid #e2e8f0;
              }
              th, td { 
                padding: 8px; 
                text-align: left; 
                border-bottom: 1px solid #e2e8f0; 
              }
              th { 
                background-color: #3b82f6; 
                color: white;
                font-weight: bold;
              }
              .summary { 
                text-align: right; 
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .payment-info { 
                margin-top: 30px; 
                background: #fef3c7;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #f59e0b;
              }
              .terms { 
                margin-top: 20px; 
                font-size: 10px; 
                color: #6b7280;
                border-top: 1px solid #e2e8f0;
                padding-top: 15px;
              }
              .currency { font-weight: bold; color: #059669; }
              .total-amount { font-size: 20px; font-weight: bold; color: #059669; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">ALTA MEDIA RECEIPT</h1>
              <p style="margin: 5px 0; color: #6b7280;">Professional Digital Marketing Services</p>
            </div>
            
            <div class="company-info">
              <strong style="font-size: 16px;">${receiptData.company}</strong><br>
              <span style="color: #6b7280;">${receiptData.address}</span>
            </div>
            
            <div class="receipt-details">
              <div class="bill-to">
                <strong style="color: #3b82f6;">BILL TO</strong><br>
                <span style="font-weight: bold;">${receiptData.customer}</span><br>
                <span style="color: #6b7280;">${receiptData.customerAddress}</span>
              </div>
              <div class="ship-to">
                <strong style="color: #3b82f6;">SHIP TO</strong><br>
                <span style="font-weight: bold;">${receiptData.customer}</span><br>
                <span style="color: #6b7280;">${receiptData.customerAddress}</span>
              </div>
              <div class="receipt-info">
                <strong style="color: #3b82f6;">RECEIPT #</strong> ${receiptData.receiptNumber}<br>
                <strong style="color: #3b82f6;">RECEIPT DATE</strong> ${receiptData.receiptDate}<br>
                <strong style="color: #3b82f6;">DUE DATE</strong> ${receiptData.dueDate}
              </div>
            </div>
            
            <div class="receipt-total">
              <strong>Receipt Total</strong> <span class="total-amount">₱${receiptData.total.toFixed(2)}</span>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th>UNIT PRICE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${receiptData.items.map(item => `
                  <tr>
                    <td>${item.qty}</td>
                    <td><strong>${item.description}</strong></td>
                    <td class="currency">₱${item.unitPrice.toFixed(2)}</td>
                    <td class="currency">₱${item.amount.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="summary">
              <p><strong>Subtotal:</strong> <span class="currency">₱${receiptData.subtotal.toFixed(2)}</span></p>
              <p><strong>Sales Tax 12%:</strong> <span class="currency">₱${receiptData.tax.toFixed(2)}</span></p>
              <p><strong>Total:</strong> <span class="total-amount">₱${receiptData.total.toFixed(2)}</span></p>
            </div>
            
            <div class="payment-info">
              <strong style="color: #d97706;">PAYMENT INSTRUCTIONS</strong><br>
              <strong>PayPal:</strong> payment@altamedia.com<br>
              <strong>Bank Transfer:</strong> BDO Account #010730012<br>
              <strong>GCash:</strong> 0917-123-4567
            </div>
            
            <div class="terms">
              <strong>TERMS & CONDITIONS</strong><br>
              Payment is due within 15 days from receipt date.<br>
              Please make checks payable to: Alta Media Inc.<br>
              For questions, contact: support@altamedia.com
            </div>
          </body>
          </html>
        `;

        downloadFile(pdfHTML, `receipt-${receiptData.receiptNumber}.pdf`, 'application/pdf');
        toast.success("PDF receipt downloaded successfully!");
        break;

      case 'png':
        toast.info("Generating PNG image... This may take a moment.");

        // Create a canvas element to generate PNG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 1200;

        // Set background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text styles
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ALTA MEDIA RECEIPT', canvas.width / 2, 50);

        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.fillText('Professional Digital Marketing Services', canvas.width / 2, 70);

        // Company info
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(receiptData.company, canvas.width / 2, 100);

        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.fillText(receiptData.address, canvas.width / 2, 120);

        // Receipt details
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('RECEIPT #', 50, 160);
        ctx.fillText('RECEIPT DATE', 50, 180);
        ctx.fillText('DUE DATE', 50, 200);

        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(receiptData.receiptNumber, 150, 160);
        ctx.fillText(receiptData.receiptDate, 150, 180);
        ctx.fillText(receiptData.dueDate, 150, 200);

        // Total
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`₱${receiptData.total.toFixed(2)}`, canvas.width - 50, 240);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt-${receiptData.receiptNumber}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("PNG receipt downloaded successfully!");
        }, 'image/png');
        break;

      case 'jpeg':
        toast.info("Generating JPEG image... This may take a moment.");

        // Create a canvas element to generate JPEG
        const jpegCanvas = document.createElement('canvas');
        const jpegCtx = jpegCanvas.getContext('2d');
        jpegCanvas.width = 800;
        jpegCanvas.height = 1200;

        // Set background
        jpegCtx.fillStyle = 'white';
        jpegCtx.fillRect(0, 0, jpegCanvas.width, jpegCanvas.height);

        // Set text styles
        jpegCtx.fillStyle = '#3b82f6';
        jpegCtx.font = 'bold 24px Arial';
        jpegCtx.textAlign = 'center';
        jpegCtx.fillText('ALTA MEDIA RECEIPT', jpegCanvas.width / 2, 50);

        jpegCtx.fillStyle = '#6b7280';
        jpegCtx.font = '14px Arial';
        jpegCtx.fillText('Professional Digital Marketing Services', jpegCanvas.width / 2, 70);

        // Company info
        jpegCtx.fillStyle = 'black';
        jpegCtx.font = 'bold 16px Arial';
        jpegCtx.textAlign = 'center';
        jpegCtx.fillText(receiptData.company, jpegCanvas.width / 2, 100);

        jpegCtx.fillStyle = '#6b7280';
        jpegCtx.font = '12px Arial';
        jpegCtx.fillText(receiptData.address, jpegCanvas.width / 2, 120);

        // Receipt details
        jpegCtx.fillStyle = '#3b82f6';
        jpegCtx.font = 'bold 12px Arial';
        jpegCtx.textAlign = 'left';
        jpegCtx.fillText('RECEIPT #', 50, 160);
        jpegCtx.fillText('RECEIPT DATE', 50, 180);
        jpegCtx.fillText('DUE DATE', 50, 200);

        jpegCtx.fillStyle = 'black';
        jpegCtx.font = '12px Arial';
        jpegCtx.fillText(receiptData.receiptNumber, 150, 160);
        jpegCtx.fillText(receiptData.receiptDate, 150, 180);
        jpegCtx.fillText(receiptData.dueDate, 150, 200);

        // Total
        jpegCtx.fillStyle = '#059669';
        jpegCtx.font = 'bold 20px Arial';
        jpegCtx.textAlign = 'right';
        jpegCtx.fillText(`₱${receiptData.total.toFixed(2)}`, jpegCanvas.width - 50, 240);

        // Convert canvas to blob and download
        jpegCanvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt-${receiptData.receiptNumber}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("JPEG receipt downloaded successfully!");
        }, 'image/jpeg', 0.9);
        break;

      default:
        toast.error("Invalid format selected");
    }
  };

  const handleShareDetails = () => {
    // Generate shareable link or copy to clipboard
    const shareData = {
      title: 'Package Details - Alta Media',
      text: `Check out my package: ${packageData.name} - ${packageData.description}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      toast.success("Package details link copied to clipboard!");
    }
  };

  const handleContactSupport = () => {
    // Close the current modal first
    onClose();
    // Open Messages component
    if (onOpenMessages) {
      onOpenMessages('human'); // Open human support by default
    }
  };

  const [selectedAddon, setSelectedAddon] = useState(null);
  const [showAddonDetails, setShowAddonDetails] = useState(false);
  const [showManageAddons, setShowManageAddons] = useState(false);

  const handleAddonAction = (addon, action) => {
    switch (action) {
      case 'view':
        setSelectedAddon(addon);
        setShowAddonDetails(true);
        break;
      case 'contact':
        toast.info(`Interested in ${addon.name}? Please contact us for pricing and availability.`);
        // Open contact information
        window.open('tel:+639171234567', '_blank');
        break;
      case 'info':
        toast.info(`${addon.name} - Contact us for custom pricing and implementation details.`);
        break;
    }
  };

  const handleManageAddons = () => {
    setShowManageAddons(true);
    toast.info("Opening Addon Management...");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-6xl h-[90vh] ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl flex flex-col`}>

        {/* Addon Details Modal */}
        {showAddonDetails && selectedAddon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedAddon.name} Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddonDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</span>
                  <span className={`font-bold text-lg ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {selectedAddon.price}
                  </span>
                </div>

                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Description</span>
                  <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedAddon.description}
                  </p>
                </div>

                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Details</span>
                  <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedAddon.details}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
                  <Badge className={getStatusColor(selectedAddon.status)}>
                    {selectedAddon.status}
                  </Badge>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddonDetails(false)}
                  className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleAddonAction(selectedAddon, 'contact');
                    setShowAddonDetails(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Addons Modal */}
        {showManageAddons && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-4xl max-h-[90vh] ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl flex flex-col`}>
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Manage Addons
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Configure and manage your addon services
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowManageAddons(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="space-y-6">
                  {/* Addon Management Overview */}
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                    <CardHeader>
                      <CardTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Settings className="w-5 h-5 mr-2" />
                        Addon Management Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {packageData.addons.length}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Addons
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {packageData.addons.filter(a => a.status === 'Available').length}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Available
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {packageData.addons.filter(a => a.status === 'Removed').length}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Removed
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Addon List */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      All Addons
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {packageData.addons.map((addon, index) => (
                        <Card key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col h-full`}>
                          <CardContent className="p-4 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-3 flex-shrink-0">
                              <div className="flex-1 min-w-0 pr-3">
                                <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm leading-tight`}>
                                  {addon.name}
                                </h5>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 leading-relaxed`}>
                                  {addon.description}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>
                                  {addon.price}
                                </p>
                                <Badge className={`mt-1 ${getStatusColor(addon.status)} text-xs`}>
                                  {addon.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-auto pt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddonAction(addon, 'view')}
                                className="flex-1 h-8 text-xs border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddonAction(addon, 'info')}
                                className="flex-1 h-8 text-xs border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Info
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAddonAction(addon, 'contact')}
                                className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Package Details
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              {packageData.description}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareDetails}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Invoice
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <DropdownMenuItem
                  onClick={() => handleDownloadInvoice('html')}
                  className={`${isDarkMode ? 'text-white hover:bg-blue-900/20' : 'text-gray-900 hover:bg-blue-50'}`}
                >
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Download as HTML
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownloadInvoice('csv')}
                  className={`${isDarkMode ? 'text-white hover:bg-blue-900/20' : 'text-gray-900 hover:bg-blue-50'}`}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownloadInvoice('pdf')}
                  className={`${isDarkMode ? 'text-white hover:bg-blue-900/20' : 'text-gray-900 hover:bg-blue-50'}`}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownloadInvoice('png')}
                  className={`${isDarkMode ? 'text-white hover:bg-blue-900/20' : 'text-gray-900 hover:bg-blue-50'}`}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownloadInvoice('jpeg')}
                  className={`${isDarkMode ? 'text-white hover:bg-blue-900/20' : 'text-gray-900 hover:bg-blue-50'}`}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Download as JPEG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Tabs */}
          <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
            {['overview', 'features', 'analytics', 'addons'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab
                    ? `${isDarkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}`
                    : `${isDarkMode ? 'text-gray-400 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'}`
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Package Overview */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                    <CardHeader>
                      <CardTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Package className="w-5 h-5 mr-2" />
                        Package Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {packageData.name}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            {packageData.description}
                          </p>
                          <div className="flex items-center mt-3">
                            <Badge className={getStatusColor(packageData.status)}>
                              {packageData.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Monthly Price
                            </span>
                            <span className={`font-semibold text-blue-600 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {packageData.price}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Original Value
                            </span>
                            <span className={`text-sm line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {packageData.originalPrice}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              You Save
                            </span>
                            <span className={`font-semibold text-green-600 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {packageData.savings}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Next Billing
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {packageData.nextBilling}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleUpgradePackage}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Upgrade Package
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleContactSupport}
                      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>

                {/* Analytics Summary */}
                <div className="space-y-4">
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                    <CardHeader>
                      <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Analytics Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total Value
                        </span>
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {packageData.analytics.totalValue}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Monthly Savings
                        </span>
                        <span className={`font-semibold text-green-600 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {packageData.analytics.monthlySavings}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Services Used
                        </span>
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {packageData.analytics.servicesUsed}/{packageData.analytics.totalServices}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Satisfaction
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className={`ml-1 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {packageData.analytics.satisfaction}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Package Features
                  </h3>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {packageData.features.length} Features
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageData.features.map((feature, index) => (
                    <Card key={index} className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                              {feature.icon}
                            </div>
                            <div>
                              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {feature.name}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {feature.cost}
                            </p>
                            <Badge className={`mt-1 ${getStatusColor(feature.status)}`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(feature.status)}
                                <span>{feature.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                        {feature.usage !== undefined && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{feature.usage}%</span>
                            </div>
                            <Progress value={feature.usage} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
                          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {packageData.analytics.totalValue}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Savings</p>
                          <p className={`text-xl font-bold text-green-600 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {packageData.analytics.monthlySavings}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Services Used</p>
                          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {packageData.analytics.servicesUsed}/{packageData.analytics.totalServices}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Usage Chart Placeholder */}
                <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                  <CardHeader>
                    <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Service Usage Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`h-64 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Usage analytics chart coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'addons' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Available Addons
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageAddons}
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Addons
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packageData.addons.map((addon, index) => (
                    <Card key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col h-full`}>
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3 flex-shrink-0">
                          <div className="flex-1 min-w-0 pr-3">
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm leading-tight`}>
                              {addon.name}
                            </h4>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 leading-relaxed`}>
                              {addon.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>
                              {addon.price}
                            </p>
                            <Badge className={`mt-1 ${getStatusColor(addon.status)} text-xs`}>
                              {addon.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-auto pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddonAction(addon, 'view')}
                            className="flex-1 h-8 text-xs border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddonAction(addon, 'info')}
                            className="flex-1 h-8 text-xs border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Info
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddonAction(addon, 'contact')}
                            className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 