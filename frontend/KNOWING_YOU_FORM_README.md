# Knowing You Form – Alta Media

## Overview

The "Knowing You Form – Alta Media" is a comprehensive 11-step branding questionnaire designed to gather detailed information about businesses to create perfect brand identities. This form is built using React with Tailwind CSS and integrates seamlessly with the existing alta-flow project structure.

## Features

### Form Structure
- **11 Progressive Steps**: Each step focuses on a specific aspect of the business
- **Visual Progress Indicator**: Shows current step and overall progress
- **Back/Next Navigation**: Easy navigation between steps
- **Form Validation**: Required field validation
- **Conditional Fields**: Dynamic fields that appear based on previous answers

### Step-by-Step Breakdown

1. **Business Basics**
   - What are you building? (Business/Company or Specific Product/Service)
   - Business Email
   - Proventous ID (conditional)
   - Full Business Name

2. **About Your Business**
   - Contact information
   - Industry/Niche
   - Business history
   - Team description
   - Current customers
   - Target audience

3. **Audience Clarity**
   - Target market analysis
   - Current market analysis
   - Customer behavior patterns

4. **Team & Culture**
   - Company culture description
   - Team traditions and activities

5. **Brand Identity**
   - Brand reasoning
   - Brand personality
   - Brand ideas and concepts

6. **Visual Direction**
   - Logo preferences
   - Color preferences
   - Design style preferences
   - Visual inspiration

7. **Collateral Needs**
   - Brand kit usage
   - Required brand elements
   - File format preferences

8. **Business Goals**
   - Short-term and long-term goals
   - Success metrics
   - Vision statements

9. **AI-Powered Insights**
   - AI-suggested content for key fields
   - Business descriptions
   - Mission statements
   - Core values

10. **Wrap-Up**
    - Additional notes
    - Timeline requirements
    - Approval process

11. **Upload References**
    - Reference materials
    - Inspiration files

### Technical Features

- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Full dark mode compatibility
- **AI Integration**: AI suggestion buttons for enhanced content
- **File Upload**: Support for reference materials
- **Color Picker**: Visual color selection
- **Tag Input**: Dynamic tag management
- **Form Persistence**: Data maintained across navigation

## Usage

### Accessing the Form

1. Navigate to `/know-your-form` in the application
2. The form will load with the first step visible
3. Complete each step using the Next/Back buttons
4. Submit the form on the final step

### Form Components

The form uses several reusable components:

- `FormField`: Wrapper for form inputs with labels and validation
- `TagInput`: Dynamic tag management with suggestions
- `ColorPicker`: Visual color selection with presets
- `FileUpload`: File upload with drag-and-drop support
- `AISuggestion`: AI-powered content suggestions
- `ProgressBar`: Visual progress indicator

### Data Structure

The form collects data in a structured format:

```javascript
{
  // Business Basics
  buildingType: "business" | "product",
  businessEmail: "string",
  hasProventousId: "yes" | "no",
  proventousId: "string",
  businessName: "string",
  
  // About Your Business
  contactNumber: "string",
  preferredContact: "email" | "phone" | "messenger" | "other",
  industry: ["string"],
  yearStarted: "string",
  primaryLocation: "string",
  behindBrand: "string",
  currentCustomers: ["string"],
  wantToAttract: "string",
  teamDescription: "string",
  
  // ... additional fields for all 11 steps
}
```

## Integration

### With Existing Project

The form integrates with the existing alta-flow project:

- Uses existing UI components from `@/components/ui/`
- Follows existing routing patterns
- Maintains consistent styling with the project
- Uses existing authentication and protection

### File Structure

```
src/
├── components/
│   ├── form/
│   │   ├── KnowingYouForm.jsx          # Main form component
│   │   ├── FormField.jsx               # Form field wrapper
│   │   ├── TagInput.jsx                # Tag input component
│   │   ├── ColorPicker.jsx             # Color picker component
│   │   ├── FileUpload.jsx              # File upload component
│   │   ├── AISuggestion.jsx            # AI suggestion component
│   │   └── ProgressBar.jsx             # Progress indicator
│   └── ui/                             # Existing UI components
├── pages/
│   ├── KnowingYouFormPage.jsx          # Page wrapper
│   └── index.jsx                       # Updated routing
```

## Customization

### Adding New Fields

To add new fields to any step:

1. Add the field to the `formData` state
2. Create the field in the appropriate `renderStep` function
3. Use the existing form components for consistency

### Modifying Steps

To modify existing steps:

1. Locate the appropriate `renderStep` function
2. Add or modify fields as needed
3. Update the `formData` state structure

### Styling

The form uses Tailwind CSS classes and follows the existing design system:

- Blue and gold color theme
- Consistent spacing and typography
- Responsive design patterns
- Dark mode support

## Future Enhancements

Potential improvements for the form:

1. **Backend Integration**: Connect to a backend API for data storage
2. **Real AI Integration**: Replace mock AI suggestions with actual AI service
3. **Form Analytics**: Track form completion rates and user behavior
4. **Export Functionality**: Export form data in various formats
5. **Template System**: Create form templates for different business types
6. **Multi-language Support**: Add internationalization support

## Troubleshooting

### Common Issues

1. **Form not loading**: Check that all required components are imported
2. **Styling issues**: Ensure Tailwind CSS is properly configured
3. **Navigation problems**: Verify routing is correctly set up
4. **AI suggestions not working**: Check that the AISuggestion component is properly configured

### Development

To run the form in development:

```bash
npm run dev
```

Navigate to `http://localhost:5173/know-your-form`

## Support

For issues or questions about the Knowing You Form, refer to the main project documentation or contact the development team. 