# Package Purchase Features Status Update API Documentation

## Overview

This document describes the API endpoints and functionality for updating feature statuses within package purchases. The system allows users to manage the status of individual features within their purchased packages, providing independent control over feature states per purchase.

## API Endpoints

### Update Feature Status in Package Purchase

**Endpoint:** `PUT /api/package-purchases/:id/features/:featureId/status`

**Description:** Updates the status of a specific feature within a package purchase.

**Authentication:** Required (JWT Token)

**Authorization:** User can only update features in their own package purchases

---

## Request Details

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | Package purchase ID |
| `featureId` | Integer | Feature ID within the package purchase |

### Request Body

```json
{
  "status": "active"
}
```

### Status Values

| Status | Description |
|--------|-------------|
| `active` | Feature is active and available |
| `inactive` | Feature is temporarily disabled |
| `pending` | Feature is in development/queue |
| `deprecated` | Feature is no longer supported |

---

## Response Details

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Feature status updated successfully",
  "data": {
    "package_purchase_id": 14,
    "updated_feature": {
      "feature_id": 16,
      "feature_name": "Dashboard",
      "feature_description": null,
      "status": "active",
      "is_active": true,
      "created_at": "2025-08-06T04:38:32.123496",
      "purchase_date": "2025-08-11T04:59:56.796Z",
      "updated_at": "2025-08-11T05:30:00.000Z"
    },
    "features": [
      {
        "feature_id": 16,
        "feature_name": "Dashboard",
        "feature_description": null,
        "status": "active",
        "is_active": true,
        "created_at": "2025-08-06T04:38:32.123496",
        "purchase_date": "2025-08-11T04:59:56.796Z",
        "updated_at": "2025-08-11T05:30:00.000Z"
      }
    ]
  }
}
```

### Error Responses

#### Invalid Status

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Invalid status. Must be one of: active, inactive, pending, deprecated"
}
```

#### Package Purchase Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Package purchase not found"
}
```

#### Feature Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "message": "Feature not found in this purchase"
}
```

#### Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Implementation Details

### Database Schema

The feature statuses are stored in the `package_purchases` table within the `features` JSONB column:

```sql
CREATE TABLE package_purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  expiration_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  features JSONB, -- Stores feature data with statuses
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Feature JSON Structure

```json
{
  "feature_id": 16,
  "feature_name": "Dashboard",
  "feature_description": "Analytics dashboard access",
  "status": "pending",
  "is_active": true,
  "created_at": "2025-08-06T04:38:32.123496",
  "purchase_date": "2025-08-11T04:59:56.796Z",
  "updated_at": "2025-08-11T05:30:00.000Z"
}
```

### Controller Function

**File:** `backend/src/controllers/packagePurchaseController.js`

**Function:** `updatePurchaseFeatureStatus`

```javascript
const updatePurchaseFeatureStatus = async (req, res) => {
  try {
    const { id: purchaseId, featureId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'deprecated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, inactive, pending, deprecated'
      });
    }

    // Get the current package purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('package_purchases')
      .select('*')
      .eq('id', purchaseId)
      .eq('user_id', userId)
      .single();

    if (purchaseError || !purchase) {
      return res.status(404).json({
        success: false,
        message: 'Package purchase not found'
      });
    }

    // Update the specific feature status in the features JSON
    const features = purchase.features || [];
    const featureIndex = features.findIndex(f => f.feature_id === parseInt(featureId));
    
    if (featureIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found in this purchase'
      });
    }

    // Update the feature status
    features[featureIndex].status = status;
    features[featureIndex].updated_at = new Date().toISOString();

    // Update the package purchase with modified features
    const { data: updatedPurchase, error: updateError } = await supabase
      .from('package_purchases')
      .update({
        features: features,
        updated_at: new Date().toISOString()
      })
      .eq('id', purchaseId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update feature status',
        error: updateError.message
      });
    }

    res.json({
      success: true,
      message: 'Feature status updated successfully',
      data: {
        package_purchase_id: updatedPurchase.id,
        updated_feature: features[featureIndex],
        features: updatedPurchase.features
      }
    });

  } catch (error) {
    console.error('Update feature status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
```

### Route Configuration

**File:** `backend/src/routes/packagePurchaseRoutes.js`

```javascript
/**
 * @route   PUT /api/package-purchases/:id/features/:featureId/status
 * @desc    Update feature status in a package purchase
 * @access  Private
 */
router.put('/:id/features/:featureId/status', authenticateToken, updatePurchaseFeatureStatus);
```

---

## Usage Examples

### cURL Example

```bash
curl -X PUT \
  http://localhost:3000/api/package-purchases/14/features/16/status \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "active"
  }'
```

### JavaScript Example

```javascript
const updateFeatureStatus = async (purchaseId, featureId, status) => {
  try {
    const response = await fetch(`/api/package-purchases/${purchaseId}/features/${featureId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Feature status updated successfully:', data.data);
    } else {
      console.error('Failed to update feature status:', data.message);
    }
  } catch (error) {
    console.error('Error updating feature status:', error);
  }
};
```

---

## Security Considerations

### Authentication
- All requests require a valid JWT token
- Token must be included in the Authorization header

### Authorization
- Users can only update features in their own package purchases
- System validates user ownership before allowing updates

### Input Validation
- Status values are strictly validated against allowed values
- Feature existence is verified before updates
- Purchase existence and ownership are verified

### Data Integrity
- Updates are atomic operations
- Feature data structure is preserved
- Timestamps are automatically updated

---

## Error Handling

### Validation Errors
- Invalid status values return 400 Bad Request
- Missing required parameters return 400 Bad Request

### Authorization Errors
- Unauthorized requests return 401 Unauthorized
- Access to other users' purchases returns 404 Not Found

### Resource Errors
- Non-existent purchases return 404 Not Found
- Non-existent features return 404 Not Found

### Server Errors
- Database errors return 500 Internal Server Error
- Unexpected errors are logged and return 500 Internal Server Error

---

## Testing

### Test File
**File:** `backend/test-package-purchases-status-update.js`

### Test Coverage
- ✅ Valid status updates
- ✅ Invalid status rejection
- ✅ Non-existent feature handling
- ✅ Non-existent purchase handling
- ✅ Authorization validation
- ✅ Response format validation

### Running Tests

```bash
cd backend
node test-package-purchases-status-update.js
```

---

## Related Endpoints

- `GET /api/package-purchases` - Get user's package purchases with features
- `GET /api/package-purchases/:id` - Get specific package purchase details
- `POST /api/package-purchases` - Create new package purchase with features

---

## Changelog

### Version 1.0.0
- Initial implementation of feature status update functionality
- Added PUT endpoint for updating feature statuses
- Implemented validation and error handling
- Added comprehensive testing suite

---

## Support

For questions or issues related to this API, please refer to:
- Backend documentation: `backend/docs/`
- API testing files: `backend/test-*.js`
- Controller implementation: `backend/src/controllers/packagePurchaseController.js`
