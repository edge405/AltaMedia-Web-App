# Deliverable Version Tracking Setup Guide

## Quick Setup

### 1. Run Database Migration

```bash
cd backend
node run-version-migration.js
```

This will:
- Add `version_number` column to deliverables table
- Create performance index
- Set existing records to version 1
- Add documentation comment

### 2. Verify Installation

```bash
node test-version-tracking.js
```

This will test:
- Column existence and configuration
- Data migration status
- Version numbering logic
- Query performance
- Index creation

### 3. Restart Backend Server

```bash
npm start
```

## What's Changed

### Backend Changes

1. **Database Schema**
   - Added `version_number` column to deliverables table
   - Created performance index for efficient queries

2. **Controller Updates** (`deliverableController.js`)
   - `uploadDeliverable`: Now creates new versions with incremented numbers
   - `updateDeliverable`: Creates new version instead of updating existing
   - Added new functions for version history and latest versions
   - Updated existing functions to handle versioning

3. **Route Updates** (`deliverableRoutes.js`)
   - Added new endpoints for version history
   - Added latest version endpoints
   - Updated existing route descriptions

### Frontend Changes

1. **Admin Revisions Page** (`AdminRevisions.jsx`)
   - Added version column to display version numbers
   - Added version history button and modal
   - Enhanced UI to show version information
   - Added version history viewing functionality

## New API Endpoints

### Admin Endpoints
- `GET /api/deliverables/admin/:purchaseId/latest` - Latest versions only
- `GET /api/deliverables/admin/:purchaseId/:featureName/history` - Version history

### Client Endpoints  
- `GET /api/deliverables/:purchaseId/:featureName/history` - Client version history

## Version Numbering Logic

- **First upload**: `version_number = 1`
- **Subsequent uploads**: `version_number = max_version + 1`
- **Updates**: Create new version instead of modifying existing

## Benefits

✅ **Complete Audit Trail**: Every version is preserved  
✅ **No Data Loss**: Updates create new versions, never overwrite  
✅ **Easy Access**: Latest version queries for regular use  
✅ **Full History**: Complete version history when needed  
✅ **Performance**: Optimized queries with proper indexing  

## Testing

After setup, test the system by:

1. **Uploading a deliverable** - Should create version 1
2. **Updating the deliverable** - Should create version 2
3. **Viewing version history** - Should show all versions
4. **Checking latest version** - Should show only the newest

## Troubleshooting

### Migration Issues
```bash
# Check if column exists
mysql -e "DESCRIBE deliverables;" your_database

# Manual migration if needed
mysql -e "ALTER TABLE deliverables ADD COLUMN version_number int(11) NOT NULL DEFAULT 1 AFTER feature_name;" your_database
```

### Version Number Issues
```bash
# Check version distribution
mysql -e "SELECT feature_name, COUNT(*) as versions, MAX(version_number) as latest FROM deliverables GROUP BY feature_name;" your_database
```

### Performance Issues
```bash
# Check if index exists
mysql -e "SHOW INDEX FROM deliverables WHERE Key_name = 'idx_deliverables_purchase_version';" your_database
```

## Support

For issues or questions:
1. Check the comprehensive documentation: `DELIVERABLE_VERSION_TRACKING.md`
2. Run the test script: `node test-version-tracking.js`
3. Review the migration logs for any errors

---

**Note**: This system is backward compatible. Existing code will continue to work, but will now benefit from version tracking.
