# Brand Kit Form Fields Summary

This document contains all the form field names extracted from the Forms.jsx file, organized by step for easy database setup.

## Step 1: Business Type & Email Collection
- `businessType` - Dropdown (business/product)

## Step 2: Welcome & Identity Verification
- `businessEmail` - Text (required)
- `hasProventousID` - Dropdown (yes/no)
- `proventousID` - Text (conditional)
- `businessName` - Text (required)

## Step 3: About Your Business
- `phoneNumber` - Text
- `preferredContactMethod` - Dropdown (email/phone/messenger/other)
- `industry` - Tags array (required)
- `yearStarted` - Dropdown (required)
- `mainLocation` - Text (required)
- `missionStatement` - Long text (with AI suggestions)
- `visionStatement` - Long text (with AI suggestions)
- `coreValues` - Tags array (with AI suggestions)
- `businessStage` - Dropdown
- `brandDescription` - Text (with AI suggestions)
- `buyerType` - Checkbox array
- `targetAudience` - Long text (required)
- `spendingType` - Dropdown (required)
- `secondaryAudience` - Long text

## Step 4: Audience Clarity

### Section A: Target Market
- `desiredFeeling` - Dropdown (required)
- `audienceInterests` - Tags array (with AI suggestions)
- `professions` - Tags array
- `preferredPlatforms` - Tags array
- `ageGroups` - Checkbox array

### Section B: Current Market
- `currentAudienceInterests` - Tags array (with AI suggestions)
- `spendingHabits` - Tags array
- `audienceBehaviors` - Tags array (with AI suggestions)
- `interactionModes` - Checkbox array
- `customerPainPoints` - Long text
- `purchaseMotivators` - Long text (with AI suggestions)
- `emotionalGoal` - Dropdown

## Step 5: Brand Identity
- `brandOwner` - Long text
- `whyStarted` - Long text (with AI suggestions)
- `reasonsExist1` - Text
- `reasonsExist2` - Text
- `reasonsExist3` - Text
- `brandSoul` - Text
- `brandPersonality` - Tags array (with AI suggestions)
- `brandVoice` - Checkbox array
- `admireBrand1` - Long text
- `admireBrand2` - Long text
- `admireBrand3` - Long text
- `stylesToAvoid` - Long text

## Step 6: Visual Preferences
- `existingLogo` - Dropdown (required)
- `logoAction` - Checkbox array (conditional)
- `brandColors` - Color picker array
- `colorsToAvoid` - Color picker array
- `fontPreferences` - Checkbox array
- `designStyle` - Checkbox array
- `logoStyle` - Checkbox array
- `imageryStyle` - Checkbox array
- `designInspiration` - File upload

## Step 7: Collateral Needs
- `usageChannels` - Checkbox array (required)
- `brandElementsNeeded` - Checkbox array (required)
- `fileFormatsNeeded` - Checkbox array (required)

## Step 8: Business Goals & Vision
- `goalThisYear` - Text (required)
- `otherShortTermGoals` - Long text
- `threeToFiveYearVision` - Text
- `additionalMidTermGoals` - Long text
- `longTermVision` - Long text
- `keyMetrics` - Checkbox array

## Step 9: Team Culture
- `companyCulture` - Tags array
- `cultureDescription` - Long text
- `internalRituals` - Long text (with AI suggestions)

## Step 10: Wrap-Up
- `additionalNotes` - Long text
- `timeline` - Dropdown
- `decisionMakers` - Text

## Step 11: Uploads & Reference
- `referenceMaterials` - File upload

## Step 12: Final Review
- No new fields (summary view only)

## Field Types Summary

### Text Fields (VARCHAR/TEXT)
- `businessEmail`
- `proventousID`
- `businessName`
- `phoneNumber`
- `mainLocation`
- `brandDescription`
- `targetAudience`
- `secondaryAudience`
- `reasonsExist1`
- `reasonsExist2`
- `reasonsExist3`
- `brandSoul`
- `goalThisYear`
- `threeToFiveYearVision`
- `decisionMakers`

### Long Text Fields (TEXT)
- `missionStatement`
- `visionStatement`
- `customerPainPoints`
- `purchaseMotivators`
- `brandOwner`
- `whyStarted`
- `admireBrand1`
- `admireBrand2`
- `admireBrand3`
- `stylesToAvoid`
- `otherShortTermGoals`
- `additionalMidTermGoals`
- `longTermVision`
- `cultureDescription`
- `internalRituals`
- `additionalNotes`

