import apiService from './api';

/**
 * Form Export Utilities
 * Handles exporting form data to various formats (PDF, JSON, etc.)
 */
export const formExportUtils = {
  /**
   * Generate PDF from form data using jsPDF
   * @param {Object} formData - The form data to export
   * @param {string} formType - Type of form (brandkit, productservice, organization, knowingyou)
   * @param {string} filename - Name of the file to save
   */
  generatePDF: async (formData, formType, filename) => {
    try {
      // Dynamic import of jsPDF to avoid bundle size issues
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Set up the document
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${formType.toUpperCase()} FORM DATA`, 20, 30);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      let yPosition = 50;
      const lineHeight = 7;
      const pageHeight = 280;
      let currentPage = 1;

      // Helper function to add text with page breaks
      const addTextWithPageBreak = (text, x, y) => {
        if (y > pageHeight) {
          doc.addPage();
          currentPage++;
          y = 20;
        }
        doc.text(text, x, y);
        return y + lineHeight;
      };

      // Helper function to format field names
      const formatFieldName = (fieldName) => {
        return fieldName
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      // Helper function to format field values
      const formatFieldValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (Array.isArray(value)) return value.join(', ');
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
      };

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        // Skip internal fields
        if (['id', 'user_id', 'created_at', 'updated_at', 'current_step', 'progress_percentage', 'is_completed'].includes(key)) {
          return;
        }

        const fieldName = formatFieldName(key);
        const fieldValue = formatFieldValue(value);

        // Add field name
        doc.setFont('helvetica', 'bold');
        yPosition = addTextWithPageBreak(`${fieldName}:`, 20, yPosition);

        // Add field value (with word wrapping)
        doc.setFont('helvetica', 'normal');
        const words = fieldValue.split(' ');
        let line = '';
        let xOffset = 30;

        words.forEach(word => {
          const testLine = line + word + ' ';
          const testWidth = doc.getTextWidth(testLine);
          
          if (testWidth > 160) { // Max width for text
            yPosition = addTextWithPageBreak(line, xOffset, yPosition);
            line = word + ' ';
          } else {
            line = testLine;
          }
        });

        if (line) {
          yPosition = addTextWithPageBreak(line, xOffset, yPosition);
        }

        yPosition += 5; // Add extra space between fields
      });

      // Add footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 10);
      doc.text(`Page ${currentPage}`, 180, pageHeight - 10);

      // Save the PDF
      doc.save(`${filename}.pdf`);

      return { success: true, filename: `${filename}.pdf` };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  },

  /**
   * Export form data as JSON file
   * @param {Object} formData - The form data to export
   * @param {string} filename - Name of the file to save
   */
  exportAsJSON: (formData, filename) => {
    try {
      const dataStr = JSON.stringify(formData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `${filename}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
      
      return { success: true, filename: `${filename}.json` };
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw new Error('Failed to export JSON');
    }
  },

  /**
   * Export form data as CSV file
   * @param {Object} formData - The form data to export
   * @param {string} filename - Name of the file to save
   */
  exportAsCSV: (formData, filename) => {
    try {
      // Convert object to CSV format
      const headers = Object.keys(formData).filter(key => 
        !['id', 'user_id', 'created_at', 'updated_at'].includes(key)
      );
      
      const csvContent = [
        headers.join(','),
        headers.map(header => {
          const value = formData[header];
          if (value === null || value === undefined) return '';
          if (Array.isArray(value)) return `"${value.join('; ')}"`;
          if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      ].join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `${filename}.csv`;
      link.click();
      
      URL.revokeObjectURL(link.href);
      
      return { success: true, filename: `${filename}.csv` };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw new Error('Failed to export CSV');
    }
  },

  /**
   * Download consolidated form data for a user
   * @param {number} userId - User ID
   * @param {string} format - Export format (pdf, json, csv)
   */
  downloadConsolidatedForms: async (userId, format = 'pdf') => {
    try {
      const response = await apiService.exportAllFormsData(userId, format);
      
      if (response.success) {
        // Handle different response formats
        if (format === 'pdf' && response.data?.pdfUrl) {
          // Download PDF from URL
          const link = document.createElement('a');
          link.href = response.data.pdfUrl;
          link.download = `consolidated_forms_${userId}.pdf`;
          link.click();
        } else if (format === 'json') {
          // Export as JSON
          formExportUtils.exportAsJSON(response.data, `consolidated_forms_${userId}`);
        } else if (format === 'csv') {
          // Export as CSV
          formExportUtils.exportAsCSV(response.data, `consolidated_forms_${userId}`);
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to export forms');
      }
    } catch (error) {
      console.error('Error downloading consolidated forms:', error);
      throw error;
    }
  },

  /**
   * Download specific form data
   * @param {number} userId - User ID
   * @param {string} formType - Form type (brandkit, productservice, organization, knowingyou)
   * @param {string} format - Export format (pdf, json, csv)
   */
  downloadFormData: async (userId, formType, format = 'pdf') => {
    try {
      const response = await apiService.downloadFormData(userId, formType, format);
      
      if (response.success) {
        // Handle different response formats
        if (format === 'pdf' && response.data?.pdfUrl) {
          const link = document.createElement('a');
          link.href = response.data.pdfUrl;
          link.download = `${formType}_form_${userId}.pdf`;
          link.click();
        } else if (format === 'json') {
          formExportUtils.exportAsJSON(response.data, `${formType}_form_${userId}`);
        } else if (format === 'csv') {
          formExportUtils.exportAsCSV(response.data, `${formType}_form_${userId}`);
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to export form');
      }
    } catch (error) {
      console.error('Error downloading form data:', error);
      throw error;
    }
  }
};

export default formExportUtils;
