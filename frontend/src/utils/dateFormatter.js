export const formatDate = (dateString, format = 'MM/DD/YYYY') => {
    const date = new Date(dateString);
    
    switch (format) {
      case 'MM/DD/YYYY':
        return date.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return date.toLocaleDateString('en-GB');
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      default:
        return date.toLocaleDateString('en-US');
    }
  };