### Dropdown Fields (ENUM)
- `businessType` - business/product
- `hasProventousID` - yes/no
- `preferredContactMethod` - email/phone/messenger/other
- `yearStarted` - 2000-2025
- `businessStage` - startup/growing/established/mature
- `spendingType` - budget-conscious/value-seeking/premium
- `desiredFeeling` - happy/fulfilled/inspired/satisfied/energized/empowered/safe-secure/confident
- `emotionalGoal` - same as desiredFeeling
- `existingLogo` - yes/no
- `timeline` - within-1-month/1-2-months/2-3-months/flexible

### Array Fields (TEXT[])
- `industry` - Tags
- `coreValues` - Tags
- `buyerType` - Checkbox array
- `audienceInterests` - Tags
- `professions` - Tags
- `preferredPlatforms` - Tags
- `ageGroups` - Checkbox array
- `currentAudienceInterests` - Tags
- `spendingHabits` - Tags
- `audienceBehaviors` - Tags
- `interactionModes` - Checkbox array
- `brandPersonality` - Tags
- `brandVoice` - Checkbox array
- `logoAction` - Checkbox array
- `brandColors` - Color codes
- `colorsToAvoid` - Color codes
- `fontPreferences` - Checkbox array
- `designStyle` - Checkbox array
- `logoStyle` - Checkbox array
- `imageryStyle` - Checkbox array
- `usageChannels` - Checkbox array
- `brandElementsNeeded` - Checkbox array
- `fileFormatsNeeded` - Checkbox array
- `keyMetrics` - Checkbox array
- `companyCulture` - Tags

### File Upload Fields (TEXT)
- `designInspiration` - File upload or links
- `referenceMaterials` - File upload or links

## Database Column Mapping

When creating the database schema, map the field names as follows:

```sql
-- Convert camelCase to snake_case
businessType -> business_type
businessEmail -> business_email
hasProventousID -> has_proventous_id
proventousID -> proventous_id
businessName -> business_name
phoneNumber -> phone_number
preferredContactMethod -> preferred_contact_method
yearStarted -> year_started
mainLocation -> main_location
missionStatement -> mission_statement
visionStatement -> vision_statement
coreValues -> core_values
businessStage -> business_stage
brandDescription -> brand_description
buyerType -> buyer_type
targetAudience -> target_audience
spendingType -> spending_type
secondaryAudience -> secondary_audience
desiredFeeling -> desired_feeling
audienceInterests -> audience_interests
currentAudienceInterests -> current_audience_interests
spendingHabits -> spending_habits
audienceBehaviors -> audience_behaviors
interactionModes -> interaction_modes
customerPainPoints -> customer_pain_points
purchaseMotivators -> purchase_motivators
emotionalGoal -> emotional_goal
brandOwner -> brand_owner
whyStarted -> why_started
reasonsExist1 -> reasons_exist1
reasonsExist2 -> reasons_exist2
reasonsExist3 -> reasons_exist3
brandSoul -> brand_soul
brandPersonality -> brand_personality
brandVoice -> brand_voice
admireBrand1 -> admire_brand1
admireBrand2 -> admire_brand2
admireBrand3 -> admire_brand3
stylesToAvoid -> styles_to_avoid
existingLogo -> existing_logo
logoAction -> logo_action
brandColors -> brand_colors
colorsToAvoid -> colors_to_avoid
fontPreferences -> font_preferences
designStyle -> design_style
logoStyle -> logo_style
imageryStyle -> imagery_style
designInspiration -> design_inspiration
usageChannels -> usage_channels
brandElementsNeeded -> brand_elements_needed
fileFormatsNeeded -> file_formats_needed
goalThisYear -> goal_this_year
otherShortTermGoals -> other_short_term_goals
threeToFiveYearVision -> three_to_five_year_vision
additionalMidTermGoals -> additional_mid_term_goals
longTermVision -> long_term_vision
keyMetrics -> key_metrics
companyCulture -> company_culture
cultureDescription -> culture_description
internalRituals -> internal_rituals
additionalNotes -> additional_notes
decisionMakers -> decision_makers
referenceMaterials -> reference_materials
```

## Total Field Count
- **Total Fields**: 77 fields across 12 steps
- **Text Fields**: 15
- **Long Text Fields**: 16
- **Dropdown Fields**: 10
- **Array Fields**: 25
- **File Upload Fields**: 2
- **Required Fields**: 9
- **Conditional Fields**: 2
- **AI Suggestion Fields**: 8 